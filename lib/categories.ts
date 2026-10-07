/**
 * Single source of truth for categories, CTA mappings, and official source identification.
 * Ensures consistent categorisation, badge styling, action text, and source attribution
 * across homepage, archive, search, category, and related-content cards.
 */

export type CanonicalCategory =
  | "results"
  | "latest-jobs"
  | "admit-card"
  | "answer-key"
  | "syllabus"
  | "scholarships"
  | "admissions"
  | "documents";

export interface CategoryInfo {
  id: CanonicalCategory;
  label: string;
  slug: string;
  defaultCta: string;
  badgeLabel: string;
  accentColor: string;
  badgeVariant: "warning" | "success" | "neutral";
  cardImage: string;
}

export const CATEGORY_DEFINITIONS: Record<CanonicalCategory, CategoryInfo> = {
  results: {
    id: "results",
    label: "Result",
    slug: "results",
    defaultCta: "Check Result",
    badgeLabel: "RESULT",
    accentColor: "#FF5B3E",
    badgeVariant: "warning",
    cardImage: "/cards/card-result.svg",
  },
  "latest-jobs": {
    id: "latest-jobs",
    label: "Latest Vacancy",
    slug: "latest-jobs",
    defaultCta: "Apply Online",
    badgeLabel: "VACANCY",
    accentColor: "#5B0111",
    badgeVariant: "success",
    cardImage: "/cards/card-job.svg",
  },
  "admit-card": {
    id: "admit-card",
    label: "Admit Card",
    slug: "admit-card",
    defaultCta: "Download Admit Card",
    badgeLabel: "ADMIT CARD",
    accentColor: "#FFD84D",
    badgeVariant: "neutral",
    cardImage: "/cards/card-admit.svg",
  },
  "answer-key": {
    id: "answer-key",
    label: "Answer Key",
    slug: "answer-key",
    defaultCta: "View Answer Key",
    badgeLabel: "ANSWER KEY",
    accentColor: "#111111",
    badgeVariant: "warning",
    cardImage: "/cards/card-key.svg",
  },
  syllabus: {
    id: "syllabus",
    label: "Syllabus",
    slug: "syllabus",
    defaultCta: "View Syllabus",
    badgeLabel: "SYLLABUS",
    accentColor: "#0D9488",
    badgeVariant: "neutral",
    cardImage: "/cards/card-key.svg",
  },
  scholarships: {
    id: "scholarships",
    label: "Scholarship",
    slug: "scholarships",
    defaultCta: "Check Scholarship",
    badgeLabel: "SCHOLARSHIP",
    accentColor: "#2563EB",
    badgeVariant: "success",
    cardImage: "/cards/card-job.svg",
  },
  admissions: {
    id: "admissions",
    label: "Admission",
    slug: "admissions",
    defaultCta: "Check Admission",
    badgeLabel: "ADMISSION",
    accentColor: "#7C3AED",
    badgeVariant: "neutral",
    cardImage: "/cards/card-admit.svg",
  },
  documents: {
    id: "documents",
    label: "Documents",
    slug: "documents",
    defaultCta: "Download Form",
    badgeLabel: "DOCUMENT",
    accentColor: "#475569",
    badgeVariant: "neutral",
    cardImage: "/cards/card-result.svg",
  },
};

export const CANONICAL_CATEGORIES = Object.keys(CATEGORY_DEFINITIONS) as CanonicalCategory[];

/**
 * Detects the canonical category from raw category name, slug, or title.
 */
export function detectCategory(rawCat?: string, title?: string, slug?: string): CanonicalCategory {
  const content = `${title || ""} ${slug || ""}`.toLowerCase();

  // 1. Content-based checks first (title + slug take precedence)
  if (content.includes("syllabus") || content.includes("exam pattern") || content.includes("pattern pdf")) {
    return "syllabus";
  }
  if (content.includes("scholarship") || content.includes("yojana")) {
    return "scholarships";
  }
  if (
    content.includes("answer key") ||
    content.includes("answerkey") ||
    content.includes("response sheet") ||
    content.includes("omr sheet")
  ) {
    return "answer-key";
  }
  if (
    content.includes("admit card") ||
    content.includes("admitcard") ||
    content.includes("hall ticket") ||
    content.includes("city slip") ||
    content.includes("city details") ||
    content.includes("exam city") ||
    content.includes("call letter") ||
    content.includes("exam date") ||
    content.includes("exam schedule") ||
    content.includes("typing test date") ||
    content.includes("interview schedule") ||
    content.includes("time table")
  ) {
    // If it mentions admit card, hall ticket, or city slip, classify as admit-card
    if (content.includes("admit card") || content.includes("hall ticket") || content.includes("city slip") || content.includes("city details")) {
      return "admit-card";
    }
    // If it mentions online form or apply online, it is a vacancy / recruitment!
    if (
      content.includes("online form") ||
      content.includes("apply online")
    ) {
      return "latest-jobs";
    }
    // If it has exam date but not result, it's admit-card/schedule
    if (!content.includes("result") && !content.includes("score card") && !content.includes("merit list")) {
      return "admit-card";
    }
  }
  if (
    content.includes("admission") ||
    content.includes("entrance") ||
    content.includes("counselling") ||
    content.includes("deled") ||
    content.includes("bed") ||
    content.includes("compartment online form")
  ) {
    return "admissions";
  }
  if (
    content.includes("certificate") ||
    content.includes("document") ||
    content.includes("domicile") ||
    content.includes("caste") ||
    content.includes("income certificate")
  ) {
    return "documents";
  }
  if (
    content.includes("score card") ||
    content.includes("scorecard") ||
    content.includes("merit list") ||
    content.includes("cut off") ||
    content.includes("cutoff") ||
    content.includes("selection list") ||
    content.includes("final marks") ||
    content.includes("marks list") ||
    content.includes("written marks") ||
    content.includes("rank card") ||
    content.includes("result")
  ) {
    return "results";
  }
  if (
    content.includes("recruitment") ||
    content.includes("vacancy") ||
    content.includes("bharti") ||
    content.includes("online form") ||
    content.includes("apply online") ||
    content.includes("apply") ||
    content.includes("job")
  ) {
    return "latest-jobs";
  }

  // 2. Fallback to rawCat normalized mapping
  const normalized = (rawCat || "").replace(/[\s-_]+/g, "").toLowerCase();
  if (normalized === "results" || normalized === "result") return "results";
  if (normalized === "admitcards" || normalized === "admitcard") return "admit-card";
  if (normalized === "latestjobs" || normalized === "jobs") return "latest-jobs";
  if (normalized === "answerkeys" || normalized === "answerkey") return "answer-key";
  if (normalized === "admissions" || normalized === "admission") return "admissions";
  if (normalized === "documents" || normalized === "document") return "documents";
  if (normalized === "syllabus") return "syllabus";
  if (normalized === "scholarships" || normalized === "scholarship") return "scholarships";

  return "results";
}

/**
 * Returns accurate CTA label and card presentation for any card.
 * Never allows a result card to use "Apply Online"!
 */
export function getCategoryCta(categoryOrTitle?: string, postTitle?: string, isExpired?: boolean): {
  actionText: string;
  badgeLabel: string;
  badgeVariant: "warning" | "success" | "neutral";
  accentColor: string;
  cardImage: string;
  categoryLabel: string;
  canonicalSlug: string;
} {
  const catKey = detectCategory(categoryOrTitle, postTitle);
  const def = CATEGORY_DEFINITIONS[catKey];
  const tLower = (postTitle || "").toLowerCase();

  let actionText = def.defaultCta;
  if (catKey === "results") {
    if (tLower.includes("score card") || tLower.includes("scorecard")) {
      actionText = "Download Scorecard";
    } else if (tLower.includes("merit list") || tLower.includes("selection list")) {
      actionText = "View Merit List";
    } else if (tLower.includes("cut off") || tLower.includes("cutoff")) {
      actionText = "Check Cut-Off";
    } else if (tLower.includes("pdf") || tLower.includes("download result")) {
      actionText = "Download Result PDF";
    } else if (tLower.includes("marks")) {
      actionText = "Check Marks";
    } else {
      actionText = "Check Result";
    }
  } else if (catKey === "admit-card") {
    if (tLower.includes("city slip") || tLower.includes("exam city")) {
      actionText = "Check Exam City";
    } else if (tLower.includes("exam date") || tLower.includes("schedule")) {
      actionText = "Check Exam Date";
    } else {
      actionText = "Download Admit Card";
    }
  } else if (catKey === "answer-key") {
    actionText = "View Answer Key";
  } else if (catKey === "syllabus") {
    actionText = "View Syllabus";
  } else if (catKey === "scholarships") {
    actionText = "Check Scholarship";
  } else if (catKey === "latest-jobs") {
    if (isExpired) {
      actionText = "View Details";
    } else if (tLower.includes("exam date") || tLower.includes("interview")) {
      actionText = "Check Dates";
    } else {
      actionText = "Apply Online";
    }
  }

  return {
    actionText,
    badgeLabel: def.badgeLabel,
    badgeVariant: def.badgeVariant,
    accentColor: def.accentColor,
    cardImage: def.cardImage,
    categoryLabel: def.label,
    canonicalSlug: def.slug,
  };
}

/**
 * Checks whether a given URL points to an official government / board portal.
 */
export function isOfficialGovDomain(url?: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    return (
      host.endsWith(".gov.in") ||
      host.endsWith(".nic.in") ||
      host.endsWith(".ac.in") ||
      host.endsWith(".edu.in") ||
      host.endsWith(".org.in") ||
      host.includes(".gov.") ||
      host.includes(".nic.") ||
      host === "cbse.gov.in" ||
      host === "upsc.gov.in" ||
      host === "ssc.gov.in" ||
      host === "rrbcdg.gov.in" ||
      host === "vyapamcg.cgstate.gov.in" ||
      host === "ibps.in" ||
      host === "nta.ac.in"
    );
  } catch {
    return false;
  }
}
