import type { MetadataRoute } from "next";
import * as fs from "fs";
import * as path from "path";

const catToSitemapId: Record<string, string> = {
  results: "results",
  latestJobs: "latest-jobs",
  admitCards: "admit-cards",
  answerKeys: "answer-keys",
  admissions: "admissions",
  documents: "documents",
};

const sitemapCatKeys: Record<string, string> = {
  "results": "results",
  "latest-jobs": "latestJobs",
  "admit-cards": "admitCards",
  "answer-keys": "answerKeys",
  "admissions": "admissions",
  "documents": "documents",
};

export async function generateSitemaps() {
  return [
    { id: "results" },
    { id: "latest-jobs" },
    { id: "admit-cards" },
    { id: "answer-keys" },
    { id: "admissions" },
    { id: "documents" },
    { id: "exams" },
    { id: "states" },
    { id: "pages" },
  ];
}

const examSlugs = [
  "ssc","ssc-cgl","ssc-chsl","ssc-mts","ssc-gd","ssc-je","ssc-stenographer","ssc-cpo",
  "upsc","upsc-cse","upsc-ifs","upsc-nda","upsc-cds","upsc-epfo","upsc-capf",
  "railway","rrb-ntpc","rrb-alp","rrb-group-d","rrb-je",
  "banking","ibps-po","ibps-clerk","ibps-rrb","sbi-po","sbi-clerk","rbi-grade-b",
  "teaching-exams","ctet","uptet","reet","bihar-teacher",
  "defence-exams","indian-army","indian-navy","indian-airforce",
  "state-govt-jobs","up-govt-jobs","bihar-govt-jobs","rajasthan-govt-jobs","mp-govt-jobs","maharashtra-govt-jobs",
  "board-exams","cbse-result","bseb-result","up-board-result","rbse-result",
];

const states = [
  "uttar-pradesh","bihar","rajasthan","maharashtra","madhya-pradesh","delhi",
  "west-bengal","tamil-nadu","karnataka","gujarat","odisha","jharkhand",
  "uttarakhand","haryana","punjab","andhra-pradesh","telangana","kerala",
  "assam","chhattisgarh","himachal-pradesh","jammu-kashmir",
];

function parseDate(str: string): Date | null {
  const cleaned = str.replace(/[^0-9a-zA-Z\s,:]/g, "").trim();
  if (cleaned.length < 8) return null;
  const d = new Date(cleaned);
  return isNaN(d.getTime()) ? null : d;
}

function loadListing() {
  try {
    const jsonPath = path.join(process.cwd(), "data", "scraped.json");
    if (fs.existsSync(jsonPath)) {
      return JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    }
  } catch {}
  return null;
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aiexamresult.com";
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // ── Category post sitemaps (from listing data, not individual files) ──
  const catKey = sitemapCatKeys[id];
  if (catKey) {
    const data = loadListing();
    if (data && data[catKey]) {
      for (const item of data[catKey]) {
        const d = item.publishedDate ? parseDate(item.publishedDate) : null;
        entries.push({
          url: `${base}/post/${item.slug}`,
          lastModified: d || now,
          changeFrequency: "daily" as const,
          priority: 0.7,
        });
      }
    }
    return entries;
  }

  // ── Exam pages sitemap ──
  if (id === "exams") {
    for (const slug of examSlugs) {
      entries.push({ url: `${base}/exam/${slug}`, lastModified: now, changeFrequency: "daily", priority: 0.8 });
    }
    return entries;
  }

  // ── State pages sitemap ──
  if (id === "states") {
    for (const state of states) {
      entries.push({ url: `${base}/state/${state}`, lastModified: now, changeFrequency: "daily", priority: 0.7 });
    }
    return entries;
  }

  // ── Static pages sitemap ──
  const staticRoutes: { path: string; freq: "hourly" | "daily" | "weekly" | "monthly"; prio: number }[] = [
    { path: "", freq: "hourly", prio: 1.0 },
    { path: "/results", freq: "hourly", prio: 0.9 },
    { path: "/latest-jobs", freq: "hourly", prio: 0.9 },
    { path: "/admit-card", freq: "hourly", prio: 0.8 },
    { path: "/answer-key", freq: "hourly", prio: 0.8 },
    { path: "/admissions", freq: "daily", prio: 0.7 },
    { path: "/syllabus", freq: "daily", prio: 0.6 },
    { path: "/exam", freq: "daily", prio: 0.9 },
    { path: "/state", freq: "daily", prio: 0.7 },
    { path: "/state-map", freq: "weekly", prio: 0.6 },
    { path: "/search", freq: "daily", prio: 0.5 },
    { path: "/bookmarks", freq: "weekly", prio: 0.3 },
    { path: "/study-hub", freq: "daily", prio: 0.6 },
    { path: "/current-affairs", freq: "daily", prio: 0.7 },
    { path: "/exam-calendar", freq: "daily", prio: 0.7 },
    { path: "/exam-comparison", freq: "weekly", prio: 0.5 },
    { path: "/job-finder", freq: "daily", prio: 0.7 },
    { path: "/eligibility-checker", freq: "weekly", prio: 0.5 },
    { path: "/salary-calculator", freq: "weekly", prio: 0.5 },
    { path: "/vacancy-analyzer", freq: "daily", prio: 0.6 },
    { path: "/fee-calculator", freq: "weekly", prio: 0.5 },
    { path: "/form-guide", freq: "weekly", prio: 0.5 },
    { path: "/syllabus-tracker", freq: "weekly", prio: 0.5 },
    { path: "/mock-tests", freq: "weekly", prio: 0.5 },
    { path: "/question-papers", freq: "daily", prio: 0.7 },
    { path: "/objection-tracker", freq: "daily", prio: 0.6 },
    { path: "/counselling-guide", freq: "daily", prio: 0.6 },
    { path: "/document-checklist", freq: "weekly", prio: 0.5 },
    { path: "/difficulty-meter", freq: "weekly", prio: 0.5 },
    { path: "/result-predictor", freq: "weekly", prio: 0.5 },
    { path: "/iq-test", freq: "weekly", prio: 0.5 },
    { path: "/tools", freq: "daily", prio: 0.6 },
    { path: "/tools/age-calculator", freq: "weekly", prio: 0.4 },
    { path: "/tools/image-compressor", freq: "weekly", prio: 0.4 },
    { path: "/tools/pdf-compressor", freq: "weekly", prio: 0.4 },
    { path: "/about", freq: "monthly", prio: 0.4 },
    { path: "/about-us", freq: "monthly", prio: 0.4 },
    { path: "/contact", freq: "monthly", prio: 0.4 },
    { path: "/contact-us", freq: "monthly", prio: 0.4 },
    { path: "/privacy-policy", freq: "monthly", prio: 0.4 },
    { path: "/privacy", freq: "monthly", prio: 0.4 },
    { path: "/terms", freq: "monthly", prio: 0.4 },
    { path: "/terms-of-service", freq: "monthly", prio: 0.4 },
    { path: "/disclaimer", freq: "monthly", prio: 0.4 },
  ];
  for (const r of staticRoutes) {
    entries.push({ url: `${base}${r.path}`, lastModified: now, changeFrequency: r.freq, priority: r.prio });
  }
  return entries;
}
