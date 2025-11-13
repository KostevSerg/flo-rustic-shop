#!/usr/bin/env node
/**
 * Fetch complete sitemap XML and save to public/sitemap.xml
 */

import { writeFileSync, readFileSync } from 'fs';

const SITEMAP_URL = 'https://functions.poehali.dev/2acdad81-deba-4cdd-8cd1-feb9e24f4226';
const OUTPUT_PATH = 'public/sitemap.xml';

console.log('Fetching sitemap from:', SITEMAP_URL);
console.log('Please wait...\n');

try {
  // Fetch the complete XML
  const response = await fetch(SITEMAP_URL);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  // Get the full text content
  const xmlContent = await response.text();
  
  // Write to public/sitemap.xml
  writeFileSync(OUTPUT_PATH, xmlContent, 'utf8');
  console.log('✓ Saved to:', OUTPUT_PATH);
  
  // Read back the file to verify
  const savedContent = readFileSync(OUTPUT_PATH, 'utf8');
  const lines = savedContent.split('\n');
  
  // Count <url> tags
  const urlMatches = savedContent.match(/<url>/g) || [];
  const urlCount = urlMatches.length;
  
  // Display results
  console.log('\n' + '='.repeat(80));
  console.log('VERIFICATION RESULTS');
  console.log('='.repeat(80));
  console.log('Total <url> tags found:', urlCount);
  console.log('Total lines:', lines.length);
  console.log('File size:', savedContent.length, 'characters');
  console.log('='.repeat(80));
  
  console.log('\n' + '='.repeat(80));
  console.log('FIRST 30 LINES');
  console.log('='.repeat(80));
  console.log(lines.slice(0, 30).join('\n'));
  
  console.log('\n' + '='.repeat(80));
  console.log('LAST 20 LINES');
  console.log('='.repeat(80));
  console.log(lines.slice(-20).join('\n'));
  
  console.log('\n✓ Sitemap successfully saved and verified!\n');
  
} catch (error) {
  console.error('\nERROR:', error.message);
  process.exit(1);
}
