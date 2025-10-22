# Cherish India Frontend Deployment

## Environment Variables Required

Set these environment variables in your Render dashboard:

### Required Environment Variables
- `VITE_API_BASE_URL` = `https://your-backend-app.onrender.com/api`
- `VITE_NODE_ENV` = `production`
- `VITE_APP_NAME` = `Cherish India`
- `VITE_APP_VERSION` = `1.0.0`
- `VITE_APP_DESCRIPTION` = `Premium E-Commerce Platform`

## Deployment Steps

1. Connect your GitHub repository to Render
2. Create a new Static Site
3. Select your repository and branch
4. Set the following build settings:
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Add all environment variables listed above
6. Deploy

## Post-Deployment

1. Note your frontend URL: `https://your-frontend-app.onrender.com`
2. Update the backend CORS configuration with this URL
3. Test the application in your browser

## Build Configuration

The frontend is configured to:
- Build optimized production bundles
- Code split vendor and UI libraries
- Serve static files with proper routing
- Handle environment variables at build time