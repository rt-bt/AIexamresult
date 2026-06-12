export type PostCard = {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  state: string;
  slug: string;
  lastDate?: string;
  isExpired?: boolean;
};

export const trendingExams = ["SSC CGL", "UPSC CSE", "Railway ALP", "NEET UG", "CTET", "UP Police"];

type ScrapedData = {
  results: { title: string; url: string; category: string; slug: string }[];
  admitCards: { title: string; url: string; category: string; slug: string }[];
  latestJobs: { title: string; url: string; category: string; slug: string }[];
  answerKeys: { title: string; url: string; category: string; slug: string }[];
  documents: { title: string; url: string; category: string; slug: string }[];
  admissions: { title: string; url: string; category: string; slug: string }[];
  posts: Record<string, { lastDate?: string; isExpired?: boolean }>;
  fetchedAt: string;
};

function loadScraped(): ScrapedData | null {
  try {
    const mod = require("@/data/scraped-data");
    return mod.scrapedData;
  } catch {
    try {
      const mod = require("../data/scraped-data");
      return mod.scrapedData;
    } catch {
      return null;
    }
  }
}

const scraped = loadScraped();

export function getPostBySlug(slug: string) {
  if (scraped?.posts?.[slug]) return scraped.posts[slug];
  return null;
}

export function parseDate(str: string): Date {
  const cleaned = str.replace(/\uFFFD/g, " ").replace(/\u00A0/g, " ").replace(/[\s:|]+\d{1,2}:\d{2}\s*(?:AM|PM).*$/i, "").trim();
  const m = cleaned.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (m) {
    const d = new Date(`${m[3]}-${m[2].substring(0, 3)}-${m[1].padStart(2, "0")}`);
    if (!isNaN(d.getTime())) return d;
  }
  const m2 = cleaned.match(/^(\d{1,2})([A-Za-z]+)\s+(\d{4})$/);
  if (m2) {
    const d = new Date(`${m2[3]}-${m2[2].substring(0, 3)}-${m2[1].padStart(2, "0")}`);
    if (!isNaN(d.getTime())) return d;
  }
  const d = new Date(cleaned);
  return isNaN(d.getTime()) ? new Date() : d;
}

function toPostCard(items: ({ title: string; url: string; category: string; slug: string; publishedDate?: string })[] | undefined, _category: string, fallbacks: PostCard[]): PostCard[] {
  if (!items || items.length === 0) return fallbacks;
  const sorted = [...items].sort((a, b) => {
    const da = a.publishedDate ? parseDate(a.publishedDate).getTime() : 0;
    const db = b.publishedDate ? parseDate(b.publishedDate).getTime() : 0;
    return db - da;
  });
  return sorted.map((item) => {
    const detail = scraped?.posts?.[item.slug];
    const dt = item.publishedDate ? parseDate(item.publishedDate) : null;
    return {
      title: item.title,
      excerpt: `Latest ${item.category} update from official sources. Check details, important dates and apply online.`,
      category: formatCategory(item.category),
      date: dt ? dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "",
      state: guessState(item.title),
      slug: item.slug,
      lastDate: detail?.lastDate,
      isExpired: detail?.isExpired,
    };
  });
}

function formatCategory(cat: string): string {
  const map: Record<string, string> = {
    results: "Result",
    admitcards: "Admit Card",
    latestjobs: "Latest Job",
    answerkeys: "Answer Key",
    documents: "Documents",
    admissions: "Admission",
  };
  return map[cat.replace(/\s+/g, "").toLowerCase()] ?? cat;
}

function guessState(title: string): string {
  const states = [
    "Uttar Pradesh", "Bihar", "Rajasthan", "Madhya Pradesh", "Maharashtra",
    "Delhi", "Haryana", "Punjab", "Uttarakhand", "Jharkhand",
    "Odisha", "West Bengal", "Gujarat", "Karnataka", "Tamil Nadu",
    "Andhra Pradesh", "Telangana", "Kerala", "Assam", "Chhattisgarh",
    "Himachal Pradesh", "Jammu and Kashmir", "India",
  ];
  for (const s of states) {
    if (title.toLowerCase().includes(s.toLowerCase())) return s;
  }
  return "India";
}

const defaultResults: PostCard[] = [
  { title: "SSC GD Constable Final Result 2026 declared", excerpt: "Download merit list, cut-off marks and state-wise selection status from the official commission notice.", category: "Result", date: "11 Jun 2026", state: "India", slug: "" },
  { title: "Bihar Board Class 10 Scrutiny Result live", excerpt: "Students can check roll number-wise marks update, revaluation status and next steps.", category: "Board Result", date: "10 Jun 2026", state: "Bihar", slug: "" },
  { title: "Rajasthan CET Graduation Level Result update", excerpt: "Scorecard, normalized marks and category-wise cut-off analysis are available.", category: "Result", date: "09 Jun 2026", state: "Rajasthan", slug: "" },
];

const defaultJobs: PostCard[] = [
  { title: "Railway Technician Recruitment 2026 - 9,144 posts", excerpt: "Eligibility, age limit, zone-wise seats, fee details and direct application link.", category: "Latest Job", date: "11 Jun 2026", state: "India", slug: "" },
  { title: "UPPSC Staff Nurse Online Form 2026", excerpt: "Application schedule, qualification, reservation and document upload guidelines.", category: "State Job", date: "11 Jun 2026", state: "Uttar Pradesh", slug: "" },
  { title: "Bihar Teacher Phase 4 Vacancy notification", excerpt: "District-wise posts, CTET/STET eligibility and official application process.", category: "Teaching", date: "10 Jun 2026", state: "Bihar", slug: "" },
];

const defaultNotifications: PostCard[] = [
  { title: "UPSC NDA II notification released", excerpt: "Application dates, academy-wise vacancy, syllabus and exam city information.", category: "Notification", date: "11 Jun 2026", state: "India", slug: "" },
  { title: "NEET UG counselling document checklist", excerpt: "Category certificates, seat allotment documents and reporting instructions.", category: "Admission", date: "10 Jun 2026", state: "India", slug: "" },
  { title: "CTET July admit card expected this week", excerpt: "Exam city slip, admit card download flow and exam-day instructions.", category: "Admit Card", date: "09 Jun 2026", state: "India", slug: "" },
];

const defaultCentral: PostCard[] = [
  { title: "UPSC Civil Services Examination", excerpt: "Prelims, mains, interview and service allocation updates.", category: "UPSC", date: "2026", state: "India", slug: "" },
  { title: "SSC Combined Graduate Level", excerpt: "Tier schedule, answer key, result and cut-off tracker.", category: "SSC", date: "2026", state: "India", slug: "" },
  { title: "IBPS PO and Clerk Recruitment", excerpt: "Banking vacancy calendar, admit card and scorecard updates.", category: "Bank", date: "2026", state: "India", slug: "" },
];

const defaultAdmissions: PostCard[] = [
  { title: "UP DELEd Online Form 2026", excerpt: "Application dates, eligibility, fee and admission process.", category: "Admission", date: "11 Jun 2026", state: "Uttar Pradesh", slug: "" },
  { title: "Delhi University PG Online Form 2026", excerpt: "PG admission schedule, merit list and document verification.", category: "Admission", date: "10 Jun 2026", state: "Delhi", slug: "" },
  { title: "NTA CSIR UGC NET June Online Form 2026", excerpt: "NET application dates, syllabus and exam pattern.", category: "Admission", date: "09 Jun 2026", state: "India", slug: "" },
];

const defaultDocuments: PostCard[] = [
  { title: "Income Certificate Form & Download", excerpt: "Income certificate application form, eligibility, required documents and download link.", category: "Document", date: "12 Jun 2026", state: "India", slug: "" },
  { title: "Caste Certificate Application Guide", excerpt: "SC/ST/OBC caste certificate application process, required documents and online apply.", category: "Document", date: "11 Jun 2026", state: "India", slug: "" },
  { title: "Domicile Certificate Online Apply", excerpt: "State domicile/residence certificate application, documents required and download.", category: "Document", date: "10 Jun 2026", state: "India", slug: "" },
];

const scrapedNotif = scraped ? [...(scraped.admitCards || []), ...(scraped.answerKeys || [])] : undefined;

export const featuredResults = toPostCard(scraped?.results, "Result", defaultResults);
export const latestJobs = toPostCard(scraped?.latestJobs, "Jobs", defaultJobs);
export const notifications = toPostCard(scrapedNotif, "Notification", defaultNotifications);
export const centralExams = toPostCard(scraped?.answerKeys, "Central Exams", defaultCentral);
export const admissions = toPostCard(scraped?.admissions, "Admission", defaultAdmissions);
export const documents = toPostCard(scraped?.documents, "Documents", defaultDocuments);

const admitCards = toPostCard(scraped?.admitCards, "Admit Card", []);

export const categorySections: { label: string; items: PostCard[] }[] = [
  { label: "Latest Jobs", items: latestJobs },
  { label: "Admit Card", items: admitCards },
  { label: "Answer Keys", items: centralExams },
  { label: "Result", items: featuredResults },
  { label: "Admissions", items: admissions },
  { label: "Documents", items: documents },
];

export const sectionItems: Record<string, PostCard[]> = {
  results: featuredResults,
  "admit-card": admitCards,
  "latest-jobs": latestJobs,
  "answer-key": centralExams,
  admissions: admissions,
  documents,
};
