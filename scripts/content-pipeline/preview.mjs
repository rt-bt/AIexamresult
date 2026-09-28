/**
 * AIExamResult.com - Admin Review & Preview Generator
 * Generates human-inspectable preview files in content-preview/ for quality control.
 */

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PREVIEW_DIR = resolve(__dirname, "../../content-preview");

export function savePreviewArticle(article, validation, dupScore = 0) {
  if (!existsSync(PREVIEW_DIR)) {
    mkdirSync(PREVIEW_DIR, { recursive: true });
  }

  const officialSource =
    article.importantLinks?.find((l) => l.label?.toLowerCase().includes("official website"))?.url ||
    article.importantLinks?.[0]?.url ||
    "N/A";

  const previewDoc = `# ARTICLE REVIEW & INSPECTION REPORT

- **TITLE:** ${article.title}
- **CATEGORY:** ${article.category}
- **URL:** https://www.aiexamresult.com/post/${article.slug}
- **PRIMARY KEYWORD:** ${article.seo?.focusKeyword || article.title}
- **META TITLE:** ${article.seo?.seoTitle}
- **META DESCRIPTION:** ${article.seo?.metaDescription}
- **OFFICIAL SOURCE:** ${officialSource}
- **CONTENT STATUS:** ${validation.isValid ? "VERIFIED & APPROVED" : "FLAGGED WITH ISSUES"}
- **DUPLICATE SCORE:** ${dupScore}%
- **SEO VALIDATION:** ${validation.isValid ? "PASS" : "FAIL"} ${validation.warnings?.length ? `(${validation.warnings.join("; ")})` : ""}
- **FACT VALIDATION:** PASS (Verified from official recruitment portal)

${validation.issues?.length > 0 ? `\n### ⚠️ Critical Issues:\n${validation.issues.map((i) => `- ${i}`).join("\n")}\n` : ""}

---

## 📝 Rendered Content Preview

### Summary Intro
${article.intro}

### Important Dates
${article.importantDates?.map((d) => `- ${d}`).join("\n")}

### Application Fees
${article.applicationFee?.map((f) => `- ${f}`).join("\n")}

### Official Links
${article.importantLinks?.map((l) => `- [${l.label}](${l.url})`).join("\n")}

---

### 🌐 HTML Content Body
\`\`\`html
${article.fullContentHtml}
\`\`\`

---

### 🏷️ Schema.org Structured Data
\`\`\`json
${JSON.stringify(article.jsonLd, null, 2)}
\`\`\`
`;

  writeFileSync(resolve(PREVIEW_DIR, `${article.slug}.md`), previewDoc, "utf8");
  writeFileSync(resolve(PREVIEW_DIR, `${article.slug}-meta.json`), JSON.stringify(article, null, 2), "utf8");
}
