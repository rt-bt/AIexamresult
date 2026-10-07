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
  const combined = `${rawCat || ""} ${title || ""} ${slug || ""}`.toLowerCase();

  if (combined.includes("syllabus") || combined.includes("exam pattern") || combined.includes("pattern pdf")) {
    return "syllabus";
  }
  if (combined.includes("scholarship") || combined.includes("yojana")) {
    return "scholarships";
  }
  if (
    combined.includes("answer key") ||
    combined.includes("answerkey") ||
    combined.includes("response sheet") ||
    combined.includes("omr sheet")
  ) {
    return "answer-key";
  }
  if (
    combined.includes("admit card") ||
    combined.includes("admitcard") ||
    combined.includes("hall ticket") ||
    combined.includes("city slip") ||
    combined.includes("call letter")
  ) {
    return "admit-card";
  }
  if (
    combined.includes("score card") ||
    combined.includes("scorecard") ||
    combined.includes("merit list") ||
    combined.includes("cut off") ||
    combined.includes("cutoff") ||
    combined.includes("selection list") ||
    combined.includes("result")
  ) {
    return "results";
  }
  if (
    combined.includes("admission") ||
    combined.includes("entrance") ||
    combined.includes("counselling") ||
    combined.includes("deled") ||
    combined.includes("bed")
  ) {
    return "admissions";
  }
  if (
    combined.includes("certificate") ||
    combined.includes("document") ||
    combined.includes("domicile") ||
    combined.includes("caste")
  ) {
    return "documents";
  }
  if (
    combined.includes("job") ||
    combined.includes("recruitment") ||
    combined.includes("vacancy") ||
    combined.includes("bharti") ||
    combined.includes("online form") ||
    combined.includes("apply")
  ) {
    return "latest-jobs";
  }

  // Fallback to rawCat normalized mapping
  const normalized = (rawCat || "").replace(/[\s-_]+/g, "").toLowerCase();
  if (normalized === "results" || normalized === "result") return "results";
  if (normalized === "admitcards" || normalized === "admitcard") return "admit-card";
  if (normalized === "latestjobs" || normalized === "jobs") return "latest-jobs";
  if (normalized === "answerkeys" || normalized === "answerkey") return "answer-key";
  if (normalized === "admissions" || normalized === "admission") return "admissions";
  if (normalized === "documents" || normalized === "document") return "documents";

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
    } else {
      actionText = "Check Result";
    }
  } else if (catKey === "admit-card") {
    if (tLower.includes("city slip") || tLower.includes("exam city")) {
      actionText = "Check Exam City";
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
