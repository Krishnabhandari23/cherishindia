@echo off
echo 🚀 Setting up Cherish India E-Commerce Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Setup Backend
echo 📦 Setting up backend...
cd server
if not exist ".env" (
    echo 📝 Creating backend .env file from example...
    copy .env.example .env
    echo ⚠️  Please update the .env file with your MongoDB URI and other settings
)

echo 📦 Installing backend dependencies...
npm install

REM Setup Frontend
echo 📦 Setting up frontend...
cd ..\client
if not exist ".env" (
    echo 📝 Creating frontend .env file from example...
    copy .env.example .env
)

echo 📦 Installing frontend dependencies...
npm install

cd ..

echo ✅ Setup complete!
echo.
echo 🔧 Next steps:
echo 1. Update server\.env with your MongoDB connection string
echo 2. Update client\.env if needed
echo 3. Start the backend: cd server ^&^& npm start
echo 4. Start the frontend: cd client ^&^& npm run dev
echo.
echo 🌐 The application will be available at:
echo    Frontend: http://localhost:5174
echo    Backend API: http://localhost:5000/api
echo    Health Check: http://localhost:5000/api/health
echo.
echo 👤 Admin credentials:
echo    Email: admin@cherishindia.com
echo    Password: admin123

pause