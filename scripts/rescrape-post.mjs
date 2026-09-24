/**
 * Re-scrape and update a single post by slug
 * Usage: node scripts/rescrape-post.mjs <slug>
 */
import cloudscraper from "cloudscraper";
import * as cheerio from "cheerio";
import * as https from "https";
import * as http from "http";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const JSON_FILE = resolve(__dirname, "..", "data", "scraped.json");
const POSTS_DIR = resolve(__dirname, "..", "data", "posts");

const SOURCE_HOST = "www.sarkariexam.com";
const SITE_HOST   = "www.aiexamresult.com";
const SITE_NAME   = "All India Exam Result";
const SITE_URL    = `https://${SITE_HOST}`;
const FETCH_TIMEOUT = 20000;

const SLUG = process.argv[2];
if (!SLUG) { console.error("Usage: node scripts/rescrape-post.mjs <slug>"); process.exit(1); }

const postFile = resolve(POSTS_DIR, `${SLUG}.json`);
if (!existsSync(postFile)) { console.error(`Post not found: ${postFile}`); process.exit(1); }

const existing = JSON.parse(readFileSync(postFile, "utf8"));
console.log(`Re-scraping: ${existing.title}`);
console.log(`Source: https://${SOURCE_HOST}/${SLUG}/\n`);

// ── Helpers ──────────────────────────────────────────────────────────────────
const COMPETITOR_PATTERNS = [
  /sarkari\s*result(?:\.com)?(?:\.cm)?/gi,
  /sarkari\s*exam(?:\.com)?/gi,
  /Author\s*:\s*Sarkari\s*(Exam|Result)\s*Team/gi,
  /Join\s+(?:our\s+)?(?:WhatsApp|Telegram)\s+(?:Channel|Group)/gi,
  /Download\s+(?:Our\s+)?(?:Mobile\s+App|App)/gi,
];

function cleanText(text) {
  if (!text) return "";
  let t = text;
  for (const pat of COMPETITOR_PATTERNS) t = t.replace(pat, SITE_NAME);
  return t.replace(/\s{2,}/g, " ").trim();
}

function dedup(label) {
  if (!label) return "";
  const clean = label.trim();
  const half  = Math.floor(clean.length / 2);
  if (clean.length > 4 && clean.slice(0, half) === clean.slice(half)) return clean.slice(0, half).trim();
  return clean;
}

function isBlockedLink(url, label) {
  if (!url || url === "#" || url.startsWith("javascript:")) return true;
  const lu = url.toLowerCase();
  const ll = (label || "").toLowerCase();
  // Allow wp-content PDFs (admit cards, notifications, syllabus)
  if (lu.includes("sarkariexam.com/wp-content/")) return false;
  if (/sarkariresult|sarkariexam|rojgarresult|resultbharat|sarkarialert|naukaritime|freejobalert|instagram|whatsapp|telegram|t\.me|play\.google|youtube|facebook|twitter|x\.com/i.test(lu)) return true;
  if (/sarkari\s*result|sarkari\s*exam|rojgar\s*result|result\s*bharat|whatsapp|telegram|instagram|mobile\s*app|join\s*channel|download\s*app/i.test(ll)) return true;
  return false;
}

async function fetchHtml(url) {
  try {
    const html = await new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error("Timeout")), FETCH_TIMEOUT);
      cloudscraper({ uri: url, method: "GET" })
        .then(h => { clearTimeout(t); resolve(h); })
        .catch(e => { clearTimeout(t); reject(e); });
    });
    return html;
  } catch {
    return new Promise((res, rej) => {
      const u = new URL(url);
      const mod = u.protocol === "https:" ? https : http;
      mod.get(url, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: FETCH_TIMEOUT }, (r) => {
        let d = ""; r.on("data", c => d += c); r.on("end", () => res(d));
      }).on("error", rej);
    });
  }
}

// ── Scrape ───────────────────────────────────────────────────────────────────
const sourceUrl = `https://${SOURCE_HOST}/${SLUG}/`;
const html = await fetchHtml(sourceUrl);
const $ = cheerio.load(html);

// Extract all table links
const importantLinks = [];
const seenUrls = new Set();

$("div.newtable2 table tr, table tr").each((_, row) => {
  const tds = $(row).find("td");
  if (tds.length < 2) return;
  const labelBase = dedup(tds.eq(0).text().trim());
  tds.eq(1).find("a[href]").each((__, a) => {
    const href  = $(a).attr("href") || "";
    const aText = dedup($(a).text().trim());
    if (!href || seenUrls.has(href) || isBlockedLink(href, labelBase)) return;
    let label = labelBase || aText;
    if (aText && !aText.toLowerCase().includes("click here") && aText.toLowerCase() !== label.toLowerCase()) {
      label = labelBase ? `${labelBase} (${aText})` : aText;
    }
    label = cleanText(dedup(label));
    if (!label || label.length < 3) return;
    seenUrls.add(href);
    importantLinks.push({ label, url: href });
  });
});

console.log(`Found ${importantLinks.length} links:`);
importantLinks.forEach(l => console.log(`  [${l.label}] → ${l.url}`));

// Update the post
const now = new Date().toISOString();
existing.importantLinks = importantLinks.slice(0, 15);
existing.updatedAt = now;

// Rebuild fullContentHtml Important Links section
const cat = existing.category;
let html2 = existing.fullContentHtml;
// Replace just the Important Links section
const linksHtml = importantLinks.length > 0
  ? `<h2>Important Links</h2><ul>\n` + importantLinks.map(l => `<li><a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.label}</a></li>`).join("\n") + `\n</ul>`
  : "";

// Replace existing Important Links section
html2 = html2.replace(/<h2>Important Links<\/h2><ul>[\s\S]*?<\/ul>/, linksHtml);
existing.fullContentHtml = html2;

writeFileSync(postFile, JSON.stringify(existing, null, 2), "utf8");
console.log(`\n✅ Post updated: ${postFile}`);

// Also update scraped.json listing entry
const data = JSON.parse(readFileSync(JSON_FILE, "utf8"));
const CATEGORIES = ["results","admitCards","latestJobs","answerKeys","documents","admissions"];
for (const cat of CATEGORIES) {
  const idx = (data[cat] || []).findIndex(x => x.slug === SLUG);
  if (idx !== -1) {
    console.log(`✅ Found in category: ${cat}`);
    break;
  }
}
writeFileSync(JSON_FILE, JSON.stringify(data, null, 2), "utf8");
console.log("✅ scraped.json updated");
