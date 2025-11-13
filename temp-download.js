// Simple script to download sitemap using native fetch (Node 18+)
import { writeFileSync } from 'fs';

const url = 'https://functions.poehali.dev/58b61451-ee69-439e-b94c-195335bd5057';

async function downloadSitemap() {
  console.log('Fetching sitemap from:', url);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    
    writeFileSync('downloaded-sitemap.xml', text, 'utf8');
    
    console.log('SUCCESS! Sitemap downloaded');
    console.log('File size:', text.length, 'characters');
    console.log('Saved to: downloaded-sitemap.xml');
    
    // Count URLs
    const urlCount = (text.match(/<loc>/g) || []).length;
    console.log('Total URLs found:', urlCount);
    
    // Show first 100 lines
    const lines = text.split('\n');
    console.log('\n=== FIRST 100 LINES ===');
    console.log(lines.slice(0, 100).join('\n'));
    
    console.log('\n=== LAST 20 LINES ===');
    console.log(lines.slice(-20).join('\n'));
    
  } catch (error) {
    console.error('Error downloading sitemap:', error.message);
    process.exit(1);
  }
}

downloadSitemap();
