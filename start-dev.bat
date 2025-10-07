@echo off
title IG-Live Video Backend - Development Mode

echo 🚀 Starting IG-Live Video Backend in Development Mode...

REM Check if we're in the right directory
if not exist "package.json" (
  echo ❌ Error: package.json not found. Please run this script from the backend directory.
  pause
  exit /b 1
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

REM Run database setup
echo 📋 Setting up database...
node runMigrations.js
if %errorlevel% neq 0 (
  echo ⚠️  Warning: Database setup failed. Continuing startup...
)

REM Start the development server
echo 🔥 Starting development server...
npm run dev

pause