import { detectCategory, CATEGORY_DEFINITIONS } from "./categories";

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
  if (typeof window !== "undefined") return null;
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
  if (!s?.posts) return null;
  return s.posts[slug] || s.posts[slug.toLowerCase()] || null;
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

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDisplayDate(raw?: string | null): string {
  if (!raw) return "";
  const d = parseDate(raw);
  if (d) {
    // Sanity check: A publication/upload date can NEVER be in the future!
    if (d.getTime() > Date.now()) {
      return "";
    }
    const day = String(d.getDate()).padStart(2, "0");
    const mon = SHORT_MONTHS[d.getMonth()];
    const yr = d.getFullYear();
    return `${day} ${mon} ${yr}`;
  }
  // If parsing failed but string has a 4-digit year, check that it's not a future year
  if (/\d{4}/.test(raw)) {
    const yr = raw.match(/\b(20\d{2})\b/);
    if (yr && parseInt(yr[1]) > new Date().getFullYear()) return "";
    return raw.trim();
  }
  return "";
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

function generateExcerpt(item: { title: string; category?: string; slug?: string }, canonicalCat: string): string {
  const t = item.title.toLowerCase();
  switch (canonicalCat) {
    case "results":
      if (t.includes("score card") || t.includes("scorecard")) {
        return "Check Sarkari exam scorecard, subject-wise marks and official score download link.";
      }
      if (t.includes("merit list") || t.includes("selection list")) {
        return "View official merit list, selected candidates roll numbers and cut-off marks.";
      }
      if (t.includes("cut off") || t.includes("cutoff")) {
        return "Check official category-wise cut-off marks, qualifying scores and result summary.";
      }
      if (t.includes("marks")) {
        return "Check subject-wise marks, qualifying status and official marks download link.";
      }
      return "Check latest Sarkari exam result, marks, scorecard, cut-off marks and official merit list.";
    case "admit-card":
      if (t.includes("city slip") || t.includes("exam city") || t.includes("city details")) {
        return "Check exam city intimation slip, center location and shift timing instructions.";
      }
      return "Download hall ticket, exam city slip and check exam shift schedule and reporting time.";
    case "answer-key":
      return "Download official question paper and provisional/final answer key with objection link.";
    case "syllabus":
      return "Download detailed exam syllabus, topic-wise marks distribution and exam pattern PDF.";
    case "scholarships":
      return "Check eligibility requirements, scholarship amount, documents needed and application procedure.";
    case "admissions":
      return "Check admission schedule, eligibility criteria, counselling dates and application link.";
    case "documents":
      return "Download official application forms, certificates and check issuance instructions.";
    case "latest-jobs":
    default:
      return "Check eligibility criteria, total vacancies, age limit, selection process and online application details.";
  }
}

function toPostCard(
  items: ({ title: string; url: string; category: string; slug: string; publishedDate?: string; publishedAt?: string })[] | undefined,
  defaultCategory: string,
  fallbacks: PostCard[]
): PostCard[] {
  if (!items || items.length === 0) return fallbacks;
  const s2 = getScraped();
  const nowMs = Date.now();
  const seenSlugs = new Set<string>();
  const results: PostCard[] = [];

  for (const item of items) {
    if (!item.slug || seenSlugs.has(item.slug)) continue;
    seenSlugs.add(item.slug);

    const detail = s2?.posts?.[item.slug];
    let permanentDate = item.publishedAt || item.publishedDate || detail?.publishedAt || detail?.publishedDate || "";
    const parsedPerm = parseDate(permanentDate);
    if (parsedPerm && parsedPerm.getTime() > nowMs) {
      permanentDate = "";
    }
    const displayDate = formatDisplayDate(permanentDate);

    const pubAtDate = item.publishedAt ? parseDate(item.publishedAt) : null;
    const pubAtMs = pubAtDate ? pubAtDate.getTime() : null;
    const safePublishedAt = pubAtMs !== null && pubAtMs <= nowMs ? item.publishedAt : detail?.publishedAt;

    const pubDateDate = item.publishedDate ? parseDate(item.publishedDate) : null;
    const pubDateMs = pubDateDate ? pubDateDate.getTime() : null;
    const safePublishedDate = pubDateMs !== null && pubDateMs <= nowMs ? item.publishedDate : detail?.publishedDate;

    const canonicalCat = detectCategory(item.category, item.title, item.slug);
    const categoryInfo = CATEGORY_DEFINITIONS[canonicalCat];
    const categoryLabel = categoryInfo ? categoryInfo.label : (defaultCategory || formatCategory(item.category));
    const excerpt = generateExcerpt(item, canonicalCat);

    results.push({
      title: item.title,
      excerpt,
      category: categoryLabel,
      date: displayDate,
      state: guessState(item.title, item.slug),
      slug: item.slug,
      lastDate: cleanLastDate(detail?.lastDate),
      isExpired: detail?.isExpired,
      publishedAt: safePublishedAt,
      publishedDate: safePublishedDate,
    });
  }

  // Sort descending by publication date so newest items appear first
  results.sort((a, b) => {
    const rawA = a.publishedAt || a.publishedDate || a.date;
    const rawB = b.publishedAt || b.publishedDate || b.date;
    const dateA = parseDate(rawA);
    const dateB = parseDate(rawB);
    const timeA = dateA && dateA.getTime() <= nowMs ? dateA.getTime() : 0;
    const timeB = dateB && dateB.getTime() <= nowMs ? dateB.getTime() : 0;
    return timeB - timeA;
  });

  return results;
}

function formatCategory(cat: string): string {
  const map: Record<string, string> = {
    results: "Result",
    admitcards: "Admit Card",
    latestjobs: "Latest Vacancy",
    answerkeys: "Answer Key",
    documents: "Documents",
    admissions: "Admission",
    syllabus: "Syllabus",
    scholarships: "Scholarship",
  };
  return map[cat.replace(/\s+/g, "").toLowerCase()] ?? cat;
}

const STATE_RULES: { name: string; pattern: RegExp }[] = [
  { name: "Uttar Pradesh", pattern: /\b(uttar pradesh|up|uppsc|upsssc|upprpb|upmsp|uppbpb|updeled|uptet|up police|lucknow|kanpur|varanasi|prayagraj|allahabad)\b/i },
  { name: "Bihar", pattern: /\b(bihar|bpsc|bssc|bseb|btsc|csbc|bpssc|patna|muzaffarpur|bihar police|bihar teacher)\b/i },
  { name: "Rajasthan", pattern: /\b(rajasthan|rpsc|rsmssb|rbse|raj |jaipur|jodhpur|rajasthan police|rajasthan cet)\b/i },
  { name: "Madhya Pradesh", pattern: /\b(madhya pradesh|mp|mppsc|mpeb|mpbse|peb|esb|bhopal|indore|vyapam)\b/i },
  { name: "Maharashtra", pattern: /\b(maharashtra|mpsc|msbshse|maha |mumbai|pune|nagpur)\b/i },
  { name: "Delhi", pattern: /\b(delhi|dsssb|delhi police|du |dtu|dssb)\b/i },
  { name: "Haryana", pattern: /\b(haryana|hssc|hpsc|hbse|chandigarh|gurugram|faridabad)\b/i },
  { name: "Punjab", pattern: /\b(punjab|psssb|ppsc|pseb|amritsar|ludhiana)\b/i },
  { name: "Uttarakhand", pattern: /\b(uttarakhand|ukpsc|uksssc|ubse|dehradun)\b/i },
  { name: "Jharkhand", pattern: /\b(jharkhand|jpsc|jssc|jac|ranchi|dhanbad)\b/i },
  { name: "Odisha", pattern: /\b(odisha|orissa|opsc|osssc|ossc|bhubaneswar|cuttack)\b/i },
  { name: "West Bengal", pattern: /\b(west bengal|wbpsc|wbssc|wbbse|wbprb|kolkata)\b/i },
  { name: "Gujarat", pattern: /\b(gujarat|gpsc|gsssb|gseb|ahmedabad|gandhinagar)\b/i },
  { name: "Karnataka", pattern: /\b(karnataka|kpsc|kea|ksea|bengaluru|bangalore)\b/i },
  { name: "Tamil Nadu", pattern: /\b(tamil nadu|tnpsc|trb|tndte|chennai|madurai)\b/i },
  { name: "Andhra Pradesh", pattern: /\b(andhra pradesh|appsc|ap dsc|ap police|vijayawada|visakhapatnam)\b/i },
  { name: "Telangana", pattern: /\b(telangana|tspsc|ts police|hyderabad|warangal)\b/i },
  { name: "Kerala", pattern: /\b(kerala|kpsc|ktet|thiruvananthapuram|kochi)\b/i },
  { name: "Assam", pattern: /\b(assam|apsc|slprb|guwahati|dispur)\b/i },
  { name: "Chhattisgarh", pattern: /\b(chhattisgarh|cgpsc|cgvyapam|raipur|bilaspur)\b/i },
  { name: "Himachal Pradesh", pattern: /\b(himachal pradesh|hppsc|hpscb|hpssc|shimla)\b/i },
  { name: "Jammu & Kashmir", pattern: /\b(jammu|kashmir|jkpsc|jkssb|srinagar)\b/i },
];

function guessState(title: string, slug?: string): string {
  const text = (title + " " + (slug || "")).toLowerCase();
  for (const rule of STATE_RULES) {
    if (rule.pattern.test(text)) return rule.name;
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

// Pool all scraped items across categories
const allScrapedItems = s3
  ? [
      ...(s3.latestJobs || []),
      ...(s3.results || []),
      ...(s3.admitCards || []),
      ...(s3.answerKeys || []),
      ...(s3.admissions || []),
      ...(s3.documents || []),
    ]
  : [];

// Filter all items by canonical detected category
const scrapedResults = allScrapedItems.filter(item => detectCategory(item.category, item.title, item.slug) === "results");
const scrapedJobs = allScrapedItems.filter(item => detectCategory(item.category, item.title, item.slug) === "latest-jobs");
const scrapedAdmitCards = allScrapedItems.filter(item => detectCategory(item.category, item.title, item.slug) === "admit-card");
const scrapedAnswerKeys = allScrapedItems.filter(item => detectCategory(item.category, item.title, item.slug) === "answer-key");
const scrapedSyllabus = allScrapedItems.filter(item => detectCategory(item.category, item.title, item.slug) === "syllabus");
const scrapedScholarships = allScrapedItems.filter(item => detectCategory(item.category, item.title, item.slug) === "scholarships");
const scrapedAdmissions = allScrapedItems.filter(item => detectCategory(item.category, item.title, item.slug) === "admissions");
const scrapedDocuments = allScrapedItems.filter(item => detectCategory(item.category, item.title, item.slug) === "documents");

// Filter scraped results for board exam items
const scrapedBoardResults = scrapedResults.filter(r => isBoardResult(r.title));

export const featuredResults = toPostCard(
  scrapedResults.length > 0 ? scrapedResults : undefined,
  "Result",
  defaultResults
);
export const boardResults = toPostCard(
  scrapedBoardResults && scrapedBoardResults.length > 0 ? scrapedBoardResults : undefined,
  "Board Result",
  defaultBoardResults,
);
export const latestJobs = toPostCard(
  scrapedJobs.length > 0 ? scrapedJobs : undefined,
  "Latest Vacancy",
  defaultJobs
);
export const centralExams = toPostCard(
  scrapedAnswerKeys.length > 0 ? scrapedAnswerKeys : undefined,
  "Answer Key",
  defaultCentral
);
export const admitCards = toPostCard(
  scrapedAdmitCards.length > 0 ? scrapedAdmitCards : undefined,
  "Admit Card",
  []
);
export const notifications = toPostCard(
  [...scrapedAdmitCards, ...scrapedAnswerKeys],
  "Notification",
  defaultNotifications
);
export const syllabusItems = toPostCard(
  scrapedSyllabus.length > 0 ? scrapedSyllabus : undefined,
  "Syllabus",
  []
);
export const scholarshipItems = toPostCard(
  scrapedScholarships.length > 0 ? scrapedScholarships : undefined,
  "Scholarship",
  []
);
export const admissions = toPostCard(
  scrapedAdmissions.length > 0 ? scrapedAdmissions : undefined,
  "Admission",
  defaultAdmissions
);
export const documents = toPostCard(
  scrapedDocuments.length > 0 ? scrapedDocuments : undefined,
  "Documents",
  defaultDocuments
);

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
  syllabus: syllabusItems,
  scholarships: scholarshipItems,
};
