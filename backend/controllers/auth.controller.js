const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../middleware/auth');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  console.log('=== REGISTER REQUEST RECEIVED ===');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Origin:', req.headers.origin);
  console.log('==================================');

  const { name, email, password } = req.body;

  console.log('Register attempt:', { name, email, password: password ? '***' : 'empty' });

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    console.log('User already exists:', email);
    throw new AppError('User already exists with this email', 400);
  }

  try {
    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    console.log('User created successfully:', user._id);

    if (user) {
      // Generate tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Save refresh token to database
      user.refreshToken = refreshToken;
      await user.save();

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          },
          accessToken,
          refreshToken,
        },
      });
    } else {
      console.log('User creation failed - no user returned');
      throw new AppError('Invalid user data', 400);
    }
  } catch (error) {
    console.error('User creation error:', error);
    throw error;
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:', { email, password: password ? '***' : 'empty' });

  // Find user and include password
  const user = await User.findOne({ email }).select('+password');

  console.log('User found:', user ? { _id: user._id, email: user.email, hasPassword: !!user.password } : 'null');

  if (!user) {
    console.log('User not found');
    throw new AppError('Invalid email or password', 401);
  }

  // Check if user has password (might be Google-only account)
  if (!user.password) {
    console.log('User has no password');
    throw new AppError('Please login using Google', 401);
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  console.log('Password match result:', isMatch);

  if (!isMatch) {
    console.log('Password does not match');
    throw new AppError('Invalid email or password', 401);
  }

  // Check if user is active
  if (!user.isActive) {
    console.log('User is not active');
    throw new AppError('Your account has been deactivated', 401);
  }

  console.log('Generating tokens...');

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  console.log('Tokens generated, saving refresh token...');

  // Save refresh token to database
  user.refreshToken = refreshToken;
  await user.save();

  console.log('Login successful, sending response');

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    },
  });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw new AppError('Refresh token is required', 401);
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(token);
  if (!decoded) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  // Find user and verify refresh token matches
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    throw new AppError('Invalid refresh token', 401);
  }

  // Generate new tokens
  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  // Update refresh token in database
  user.refreshToken = newRefreshToken;
  await user.save();

  res.json({
    success: true,
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  // Clear refresh token in database
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    data: {
      user,
    },
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, street, city, state, zipCode, country } = req.body;

  // Debug: log incoming body and file when in development
  if (process.env.NODE_ENV === 'development') {
    console.log('updateProfile called. body:', req.body);
    console.log('updateProfile file:', req.file ? { originalname: req.file.originalname, path: req.file.path, hasBuffer: !!req.file.buffer } : null);
  }

  const user = await User.findById(req.user._id);

  if (user) {
    user.name = name || user.name;
    user.phone = phone || user.phone;
    
    // Update address
    if (street || city || state || zipCode || country) {
      user.address = {
        street: street || user.address?.street,
        city: city || user.address?.city,
        state: state || user.address?.state,
        zipCode: zipCode || user.address?.zipCode,
        country: country || user.address?.country,
      };
    }

    // Update avatar if file is uploaded
    if (req.file) {
      // If CloudinaryStorage used, multer will set req.file.path
      if (req.file.path) {
        user.avatar = req.file.path;
      } else if (req.file.buffer) {
        // If memoryStorage used, upload buffer to cloudinary (if configured)
        const { uploadBuffer } = require('../config/cloudinary');
        try {
          const uploadResult = await uploadBuffer(req.file.buffer, 'ecommerce/avatars');
          if (uploadResult && (uploadResult.secure_url || uploadResult.url)) {
            user.avatar = uploadResult.secure_url || uploadResult.url;
          }
        } catch (err) {
          console.error('Avatar upload failed:', err);
          // continue without blocking profile update
        }
      }
    }

    let updatedUser;
    try {
      updatedUser = await user.save();
    } catch (saveErr) {
      console.error('Failed to save user in updateProfile:', saveErr);
      throw saveErr;
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser,
      },
    });
  } else {
    throw new AppError('User not found', 404);
  }
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!user.password) {
    throw new AppError('Cannot change password for Google-only account', 400);
  }

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 401);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Generate new tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully',
    data: {
      accessToken,
      refreshToken,
    },
  });
});

// @desc    Google OAuth callback handler
// @route   GET /api/auth/google/callback
// @access  Public
const googleCallback = asyncHandler(async (req, res) => {
  const user = req.user;

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  // Redirect to frontend with tokens
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.redirect(
    `${frontendUrl}/auth/google/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
  );
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  updateProfile,
  changePassword,
  googleCallback,
};
