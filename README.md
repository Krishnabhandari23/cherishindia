# Cherish India E-Commerce Platform

A modern, full-stack e-commerce application built with React, Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/cherish-india.git
cd cherish-india

# Run setup script (Windows)
setup.bat

# Or setup manually:
# Backend setup
cd server
npm install
cp .env.example .env  # Update with your MongoDB URI

# Frontend setup
cd ../client
npm install
cp .env.example .env

# Start backend (in one terminal)
cd server
npm start

# Start frontend (in another terminal)
cd client
npm run dev
```

### Production Deployment (Render)

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete deployment instructions.

## 🎯 Features

- ✅ User authentication and authorization
- ✅ Product catalog with categories and search
- ✅ Shopping cart and checkout process
- ✅ Order management and tracking
- ✅ Admin dashboard for products and orders
- ✅ Responsive design with modern UI
- ✅ JWT-based authentication
- ✅ MongoDB integration
- ✅ Production-ready deployment configuration

## 🛠️ Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Redux Toolkit for state management
- Tailwind CSS for styling
- Radix UI components
- Framer Motion for animations

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- CORS enabled for cross-origin requests

**Database:**
- MongoDB Atlas (cloud database)
- User management
- Product catalog
- Order tracking

## 📱 Application URLs

**Local Development:**
- Frontend: http://localhost:5174
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

**Admin Credentials:**
- Email: `admin@cherishindia.com`
- Password: `admin123`

## 🔧 Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRE=7d
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5174
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Cherish India
VITE_NODE_ENV=development
```

## 📂 Project Structure

```
cherish-india/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store
│   │   ├── utils/          # Utilities and API calls
│   │   └── types/          # TypeScript types
│   ├── public/             # Static assets
│   └── dist/               # Production build
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── middleware/     # Custom middleware
│   ├── server.js           # Main server file
│   └── seed.js             # Database seeding
├── render.yaml             # Render deployment config
├── DEPLOYMENT_GUIDE.md     # Deployment instructions
└── README.md               # This file
```

## 🎨 Key Features

### User Features
- Product browsing and search
- Shopping cart management
- User registration and login
- Order placement and tracking
- Profile management

### Admin Features
- Product management (CRUD operations)
- Order management and status updates
- User management
- Analytics dashboard

### Technical Features
- Responsive design for all devices
- JWT-based authentication
- Password encryption
- Input validation and sanitization
- Error handling and logging
- Health monitoring
- Production-ready deployment

## 🚀 Deployment

This application is configured for easy deployment on Render with:
- Automatic builds and deployments
- Environment variable management
- MongoDB Atlas integration
- Health check endpoints
- Production optimization

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support or questions, please contact the development team.
