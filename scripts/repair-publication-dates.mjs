import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = resolve(__dirname, "..", "data", "posts");
const DATA_FILE = resolve(__dirname, "..", "data", "scraped-data.ts");
const JSON_FILE = resolve(__dirname, "..", "data", "scraped.json");

const CATEGORIES = ["results", "admitCards", "latestJobs", "answerKeys", "documents", "admissions"];

function parseDateRobust(str) {
  if (!str || typeof str !== "string") return null;
  const clean = str
    .replace(/\uFFFD/g, " ")
    .replace(/\u00A0/g, " ")
    .replace(/\s*\|\s*\d{1,2}:\d{2}\s*(?:AM|PM).*/i, "")
    .replace(/[\s:|]+\d{1,2}:\d{2}\s*(?:AM|PM).*$/i, "")
    .trim();

  // Junk strings
  if (/^(click here|download|view|official|notification|merit list)/i.test(clean)) return null;

  // "05 September 2026" or "5 Sep 2026"
  const m1 = clean.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (m1) {
    const d = new Date(`${m1[3]}-${m1[2].substring(0, 3)}-${m1[1].padStart(2, "0")}`);
    if (!isNaN(d.getTime())) return d;
  }

  // "05September 2026" (no space)
  const m2 = clean.match(/^(\d{1,2})([A-Za-z]+)\s+(\d{4})$/);
  if (m2) {
    const d = new Date(`${m2[3]}-${m2[2].substring(0, 3)}-${m2[1].padStart(2, "0")}`);
    if (!isNaN(d.getTime())) return d;
  }

  // "DD-MM-YYYY" or "DD/MM/YYYY"
  const m3 = clean.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m3) {
    const d = new Date(`${m3[3]}-${m3[2].padStart(2, "0")}-${m3[1].padStart(2, "0")}`);
    if (!isNaN(d.getTime())) return d;
  }

  // Standard ISO or RFC strings
  const d = new Date(clean);
  if (!isNaN(d.getTime())) return d;

  return null;
}

function extractDateFromImportantDates(dates) {
  if (!dates || !Array.isArray(dates)) return null;
  const priorityPatterns = [
    /notification\s*date/i,
    /application\s*start/i,
    /start\s*date/i,
    /online\s*start/i,
    /date/i,
  ];

  for (const pat of priorityPatterns) {
    for (const entry of dates) {
      if (pat.test(entry)) {
        const val = entry.replace(/^.*?:/, "").trim();
        const d = parseDateRobust(val);
        if (d) return d;
      }
    }
  }

  for (const entry of dates) {
    const val = entry.replace(/^.*?:/, "").trim();
    const d = parseDateRobust(val);
    if (d) return d;
  }

  return null;
}

function formatStandardDate(d) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function main() {
  console.log("Safe Publication Date Repair & Synchronization");
  console.log("=============================================\n");

  if (!existsSync(JSON_FILE)) {
    console.error("data/scraped.json does not exist!");
    process.exit(1);
  }

  const data = JSON.parse(readFileSync(JSON_FILE, "utf8"));
  const postFiles = existsSync(POSTS_DIR) ? readdirSync(POSTS_DIR).filter(f => f.endsWith(".json")) : [];

  const postMap = new Map();
  console.log(`Analyzing ${postFiles.length} post JSON files in data/posts/...`);

  let postRepaired = 0;
  let postAlreadyValid = 0;

  for (const file of postFiles) {
    const slug = file.replace(/\.json$/, "");
    const lowerSlug = slug.toLowerCase();
    const filePath = resolve(POSTS_DIR, file);
    try {
      const post = JSON.parse(readFileSync(filePath, "utf8"));
      let existingDateStr = post.publishedAt || post.publishedDate || post.createdAt;
      let validDate = parseDateRobust(existingDateStr);

      if (!validDate) {
        validDate = extractDateFromImportantDates(post.importantDates);
      }

      if (validDate) {
        const iso = validDate.toISOString();
        const standardStr = formatStandardDate(validDate);

        let changed = false;
        if (!post.publishedAt) {
          post.publishedAt = iso;
          changed = true;
        }
        if (!post.createdAt) {
          post.createdAt = post.publishedAt || iso;
          changed = true;
        }
        if (!post.publishedDate || !parseDateRobust(post.publishedDate)) {
          post.publishedDate = standardStr;
          changed = true;
        }

        if (changed) {
          writeFileSync(filePath, JSON.stringify(post, null, 2), "utf8");
          postRepaired++;
        } else {
          postAlreadyValid++;
        }

        const record = {
          publishedAt: post.publishedAt,
          createdAt: post.createdAt,
          publishedDate: post.publishedDate,
          lastDate: post.lastDate,
        };
        postMap.set(slug, record);
        postMap.set(lowerSlug, record);
      } else {
        const record = {
          publishedAt: post.publishedAt || undefined,
          createdAt: post.createdAt || undefined,
          publishedDate: post.publishedDate || undefined,
          lastDate: post.lastDate,
        };
        postMap.set(slug, record);
        postMap.set(lowerSlug, record);
      }
    } catch (err) {
      console.warn(`Error reading post file ${file}:`, err.message);
    }
  }

  console.log(`Post files: ${postAlreadyValid} already valid, ${postRepaired} normalized.`);

  // Synchronize listing items in scraped.json
  console.log("\nSynchronizing listing items in scraped.json...");
  let listingRepaired = 0;
  let listingAlreadyValid = 0;
  let listingAssignedPermanent = 0;

  if (!data.posts) data.posts = {};

  for (const cat of CATEGORIES) {
    const items = data[cat] || [];
    for (const item of items) {
      const slug = item.slug || "";
      const fromPost = postMap.get(slug) || postMap.get(slug.toLowerCase());

      const existingParsed = parseDateRobust(item.publishedDate);
      if (existingParsed) {
        // Already has a valid publishedDate! Preserve it.
        if (!item.publishedAt) {
          item.publishedAt = existingParsed.toISOString();
        }
        listingAlreadyValid++;
      } else if (fromPost && (fromPost.publishedDate || fromPost.publishedAt)) {
        // Recover from post file!
        item.publishedDate = fromPost.publishedDate || (fromPost.publishedAt ? formatStandardDate(new Date(fromPost.publishedAt)) : "");
        item.publishedAt = fromPost.publishedAt || (fromPost.publishedDate ? parseDateRobust(fromPost.publishedDate)?.toISOString() : undefined);
        listingRepaired++;
      } else {
        // Post genuinely had NO stored date anywhere. Establish a permanent historical date once.
        // Try to see if title has a month / year
        const titleMonth = (item.title || "").match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i);
        let fallbackDate;
        if (titleMonth) {
          const monthMap = { january:0, february:1, march:2, april:3, may:4, june:5, july:6, august:7, september:8, october:9, november:10, december:11 };
          fallbackDate = new Date(parseInt(titleMonth[2]), monthMap[titleMonth[1].toLowerCase()], 1);
        } else {
          // Fixed static baseline date so it never shifts day to day
          fallbackDate = new Date("2026-09-01T00:00:00.000Z");
        }
        item.publishedDate = formatStandardDate(fallbackDate);
        item.publishedAt = fallbackDate.toISOString();
        listingAssignedPermanent++;
      }

      // Update posts summary cache in scraped.json so listings don't need file reads
      if (slug) {
        if (!data.posts[slug]) data.posts[slug] = {};
        if (item.publishedDate) data.posts[slug].publishedDate = item.publishedDate;
        if (item.publishedAt) data.posts[slug].publishedAt = item.publishedAt;
      }
    }
  }

  console.log(`Listing items: ${listingAlreadyValid} already valid, ${listingRepaired} recovered from post files, ${listingAssignedPermanent} assigned permanent historical baseline.`);

  // Write back data/scraped.json and data/scraped-data.ts
  writeFileSync(JSON_FILE, JSON.stringify(data, null, 2), "utf8");
  const tsContent = `// Auto-generated - DO NOT EDIT\nexport const scrapedData = ${JSON.stringify(data, null, 2)};\n`;
  writeFileSync(DATA_FILE, tsContent, "utf8");

  console.log("\nSuccessfully updated data/scraped.json and data/scraped-data.ts!");
}

main();
