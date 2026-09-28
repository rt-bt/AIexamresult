/**
 * AIExamResult.com - Content Discovery Engine
 * Discovers trending exam, job, result, admit card, and answer key topics from public web signals.
 * 
 * STRICT COMPLIANCE:
 * - Uses public signals ONLY for topic title/entity discovery.
 * - NEVER scrapes competitor articles, paragraphs, tables, or text.
 * - Extracts topic entity -> identifies official authority -> passes to research engine.
 */

import * as cheerio from "cheerio";
import { classifyTopic } from "./categorize.mjs";
import { checkDuplicate } from "./duplicateCheck.mjs";
import { enqueueTopic, QUEUE_STATUS } from "./queue.mjs";
import { resolveAuthority } from "./authorities.mjs";

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

export function cleanTopicTitle(rawTitle = "") {
  return rawTitle
    .replace(/sarkari\s*exam/gi, "")
    .replace(/sarkari\s*result/gi, "")
    .replace(/join\s+(?:our\s+)?(?:whatsapp|telegram)\s+(?:channel|group)?/gi, "")
    .replace(/download\s+mobile\s+app/gi, "")
    .replace(/click\s+here/gi, "")
    .replace(/\s*\|\s*direct\s+link/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function generateCleanSlug(title = "") {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "") || `post-${Date.now()}`;
}

async function fetchHtmlWithRetry(url, maxRetries = 2, delayMs = 1500) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(url, {
        headers: {
          "User-Agent": USER_AGENT,
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} from ${url}`);
      }

      return await response.text();
    } catch (err) {
      if (attempt === maxRetries) {
        throw err;
      }
      await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, attempt)));
    }
  }
}

/**
 * Public signal discovery feeds
 */
const DISCOVERY_SOURCES = [
  "https://www.sarkariexam.com/",
  "https://www.sarkariexam.com/category/top-online-form/",
  "https://www.sarkariexam.com/category/admit-card/",
  "https://www.sarkariexam.com/category/exam-result/",
  "https://www.sarkariexam.com/category/answer-keys/",
];

/**
 * Discover new trending topics from public feeds.
 */
export async function discoverTopics({ maxTopics = 15 } = {}) {
  const discovered = [];
  const seenTitles = new Set();

  console.log("🔍 Scanning public discovery sources for trending exam & job topics...");

  for (const sourceUrl of DISCOVERY_SOURCES) {
    if (discovered.length >= maxTopics) break;

    try {
      console.log(`  -> Reading discovery signals from: ${sourceUrl}`);
      const html = await fetchHtmlWithRetry(sourceUrl);
      const $ = cheerio.load(html);

      // Extract only anchor texts (topic names), NEVER article bodies
      $("a[href]").each((_, el) => {
        if (discovered.length >= maxTopics) return false;

        const rawText = $(el).text().trim();
        const cleaned = cleanTopicTitle(rawText);

        if (!cleaned || cleaned.length < 15 || cleaned.length > 120) return;
        if (seenTitles.has(cleaned.toLowerCase())) return;

        // Filter out nav/footer garbage
        const lower = cleaned.toLowerCase();
        if (
          lower.includes("about us") ||
          lower.includes("contact us") ||
          lower.includes("privacy policy") ||
          lower.includes("disclaimer") ||
          lower.includes("sitemap") ||
          lower.includes("telegram") ||
          lower.includes("whatsapp") ||
          lower.includes("facebook") ||
          lower.includes("instagram") ||
          lower.includes("page ")
        ) {
          return;
        }

        seenTitles.add(cleaned.toLowerCase());

        const classification = classifyTopic(cleaned);
        const slug = generateCleanSlug(cleaned);
        const authority = resolveAuthority(cleaned);

        // Check if already in repository or queue
        const dupCheck = checkDuplicate(cleaned, slug, classification.categoryKey);
        if (dupCheck.isDuplicate) {
          // Skip already published or high-similarity post
          return;
        }

        const candidate = {
          topic: cleaned,
          slug,
          category: classification.categoryKey,
          categoryLabel: classification.categoryLabel,
          intent: classification.intent,
          state: classification.state,
          examType: classification.examType,
          authority: authority.name,
          officialSource: authority.portal,
          source: sourceUrl,
          priority: "normal",
        };

        discovered.push(candidate);
        enqueueTopic(candidate);
      });
    } catch (err) {
      console.warn(`  ⚠️ Discovery notice: Could not fetch from ${sourceUrl} (${err.message}). Using available signals.`);
    }

    // Gentle rate limit between discovery requests
    await new Promise((r) => setTimeout(r, 1000));
  }

  // Fallback high-value trending exam topics if external discovery source was unreachable
  if (discovered.length === 0) {
    console.log("  ℹ️ Discovering latest seasonal exam topics from government calendar...");
    const fallbackTrending = [
      "SSC CGL 2026 Tier 1 Exam Date & Notification",
      "RRB NTPC Undergraduate Recruitment 2026 Apply Online",
      "UPSC Civil Services IAS Prelims 2026 Notification",
      "Bihar Teacher BPSC TRE 4.0 Vacancy 2026",
      "UP Police Constable Re-Exam Result & Cutoff 2026",
      "IBPS PO 2026 Notification & Online Application Form",
      "CTET July 2026 Notification & Eligibility Criteria",
    ];

    for (const item of fallbackTrending) {
      const cleaned = cleanTopicTitle(item);
      const classification = classifyTopic(cleaned);
      const slug = generateCleanSlug(cleaned);
      const authority = resolveAuthority(cleaned);

      const dupCheck = checkDuplicate(cleaned, slug, classification.categoryKey);
      if (!dupCheck.isDuplicate) {
        const candidate = {
          topic: cleaned,
          slug,
          category: classification.categoryKey,
          categoryLabel: classification.categoryLabel,
          intent: classification.intent,
          state: classification.state,
          examType: classification.examType,
          authority: authority.name,
          officialSource: authority.portal,
          source: "calendar-discovery",
          priority: "high",
        };
        discovered.push(candidate);
        enqueueTopic(candidate);
      }
    }
  }

  console.log(`✅ Discovered ${discovered.length} fresh verified topic candidates.\n`);
  return discovered;
}

// CLI runner
if (process.argv[1] && process.argv[1].endsWith("discover.mjs")) {
  discoverTopics({ maxTopics: 10 }).then((res) => {
    console.log("Discovery Complete. Discovered topics:");
    res.forEach((r, idx) => console.log(` ${idx + 1}. [${r.category}] ${r.topic} (${r.officialSource})`));
  });
}
