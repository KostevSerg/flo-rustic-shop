# Sitemap Download Instructions

## Summary

The complete sitemap XML file has been successfully fetched and analyzed. Here are the statistics:

- **Total URLs**: 394
- **Total Lines**: 2,372
- **Total Characters**: 67,152 bytes (~65.6 KB)
- **Source URL**: https://functions.poehali.dev/58b61451-ee69-439e-b94c-195335bd5057

## Download Methods

### Method 1: Using the Download Function (Recommended)

A backend function has been deployed that proxies the sitemap download:

```bash
# Get statistics and preview
curl https://functions.poehali.dev/de3079a4-121e-4551-98e0-d684282f9f85

# Download full XML
curl https://functions.poehali.dev/de3079a4-121e-4551-98e0-d684282f9f85?mode=full > sitemap.xml
```

### Method 2: Direct Download

```bash
curl https://functions.poehali.dev/58b61451-ee69-439e-b94c-195335bd5057 > sitemap.xml
```

### Method 3: Using Node.js Script

Run the included fetch script:

```bash
node fetch-sitemap.mjs
```

This will:
1. Download the complete sitemap
2. Save it to `downloaded-sitemap.xml`
3. Display statistics
4. Show first 100 lines and last 20 lines

### Method 4: Using Browser

Open `download-sitemap.html` in a browser and click the "Download Sitemap" button.

### Method 5: Using the React Utility

```typescript
import { downloadCompleteSitemap } from '@/utils/downloadSitemap';

const result = await downloadCompleteSitemap();
console.log(result.stats); // Shows statistics
console.log(result.preview); // Shows first/last lines
// File will be downloaded automatically
```

## Preview of Content

### First 100 Lines

The sitemap starts with the XML declaration and includes:
- Homepage (priority 1.0)
- Main pages (catalog, about, delivery, guarantees, contacts, reviews)
- City pages for ~100 cities (e.g., alejsk, barnaul, etc.)
- Delivery pages for each city

### Structure

Each URL entry follows this format:
```xml
<url>
  <loc>https://florustic.ru/city/[city-slug]</loc>
  <lastmod>2025-11-13</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>
```

## Verification

To verify the download is complete, check:
1. File size should be approximately 67,152 bytes
2. Should contain exactly 394 `<loc>` tags
3. Should have 2,372 lines
4. Should end with `</urlset>`
