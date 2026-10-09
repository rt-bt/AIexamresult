import * as fs from "fs";
import * as path from "path";
import { detectCategory, CATEGORY_DEFINITIONS, isOfficialGovDomain } from "./categories";
import { parseDate, formatDisplayDate } from "./data";

export interface ChatSearchResultItem {
  title: string;
  category: string;
  categorySlug: string;
  slug: string;
  url: string;
  date: string;
  excerpt: string;
  officialUrl?: string;
  importantDates?: string[];
  status?: string;
  score: number;
}

export interface ChatSearchIntent {
  category?: string;
  entities: string[];
  isJobSearch: boolean;
  isResultSearch: boolean;
  isAdmitSearch: boolean;
  isAnswerKeySearch: boolean;
  isSyllabusSearch: boolean;
  isAdmissionSearch: boolean;
  isScholarshipSearch: boolean;
  isBoardSearch: boolean;
  qualification?: string;
  state?: string;
}

export interface ChatSearchResult {
  results: ChatSearchResultItem[];
  intent: ChatSearchIntent;
  hasDirectMatches: boolean;
}

interface RawScrapedItem {
  title: string;
  url?: string;
  category: string;
  slug: string;
  publishedDate?: string;
  publishedAt?: string;
}

interface IndexedItem {
  title: string;
  titleLower: string;
  slug: string;
  url: string;
  categorySlug: string;
  categoryLabel: string;
  publishedDateRaw: string;
  displayDate: string;
  timestamp: number;
  tokens: Set<string>;
  state: string;
}

let _corpus: IndexedItem[] | null = null;
let _slugMap: Record<string, string> | null = null;

function getSlugMap(): Record<string, string> {
  if (_slugMap !== null) return _slugMap;
  try {
    const mapPath = path.join(process.cwd(), "data", "post-slug-map.json");
    if (fs.existsSync(mapPath)) {
      _slugMap = JSON.parse(fs.readFileSync(mapPath, "utf-8"));
      return _slugMap!;
    }
  } catch {}
  return {};
}

const STATE_KEYWORDS: Record<string, string[]> = {
  Bihar: ["bihar", "bpsc", "bssc", "bseb", "btsc", "csbc", "bpssc", "patna", "muzaffarpur"],
  "Uttar Pradesh": ["uttar pradesh", "up", "uppsc", "upsssc", "upprpb", "upmsp", "uppbpb", "lucknow", "kanpur", "prayagraj"],
  Rajasthan: ["rajasthan", "rpsc", "rsmssb", "rbse", "jaipur", "jodhpur"],
  "Madhya Pradesh": ["madhya pradesh", "mp", "mppsc", "mpbse", "peb", "esb", "bhopal", "indore", "vyapam"],
  Maharashtra: ["maharashtra", "mpsc", "msbshse", "mumbai", "pune", "nagpur"],
  Delhi: ["delhi", "dsssb"],
  Haryana: ["haryana", "hssc", "hpsc", "hbse", "chandigarh"],
  Jharkhand: ["jharkhand", "jpsc", "jssc", "jac", "ranchi"],
  Uttarakhand: ["uttarakhand", "ukpsc", "uksssc", "ubse", "dehradun"],
  Chhattisgarh: ["chhattisgarh", "cgpsc", "cgvyapam", "raipur"],
};

function guessState(text: string): string {
  const lower = text.toLowerCase();
  for (const [state, kws] of Object.entries(STATE_KEYWORDS)) {
    if (kws.some((kw) => lower.includes(kw))) return state;
  }
  return "India";
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

function initCorpus(): IndexedItem[] {
  if (_corpus !== null) return _corpus;

  const corpus: IndexedItem[] = [];
  const seenSlugs = new Set<string>();

  try {
    const scrapedPath = path.join(process.cwd(), "data", "scraped.json");
    if (fs.existsSync(scrapedPath)) {
      const scraped = JSON.parse(fs.readFileSync(scrapedPath, "utf-8"));
      const categories = ["results", "latestJobs", "admitCards", "answerKeys", "admissions", "documents"];

      const allItems: RawScrapedItem[] = [];
      for (const cat of categories) {
        if (Array.isArray(scraped[cat])) {
          allItems.push(...scraped[cat]);
        }
      }

      for (const item of allItems) {
        if (!item.slug || seenSlugs.has(item.slug)) continue;
        seenSlugs.add(item.slug);

        const title = (item.title || "").trim();
        if (!title) continue;

        const canonicalCat = detectCategory(item.category, title, item.slug);
        const catInfo = CATEGORY_DEFINITIONS[canonicalCat] || CATEGORY_DEFINITIONS["latest-jobs"];

        const postMeta = scraped.posts?.[item.slug];
        const rawDate = item.publishedAt || item.publishedDate || postMeta?.publishedAt || postMeta?.publishedDate || "";
        const parsed = parseDate(rawDate);
        const timestamp = parsed && parsed.getTime() <= Date.now() ? parsed.getTime() : 0;
        const displayDate = formatDisplayDate(rawDate);

        corpus.push({
          title,
          titleLower: title.toLowerCase(),
          slug: item.slug,
          url: `/post/${item.slug}`,
          categorySlug: canonicalCat,
          categoryLabel: catInfo.label,
          publishedDateRaw: rawDate,
          displayDate,
          timestamp,
          tokens: new Set(tokenize(title)),
          state: guessState(title + " " + item.slug),
        });
      }
    }
  } catch (err) {
    console.error("Failed to load corpus for chat search:", err);
  }

  _corpus = corpus;
  return corpus;
}

export function detectSearchIntent(query: string): ChatSearchIntent {
  const q = query.toLowerCase();

  const isResultSearch = /\b(result|results|scorecard|score card|merit list|cut off|cutoff|marks|rank card)\b/i.test(q) ||
    /result aaya|result kab|aaya hai kya/i.test(q);

  const isAdmitSearch = /\b(admit card|admitcard|hall ticket|call letter|city slip|exam city|exam date|admit)\b/i.test(q) ||
    /download karun|kaise download/i.test(q);

  const isAnswerKeySearch = /\b(answer key|answerkey|ans key|response sheet|objection|solution key)\b/i.test(q);

  const isJobSearch = /\b(job|jobs|vacancy|vacancies|bharti|recruitment|online form|apply online|apply|naukri)\b/i.test(q) ||
    /latest vacancy|latest job/i.test(q);

  const isSyllabusSearch = /\b(syllabus|exam pattern|pattern pdf)\b/i.test(q);
  const isAdmissionSearch = /\b(admission|admissions|counselling|entrance|deled|b\.ed)\b/i.test(q);
  const isScholarshipSearch = /\b(scholarship|scholarships|yojana)\b/i.test(q);
  const isBoardSearch = /\b(board|10th|12th|matric|inter|cbse|bseb|upmsp|rbse|hbse|icse)\b/i.test(q);

  let category: string | undefined;
  if (isResultSearch) category = "results";
  else if (isAdmitSearch) category = "admit-card";
  else if (isAnswerKeySearch) category = "answer-key";
  else if (isJobSearch) category = "latest-jobs";
  else if (isSyllabusSearch) category = "syllabus";
  else if (isAdmissionSearch) category = "admissions";
  else if (isScholarshipSearch) category = "scholarships";

  // Entity extraction & Aliases
  const entities: string[] = [];

  // SSC
  if (/\b(ssc\s*cgl|cgl)\b/i.test(q)) entities.push("ssc cgl", "cgl");
  else if (/\b(ssc\s*chsl|chsl)\b/i.test(q)) entities.push("ssc chsl", "chsl");
  else if (/\b(ssc\s*mts|mts)\b/i.test(q)) entities.push("ssc mts", "mts");
  else if (/\b(ssc\s*gd|gd constable)\b/i.test(q)) entities.push("ssc gd", "gd constable");
  else if (/\b(ssc\s*je)\b/i.test(q)) entities.push("ssc je");
  else if (/\b(ssc\s*cpo)\b/i.test(q)) entities.push("ssc cpo");
  else if (/\b(ssc)\b/i.test(q)) entities.push("ssc");

  // Railways
  if (/\b(rrb\s*ntpc|ntpc)\b/i.test(q)) entities.push("rrb ntpc", "ntpc");
  else if (/\b(rrb\s*alp|alp|loco pilot)\b/i.test(q)) entities.push("rrb alp", "alp");
  else if (/\b(rrb\s*technician|technician)\b/i.test(q)) entities.push("rrb technician", "technician");
  else if (/\b(group\s*d|rrb\s*group\s*d)\b/i.test(q)) entities.push("group d", "rrb");
  else if (/\b(railway|railways|rrb|rrc)\b/i.test(q)) entities.push("railway", "rrb");

  // UPSC
  if (/\b(upsc\s*cse|civil services|ias|ips)\b/i.test(q)) entities.push("upsc cse", "civil services");
  else if (/\b(upsc\s*nda|nda)\b/i.test(q)) entities.push("upsc nda", "nda");
  else if (/\b(upsc\s*cds|cds)\b/i.test(q)) entities.push("upsc cds", "cds");
  else if (/\b(upsc)\b/i.test(q)) entities.push("upsc");

  // Bihar
  if (/\b(bihar\s*police|bp\s*police|csbc|bpssc)\b/i.test(q)) entities.push("bihar police", "csbc", "bpssc");
  else if (/\b(bihar\s*teacher|tre)\b/i.test(q)) entities.push("bihar teacher", "bpsc");
  else if (/\b(bihar\s*board|bseb)\b/i.test(q)) entities.push("bihar board", "bseb");
  else if (/\b(bpsc)\b/i.test(q)) entities.push("bpsc");
  else if (/\b(bssc)\b/i.test(q)) entities.push("bssc");
  else if (/\b(bihar)\b/i.test(q)) entities.push("bihar");

  // UP
  if (/\b(up\s*police|uppbpb|upprpb)\b/i.test(q)) entities.push("up police", "upprpb", "uppbpb");
  else if (/\b(up\s*board|upmsp)\b/i.test(q)) entities.push("up board", "upmsp");
  else if (/\b(upsssc|pet|lekhpal)\b/i.test(q)) entities.push("upsssc", "pet", "lekhpal");
  else if (/\b(uppsc)\b/i.test(q)) entities.push("uppsc");
  else if (/\b(uttar pradesh|\bup\b)/i.test(q)) entities.push("uttar pradesh", "up");

  // Rajasthan
  if (/\b(rajasthan\s*police)\b/i.test(q)) entities.push("rajasthan police");
  else if (/\b(rpsc|rsmssb|reet|rbse)\b/i.test(q)) entities.push("rpsc", "rsmssb", "reet");
  else if (/\b(rajasthan)\b/i.test(q)) entities.push("rajasthan");

  // Banking
  if (/\b(ibps\s*po|sbi\s*po|po)\b/i.test(q)) entities.push("ibps po", "sbi po", "po");
  else if (/\b(ibps\s*clerk|sbi\s*clerk|clerk)\b/i.test(q)) entities.push("ibps clerk", "sbi clerk", "clerk");
  else if (/\b(ibps|sbi|rbi)\b/i.test(q)) entities.push("ibps", "sbi", "rbi");

  // Teaching
  if (/\b(ctet)\b/i.test(q)) entities.push("ctet");
  else if (/\b(uptet)\b/i.test(q)) entities.push("uptet");
  else if (/\b(ugc\s*net|csir\s*net|net\b)/i.test(q)) entities.push("net", "ugc net");

  // Qualification
  let qualification: string | undefined;
  if (/\b(10th\s*pass|10th|matric|highschool)\b/i.test(q)) qualification = "10th";
  else if (/\b(12th\s*pass|12th|inter|intermediate|10\+2)\b/i.test(q)) qualification = "12th";
  else if (/\b(graduate|graduation|degree|btech|ba|bsc|bcom)\b/i.test(q)) qualification = "graduate";
  else if (/\b(iti|diploma|polytechnic)\b/i.test(q)) qualification = "diploma";

  // State detection
  let state: string | undefined;
  for (const [stName, kws] of Object.entries(STATE_KEYWORDS)) {
    if (kws.some((kw) => q.includes(kw))) {
      state = stName;
      break;
    }
  }

  return {
    category,
    entities,
    isJobSearch,
    isResultSearch,
    isAdmitSearch,
    isAnswerKeySearch,
    isSyllabusSearch,
    isAdmissionSearch,
    isScholarshipSearch,
    isBoardSearch,
    qualification,
    state,
  };
}

export function loadPostDetail(slug: string) {
  const cleanSlug = slug.replace(/\.pdf$/i, "");
  const slugLower = cleanSlug.toLowerCase();
  const slugMap = getSlugMap();

  const mapped = slugMap[cleanSlug] || slugMap[slugLower] || slugMap[slug];
  const candidates: string[] = [];
  if (mapped) candidates.push(mapped.replace(/\.json$/i, ""));
  candidates.push(cleanSlug);
  if (slugLower !== cleanSlug) candidates.push(slugLower);

  for (const name of candidates) {
    try {
      const filePath = path.join(process.cwd(), "data", "posts", `${name}.json`);
      if (fs.existsSync(filePath)) {
        let raw = fs.readFileSync(filePath, "utf-8");
        if (raw.charCodeAt(0) === 0xfeff) raw = raw.substring(1);
        return JSON.parse(raw);
      }
    } catch {}
  }
  return null;
}

export async function searchContent(userQuery: string, limit: number = 4): Promise<ChatSearchResult> {
  const corpus = initCorpus();
  const qClean = userQuery.trim().toLowerCase();
  const intent = detectSearchIntent(qClean);

  // Stop words to exclude from generic token matching
  const STOP_WORDS = new Set([
    "ka", "ki", "ke", "hai", "kya", "batao", "bataiye", "bata", "kaise", "karun", "karein", "kahan",
    "mujhe", "chahiye", "do", "karo", "kab", "aayega", "milega", "hoga", "hain", "liye", "students",
    "latest", "official", "update", "online", "form", "link", "de", "dijiye", "please", "can", "you",
    "tell", "me", "show", "where", "is", "how", "to", "check", "find", "get", "exam", "exams"
  ]);

  const queryWords = tokenize(qClean).filter((w) => !STOP_WORDS.has(w));

  // Score each item
  const scoredItems = corpus.map((item) => {
    let score = 0;
    const titleLower = item.titleLower;

    // 1. Direct query exact substring match
    if (qClean.length > 3 && titleLower.includes(qClean)) {
      score += 120;
    }

    // 2. Entity matches (e.g. "SSC CGL", "Bihar Police", "RRB NTPC")
    let hasEntityMatch = false;
    for (const entity of intent.entities) {
      if (titleLower.includes(entity)) {
        score += 65;
        hasEntityMatch = true;
      }
    }

    // 3. Category match / intent boost
    if (intent.category) {
      if (item.categorySlug === intent.category) {
        score += 45;
      } else {
        // Strong penalty if searching for a result but matching a vacancy, or vice versa
        score -= 25;
      }
    }

    // 4. State match
    if (intent.state && item.state === intent.state) {
      score += 35;
    }

    // 5. Qualification match
    if (intent.qualification) {
      if (intent.qualification === "12th" && (titleLower.includes("12th") || titleLower.includes("inter") || titleLower.includes("10+2"))) {
        score += 40;
      } else if (intent.qualification === "10th" && (titleLower.includes("10th") || titleLower.includes("matric") || titleLower.includes("high school"))) {
        score += 40;
      } else if (intent.qualification === "graduate" && (titleLower.includes("graduate") || titleLower.includes("cgl") || titleLower.includes("degree"))) {
        score += 35;
      }
    }

    // 6. Token overlap
    let matchedTokenCount = 0;
    for (const word of queryWords) {
      if (item.tokens.has(word) || titleLower.includes(word)) {
        score += 15;
        matchedTokenCount++;
      }
    }

    // 7. Recency bonus (prefer recent 2026 posts)
    if (item.timestamp > 0) {
      const now = Date.now();
      const ageDays = (now - item.timestamp) / (1000 * 60 * 60 * 24);
      if (ageDays <= 30) score += 20;
      else if (ageDays <= 90) score += 10;
      else if (ageDays <= 365) score += 5;
    }

    return {
      item,
      score,
      hasEntityMatch,
      matchedTokenCount,
    };
  });

  // Filter items with meaningful relevance
  const minThreshold = intent.entities.length > 0 ? 40 : 25;
  const filtered = scoredItems
    .filter((entry) => entry.score >= minThreshold)
    .sort((a, b) => b.score - a.score);

  const topItems = filtered.slice(0, limit);

  // Enrich with detailed JSON if available
  const results: ChatSearchResultItem[] = topItems.map(({ item, score }) => {
    let excerpt = `${item.categoryLabel} update for ${item.title}. Check important dates, syllabus, and official instructions on AIExamResult.`;
    let officialUrl: string | undefined;
    let importantDates: string[] | undefined;

    const detail = loadPostDetail(item.slug);
    if (detail) {
      if (detail.intro && typeof detail.intro === "string") {
        const cleanIntro = detail.intro
          .replace(/<[^>]*>/g, "")
          .replace(/\[adinserter[^\]]*\]/gi, "")
          .trim();
        if (cleanIntro.length > 20) {
          excerpt = cleanIntro.slice(0, 160) + (cleanIntro.length > 160 ? "..." : "");
        }
      }

      if (Array.isArray(detail.importantDates) && detail.importantDates.length > 0) {
        importantDates = detail.importantDates.slice(0, 3);
      }

      if (Array.isArray(detail.importantLinks)) {
        // Find best official URL
        for (const link of detail.importantLinks) {
          if (!link.url || typeof link.url !== "string") continue;
          const urlStr = link.url.trim();
          if (!/^https?:\/\//i.test(urlStr) || urlStr.includes("cdn-cgi")) continue;

          // Prefer official government domains
          if (isOfficialGovDomain(urlStr)) {
            officialUrl = urlStr;
            break;
          }

          // Otherwise look for official notice or website label
          const labelLower = (link.label || "").toLowerCase();
          if (
            labelLower.includes("official website") ||
            labelLower.includes("official advertisement") ||
            labelLower.includes("download notification") ||
            labelLower.includes("apply online") ||
            labelLower.includes("download result")
          ) {
            officialUrl = urlStr;
          }
        }
      }
    }

    return {
      title: item.title,
      category: item.categoryLabel,
      categorySlug: item.categorySlug,
      slug: item.slug,
      url: item.url,
      date: item.displayDate,
      excerpt,
      officialUrl,
      importantDates,
      score,
    };
  });

  return {
    results,
    intent,
    hasDirectMatches: results.length > 0,
  };
}
