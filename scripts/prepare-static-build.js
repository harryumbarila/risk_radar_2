import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Files/directories to temporarily rename during static build
const itemsToHide = [
  'src/pages/api',
  'src/middleware.ts',
];

// Backup directory
const backupDir = path.join(rootDir, '.static-build-backup');

function prepareForStaticBuild() {
  console.log('Preparing for static export...');
  
  // Create backup directory
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Move API routes and middleware to backup
  itemsToHide.forEach((item) => {
    const sourcePath = path.join(rootDir, item);
    const backupPath = path.join(backupDir, item);
    
    if (fs.existsSync(sourcePath)) {
      const backupParent = path.dirname(backupPath);
      if (!fs.existsSync(backupParent)) {
        fs.mkdirSync(backupParent, { recursive: true });
      }
      
      if (fs.statSync(sourcePath).isDirectory()) {
        fs.cpSync(sourcePath, backupPath, { recursive: true });
        fs.rmSync(sourcePath, { recursive: true });
      } else {
        fs.copyFileSync(sourcePath, backupPath);
        fs.unlinkSync(sourcePath);
      }
      console.log(`Moved ${item} to backup`);
    }
  });
}

function restoreAfterBuild() {
  console.log('Restoring files after build...');
  
  if (!fs.existsSync(backupDir)) {
    return;
  }

  // Restore files from backup
  itemsToHide.forEach((item) => {
    const sourcePath = path.join(rootDir, item);
    const backupPath = path.join(backupDir, item);
    
    if (fs.existsSync(backupPath)) {
      const sourceParent = path.dirname(sourcePath);
      if (!fs.existsSync(sourceParent)) {
        fs.mkdirSync(sourceParent, { recursive: true });
      }
      
      if (fs.statSync(backupPath).isDirectory()) {
        fs.cpSync(backupPath, sourcePath, { recursive: true });
      } else {
        fs.copyFileSync(backupPath, sourcePath);
      }
      console.log(`Restored ${item}`);
    }
  });

  // Clean up backup directory
  fs.rmSync(backupDir, { recursive: true });
  console.log('Cleanup complete');
}

const command = process.argv[2];

if (command === 'prepare') {
  prepareForStaticBuild();
} else if (command === 'restore') {
  restoreAfterBuild();
} else {
  console.log('Usage: node prepare-static-build.js [prepare|restore]');
  process.exit(1);
}

