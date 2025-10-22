# GitHub Setup and Deployment Guide

## Step 1: Install Git (if not already installed)

1. Download Git from: https://git-scm.com/download/windows
2. Install with default settings
3. Restart your command prompt/PowerShell

## Step 2: Configure Git (First time only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 3: Initialize Git Repository

```bash
cd F:\cherishindia
git init
```

## Step 4: Add All Files

```bash
git add .
git commit -m "Initial commit: Cherish India e-commerce application"
```

## Step 5: Create GitHub Repository

1. Go to https://github.com
2. Click "New repository" (+ icon)
3. Repository name: `cherish-india-ecommerce`
4. Description: `Modern full-stack e-commerce platform built with React, Node.js, and MongoDB`
5. Set to Public or Private (your choice)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 6: Connect Local Repository to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/cherish-india-ecommerce.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username**

## Step 7: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your project files
3. Check that the README.md displays properly

## Step 8: Deploy to Render

Now you can follow the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) to deploy to Render:

1. **Backend Deployment**:
   - Create new Web Service on Render
   - Connect your GitHub repository
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`

2. **Frontend Deployment**:
   - Create new Static Site on Render
   - Connect your GitHub repository
   - Root directory: `client`
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`

## Important Notes

### Environment Variables
- **Never commit .env files** (they're in .gitignore)
- Set environment variables directly in Render dashboard
- Use the DEPLOYMENT_GUIDE.md for exact variable names and values

### Repository Structure
```
cherish-india-ecommerce/
├── client/                 # React frontend
├── server/                 # Node.js backend
├── .gitignore             # Files to ignore
├── README.md              # Project documentation
├── DEPLOYMENT_GUIDE.md    # Deployment instructions
├── render.yaml            # Render configuration
└── setup.bat             # Local setup script
```

### What's Excluded from Git (in .gitignore)
- `node_modules/` folders
- `.env` files (contains secrets)
- `dist/` and `build/` folders
- IDE-specific files
- OS-specific files
- Log files

## Troubleshooting

### If Git is not recognized:
1. Install Git from https://git-scm.com/download/windows
2. Restart your terminal
3. Try the commands again

### If you get authentication errors:
1. Use GitHub Personal Access Token instead of password
2. Or set up SSH keys (recommended for frequent use)

### If repository already exists on GitHub:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/cherish-india-ecommerce.git
```

## Next Steps After GitHub Upload

1. ✅ Code is on GitHub
2. 🚀 Deploy backend to Render
3. 🎨 Deploy frontend to Render
4. 🧪 Test the deployed application
5. 📝 Update README with live URLs

Your project is now ready for professional deployment! 🎉