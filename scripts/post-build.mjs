#!/usr/bin/env node
/**
 * Post-build script: Generate SEO-optimized static pages
 * Automatically runs after Vite build on poehali.dev
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

async function main() {
  console.log('\n🔍 Starting post-build SEO optimization...\n');
  
  // Check if dist folder exists
  const distPath = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distPath)) {
    console.log('⚠️  dist/ folder not found. Skipping SEO generation.');
    return;
  }
  
  console.log('📦 Found dist/ folder');
  console.log('🚀 Running SEO pages generator...\n');
  
  try {
    // Run the SEO generator
    const { stdout, stderr } = await execAsync('node scripts/generate-seo-pages.mjs');
    
    if (stdout) {
      console.log(stdout);
    }
    
    if (stderr && !stderr.includes('Debugger')) {
      console.error('⚠️  Warnings:', stderr);
    }
    
    console.log('\n✅ Post-build SEO optimization completed!\n');
    
  } catch (error) {
    console.error('\n❌ Failed to generate SEO pages:', error.message);
    console.error('Build will continue, but SEO pages were not created.\n');
    // Don't fail the build
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Post-build script error:', err);
  process.exit(0); // Don't fail the build
});
