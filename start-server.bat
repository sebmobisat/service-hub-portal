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

echo Starting Service Hub Portal server...
echo.
echo Frontend will be available at: http://localhost:3001
echo API endpoints available at: http://localhost:3001/api
echo.
echo Press Ctrl+C to stop the server
echo.

node server.js

pause 