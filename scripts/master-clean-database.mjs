/**
 * master-clean-database.mjs
 * 
 * Comprehensive database cleaner & quality enforcer:
 * 1. Removes competitor links from all posts.
 * 2. Strict category alignment based on REAL links:
 *    - results: ONLY if actual result/scorecard link exists (not 'out soon' with no link)
 *    - admitCards: ONLY if actual admit card download link exists (exam dates move to documents)
 *    - answerKeys: ONLY if actual answer key download link exists
 *    - latestJobs: ONLY if actual apply link or notification exists
 *    - documents: exam dates, city slips, syllabus, certificates
 * 3. Removes zero-link / corrupt post files so users NEVER see dead/useless posts.
 * 4. Regenerates clean data/scraped.json and data/scraped-data.ts
 */
import { readdirSync, readFileSync, writeFileSync, unlinkSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = resolve(__dirname, "..", "data", "posts");
const DATA_FILE = resolve(__dirname, "..", "data", "scraped-data.ts");
const JSON_FILE = resolve(__dirname, "..", "data", "scraped.json");

const SITE_URL = "https://www.aiexamresult.com";
const SITE_NAME = "All India Exam Result";

const COMPETITOR_PATTERNS = [
  /sarkari\s*result(?:\.com)?(?:\.cm)?/gi,
  /sarkari\s*exam(?:\.com)?/gi,
  /rojgar\s*result(?:\.com)?/gi,
  /result\s*bharat(?:\.com)?/gi,
  /sarkari\s*alert(?:\.net)?/gi,
  /naukari\s*time(?:\.com)?/gi,
  /freejobalert(?:\.com)?/gi,
  /Author\s*:\s*Sarkari\s*(Exam|Result)\s*Team/gi,
  /Tag\s*:\s*[^\n\r<]+/gi,
];

function cleanText(str) {
  if (!str) return "";
  let t = str;
  for (const pat of COMPETITOR_PATTERNS) {
    t = t.replace(pat, SITE_NAME);
  }
  return t.replace(/\s{2,}/g, " ").trim();
}

function cleanLinks(links) {
  if (!Array.isArray(links)) return [];
  const valid = [];
  const seen = new Set();

  for (const l of links) {
    if (!l || !l.url) continue;
    let u = l.url.trim();
    let lbl = (l.label || "").trim();

    // Check blocked domains
    const lu = u.toLowerCase();
    const ll = lbl.toLowerCase();

    if (/sarkariresult|sarkariexam|rojgarresult|resultbharat|sarkarialert|naukaritime|freejobalert|instagram|whatsapp|telegram|t\.me|play\.google|youtube|facebook|twitter|x\.com/i.test(lu)) {
      continue;
    }
    if (/sarkari\s*result|sarkari\s*exam|rojgar\s*result|result\s*bharat|whatsapp|telegram|instagram|mobile\s*app|join\s*channel|download\s*app/i.test(ll)) {
      continue;
    }
    if (u === "#" || u.startsWith("javascript:")) continue;
    if (seen.has(u)) continue;

    seen.add(u);
    valid.push({
      label: cleanText(lbl) || "Official Link",
      url: u,
    });
  }

  return valid;
}

function determineAccurateCategory(title, links, currentCat) {
  const t = (title || "").toLowerCase();
  const linkLabels = links.map(l => (l.label || "").toLowerCase()).join(" ");

  const hasResultLink = /\b(result|scorecard|score\s*card|merit\s*list|marks|rank\s*card|selection\s*list|shortlist)\b/i.test(linkLabels);
  const hasAdmitLink = /\b(admit\s*card|hall\s*ticket|call\s*letter|pravesh\s*patra)\b/i.test(linkLabels);
  const hasAnswerKeyLink = /\b(answer\s*key|response\s*sheet|key\s*objection|model\s*answer)\b/i.test(linkLabels);
  const hasApplyLink = /\b(apply\s*online|online\s*form|registration|candidate\s*login|new\s*registration)\b/i.test(linkLabels);

  // 1. Result: MUST have result in title OR result link, and NOT be 'out soon' without a result link
  if (hasResultLink || (/\b(result|merit list|score card|cut off)\b/i.test(t) && !/\b(out soon|coming soon|expected date)\b/i.test(t))) {
    if (hasResultLink || links.length > 0) return "results";
  }

  // 2. Answer Key: MUST have answer key link, or answer key in title + not an admit card
  if (hasAnswerKeyLink || (/\b(answer key|response sheet)\b/i.test(t) && !hasAdmitLink && !/\b(out soon|coming soon)\b/i.test(t))) {
    return "answerKeys";
  }

  // 3. Admit Card: MUST have an admit card link, or admit card in title without being an exam date/city notice
  if (hasAdmitLink || (/\b(admit card|hall ticket|call letter)\b/i.test(t) && !/\b(exam date|exam city|city intimation|time table|out soon|coming soon)\b/i.test(t))) {
    return "admitCards";
  }

  // 4. Exam Dates, City Slips, Syllabus, Schedules -> documents
  if (/\b(exam date|exam city|city intimation|syllabus|exam pattern|time table|schedule|dv schedule|document verification)\b/i.test(t) ||
      /\b(exam date|city details|syllabus)\b/i.test(linkLabels)) {
    return "documents";
  }

  // 5. Admissions
  if (/\b(admission|counselling|counseling|seat allotment|entrance)\b/i.test(t)) {
    return "admissions";
  }

  // 6. Documents & Certificates
  if (/\b(certificate|pan card|aadhar|voter|ration|scholarship)\b/i.test(t)) {
    return "documents";
  }

  // 7. Latest Jobs
  if (hasApplyLink || /\b(online form|apply online|recruitment|vacancy|vacancies|apprentice|bharti|posts?)\b/i.test(t)) {
    return "latestJobs";
  }

  return currentCat || "latestJobs";
}

function getCategoryLabel(cat) {
  const map = {
    results: "Result",
    admitCards: "Admit Card",
    latestJobs: "Latest Vacancy",
    answerKeys: "Answer Key",
    admissions: "Admission",
    documents: "Documents",
  };
  return map[cat] || "Update";
}

function getCategoryPath(cat) {
  const map = {
    results: "result",
    admitCards: "admit-card",
    latestJobs: "latest-jobs",
    answerKeys: "answer-key",
    admissions: "admission",
    documents: "documents",
  };
  return map[cat] || "latest-jobs";
}

function fixJsonLd(post, newCat) {
  if (!post.jsonLd || !Array.isArray(post.jsonLd["@graph"])) return;
  for (const node of post.jsonLd["@graph"]) {
    if (node["@type"] === "BreadcrumbList" && Array.isArray(node.itemListElement)) {
      for (const item of node.itemListElement) {
        if (item.position === 2) {
          item.name = getCategoryLabel(newCat);
          item.item = `${SITE_URL}/${getCategoryPath(newCat)}`;
        }
      }
    }
  }
}

async function cleanDatabase() {
  console.log("🧹 Starting Master Database Cleanup...");
  const files = readdirSync(POSTS_DIR).filter(f => f.endsWith(".json"));
  console.log(`Found ${files.length} post files in data/posts/`);

  let deletedCount = 0;
  let cleanedCount = 0;
  let reclassifiedCount = 0;

  const validPosts = new Map(); // slug -> post data

  for (const f of files) {
    const filePath = resolve(POSTS_DIR, f);
    try {
      let raw = readFileSync(filePath, "utf8");
      if (raw.charCodeAt(0) === 0xFEFF) raw = raw.substring(1);
      const post = JSON.parse(raw);

      // Check corrupted / junk post
      const title = (post.title || "").trim();
      const slug = post.slug || f.replace(".json", "");
      if (!title || title.startsWith("<head") || title.length < 5 || slug.endsWith(".pdf") || /^[a-z0-9]{4,8}$/i.test(slug)) {
        unlinkSync(filePath);
        deletedCount++;
        continue;
      }

      // Clean links
      const clean = cleanLinks(post.importantLinks);
      if (clean.length === 0) {
        // Post has ZERO valid links. Users cannot apply or do anything.
        unlinkSync(filePath);
        deletedCount++;
        continue;
      }

      // Check / Fix Category
      const oldCat = post.category;
      const newCat = determineAccurateCategory(title, clean, oldCat);

      if (newCat !== oldCat) {
        reclassifiedCount++;
        post.category = newCat;
      }

      post.importantLinks = clean;
      post.title = cleanText(post.title);
      if (post.intro) post.intro = cleanText(post.intro);
      if (post.fullContentHtml) post.fullContentHtml = cleanText(post.fullContentHtml);

      fixJsonLd(post, newCat);

      // Write back cleaned post
      writeFileSync(filePath, JSON.stringify(post, null, 2), "utf8");
      cleanedCount++;
      validPosts.set(slug, post);
    } catch (err) {
      try { unlinkSync(filePath); } catch {}
      deletedCount++;
    }
  }

  console.log(`\nCleanup Results:`);
  console.log(`  ✓ Valid & Clean Posts Kept: ${cleanedCount}`);
  console.log(`  ✓ Reclassified to Correct Category: ${reclassifiedCount}`);
  console.log(`  🗑️  Zero-link & Corrupt Posts Deleted: ${deletedCount}`);

  // Rebuild scraped.json and scraped-data.ts
  console.log(`\nRebuilding data/scraped.json and data/scraped-data.ts...`);

  const categoryBuckets = {
    results: [],
    admitCards: [],
    latestJobs: [],
    answerKeys: [],
    admissions: [],
    documents: [],
  };

  const postsSummary = {};

  for (const [slug, post] of validPosts.entries()) {
    const cat = post.category;
    if (categoryBuckets[cat]) {
      categoryBuckets[cat].push({
        title: post.title,
        url: `/post/${slug}`,
        category: cat,
        slug: slug,
        publishedDate: post.publishedDate || "",
        publishedAt: post.publishedAt || "",
      });
    }

    const lastDate = (post.importantDates || []).find(d => /last/i.test(d));
    postsSummary[slug] = {
      publishedDate: post.publishedDate || "",
      publishedAt: post.publishedAt || "",
      lastDate: lastDate ? lastDate.replace(/^[^:]+:\s*/, "").trim() : undefined,
    };
  }

  // Sort each category by date descending
  for (const cat of Object.keys(categoryBuckets)) {
    categoryBuckets[cat].sort((a, b) => {
      const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return db - da;
    });
    // Cap at 500 per category
    categoryBuckets[cat] = categoryBuckets[cat].slice(0, 500);
    console.log(`  Category [${cat}]: ${categoryBuckets[cat].length} active posts with real links`);
  }

  const finalScrapedData = {
    ...categoryBuckets,
    posts: postsSummary,
    fetchedAt: new Date().toISOString(),
  };

  const jsonStr = JSON.stringify(finalScrapedData, null, 2);
  writeFileSync(JSON_FILE, jsonStr, "utf8");
  writeFileSync(DATA_FILE, `// Auto-generated clean sync - DO NOT EDIT\nexport const scrapedData = ${jsonStr};\n`, "utf8");

  console.log(`\n✅ Database completely cleaned and synchronized!`);
}

cleanDatabase().catch(console.error);
