const fs = require('fs');

const files = [
  'src/app/globals.css',
  'src/app/page.tsx',
  'src/components/LandingPage.tsx',
  'src/components/Slider.tsx',
  'src/components/ProductList.tsx',
  'src/components/Footer.tsx',
  'src/app/explore/page.tsx',
  'src/app/portfolio/page.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // Remove dark: classes
  content = content.replace(/dark:[^\s"'\`]+/g, '');
  // Clean up double spaces caused by removing classes
  content = content.replace(/\s{2,}/g, ' ');
  fs.writeFileSync(f, content);
});
console.log('Reverted dark classes');
