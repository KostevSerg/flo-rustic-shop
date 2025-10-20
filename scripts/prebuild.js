import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const prebuild = async () => {
  console.log('\n🚀 Running prebuild tasks...\n');
  
  try {
    console.log('📋 Generating sitemap...');
    const { stdout, stderr } = await execPromise('node scripts/generate-sitemap.js');
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log('\n✅ Prebuild completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Prebuild failed:', error);
    process.exit(1);
  }
};

prebuild();
