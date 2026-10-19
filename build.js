const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');

console.log('[BUILD] Preparing dist folder...');

// Clean and create dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy all HTML files
const files = fs.readdirSync(rootDir);
for (const file of files) {
  if (file.endsWith('.html')) {
    fs.copyFileSync(path.join(rootDir, file), path.join(distDir, file));
    console.log(`Copied ${file}`);
  }
}

// Recursively copy assets folder
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const assetsSrc = path.join(rootDir, 'assets');
const assetsDest = path.join(distDir, 'assets');
if (fs.existsSync(assetsSrc)) {
  console.log('[BUILD] Copying assets...');
  copyDir(assetsSrc, assetsDest);
}

// Copy assets_map.json if present
const mapSrc = path.join(rootDir, 'assets_map.json');
if (fs.existsSync(mapSrc)) {
  fs.copyFileSync(mapSrc, path.join(distDir, 'assets_map.json'));
}

// Copy _headers and _redirects if present
const headersSrc = path.join(rootDir, '_headers');
if (fs.existsSync(headersSrc)) {
  fs.copyFileSync(headersSrc, path.join(distDir, '_headers'));
  console.log('Copied _headers to dist');
}

console.log('[BUILD] Build completed successfully into dist/');
