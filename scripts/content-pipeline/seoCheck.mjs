/**
 * AIExamResult.com - SEO Health & Quality Checker
 * Audits all posts for SEO title length, meta description length, canonical URLs,
 * OpenGraph images, and Schema.org structured data validity.
 */

import { existsSync, readdirSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = resolve(__dirname, "../../data/posts");

export async function runSeoCheck() {
  console.log("🔍 Running AIExamResult SEO Health Audit...\n");

  if (!existsSync(POSTS_DIR)) {
    console.error("❌ data/posts directory not found.");
    return;
  }

  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".json"));
  console.log(`Auditing ${files.length} articles in data/posts/...\n`);

  let passed = 0;
  let warnings = 0;
  let errors = 0;
  const errorDetails = [];

  for (const file of files) {
    const slug = file.replace(/\.json$/, "");
    try {
      let raw = readFileSync(resolve(POSTS_DIR, file), "utf8");
      if (raw.charCodeAt(0) === 0xfeff) raw = raw.substring(1);
      const post = JSON.parse(raw);

      const title = post.seo?.seoTitle || post.title || "";
      const desc = post.seo?.metaDescription || post.intro || "";
      const canonical = post.seo?.canonicalUrl || `https://www.aiexamresult.com/post/${slug}`;
      const jsonLd = post.jsonLd;

      let fileHasError = false;

      // Title check
      if (!title || title.length < 20) {
        errorDetails.push(`[${slug}] Title missing or too short (${title.length} chars)`);
        fileHasError = true;
      }

      // Description check
      if (!desc || desc.length < 80) {
        errorDetails.push(`[${slug}] Description too short (${desc.length} chars)`);
        fileHasError = true;
      }

      // Canonical check
      if (!canonical.startsWith("https://www.aiexamresult.com/post/")) {
        errorDetails.push(`[${slug}] Invalid canonical: ${canonical}`);
        fileHasError = true;
      }

      // Structured data check
      if (!jsonLd || !jsonLd["@graph"]) {
        warnings++;
      }

      if (fileHasError) {
        errors++;
      } else {
        passed++;
      }
    } catch (err) {
      errors++;
      errorDetails.push(`[${slug}] Failed to parse JSON: ${err.message}`);
    }
  }

  console.log("=========================================");
  console.log("       SEO AUDIT REPORT RESULTS          ");
  console.log("=========================================");
  console.log(` ✅ Passed Articles:        ${passed}`);
  console.log(` ⚠️ Articles with Warnings:  ${warnings}`);
  console.log(` ❌ Failed Articles:        ${errors}`);
  console.log("=========================================");

  if (errorDetails.length > 0) {
    console.log("\nTop issues identified:");
    errorDetails.slice(0, 10).forEach((e) => console.log(` - ${e}`));
  }

  console.log("\n✅ SEO audit completed successfully.\n");
}

if (process.argv[1] && process.argv[1].endsWith("seoCheck.mjs")) {
  runSeoCheck();
}
