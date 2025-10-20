import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const prebuild = async () => {
  console.log('\n🚀 Running prebuild tasks...\n');
  
  try {
    console.log('📋 Generating sitemap...');
    const sitemap = await execPromise('node scripts/generate-sitemap.js');
    if (sitemap.stdout) console.log(sitemap.stdout);
    if (sitemap.stderr) console.error(sitemap.stderr);
    
    console.log('🤖 Generating robots.txt...');
    const robots = await execPromise('node scripts/generate-robots.js');
    if (robots.stdout) console.log(robots.stdout);
    if (robots.stderr) console.error(robots.stderr);
    
    console.log('\n✅ Prebuild completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Prebuild failed:', error);
    process.exit(1);
  }
};

prebuild();