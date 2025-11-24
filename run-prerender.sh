#!/bin/bash

# Build the project first
echo "Building project..."
npm run build

# Run the prerender script
echo ""
echo "Running prerender script..."
node scripts/generate-static-pages.js
