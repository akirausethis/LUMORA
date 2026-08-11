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
  // the file is currently a single line starting with // src/...
  if (content.startsWith('//')) {
    // find the first occurrence of something that looks like code
    const match = content.match(/\/\/[^\n]*?(["']use client["']|import |@layer |const )/);
    if (match) {
        content = content.replace(match[0], match[1]);
    } else {
        // Just remove the comment if it's there
        content = content.replace(/^\/\/.*?(?=\{|<|import|export|const|function)/, '');
    }
  }
  
  // also check if there are other inline comments like // TEXT CONTAINER that absorbed the next line
  // Actually, prettier might not fix everything if statements are merged into a comment.
  // It's safer if I just add newlines before common keywords to break out of comments.
  content = content.replace(/ \/\* /g, '\n/* ');
  content = content.replace(/ \*\//g, ' */\n');
  content = content.replace(/ \/\/ /g, '\n// ');
  
  fs.writeFileSync(f, content);
});
console.log('Fixed comments');
