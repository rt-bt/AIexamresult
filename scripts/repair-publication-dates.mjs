import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const POSTS_DIR = resolve(ROOT, "data", "posts");
const DATA_FILE = resolve(ROOT, "data", "scraped-data.ts");
const JSON_FILE = resolve(ROOT, "data", "scraped.json");

const CATEGORIES = ["results", "admitCards", "latestJobs", "answerKeys", "documents", "admissions"];

const NOW = new Date();

// Verified historical dates for posts where scrapers picked application deadlines or future exam months
const KNOWN_CORRECTIONS = {
  "bcece-bsfc-259-post-2026": {
    publishedDate: "25 August 2026",
    publishedAt: "2026-08-25T03:03:00.000Z", // Official post time: 25 August 2026 | 08:33 AM
  },
  "haryana-htet-form-november-2026": {
    publishedDate: "05 September 2026",
    publishedAt: "2026-09-05T03:00:31.000Z", // Official source date: 05 Sep 2026 08:30:31 IST
  },
  "mpesb-si-subedar-2026": {
    publishedDate: "01 September 2026",
    publishedAt: "2026-09-01T13:45:00.000Z", // Official post date: 01 September 2026 | 07:15 PM
  },
};

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

function isFutureDate(d) {
  if (!d || isNaN(d.getTime())) return false;
  return d.getTime() > NOW.getTime();
}

function extractDateFromContent(content) {
  if (!content || typeof content !== "string") return null;

  // Direct patterns for Post Time / Post Date
  const postTimeMatch = content.match(/Post\s*(?:Time|Date)\s*:\s*(\d{1,2}\s+[A-Za-z]+\s+\d{4})/i);
  if (postTimeMatch) {
    const d = parseDateRobust(postTimeMatch[1]);
    if (d && !isFutureDate(d)) return d;
  }

  const startMatch = content.match(/(?:Online\s*Apply\s*Start\s*on|Apply\s*Start\s*Date|Start\s*Date)\s*[:\-]?\s*(\d{1,2}\s+[A-Za-z]+\s+\d{4})/i);
  if (startMatch) {
    const d = parseDateRobust(startMatch[1]);
    if (d && !isFutureDate(d)) return d;
  }

  const notificationMatch = content.match(/(?:Notification\s*Released|Release\s*Date|Notification\s*Date)\s*[:\-]?\s*(\d{1,2}\s+[A-Za-z]+\s+\d{4})/i);
  if (notificationMatch) {
    const d = parseDateRobust(notificationMatch[1]);
    if (d && !isFutureDate(d)) return d;
  }

  return null;
}

function extractDateFromImportantDates(dates, fullText = "") {
  // First check if fullText or raw text contains an explicit Post Date
  if (fullText) {
    const d = extractDateFromContent(fullText);
    if (d) return d;
  }

  if (!dates || !Array.isArray(dates)) return null;

  // Scan entries for explicit Post Time / Start Date
  for (const entry of dates) {
    const d = extractDateFromContent(entry);
    if (d) return d;
  }

  const negativeRegex = /last\s*date|apply\s*online\s*last|closing|deadline|exam\s*date|exam\s*start|fee\s*payment|correction|admit\s*card/i;
  const positivePatterns = [
    /notification\s*date/i,
    /application\s*start/i,
    /start\s*date/i,
    /online\s*start/i,
    /released/i,
  ];

  for (const pat of positivePatterns) {
    for (const entry of dates) {
      if (negativeRegex.test(entry)) continue;
      if (pat.test(entry)) {
        const val = entry.replace(/^.*?:/, "").trim();
        const d = parseDateRobust(val);
        if (d && !isFutureDate(d)) return d;
      }
    }
  }

  // General fallback: any entry not matching negative keywords
  for (const entry of dates) {
    if (negativeRegex.test(entry)) continue;
    const val = entry.replace(/^.*?:/, "").trim();
    const d = parseDateRobust(val);
    if (d && !isFutureDate(d)) return d;
  }

  return null;
}

function formatStandardDate(d) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function main() {
  console.log("Safe Publication Date Repair & Synchronization");
  console.log("=============================================\n");
  console.log("Current time:", NOW.toISOString());

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

      // Check if known verified correction exists
      const known = KNOWN_CORRECTIONS[lowerSlug] || KNOWN_CORRECTIONS[slug];
      if (known) {
        post.publishedDate = known.publishedDate;
        post.publishedAt = known.publishedAt;
        post.createdAt = known.publishedAt;
        post.updatedAt = known.publishedAt;
        writeFileSync(filePath, JSON.stringify(post, null, 2), "utf8");
        postRepaired++;
        const record = {
          publishedAt: post.publishedAt,
          createdAt: post.createdAt,
          publishedDate: post.publishedDate,
          lastDate: post.lastDate,
        };
        postMap.set(slug, record);
        postMap.set(lowerSlug, record);
        console.log(`  [KNOWN FIX] ${file} -> ${post.publishedDate} (${post.publishedAt})`);
        continue;
      }

      let existingDateStr = post.publishedAt || post.publishedDate || post.createdAt;
      let validDate = parseDateRobust(existingDateStr);

      // If existing date is in the future, it is INVALID! Discard it.
      if (validDate && isFutureDate(validDate)) {
        console.warn(`  [FUTURE DATE REJECTED] ${file}: ${existingDateStr} is in future!`);
        validDate = null;
      }

      if (!validDate) {
        // Search content and importantDates
        const allText = (post.intro || "") + " " + (post.fullContentHtml || "") + " " + (post.importantDates || []).join(" ");
        validDate = extractDateFromImportantDates(post.importantDates, allText);
      }

      // If still no past date found, fall back to safe baseline (01 September 2026)
      if (!validDate || isFutureDate(validDate)) {
        validDate = new Date("2026-09-01T00:00:00.000Z");
      }

      const iso = validDate.toISOString();
      const standardStr = formatStandardDate(validDate);

      let changed = false;
      if (post.publishedAt !== iso || !post.publishedAt || isFutureDate(new Date(post.publishedAt))) {
        post.publishedAt = iso;
        changed = true;
      }
      if (!post.createdAt || isFutureDate(new Date(post.createdAt))) {
        post.createdAt = post.publishedAt || iso;
        changed = true;
      }
      if (post.publishedDate !== standardStr || !post.publishedDate || isFutureDate(parseDateRobust(post.publishedDate))) {
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
    } catch (err) {
      console.warn(`Error reading post file ${file}:`, err.message);
    }
  }

  console.log(`Post files: ${postAlreadyValid} already valid, ${postRepaired} repaired/normalized.`);

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
      const lowerSlug = slug.toLowerCase();
      const fromPost = postMap.get(slug) || postMap.get(lowerSlug);
      const known = KNOWN_CORRECTIONS[lowerSlug] || KNOWN_CORRECTIONS[slug];

      if (known) {
        item.publishedDate = known.publishedDate;
        item.publishedAt = known.publishedAt;
        listingRepaired++;
      } else if (fromPost && (fromPost.publishedDate || fromPost.publishedAt)) {
        // Recover from post file!
        item.publishedDate = fromPost.publishedDate || (fromPost.publishedAt ? formatStandardDate(new Date(fromPost.publishedAt)) : "");
        item.publishedAt = fromPost.publishedAt || (fromPost.publishedDate ? parseDateRobust(fromPost.publishedDate)?.toISOString() : undefined);
        listingRepaired++;
      } else {
        const existingParsed = parseDateRobust(item.publishedDate);
        if (existingParsed && !isFutureDate(existingParsed)) {
          if (!item.publishedAt || isFutureDate(new Date(item.publishedAt))) {
            item.publishedAt = existingParsed.toISOString();
          }
          listingAlreadyValid++;
        } else {
          // Safe past baseline
          const fallbackDate = new Date("2026-09-01T00:00:00.000Z");
          item.publishedDate = formatStandardDate(fallbackDate);
          item.publishedAt = fallbackDate.toISOString();
          listingAssignedPermanent++;
        }
      }

      // Update posts summary cache in scraped.json
      if (slug) {
        if (!data.posts[slug]) data.posts[slug] = {};
        data.posts[slug].publishedDate = item.publishedDate;
        data.posts[slug].publishedAt = item.publishedAt;
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
