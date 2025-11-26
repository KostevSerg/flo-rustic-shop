import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export function viteSeoPlugin() {
  return {
    name: 'vite-plugin-seo-pages',
    
    async closeBundle() {
      console.log('\n🔍 Generating SEO-optimized pages for cities...');
      
      try {
        const { stdout, stderr } = await execAsync('node scripts/generate-seo-pages.mjs');
        
        if (stdout) {
          console.log(stdout);
        }
        
        if (stderr) {
          console.error('⚠️  SEO generation warnings:', stderr);
        }
        
      } catch (error) {
        console.error('❌ Failed to generate SEO pages:', error.message);
        // Don't fail the build, just warn
      }
    }
  };
}
