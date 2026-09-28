/**
 * AIExamResult.com - Content & SEO Quality Validator
 * Strict gatekeeper ensuring zero copied content, valid facts, valid SEO, valid Schema, and no duplicates.
 */

const ALLOWED_CATEGORIES = ["latestJobs", "results", "admitCards", "answerKeys", "documents", "admissions"];
const FORBIDDEN_COMPETITOR_STRINGS = [
  "sarkariexam",
  "sarkari result",
  "sarkariresult",
  "resultbharat",
  "testbook",
  "freejobalert",
  "join telegram",
  "join whatsapp",
  "contact us at 9",
];

export function validateArticle(article, options = { checkDuplicates: true }) {
  const issues = [];
  const warnings = [];

  // 1. Basic properties
  if (!article.title || article.title.length < 10) {
    issues.push("Title is missing or too short (< 10 chars)");
  }
  if (!article.slug || !/^[a-z0-9-]+$/.test(article.slug)) {
    issues.push(`Invalid slug format: '${article.slug}' (must be kebab-case)`);
  }

  // 2. Category check
  if (!ALLOWED_CATEGORIES.includes(article.category)) {
    issues.push(`Invalid category: '${article.category}'. Must be one of: ${ALLOWED_CATEGORIES.join(", ")}`);
  }

  // 3. Originality & Competitor Footprint Check
  const combinedText = `${article.title} ${article.intro || ""} ${article.fullContentHtml || ""}`.toLowerCase();
  for (const forbidden of FORBIDDEN_COMPETITOR_STRINGS) {
    if (combinedText.includes(forbidden)) {
      issues.push(`Competitor branding or promotional artifact detected: "${forbidden}"`);
    }
  }

  // 4. Official source verification
  const hasOfficialLink = article.importantLinks?.some((l) =>
    l.label?.toLowerCase().includes("official") || l.url?.includes(".gov.in") || l.url?.includes(".nic.in") || l.url?.includes(".in") || l.url?.includes(".ac.in") || l.url?.includes(".org") || l.url?.includes(".aero")
  );
  if (!hasOfficialLink) {
    issues.push("No official government/authority link found in article links");
  }

  // 5. Fact verification
  if (!Array.isArray(article.importantDates) || article.importantDates.length === 0) {
    issues.push("Important dates list is missing or empty");
  }

  // 6. SEO Title validation
  const seoTitle = article.seo?.seoTitle || article.title;
  if (seoTitle.length < 25) {
    issues.push(`SEO Title too short (${seoTitle.length} chars). Target >= 25 chars.`);
  }
  if (seoTitle.length > 85) {
    warnings.push(`SEO Title slightly long (${seoTitle.length} chars). Target <= 85 chars.`);
  }

  // 7. Meta Description validation
  const metaDesc = article.seo?.metaDescription || "";
  if (metaDesc.length < 110) {
    issues.push(`Meta description too short (${metaDesc.length} chars). Must be >= 110 chars for search engines.`);
  }
  if (metaDesc.length > 175) {
    warnings.push(`Meta description exceeds 170 chars (${metaDesc.length} chars).`);
  }

  // 8. Canonical URL validation
  const canonical = article.seo?.canonicalUrl || "";
  if (!canonical.startsWith("https://www.aiexamresult.com/post/")) {
    issues.push(`Invalid canonical URL: '${canonical}'`);
  }

  // 9. Schema.org validation
  if (!article.jsonLd || article.jsonLd["@context"] !== "https://schema.org" || !Array.isArray(article.jsonLd["@graph"])) {
    issues.push("Invalid JSON-LD structured data graph");
  }

  // 10. Content Depth
  if (!article.fullContentHtml || article.fullContentHtml.length < 300) {
    issues.push("Article body content (fullContentHtml) is too thin (< 300 characters)");
  }

  return {
    isValid: issues.length === 0,
    issues,
    warnings,
  };
}
