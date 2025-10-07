@echo off
title IG-Live Video Backend - API Test

echo 🧪 Testing IG-Live Video Backend API...

REM Check if we're in the right directory
if not exist "package.json" (
  echo ❌ Error: package.json not found. Please run this script from the backend directory.
  pause
  exit /b 1
)

REM Test health endpoint
echo 🔍 Testing health endpoint...
curl -f http://localhost:3000/api/health
if %errorlevel% neq 0 (
  echo ❌ Health endpoint test failed.
) else (
  echo ✅ Health endpoint test passed.
)

REM Test videos feed endpoint
echo 🔍 Testing videos feed endpoint...
curl -f http://localhost:3000/api/videos/feed?limit=1
if %errorlevel% neq 0 (
  echo ❌ Videos feed endpoint test failed.
) else (
  echo ✅ Videos feed endpoint test passed.
)

REM Test ImageKit auth endpoint
echo 🔍 Testing ImageKit auth endpoint...
curl -f http://localhost:3000/api/auth/imagekit
if %errorlevel% neq 0 (
  echo ❌ ImageKit auth endpoint test failed.
) else (
  echo ✅ ImageKit auth endpoint test passed.
)

echo 🎉 API tests completed!
pause