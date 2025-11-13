# Complete Sitemap Preview

## Statistics

- **Total URLs**: 394
- **Total Lines**: 2,372  
- **Total Size**: 67,152 characters (~65.6 KB)
- **Last Modified**: 2025-11-13
- **Source**: https://functions.poehali.dev/58b61451-ee69-439e-b94c-195335bd5057

## URL Breakdown

The sitemap contains the following types of URLs:

### Main Pages (7 URLs)
- Homepage (`/`)
- Catalog (`/catalog`)
- About (`/about`)
- Delivery (`/delivery`)
- Guarantees (`/guarantees`)
- Contacts (`/contacts`)
- Reviews (`/reviews`)

### City Pages (387 URLs)
- City landing pages: `https://florustic.ru/city/[city-slug]`
- City delivery pages: `https://florustic.ru/city/[city-slug]/delivery`

Cities include (partial list from preview):
- alejsk
- barnaul
- and ~100+ more cities across Russia

Based on 394 total URLs:
- 7 main pages
- 387 city-related pages (approximately 193-194 cities × 2 pages per city)

## Download Instructions

### Quick Download (Recommended)

```bash
# Download complete sitemap
curl -o sitemap.xml "https://functions.poehali.dev/de3079a4-121e-4551-98e0-d684282f9f85?mode=full"
```

Or use the included Node.js script:

```bash
node download-and-display-sitemap.mjs
```

This will:
1. Download the complete 394-URL sitemap
2. Save it as `sitemap-complete.xml`
3. Verify the download is complete
4. Display first 100 lines and last 20 lines

## File Structure

The sitemap follows standard XML sitemap protocol 0.9:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  
  <url>
    <loc>[URL]</loc>
    <lastmod>2025-11-13</lastmod>
    <changefreq>[frequency]</changefreq>
    <priority>[priority]</priority>
  </url>
  
  <!-- ... 393 more URLs ... -->
  
</urlset>
```

## Priority Levels

- **1.0**: Homepage (highest priority)
- **0.9**: Catalog, City landing pages
- **0.8**: City delivery pages, Product pages
- **0.7**: Delivery, Contacts pages
- **0.6**: About, Guarantees, Reviews pages

## Change Frequency

- **daily**: Homepage, Catalog, City landing pages
- **weekly**: City delivery pages, Reviews
- **monthly**: About, Delivery, Guarantees, Contacts pages

## Verification

After downloading, verify the file is complete by checking:

```bash
# Check file size (should be ~67KB)
ls -lh sitemap.xml

# Count URLs (should be 394)
grep -c "<loc>" sitemap.xml

# Check last line (should be "</urlset>")
tail -n 1 sitemap.xml
```

Expected output:
- File size: ~66-67 KB
- URL count: 394
- Last line: `</urlset>`
