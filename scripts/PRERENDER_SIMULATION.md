# Prerender Script Simulation

## Command to Execute

```bash
node scripts/prerender.js
```

## Expected Console Output

```
🚀 Starting prerendering...
📂 Using build path: /path/to/webapp/builds/cdbb7fc66c26492e4a60c12a145d7018d2e3b7dd/55029
📄 Index file: /path/to/webapp/builds/cdbb7fc66c26492e4a60c12a145d7018d2e3b7dd/55029/index.html

🔍 Fetching cities from database...
✅ Found XX active cities

✅ Generated: /city/alejsk/index.html
✅ Generated: /city/barnaul/index.html
✅ Generated: /city/belokuriha/index.html
✅ Generated: /city/bijsk/index.html
✅ Generated: /city/galbshtadt/index.html
✅ Generated: /city/novoaltajsk/index.html
✅ Generated: /city/rubcovsk/index.html
✅ Generated: /city/slavgorod/index.html
✅ Generated: /city/yarovoe/index.html
✅ Generated: /city/volgograd/index.html
✅ Generated: /city/volgogradskaya-oblast/index.html
✅ Generated: /city/ekaterinburg/index.html
✅ Generated: /city/kazan/index.html
✅ Generated: /city/moskva/index.html
✅ Generated: /city/nizhnij-novgorod/index.html
✅ Generated: /city/novosibirsk/index.html
✅ Generated: /city/sankt-peterburg/index.html
... (and more cities)

✅ Prerendering complete! Generated XX city pages.
```

## What the Script Does

### Step 1: Fetch Cities from Database
- Connects to API: `https://functions.poehali.dev/3f4d37f0-b84f-4157-83b7-55bdb568e459`
- Retrieves all active cities from all regions
- Parses the response which is grouped by region

### Step 2: Generate Slugs
For each city, generates a URL-friendly slug using transliteration:
- Волгоград → volgograd
- Барнаул → barnaul
- Санкт-Петербург → sankt-peterburg

### Step 3: Create HTML Files
For each city, creates:
- Directory: `builds/[latest]/[hash]/city/{slug}/`
- File: `index.html`
- Content: Copy of main index.html with custom meta tags

### Step 4: Custom Meta Tags
Each city page gets unique SEO meta tags:
- `<title>Доставка цветов {CityName} — FloRustic | Букеты с доставкой в {CityName}</title>`
- Description with city name
- Canonical URL: `https://florustic.ru/city/{slug}`
- Open Graph tags
- Twitter Card tags

## Expected Directory Structure After Running

```
builds/
└── cdbb7fc66c26492e4a60c12a145d7018d2e3b7dd/
    └── 55029/
        ├── index.html
        └── city/
            ├── alejsk/
            │   └── index.html
            ├── barnaul/
            │   └── index.html
            ├── belokuriha/
            │   └── index.html
            ├── bijsk/
            │   └── index.html
            ├── volgograd/
            │   └── index.html
            ├── moskva/
            │   └── index.html
            ├── sankt-peterburg/
            │   └── index.html
            └── ... (all other cities)
```

## Sample Generated HTML

For Волгоград (volgograd), the generated HTML will include:

```html
<head>
    <!-- Original meta tags from main index.html -->
    ...
    
    <!-- City-specific meta tags injected before </head> -->
    <title>Доставка цветов Волгоград — FloRustic | Букеты с доставкой в Волгоград</title>
    <meta name="description" content="Служба доставки цветов в Волгоград. Свежие цветы в Волгоград — доставка в течение 1.5 часов после оплаты. Розы, тюльпаны, композиции ручной работы. Более 500 букетов в каталоге. Заказ онлайн 24/7!">
    <link rel="canonical" href="https://florustic.ru/city/volgograd">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Доставка цветов Волгоград — FloRustic | Букеты с доставкой в Волгоград">
    <meta property="og:description" content="Служба доставки цветов в Волгоград. Свежие цветы в Волгоград — доставка в течение 1.5 часов после оплаты. Розы, тюльпаны, композиции ручной работы. Более 500 букетов в каталоге. Заказ онлайн 24/7!">
    <meta property="og:url" content="https://florustic.ru/city/volgograd">
    <meta property="og:site_name" content="FloRustic">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Доставка цветов Волгоград — FloRustic | Букеты с доставкой в Волгоград">
    <meta name="twitter:description" content="Служба доставки цветов в Волгоград. Свежие цветы в Волгоград — доставка в течение 1.5 часов после оплаты. Розы, тюльпаны, композиции ручной работы. Более 500 букетов в каталоге. Заказ онлайн 24/7!">
</head>
```

## Potential Errors

### 1. Network Error
```
❌ Error during prerendering: fetch failed
```
**Solution:** Check internet connection and API accessibility

### 2. Missing index.html
```
❌ Error: ENOENT: no such file or directory
```
**Solution:** Run `npm run build` first to create the dist/index.html

### 3. Permission Error
```
❌ Error: EACCES: permission denied
```
**Solution:** Check write permissions on the builds directory

## Verification

After running, verify by checking:
1. Count of generated files: `ls -la builds/*/*/city/*/index.html | wc -l`
2. Sample file content: `cat builds/*/*/city/volgograd/index.html | grep '<title>'`
3. All cities listed: `ls builds/*/*/city/`

## Next Steps After Prerendering

1. **Test locally**: Open any generated city page in browser
2. **Deploy**: Upload the entire build directory to production
3. **Verify SEO**: Check Google Search Console for city pages
4. **Monitor**: Watch analytics for city-specific traffic

## Performance

- **Fetching cities**: ~500ms (depends on API)
- **Generating files**: ~10-50ms per city
- **Total time**: Typically 5-10 seconds for 20-30 cities

## Regions in Database

Based on API structure, cities are grouped by regions:
- Алтайский край (Altai Krai)
- Волгоградская область (Volgograd Oblast)
- And other regions...

Each region may contain multiple cities.
