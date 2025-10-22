@echo off
echo 🚀 Cherish India - GitHub Setup Script
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed!
    echo.
    echo Please install Git first:
    echo 1. Download from: https://git-scm.com/download/windows
    echo 2. Install with default settings
    echo 3. Restart this terminal
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)

echo ✅ Git is installed
git --version

echo.
echo 📁 Current directory: %CD%
echo.

REM Check if already a git repository
if exist ".git" (
    echo ✅ Git repository already initialized
) else (
    echo 📦 Initializing Git repository...
    git init
)

echo.
echo 📝 Adding all files to Git...
git add .

echo.
echo 💾 Creating initial commit...
git commit -m "Initial commit: Cherish India e-commerce application - Ready for deployment"

echo.
echo ✅ Local Git setup complete!
echo.
echo 🔗 Next steps:
echo 1. Create a new repository on GitHub:
echo    - Go to https://github.com
echo    - Click "New repository"
echo    - Name: cherish-india-ecommerce
echo    - Description: Modern full-stack e-commerce platform
echo    - Do NOT initialize with README (we already have one)
echo.
echo 2. Connect to your GitHub repository:
echo    git remote add origin https://github.com/YOUR_USERNAME/cherish-india-ecommerce.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Replace YOUR_USERNAME with your actual GitHub username
echo.
echo 📖 For detailed instructions, see: GITHUB_SETUP.md
echo.
pause