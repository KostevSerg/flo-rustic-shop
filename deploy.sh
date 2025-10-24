#!/bin/bash

echo "🚀 FloRustic Deployment Script"
echo "================================"

# Step 1: Build the project
echo ""
echo "📦 Step 1/2: Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed!"

# Step 2: Run prerendering
echo ""
echo "🎨 Step 2/2: Prerendering city pages..."
node scripts/prerender.js

if [ $? -ne 0 ]; then
    echo "⚠️ Prerendering failed, but build is still usable"
else
    echo "✅ Prerendering completed!"
fi

echo ""
echo "================================"
echo "✅ Deployment ready!"
echo ""
echo "📂 Output directory: dist/"
echo "🌐 Upload the 'dist' folder to your hosting"
