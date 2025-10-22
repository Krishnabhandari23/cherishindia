# Cherish India E-Commerce - Render Deployment Guide

This guide will help you deploy the Cherish India e-commerce application to Render with both frontend and backend services.

## Prerequisites

1. GitHub account with your code repository
2. Render account (free tier available)
3. MongoDB Atlas account (free tier available)

## 🗄️ Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Cluster**:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create a new cluster (free tier M0)
   - Configure network access (allow all IPs: 0.0.0.0/0 for Render)
   - Create a database user with read/write permissions

2. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/cherish-india?retryWrites=true&w=majority`

## 🚀 Backend Deployment (API Server)

### Step 1: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Select your repository and branch

### Step 2: Configure Build Settings

- **Name**: `cherish-india-backend`
- **Root Directory**: `server`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Health Check Path**: `/api/health`

### Step 3: Set Environment Variables

Add these in the Render dashboard (Environment tab):

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://bhandaimanisha1981_db_user:V6gesOR478zAtE32@mini-ecom.rvnjdzd.mongodb.net/cherish-india?retryWrites=true&w=majority
JWT_SECRET=cherish_india_super_secret_jwt_key_2024
JWT_REFRESH_SECRET=cherish_india_refresh_secret_key_2024
JWT_EXPIRE=7d
PORT=5000
CLIENT_URL=https://your-frontend-app.onrender.com
FRONTEND_URL=https://your-frontend-app.onrender.com
```

### Step 4: Deploy Backend

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL: `https://your-backend-app.onrender.com`
4. Test health endpoint: `https://your-backend-app.onrender.com/api/health`

## 🎨 Frontend Deployment (React App)

### Step 1: Create Static Site on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Static Site"
3. Connect your GitHub repository
4. Select your repository and branch

### Step 2: Configure Build Settings

- **Name**: `cherish-india-frontend`
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### Step 3: Set Environment Variables

Add these in the Render dashboard (Environment tab):

```
VITE_API_BASE_URL=https://your-backend-app.onrender.com/api
VITE_NODE_ENV=production
VITE_APP_NAME=Cherish India
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Premium E-Commerce Platform
```

**Important**: Replace `your-backend-app.onrender.com` with your actual backend URL from Step 4 above.

### Step 4: Deploy Frontend

1. Click "Create Static Site"
2. Wait for deployment to complete
3. Note your frontend URL: `https://your-frontend-app.onrender.com`

## 🔄 Update CORS Configuration

After getting your frontend URL, update the backend environment variables:

1. Go to your backend service in Render dashboard
2. Update these environment variables:
   ```
   CLIENT_URL=https://your-actual-frontend-app.onrender.com
   FRONTEND_URL=https://your-actual-frontend-app.onrender.com
   ```
3. Redeploy the backend service

## 🎯 Post-Deployment Steps

### 1. Test the Application
- Visit your frontend URL
- Test user registration and login
- Test product browsing and cart functionality
- Test admin login: `admin@cherishindia.com` / `admin123`
- Test order placement and admin dashboard

### 2. Initialize Database (Optional)
If you need sample data, you can run the seed script:
1. Go to your backend service shell (if available)
2. Run: `npm run seed`

### 3. Monitor Services
- Check both services are running in Render dashboard
- Monitor logs for any errors
- Set up uptime monitoring if needed

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure frontend URL is correctly set in backend environment variables
   - Check browser console for specific CORS errors

2. **API Connection Failed**:
   - Verify `VITE_API_BASE_URL` points to correct backend URL
   - Ensure backend service is running

3. **Database Connection Issues**:
   - Verify MongoDB Atlas connection string
   - Check network access settings in MongoDB Atlas
   - Ensure database user has proper permissions

4. **Build Failures**:
   - Check build logs in Render dashboard
   - Verify all dependencies are in package.json
   - Ensure Node.js version compatibility

### Environment Variables Checklist

**Backend Required Variables**:
- ✅ NODE_ENV
- ✅ MONGODB_URI
- ✅ JWT_SECRET
- ✅ JWT_REFRESH_SECRET
- ✅ CLIENT_URL
- ✅ FRONTEND_URL

**Frontend Required Variables**:
- ✅ VITE_API_BASE_URL
- ✅ VITE_NODE_ENV

## 📱 Features Deployed

- ✅ User authentication and registration
- ✅ Product catalog with categories
- ✅ Shopping cart functionality
- ✅ Order placement and management
- ✅ Admin dashboard for order and product management
- ✅ MongoDB Atlas database integration
- ✅ JWT-based authentication
- ✅ CORS-enabled API
- ✅ Health monitoring endpoints

## 🔗 Final URLs

After successful deployment, you'll have:
- **Frontend**: `https://your-frontend-app.onrender.com`
- **Backend API**: `https://your-backend-app.onrender.com/api`
- **Health Check**: `https://your-backend-app.onrender.com/api/health`
- **Admin Panel**: `https://your-frontend-app.onrender.com/admin`

## 📞 Support

If you encounter any issues:
1. Check Render service logs
2. Verify all environment variables are set correctly
3. Test API endpoints individually
4. Check MongoDB Atlas connection and permissions

---

**Note**: Free tier services on Render may have cold start delays. For production use, consider upgrading to paid plans for better performance.