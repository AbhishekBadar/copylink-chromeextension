#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const manifest = require(path.join(projectRoot, 'manifest.json'));

// Files and directories to include in the package
const includeFiles = [
  'manifest.json',
  'background.js',
  'content.js',
  'popup.html',
  'popup.js',
  'options.html',
  'options.js',
  'README.md'
];

const includeDirs = [
  'icons',
  'lib'
];

async function createPackage() {
  const version = manifest.version;
  const outputName = `copy-url-qr-extension-v${version}`;
  const outputPath = path.join(projectRoot, `${outputName}.zip`);
  
  // Remove existing package if it exists
  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath);
    console.log(`Removed existing package: ${outputName}.zip`);
  }

  try {
    // Create zip using system zip command (available on macOS/Linux)
    let zipCommand = `zip -r "${outputName}.zip"`;
    
    // Add individual files
    includeFiles.forEach(file => {
      if (fs.existsSync(path.join(projectRoot, file))) {
        zipCommand += ` "${file}"`;
      }
    });
    
    // Add directories
    includeDirs.forEach(dir => {
      if (fs.existsSync(path.join(projectRoot, dir))) {
        zipCommand += ` "${dir}"`;
      }
    });
    
    // Execute zip command
    execSync(zipCommand, { cwd: projectRoot });
    
    // Get file size
    const stats = fs.statSync(outputPath);
    const sizeKB = Math.round(stats.size / 1024);
    
    console.log(`✅ Extension packaged successfully!`);
    console.log(`📦 File: ${outputName}.zip`);
    console.log(`📏 Size: ${sizeKB} KB`);
    console.log(`🎯 Ready for Chrome Web Store upload!`);
    
    return outputPath;
  } catch (error) {
    throw new Error(`Failed to create zip package: ${error.message}`);
  }
}

// Validate that required files exist
function validateFiles() {
  const requiredFiles = [
    'manifest.json',
    'background.js',
    'content.js',
    'popup.html',
    'popup.js',
    'options.html',
    'options.js'
  ];

  const missingFiles = requiredFiles.filter(file => 
    !fs.existsSync(path.join(projectRoot, file))
  );

  if (missingFiles.length > 0) {
    console.error('❌ Missing required files:');
    missingFiles.forEach(file => console.error(`   - ${file}`));
    process.exit(1);
  }

  console.log('✅ All required files present');
}

async function main() {
  console.log('🏗️  Building Chrome Extension Package...\n');
  
  try {
    validateFiles();
    await createPackage();
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { createPackage, validateFiles };
