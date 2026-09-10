export type PostCard = {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  state: string;
  slug: string;
  lastDate?: string;
  isExpired?: boolean;
  publishedAt?: string;
  publishedDate?: string;
};

export const trendingExams = ["SSC CGL", "UPSC CSE", "Railway ALP", "NEET UG", "CTET", "UP Police"];

type ScrapedData = {
  results: { title: string; url: string; category: string; slug: string; publishedDate?: string; publishedAt?: string }[];
  admitCards: { title: string; url: string; category: string; slug: string; publishedDate?: string; publishedAt?: string }[];
  latestJobs: { title: string; url: string; category: string; slug: string; publishedDate?: string; publishedAt?: string }[];
  answerKeys: { title: string; url: string; category: string; slug: string; publishedDate?: string; publishedAt?: string }[];
  documents: { title: string; url: string; category: string; slug: string; publishedDate?: string; publishedAt?: string }[];
  admissions: { title: string; url: string; category: string; slug: string; publishedDate?: string; publishedAt?: string }[];
  posts: Record<string, { lastDate?: string; isExpired?: boolean; publishedAt?: string; publishedDate?: string }>;
  fetchedAt: string;
};

// Read scraped.json at runtime.
// next.config.ts outputFileTracingIncludes ensures this file is packaged
// alongside the serverless function on Vercel (as a file, NOT bundled into JS).
function loadScraped(): ScrapedData | null {
  try {
    const fs = require("fs") as typeof import("fs");
    const path = require("path") as typeof import("path");
    const jsonPath = path.join(process.cwd(), "data", "scraped.json");
    if (fs.existsSync(jsonPath)) {
      return JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    }
  } catch {}
  return null;
}

let _scraped: ScrapedData | null | undefined = undefined;
function getScraped(): ScrapedData | null {
  if (_scraped === undefined) _scraped = loadScraped();
  return _scraped;
}

export function getPostBySlug(slug: string) {
  const s = getScraped();
  if (s?.posts?.[slug]) return s.posts[slug];
  return null;
}

export function parseDate(str?: string | null): Date | null {
  if (!str || typeof str !== "string") return null;
  // Strip pipe-separated time part e.g. "05 September 2026 | 08:20 PM"
  const withoutTime = str
    .replace(/\uFFFD/g, " ")
    .replace(/\u00A0/g, " ")
    .replace(/\s*\|\s*\d{1,2}:\d{2}\s*(?:AM|PM).*/i, "")   // "| 08:20 PM" style
    .replace(/[\s:|]+\d{1,2}:\d{2}\s*(?:AM|PM).*$/i, "")   // plain "08:20 PM" suffix
    .trim();

  // Exclude non-date link or button text
  if (/^(click here|download|view|official|notification|merit list)/i.test(withoutTime)) return null;

  // "05 September 2026" or "5 Sep 2026"
  const m = withoutTime.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (m) {
    const d = new Date(`${m[3]}-${m[2].substring(0, 3)}-${m[1].padStart(2, "0")}`);
    if (!isNaN(d.getTime())) return d;
  }
  // "05September 2026" (no space)
  const m2 = withoutTime.match(/^(\d{1,2})([A-Za-z]+)\s+(\d{4})$/);
  if (m2) {
    const d = new Date(`${m2[3]}-${m2[2].substring(0, 3)}-${m2[1].padStart(2, "0")}`);
    if (!isNaN(d.getTime())) return d;
  }
  // "DD-MM-YYYY" or "DD/MM/YYYY"
  const m3 = withoutTime.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m3) {
    const d = new Date(`${m3[3]}-${m3[2].padStart(2, "0")}-${m3[1].padStart(2, "0")}`);
    if (!isNaN(d.getTime())) return d;
  }
  // ISO / RFC2822 / any other JS-parseable format
  const d = new Date(withoutTime);
  return isNaN(d.getTime()) ? null : d;
}

export function formatDisplayDate(raw?: string | null): string {
  if (!raw) return "";
  const d = parseDate(raw);
  if (d) {
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }
  // If parsing failed but string has a 4-digit year, return trimmed string as fallback
  return /\d{4}/.test(raw) ? raw.trim() : "";
}

function cleanLastDate(raw?: string): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  const m1 = trimmed.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/);
  if (m1) return m1[1];
  const m2 = trimmed.match(/(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})/i);
  if (m2) return m2[1];
  if (trimmed.length <= 20 && !trimmed.includes("\n") && !trimmed.includes("<") && !/short info|apply|exam|fee/i.test(trimmed)) {
    return trimmed;
  }
  return undefined;
}

function toPostCard(items: ({ title: string; url: string; category: string; slug: string; publishedDate?: string; publishedAt?: string })[] | undefined, _category: string, fallbacks: PostCard[]): PostCard[] {
  if (!items || items.length === 0) return fallbacks;
  const s2 = getScraped();

  const sorted = [...items].sort((a, b) => {
    const dateStrA = a.publishedAt || a.publishedDate || s2?.posts?.[a.slug]?.publishedAt || s2?.posts?.[a.slug]?.publishedDate;
    const dateStrB = b.publishedAt || b.publishedDate || s2?.posts?.[b.slug]?.publishedAt || s2?.posts?.[b.slug]?.publishedDate;
    const da = dateStrA ? (parseDate(dateStrA)?.getTime() ?? 0) : 0;
    const db = dateStrB ? (parseDate(dateStrB)?.getTime() ?? 0) : 0;
    return db - da;
  });

  return sorted.map((item) => {
    const detail = s2?.posts?.[item.slug];
    const permanentDate = item.publishedAt || item.publishedDate || detail?.publishedAt || detail?.publishedDate || "";
    const displayDate = formatDisplayDate(permanentDate);

    return {
      title: item.title,
      excerpt: `Latest ${item.category} update from official sources. Check details, important dates and apply online.`,
      category: formatCategory(item.category),
      date: displayDate,
      state: guessState(item.title),
      slug: item.slug,
      lastDate: cleanLastDate(detail?.lastDate),
      isExpired: detail?.isExpired,
      publishedAt: item.publishedAt || detail?.publishedAt,
      publishedDate: item.publishedDate || detail?.publishedDate,
    };
  });
}

function formatCategory(cat: string): string {
  const map: Record<string, string> = {
    results: "Result",
    admitcards: "Admit Card",
    latestjobs: "Latest Vacancy",
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

// ─── Board Keywords ──────────────────────────────────────────────────────────
const BOARD_KEYWORDS = [
  "board", "class 10", "class 12", "10th", "12th", "matric", "intermediate",
  "hsc", "ssc result", "cbse", "icse", "isc", "bseb", "rbse", "mpbse",
  "upmsp", "up board", "msbshse", "hbse", "ubse", "jac", "tnresults",
  "sslc", "higher secondary", "secondary school",
];

export function isBoardResult(title: string): boolean {
  const lower = title.toLowerCase();
  return BOARD_KEYWORDS.some(kw => lower.includes(kw));
}

// ─── Static Fallback Data ─────────────────────────────────────────────────────

const defaultResults: PostCard[] = [
  { title: "SSC GD Constable Final Result 2026 declared", excerpt: "Download merit list, cut-off marks and state-wise selection status from the official commission notice.", category: "Result", date: "11 Jun 2026", state: "India", slug: "" },
  { title: "Bihar Board Class 10 Scrutiny Result live", excerpt: "Students can check roll number-wise marks update, revaluation status and next steps.", category: "Board Result", date: "10 Jun 2026", state: "Bihar", slug: "" },
  { title: "Rajasthan CET Graduation Level Result update", excerpt: "Scorecard, normalized marks and category-wise cut-off analysis are available.", category: "Result", date: "09 Jun 2026", state: "Rajasthan", slug: "" },
];

const defaultBoardResults: PostCard[] = [
  { title: "CBSE Class 10th Result 2026 - Check Roll Number Wise Marks", excerpt: "CBSE 10th board result 2026 declared at cbseresults.nic.in. Check roll number wise marks, download marksheet.", category: "Board Result", date: "08 Sep 2026", state: "India", slug: "cbse-class-10-result-2026" },
  { title: "CBSE Class 12th Result 2026 - Science, Commerce, Arts", excerpt: "CBSE 12th board result 2026 out. Check stream-wise marks, pass percentage and toppers list at cbse.gov.in.", category: "Board Result", date: "08 Sep 2026", state: "India", slug: "cbse-class-12-result-2026" },
  { title: "UP Board 10th Result 2026 - UPMSP Highschool Result", excerpt: "UP Board Highschool result 2026 at upresults.nic.in. Check roll number wise marks and download marksheet.", category: "Board Result", date: "07 Sep 2026", state: "Uttar Pradesh", slug: "up-board-10th-result-2026" },
  { title: "UP Board 12th Result 2026 - UPMSP Intermediate Result", excerpt: "UP Board Intermediate result 2026 declared. Check subject wise marks, pass/fail status at upmsp.edu.in.", category: "Board Result", date: "07 Sep 2026", state: "Uttar Pradesh", slug: "up-board-12th-result-2026" },
  { title: "Bihar Board 10th Result 2026 - BSEB Matric Result", excerpt: "BSEB Matric result 2026 at biharboardonline.bihar.gov.in. Check marks, division and download marksheet.", category: "Board Result", date: "06 Sep 2026", state: "Bihar", slug: "bihar-board-10th-result-2026" },
  { title: "Bihar Board 12th Result 2026 - BSEB Inter Result", excerpt: "Bihar Board Intermediate result 2026 declared at biharboardonline.com. Check stream-wise result and topper list.", category: "Board Result", date: "06 Sep 2026", state: "Bihar", slug: "bihar-board-12th-result-2026" },
  { title: "Rajasthan Board 10th Result 2026 - RBSE Secondary Result", excerpt: "RBSE Class 10 result 2026 at rajresults.nic.in. Check district-wise, school-wise result and download marksheet.", category: "Board Result", date: "05 Sep 2026", state: "Rajasthan", slug: "rbse-10th-result-2026" },
  { title: "Rajasthan Board 12th Result 2026 - RBSE Senior Secondary", excerpt: "RBSE 12th result 2026 for all streams at rajresults.nic.in. Check marks and download marksheet.", category: "Board Result", date: "05 Sep 2026", state: "Rajasthan", slug: "rbse-12th-result-2026" },
  { title: "MP Board 10th Result 2026 - MPBSE Class X Result", excerpt: "MPBSE High School result 2026 at mpresults.nic.in. Check roll number wise marks and download marksheet.", category: "Board Result", date: "04 Sep 2026", state: "Madhya Pradesh", slug: "mp-board-10th-result-2026" },
  { title: "MP Board 12th Result 2026 - MPBSE Higher Secondary", excerpt: "MPBSE 12th result 2026 declared for all streams. Check marks at mpresults.nic.in.", category: "Board Result", date: "04 Sep 2026", state: "Madhya Pradesh", slug: "mp-board-12th-result-2026" },
  { title: "Maharashtra Board SSC Result 2026 - MSBSHSE 10th", excerpt: "Maharashtra SSC board result 2026 at mahresult.nic.in. Check roll number wise marks and school report.", category: "Board Result", date: "03 Sep 2026", state: "Maharashtra", slug: "maharashtra-ssc-result-2026" },
  { title: "Maharashtra Board HSC Result 2026 - MSBSHSE 12th", excerpt: "Maharashtra HSC result 2026 at mahahsscboard.in for all divisions. Check subject wise marks.", category: "Board Result", date: "03 Sep 2026", state: "Maharashtra", slug: "maharashtra-hsc-result-2026" },
  { title: "Tamil Nadu 10th Result 2026 - SSLC Board Result", excerpt: "TN SSLC result 2026 at tnresults.nic.in. Check district, school wise result and download marksheet.", category: "Board Result", date: "02 Sep 2026", state: "Tamil Nadu", slug: "tn-sslc-result-2026" },
  { title: "Tamil Nadu 12th Result 2026 - HSC Board Result", excerpt: "TN HSC result 2026 for Science, Commerce, Arts at tnresults.nic.in. Check marks and download marksheet.", category: "Board Result", date: "02 Sep 2026", state: "Tamil Nadu", slug: "tn-hsc-result-2026" },
  { title: "Haryana Board 10th Result 2026 - HBSE Secondary", excerpt: "HBSE Class 10 result 2026 at bseh.org.in. Check roll number wise result and download marksheet.", category: "Board Result", date: "01 Sep 2026", state: "Haryana", slug: "hbse-10th-result-2026" },
  { title: "Haryana Board 12th Result 2026 - HBSE Senior Secondary", excerpt: "HBSE 12th result 2026 for all streams at bseh.org.in. Check marks, pass percentage.", category: "Board Result", date: "01 Sep 2026", state: "Haryana", slug: "hbse-12th-result-2026" },
  { title: "Uttarakhand Board 10th Result 2026 - UBSE High School", excerpt: "UBSE Class 10 result 2026 at ubse.uk.gov.in. Check roll number wise marks and marksheet.", category: "Board Result", date: "31 Aug 2026", state: "Uttarakhand", slug: "ubse-10th-result-2026" },
  { title: "Jharkhand Board 10th Result 2026 - JAC Matric", excerpt: "JAC 10th result 2026 at jac.jharkhand.gov.in. Check marks, division and download marksheet.", category: "Board Result", date: "30 Aug 2026", state: "Jharkhand", slug: "jac-10th-result-2026" },
  { title: "ICSE 10th Result 2026 - CISCE Board Result", excerpt: "CISCE ICSE result 2026 at cisce.org. Check subject wise marks and download marksheet.", category: "Board Result", date: "29 Aug 2026", state: "India", slug: "icse-10th-result-2026" },
  { title: "ISC 12th Result 2026 - CISCE Board Result", excerpt: "CISCE ISC result 2026 for all streams at cisce.org. Check marks and download certificate.", category: "Board Result", date: "29 Aug 2026", state: "India", slug: "isc-12th-result-2026" },
];

const defaultJobs: PostCard[] = [
  { title: "Railway Technician Recruitment 2026 - 9,144 posts", excerpt: "Eligibility, age limit, zone-wise seats, fee details and direct application link.", category: "Latest Vacancy", date: "11 Jun 2026", state: "India", slug: "" },
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

// ─── Exports ──────────────────────────────────────────────────────────────────

const s3 = getScraped();
const scrapedNotif = s3 ? [...(s3.admitCards || []), ...(s3.answerKeys || [])] : undefined;

// Filter scraped results for board exam items
const scrapedBoardResults = s3?.results?.filter(r => isBoardResult(r.title));

export const featuredResults = toPostCard(s3?.results, "Result", defaultResults);
export const boardResults = toPostCard(
  scrapedBoardResults && scrapedBoardResults.length > 0 ? scrapedBoardResults : undefined,
  "Board Result",
  defaultBoardResults,
);
export const latestJobs = toPostCard(s3?.latestJobs, "Jobs", defaultJobs);
export const notifications = toPostCard(scrapedNotif, "Notification", defaultNotifications);
export const centralExams = toPostCard(s3?.answerKeys, "Central Exams", defaultCentral);
export const admissions = toPostCard(s3?.admissions, "Admission", defaultAdmissions);
export const documents = toPostCard(s3?.documents, "Documents", defaultDocuments);

const admitCards = toPostCard(s3?.admitCards, "Admit Card", []);

export const categorySections: { label: string; items: PostCard[] }[] = [
  { label: "Latest Vacancy", items: latestJobs },
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
