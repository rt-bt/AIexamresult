/**
 * AIExamResult.com - SEO Metadata & Structured Data Generator
 * Generates natural SEO titles, meta descriptions, canonical URLs, OG tags,
 * and valid Schema.org structured data (Article, BreadcrumbList, FAQPage, JobPosting).
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aiexamresult.com";
const SITE_NAME = "All India Exam Result";

const SECTION_PATHS = {
  latestJobs: "/latest-jobs",
  results: "/results",
  admitCards: "/admit-card",
  answerKeys: "/answer-key",
  admissions: "/admissions",
  documents: "/documents",
};

const CATEGORY_NAMES = {
  latestJobs: "Latest Vacancy",
  results: "Result",
  admitCards: "Admit Card",
  answerKeys: "Answer Key",
  admissions: "Admissions",
  documents: "Documents",
};

export function buildSeoMetadata({
  title = "",
  slug = "",
  category = "latestJobs",
  intro = "",
  publishedAt = "",
  publishedDate = "",
  updatedAt = "",
  authority = {},
  faqs = [],
  lastDate = "",
  importantLinks = [],
}) {
  const cleanTitle = title.replace(/\s+/g, " ").trim();
  const catLabel = CATEGORY_NAMES[category] || "Government Exam";
  const canonicalUrl = `${SITE_URL}/post/${slug}`;
  const sectionPath = SECTION_PATHS[category] || "/latest-jobs";

  // 1. Natural SEO Title Generation (no spam/stuffing)
  let intentSuffix = "";
  const tLower = cleanTitle.toLowerCase();
  const cLower = category.toLowerCase();

  if (cLower.includes("job") || tLower.includes("recruitment") || tLower.includes("online form")) {
    intentSuffix = "Notification, Eligibility & Apply Online";
  } else if (cLower.includes("admit") || tLower.includes("admit card") || tLower.includes("hall ticket")) {
    intentSuffix = "Hall Ticket Download & Exam Date";
  } else if (cLower.includes("result") || tLower.includes("result") || tLower.includes("merit list")) {
    intentSuffix = "Result Declared, Scorecard & Cutoff Marks";
  } else if (cLower.includes("answer") || tLower.includes("answer key")) {
    intentSuffix = "Answer Key & Response Sheet PDF";
  } else if (cLower.includes("admission")) {
    intentSuffix = "Admission Online Form & Eligibility";
  } else {
    intentSuffix = "Details, Schedule & Official PDF";
  }

  const hasYear = /\b(202[4-9]|203\d)\b/.test(cleanTitle);
  const yearStr = hasYear ? "" : " 2026";
  
  let seoTitle = `${cleanTitle}${yearStr}`;
  if (seoTitle.length + intentSuffix.length + 3 <= 70) {
    seoTitle = `${seoTitle} : ${intentSuffix}`;
  } else if (seoTitle.length > 70) {
    seoTitle = seoTitle.substring(0, 68).trim();
  }

  // 2. Meta description (145 - 160 characters target)
  let metaDescription = "";
  if (intro && intro.length > 50) {
    const rawIntro = intro.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    if (rawIntro.length <= 155) {
      metaDescription = rawIntro;
    } else {
      metaDescription = rawIntro.substring(0, 150).replace(/\s+\S*$/, "") + "… Check updates at AI Exam Result.";
    }
  } else {
    metaDescription = `${cleanTitle}: Check verified dates, eligibility criteria, vacancy details and direct official apply links at All India Exam Result.`;
  }

  // Ensure length within 120-165 chars
  if (metaDescription.length < 120) {
    metaDescription += " Download official notification PDF and apply online.";
  }
  if (metaDescription.length > 165) {
    metaDescription = metaDescription.substring(0, 160).replace(/\s+\S*$/, "") + "…";
  }

  // Focus & secondary keywords
  const focusKeyword = cleanTitle.replace(/202[4-9]|203\d/g, "").trim();
  const secondaryKeywords = [
    `${cleanTitle} 2026`,
    `${focusKeyword} notification`,
    `${focusKeyword} eligibility`,
    `${focusKeyword} apply online`,
    `${authority.name || "Government Exam"} updates`,
  ];

  // Open Graph dynamic image
  const dateFormatted = publishedDate || "2026-09-28";
  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(cleanTitle)}&cat=${encodeURIComponent(catLabel)}&date=${encodeURIComponent(dateFormatted)}`;

  // 3. Schema.org JSON-LD graph
  const graph = [];

  // BreadcrumbList Schema
  graph.push({
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": SITE_URL,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": catLabel,
        "item": `${SITE_URL}${sectionPath}`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": cleanTitle,
        "item": canonicalUrl,
      },
    ],
  });

  // WebPage & Article Schema
  graph.push({
    "@type": "WebPage",
    "@id": canonicalUrl,
    "url": canonicalUrl,
    "name": seoTitle,
    "description": metaDescription,
    "inLanguage": "en-IN",
    "isPartOf": {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "name": SITE_NAME,
      "url": SITE_URL,
    },
    "primaryImageOfPage": {
      "@type": "ImageObject",
      "url": ogImageUrl,
    },
    "datePublished": publishedAt,
    "dateModified": updatedAt || publishedAt,
    "author": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
    },
  });

  // Article Schema
  graph.push({
    "@type": "Article",
    "@id": `${canonicalUrl}#article`,
    "headline": cleanTitle,
    "description": metaDescription,
    "datePublished": publishedAt,
    "dateModified": updatedAt || publishedAt,
    "mainEntityOfPage": canonicalUrl,
    "image": ogImageUrl,
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.svg`,
      },
    },
    "author": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
    },
  });

  // FAQPage Schema (only if visible FAQs exist)
  if (faqs && faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      "mainEntity": faqs.map((f) => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer,
        },
      })),
    });
  }

  // JobPosting Schema (for recruitment posts)
  if (category === "latestJobs" || tLower.includes("recruitment") || tLower.includes("vacancy")) {
    const orgAddress = authority.address || {
      street: "Central Secretariat",
      city: "New Delhi",
      state: "Delhi",
      pin: "110001",
    };

    let validThroughIso = new Date(Date.now() + 45 * 86400 * 1000).toISOString();
    if (lastDate) {
      const parsedLastDate = new Date(lastDate);
      if (!isNaN(parsedLastDate.getTime())) {
        validThroughIso = parsedLastDate.toISOString();
      }
    }

    graph.push({
      "@type": "JobPosting",
      "@id": `${canonicalUrl}#jobposting`,
      "title": cleanTitle,
      "description": metaDescription,
      "datePosted": publishedAt,
      "validThrough": validThroughIso,
      "employmentType": "FULL_TIME",
      "hiringOrganization": {
        "@type": "Organization",
        "name": authority.name || "Government of India",
        "sameAs": authority.portal || SITE_URL,
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": orgAddress.street,
          "addressLocality": orgAddress.city,
          "addressRegion": orgAddress.state,
          "postalCode": orgAddress.pin,
          "addressCountry": "IN",
        },
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": 25500,
          "maxValue": 81100,
          "unitText": "MONTH",
        },
      },
    });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return {
    seoTitle,
    metaDescription,
    focusKeyword,
    secondaryKeywords,
    canonicalUrl,
    ogImageUrl,
    jsonLd,
    sectionPath,
    categoryName: catLabel,
  };
}
