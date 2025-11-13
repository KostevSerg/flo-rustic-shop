// Download sitemap using native fetch
import { writeFileSync } from 'fs';

const url = 'https://functions.poehali.dev/58b61451-ee69-439e-b94c-195335bd5057';

console.log('Fetching sitemap from:', url);

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();
  })
  .then(text => {
    writeFileSync('downloaded-sitemap.xml', text, 'utf8');
    
    console.log('SUCCESS! Sitemap downloaded');
    console.log('File size:', text.length, 'characters');
    console.log('Saved to: downloaded-sitemap.xml');
    
    const urlCount = (text.match(/<loc>/g) || []).length;
    console.log('Total URLs found:', urlCount);
    
    const lines = text.split('\n');
    console.log('\n=== FIRST 100 LINES ===');
    console.log(lines.slice(0, 100).join('\n'));
    
    console.log('\n=== LAST 20 LINES ===');
    console.log(lines.slice(-20).join('\n'));
  })
  .catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
