#!/bin/bash

# IG-Live Video Backend Startup Script

echo "🚀 Starting IG-Live Video Backend..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Please run this script from the backend directory."
  exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
  echo "⚠️  Warning: .env file not found. Using default configuration."
  echo "💡 Tip: Copy .env.example to .env and configure your credentials."
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
  if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies."
    exit 1
  fi
fi

# Run database migrations
echo "📋 Running database migrations..."
node runMigrations.js
if [ $? -ne 0 ]; then
  echo "⚠️  Warning: Database migrations failed. Continuing startup..."
fi

# Start the server
echo "🔥 Starting server..."
npm start