@echo off
echo Starting Service Hub Portal Development Server...
echo.

REM Set development environment
set NODE_ENV=development
set DEBUG=true

REM Check if .env.local exists
if not exist ".env.local" (
    echo.
    echo WARNING: .env.local file not found!
    echo Please copy env.local.example to .env.local and configure your settings.
    echo.
    echo For local development, you need:
    echo - Supabase credentials (for PIN storage)
    echo - AWS SES credentials (for email sending)
    echo.
    pause
)

REM Start the development server
echo Starting server on http://localhost:3000
echo Press Ctrl+C to stop
echo.
npm run dev 