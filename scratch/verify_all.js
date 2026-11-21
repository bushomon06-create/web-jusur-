const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
console.log('Found HTML files:', htmlFiles);

let errors = 0;

// 1. Check index.html hero image
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
if (!indexHtml.includes('assets/images/hero-rehab.jpg')) {
  console.error('FAIL: hero-rehab.jpg not found in index.html');
  errors++;
} else {
  console.log('PASS: hero-rehab.jpg referenced in index.html');
}

if (indexHtml.includes('rehab-animation-card') || indexHtml.includes('rehab-stages-nav')) {
  console.error('FAIL: Old animated SVG / stage elements still present in index.html');
  errors++;
} else {
  console.log('PASS: Old animated SVG completely removed from index.html');
}

// 2. Check hero image exists
const heroImgPath = path.join(rootDir, 'assets', 'images', 'hero-rehab.jpg');
if (!fs.existsSync(heroImgPath)) {
  console.error('FAIL: assets/images/hero-rehab.jpg does not exist');
  errors++;
} else {
  const stat = fs.statSync(heroImgPath);
  console.log('PASS: assets/images/hero-rehab.jpg exists, size:', (stat.size / 1024).toFixed(1), 'KB');
}

// 3. Check all links in HTML files
htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf-8');
  const hrefMatches = content.matchAll(/href="([^"\'#]+)"/g);
  for (const m of hrefMatches) {
    const target = m[1];
    if (target.startsWith('http') || target.startsWith('mailto:') || target.startsWith('tel:') || target.startsWith('javascript:')) continue;
    const resolved = path.join(rootDir, target);
    if (!fs.existsSync(resolved)) {
      console.error(`FAIL: ${file} broken link: ${target}`);
      errors++;
    }
  }
});

console.log('Total errors:', errors);
if (errors === 0) {
  console.log('ALL VERIFICATIONS PASSED SUCCESSFULLY!');
}
