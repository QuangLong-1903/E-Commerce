# 🚀 Quick Start Guide

## Installation & Setup (5 minutes)

### Backend Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment variables** (create `.env`):
```env
# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRE=30d

# Server
PORT=5000
NODE_ENV=development
# For production, set this to your deployed frontend URL
FRONTEND_URL=https://e-commerce-flame-gamma-96.vercel.app

# Cloudinary (get from cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth (get from Google Console)
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

3. **Start backend:**
```bash
npm run dev
```
✅ Backend running at `http://localhost:5000`

### Frontend Setup

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Configure environment variables** (create `.env`):
```env
REACT_APP_API_URL=https://e-commerce-flame-gamma-96.vercel.app
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

3. **Start frontend:**
```bash
npm start
```
✅ Frontend running at `https://e-commerce-flame-gamma-96.vercel.app`

## 📱 Access Points

| Component | URL | Purpose |
|-----------|-----|---------|
| Frontend | https://e-commerce-flame-gamma-96.vercel.app | User interface |
| API | http://localhost:5000/api | Backend API |
| Home | https://e-commerce-flame-gamma-96.vercel.app | Browse products |
| Shop | https://e-commerce-flame-gamma-96.vercel.app/shop | Advanced search |
| Cart | https://e-commerce-flame-gamma-96.vercel.app/cart | Shopping cart |
| Checkout | https://e-commerce-flame-gamma-96.vercel.app/checkout | Place order |
| Profile | https://e-commerce-flame-gamma-96.vercel.app/profile | User account |
| Admin | https://e-commerce-flame-gamma-96.vercel.app/admin | Admin dashboard |

## 👤 Test Credentials

### Create Test Admin
```javascript
// Database: Register or update user
{
  name: "Admin User",
  email: "admin@example.com",
  password: "admin123",
  role: "admin"
}
```

### Create Test Customer
```javascript
{
  name: "Test User",
  email: "user@example.com",
  password: "user123",
  role: "user"
}
```

## 🧪 Quick Testing

### 1. Authentication Flow
```bash
# Register
POST http://localhost:5000/api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123"
}

# Login
POST http://localhost:5000/api/auth/login
{
  "email": "test@example.com",
  "password": "test123"
}
```

### 2. Product Management
```bash
# Get all products
GET http://localhost:5000/api/products

# Get featured products
GET http://localhost:5000/api/products/featured

# Create product (Admin only)
POST http://localhost:5000/api/products
Headers: Authorization: Bearer {token}
{
  "name": "Product Name",
  "description": "Description",
  "price": 100000,
  "category": "category_id",
  "stock": 50
}
```

### 3. Cart Operations
```bash
# Add to cart
POST http://localhost:5000/api/cart/items
Headers: Authorization: Bearer {token}
{
  "productId": "product_id",
  "quantity": 1
}

# Get cart
GET http://localhost:5000/api/cart
Headers: Authorization: Bearer {token}

# Update cart item
PUT http://localhost:5000/api/cart/items/product_id
Headers: Authorization: Bearer {token}
{
  "quantity": 2
}
```

### 4. Order Creation
```bash
# Create order
POST http://localhost:5000/api/orders
Headers: Authorization: Bearer {token}
{
  "shippingAddress": {
    "fullName": "Customer Name",
    "phone": "0123456789",
    "street": "123 Street",
    "city": "Ho Chi Minh",
    "country": "Vietnam"
  },
  "paymentMethod": "cod"
}
```

## 🗂️ Seed Sample Data

```bash
cd backend
npm run seed
```

This will create:
- ✅ Sample categories
- ✅ Sample products
- ✅ Sample users
- ✅ Sample reviews

## 📊 Admin Dashboard Access

1. Login with admin account
2. Navigate to `/admin`
3. Access:
   - **Dashboard**: Overview and statistics
   - **Products**: CRUD operations
   - **Categories**: Manage categories
   - **Orders**: View and manage orders
   - **Users**: Manage user roles and status

## 🔍 Common Issues & Solutions

### Issue: MongoDB connection failed
```bash
# Solution: Start MongoDB
# macOS
brew services start mongodb-community

# Windows
# Use MongoDB Compass or start service

# Or use MongoDB Atlas (cloud)
```

### Issue: Cloudinary upload fails
```bash
# Solution: Verify credentials in .env
# Get from: https://cloudinary.com/console
```

### Issue: Google OAuth callback error
```bash
# Solution: 
# 1. Verify callback URL in Google Console
# 2. Check GOOGLE_CALLBACK_URL in .env
# 3. Ensure it matches exactly
```

### Issue: CORS errors
```bash
# Solution: Check FRONTEND_URL in backend .env
# Should be: https://e-commerce-flame-gamma-96.vercel.app
```

## 🛠️ Useful Commands

```bash
# Backend
npm run dev          # Start with nodemon
npm start            # Start production
npm run seed         # Seed database

# Frontend
npm start            # Start dev server
npm run build        # Production build
npm test             # Run tests
```

## 📚 File Locations

| File | Location |
|------|----------|
| Backend Config | `backend/.env` |
| Frontend Config | `frontend/.env` |
| Backend Routes | `backend/routes/` |
| Controllers | `backend/controllers/` |
| Models | `backend/models/` |
| Frontend Pages | `frontend/src/pages/` |
| Redux Slices | `frontend/src/store/slices/` |
| Components | `frontend/src/components/` |

## 🎯 Next Steps

1. ✅ Start both servers
2. ✅ Register a test account
3. ✅ Create a category and product (Admin)
4. ✅ Add product to cart
5. ✅ Place an order
6. ✅ View order in profile

## 📞 API Testing Tools

- **Postman**: API testing with GUI
- **cURL**: Command line API testing
- **Thunder Client**: VS Code extension
- **Insomnia**: REST client

## 🚀 Deployment

See [README.md](./README.md) for deployment considerations.

## 💡 Tips

- Keep both servers running in separate terminals
- Use Redux DevTools browser extension for state debugging
- Check browser console for frontend errors
- Check backend console for server errors
- Use Postman for testing API before frontend

---

**Happy coding! 🎉**
