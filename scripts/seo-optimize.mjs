import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = resolve(__dirname, "..", "data", "posts");
const DATA_FILE = resolve(__dirname, "..", "data", "scraped-data.ts");

function loadData() {
  if (!existsSync(DATA_FILE)) return null;
  const raw = readFileSync(DATA_FILE, "utf8");
  const jsonStr = raw
    .replace(/^\/\/.*[\r\n]+/gm, "")
    .replace(/^export const scrapedData = /, "")
    .replace(/\s*as const\s*;\s*$/, "")
    .replace(/;\s*$/, "");
  return JSON.parse(jsonStr);
}

function generateFAQs(title, dates, links, type) {
  const faqs = [];
  faqs.push({
    "@type": "Question",
    name: `What is ${title}?`,
    acceptedAnswer: {
      "@type": "Answer",
      text: `${title} is an official Indian government exam notification. All details including important dates, eligibility, age limit, application fee and direct links are updated on this page.`
    }
  });
  if (dates && dates.length > 0) {
    const lastDate = dates.find(d => d.toLowerCase().includes("last") || d.toLowerCase().includes("apply"));
    if (lastDate) {
      faqs.push({
        "@type": "Question",
        name: `What is the last date to apply for ${title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The last date to submit online application for ${title} is ${lastDate.replace(/^.*?:\s*/, "")}.`
        }
      });
    }
  }
  const official = links ? links.find(l => l.label && l.label.toLowerCase().includes("official")) : null;
  if (official && official.url) {
    faqs.push({
      "@type": "Question",
      name: `Where is the official website for ${title}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `The official website link is ${official.url}. You can also access direct application links in the Important Links table on this page.`
      }
    });
  }
  const typeLabel = type === "admitCards" ? "admit card" : type === "results" ? "result" : type === "answerKeys" ? "answer key" : "notification";
  faqs.push({
    "@type": "Question",
    name: `How to check & download ${title} ${typeLabel}?`,
    acceptedAnswer: {
      "@type": "Answer",
      text: `Click on the direct official link in the Important Links table above or visit the commission official portal to download the ${typeLabel}.`
    }
  });
  return faqs;
}

function formatIsoDate(d) {
  if (!d) return undefined;
  const parsed = new Date(d);
  if (isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString().split("T")[0];
}

function isJobPost(title, category) {
  const t = (title || "").toLowerCase();
  const c = (category || "").toLowerCase();
  return c.includes("job") || c.includes("vacancy") || t.includes("recruitment") || t.includes("online form") || t.includes("vacancy") || t.includes("bharti") || t.includes("post");
}

function addJsonLd(post, slug) {
  const type = post.category || "";
  const url = `https://www.aiexamresult.com/post/${slug}`;
  const faqs = generateFAQs(post.title, post.importantDates, post.importantLinks, type);
  const datePublished = formatIsoDate(post.publishedAt) || formatIsoDate(post.createdAt) || formatIsoDate(post.publishedDate) || (typeof post.publishedDate === "string" && post.publishedDate.trim() ? post.publishedDate : undefined);
  const dateModified = formatIsoDate(post.updatedAt) || datePublished;

  const isJob = isJobPost(post.title, type);

  const graph = [
    {
      "@type": "WebPage",
      "@id": url,
      url: url,
      name: `${post.title} - Sarkari Result 2026 | All India Exam Result`,
      description: (post.intro || `${post.title}: Check latest notification, important dates, eligibility & online form at Sarkari Result.`).slice(0, 160),
      inLanguage: "en-IN",
      isPartOf: {
        "@id": "https://www.aiexamresult.com/#website"
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `https://www.aiexamresult.com/api/og?title=${encodeURIComponent(post.title)}`
      },
      ...(datePublished ? { datePublished } : {}),
      ...(dateModified ? { dateModified } : {}),
      author: {
        "@type": "Organization",
        name: "All India Exam Result",
        url: "https://www.aiexamresult.com"
      }
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      url: `${url}#faq`,
      mainEntity: faqs
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.aiexamresult.com/" },
        { "@type": "ListItem", position: 2, name: getCategoryLabel(type), item: `https://www.aiexamresult.com/${getCategorySlug(type)}` },
        { "@type": "ListItem", position: 3, name: post.title, item: url }
      ]
    }
  ];

  if (isJob) {
    graph.push({
      "@type": "JobPosting",
      "@id": `${url}#jobposting`,
      title: post.title,
      description: post.intro || `${post.title} online form 2026 notification details.`,
      datePosted: datePublished ? `${datePublished}T00:00:00.000Z` : new Date().toISOString(),
      employmentType: "FULL_TIME",
      hiringOrganization: {
        "@type": "Organization",
        name: "Government of India / Public Sector",
        sameAs: "https://www.aiexamresult.com"
      },
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: "India",
          addressRegion: "All States",
          addressCountry: "IN"
        }
      },
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: "INR",
        value: {
          "@type": "QuantitativeValue",
          value: 35000,
          unitText: "MONTH"
        }
      },
      directApply: true
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}

function getCategoryLabel(cat) {
  const map = { results: "Results", latestJobs: "Latest Vacancy", admitCards: "Admit Card", answerKeys: "Answer Key", admissions: "Admissions", documents: "Documents" };
  return map[cat] || cat || "Updates";
}

function getCategorySlug(cat) {
  const map = { results: "results", latestJobs: "latest-jobs", admitCards: "admit-card", answerKeys: "answer-key", admissions: "admissions", documents: "documents" };
  return map[cat] || "results";
}

function generateKeywordFooterHtml(title, category) {
  return `
<div style="margin-top:2rem;padding:1.25rem;border-radius:12px;background-color:#f8fafc;border:1px solid #e2e8f0;">
  <h3 style="font-size:0.95rem;font-weight:800;color:#0f172a;margin-bottom:0.5rem;">Sarkari Result 2026 Quick Links &amp; Related Search</h3>
  <p style="font-size:0.8rem;color:#64748b;line-height:1.6;margin:0;">
    Search terms: <strong>${title}</strong>, Sarkari Result 2026, Sarkari Naukri, Rojgar Result, Sarkari Exam Online Form, ${category || "Govt Jobs"}, SSC CGL, Railway RRB, UPSC CSE, UP Police Bharti, Bihar Teacher, Free Job Alert. Check official website for verified notifications.
  </p>
</div>
`;
}

async function main() {
  console.log("SEO Optimizer for AI Exam Result");
  console.log("================================\n");

  const files = readdirSync(POSTS_DIR).filter(f => f.endsWith(".json"));
  let optimized = 0;
  let skipped = 0;

  for (const file of files) {
    try {
      const slug = file.replace(".json", "");
      const post = JSON.parse(readFileSync(resolve(POSTS_DIR, file), "utf8"));

      const schema = addJsonLd(post, slug);
      post.jsonLd = schema;

      if (!post.seoMeta) post.seoMeta = {};
      post.seoMeta.title = `${post.title} - Sarkari Result | Sarkari Exam 2026`;
      post.seoMeta.description = (post.intro || `${post.title}: Check eligibility criteria, age limit, application fee, last date to apply & official notification PDF at Sarkari Result.`).slice(0, 160);
      post.seoMeta.canonical = `https://www.aiexamresult.com/post/${slug}`;

      if (!post.fullContentHtml || post.fullContentHtml.length < 100) {
        const title = post.title || "";
        const intro = post.intro || "";
        const dates = post.importantDates || [];
        const fees = post.applicationFee || [];
        const links = post.importantLinks || [];

        const htmlParts = [];
        htmlParts.push(`<h2>${title} - Complete Details</h2>`);
        htmlParts.push(`<p>${intro || title}.</p>`);

        if (dates.length > 0) {
          htmlParts.push("<h3>Important Dates</h3><ul>");
          for (const d of dates) htmlParts.push(`<li>${d}</li>`);
          htmlParts.push("</ul>");
        }
        if (fees.length > 0) {
          htmlParts.push("<h3>Application Fee</h3><ul>");
          for (const f of fees) htmlParts.push(`<li>${f}</li>`);
          htmlParts.push("</ul>");
        }
        if (links.length > 0) {
          htmlParts.push("<h3>Important Links</h3><ul>");
          for (const l of links) htmlParts.push(`<li><a href="${l.url}" rel="noopener noreferrer">${l.label}</a></li>`);
          htmlParts.push("</ul>");
        }
        htmlParts.push("<h3>Frequently Asked Questions</h3>");
        htmlParts.push(`<p><strong>What is ${title}?</strong></p>`);
        htmlParts.push(`<p>${title} is a government exam notification. All details including dates, fee, eligibility and links are provided above.</p>`);
        htmlParts.push(generateKeywordFooterHtml(title, post.category));

        post.fullContentHtml = htmlParts.join("\n");
      } else if (!post.fullContentHtml.includes("Sarkari Result 2026 Quick Links")) {
        post.fullContentHtml += generateKeywordFooterHtml(post.title || "", post.category || "");
      }

      writeFileSync(resolve(POSTS_DIR, file), JSON.stringify(post, null, 2), "utf8");
      optimized++;
    } catch (e) {
      skipped++;
    }
  }

  const data = loadData();
  if (data) {
    if (!data.seo) data.seo = {};
    data.seo.lastOptimized = new Date().toISOString();
    data.seo.totalPosts = files.length;
    data.seo.websiteName = "All India Exam Result";
    data.seo.websiteUrl = "https://www.aiexamresult.com";
    data.seo.description = "Sarkari Result 2026 - Get fastest government job alerts, sarkari naukri, exam results, admit cards & answer keys. SSC, UPSC, Railway, Banking, UP, Bihar & all India exams.";

    const jsonPath = resolve(__dirname, "..", "data", "scraped.json");
    writeFileSync(jsonPath, JSON.stringify(data, null, 2), "utf8");
    const ts = `// Auto-generated - DO NOT EDIT\nexport const scrapedData = ${JSON.stringify(data, null, 2)};\n`;
    writeFileSync(DATA_FILE, ts, "utf8");
  }

  console.log(`\nSEO Optimization Complete:`);
  console.log(`  Posts optimized: ${optimized}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Total posts: ${files.length}`);
  console.log(`  JobPosting & FAQ Schema added`);
  console.log(`  Keyword density blocks injected`);
}

main().catch(e => { console.error("Error:", e.message); process.exit(1); });
