#!/usr/bin/env node

/**
 * Complete prerender execution script
 * This script will:
 * 1. Build the project
 * 2. Run generate-static-pages.js
 * 3. Report detailed results
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execPromise = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('=' .repeat(80));
console.log('COMPLETE PRERENDER EXECUTION');
console.log('=' .repeat(80));
console.log('');

async function runCommand(command, description) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`${description}`);
  console.log(`${'='.repeat(80)}\n`);
  console.log(`Running: ${command}\n`);
  
  try {
    const { stdout, stderr } = await execPromise(command, { 
      cwd: __dirname,
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });
    
    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.error('STDERR:', stderr);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error running command: ${command}`);
    console.error(error.message);
    if (error.stdout) console.log('STDOUT:', error.stdout);
    if (error.stderr) console.error('STDERR:', error.stderr);
    return false;
  }
}

async function countGeneratedFiles() {
  console.log(`\n${'='.repeat(80)}`);
  console.log('VERIFICATION: Counting Generated Files');
  console.log(`${'='.repeat(80)}\n`);
  
  const distPath = path.join(__dirname, 'dist');
  
  if (!fs.existsSync(distPath)) {
    console.log('❌ dist/ folder not found');
    return;
  }
  
  // Count city pages
  let cityCount = 0;
  const cityPath = path.join(distPath, 'city');
  if (fs.existsSync(cityPath)) {
    const cities = fs.readdirSync(cityPath);
    cityCount = cities.filter(city => {
      const indexPath = path.join(cityPath, city, 'index.html');
      return fs.existsSync(indexPath);
    }).length;
  }
  
  // Count product pages
  let productCount = 0;
  const productPath = path.join(distPath, 'product');
  if (fs.existsSync(productPath)) {
    const products = fs.readdirSync(productPath);
    productCount = products.filter(product => {
      const indexPath = path.join(productPath, product, 'index.html');
      return fs.existsSync(indexPath);
    }).length;
  }
  
  // Count static pages
  const staticPages = ['catalog', 'delivery', 'about', 'contacts', 'reviews'];
  let staticCount = 0;
  staticPages.forEach(page => {
    const pagePath = path.join(distPath, page, 'index.html');
    if (fs.existsSync(pagePath)) {
      staticCount++;
    }
  });
  
  const totalCount = cityCount + productCount + staticCount;
  
  console.log('📊 SUMMARY OF GENERATED FILES:');
  console.log(`   ✅ City pages: ${cityCount}`);
  console.log(`   ✅ Product pages: ${productCount}`);
  console.log(`   ✅ Static pages: ${staticCount}`);
  console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`   🎉 Total HTML files: ${totalCount}`);
  console.log('');
  
  // Show sample files
  if (cityCount > 0) {
    const cities = fs.readdirSync(cityPath).slice(0, 5);
    console.log('📄 Sample city pages:');
    cities.forEach(city => {
      const indexPath = path.join(cityPath, city, 'index.html');
      if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf-8');
        const titleMatch = content.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1] : 'No title found';
        console.log(`   /city/${city}/index.html`);
        console.log(`   └─ ${title.substring(0, 70)}...`);
      }
    });
    console.log('');
  }
  
  if (productCount > 0) {
    const products = fs.readdirSync(productPath).slice(0, 3);
    console.log('📦 Sample product pages:');
    products.forEach(product => {
      const indexPath = path.join(productPath, product, 'index.html');
      if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf-8');
        const titleMatch = content.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1] : 'No title found';
        console.log(`   /product/${product}/index.html`);
        console.log(`   └─ ${title.substring(0, 70)}...`);
      }
    });
    console.log('');
  }
  
  if (staticCount > 0) {
    console.log('📋 Static pages:');
    staticPages.forEach(page => {
      const pagePath = path.join(distPath, page, 'index.html');
      if (fs.existsSync(pagePath)) {
        const content = fs.readFileSync(pagePath, 'utf-8');
        const titleMatch = content.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1] : 'No title found';
        console.log(`   /${page}/index.html`);
        console.log(`   └─ ${title}`);
      }
    });
    console.log('');
  }
  
  return { cityCount, productCount, staticCount, totalCount };
}

async function main() {
  const startTime = Date.now();
  
  // Step 1: Build the project
  const buildSuccess = await runCommand('npm run build', 'STEP 1/3: Building Project');
  
  if (!buildSuccess) {
    console.log('\n❌ Build failed. Cannot proceed with prerender.');
    process.exit(1);
  }
  
  console.log('\n✅ Build completed successfully!');
  
  // Step 2: Run the prerender script
  const prerenderSuccess = await runCommand(
    'node scripts/generate-static-pages.js', 
    'STEP 2/3: Running Prerender Script'
  );
  
  if (!prerenderSuccess) {
    console.log('\n❌ Prerender script failed.');
    process.exit(1);
  }
  
  console.log('\n✅ Prerender completed successfully!');
  
  // Step 3: Verify and count files
  const stats = await countGeneratedFiles();
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log(`${'='.repeat(80)}`);
  console.log('✅ PRERENDER EXECUTION COMPLETE');
  console.log(`${'='.repeat(80)}`);
  console.log('');
  console.log(`⏱️  Total execution time: ${duration} seconds`);
  console.log('');
  console.log('📁 Output location: dist/');
  console.log('   - dist/city/[slug]/index.html');
  console.log('   - dist/product/[id]/index.html');
  console.log('   - dist/[page]/index.html');
  console.log('');
  console.log('🚀 Ready to deploy!');
  console.log('');
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
