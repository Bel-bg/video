@echo off
title IG-Live Video Backend

echo 🚀 Starting IG-Live Video Backend...

REM Check if we're in the right directory
if not exist "package.json" (
  echo ❌ Error: package.json not found. Please run this script from the backend directory.
  pause
  exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
  echo ⚠️  Warning: .env file not found. Using default configuration.
  echo 💡 Tip: Copy .env.example to .env and configure your credentials.
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
  echo 📦 Installing dependencies...
  npm install
  if %errorlevel% neq 0 (
    echo ❌ Error: Failed to install dependencies.
    pause
    exit /b 1
  )
)

REM Run database migrations
echo 📋 Running database migrations...
node runMigrations.js
if %errorlevel% neq 0 (
  echo ⚠️  Warning: Database migrations failed. Continuing startup...
)

REM Start the server
echo 🔥 Starting server...
npm start

pause