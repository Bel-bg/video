#!/bin/bash

# Deployment script for IG-Live Video Backend

# Exit on any error
set -e

echo "Starting deployment of IG-Live Video Backend..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "Error: package.json not found. Please run this script from the backend directory."
  exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build the application (if needed)
echo "Building the application..."
# Add build steps here if needed

# Run database migrations
echo "Running database setup..."
node src/utils/setupDatabase.js

echo "Deployment completed successfully!"
echo "To start the server, run: npm start"