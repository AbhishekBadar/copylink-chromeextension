#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

function validateManifest() {
  const manifestPath = path.join(projectRoot, 'manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    throw new Error('manifest.json not found');
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Required fields for Chrome Web Store
  const requiredFields = [
    'manifest_version',
    'name',
    'version',
    'description',
    'permissions',
    'action',
    'background',
    'content_scripts',
    'icons'
  ];

  const missingFields = requiredFields.filter(field => !(field in manifest));
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required manifest fields: ${missingFields.join(', ')}`);
  }

  // Validate manifest version
  if (manifest.manifest_version !== 3) {
    throw new Error('Extension must use Manifest V3 for Chrome Web Store');
  }

  // Validate version format (should be X.Y.Z or X.Y.Z.W)
  const versionRegex = /^\d+\.\d+\.\d+(\.\d+)?$/;
  if (!versionRegex.test(manifest.version)) {
    throw new Error(`Invalid version format: ${manifest.version}. Should be X.Y.Z or X.Y.Z.W`);
  }

  // Validate name length (max 75 characters for Chrome Web Store)
  if (manifest.name.length > 75) {
    throw new Error(`Extension name too long: ${manifest.name.length}/75 characters`);
  }

  // Validate description length (max 132 characters for Chrome Web Store)
  if (manifest.description.length > 132) {
    throw new Error(`Description too long: ${manifest.description.length}/132 characters`);
  }

  console.log('✅ Manifest validation passed');
  return manifest;
}

function validateIcons() {
  const manifest = JSON.parse(fs.readFileSync(path.join(projectRoot, 'manifest.json'), 'utf8'));
  const requiredSizes = [16, 32, 48, 128];
  
  requiredSizes.forEach(size => {
    const iconPath = manifest.icons[size];
    if (!iconPath) {
      throw new Error(`Missing icon for size ${size}x${size}`);
    }
    
    const fullPath = path.join(projectRoot, iconPath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Icon file not found: ${iconPath}`);
    }
  });

  console.log('✅ Icon validation passed');
}

function validatePermissions() {
  const manifest = JSON.parse(fs.readFileSync(path.join(projectRoot, 'manifest.json'), 'utf8'));
  
  // Check for potentially problematic permissions
  const sensitivePermissions = [
    'bookmarks',
    'browsing', 
    'history',
    'management',
    'nativeMessaging',
    'privacy',
    'system.cpu',
    'system.memory',
    'system.storage',
    'topSites',
    'webNavigation'
  ];

  const usedSensitivePermissions = manifest.permissions.filter(perm => 
    sensitivePermissions.includes(perm)
  );

  if (usedSensitivePermissions.length > 0) {
    console.warn('⚠️  Warning: Using sensitive permissions:', usedSensitivePermissions);
    console.warn('   These may require additional justification for Chrome Web Store review');
  }

  console.log('✅ Permission validation passed');
}

function validateContentScripts() {
  const manifest = JSON.parse(fs.readFileSync(path.join(projectRoot, 'manifest.json'), 'utf8'));
  
  if (manifest.content_scripts) {
    manifest.content_scripts.forEach((script, index) => {
      script.js.forEach(jsFile => {
        const filePath = path.join(projectRoot, jsFile);
        if (!fs.existsSync(filePath)) {
          throw new Error(`Content script file not found: ${jsFile}`);
        }
      });
    });
  }

  console.log('✅ Content scripts validation passed');
}

function validateFileSize() {
  const maxSizeBytes = 128 * 1024 * 1024; // 128 MB limit for Chrome Web Store
  
  function getDirectorySize(dirPath) {
    let totalSize = 0;
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        if (!['node_modules', '.git', 'scripts'].includes(file)) {
          totalSize += getDirectorySize(filePath);
        }
      } else {
        totalSize += stats.size;
      }
    });
    
    return totalSize;
  }

  const totalSize = getDirectorySize(projectRoot);
  const sizeMB = Math.round(totalSize / (1024 * 1024) * 100) / 100;
  
  if (totalSize > maxSizeBytes) {
    throw new Error(`Extension too large: ${sizeMB}MB (max 128MB)`);
  }

  console.log(`✅ Size validation passed: ${sizeMB}MB`);
}

function validateSecurityBestPractices() {
  // Check for potentially unsafe practices
  const jsFiles = [
    'background.js',
    'popup.js',
    'content.js',
    'options.js'
  ];

  jsFiles.forEach(file => {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for eval usage
      if (content.includes('eval(')) {
        console.warn(`⚠️  Warning: Found eval() in ${file} - may be flagged during review`);
      }
      
      // Check for external script loading
      if (content.match(/src\s*=\s*['""]https?:\/\//)) {
        console.warn(`⚠️  Warning: Found external script reference in ${file}`);
      }
    }
  });

  console.log('✅ Security validation passed');
}

function main() {
  console.log('🔍 Validating Chrome Extension for Web Store...\n');

  try {
    validateManifest();
    validateIcons();
    validatePermissions();
    validateContentScripts();
    validateFileSize();
    validateSecurityBestPractices();
    
    console.log('\n🎉 All validations passed! Extension is ready for Chrome Web Store submission.');
  } catch (error) {
    console.error(`\n❌ Validation failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  validateManifest,
  validateIcons,
  validatePermissions,
  validateContentScripts,
  validateFileSize,
  validateSecurityBestPractices
};
