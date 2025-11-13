import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITEMAP_URL = 'https://functions.poehali.dev/58b61451-ee69-439e-b94c-195335bd5057';

const generateSitemap = async () => {
  try {
    console.log('Fetching sitemap from backend function...');
    const response = await fetch(SITEMAP_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: ${response.status} ${response.statusText}`);
    }
    
    const xmlContent = await response.text();
    
    const urlCount = (xmlContent.match(/<url>/g) || []).length;
    console.log(`Found ${urlCount} URLs in sitemap`);
    
    const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, xmlContent, 'utf-8');
    
    console.log(`✅ Sitemap generated successfully!`);
    console.log(`   Total URLs: ${urlCount}`);
    console.log(`   Saved to: ${sitemapPath}`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    process.exit(1);
  }
};

generateSitemap();