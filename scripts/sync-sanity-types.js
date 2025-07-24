#!/usr/bin/env node

/**
 * Script to sync Sanity types and schema from GitHub repository
 * Usage: node sync-sanity-types.js [--output-dir ./lib/sanity]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const GITHUB_REPO = 'manikandareas/genii-studio';
const GITHUB_BRANCH = 'main'; // or 'master' depending on your default branch
const FILES_TO_SYNC = [
  {
    path: 'sanity.types.ts',
    outputName: 'sanity.types.ts'
  },
  {
    path: 'schema.json',
    outputName: 'schema.json'
  }
];

// Parse command line arguments
const args = process.argv.slice(2);
const outputDirIndex = args.indexOf('--output-dir');
const outputDir = outputDirIndex !== -1 && args[outputDirIndex + 1] 
  ? args[outputDirIndex + 1] 
  : './lib/sanity';

/**
 * Download file from GitHub raw URL
 */
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    console.log(`📥 Downloading: ${url}`);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        let data = '';
        
        response.on('data', (chunk) => {
          data += chunk;
        });
        
        response.on('end', () => {
          // Ensure output directory exists
          const dir = path.dirname(outputPath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          // Write file
          fs.writeFileSync(outputPath, data, 'utf8');
          console.log(`✅ Saved: ${outputPath}`);
          resolve(outputPath);
        });
      } else if (response.statusCode === 404) {
        reject(new Error(`File not found: ${url}`));
      } else {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
      }
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Main sync function
 */
async function syncSanityTypes() {
  console.log('🚀 Starting Sanity types sync...');
  console.log(`📁 Output directory: ${outputDir}`);
  console.log(`📦 Repository: ${GITHUB_REPO}`);
  console.log(`🌿 Branch: ${GITHUB_BRANCH}`);
  console.log('');

  try {
    const downloadPromises = FILES_TO_SYNC.map(file => {
      const url = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${file.path}`;
      const outputPath = path.join(outputDir, file.outputName);
      return downloadFile(url, outputPath);
    });

    await Promise.all(downloadPromises);
    
    console.log('');
    console.log('🎉 Sync completed successfully!');
    console.log('');
    console.log('📋 Files synced:');
    FILES_TO_SYNC.forEach(file => {
      console.log(`   • ${file.outputName}`);
    });
    
    // Create index file for easy imports
    const indexContent = `// Auto-generated index file for Sanity types
export * from './sanity.types';
export { default as schema } from './schema.json';
`;
    
    const indexPath = path.join(outputDir, 'index.ts');
    fs.writeFileSync(indexPath, indexContent, 'utf8');
    console.log(`   • index.ts (auto-generated)`);
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  }
}

// Run the sync
if (require.main === module) {
  syncSanityTypes();
}

module.exports = { syncSanityTypes };
