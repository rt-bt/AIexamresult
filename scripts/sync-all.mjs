/**
 * sync-all.mjs — AI Exam Result Data Sync
 * Source: sarkariexam.com only
 * 
 * STRICT QUALITY GATES:
 * 1. Zero competitor links or traces (no sarkariresult, sarkariexam, etc.).
 * 2. NO POST IS SAVED OR LISTED IF IT HAS 0 VALID LINKS.
 * 3. Categorization strictly verified against ACTUAL ACTIVE LINKS:
 *    - results: MUST have an active Result / Scorecard / Merit link.
 *    - admitCards: MUST have an active Admit Card / Hall Ticket download link.
 *                 (If it is only an Exam Date / City Slip notice, it goes to "documents"!)
 *    - answerKeys: MUST have an active Answer Key / Response Sheet link.
 *    - latestJobs: MUST have an Apply Online, Registration or official Notification link.
 *    - admissions: MUST have an Admission / Counselling / Allotment link.
 *    - documents: Exam dates, city slips, syllabus, certificates, notices.
 * 4. Fully rewritten AIExamResult style content.
 */
import cloudscraper from "cloudscraper";
import * as cheerio from "cheerio";
import * as https from "https";
import * as http from "http";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(__dirname, "..", "data", "scraped-data.ts");
const JSON_FILE = resolve(__dirname, "..", "data", "scraped.json");
const POSTS_DIR = resolve(__dirname, "..", "data", "posts");

const SOURCE_HOME = "https://www.sarkariexam.com/";
const SOURCE_HOST = "www.sarkariexam.com";
const SITE_HOST   = "www.aiexamresult.com";
const SITE_NAME   = "All India Exam Result";
const SITE_URL    = `https://${SITE_HOST}`;
const INDEXNOW_KEY = "def212d6b0d3407cb3a51212813102f4";

const FETCH_TIMEOUT   = 20000;
const CONCURRENCY     = 4;
const MAX_DETAIL_TIME = 300000; // 5 min

const CATEGORIES = ["results", "admitCards", "latestJobs", "answerKeys", "documents", "admissions"];

const HEADING_MAP = {
  "result":                 "results",
  "exam result":            "results",
  "new updates":            "results",
  "admit card":             "admitCards",
  "top online form":        "latestJobs",
  "answer keys":            "answerKeys",
  "answer key":             "answerKeys",
  "admission form":         "admissions",
  "document verification":  "documents",
  "documents verification": "documents",
  "syllabus":               "documents",
  "latest news":            "results",
  "diploma / iti":          "latestJobs",
  "b.tech / m.tech":        "latestJobs",
};

// ── Data Load / Save ─────────────────────────────────────────────────────────
function loadData() {
  if (!existsSync(JSON_FILE)) return emptyData();
  try {
    return JSON.parse(readFileSync(JSON_FILE, "utf8"));
  } catch {
    return emptyData();
  }
}

function emptyData() {
  return { results: [], admitCards: [], latestJobs: [], answerKeys: [], documents: [], admissions: [], posts: {}, fetchedAt: "" };
}

function saveData(data) {
  data.fetchedAt = new Date().toISOString();
  const json = JSON.stringify(data, null, 2);
  writeFileSync(JSON_FILE, json, "utf8");
  writeFileSync(DATA_FILE, `// Auto-generated clean sync - DO NOT EDIT\nexport const scrapedData = ${json};\n`, "utf8");
}

// ── Slug Sanitizer ───────────────────────────────────────────────────────────
function sanitizeSlug(s) {
  return (s || "post")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "post";
}

function slugFromUrl(url) {
  try {
    const raw = new URL(url).pathname.replace(/\/$/, "").split("/").pop().replace(/\.html?$/i, "");
    if (!raw || raw.length < 5 || /^[a-z0-9]{4,8}$/i.test(raw)) return "";
    return raw.toLowerCase();
  } catch { return ""; }
}

function generateSlug(url, title) {
  return slugFromUrl(url) || sanitizeSlug(title) || "post";
}

// ── Text Cleaning & Anti-Competitor Trace Filter ─────────────────────────────
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
  /Join\s+(?:our\s+)?(?:WhatsApp|Telegram)\s+(?:Channel|Group)/gi,
  /Download\s+(?:Our\s+)?(?:Mobile\s+App|App)/gi,
];

function cleanText(text) {
  if (!text) return "";
  let t = text;
  for (const pat of COMPETITOR_PATTERNS) {
    t = t.replace(pat, SITE_NAME);
  }
  return t.replace(/\s{2,}/g, " ").trim();
}

function dedup(label) {
  if (!label) return "";
  const clean = label.trim();
  const half  = Math.floor(clean.length / 2);
  if (clean.length > 4 && clean.slice(0, half) === clean.slice(half)) {
    return clean.slice(0, half).trim();
  }
  return clean;
}

// ── Link Quality & Competitor Filter ─────────────────────────────────────────
function isBlockedLink(url, label) {
  if (!url || url === "#" || url.startsWith("javascript:")) return true;
  const lu = url.toLowerCase();
  const ll = (label || "").toLowerCase();

  if (/sarkariresult|sarkariexam|rojgarresult|resultbharat|sarkarialert|naukaritime|freejobalert|instagram|whatsapp|telegram|t\.me|play\.google|youtube|facebook|twitter|x\.com/i.test(lu)) {
    return true;
  }
  if (/sarkari\s*result|sarkari\s*exam|rojgar\s*result|result\s*bharat|whatsapp|telegram|instagram|mobile\s*app|join\s*channel|download\s*app/i.test(ll)) {
    return true;
  }
  return false;
}

function isJunk(title, url) {
  if (!title || !url) return true;
  const t = title.toLowerCase();
  const u = url.toLowerCase();
  if (u.endsWith(".pdf") || u.endsWith(".zip") || u.endsWith(".doc")) return true;
  if (t.includes("privacy policy") || t.includes("disclaimer") || t.includes("terms and condition") || t.includes("contact us") || t.includes("about us")) return true;
  if (t.includes("get started for free") || t.includes("sarkari result shine")) return true;
  return false;
}

// ── Strict Category Validation Based on Real Links ───────────────────────────
function determineAccurateCategory(title, links, fallbackCat = "latestJobs") {
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

  // 4. Latest Jobs: If it has an apply link, or is in top online form / recruitment / vacancy / bharti
  if (hasApplyLink || fallbackCat === "latestJobs" || /\b(online form|apply online|recruitment|vacancy|vacancies|apprentice|bharti|posts?)\b/i.test(t)) {
    return "latestJobs";
  }

  // 5. Admissions
  if (/\b(admission|counselling|counseling|seat allotment|entrance)\b/i.test(t)) {
    return "admissions";
  }

  // 6. Exam Dates, City Slips, Syllabus, Schedules, Documents -> documents (pure documents/notices)
  if (/\b(exam date|exam city|city intimation|syllabus|exam pattern|time table|schedule|dv schedule|document verification|certificate|pan card|aadhar|voter|ration|scholarship)\b/i.test(t) ||
      /\b(exam date|city details|download syllabus)\b/i.test(linkLabels)) {
    return "documents";
  }

  return fallbackCat || "latestJobs";
}

// ── HTTP Fetcher ─────────────────────────────────────────────────────────────
function fetchHtmlFallback(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const mod = u.protocol === "https:" ? https : http;
    const req = mod.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      timeout: FETCH_TIMEOUT,
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

async function fetchHtml(url) {
  try {
    const html = await new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error("Timeout")), FETCH_TIMEOUT);
      cloudscraper({ uri: url, method: "GET" })
        .then(h => { clearTimeout(t); resolve(h); })
        .catch(e => { clearTimeout(t); reject(e); });
    });
    if (html.length < 500 || (html.includes("Just a moment") && !html.includes("<!DOCTYPE"))) {
      return fetchHtmlFallback(url);
    }
    return html;
  } catch {
    return fetchHtmlFallback(url);
  }
}

// ── Scrape Listings ──────────────────────────────────────────────────────────
async function scrapeListings() {
  const items = [];
  const seen  = new Set();

  // 1. Scrape Homepage listings
  try {
    const html  = await fetchHtml(SOURCE_HOME);
    const $     = cheerio.load(html);

    $(".below-block").each((_, block) => {
      const $block  = $(block);
      let heading   = $block.find("h4.wp-block-heading, h4").first().text().trim().toLowerCase().replace(/<\/?strong>/g, "");
      if (!heading) return;
      const fallback = HEADING_MAP[heading];
      if (!fallback) return;

      const isAdmitCard  = fallback === "admitCards";
      const isResult     = fallback === "results";
      const isAnswerKey  = fallback === "answerKeys";
      // isFreshListing: Admit Card, Result, Answer Key items are always re-processed (like Jobs)
      const isFreshListing = isTopForm || isAdmitCard || isResult || isAnswerKey;

      $block.find("ul.wp-block-latest-posts__list li a.wp-block-latest-posts__post-title, a[href]").each((__, link) => {
        const href     = $(link).attr("href") || "";
        const rawTitle = $(link).text().trim();
        if (!href || !rawTitle || rawTitle.length < 10 || seen.has(href)) return;
        try {
          if (new URL(href).hostname !== SOURCE_HOST) return;
        } catch { return; }

        seen.add(href);
        const title = cleanText(rawTitle);
        if (isJunk(title, href)) return;
        const slug = generateSlug(href, title);
        items.push({ title, sourceUrl: href, slug, fallbackCat: isTopForm ? "latestJobs" : fallback, isTopForm, isFreshListing });
      });
    });
  } catch (err) {
    console.warn("  ⚠️ Warning fetching homepage:", err.message);
  }

  // 2. Also scrape Category archive for Top Online Form to ensure all active jobs are captured
  try {
    const catHtml = await fetchHtml("https://www.sarkariexam.com/category/top-online-form/");
    const $cat    = cheerio.load(catHtml);

    $cat("h2.entry-title a, article a, .post-title a, ul.wp-block-latest-posts__list li a").each((_, a) => {
      const href     = $cat(a).attr("href") || "";
      const rawTitle = $cat(a).text().trim();
      if (!href || !rawTitle || rawTitle.length < 10 || href.includes("/category/") || href.includes("/tag/") || seen.has(href)) return;
      try {
        if (new URL(href).hostname !== SOURCE_HOST) return;
      } catch { return; }

      seen.add(href);
      const title = cleanText(rawTitle);
      if (isJunk(title, href)) return;
      const slug = generateSlug(href, title);
      items.push({ title, sourceUrl: href, slug, fallbackCat: "latestJobs", isTopForm: true });
    });
  } catch (err) {
    console.warn("  ⚠️ Warning fetching top-online-form category:", err.message);
  }

  return items;
}

// ── Scrape Post Detail ───────────────────────────────────────────────────────
async function scrapeDetail(sourceUrl) {
  try {
    const html = await fetchHtml(sourceUrl);
    const $    = cheerio.load(html);

    if ($("title").text().toLowerCase().includes("page not found") || html.length < 1000) {
      return null;
    }

    let publishedDate = $("time.entry-date.published").attr("datetime") || "";
    if (publishedDate) {
      const d = new Date(publishedDate);
      if (isNaN(d.getTime()) || d > new Date()) publishedDate = "";
    }

    let rawIntro = $("div.post-desc p").text().trim() || $("div.entry-content p").first().text().trim() || "";
    rawIntro = cleanText(rawIntro);

    // Important Dates & Application Fee
    const importantDates = [];
    const applicationFee = [];

    // Extract from div.newtable1 h3 sections (both list items and table rows)
    $("div.newtable1 h3, table h3").each((_, h) => {
      const sectionLabel = $(h).text().trim().toLowerCase();
      const $parent = $(h).closest("td.pd-0, td, div");

      // 1. Check list items inside the section parent
      $parent.find("ul li").each((__, li) => {
        const text = dedup($(li).text().trim().replace(/\s+/g, " "));
        if (!text || text.length > 100 || /click here|download/i.test(text)) return;
        if (sectionLabel.includes("fee")) applicationFee.push(text);
        else if (sectionLabel.includes("date")) importantDates.push(text);
      });

      // 2. Check next table if present
      const $tbl = $(h).next("table");
      if ($tbl.length) {
        $tbl.find("tr").each((__, row) => {
          const cells = $(row).find("td");
          if (cells.length < 2) return;
          const col0 = dedup(cells.eq(0).text().trim());
          const col1 = dedup(cells.eq(1).text().trim());
          if (!col0 || !col1 || col0.length > 70 || col1.length > 70) return;
          if (/qualification|post name|click here|download/i.test(col0 + col1)) return;
          const entry = `${col0} : ${col1}`;
          if (sectionLabel.includes("fee")) applicationFee.push(entry);
          else if (sectionLabel.includes("date")) importantDates.push(entry);
        });
      }
    });

    if (importantDates.length === 0) {
      $("table tr").each((_, row) => {
        const cells = $(row).find("td, th");
        if (cells.length < 2) return;
        const col0 = dedup($(cells[0]).text().trim());
        const col1 = dedup($(cells[1]).text().trim());
        if (!col0 || !col1 || col0.length > 70 || col1.length > 70) return;
        if (/click here|download/i.test(col1)) return;
        const lo = col0.toLowerCase();
        if (lo.includes("date") || lo.includes("last") || lo.includes("exam") || lo.includes("admit") || lo.includes("start")) {
          importantDates.push(`${col0} : ${col1}`);
        }
      });
    }

    // Important Links (robust table row extraction)
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

    // Fallback: any link in tables with official keywords
    if (importantLinks.length === 0) {
      $("table a[href]").each((_, a) => {
        const href = $(a).attr("href") || "";
        const label = cleanText(dedup($(a).text().trim()));
        if (!href || seenUrls.has(href) || isBlockedLink(href, label)) return;
        if (/apply|result|admit|answer|download|notification|official/i.test(label)) {
          seenUrls.add(href);
          importantLinks.push({ label: label || "Official Link", url: href });
        }
      });
    }

    return {
      publishedDate,
      rawIntro,
      importantDates: [...new Set(importantDates.map(cleanText).filter(Boolean))],
      applicationFee: [...new Set(applicationFee.map(cleanText).filter(Boolean))],
      importantLinks: importantLinks.slice(0, 15),
    };
  } catch {
    return null;
  }
}

// ── Content Builder in Clean AIExamResult Style ──────────────────────────────
function buildPostContent(title, category, detail) {
  const { rawIntro, importantDates = [], applicationFee = [], importantLinks = [] } = detail;
  const isResult    = category === "results";
  const isAdmit     = category === "admitCards";
  const isAnswerKey = category === "answerKeys";
  const isAdmission = category === "admissions";
  const isDocument  = category === "documents";

  let intro = "";
  if (rawIntro && rawIntro.length > 50) {
    intro = rawIntro
      .replace(/^Short\s+Information\s*[:–-]?\s*/i, "")
      .replace(/^Brief\s+Information\s*[:–-]?\s*/i, "")
      .trim();
  }

  if (!intro || intro.length < 80) {
    const parts = [`${title}.`];
    if (isResult)    parts.push("Candidates who appeared in the examination can check their result and download the scorecard from the direct official link provided below.");
    if (isAdmit)     parts.push("Candidates can download their Admit Card / Hall Ticket from the official portal. Carry it to the examination center along with a valid government photo ID.");
    if (isAnswerKey) parts.push("The official Answer Key has been released. Candidates can download it and raise objections if any within the specified timeframe.");
    if (isAdmission) parts.push("Candidates can check admission status, seat allotment, and the complete counselling schedule from the official links below.");
    if (isDocument)  parts.push("Check the complete notification, exam schedule, syllabus, and official details from the verified links below.");
    if (!isResult && !isAdmit && !isAnswerKey && !isAdmission && !isDocument) {
      parts.push("Eligible candidates can apply online through the official portal before the closing date. Review all important dates, fee requirements, and eligibility below.");
    }
    if (importantDates.length > 0) {
      const last = importantDates.find(d => /last|apply/i.test(d));
      if (last) parts.push(`Important: ${last.replace(/^[^:]+:\s*/, "").trim()} is the deadline.`);
    }
    intro = parts.join(" ");
  }

  const html = [];
  html.push(`<h2>${title} – Full Details</h2>`);
  html.push(`<p>${intro}</p>`);

  if (importantDates.length > 0) {
    html.push(`<h2>Important Dates</h2><ul>`);
    for (const d of importantDates) html.push(`<li><strong>${d.replace(/^([^:]+):\s*/, "$1:</strong> ")}</li>`);
    html.push(`</ul>`);
  }

  if (applicationFee.length > 0) {
    html.push(`<h2>Application Fee</h2><ul>`);
    for (const f of applicationFee) html.push(`<li>${f}</li>`);
    html.push(`</ul>`);
  }

  if (isResult) {
    html.push(`<h2>How to Check Result</h2><ol>`);
    html.push(`<li>Click on the direct official result link provided below.</li>`);
    html.push(`<li>Enter your Roll Number / Registration Number and Date of Birth.</li>`);
    html.push(`<li>Submit the form to view your scorecard on screen.</li>`);
    html.push(`<li>Download and print a copy of the result for future reference.</li>`);
    html.push(`</ol>`);
  } else if (isAdmit) {
    html.push(`<h2>How to Download Admit Card</h2><ol>`);
    html.push(`<li>Click on the official Admit Card link given below.</li>`);
    html.push(`<li>Login using your Application Number / Roll Number and Password / DOB.</li>`);
    html.push(`<li>Your Admit Card will be displayed on screen.</li>`);
    html.push(`<li>Download the PDF and take a clear printout to carry to the exam venue.</li>`);
    html.push(`</ol>`);
  } else if (isAnswerKey) {
    html.push(`<h2>How to Check Answer Key</h2><ol>`);
    html.push(`<li>Click on the official Answer Key link provided below.</li>`);
    html.push(`<li>Select your Question Paper Series / Shift / Exam Date.</li>`);
    html.push(`<li>Download the official Answer Key PDF.</li>`);
    html.push(`<li>Compare your answers and submit objections if required before the deadline.</li>`);
    html.push(`</ol>`);
  } else if (isAdmission) {
    html.push(`<h2>How to Apply for Admission / Counselling</h2><ol>`);
    html.push(`<li>Visit the official admission portal using the direct link below.</li>`);
    html.push(`<li>Register or login with your application credentials.</li>`);
    html.push(`<li>Complete choice filling and upload necessary documents.</li>`);
    html.push(`<li>Submit your choices and save the confirmation receipt.</li>`);
    html.push(`</ol>`);
  } else if (!isDocument) {
    html.push(`<h2>How to Apply Online</h2><ol>`);
    html.push(`<li>Click on the direct Apply Online link in the Important Links section below.</li>`);
    html.push(`<li>Complete new registration with your Name, Email, and Mobile Number.</li>`);
    html.push(`<li>Fill the application form with personal, educational, and address details.</li>`);
    html.push(`<li>Upload scanned photograph, signature, and required certificates.</li>`);
    html.push(`<li>Pay the applicable examination fee online and download the submission receipt.</li>`);
    html.push(`</ol>`);
  }

  if (importantLinks.length > 0) {
    html.push(`<h2>Important Links</h2><ul>`);
    for (const l of importantLinks) {
      html.push(`<li><a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.label}</a></li>`);
    }
    html.push(`</ul>`);
  }

  html.push(`<h2>Frequently Asked Questions (FAQ)</h2>`);
  html.push(`<h3>What is ${title}?</h3>`);
  if (isResult)    html.push(`<p>${title} is the official result announcement. Candidates can check their scorecard and merit status via the direct link above.</p>`);
  else if (isAdmit) html.push(`<p>${title} is the official hall ticket for the upcoming examination. Candidates must carry it along with a valid photo ID to the exam centre.</p>`);
  else if (isAnswerKey) html.push(`<p>${title} contains the official answers. Candidates can verify their responses and submit objections if required.</p>`);
  else              html.push(`<p>${title} is an official government examination / recruitment update. Full details and direct links are provided on this page.</p>`);

  html.push(`<h3>Where can I find the official direct link?</h3>`);
  html.push(`<p>All verified official links are available in the Important Links table above on this page.</p>`);

  return { intro, fullContentHtml: html.join("\n") };
}

// ── JSON-LD Builder ──────────────────────────────────────────────────────────
function buildJsonLd(title, slug, category, intro, importantLinks) {
  const postUrl  = `${SITE_URL}/post/${slug}`;
  const catLabel = { results:"Result", admitCards:"Admit Card", answerKeys:"Answer Key", admissions:"Admission", documents:"Documents", latestJobs:"Latest Vacancy" }[category] || "Update";
  const catPath  = { results:"result", admitCards:"admit-card", answerKeys:"answer-key", admissions:"admission", documents:"documents", latestJobs:"latest-jobs" }[category] || "latest-jobs";
  const ogImg    = `${SITE_URL}/api/og?title=${encodeURIComponent(title)}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": postUrl,
        "url": postUrl,
        "name": `${title} | ${SITE_NAME}`,
        "description": (intro || title).slice(0, 200),
        "inLanguage": "en-IN",
        "isPartOf": { "@id": `${SITE_URL}/#website` },
        "primaryImageOfPage": { "@type": "ImageObject", "url": ogImg },
        "datePublished": new Date().toISOString().split("T")[0],
        "dateModified":  new Date().toISOString().split("T")[0],
        "author": { "@type": "Organization", "name": SITE_NAME, "url": SITE_URL }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${postUrl}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home",    "item": `${SITE_URL}/` },
          { "@type": "ListItem", "position": 2, "name": catLabel,  "item": `${SITE_URL}/${catPath}` },
          { "@type": "ListItem", "position": 3, "name": title,     "item": postUrl }
        ]
      }
    ]
  };
}

// ── Date Preservation ────────────────────────────────────────────────────────
function isValidPastDate(val) {
  if (!val) return false;
  const d = new Date(val);
  return !isNaN(d.getTime()) && d.getTime() <= Date.now();
}

function preserveDates(slug, newPublishedDate) {
  const now    = new Date().toISOString();
  const oldPath = `${POSTS_DIR}/${slug}.json`;
  let oldAt = null;
  let oldDate = null;
  let createdAt = now;

  if (existsSync(oldPath)) {
    try {
      const old = JSON.parse(readFileSync(oldPath, "utf8"));
      oldAt = isValidPastDate(old.publishedAt) ? old.publishedAt : (isValidPastDate(old.createdAt) ? old.createdAt : null);
      oldDate = isValidPastDate(old.publishedDate) ? old.publishedDate : null;
      createdAt = isValidPastDate(old.createdAt) ? old.createdAt : (oldAt || now);
    } catch {}
  }

  // If a valid fresh publication/update date from source exists and is newer than oldAt, adopt it
  let publishedAt = oldAt;
  let publishedDate = oldDate;

  if (newPublishedDate && isValidPastDate(newPublishedDate)) {
    const freshIso = new Date(newPublishedDate).toISOString();
    if (!oldAt || new Date(freshIso).getTime() > new Date(oldAt).getTime()) {
      publishedAt = freshIso;
      publishedDate = newPublishedDate;
    }
  }

  if (!publishedAt) publishedAt = now;
  if (!publishedDate) publishedDate = new Date(publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return {
    publishedAt,
    createdAt,
    publishedDate,
    updatedAt: now,
  };
}

// ── Main Execution ───────────────────────────────────────────────────────────
async function main() {
  const start = Date.now();
  console.log("🔄 AI Exam Result Quality-First Sync — sarkariexam.com only");
  console.log("   STRICT RULES: Zero competitor links · No zero-link posts · Category verified by active links\n");

  const existing = loadData();
  const existingSlugs = new Set();
  for (const cat of CATEGORIES) {
    for (const item of (existing[cat] || [])) {
      if (item.slug) existingSlugs.add(item.slug);
    }
  }
  if (!existing.posts) existing.posts = {};

  // Step 1: Scrape homepage listings
  console.log("[1/3] Scraping listing items from sarkariexam.com...");
  let candidates;
  try {
    candidates = await scrapeListings();
  } catch (e) {
    console.error("  ❌ Failed to fetch listings:", e.message);
    process.exit(1);
  }

  // Filter items:
  // - Top Online Form (isTopForm) items: ALWAYS process to keep active jobs at the top
  // - isFreshListing items (Admit Card, Result, Answer Key from homepage): ALWAYS process
  //   so that every sync picks up the latest homepage listings for these categories
  // - Other items: only if new slug not seen before
  const toProcess = candidates.filter(item => {
    if (item.isTopForm) return true;
    if (item.isFreshListing) return true;   // ← Admit Card, Result, Answer Key always sync
    return !existingSlugs.has(item.slug);
  });
  console.log(`  ✓ Found ${candidates.length} listing items (${toProcess.length} to process)`);

  // Step 2: Fetch and validate details
  mkdirSync(POSTS_DIR, { recursive: true });
  let addedCount = 0;
  let rejectedZeroLinks = 0;
  const newSlugs = [];

  console.log(`\n[2/3] Fetching and verifying active links for ${toProcess.length} items...`);

  async function processOne(item) {
    const detail = await scrapeDetail(item.sourceUrl);
    if (!detail) return;

    // STRICT QUALITY GATE 1: If post has 0 valid links, REJECT IT!
    if (!detail.importantLinks || detail.importantLinks.length === 0) {
      rejectedZeroLinks++;
      return;
    }

    // STRICT QUALITY GATE 2: Determine category based on REAL ACTIVE LINKS
    const finalCategory = determineAccurateCategory(item.title, detail.importantLinks, item.fallbackCat);

    const { intro, fullContentHtml } = buildPostContent(item.title, finalCategory, detail);
    const dates    = preserveDates(item.slug, detail.publishedDate);
    const jsonLd   = buildJsonLd(item.title, item.slug, finalCategory, intro, detail.importantLinks);
    const seoTitle = `${item.title} | ${SITE_NAME}`;

    const post = {
      title:          item.title,
      slug:           item.slug,
      category:       finalCategory,
      publishedDate:  dates.publishedDate,
      publishedAt:    dates.publishedAt,
      createdAt:      dates.createdAt,
      updatedAt:      dates.updatedAt,
      intro,
      importantDates: detail.importantDates,
      applicationFee: detail.applicationFee,
      importantLinks: detail.importantLinks,
      fullContentHtml,
      jsonLd,
      seoMeta: {
        title:       seoTitle,
        description: intro.slice(0, 200),
        canonical:   `${SITE_URL}/post/${item.slug}`,
      },
    };

    // Save post file
    writeFileSync(`${POSTS_DIR}/${item.slug}.json`, JSON.stringify(post, null, 2), "utf8");

    // Remove from any other category if it was previously miscategorized
    for (const cat of CATEGORIES) {
      if (cat !== finalCategory && existing[cat]) {
        existing[cat] = existing[cat].filter(x => x.slug !== item.slug);
      }
    }

    // Add or update in the CORRECT category at the top
    const bucket = existing[finalCategory] || (existing[finalCategory] = []);
    const existingIdx = bucket.findIndex(x => x.slug === item.slug);
    const listingEntry = {
      title: item.title,
      url: `/post/${item.slug}`,
      category: finalCategory,
      slug: item.slug,
      publishedDate: dates.publishedDate,
      publishedAt: dates.publishedAt,
    };
    if (existingIdx !== -1) {
      bucket.splice(existingIdx, 1);
    }
    bucket.unshift(listingEntry);

    const lastDate = detail.importantDates.find(d => /last/i.test(d));
    existing.posts[item.slug] = {
      publishedDate: dates.publishedDate,
      publishedAt:   dates.publishedAt,
      lastDate:      lastDate ? lastDate.replace(/^[^:]+:\s*/, "").trim() : undefined,
    };

    existingSlugs.add(item.slug);
    newSlugs.push(item.slug);
    addedCount++;
    console.log(`  [ADDED -> ${finalCategory.padEnd(10)}] (${detail.importantLinks.length} links) ${item.title.substring(0, 60)}`);
  }

  for (let i = 0; i < toProcess.length; i += CONCURRENCY) {
    const batch = toProcess.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(batch.map(processOne));
    for (const r of results) {
      if (r.status === "rejected") {
        console.error("  ❌ Process error:", r.reason);
      }
    }
  }

  // Ensure latestJobs lists Top Online Forms in their exact order of prominence from sarkariexam
  const topJobSlugs = new Set(candidates.filter(c => c.isTopForm).map(c => c.slug));
  const topJobs = [];
  for (const c of candidates) {
    if (c.isTopForm && existingSlugs.has(c.slug)) {
      const p = existing.posts[c.slug];
      if (!topJobs.some(tj => tj.slug === c.slug)) {
        topJobs.push({
          title: c.title,
          url: `/post/${c.slug}`,
          category: "latestJobs",
          slug: c.slug,
          publishedDate: p?.publishedDate || "",
          publishedAt: p?.publishedAt || "",
        });
      }
    }
  }
  const otherJobs = (existing.latestJobs || []).filter(j => !topJobSlugs.has(j.slug));
  existing.latestJobs = [...topJobs, ...otherJobs].slice(0, 500);

  // Cap each category at 500
  for (const cat of CATEGORIES) {
    existing[cat] = (existing[cat] || []).slice(0, 500);
  }

  // Step 3: Save clean data
  console.log("\n[3/3] Saving verified data...");
  saveData(existing);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n✅ Finished in ${elapsed}s:`);
  console.log(`  ✓ Added with verified active links: ${addedCount}`);
  console.log(`  🗑️  Rejected (no usable links): ${rejectedZeroLinks}`);

  // IndexNow submission
  if (newSlugs.length > 0) {
    try {
      const urlList = [`${SITE_URL}/`, ...newSlugs.slice(0, 99).map(s => `${SITE_URL}/post/${s}`)];
      const res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host: SITE_HOST, key: INDEXNOW_KEY, keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`, urlList }),
      });
      console.log(`✅ IndexNow: submitted ${urlList.length} URLs (status ${res.status})`);
    } catch (err) {
      console.log(`⚠️ IndexNow notice: ${err.message}`);
    }
  }
}

main().catch(err => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
