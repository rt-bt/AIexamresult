import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.resolve(__dirname, "..", "data", "posts");

function cleanLabel(label) {
  if (!label) return "";
  let clean = label.trim();
  const half = Math.floor(clean.length / 2);
  if (clean.length > 4 && clean.slice(0, half) === clean.slice(half)) {
    clean = clean.slice(0, half).trim();
  }
  return clean;
}

function fixPosts() {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".json"));
  let updatedCount = 0;

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const post = JSON.parse(content);
      let changed = false;

      if (post.importantLinks && Array.isArray(post.importantLinks)) {
        post.importantLinks = post.importantLinks.map(link => {
          const cleaned = cleanLabel(link.label);
          if (cleaned !== link.label) {
            changed = true;
            return { ...link, label: cleaned };
          }
          return link;
        });
      }

      if (post.fullContentHtml && typeof post.fullContentHtml === "string") {
        const newHtml = post.fullContentHtml.replace(/<a([^>]+)>([^<]+)<\/a>/g, (match, attrs, text) => {
          const cleaned = cleanLabel(text);
          if (cleaned !== text) {
            changed = true;
            return `<a${attrs}>${cleaned}</a>`;
          }
          return match;
        });
        post.fullContentHtml = newHtml;
      }

      if (changed) {
        fs.writeFileSync(filePath, JSON.stringify(post, null, 2), "utf8");
        updatedCount++;
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  }

  console.log(`Cleaned up link labels in ${updatedCount} post JSON files.`);
}

fixPosts();
