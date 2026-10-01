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
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(full);
    }
  });
  return results;
}

const files = walk('./app');
console.log('Total files checked:', files.length);

const foundDescriptions = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Match metadata object: description: "..."
  const regex = /export\s+const\s+metadata[\s\S]*?description:\s*["'`]([\s\S]*?)["'`]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    foundDescriptions.push({ file: f, desc: match[1].replace(/\s+/g, ' ').trim() });
  }

  // Match inside generateMetadata
  const genMetaRegex = /export\s+async\s+function\s+generateMetadata[\s\S]*?return\s*\{[\s\S]*?description:\s*([^,\n]+)/g;
  while ((match = genMetaRegex.exec(content)) !== null) {
    foundDescriptions.push({ file: f, expr: match[1].trim(), isDynamic: true });
  }
});

console.log('Static metadata descriptions:');
foundDescriptions.forEach(d => {
  if (d.desc) {
    console.log(`[${d.desc.length} chars] ${d.file}\n   "${d.desc}"\n`);
  } else if (d.isDynamic) {
    console.log(`[Dynamic] ${d.file} -> ${d.expr}`);
  }
});
