#!/usr/bin/env node
/**
 * Complete sitemap downloader with preview
 * This script downloads the sitemap, saves it, and displays first 100 and last 20 lines
 */

import { writeFileSync } from 'fs';

const STATS_URL = 'https://functions.poehali.dev/de3079a4-121e-4551-98e0-d684282f9f85';
const FULL_URL = 'https://functions.poehali.dev/de3079a4-121e-4551-98e0-d684282f9f85?mode=full';

console.log('╔═══════════════════════════════════════════════════════════════════╗');
console.log('║           SITEMAP DOWNLOADER - Starting Download...              ║');
console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

// Step 1: Get statistics
console.log('Step 1: Fetching statistics...');
const statsResponse = await fetch(STATS_URL);
const stats = await statsResponse.json();

if (!stats.success) {
  console.error('ERROR: Failed to fetch statistics');
  process.exit(1);
}

console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
console.log('║                     SITEMAP STATISTICS                            ║');
console.log('╚═══════════════════════════════════════════════════════════════════╝');
console.log(`  Total URLs:       ${stats.total_urls.toLocaleString()}`);
console.log(`  Total Lines:      ${stats.total_lines.toLocaleString()}`);
console.log(`  Total Characters: ${stats.total_chars.toLocaleString()} bytes`);
console.log(`  File Size:        ~${(stats.total_chars / 1024).toFixed(2)} KB`);

// Step 2: Download full XML
console.log('\nStep 2: Downloading full XML content...');
const xmlResponse = await fetch(FULL_URL);
const xmlContent = await xmlResponse.text();

// Step 3: Save to file
const filename = 'sitemap-complete.xml';
writeFileSync(filename, xmlContent, 'utf8');
console.log(`✓ Saved to: ${filename}`);

// Step 4: Verify
const actualLines = xmlContent.split('\n').length;
const actualUrls = (xmlContent.match(/<loc>/g) || []).length;
const actualChars = xmlContent.length;

console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
console.log('║                     VERIFICATION                                  ║');
console.log('╚═══════════════════════════════════════════════════════════════════╝');
console.log(`  Expected URLs:  ${stats.total_urls} | Actual: ${actualUrls} | ${actualUrls === stats.total_urls ? '✓ MATCH' : '✗ MISMATCH'}`);
console.log(`  Expected Lines: ${stats.total_lines} | Actual: ${actualLines} | ${Math.abs(actualLines - stats.total_lines) <= 1 ? '✓ MATCH' : '✗ MISMATCH'}`);
console.log(`  Expected Chars: ${stats.total_chars} | Actual: ${actualChars} | ${actualChars === stats.total_chars ? '✓ MATCH' : '✗ MISMATCH'}`);

// Step 5: Display preview from downloaded file
const lines = xmlContent.split('\n');

console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
console.log('║                  FIRST 100 LINES                                  ║');
console.log('╚═══════════════════════════════════════════════════════════════════╝\n');
console.log(lines.slice(0, 100).join('\n'));

console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
console.log('║                   LAST 20 LINES                                   ║');
console.log('╚═══════════════════════════════════════════════════════════════════╝\n');
console.log(lines.slice(-20).join('\n'));

console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
console.log('║                    DOWNLOAD COMPLETE!                             ║');
console.log('╚═══════════════════════════════════════════════════════════════════╝');
console.log(`\nFile saved as: ${filename}`);
console.log('You can now use this sitemap file.\n');