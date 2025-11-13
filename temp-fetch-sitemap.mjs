#!/usr/bin/env node
/**
 * Fetch complete sitemap XML and save to public/sitemap.xml
 * This script downloads ALL URLs from the sitemap without truncation
 */

import { writeFileSync } from 'fs';

const SITEMAP_URL = 'https://functions.poehali.dev/58b61451-ee69-439e-b94c-195335bd5057';
const OUTPUT_PATH = 'public/sitemap.xml';

console.log('╔═══════════════════════════════════════════════════════════════════╗');
console.log('║           SITEMAP DOWNLOADER - Fetching Complete XML             ║');
console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

console.log('Fetching from:', SITEMAP_URL);
console.log('Output path:', OUTPUT_PATH);
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
  
  // Count URLs
  const urlMatches = xmlContent.match(/<loc>/g) || [];
  const urlCount = urlMatches.length;
  
  // Count lines
  const lines = xmlContent.split('\n');
  const lineCount = lines.length;
  
  // Get file size
  const fileSize = xmlContent.length;
  
  console.log('╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║                     DOWNLOAD COMPLETE!                            ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝');
  console.log(`  Total URLs:       ${urlCount.toLocaleString()}`);
  console.log(`  Total Lines:      ${lineCount.toLocaleString()}`);
  console.log(`  File Size:        ${fileSize.toLocaleString()} characters (~${(fileSize / 1024).toFixed(2)} KB)`);
  console.log(`  Saved to:         ${OUTPUT_PATH}`);
  console.log('');
  
  console.log('╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║                  FIRST 20 LINES                                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');
  console.log(lines.slice(0, 20).join('\n'));
  
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║                   LAST 10 LINES                                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');
  console.log(lines.slice(-10).join('\n'));
  
  console.log('\n✓ Sitemap successfully saved to public/sitemap.xml');
  console.log(`✓ Verified ${urlCount} URLs in the sitemap\n`);
  
} catch (error) {
  console.error('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.error('║                          ERROR!                                   ║');
  console.error('╚═══════════════════════════════════════════════════════════════════╝');
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
