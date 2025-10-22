# Cherish India E-Commerce Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas)
- Git

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Setup environment variables
# Copy .env.example to .env and update values
cp .env.example .env

# Seed the database with sample data
npm run seed

# Start the development server
npm run dev
```

The backend server will start on http://localhost:5000

### 2. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on http://localhost:5173

## 🗄️ Database

### MongoDB Collections

1. **users** - User accounts and profiles
2. **products** - Product catalog
3. **orders** - Order management

### Sample Data

Run the seed script to populate with sample data:
```bash
cd server
npm run seed
```

**Test Credentials:**
- Admin: `admin@cherishindia.com` / `admin123`
- User: `john@example.com` / `user123`

## 📊 MongoDB Playground

Use the `playground-1.mongodb.js` file in VS Code with MongoDB extension to:
- Explore data
- Run analytics queries
- Test database operations
- Monitor performance

## 🔧 Features Implemented

### Backend Features
- ✅ JWT Authentication
- ✅ User Management (Registration, Login, Profile)
- ✅ Product Management (CRUD, Categories, Reviews)
- ✅ Order Management (Create, Track, Update Status)
- ✅ Role-based Authorization (Admin/User)
- ✅ Data Validation and Error Handling
- ✅ MongoDB with Mongoose ODM
- ✅ RESTful API Design

### Frontend Features
- ✅ Redux Toolkit State Management
- ✅ React Router Navigation
- ✅ Authentication Pages (Login/Register)
- ✅ Product Listing and Detail Pages
- ✅ Shopping Cart with Local Storage
- ✅ Responsive Design with Tailwind CSS
- ✅ shadcn/ui Components
- ✅ Real-time API Integration

### E-Commerce Requirements Compliance
- ✅ User Authentication (JWT)
- ✅ Product Browsing
- ✅ Product Details View
- ✅ Shopping Cart Management
- ✅ Order Placement
- ✅ Admin Panel
- ✅ Category Filtering
- ✅ Search Functionality

## 🛠️ Development

### Backend Scripts
```bash
npm run dev        # Start development server with nodemon
npm start          # Start production server
npm run seed       # Seed database with sample data
```

### Frontend Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get products (with filtering)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders/:id/cancel` - Cancel order
- `PUT /api/orders/:id/status` - Update order status (Admin)

## 🔒 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/cherishindia
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Cherish India
```

## 🧪 Testing

### Manual Testing Checklist

1. **Authentication**
   - [ ] User registration
   - [ ] User login/logout
   - [ ] JWT token validation
   - [ ] Protected routes

2. **Products**
   - [ ] Product listing
   - [ ] Product search
   - [ ] Category filtering
   - [ ] Product details
   - [ ] Product reviews

3. **Shopping Cart**
   - [ ] Add to cart
   - [ ] Update quantities
   - [ ] Remove items
   - [ ] Cart persistence

4. **Orders**
   - [ ] Order placement
   - [ ] Order history
   - [ ] Order status updates
   - [ ] Order cancellation

5. **Admin Features**
   - [ ] Product management
   - [ ] Order management
   - [ ] User management

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Configure MongoDB Atlas (recommended)
3. Deploy to services like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Update `VITE_API_BASE_URL` to production API
2. Build the application: `npm run build`
3. Deploy to Vercel, Netlify, or similar

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔄 State Management

Using Redux Toolkit with slices for:
- Authentication state
- Product catalog
- Shopping cart
- Order management

## 🎨 UI/UX

- Modern design with shadcn/ui components
- Consistent color scheme
- Intuitive navigation
- Loading states and error handling
- Toast notifications

## 📋 TODO for Production

- [ ] Add payment gateway integration (Razorpay/Stripe)
- [ ] Implement email notifications
- [ ] Add image upload functionality
- [ ] Set up logging and monitoring
- [ ] Add unit and integration tests
- [ ] Implement rate limiting
- [ ] Add data backup strategy
- [ ] Set up CI/CD pipeline

## 🐛 Troubleshooting

### Common Issues

1. **Connection refused errors**
   - Ensure MongoDB is running
   - Check connection string in .env

2. **CORS errors**
   - Verify CLIENT_URL in backend .env
   - Check VITE_API_BASE_URL in frontend .env

3. **Module not found errors**
   - Run `npm install` in both directories
   - Clear node_modules and reinstall if needed

4. **JWT authentication fails**
   - Check JWT_SECRET is set
   - Verify token storage in localStorage

## 📞 Support

For issues or questions, refer to:
- MongoDB documentation
- React documentation
- Node.js/Express documentation
- Tailwind CSS documentation