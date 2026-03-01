const cloudinary = require('cloudinary').v2;
const CloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Configure Cloudinary storage for multer
let storage;
if (process.env.CLOUDINARY_CLOUD_NAME) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      // Determine folder based on field name or route
      let folder = 'ecommerce/products';
      if (file.fieldname === 'avatar' || req.path.includes('/auth/')) {
        folder = 'ecommerce/avatars';
      }
      
      return {
        folder: folder,
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [{ width: 400, height: 400, crop: 'fill' }],
      };
    },
  });
} else {
  // Fallback: use disk storage if Cloudinary not configured
  // Store uploads to ./uploads/products so controller can read file.path
  const path = require('path');
  const fs = require('fs');
  const productsDir = path.join(__dirname, '..', 'uploads', 'products');
  if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, productsDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = file.originalname.split('.').pop();
      cb(null, `${uniqueSuffix}.${ext}`);
    },
  });
}

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Function to delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    // If Cloudinary is configured, use its API to destroy
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    }

    // If Cloudinary not configured, attempt to delete local fallback file
    const fs = require('fs');
    const path = require('path');
    const localPaths = [
      path.join(__dirname, '..', 'uploads', 'products', publicId),
      path.join(__dirname, '..', 'uploads', publicId),
    ];

    for (const p of localPaths) {
      if (fs.existsSync(p)) {
        fs.unlinkSync(p);
        return { result: 'deleted_local', path: p };
      }
    }

    // If file not found locally, return a not-found result
    return { result: 'not_found' };
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

// Function to upload image directly
const uploadImage = async (filePath, folder = 'ecommerce/products') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      transformation: [{ width: 800, height: 800, crop: 'limit' }],
    });
    return result;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

// Upload from buffer (useful when multer.memoryStorage is used)
const uploadBuffer = (buffer, folder = 'ecommerce/avatars') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, transformation: [{ width: 400, height: 400, crop: 'fill' }] },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

module.exports = {
  cloudinary,
  upload,
  deleteImage,
  uploadImage,
  uploadBuffer,
};
