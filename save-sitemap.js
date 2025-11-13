// Script to fetch and save the complete sitemap
const url = 'https://functions.poehali.dev/de3079a4-121e-4551-98e0-d684282f9f85';

console.log('Fetching sitemap data...');

fetch(url)
  .then(response => response.json())
  .then(data => {
    if (!data.success) {
      throw new Error('Failed to fetch sitemap');
    }
    
    console.log('\n=== SITEMAP STATISTICS ===');
    console.log('Total characters:', data.total_chars);
    console.log('Total lines:', data.total_lines);
    console.log('Total URLs:', data.total_urls);
    
    console.log('\n=== FIRST 100 LINES ===');
    console.log(data.first_100_lines);
    
    console.log('\n=== LAST 20 LINES ===');
    console.log(data.last_20_lines);
    
    // Save to file (Node.js environment)
    if (typeof require !== 'undefined') {
      const fs = require('fs');
      fs.writeFileSync('downloaded-sitemap.xml', data.full_content, 'utf8');
      console.log('\n✓ Full sitemap saved to: downloaded-sitemap.xml');
    }
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
