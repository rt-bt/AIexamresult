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
    } else if (file === 'page.tsx') {
      results.push(full);
    }
  });
  return results;
}

const pages = walk('./app');

pages.forEach(p => {
  const content = fs.readFileSync(p, 'utf8');
  const dir = path.dirname(p);
  const layoutPath = path.join(dir, 'layout.tsx');
  let hasLayoutMeta = false;
  if (fs.existsSync(layoutPath)) {
    const lContent = fs.readFileSync(layoutPath, 'utf8');
    if (lContent.includes('metadata') || lContent.includes('generateMetadata')) {
      hasLayoutMeta = true;
    }
  }

  const hasPageMeta = content.includes('metadata') || content.includes('generateMetadata');

  if (!hasPageMeta && !hasLayoutMeta) {
    console.log('No metadata defined in page or layout:', p);
  }
});
