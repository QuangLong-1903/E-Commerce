# E-Commerce Platform - Complete Documentation

## 📋 Project Overview

This is a full-stack e-commerce platform built with modern technologies, featuring a responsive frontend and powerful backend API. The platform supports both customers and administrators with complete product management, order handling, and user authentication.

### Tech Stack

**Frontend:**
- React 18+ with Hooks
- Redux Toolkit for state management
- React Router v6 for navigation
- Axios for API communication
- Tailwind CSS for responsive UI
- React Hot Toast for notifications
- Heroicons for icons

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- Passport.js for OAuth integration
- JWT for authentication
- Cloudinary for image uploads
- BCrypt for password hashing

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (React)                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │           User Interface Components              │  │
│  │  - Pages (Home, Shop, Checkout, Admin)          │  │
│  │  - Layouts (Main, Admin)                        │  │
│  │  - Common Components (Header, Footer, Cards)    │  │
│  └──────────────────────────────────────────────────┘  │
│                          ↕                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │         State Management (Redux Toolkit)         │  │
│  │  - Auth Slice (User state, tokens)             │  │
│  │  - Product Slice (Products, filters)           │  │
│  │  - Cart Slice (Cart items, totals)             │  │
│  │  - Order Slice (Orders data)                   │  │
│  │  - Category Slice (Categories)                 │  │
│  └──────────────────────────────────────────────────┘  │
│                          ↕                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │         API Service Layer (Axios)               │  │
│  │  - Token management & refresh                   │  │
│  │  - Request/Response interceptors                │  │
│  │  - Error handling                              │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
                          ↕ HTTP/REST
┌────────────────────────────────────────────────────────┐
│                 API GATEWAY LAYER                       │
│            (Express.js with Middleware)                │
│  - CORS • Rate Limiting • Auth Verification           │
│  - Input Validation • Error Handling                   │
└────────────────────────────────────────────────────────┘
                          ↕
┌────────────────────────────────────────────────────────┐
│               APPLICATION LAYER                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │            Route Handlers                        │ │
│  │  - auth.routes.js                              │ │
│  │  - product.routes.js                           │ │
│  │  - cart.routes.js                              │ │
│  │  - order.routes.js                             │ │
│  │  - category.routes.js                          │ │
│  │  - user.routes.js                              │ │
│  └──────────────────────────────────────────────────┘ │
│                          ↕                             │
│  ┌──────────────────────────────────────────────────┐ │
│  │         Business Logic Layer                    │ │
│  │  (Controllers & Service Methods)                │ │
│  │  - Authentication Logic                        │ │
│  │  - Product Operations                          │ │
│  │  - Order Processing                            │ │
│  │  - Cart Management                             │ │
│  └──────────────────────────────────────────────────┘ │
│                          ↕                             │
│  ┌──────────────────────────────────────────────────┐ │
│  │         Data Access Layer                       │ │
│  │  (Mongoose Models & Schemas)                    │ │
│  │  - User.js  • Product.js                        │ │
│  │  - Category.js • Cart.js  • Order.js            │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
                          ↕
┌────────────────────────────────────────────────────────┐
│             PERSISTENCE LAYER                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │         MongoDB Database                         │ │
│  │  - Collections: users, products, carts,         │ │
│  │    orders, categories, reviews                  │ │
│  └──────────────────────────────────────────────────┘ │
│                          ↕                             │
│  ┌──────────────────────────────────────────────────┐ │
│  │    External Services & Storage                  │ │
│  │  - Cloudinary (Image Storage & CDN)             │ │
│  │  - Google OAuth (Authentication)                │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
project-root/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js       # Cloudinary configuration
│   │   ├── db.js               # MongoDB connection
│   │   └── passport.js         # Passport OAuth setup
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── cart.controller.js
│   │   ├── order.controller.js
│   │   ├── category.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   ├── auth.js            # JWT and role verification
│   │   ├── validate.js        # Input validation
│   │   └── errorHandler.js    # Centralized error handling
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── cart.routes.js
│   │   ├── order.routes.js
│   │   ├── category.routes.js
│   │   ├── user.routes.js
│   │   └── upload.routes.js
│   ├── server.js
│   ├── seeder.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.js
│   │   │   │   ├── Footer.js
│   │   │   │   ├── ProductCard.js
│   │   │   │   └── Loading.js
│   │   │   ├── guards/
│   │   │   │   ├── PrivateRoute.js
│   │   │   │   ├── AdminRoute.js
│   │   │   │   └── GuestRoute.js
│   │   │   └── layouts/
│   │   │       ├── MainLayout.js
│   │   │       └── AdminLayout.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── ShopPage.js
│   │   │   ├── CategoriesPage.js
│   │   │   ├── ProductPage.js
│   │   │   ├── CartPage.js
│   │   │   ├── CheckoutPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── GoogleCallback.js
│   │   │   ├── ProfilePage.js
│   │   │   ├── OrdersPage.js
│   │   │   ├── OrderDetailPage.js
│   │   │   └── admin/
│   │   │       ├── Dashboard.js
│   │   │       ├── Products.js
│   │   │       ├── ProductForm.js
│   │   │       ├── Categories.js
│   │   │       ├── Orders.js
│   │   │       └── Users.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── store/
│   │   │   ├── index.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── cartSlice.js
│   │   │       ├── productSlice.js
│   │   │       ├── categorySlice.js
│   │   │       └── orderSlice.js
│   │   ├── i18n/
│   │   │   ├── I18nContext.js
│   │   │   ├── index.js
│   │   │   └── translations/
│   │   │       ├── en.json
│   │   │       └── vi.json
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   └── tailwind.config.js
```

## 🔄 Data Flow Diagrams

### User Authentication Flow
```
User Registration/Login
        ↓
   Frontend Form
        ↓
   API Request (Axios)
        ↓
Backend Auth Controller
        ↓
Validate Input
        ↓
Database Check (MongoDB)
        ↓
Password Hash/Compare (BCrypt)
        ↓
Generate JWT Tokens
        ↓
Store Refresh Token in DB
        ↓
Return Tokens to Client
        ↓
Store in localStorage
        ↓
Update Redux Auth State
        ↓
Redirect to Dashboard
```

### Product Purchase Flow
```
Browse Products → Select Product → Add to Cart
        ↓
Redux Cart State Updated
        ↓
POST /api/cart/items
        ↓
Validate Stock
        ↓
Update Cart in DB
        ↓
View Cart
        ↓
Proceed to Checkout
        ↓
Enter Shipping Address
        ↓
POST /api/orders
        ↓
Validate Items & Stock
        ↓
Create Order Document
        ↓
Update Product Stock
        ↓
Clear User Cart
        ↓
Order Confirmation
        ↓
View Order Details
```

### Image Upload Flow
```
Admin Selects Images
        ↓
Frontend: Multiple File Input
        ↓
FormData Object Created
        ↓
POST /api/products/:id/images
        ↓
Backend: Multer + Cloudinary
        ↓
Cloudinary Upload API
        ↓
Return Image URLs
        ↓
Store in Product Document
        ↓
Update UI with Images
```

## 🚀 Getting Started

### Prerequisites
- Node.js v14+
- MongoDB
- Cloudinary account
- Google OAuth credentials

### Backend Setup

1. **Clone and navigate:**
```bash
cd backend
npm install
```

2. **Create .env file:**
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE=30d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

3. **Run backend:**
```bash
npm run dev
```

### Frontend Setup

1. **Navigate and install:**
```bash
cd frontend
npm install
```

2. **Create .env file:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

3. **Start frontend:**
```bash
npm start
```

## 🔐 Authentication System

### JWT Token Flow
```
┌─────────────────────────────────────────┐
│      User Credentials (Email/Pass)      │
└──────────────────┬──────────────────────┘
                   ↓
        ┌──────────────────────┐
        │ Authenticate User    │
        │ (BCrypt Compare)     │
        └──────────┬───────────┘
                   ↓
        ┌──────────────────────────────────┐
        │ Generate Tokens                  │
        ├──────────────────────────────────┤
        │ Access Token                     │
        │ - 7 day expiration               │
        │ - Used for API requests          │
        │                                  │
        │ Refresh Token                    │
        │ - 30 day expiration              │
        │ - Stored in DB                   │
        │ - Used to get new access token   │
        └──────────┬───────────────────────┘
                   ↓
        ┌──────────────────────┐
        │ Client stores tokens │
        │ in localStorage      │
        └──────────┬───────────┘
                   ↓
        ┌──────────────────────┐
        │ Access Token expires │
        │ (401 response)       │
        └──────────┬───────────┘
                   ↓
        ┌──────────────────────────────────┐
        │ Send Refresh Token to endpoint   │
        │ /api/auth/refresh-token         │
        └──────────┬───────────────────────┘
                   ↓
        ┌──────────────────────────────────┐
        │ Verify Refresh Token             │
        │ Generate New Access Token        │
        │ Generate New Refresh Token       │
        │ (Rotation for security)          │
        └──────────┬───────────────────────┘
                   ↓
        ┌──────────────────────┐
        │ Client updates tokens│
        │ Retry original API   │
        └──────────────────────┘
```

### Google OAuth Flow
```
┌─────────────────────────┐
│  User clicks "Login with Google"
└────────────────┬────────┘
                 ↓
    ┌────────────────────────┐
    │ Redirect to Google     │
    │ OAuth endpoint         │
    └────────────┬───────────┘
                 ↓
    ┌──────────────────────────────┐
    │ User grants permission       │
    │ Google returns auth code     │
    └────────────┬────────────────┘
                 ↓
    ┌──────────────────────────────┐
    │ Redirect to callback URL     │
    │ /api/auth/google/callback    │
    └────────────┬────────────────┘
                 ↓
    ┌──────────────────────────────┐
    │ Passport.js handles callback │
    │ (GoogleStrategy)             │
    └────────────┬────────────────┘
                 ↓
    ┌──────────────────────────────┐
    │ Check if user exists         │
    │ (by googleId or email)       │
    └────────────┬────────────────┘
                 ↓
    ┌──────────────────────────────┐
    │ If not exists: Create user   │
    │ If exists: Link account      │
    └────────────┬────────────────┘
                 ↓
    ┌──────────────────────────────┐
    │ Generate JWT tokens          │
    │ Save refresh token in DB     │
    └────────────┬────────────────┘
                 ↓
    ┌──────────────────────────────┐
    │ Redirect to frontend with    │
    │ tokens as URL params         │
    └────────────┬────────────────┘
                 ↓
    ┌──────────────────────────────┐
    │ Frontend stores tokens       │
    │ Redirects to dashboard       │
    └──────────────────────────────┘
```

### Login Methods
1. **Email/Password**: Standard email + password authentication with bcrypt hashing
2. **Google OAuth 2.0**: Single sign-on via Google
3. **Auto-refresh**: Automatic token refresh on 401 responses

## 📊 Database Schema

### Database Schema Relationships

```
User (1) ──────────────── (Many) Order
  │                              │
  │                              ├─ OrderItems (ref Product)
  │                              └─ ShippingAddress
  │
  ├────────────────────────────────┤
  │                                │
  │                                ▼
  │                           Product
  │                        (Referenced by)
  │                    ┌────────┬────────┐
  │                    ▼        ▼        ▼
  │              OrderItems CartItems Reviews
  │                    │        │        │
  │                    └────────┴────────┘
  │
  └─ Cart (1) ──────────────── (Many) CartItems
                                        │
                                        └─ (ref Product)

Category (1) ─────────────── (Many) Product
     │
     └─ (self-reference for hierarchy)

User (1) ─────────────── (Many) Review
     │                           │
     └─ (in Product.reviews)─────┘
```

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'admin',
  avatar: String (URL),
  phone: String,
  address: {
    street, city, state, zipCode, country
  },
  googleId: String (optional),
  isEmailVerified: Boolean,
  isActive: Boolean,
  refreshToken: String,
  timestamps: true
}
```

### Product Model
```javascript
{
  name: String,
  slug: String (unique),
  description: String,
  price: Number,
  comparePrice: Number,
  images: [{
    url: String,
    publicId: String (Cloudinary),
    isMain: Boolean
  }],
  category: ObjectId (ref: Category),
  stock: Number,
  sold: Number,
  reviews: [{
    user: ObjectId,
    rating: Number (1-5),
    comment: String
  }],
  rating: Number,
  numReviews: Number,
  brand: String,
  tags: [String],
  specifications: [{key, value}],
  isFeatured: Boolean,
  isActive: Boolean,
  timestamps: true
}
```

### Cart Model
```javascript
{
  user: ObjectId (ref: User, unique),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  totalItems: Number,
  totalPrice: Number,
  timestamps: true
}
```

### Order Model
```javascript
{
  user: ObjectId (ref: User),
  orderNumber: String (unique),
  items: [{
    product: ObjectId,
    name: String,
    image: String,
    price: Number,
    quantity: Number
  }],
  shippingAddress: {
    fullName, phone, street, city, state, zipCode, country
  },
  paymentMethod: 'cod' | 'bank_transfer' | 'credit_card' | 'momo' | 'zalopay',
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded',
  itemsPrice: Number,
  shippingPrice: Number,
  taxPrice: Number,
  totalPrice: Number,
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  statusHistory: [{status, note, updatedAt, updatedBy}],
  timestamps: true
}
```

### Category Model
```javascript
{
  name: String (unique),
  slug: String (unique),
  description: String,
  image: {url, publicId},
  parent: ObjectId (ref: Category, optional),
  isActive: Boolean,
  timestamps: true
}
```

## �️ Middleware Pipeline

### Request Processing Order
```
1. CORS Middleware
   ↓
2. Body Parser (JSON/URL-encoded)
   ↓
3. Static Files (if any)
   ↓
4. Passport Initialize (for OAuth)
   ↓
5. Route Matching
   ↓
6. Route-specific Middleware:
   a. Authentication (protect)
   b. Authorization (admin)
   c. Input Validation
   ↓
7. Controller Execution
   ↓
8. Response
   ↓
9. Error Handler (catches all errors)
```

## 🔌 Complete API Endpoints

### API Architecture - Layered Request Flow
```
HTTP Request
    ↓
Express Router (Routes)
    ↓
Middleware Stack:
├─ CORS
├─ JSON Parser
├─ Token Extractor
└─ Route Matcher
    ↓
Authentication Middleware (if needed)
    ├─ Verify JWT
    ├─ Fetch User
    └─ Check Role
    ↓
Validation Middleware
    ├─ Validate Input
    ├─ Check Business Rules
    └─ Sanitize Data
    ↓
Controller Function
    ├─ Process Request
    ├─ Call Service/Model Methods
    └─ Prepare Response
    ↓
Database Operations
    ├─ Query/Create
    ├─ Update
    └─ Delete
    ↓
Response Builder
    ├─ Format Data
    ├─ Set Status Code
    └─ Add Headers
    ↓
Error Handler (if error)
    ├─ Log Error
    ├─ Format Error
    └─ Send Error Response
    ↓
HTTP Response
```

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/featured` - Get featured products
- `GET /api/products/slug/:slug` - Get product by slug
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` (Admin) - Create product
- `PUT /api/products/:id` (Admin) - Update product
- `DELETE /api/products/:id` (Admin) - Delete product
- `POST /api/products/:id/images` (Admin) - Upload images
- `DELETE /api/products/:id/images/:imageId` (Admin) - Delete image
- `PUT /api/products/:id/images/:imageId/main` (Admin) - Set main image
- `POST /api/products/:id/reviews` - Add review

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add to cart
- `PUT /api/cart/items/:productId` - Update cart item
- `DELETE /api/cart/items/:productId` - Remove from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/admin/all` (Admin) - Get all orders
- `GET /api/orders/admin/stats` (Admin) - Get order statistics

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/tree` - Get category tree
- `POST /api/categories` (Admin) - Create category
- `PUT /api/categories/:id` (Admin) - Update category
- `DELETE /api/categories/:id` (Admin) - Delete category

### Users
- `GET /api/users` (Admin) - Get all users
- `PATCH /api/users/:id/toggle-status` (Admin) - Toggle user status
- `PATCH /api/users/:id/toggle-role` (Admin) - Toggle user role

## 👥 Features by Role

### Customer Features
- ✅ Browse products with filters and search
- ✅ View product details with reviews and ratings
- ✅ Add products to cart with quantity selection
- ✅ Persistent cart storage in database
- ✅ Update and remove cart items
- ✅ Place orders with shipping address
- ✅ Choose payment method
- ✅ View order history and details
- ✅ Cancel pending/confirmed orders
- ✅ Leave product reviews and ratings
- ✅ Update profile and address
- ✅ Change password
- ✅ Login via email or Google

### Admin Features
- ✅ Dashboard with key statistics
- ✅ Revenue tracking and analytics
- ✅ Product management (CRUD)
- ✅ Multiple image uploads to Cloudinary
- ✅ Category management
- ✅ Order management and tracking
- ✅ User management and role assignment
- ✅ Product stock monitoring
- ✅ Order status updates
- ✅ Featured product management

## 🔒 Security Features

1. **Password Hashing**: BCrypt with salt
2. **JWT Authentication**: Secure token-based auth
3. **Refresh Token Rotation**: New refresh tokens on each refresh
4. **Role-based Access Control**: Admin vs User roles
5. **Input Validation**: Express-validator middleware
6. **CORS Protection**: Configured for frontend domain
7. **Error Handling**: Centralized error middleware
8. **Image Security**: Cloudinary validation and limits
9. **Account Status**: Ability to deactivate accounts

## 📈 Performance Optimizations

1. **Database Indexing**: Optimized queries with proper indexes
2. **Pagination**: Efficient data loading with limits
3. **Image Optimization**: Cloudinary transformations
4. **Lazy Loading**: React components with code splitting
5. **Caching**: Client-side token caching
6. **Aggregation Pipelines**: MongoDB aggregation for analytics

## 🎨 UI/UX Features

- Responsive Tailwind CSS design
- Loading skeletons for better UX
- Toast notifications for feedback
- Search and filter functionality
- Pagination controls
- Mobile-friendly navigation
- Error handling and validation
- Empty state messages
- Product image galleries

## 📝 Key Functionalities

### Product Management
- Full CRUD operations
- Multiple image uploads
- Main image selection
- Product specifications and tags
- Stock management
- Price comparison display
- Discount percentage calculation
- Review and rating system

### Order Management
- Automatic order numbering
- Stock update on order creation
- Order status tracking with history
- Payment status management
- Shipping cost calculation
- Tax calculation
- Order cancellation with stock restoration

### Cart Management
- Persistent storage in database
- Real-time total calculations
- Stock validation
- Duplicate item handling
- Quantity updates

### Authentication
- Email verification support
- Refresh token management
- Session persistence
- Logout functionality
- Google OAuth integration
- Role-based route protection

## 🚢 Deployment Considerations

1. **Environment Variables**: Use `.env` in production
2. **Database**: Use MongoDB Atlas or similar service
3. **API**: Deploy backend to Heroku, Railway, or similar
4. **Frontend**: Deploy to Vercel, Netlify, or similar
5. **Media**: Use Cloudinary for image hosting
6. **CORS**: Update FRONTEND_URL in production
7. **SSL**: Ensure HTTPS in production

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or connection string is correct

### Cloudinary Issues
- Verify API credentials are correct
- Check folder permissions
- Ensure file size is within limits

### Google OAuth Error
- Verify callback URL matches in Google Console
- Check client ID and secret

### CORS Issues
- Ensure FRONTEND_URL matches your frontend domain
- Check API request headers

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Passport.js](http://www.passportjs.org/)

## 📄 License

This project is open-source and available under the MIT License.

## 👨‍💻 Development Notes

### Code Standards
- Use ES6+ syntax
- Follow RESTful API conventions
- Use descriptive variable names
- Add error handling for all operations
- Validate input data

### Testing
- Test API endpoints with Postman
- Test authentication flows
- Test role-based access control
- Test error scenarios

### Git Workflow
- Create feature branches for new features
- Write descriptive commit messages
- Submit pull requests for review
- Keep main branch stable

## 🎯 Future Enhancements

- Payment gateway integration (Stripe, PayPal)
- Email notifications
- SMS notifications
- Advanced analytics and reporting
- Wishlist functionality
- Product recommendations
- User reviews moderation
- Inventory management
- Multi-language support
- Mobile app (React Native)

---

**Last Updated**: January 2026
**Version**: 1.0.0
