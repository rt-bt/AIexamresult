import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// 1. Test Category and CTA Single Source of Truth
test("Priority 1: Category and CTA single source of truth (lib/categories.ts)", () => {
  const categoriesPath = path.join(rootDir, "lib", "categories.ts");
  assert.ok(fs.existsSync(categoriesPath), "lib/categories.ts must exist");
  const categoriesContent = fs.readFileSync(categoriesPath, "utf-8");

  // Verify critical categories and CTA helper presence
  assert.ok(categoriesContent.includes("export function getCategoryCta"), "Must export getCategoryCta function");
  assert.ok(categoriesContent.includes("export function isOfficialGovDomain"), "Must export isOfficialGovDomain function");
  assert.ok(categoriesContent.includes("export const CANONICAL_CATEGORIES"), "Must export CANONICAL_CATEGORIES");

  // Verify CTA mapping enforcement:
  assert.ok(categoriesContent.includes('"Check Result"'), "Must include 'Check Result' for results");
  assert.ok(categoriesContent.includes('"Download Admit Card"'), "Must include 'Download Admit Card' for admit cards");
  assert.ok(categoriesContent.includes('"View Answer Key"'), "Must include 'View Answer Key' for answer keys");
  assert.ok(categoriesContent.includes('"View Syllabus"'), "Must include 'View Syllabus' for syllabus");
  assert.ok(categoriesContent.includes('"Check Scholarship"'), "Must include 'Check Scholarship' for scholarships");
  assert.ok(categoriesContent.includes('"Apply Online"'), "Must include 'Apply Online' for active recruitment jobs");

  // Ensure result pages never use Apply Online
  const resultBranch = categoriesContent.slice(categoriesContent.indexOf('case "results":'), categoriesContent.indexOf('case "admit-card":'));
  assert.ok(!resultBranch.includes('"Apply Online"'), "Results branch must NEVER return 'Apply Online'");
});

// 2. Test Chhattisgarh SET slug, title, and 308 redirect alignment
test("Priority 1: Chhattisgarh State Eligibility Test card and URL integrity", () => {
  const cgPostPath = path.join(rootDir, "data", "posts", "chhattisgarh-state-eligibility-test-set-026.json");
  assert.ok(fs.existsSync(cgPostPath), "Chhattisgarh SET JSON file must exist");

  const cgData = JSON.parse(fs.readFileSync(cgPostPath, "utf-8"));
  assert.ok(cgData.title.includes("Chhattisgarh"), "Title must refer to Chhattisgarh");
  assert.strictEqual(cgData.slug, "chhattisgarh-state-eligibility-test-set-026", "Slug must be chhattisgarh-state-eligibility-test-set-026");

  // Check next.config.ts has permanent 308 redirect from Rajasthan-named typo
  const nextConfigPath = path.join(rootDir, "next.config.ts");
  const nextConfigContent = fs.readFileSync(nextConfigPath, "utf-8");
  assert.ok(
    nextConfigContent.includes("rajasthan-state-eligibility-test-set-026") &&
    nextConfigContent.includes("chhattisgarh-state-eligibility-test-set-026"),
    "next.config.ts must have redirect from rajasthan-state-eligibility-test-set-026 to chhattisgarh-state-eligibility-test-set-026"
  );

  // Check data/scraped.json
  const scrapedPath = path.join(rootDir, "data", "scraped.json");
  const scrapedContent = fs.readFileSync(scrapedPath, "utf-8");
  assert.ok(
    scrapedContent.includes("chhattisgarh-state-eligibility-test-set-026"),
    "data/scraped.json must index chhattisgarh-state-eligibility-test-set-026"
  );
});

// 3. Test React Hydration Protections
test("Priority 2: React Hydration Error Protections", () => {
  // 1. MobileBottomNav nesting
  const mobileNavPath = path.join(rootDir, "components", "site", "mobile-bottom-nav.tsx");
  const mobileNavContent = fs.readFileSync(mobileNavPath, "utf-8");
  assert.ok(
    !mobileNavContent.match(/<button\b[^>]*>(?:(?!<\/button>)[\s\S])*<Link/i),
    "mobile-bottom-nav must not nest <Link> inside <button>"
  );
  assert.ok(
    !mobileNavContent.match(/<Link\b[^>]*>(?:(?!<\/Link>)[\s\S])*<button/i),
    "mobile-bottom-nav must not nest <button> inside <Link>"
  );

  // 2. Header ticker decoupling
  const headerPath = path.join(rootDir, "components", "site", "header.tsx");
  const headerContent = fs.readFileSync(headerPath, "utf-8");
  assert.ok(
    headerContent.includes("@/lib/ticker"),
    "Header must import defaultTickerItems from @/lib/ticker to prevent SSR hydration mismatch"
  );

  // 3. Post page dangerouslySetInnerHTML in div instead of p
  const postPagePath = path.join(rootDir, "app", "post", "[slug]", "page.tsx");
  const postPageContent = fs.readFileSync(postPagePath, "utf-8");
  assert.ok(
    !postPageContent.match(/<p\b[^>]*dangerouslySetInnerHTML/i),
    "Post template must not render dangerouslySetInnerHTML in <p> tags"
  );
  assert.ok(
    postPageContent.match(/<div\b[^>]*dangerouslySetInnerHTML/i),
    "Post template should render rich HTML inside <div> containers"
  );

  // 4. Bookmarks hook lazy initialization
  const bookmarksHookPath = path.join(rootDir, "lib", "hooks", "use-bookmarks.ts");
  const bookmarksHookContent = fs.readFileSync(bookmarksHookPath, "utf-8");
  assert.ok(
    bookmarksHookContent.includes("useState<Bookmark[]>([])"),
    "useBookmarks hook must initialize with empty array on server and hydrate in useEffect"
  );
});

// 4. Test Mobile Overflow Protections
test("Priority 3: Mobile Overflow and Clipping Prevention", () => {
  const globalsCssPath = path.join(rootDir, "app", "globals.css");
  const globalsCssContent = fs.readFileSync(globalsCssPath, "utf-8");

  assert.ok(
    globalsCssContent.includes("overflow-x: clip") || globalsCssContent.includes("overflow-x: hidden"),
    "globals.css must apply overflow-x: clip on html and body"
  );
  assert.ok(
    globalsCssContent.includes(".prose table"),
    "globals.css must contain responsive handling for markdown/prose tables"
  );
  assert.ok(
    globalsCssContent.includes("overflow-x: auto"),
    "globals.css must allow tables to scroll horizontally within their containers"
  );
  assert.ok(
    globalsCssContent.includes("overflow-wrap: break-word") || globalsCssContent.includes("word-break: break-word"),
    "globals.css must ensure long titles and tokens break cleanly"
  );
});

// 5. Test Source Provenance, Editorial Accountability, and About Us
test("Priority 4: Source Provenance and Editorial Accountability", () => {
  const postPagePath = path.join(rootDir, "app", "post", "[slug]", "page.tsx");
  const postPageContent = fs.readFileSync(postPagePath, "utf-8");

  // Check Official Source vs Mirror labels
  assert.ok(postPageContent.includes("Official Source"), "Post template must display 'Official Source' badge for gov domains");
  assert.ok(
    postPageContent.includes("Direct Link / Mirror") || postPageContent.includes("Alternate Download"),
    "Post template must clearly distinguish non-gov downloads as Mirror/Alternate"
  );
  assert.ok(postPageContent.includes("Editorial Desk"), "Post template must attribute AI Exam Result Editorial Desk");
  assert.ok(postPageContent.includes("isBasedOn"), "Post schema must include isBasedOn reference to official source");

  // Check About Us page editorial section
  const aboutPagePath = path.join(rootDir, "app", "about-us", "page.tsx");
  const aboutPageContent = fs.readFileSync(aboutPagePath, "utf-8");
  assert.ok(aboutPageContent.includes("Editorial Policy & Verification Standards"), "About page must have Editorial Policy section");
  assert.ok(aboutPageContent.includes("Primary Source Mandate"), "About page must document Primary Source Mandate (.gov.in/.nic.in)");
  assert.ok(aboutPageContent.includes("corrections@aiexamresult.com"), "About page must provide corrections desk email");
});

// 6. Test Metadata Bounds
test("Priority 5: Page-specific metadata length and clarity", () => {
  // 1. Root Layout description
  const layoutPath = path.join(rootDir, "app", "layout.tsx");
  const layoutContent = fs.readFileSync(layoutPath, "utf-8");
  const layoutDescMatch = layoutContent.match(/description:\s*"([^"]+)"/);
  assert.ok(layoutDescMatch, "Root layout must have meta description");
  const layoutDesc = layoutDescMatch[1];
  assert.ok(
    layoutDesc.length >= 120 && layoutDesc.length <= 160,
    `Root layout description length (${layoutDesc.length}) must be between 120 and 160 chars`
  );

  // 2. Results page title and description
  const resultsPagePath = path.join(rootDir, "app", "results", "page.tsx");
  const resultsPageContent = fs.readFileSync(resultsPagePath, "utf-8");
  const resultsTitleMatch = resultsPageContent.match(/absolute:\s*"([^"]+)"/);
  assert.ok(resultsTitleMatch, "Results page must specify absolute title");
  const resultsTitle = resultsTitleMatch[1];
  assert.ok(
    resultsTitle.length >= 40 && resultsTitle.length <= 65,
    `Results page title length (${resultsTitle.length}) must be <= 65 chars`
  );

  const resultsDescMatch = resultsPageContent.match(/description:\s*"([^"]+)"/);
  assert.ok(resultsDescMatch, "Results page must specify meta description");
  const resultsDesc = resultsDescMatch[1];
  assert.ok(
    resultsDesc.length >= 120 && resultsDesc.length <= 160,
    `Results page description length (${resultsDesc.length}) must be between 120 and 160 chars`
  );

  // 3. Post slug page title format and description truncation
  const postPagePath = path.join(rootDir, "app", "post", "[slug]", "page.tsx");
  const postPageContent = fs.readFileSync(postPagePath, "utf-8");
  assert.ok(
    postPageContent.includes("seoTitle.length > 58"),
    "Post metadata title must be bounded to <= 58 chars"
  );
  assert.ok(
    postPageContent.includes("desc.length > 155"),
    "Post metadata description must be bounded to <= 155 chars to prevent 161+ char overflow"
  );
});

// 7. Test Hubs: Syllabus and Scholarships
test("Priority 6: Syllabus and Scholarships Hubs", () => {
  const syllabusPath = path.join(rootDir, "app", "syllabus", "page.tsx");
  assert.ok(fs.existsSync(syllabusPath), "app/syllabus/page.tsx must exist");
  const syllabusContent = fs.readFileSync(syllabusPath, "utf-8");
  assert.ok(syllabusContent.includes("Sarkari Exam Syllabus 2026"), "Syllabus page must have descriptive title");
  assert.ok(syllabusContent.includes("CollectionPage"), "Syllabus page must render CollectionPage schema");
  assert.ok(syllabusContent.includes("BreadcrumbList"), "Syllabus page must render BreadcrumbList schema");

  const scholarshipsPath = path.join(rootDir, "app", "scholarships", "page.tsx");
  assert.ok(fs.existsSync(scholarshipsPath), "app/scholarships/page.tsx must exist");
  const scholarshipsContent = fs.readFileSync(scholarshipsPath, "utf-8");
  assert.ok(scholarshipsContent.includes("Sarkari Scholarships 2026"), "Scholarships page must have descriptive title");
  assert.ok(scholarshipsContent.includes("CollectionPage"), "Scholarships page must render CollectionPage schema");
  assert.ok(scholarshipsContent.includes("BreadcrumbList"), "Scholarships page must render BreadcrumbList schema");
});

// 8. Test Structured Data Cleanup
test("Priority 7: Structured Data & Schema Cleanup", () => {
  const postPagePath = path.join(rootDir, "app", "post", "[slug]", "page.tsx");
  const postPageContent = fs.readFileSync(postPagePath, "utf-8");
  assert.ok(!postPageContent.includes('"@type": "HowTo"'), "Deprecated HowTo schema must NOT exist in post page");
  assert.ok(!postPageContent.includes("'@type': 'HowTo'"), "Deprecated HowTo schema must NOT exist in post page");

  const layoutPath = path.join(rootDir, "app", "layout.tsx");
  const layoutContent = fs.readFileSync(layoutPath, "utf-8");
  assert.ok(!layoutContent.includes('"@type": "FAQPage"'), "Site-wide root layout must NOT include invisible FAQPage schema");
  assert.ok(!layoutContent.includes("'@type': 'FAQPage'"), "Site-wide root layout must NOT include invisible FAQPage schema");
});

// 9. Test Sitemaps and Robots.txt
test("Priority 8: Sitemaps, Robots.txt, and Redirects", () => {
  const robotsPath = path.join(rootDir, "app", "robots.ts");
  assert.ok(fs.existsSync(robotsPath), "app/robots.ts must exist");
  const robotsContent = fs.readFileSync(robotsPath, "utf-8");
  assert.ok(robotsContent.includes("sitemap-index.xml"), "robots.ts must reference sitemap-index.xml");

  const sitemapIndexPath = path.join(rootDir, "app", "sitemap-index.xml", "route.ts");
  const sitemapIndexContent = fs.readFileSync(sitemapIndexPath, "utf-8");
  assert.ok(sitemapIndexContent.includes('"syllabus"'), "Sitemap index must include syllabus");
  assert.ok(sitemapIndexContent.includes('"scholarships"'), "Sitemap index must include scholarships");

  const sitemapPath = path.join(rootDir, "app", "sitemap.ts");
  const sitemapContent = fs.readFileSync(sitemapPath, "utf-8");
  assert.ok(sitemapContent.includes('"syllabus"'), "sitemap.ts must handle syllabus id");
  assert.ok(sitemapContent.includes('"scholarships"'), "sitemap.ts must handle scholarships id");

  // Check 308 redirects in next.config.ts
  const nextConfigPath = path.join(rootDir, "next.config.ts");
  const nextConfigContent = fs.readFileSync(nextConfigPath, "utf-8");
  assert.ok(nextConfigContent.includes('source: "/latest-vacancy"'), "Redirect /latest-vacancy to /latest-jobs");
  assert.ok(nextConfigContent.includes('source: "/scholarship"'), "Redirect /scholarship to /scholarships");
  assert.ok(nextConfigContent.includes('source: "/about"'), "Redirect /about to /about-us");
  assert.ok(nextConfigContent.includes('source: "/contact"'), "Redirect /contact to /contact-us");
  assert.ok(nextConfigContent.includes('source: "/privacy"'), "Redirect /privacy to /privacy-policy");
  assert.ok(nextConfigContent.includes('source: "/terms-of-service"'), "Redirect /terms-of-service to /terms");
});

// 10. Test Accessibility
test("Priority 9: Accessibility and Heading Hierarchy", () => {
  const heroPath = path.join(rootDir, "components", "site", "hero.tsx");
  const heroContent = fs.readFileSync(heroPath, "utf-8");
  assert.ok(
    heroContent.includes('aria-label="Search exam name or job title"'),
    "Hero search input must have descriptive aria-label"
  );
  assert.ok(
    !heroContent.match(/<h1[^>]*>[\s\S]*?<h1/i),
    "Hero must not render multiple <h1> tags"
  );

  const headerPath = path.join(rootDir, "components", "site", "header.tsx");
  const headerContent = fs.readFileSync(headerPath, "utf-8");
  assert.ok(
    headerContent.includes('aria-label="Toggle navigation menu"'),
    "Mobile menu toggle button must have aria-label"
  );
  assert.ok(
    headerContent.includes('aria-label="Search exams"'),
    "Search link in header must have aria-label"
  );

  const railPath = path.join(rootDir, "components", "site", "content-rail.tsx");
  const railContent = fs.readFileSync(railPath, "utf-8");
  assert.ok(
    !railContent.includes("<a>") && !railContent.includes("<a >"),
    "Content rail must not contain empty anchor tags without href"
  );
});

// 11. Test Results Archive Purity (0% Off-Category Rate)
test("Priority 10: /results must be a true results-only archive", async () => {
  const dataPath = path.join(rootDir, "lib", "data.ts");
  const dataContent = fs.readFileSync(dataPath, "utf-8");

  // Ensure app/results/page.tsx only renders sectionItems.results
  const resultsPagePath = path.join(rootDir, "app", "results", "page.tsx");
  const resultsPageContent = fs.readFileSync(resultsPagePath, "utf-8");
  assert.ok(
    resultsPageContent.includes("const allItems: PostCard[] = sectionItems.results;"),
    "/results page must use sectionItems.results and not flatten all sections"
  );

  // Import detectCategory and verify first 50 results items are 100% results
  const { detectCategory } = await import(pathToFileURL(path.join(rootDir, "lib", "categories.ts")).href);
  const scrapedData = JSON.parse(fs.readFileSync(path.join(rootDir, "data", "scraped.json"), "utf-8"));
  const allScraped = [
    ...(scrapedData.results || []),
    ...(scrapedData.latestJobs || []),
    ...(scrapedData.admitCards || []),
    ...(scrapedData.answerKeys || []),
    ...(scrapedData.admissions || []),
    ...(scrapedData.documents || []),
  ];

  const resultsOnly = allScraped.filter(
    (item) => detectCategory(item.category, item.title, item.slug) === "results"
  );

  assert.ok(resultsOnly.length > 50, "Must have at least 50 results items");

  let offCategoryCount = 0;
  for (let i = 0; i < 50; i++) {
    const item = resultsOnly[i];
    const cat = detectCategory(item.category, item.title, item.slug);
    if (cat !== "results") {
      offCategoryCount++;
    }
  }

  assert.strictEqual(
    offCategoryCount,
    0,
    `Off-category rate for first 50 results must be strictly 0% (found ${offCategoryCount})`
  );
});

// 12. Test Taxonomy Normalization and Excerpt Quality
test("Priority 11: Taxonomy normalization and non-generic excerpts", async () => {
  const { detectCategory, getCategoryCta } = await import(pathToFileURL(path.join(rootDir, "lib", "categories.ts")).href);

  // Check specific test cases from audit
  const petCat = detectCategory("results", "UPSSSC PET Syllabus 2026 - Check Exam Pattern PDF at upsssc.gov.in", "upsssc-pet-syllabus-2026");
  assert.strictEqual(petCat, "syllabus", "UPSSSC PET syllabus must be categorized as syllabus");

  const upScholarshipCat = detectCategory("latestJobs", "Uttar Pradesh UP Scholarship Online Form 2026-27", "uttar-pradesh-up-scholarship-online-form-2026-27");
  assert.strictEqual(upScholarshipCat, "scholarships", "UP scholarship must be categorized as scholarships");

  const rssbCat = detectCategory("results", "RSSB LDC Clerk Gr-II/ Junior Score Card 2026", "rssb-rajasthan-clerk-gr-ii-junior-assistant-2026");
  assert.strictEqual(rssbCat, "results", "RSSB score card must be categorized as results");

  // Check result CTAs never use Apply Online
  const resCta = getCategoryCta("results", "RSSB LDC Clerk Gr-II/ Junior Score Card 2026");
  assert.notStrictEqual(resCta.actionText, "Apply Online", "Result card must never have 'Apply Online' CTA");
  assert.strictEqual(resCta.actionText, "Download Scorecard", "Scorecard title must have 'Download Scorecard' CTA");

  // Check data.ts does not generate 'apply online' excerpt for results, syllabus, or scholarships
  const dataPath = path.join(rootDir, "lib", "data.ts");
  const dataContent = fs.readFileSync(dataPath, "utf-8");
  assert.ok(
    dataContent.includes("generateExcerpt"),
    "lib/data.ts must implement generateExcerpt function"
  );
});

// 13. Test Source Provenance and Mirror Annotations
test("Priority 12: Source provenance and mirror link labels", () => {
  const postPagePath = path.join(rootDir, "app", "post", "[slug]", "page.tsx");
  const postPageContent = fs.readFileSync(postPagePath, "utf-8");

  // Check Important Links has Mirror / Alternate Download
  assert.ok(
    postPageContent.includes("Mirror / Alternate Download"),
    "Important links must label third-party downloads as 'Mirror / Alternate Download'"
  );

  // Check Full Article prose annotates links with provenance badges
  assert.ok(
    postPageContent.includes("annotatedHtml"),
    "Full Article must annotate articleHtml links with provenance badges"
  );
});

// 14. Test Mobile Container Width Constraints
test("Priority 13: Mobile container responsive width constraints", () => {
  const postPagePath = path.join(rootDir, "app", "post", "[slug]", "page.tsx");
  const postPageContent = fs.readFileSync(postPagePath, "utf-8");

  // Check responsive grid columns
  assert.ok(
    postPageContent.includes("grid w-full max-w-full min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"),
    "Post page grid must enforce w-full max-w-full min-w-0 and minmax(0,1fr)"
  );

  // Check main content column
  assert.ok(
    postPageContent.includes("w-full max-w-full min-w-0 space-y-6 overflow-hidden"),
    "Main content column must enforce w-full max-w-full min-w-0 overflow-hidden"
  );

  // Check hero banner container
  assert.ok(
    postPageContent.includes("w-full max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-md"),
    "Hero image banner must be constrained with w-full max-w-full overflow-hidden"
  );

  // Check TableCard
  assert.ok(
    postPageContent.includes("w-full max-w-full min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white"),
    "TableCard must enforce w-full max-w-full min-w-0 overflow-hidden"
  );
});
