#!/bin/bash

echo "🚀 Building project..."
npm run build

echo "📄 Generating SEO pages..."
npx tsx scripts/generate-seo-pages.ts

echo "✅ Done! SEO pages generated in dist/city/"
