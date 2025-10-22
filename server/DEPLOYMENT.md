# Cherish India Backend Deployment

## Environment Variables Required

Set these environment variables in your Render dashboard:

### Required Environment Variables
- `NODE_ENV` = `production`
- `MONGODB_URI` = `mongodb+srv://bhandaimanisha1981_db_user:V6gesOR478zAtE32@mini-ecom.rvnjdzd.mongodb.net/cherish-india?retryWrites=true&w=majority`
- `JWT_SECRET` = `cherish_india_super_secret_jwt_key_2024`
- `JWT_REFRESH_SECRET` = `cherish_india_refresh_secret_key_2024`
- `JWT_EXPIRE` = `7d`
- `PORT` = `5000` (Render will override this)
- `CLIENT_URL` = `https://your-frontend-app.onrender.com`
- `FRONTEND_URL` = `https://your-frontend-app.onrender.com`

## Deployment Steps

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Select your repository and branch
4. Set the following build settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
5. Add all environment variables listed above
6. Deploy

## Post-Deployment

1. Note your backend URL: `https://your-backend-app.onrender.com`
2. Update the frontend environment variables with this URL
3. Test the health endpoint: `https://your-backend-app.onrender.com/api/health`