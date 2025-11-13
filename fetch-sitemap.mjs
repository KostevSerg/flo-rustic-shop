#!/usr/bin/env node
// Simple script to fetch sitemap data and display it
import { writeFileSync } from 'fs';

const url = 'https://functions.poehali.dev/de3079a4-121e-4551-98e0-d684282f9f85';

console.log('Fetching sitemap from:', url);
console.log('Please wait...\n');

try {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error('API returned error');
  }
  
  // Save full content to file
  writeFileSync('downloaded-sitemap.xml', data.full_content, 'utf8');
  
  console.log('='.repeat(80));
  console.log('SITEMAP DOWNLOAD COMPLETE');
  console.log('='.repeat(80));
  console.log(`Total characters: ${data.total_chars.toLocaleString()}`);
  console.log(`Total lines: ${data.total_lines.toLocaleString()}`);
  console.log(`Total URLs: ${data.total_urls.toLocaleString()}`);
  console.log(`Saved to: downloaded-sitemap.xml`);
  console.log('='.repeat(80));
  
  console.log('\n' + '='.repeat(80));
  console.log('FIRST 100 LINES');
  console.log('='.repeat(80));
  console.log(data.first_100_lines);
  
  console.log('\n' + '='.repeat(80));
  console.log('LAST 20 LINES');
  console.log('='.repeat(80));
  console.log(data.last_20_lines);
  console.log('='.repeat(80));
  
} catch (error) {
  console.error('ERROR:', error.message);
  process.exit(1);
}
