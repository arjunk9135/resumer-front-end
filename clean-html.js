const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../dist/index.html');
const backupPath = path.join(__dirname, '../dist/index.html.bak');

if (fs.existsSync(htmlPath)) {
  // Create backup
  fs.copyFileSync(htmlPath, backupPath);
  
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // Final cleanup passes
  html = html
    .replace(/<script src="https:\/\/replit\.com\/public\/js\/replit-dev-banner\.js"><\/script>/g, '')
    .replace(/,maximum-scale=1/g, '')
    .replace(/\s+/g, ' '); // Minify further

  fs.writeFileSync(htmlPath, html);
  console.log('HTML cleaned successfully');
} else {
  console.error('Error: HTML file not found at', htmlPath);
}