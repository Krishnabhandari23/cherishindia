# Deployment Checklist

## ✅ Pre-Deployment Checklist

### Database Setup
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with read/write permissions
- [ ] Network access configured (0.0.0.0/0 for Render)
- [ ] Connection string tested

### Backend Configuration
- [ ] `package.json` updated with correct dependencies and scripts
- [ ] Environment variables configured for production
- [ ] CORS settings updated for production URLs
- [ ] Health check endpoint working
- [ ] Database connection string updated
- [ ] JWT secrets configured

### Frontend Configuration
- [ ] Build process verified locally (`npm run build`)
- [ ] Environment variables configured
- [ ] API URLs point to production backend
- [ ] Static file routing configured

### Security
- [ ] Sensitive data removed from client-side code
- [ ] Environment variables used for all secrets
- [ ] CORS properly configured (not allowing all origins in production)
- [ ] Production security headers added

## 🚀 Deployment Steps

### Backend Deployment
- [ ] Create Render Web Service
- [ ] Configure build settings (Node.js, npm install, npm start)
- [ ] Set all required environment variables
- [ ] Deploy and verify health check endpoint
- [ ] Note backend URL for frontend configuration

### Frontend Deployment
- [ ] Update VITE_API_BASE_URL with backend URL
- [ ] Create Render Static Site
- [ ] Configure build settings (npm install && npm run build)
- [ ] Set environment variables
- [ ] Deploy and verify application loads

### Post-Deployment
- [ ] Test user registration and login
- [ ] Test product browsing and cart
- [ ] Test order placement
- [ ] Test admin login and dashboard
- [ ] Verify all API endpoints working
- [ ] Check console for any errors

## 🔧 Environment Variables Summary

### Backend (Render Web Service)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cherish-india?retryWrites=true&w=majority
JWT_SECRET=your_secure_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRE=7d
PORT=5000
CLIENT_URL=https://your-frontend-url.onrender.com
FRONTEND_URL=https://your-frontend-url.onrender.com
```

### Frontend (Render Static Site)
```
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
VITE_NODE_ENV=production
VITE_APP_NAME=Cherish India
VITE_APP_VERSION=1.0.0
```

## 🧪 Testing URLs

After deployment, test these endpoints:

### Backend API
- Health Check: `https://your-backend-url.onrender.com/api/health`
- Products: `https://your-backend-url.onrender.com/api/products`
- Auth: `https://your-backend-url.onrender.com/api/auth/login`

### Frontend Application
- Home: `https://your-frontend-url.onrender.com/`
- Login: `https://your-frontend-url.onrender.com/login`
- Admin: `https://your-frontend-url.onrender.com/admin`

## 🐛 Common Issues

1. **CORS Errors**: Ensure CLIENT_URL/FRONTEND_URL match exact frontend URL
2. **API Connection**: Verify VITE_API_BASE_URL is correct
3. **Database Connection**: Check MongoDB Atlas network access and credentials
4. **Build Failures**: Ensure all dependencies are in package.json
5. **Environment Variables**: Double-check all required variables are set

## 📝 Notes

- Free tier services may have cold start delays
- Keep backend and frontend URLs handy for cross-referencing
- Monitor logs in Render dashboard for any issues
- Test thoroughly after each deployment