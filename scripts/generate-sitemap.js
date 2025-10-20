import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/ё/g, 'e')
    .replace(/[^\u0430-\u044f\u0410-\u042fa-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

const generateSitemap = async () => {
  try {
    const apiUrl = 'https://funcdev.poehali.dev/9bd91e19-90f8-4aaa-b83a-68f7dc5e91e1/api/cities';
    
    console.log('Fetching cities from API...');
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    const cities = [];
    Object.values(data.cities || {}).forEach((regionCities) => {
      cities.push(...regionCities);
    });
    
    console.log(`Found ${cities.length} cities`);
    
    const currentDate = new Date().toISOString().split('T')[0];
    
    const staticUrls = [
      { loc: 'https://florustic.ru/', priority: '1.0', changefreq: 'daily' },
      { loc: 'https://florustic.ru/catalog', priority: '0.9', changefreq: 'daily' },
      { loc: 'https://florustic.ru/about', priority: '0.6', changefreq: 'monthly' },
      { loc: 'https://florustic.ru/delivery', priority: '0.7', changefreq: 'monthly' },
      { loc: 'https://florustic.ru/guarantees', priority: '0.6', changefreq: 'monthly' },
      { loc: 'https://florustic.ru/contacts', priority: '0.7', changefreq: 'monthly' },
      { loc: 'https://florustic.ru/reviews', priority: '0.6', changefreq: 'weekly' },
    ];
    
    const cityUrls = cities
      .filter(city => city.is_active !== false)
      .map(city => ({
        loc: `https://florustic.ru/city/${createSlug(city.name)}`,
        priority: '0.8',
        changefreq: 'weekly',
        city: city.name
      }));
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  
`;
    
    staticUrls.forEach(url => {
      xml += `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
  
`;
    });
    
    cityUrls.forEach(url => {
      xml += `  <!-- ${url.city} -->
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
  
`;
    });
    
    xml += `</urlset>`;
    
    const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, xml, 'utf-8');
    
    console.log(`✅ Sitemap generated successfully!`);
    console.log(`   Static pages: ${staticUrls.length}`);
    console.log(`   City pages: ${cityUrls.length}`);
    console.log(`   Total URLs: ${staticUrls.length + cityUrls.length}`);
    console.log(`   Saved to: ${sitemapPath}`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
};

generateSitemap();
