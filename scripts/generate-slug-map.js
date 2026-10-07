const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '..', 'data', 'posts');
const files = fs.readdirSync(postsDir);

const slugMap = {};

for (const file of files) {
  if (!file.endsWith('.json')) continue;
  const filePath = path.join(postsDir, file);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw.charCodeAt(0) === 0xFEFF ? raw.substring(1) : raw);
    const baseName = file.replace(/\.json$/, '');
    
    // Map baseName
    slugMap[baseName] = file;
    slugMap[baseName.toLowerCase()] = file;
    
    // Map data.slug
    if (data.slug) {
      slugMap[data.slug] = file;
      slugMap[data.slug.toLowerCase()] = file;
    }
  } catch (e) {
    console.error(`Error reading ${file}:`, e.message);
  }
}

const outputPath = path.join(__dirname, '..', 'data', 'post-slug-map.json');
fs.writeFileSync(outputPath, JSON.stringify(slugMap, null, 2), 'utf-8');
console.log(`Generated post-slug-map.json with ${Object.keys(slugMap).length} entries.`);
