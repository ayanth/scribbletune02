/**
 * Setup script to copy db.json to frontend directory for build process
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendDir = path.join(__dirname, '..');
const frontendDbJsonPath = path.join(frontendDir, 'db.json');

// In Docker, db.json is copied to the current working directory (/app)
const dockerDbJsonPath = path.join(process.cwd(), 'db.json');

// For local development, look in project root
const projectRoot = path.join(__dirname, '..', '..');
const localDbJsonPath = path.join(projectRoot, 'db.json');

try {
  let sourceDbJsonPath = null;
  
  console.log('🔍 Looking for db.json...');
  console.log('   Docker path:', dockerDbJsonPath);
  console.log('   Local path:', localDbJsonPath);
  
  // Check if db.json exists in Docker working directory first (for Docker builds)
  if (fs.existsSync(dockerDbJsonPath)) {
    sourceDbJsonPath = dockerDbJsonPath;
    console.log('📁 Found db.json in Docker working directory');
  }
  // Check if db.json exists in project root (for local builds)
  else if (fs.existsSync(localDbJsonPath)) {
    sourceDbJsonPath = localDbJsonPath;
    console.log('📁 Found db.json in project root');
  }
  else {
    console.error('❌ db.json not found in any expected location');
    console.error('   Current working directory:', process.cwd());
    console.error('   Script directory:', __dirname);
    console.error('   Docker path:', dockerDbJsonPath);
    console.error('   Local path:', localDbJsonPath);
    
    // List files in current directory for debugging
    console.log('   Files in current directory:');
    try {
      const files = fs.readdirSync(process.cwd());
      files.forEach(file => console.log('     -', file));
    } catch (e) {
      console.log('     Could not list files:', e.message);
    }
    
    process.exit(1);
  }

  // Copy db.json to frontend directory
  fs.copyFileSync(sourceDbJsonPath, frontendDbJsonPath);
  console.log('✅ Copied db.json to frontend directory');

} catch (error) {
  console.error('❌ Error copying db.json:', error);
  process.exit(1);
}