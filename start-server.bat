@echo off
echo.
echo ====================================
echo   Service Hub Portal Server
echo ====================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo Starting Service Hub Portal server in PRODUCTION mode...
echo.
echo Frontend will be available at: http://localhost:3000
echo API endpoints available at: http://localhost:3000/api
echo.
echo Server will auto-restart when files change (nodemon)
echo Press Ctrl+C to stop the server
echo.

REM Set production environment
set NODE_ENV=production

REM Start with nodemon for auto-restart
npx nodemon server.js

pause 