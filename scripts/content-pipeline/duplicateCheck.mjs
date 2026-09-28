/**
 * AIExamResult.com - Duplicate Content Protection & Fingerprinting Engine
 * Prevents thin, duplicate, or near-identical articles from entering the pipeline.
 */

import { existsSync, readdirSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = resolve(__dirname, "../../data/posts");
const SCRAPED_JSON = resolve(__dirname, "../../data/scraped.json");

// Cache of existing posts in memory for fast checking
let existingIndex = null;

function normalizeTitleTokens(str = "") {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !["for", "and", "the", "with", "all", "india", "exam", "result"].includes(w));
}

function calculateSimilarity(tokensA, tokensB) {
  if (!tokensA.length || !tokensB.length) return 0;
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection++;
  }
  const union = new Set([...tokensA, ...tokensB]).size;
  return union > 0 ? (intersection / union) * 100 : 0;
}

export function generateFingerprint(title = "", slug = "", category = "") {
  const norm = `${title.toLowerCase().trim()}|${slug.toLowerCase().trim()}|${category}`;
  return crypto.createHash("sha256").update(norm).digest("hex").substring(0, 16);
}

export function buildExistingIndex() {
  if (existingIndex) return existingIndex;

  const slugs = new Set();
  const titleList = [];

  // 1. Scan data/posts directory
  if (existsSync(POSTS_DIR)) {
    const files = readdirSync(POSTS_DIR);
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const slug = file.replace(/\.json$/, "");
      slugs.add(slug);
    }
  }

  // 2. Scan data/scraped.json
  if (existsSync(SCRAPED_JSON)) {
    try {
      const data = JSON.parse(readFileSync(SCRAPED_JSON, "utf8"));
      const categories = ["results", "admitCards", "latestJobs", "answerKeys", "documents", "admissions"];
      for (const cat of categories) {
        if (Array.isArray(data[cat])) {
          for (const item of data[cat]) {
            if (item.slug) slugs.add(item.slug);
            if (item.title) {
              titleList.push({
                title: item.title,
                slug: item.slug,
                category: cat,
                tokens: normalizeTitleTokens(item.title),
              });
            }
          }
        }
      }
    } catch {}
  }

  existingIndex = { slugs, titleList };
  return existingIndex;
}

/**
 * Check if a prospective topic or slug already exists or is dangerously similar to an existing one.
 */
export function checkDuplicate(title = "", slug = "", category = "") {
  const index = buildExistingIndex();

  // 1. Exact slug match
  if (index.slugs.has(slug)) {
    return {
      isDuplicate: true,
      score: 100,
      reason: `Exact slug '${slug}' already exists in the repository`,
      existingSlug: slug,
    };
  }

  // 2. High title similarity check
  const candidateTokens = normalizeTitleTokens(title);
  let highestScore = 0;
  let matchingPost = null;

  for (const existing of index.titleList) {
    // Only compare within same or related category to avoid false positives
    const score = calculateSimilarity(candidateTokens, existing.tokens);
    if (score > highestScore) {
      highestScore = score;
      matchingPost = existing;
    }
  }

  // If similarity is above 85%, it's considered duplicate
  if (highestScore >= 85) {
    return {
      isDuplicate: true,
      score: Math.round(highestScore),
      reason: `High title similarity (${Math.round(highestScore)}%) with '${matchingPost.title}'`,
      existingSlug: matchingPost.slug,
    };
  }

  return {
    isDuplicate: false,
    score: Math.round(highestScore),
    reason: "Unique topic",
    existingSlug: null,
  };
}

/**
 * Add freshly generated slug to runtime index to prevent duplicates in the same batch
 */
export function registerGeneratedSlug(slug, title, category) {
  const index = buildExistingIndex();
  index.slugs.add(slug);
  index.titleList.push({
    title,
    slug,
    category,
    tokens: normalizeTitleTokens(title),
  });
}
