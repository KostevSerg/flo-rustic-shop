#!/bin/bash

echo "================================"
echo "Step 1: Building the project"
echo "================================"
echo ""

npm run build

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Build failed. Cannot proceed with prerender."
    exit 1
fi

echo ""
echo ""
echo "================================"
echo "Step 2: Running prerender script"
echo "================================"
echo ""

node scripts/generate-static-pages.js

echo ""
echo "================================"
echo "Step 3: Verifying generated files"
echo "================================"
echo ""

if [ -d "dist/city" ]; then
    echo "✅ City pages directory exists"
    CITY_COUNT=$(find dist/city -name "index.html" | wc -l)
    echo "   Found $CITY_COUNT city pages"
fi

if [ -d "dist/product" ]; then
    echo "✅ Product pages directory exists"
    PRODUCT_COUNT=$(find dist/product -name "index.html" | wc -l)
    echo "   Found $PRODUCT_COUNT product pages"
fi

# Check static pages
STATIC_PAGES=("catalog" "delivery" "about" "contacts" "reviews")
STATIC_COUNT=0
for page in "${STATIC_PAGES[@]}"; do
    if [ -f "dist/$page/index.html" ]; then
        ((STATIC_COUNT++))
    fi
done
echo "✅ Static pages: $STATIC_COUNT pages"

echo ""
echo "Sample city page (first 20 lines with title):"
if [ -d "dist/city" ]; then
    FIRST_CITY=$(find dist/city -name "index.html" | head -1)
    if [ -n "$FIRST_CITY" ]; then
        echo "File: $FIRST_CITY"
        grep "<title>" "$FIRST_CITY" | head -1
    fi
fi

echo ""
echo "================================"
echo "Prerender Complete!"
echo "================================"
