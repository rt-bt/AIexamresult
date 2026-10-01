const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
      results.push(full);
    }
  });
  return results;
}

const files = walk('./app');
const results = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Match metadata object or generateMetadata
  const regex = /description:\s*["'`]([^"'`\n]+)["'`]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const text = match[1].trim();
    if (text.length < 130 && text.length > 5) {
      results.push({ file: f, len: text.length, text });
    }
  }
});

console.log("Found short descriptions (< 130 chars):", results.length);
results.forEach(r => console.log(`[${r.len} chars] ${r.file}\n  --> "${r.text}"`));
