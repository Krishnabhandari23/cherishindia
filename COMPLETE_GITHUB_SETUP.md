# 🚀 Cherish India - Complete GitHub Setup Instructions

## ⚠️ Git Not Detected - Complete Setup Required

Since Git is not installed on your system, here's the complete step-by-step guide:

---

## Step 1: Install Git

1. **Download Git for Windows**:
   - Go to: https://git-scm.com/download/windows
   - Download the latest version (64-bit recommended)

2. **Install Git**:
   - Run the downloaded installer
   - Use **default settings** for all options
   - When asked about default editor, you can choose VS Code if you have it
   - Complete the installation

3. **Verify Installation**:
   - Close and reopen PowerShell/Command Prompt
   - Run: `git --version`
   - You should see version information

---

## Step 2: Configure Git (One-time setup)

Open PowerShell and run these commands (replace with your info):

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@gmail.com"
```

---

## Step 3: Initialize Git Repository

```powershell
cd F:\cherishindia
git init
git add .
git commit -m "Initial commit: Cherish India e-commerce application"
```

---

## Step 4: Create GitHub Repository

1. **Go to GitHub**: https://github.com
2. **Sign in** to your account (create one if needed)
3. **Click the "+" icon** → "New repository"
4. **Repository settings**:
   - **Repository name**: `cherish-india-ecommerce`
   - **Description**: `Modern full-stack e-commerce platform built with React, Node.js, Express, and MongoDB`
   - **Visibility**: Public (recommended) or Private
   - **Important**: ❌ **Do NOT check** "Add a README file"
   - **Important**: ❌ **Do NOT check** "Add .gitignore"
   - **Important**: ❌ **Do NOT choose** a license
   
   *(We already have these files in the project)*

5. **Click "Create repository"**

---

## Step 5: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```powershell
cd F:\cherishindia
git remote add origin https://github.com/Krishnabhandari23/cherishindia.git
git branch -M main
git push -u origin main
```

**🔑 Replace `YOUR_USERNAME` with your actual GitHub username**

Example:
- If your GitHub username is `Krishnabhandari23`, use:
- `git remote add origin https://github.com/Krishnabhandari23/cherishindia.git`

---

## Step 6: Verify Upload

1. **Refresh your GitHub repository page**
2. **You should see**:
   - ✅ All project folders (`client/`, `server/`)
   - ✅ Documentation files (`README.md`, `DEPLOYMENT_GUIDE.md`)
   - ✅ Configuration files (`render.yaml`, `.gitignore`)
   - ✅ Setup scripts (`setup.bat`, `github-setup.bat`)

3. **Check that README.md displays properly** with project description

---

## Step 7: Deploy to Render (After GitHub Upload)

Once your code is on GitHub, follow these steps:

### Backend Deployment:
1. **Go to**: https://dashboard.render.com/
2. **Create account** or sign in
3. **New** → **Web Service**
4. **Connect your GitHub repository**
5. **Configure**:
   - Name: `cherish-india-backend`
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. **Add Environment Variables** (see DEPLOYMENT_GUIDE.md for full list):
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://bhandaimanisha1981_db_user:V6gesOR478zAtE32@mini-ecom.rvnjdzd.mongodb.net/cherish-india?retryWrites=true&w=majority
   JWT_SECRET=cherish_india_super_secret_jwt_key_2024
   JWT_REFRESH_SECRET=cherish_india_refresh_secret_key_2024
   ```

### Frontend Deployment:
1. **New** → **Static Site**
2. **Connect same GitHub repository**
3. **Configure**:
   - Name: `cherish-india-frontend`
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. **Add Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
   VITE_NODE_ENV=production
   ```

---

## 🎯 What's Included in Your Repository

Your project includes everything needed for deployment:

### ✅ **Frontend (React + TypeScript)**
- Modern React 18 with TypeScript
- Redux Toolkit for state management
- Tailwind CSS + Radix UI components
- Vite for fast builds
- Production-optimized configuration

### ✅ **Backend (Node.js + Express)**
- RESTful API with JWT authentication
- MongoDB integration with Mongoose
- CORS configured for production
- Security headers and error handling
- Health check endpoints

### ✅ **Database**
- MongoDB Atlas cloud database
- User management and authentication
- Product catalog and inventory
- Order management system

### ✅ **Deployment Ready**
- Render.com configuration
- Environment variable management
- Production build optimization
- Complete documentation

---

## 🛠️ Quick Commands Reference

```powershell
# Check if Git is installed
git --version

# Navigate to project
cd F:\cherishindia

# Initialize Git (after Git is installed)
git init
git add .
git commit -m "Initial commit: Cherish India e-commerce application"

# Connect to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/cherish-india-ecommerce.git
git branch -M main
git push -u origin main
```

---

## 🆘 Need Help?

1. **Git Installation Issues**: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
2. **GitHub Account**: https://github.com/join
3. **Render Deployment**: See `DEPLOYMENT_GUIDE.md` in your project
4. **Full Documentation**: See `README.md` in your project

---

## 🎉 You're All Set!

Once you complete these steps, you'll have:
- ✅ Your code safely stored on GitHub
- ✅ Professional version control
- ✅ Ready for team collaboration
- ✅ Prepared for production deployment
- ✅ Backup of your entire project

**Happy coding! 🚀**