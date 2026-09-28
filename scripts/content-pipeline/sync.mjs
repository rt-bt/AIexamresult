/**
 * AIExamResult.com - Master Content Discovery, Generation & Publishing Pipeline
 * 
 * Flow:
 * DISCOVER TOPIC -> IDENTIFY EXAM/JOB ENTITY -> FIND OFFICIAL SOURCE -> VERIFY FACTS
 * -> GENERATE ORIGINAL AIEXAMRESULT CONTENT -> CATEGORY CLASSIFICATION -> SEO GENERATION
 * -> DUPLICATE CHECK -> FACT CHECK -> SCHEMA GENERATION -> INTERNAL LINKING
 * -> SITEMAP/DATA UPDATE -> LINT/BUILD CHECK -> GIT COMMIT -> GITHUB PUSH -> VERCEL DEPLOYMENT
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

import { discoverTopics } from "./discover.mjs";
import { researchTopicFacts } from "./research.mjs";
import { generateArticleContent } from "./generate.mjs";
import { checkDuplicate, registerGeneratedSlug } from "./duplicateCheck.mjs";
import { validateArticle } from "./validate.mjs";
import { savePreviewArticle } from "./preview.mjs";
import { updateQueueStatus, QUEUE_STATUS, loadQueue } from "./queue.mjs";
import { saveSyncReport, printSyncSummary, getLatestReport } from "./report.mjs";
import { deployToGitHub } from "./gitDeploy.mjs";
import { updateExistingPost } from "./update.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = resolve(__dirname, "../../data/posts");
const SCRAPED_JSON = resolve(__dirname, "../../data/scraped.json");
const SCRAPED_DATA_TS = resolve(__dirname, "../../data/scraped-data.ts");

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    isDryRun: args.includes("--dry-run"),
    isPublish: args.includes("--publish"),
    isDiscoverOnly: args.includes("--discover"),
    isResearchOnly: args.includes("--research"),
    isGenerateOnly: args.includes("--generate"),
    isValidateOnly: args.includes("--validate"),
    isUpdateOnly: args.includes("--update"),
    isReportOnly: args.includes("--report"),
    limit: parseInt(args.find((a) => a.startsWith("--limit="))?.split("=")[1] || "5", 10),
  };
}

export async function runContentSync() {
  const { isDryRun, isPublish, isDiscoverOnly, isUpdateOnly, isReportOnly, limit } = parseArgs();

  console.log("\n=======================================================");
  console.log("       AIEXAMRESULT.COM AUTOMATED CONTENT PIPELINE     ");
  console.log("=======================================================");
  console.log(` Mode: ${isDryRun ? "🔍 DRY-RUN (Preview Only, No File Changes)" : isPublish ? "🚀 SAFE PUBLISH (Full Validation + Commit + Push)" : "🧪 PREVIEW / STAGING"}`);
  console.log(` Batch Limit: ${limit}`);
  console.log("=======================================================\n");

  // Handle report-only request
  if (isReportOnly) {
    const report = getLatestReport();
    if (report) {
      printSyncSummary(report);
    } else {
      console.log("ℹ️ No previous execution report found in content-sync-report.json.");
    }
    return;
  }

  // Handle update-only request
  if (isUpdateOnly) {
    console.log("🔄 Running update engine on existing recruitment posts...");
    // Example surgical update on existing post
    const sampleSlug = "ssc-cgl-2026";
    const res = await updateExistingPost(sampleSlug, {
      importantDates: [
        "Notification Released: Available on Official SSC Portal",
        "Online Application Window: Open",
        "Exam Date: Scheduled (Refer SSC Calendar)",
      ],
    });
    console.log("Update run finished.", res);
    return;
  }

  const syncStats = {
    mode: isDryRun ? "DRY-RUN" : isPublish ? "SAFE-PUBLISH" : "PREVIEW",
    topicsDiscovered: [],
    articlesGenerated: [],
    articlesUpdated: [],
    articlesSkipped: [],
    validationFailures: [],
    deploymentStatus: "SKIPPED",
    errors: [],
  };

  try {
    // STEP 1: Content Discovery
    const discovered = await discoverTopics({ maxTopics: limit });
    syncStats.topicsDiscovered = discovered;

    if (isDiscoverOnly) {
      console.log("✅ Discovery step finished.");
      return;
    }

    if (!existsSync(POSTS_DIR)) {
      mkdirSync(POSTS_DIR, { recursive: true });
    }

    // Process each discovered topic through the verified pipeline
    for (const topicItem of discovered) {
      console.log(`\n-------------------------------------------------------`);
      console.log(`📌 Processing Topic: "${topicItem.topic}"`);
      console.log(`   Category: ${topicItem.category} | Authority: ${topicItem.authority}`);

      updateQueueStatus(topicItem.slug, { status: QUEUE_STATUS.RESEARCHING });

      // STEP 2: Fact Verification & Official Source Research
      const facts = await researchTopicFacts(topicItem);

      // STEP 3: Duplicate Check
      const dupCheck = checkDuplicate(facts.topic, facts.slug, facts.category);
      if (dupCheck.isDuplicate) {
        console.log(`  ⏭️ Skipped as duplicate (${dupCheck.score}% match): ${dupCheck.reason}`);
        syncStats.articlesSkipped.push({
          topic: facts.topic,
          slug: facts.slug,
          reason: dupCheck.reason,
        });
        updateQueueStatus(topicItem.slug, {
          status: QUEUE_STATUS.SKIPPED,
          duplicateScore: dupCheck.score,
        });
        continue;
      }

      // STEP 4: Original Content Generation
      console.log("  ✍️ Generating 100% original AIExamResult article...");
      const article = generateArticleContent(facts);

      // STEP 5: Quality & SEO Validation Suite
      console.log("  🛡️ Running strict quality, fact, and SEO validation...");
      const validation = validateArticle(article);

      // STEP 6: Save Preview File for Admin Inspection
      savePreviewArticle(article, validation, dupCheck.score);

      if (!validation.isValid) {
        console.warn(`  ❌ Validation failed with ${validation.issues.length} issue(s):`);
        validation.issues.forEach((iss) => console.warn(`     - ${iss}`));
        syncStats.validationFailures.push({
          topic: article.title,
          slug: article.slug,
          issues: validation.issues,
        });
        updateQueueStatus(topicItem.slug, {
          status: QUEUE_STATUS.FAILED,
          error: validation.issues.join("; "),
        });
        continue;
      }

      console.log(`  ✅ Validation PASSED! Preview saved to content-preview/${article.slug}.md`);

      // STEP 7: Publishing (if not dry-run)
      if (isDryRun) {
        console.log(`  [DRY RUN] Proposed publishing:`);
        console.log(`    - URL: https://www.aiexamresult.com/post/${article.slug}`);
        console.log(`    - SEO Title: ${article.seo.seoTitle}`);
        console.log(`    - Meta Description: ${article.seo.metaDescription}`);
        console.log(`    - Official Source: ${facts.authority.portal}`);
        syncStats.articlesGenerated.push({
          title: article.title,
          slug: article.slug,
          category: article.category,
          status: "DRY-RUN PREVIEWED",
        });
      } else {
        // Write post to data/posts/[slug].json
        const postFilePath = resolve(POSTS_DIR, `${article.slug}.json`);
        writeFileSync(postFilePath, JSON.stringify(article, null, 2), "utf8");

        // Register in runtime duplicate index
        registerGeneratedSlug(article.slug, article.title, article.category);

        // Update data/scraped.json and data/scraped-data.ts
        updateScrapedListing(article);

        updateQueueStatus(topicItem.slug, {
          status: QUEUE_STATUS.PUBLISHED,
          duplicateScore: dupCheck.score,
        });

        syncStats.articlesGenerated.push({
          title: article.title,
          slug: article.slug,
          category: article.category,
          status: "PUBLISHED",
        });

        console.log(`  💾 Saved post to data/posts/${article.slug}.json`);
      }
    }

    // STEP 8: Production Build Verification & Git Deployment (Only in publish mode)
    if (isPublish && syncStats.articlesGenerated.length > 0) {
      console.log("\n🏗️ Verifying Next.js production build before Git push...");
      try {
        execSync("npm.cmd run build", { stdio: "inherit" });
        console.log("✅ Production build succeeded!");

        // Deploy to GitHub
        const deployRes = await deployToGitHub({
          commitMessage: `content: publish ${syncStats.articlesGenerated.length} verified exam article(s) [skip ci]`,
        });

        syncStats.deploymentStatus = deployRes.deployed ? "SUCCESS_PUSHED" : "COMMITTED_LOCAL";
      } catch (buildErr) {
        console.error("❌ Production build failed. Aborting Git commit to prevent broken deploy.");
        syncStats.deploymentStatus = "BUILD_FAILED";
        syncStats.errors.push(`Build failed: ${buildErr.message}`);
      }
    } else {
      syncStats.deploymentStatus = isDryRun ? "DRY_RUN_COMPLETE" : "SAVED_LOCAL";
    }
  } catch (err) {
    console.error(`❌ Critical error in content pipeline: ${err.message}`);
    syncStats.errors.push(err.message);
  } finally {
    const finalReport = saveSyncReport(syncStats);
    printSyncSummary(finalReport);
  }
}

/**
 * Update scraped.json and scraped-data.ts so the homepage, category pages,
 * and dynamic sitemaps immediately include the new article.
 */
function updateScrapedListing(article) {
  try {
    let data = {
      results: [],
      admitCards: [],
      latestJobs: [],
      answerKeys: [],
      documents: [],
      admissions: [],
      posts: {},
      fetchedAt: new Date().toISOString(),
    };

    if (existsSync(SCRAPED_JSON)) {
      data = JSON.parse(readFileSync(SCRAPED_JSON, "utf8"));
    }

    const catKey = article.category || "latestJobs";
    if (!Array.isArray(data[catKey])) {
      data[catKey] = [];
    }

    // Prepend to category listing if not already present
    const existingIndex = data[catKey].findIndex((i) => i.slug === article.slug);
    const listingItem = {
      title: article.title,
      url: `/post/${article.slug}`,
      category: article.category,
      slug: article.slug,
      publishedDate: article.publishedDate,
      publishedAt: article.publishedAt,
    };

    if (existingIndex !== -1) {
      data[catKey][existingIndex] = listingItem;
    } else {
      data[catKey].unshift(listingItem);
    }

    // Update posts mapping
    if (!data.posts) data.posts = {};
    data.posts[article.slug] = {
      lastDate: article.lastDate,
      isExpired: false,
      publishedAt: article.publishedAt,
      publishedDate: article.publishedDate,
    };

    data.fetchedAt = new Date().toISOString();

    const jsonStr = JSON.stringify(data, null, 2);
    writeFileSync(SCRAPED_JSON, jsonStr, "utf8");
    writeFileSync(SCRAPED_DATA_TS, `// Auto-generated by clean sync - DO NOT EDIT\nexport const scrapedData = ${jsonStr};\n`, "utf8");
  } catch (err) {
    console.warn(`⚠️ Could not update scraped.json: ${err.message}`);
  }
}

// CLI runner
if (process.argv[1] && process.argv[1].endsWith("sync.mjs")) {
  runContentSync();
}
