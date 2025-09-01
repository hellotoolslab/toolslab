const fs = require('fs');
const path = require('path');

// Directories to clean
const dirsToClean = [
  '.next',
  '.vercel',
  'node_modules/.cache',
  '.turbo',
  '.cache',
];

// Files to remove
const filesToRemove = ['.tsbuildinfo', 'tsconfig.tsbuildinfo'];

console.log('🧹 Pre-install cleanup...');

// Clean directories
dirsToClean.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`  ✓ Removed ${dir}`);
  }
});

// Remove files
filesToRemove.forEach((file) => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    console.log(`  ✓ Removed ${file}`);
  }
});

console.log('✅ Pre-install cleanup complete!');
