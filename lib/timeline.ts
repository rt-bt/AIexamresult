/**
 * AIExamResult Timeline Engine
 * 
 * Single source of truth for Date-Driven Exam/Recruitment Timeline & Progress.
 * Timezone: Asia/Kolkata (IST, UTC+05:30)
 * Evaluates real date data and official release status.
 * Never marks future or unreleased stages as completed.
 */

export type TimelineStageStatus = "completed" | "active" | "upcoming" | "unavailable";

export type TimelineStageId =
  | "notification"
  | "application"
  | "admitCard"
  | "exam"
  | "answerKey"
  | "result";

export interface TimelineStage {
  id: TimelineStageId;
  label: string;
  shortLabel: string;
  status: TimelineStageStatus;
  dateDisplay: string | null;
  startDate?: string | null; // YYYY-MM-DD
  endDate?: string | null;   // YYYY-MM-DD
  date?: string | null;      // YYYY-MM-DD
  isCurrent: boolean;        // true if this is the active/current stage
  detail?: string;
}

export interface CurrentTimelineStageResult {
  stage: TimelineStageId;
  label: string;
  status: TimelineStageStatus;
  progressIndex: number;
  progressPercent: number; // 0 to 100 percentage where visual track stops
  message: string;
}

export interface TimelineData {
  stages: TimelineStage[];
  currentStage: CurrentTimelineStageResult;
  completedCount: number;
  totalStages: number;
  referenceDate: string; // YYYY-MM-DD in IST
}

export interface ExtractedEventDates {
  notification: { date: string | null; text: string | null; isExplicit: boolean };
  application: { start: string | null; end: string | null; text: string | null; isClosed: boolean };
  admitCard: {
    date: string | null;
    startDate?: string | null;
    endDate?: string | null;
    label?: string | null;
    text: string | null;
    isReleased: boolean;
    isUnreleased: boolean;
  };
  exam: { start: string | null; end: string | null; text: string | null; isCompleted: boolean };
  answerKey: { date: string | null; text: string | null; isReleased: boolean; isUnreleased: boolean };
  result: { date: string | null; text: string | null; isReleased: boolean; isUnreleased: boolean };
}

const MONTH_MAP: Record<string, number> = {
  january: 1, jan: 1,
  february: 2, feb: 2,
  march: 3, mar: 3,
  april: 4, apr: 4,
  may: 5,
  june: 6, jun: 6,
  july: 7, jul: 7,
  august: 8, aug: 8,
  september: 9, sep: 9, sept: 9,
  october: 10, oct: 10,
  november: 11, nov: 11,
  december: 12, dec: 12,
};

const MONTH_NAMES_SHORT = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Returns the current date in Asia/Kolkata timezone as { dateStr: "YYYY-MM-DD", year, month, day }.
 * If overrideDate is passed (Date or YYYY-MM-DD string), normalizes it.
 */
export function getNowIST(overrideDate?: string | Date | null): {
  dateStr: string;
  year: number;
  month: number;
  day: number;
} {
  if (overrideDate) {
    if (typeof overrideDate === "string") {
      const trimmed = overrideDate.trim();
      const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (isoMatch) {
        return {
          dateStr: `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`,
          year: parseInt(isoMatch[1], 10),
          month: parseInt(isoMatch[2], 10),
          day: parseInt(isoMatch[3], 10),
        };
      }
      const parsed = parseIndianDate(trimmed);
      if (parsed) {
        const [y, m, d] = parsed.split("-").map(Number);
        return { dateStr: parsed, year: y, month: m, day: d };
      }
      const dObj = new Date(trimmed);
      if (!isNaN(dObj.getTime())) {
        return formatDatePartsIST(dObj);
      }
    } else if (overrideDate instanceof Date && !isNaN(overrideDate.getTime())) {
      return formatDatePartsIST(overrideDate);
    }
  }

  return formatDatePartsIST(new Date());
}

function formatDatePartsIST(d: Date): { dateStr: string; year: number; month: number; day: number } {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(d);

    const year = parseInt(parts.find((p) => p.type === "year")?.value || "2026", 10);
    const month = parseInt(parts.find((p) => p.type === "month")?.value || "01", 10);
    const day = parseInt(parts.find((p) => p.type === "day")?.value || "01", 10);

    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return { dateStr, year, month, day };
  } catch {
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth() + 1;
    const day = d.getUTCDate();
    const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return { dateStr, year: y, month: m, day };
  }
}

/**
 * Checks whether text explicitly indicates that an event is unreleased, upcoming, or pending.
 */
export function isExplicitlyUnreleased(text?: string | null): boolean {
  if (!text || typeof text !== "string") return true;
  const t = text.toLowerCase().trim();
  if (t === "" || t === "-" || t === "—") return true;
  return (
    t.includes("not released") ||
    t.includes("not available") ||
    t.includes("notify later") ||
    t.includes("will be notified") ||
    t.includes("before exam") ||
    t.includes("after exam") ||
    t.includes("available soon") ||
    t.includes("update soon") ||
    t.includes("updated soon") ||
    t.includes("to be notified") ||
    t.includes("to be announced") ||
    t.includes("to be declared") ||
    t.includes("tentative") ||
    t.includes("as per schedule") ||
    t.includes("check portal") ||
    t.includes("check website") ||
    t.includes("check official") ||
    t.includes("coming soon") ||
    t.includes("will be declared") ||
    t.includes("yet to be")
  );
}

/**
 * Checks whether text explicitly indicates that an event has been officially released.
 */
export function isExplicitlyReleased(text?: string | null): boolean {
  if (!text || typeof text !== "string") return false;
  const t = text.toLowerCase().trim();
  // Negative checks first
  if (isExplicitlyUnreleased(t)) return false;
  return (
    t.includes("released") ||
    t.includes("declared") ||
    t.includes("available now") ||
    t.includes("out now") ||
    t.includes("active now") ||
    t.includes("live now") ||
    t.includes("published") ||
    t.includes("download link active") ||
    t.includes("click here to download") ||
    t.includes("check here")
  );
}

/**
 * Parses an Indian date representation into normalized "YYYY-MM-DD" string.
 * Supports:
 * - "28 September 2026", "28 Sep 2026", "05-Oct-2026"
 * - "28/09/2026", "28-09-2026" (DD/MM/YYYY or DD-MM-YYYY)
 * - "2026-09-28" (ISO)
 * Returns null if not a parseable date.
 */
export function parseIndianDate(raw?: string | null): string | null {
  if (!raw || typeof raw !== "string") return null;

  // Clean time and extra punctuation
  const clean = raw
    .replace(/\uFFFD/g, " ")
    .replace(/\u00A0/g, " ")
    .replace(/\s*\|\s*\d{1,2}:\d{2}\s*(?:AM|PM).*/i, "")
    .replace(/[\s:|]+\d{1,2}:\d{2}\s*(?:AM|PM).*$/i, "")
    .replace(/^(?:date|starts?|ends?|from|till|on)\s*[:–-]?\s*/i, "")
    .trim();

  if (isExplicitlyUnreleased(clean)) return null;

  // Pattern 1: ISO YYYY-MM-DD
  const isoMatch = clean.match(/\b(20\d{2})[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])\b/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  // Pattern 2: DD Month YYYY (e.g. "28 September 2026", "28 Sep 2026", "5 Oct 2026", "05-Sep-2026")
  const wordsMatch = clean.match(
    /\b(0?[1-9]|[12]\d|3[01])\s*(?:st|nd|rd|th)?[\s\-\/]+(january|february|march|april|may|june|july|august|september|sept|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s\-\/,]+(20\d{2})\b/i
  );
  if (wordsMatch) {
    const day = parseInt(wordsMatch[1], 10);
    const mName = wordsMatch[2].toLowerCase();
    const month = MONTH_MAP[mName];
    const year = parseInt(wordsMatch[3], 10);
    if (month && day >= 1 && day <= 31) {
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
  }

  // Pattern 3: DD/MM/YYYY or DD-MM-YYYY (Indian standard day-first)
  const ddmmyyMatch = clean.match(/\b(0?[1-9]|[12]\d|3[01])[\/\-](0?[1-9]|1[0-2])[\/\-](20\d{2})\b/);
  if (ddmmyyMatch) {
    const day = parseInt(ddmmyyMatch[1], 10);
    const month = parseInt(ddmmyyMatch[2], 10);
    const year = parseInt(ddmmyyMatch[3], 10);
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  // Pattern 4: Month YYYY without day (e.g. "November 2026")
  const monYearMatch = clean.match(
    /\b(january|february|march|april|may|june|july|august|september|sept|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s\-,]+(20\d{2})\b/i
  );
  if (monYearMatch) {
    const mName = monYearMatch[1].toLowerCase();
    const month = MONTH_MAP[mName];
    const year = parseInt(monYearMatch[2], 10);
    if (month) {
      // Default to 1st of month for date calculation
      return `${year}-${String(month).padStart(2, "0")}-01`;
    }
  }

  return null;
}

/**
 * Formats a normalized "YYYY-MM-DD" string into human readable display string.
 * Example: "2026-09-28" -> "28 Sep 2026"
 */
export function formatDisplayDateIST(dateStr?: string | null): string {
  if (!dateStr) return "";
  const parts = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!parts) return dateStr;
  const y = parts[1];
  const m = parseInt(parts[2], 10);
  const d = parseInt(parts[3], 10);
  const mName = MONTH_NAMES_SHORT[m] || "";
  return `${d} ${mName} ${y}`;
}

/**
 * Parses date range text such as:
 * - "28 September 2026 to 20 October 2026"
 * - "15 to 20 November 2026"
 * - "15-20 November 2026"
 * - "28/09/2026 - 20/10/2026"
 */
export function parseDateRange(text?: string | null): { start: string | null; end: string | null } {
  if (!text) return { start: null, end: null };

  // Split by "to", "–", or "-"
  const splitMatch = text.match(/(.+?)(?:\s+to\s+|\s*[–—]\s*|\s*-\s*)(.+)/i);
  if (splitMatch) {
    const left = splitMatch[1].trim();
    const right = splitMatch[2].trim();

    let startDate = parseIndianDate(left);
    const endDate = parseIndianDate(right);

    // Case: "15 to 20 November 2026" (left has only day "15", right has "20 November 2026")
    if (!startDate && endDate) {
      const leftDayMatch = left.match(/\b(0?[1-9]|[12]\d|3[01])\b/);
      if (leftDayMatch) {
        const [y, m] = endDate.split("-");
        startDate = `${y}-${m}-${leftDayMatch[1].padStart(2, "0")}`;
      }
    }

    return { start: startDate, end: endDate };
  }

  // Single date fallback
  const single = parseIndianDate(text);
  return { start: single, end: single };
}

/**
 * Scans post dates, links, and text to extract verified timeline milestones.
 */
export function extractPostEventDates(post: any, referenceDate?: string | Date | null): ExtractedEventDates {
  const { dateStr: today } = getNowIST(referenceDate);
  const result: ExtractedEventDates = {
    notification: { date: null, text: null, isExplicit: false },
    application: { start: null, end: null, text: null, isClosed: false },
    admitCard: { date: null, startDate: null, endDate: null, label: null, text: null, isReleased: false, isUnreleased: true },
    exam: { start: null, end: null, text: null, isCompleted: false },
    answerKey: { date: null, text: null, isReleased: false, isUnreleased: true },
    result: { date: null, text: null, isReleased: false, isUnreleased: true },
  };

  const dates: string[] = Array.isArray(post.importantDates) ? post.importantDates : [];
  const links: { label?: string; url?: string }[] = Array.isArray(post.importantLinks) ? post.importantLinks : [];
  const title = (post.title || "").toLowerCase();
  const cat = (post.category || "").toLowerCase();

  // Helper to test active link
  const hasActiveLink = (keyword: RegExp): boolean => {
    return links.some((l) => {
      const lbl = (l.label || "").toLowerCase();
      const u = (l.url || "").trim();
      return keyword.test(lbl) && u !== "" && u !== "#" && !u.startsWith("javascript");
    });
  };

  // 1. Notification
  let notifDate: string | null = null;
  for (const d of dates) {
    if (typeof d !== "string") continue;
    const lower = d.toLowerCase();
    if (lower.includes("notification") && (lower.includes("date") || lower.includes("release"))) {
      const val = d.includes(":") ? d.split(":").slice(1).join(":").trim() : d;
      notifDate = parseIndianDate(val);
      result.notification.text = val;
      if (notifDate) {
        result.notification.isExplicit = true;
        break;
      }
    }
  }
  if (!notifDate) {
    const rawPub = post.publishedDate || post.publishedAt || post.createdAt;
    notifDate = parseIndianDate(rawPub);
  }
  result.notification.date = notifDate;

  // 2. Application
  let appStart: string | null = null;
  let appEnd: string | null = null;

  for (const d of dates) {
    if (typeof d !== "string") continue;
    const lower = d.toLowerCase();
    const val = d.includes(":") ? d.split(":").slice(1).join(":").trim() : d;

    // Start
    const isStartKeyword =
      lower.includes("start") || lower.includes("begin") || lower.includes("opening") || lower.includes("commence");
    const isNotExamOrAdmit =
      !lower.includes("exam") &&
      !lower.includes("admit") &&
      !lower.includes("card") &&
      !lower.includes("result") &&
      !lower.includes("answer") &&
      !lower.includes("correction");
    if (isStartKeyword && isNotExamOrAdmit) {
      if (!appStart) {
        appStart = parseIndianDate(val);
        result.application.text = val;
      }
    }

    // End / Last date
    if (
      lower.includes("last date") ||
      lower.includes("closing date") ||
      (lower.includes("apply") && lower.includes("last"))
    ) {
      if (!appEnd) {
        appEnd = parseIndianDate(val);
      }
    }
  }

  // Fallback for end date from post.lastDate
  if (!appEnd && post.lastDate) {
    appEnd = parseIndianDate(post.lastDate);
  }

  result.application.start = appStart;
  result.application.end = appEnd;

  // 3. Admit Card (Prioritize Prelims / Tier 1 / Main / Active Dummy Admit Card over PET)
  let bestAdmitVal: string | null = null;
  let bestAdmitLabel: string | null = null;
  let bestAdmitStart: string | null = null;
  let bestAdmitEnd: string | null = null;
  let bestAdmitScore = -999;

  for (const d of dates) {
    if (typeof d !== "string") continue;
    const lower = d.toLowerCase();
    if (
      lower.includes("admit card") ||
      lower.includes("hall ticket") ||
      lower.includes("city intimation") ||
      lower.includes("dummy admit")
    ) {
      const parts = d.split(":");
      const rawLabel = parts[0].trim();
      const val = parts.slice(1).join(":").trim() || d.trim();
      const isPet = lower.includes("pet admit") || lower.includes("training admit") || lower.includes("pst admit");

      const range = parseDateRange(val);
      const singleDate = parseIndianDate(val);
      const isRange = Boolean(range.start && range.end && range.start !== range.end);
      const start = isRange ? range.start : singleDate;
      const end = isRange ? range.end : null;

      let score = 10;
      if (isPet) score -= 30;

      // Alignment with post title
      if (title.includes("2nd dummy") && lower.includes("2nd dummy")) score += 60;
      else if (title.includes("1st dummy") && lower.includes("1st dummy")) score += 60;
      else if (title.includes("dummy") && lower.includes("dummy")) score += 30;
      if (lower.includes("2nd dummy")) score += 25;
      if (lower.includes("pre admit") || lower.includes("tier 1 admit") || lower.includes("exam admit") || lower.includes("main admit")) score += 20;

      // Actual date vs unreleased placeholder
      if (start || end) {
        score += 20;
      } else {
        score -= 15;
      }

      // Timeliness relative to today (Asia/Kolkata)
      if (start && end && today >= start && today <= end) {
        // Currently active date range!
        score += 40;
      } else if (start && today >= start && (!end || today <= end)) {
        // Released / ongoing
        score += 30;
      } else if (start && today < start) {
        // Upcoming
        score += 15;
      } else if (end && today > end) {
        // Window expired in the past
        score -= 10;
      }

      if (score > bestAdmitScore) {
        bestAdmitScore = score;
        bestAdmitVal = val;
        bestAdmitLabel = rawLabel;
        bestAdmitStart = start;
        bestAdmitEnd = end;
      }
    }
  }

  if (bestAdmitVal) {
    result.admitCard.text = bestAdmitVal;
    result.admitCard.date = bestAdmitStart || bestAdmitEnd || parseIndianDate(bestAdmitVal);
    result.admitCard.startDate = bestAdmitStart;
    result.admitCard.endDate = bestAdmitEnd;
    result.admitCard.label = bestAdmitLabel;
    result.admitCard.isReleased = isExplicitlyReleased(bestAdmitVal) || (bestAdmitStart ? today >= bestAdmitStart : false);
    result.admitCard.isUnreleased = isExplicitlyUnreleased(bestAdmitVal);
  }

  // Official Category/Title/Link override for Admit Card
  if (cat.includes("admit") || (title.includes("admit card") && (title.includes("released") || title.includes("out") || title.includes("download")))) {
    if (hasActiveLink(/admit|hall|card/i)) {
      result.admitCard.isReleased = true;
      result.admitCard.isUnreleased = false;
    }
  }

  // 4. Exam
  for (const d of dates) {
    if (typeof d !== "string") continue;
    const lower = d.toLowerCase();
    if (
      (lower.includes("exam date") ||
        lower.includes("examination date") ||
        lower.includes("tier 1") ||
        lower.includes("cbt date") ||
        lower.includes("written exam") ||
        lower.includes("exam start") ||
        lower.includes("exam begin") ||
        lower.includes("pre exam") ||
        lower.includes("main exam")) &&
      !lower.includes("admit") &&
      !lower.includes("result")
    ) {
      const val = d.includes(":") ? d.split(":").slice(1).join(":").trim() : d;
      result.exam.text = val;
      const range = parseDateRange(val);
      result.exam.start = range.start;
      result.exam.end = range.end;
      break;
    }
  }

  // 5. Answer Key
  for (const d of dates) {
    if (typeof d !== "string") continue;
    const lower = d.toLowerCase();
    if (lower.includes("answer key") || lower.includes("response sheet") || lower.includes("objection")) {
      const val = d.includes(":") ? d.split(":").slice(1).join(":").trim() : d;
      result.answerKey.text = val;
      result.answerKey.date = parseIndianDate(val);
      result.answerKey.isReleased = isExplicitlyReleased(val);
      result.answerKey.isUnreleased = isExplicitlyUnreleased(val);
      break;
    }
  }

  // Official Category/Title/Link override for Answer Key
  if (cat.includes("answer") || (title.includes("answer key") && (title.includes("released") || title.includes("out") || title.includes("objection")))) {
    if (hasActiveLink(/answer|key|objection/i)) {
      result.answerKey.isReleased = true;
      result.answerKey.isUnreleased = false;
    }
  }

  // 6. Result
  for (const d of dates) {
    if (typeof d !== "string") continue;
    const lower = d.toLowerCase();
    if (lower.includes("result") && !lower.includes("admit") && !lower.includes("answer")) {
      const val = d.includes(":") ? d.split(":").slice(1).join(":").trim() : d;
      result.result.text = val;
      result.result.date = parseIndianDate(val);
      result.result.isReleased = isExplicitlyReleased(val);
      result.result.isUnreleased = isExplicitlyUnreleased(val);
      break;
    }
  }

  // Official Category/Title/Link override for Result
  if (cat.includes("result") || (title.includes("result") && (title.includes("declared") || title.includes("out") || title.includes("scorecard") || title.includes("merit")))) {
    if (hasActiveLink(/result|scorecard|merit/i)) {
      result.result.isReleased = true;
      result.result.isUnreleased = false;
    }
  }

  return result;
}

/**
 * Builds the complete normalized Timeline for a given post as of today's date in IST.
 */
export function buildPostTimeline(post: any, referenceDate?: string | Date | null): TimelineData {
  const { dateStr: today } = getNowIST(referenceDate);
  const ev = extractPostEventDates(post, referenceDate);
  const stages: TimelineStage[] = [];

  const cat = (post.category || "").toLowerCase();
  const title = (post.title || "").toLowerCase();

  // --- STAGE 1: NOTIFICATION ---
  const notifDate = ev.notification.date;
  let notifStatus: TimelineStageStatus = "completed";
  if (notifDate && notifDate > today) {
    notifStatus = "upcoming";
  }
  stages.push({
    id: "notification",
    label: "Notification",
    shortLabel: "Notification",
    status: notifStatus,
    dateDisplay: notifDate ? formatDisplayDateIST(notifDate) : "Released",
    date: notifDate,
    isCurrent: false,
  });

  // --- STAGE 2: APPLICATION (Only include if relevant) ---
  const hasAppInfo =
    ev.application.start !== null ||
    ev.application.end !== null ||
    post.lastDate ||
    cat.includes("job") ||
    title.includes("recruitment") ||
    title.includes("online form") ||
    title.includes("apply") ||
    title.includes("vacancy");

  if (hasAppInfo) {
    const start = ev.application.start;
    const end = ev.application.end;
    let appStatus: TimelineStageStatus = "unavailable";
    let appDisplay = "As per Schedule";

    if (start && end) {
      appDisplay = `${formatDisplayDateIST(start)} – ${formatDisplayDateIST(end)}`;
      if (today < start) {
        appStatus = "upcoming";
      } else if (today >= start && today <= end) {
        appStatus = "active";
      } else {
        appStatus = "completed";
      }
    } else if (end) {
      appDisplay = `Closes ${formatDisplayDateIST(end)}`;
      if (today <= end) {
        appStatus = "active";
      } else {
        appStatus = "completed";
      }
    } else if (start) {
      appDisplay = `Starts ${formatDisplayDateIST(start)}`;
      if (today < start) {
        appStatus = "upcoming";
      } else {
        appStatus = "active";
      }
    } else {
      // No dates specified but post is an active recruitment
      appStatus = "active";
      appDisplay = "Apply Online";
    }

    stages.push({
      id: "application",
      label: appStatus === "active" ? "Application Open" : "Application",
      shortLabel: "Apply",
      status: appStatus,
      dateDisplay: appDisplay,
      startDate: start,
      endDate: end,
      isCurrent: false,
    });
  }

  // --- STAGE 3: ADMIT CARD ---
  // Only include if post is exam/recruitment/admit-card related
  const isAdmitRelevant =
    ev.admitCard.text !== null ||
    ev.admitCard.date !== null ||
    cat.includes("admit") ||
    title.includes("admit") ||
    cat.includes("job") ||
    title.includes("recruitment") ||
    ev.exam.start !== null;

  if (isAdmitRelevant) {
    const aDate = ev.admitCard.date;
    const aStart = ev.admitCard.startDate || aDate;
    const aEnd = ev.admitCard.endDate || null;
    const eStart = ev.exam.start;
    let aStatus: TimelineStageStatus = "unavailable";
    let aDisplay = ev.admitCard.text || "Before Exam";

    const isReleased = ev.admitCard.isReleased || (aStart && today >= aStart);

    if (isReleased) {
      // If the admit card window has expired, or exam has passed
      if (aEnd && today > aEnd) {
        aStatus = "completed";
      } else if (eStart && today > eStart) {
        aStatus = "completed";
      } else {
        // LIVE right now!
        aStatus = "active";
      }
    } else if (aStart) {
      if (today < aStart) {
        aStatus = "upcoming";
      } else if (!aEnd || today <= aEnd) {
        aStatus = "active";
      } else {
        aStatus = "completed";
      }
    } else {
      aStatus = "unavailable";
    }

    if (aStart && aEnd && aStart !== aEnd) {
      aDisplay = `${formatDisplayDateIST(aStart)} – ${formatDisplayDateIST(aEnd)}`;
    } else if (aStart) {
      aDisplay = formatDisplayDateIST(aStart);
    } else if (aDate) {
      aDisplay = formatDisplayDateIST(aDate);
    } else if (isReleased) {
      aDisplay = "Released";
    }

    // Dynamic label based on admit card type
    let stageLabel = "Admit Card";
    let stageShortLabel = "Admit Card";
    const customLabel = ev.admitCard.label || "";
    const customLower = customLabel.toLowerCase();

    if (customLower.includes("dummy")) {
      stageLabel = customLabel; // e.g. "2nd Dummy Admit Card"
      stageShortLabel = "Dummy Admit";
    } else if (customLower.includes("city intimation")) {
      stageLabel = customLabel;
      stageShortLabel = "City Intimation";
    } else if (customLower.includes("pre admit")) {
      stageLabel = aStatus === "active" ? "Pre Admit Card Out" : "Pre Admit Card";
      stageShortLabel = "Pre Admit";
    } else {
      stageLabel = aStatus === "active" ? "Admit Card Out" : "Admit Card";
      stageShortLabel = "Admit Card";
    }

    stages.push({
      id: "admitCard",
      label: stageLabel,
      shortLabel: stageShortLabel,
      status: aStatus,
      dateDisplay: aDisplay,
      date: aDate,
      startDate: aStart,
      endDate: aEnd,
      isCurrent: false,
    });
  }

  // --- STAGE 4: EXAM ---
  const isExamRelevant =
    ev.exam.text !== null ||
    ev.exam.start !== null ||
    ev.admitCard.isReleased ||
    cat.includes("job") ||
    title.includes("recruitment") ||
    title.includes("exam");

  if (isExamRelevant) {
    const eStart = ev.exam.start;
    const eEnd = ev.exam.end || eStart;
    let eStatus: TimelineStageStatus = "unavailable";
    let eDisplay = ev.exam.text || "Notify Later";

    if (eStart) {
      eDisplay = eStart === eEnd ? formatDisplayDateIST(eStart) : `${formatDisplayDateIST(eStart)} – ${formatDisplayDateIST(eEnd!)}`;
      if (today < eStart) {
        eStatus = "upcoming";
      } else if (today >= eStart && today <= (eEnd || eStart)) {
        eStatus = "active";
      } else {
        eStatus = "completed";
      }
    } else {
      eStatus = "unavailable";
    }

    stages.push({
      id: "exam",
      label: "Exam Date",
      shortLabel: "Exam",
      status: eStatus,
      dateDisplay: eDisplay,
      startDate: eStart,
      endDate: eEnd,
      isCurrent: false,
    });
  }

  // --- STAGE 5: ANSWER KEY ---
  const isAnsRelevant =
    ev.answerKey.text !== null ||
    ev.answerKey.date !== null ||
    cat.includes("answer") ||
    title.includes("answer key") ||
    (isExamRelevant && (cat.includes("job") || title.includes("recruitment") || title.includes("cgl") || title.includes("ntpc")));

  if (isAnsRelevant) {
    const kDate = ev.answerKey.date;
    let kStatus: TimelineStageStatus = "unavailable";
    let kDisplay = ev.answerKey.text || "Not Released";

    if (ev.answerKey.isReleased) {
      kStatus = "completed";
      kDisplay = kDate ? formatDisplayDateIST(kDate) : "Released";
    } else if (kDate) {
      kDisplay = formatDisplayDateIST(kDate);
      if (today > kDate) {
        kStatus = "completed";
      } else if (today === kDate) {
        kStatus = "active";
      } else {
        kStatus = "upcoming";
      }
    } else {
      kStatus = "unavailable";
    }

    stages.push({
      id: "answerKey",
      label: "Answer Key",
      shortLabel: "Answer Key",
      status: kStatus,
      dateDisplay: kDisplay,
      date: kDate,
      isCurrent: false,
    });
  }

  // --- STAGE 6: RESULT ---
  const rDate = ev.result.date;
  let rStatus: TimelineStageStatus = "unavailable";
  let rDisplay = ev.result.text || "Not Released";

  if (ev.result.isReleased) {
    rStatus = "completed";
    rDisplay = rDate ? formatDisplayDateIST(rDate) : "Declared";
  } else if (rDate) {
    rDisplay = formatDisplayDateIST(rDate);
    if (today > rDate) {
      rStatus = "completed";
    } else if (today === rDate) {
      rStatus = "active";
    } else {
      rStatus = "upcoming";
    }
  } else {
    rStatus = "unavailable";
  }

  stages.push({
    id: "result",
    label: "Result",
    shortLabel: "Result",
    status: rStatus,
    dateDisplay: rDisplay,
    date: rDate,
    isCurrent: false,
  });

  // Calculate current stage & mark isCurrent
  const currentStage = getCurrentTimelineStage(stages);
  if (stages[currentStage.progressIndex]) {
    stages[currentStage.progressIndex].isCurrent = true;
  }

  const completedCount = stages.filter((s) => s.status === "completed").length;

  return {
    stages,
    currentStage,
    completedCount,
    totalStages: stages.length,
    referenceDate: today,
  };
}

/**
 * Single source of truth function:
 * Determines the current stage, active status, progress index, and progress percentage.
 * Progress percentage visually stops at the ACTIVE stage.
 */
export function getCurrentTimelineStage(
  stagesOrTimeline: TimelineData | TimelineStage[]
): CurrentTimelineStageResult {
  const stages: TimelineStage[] = Array.isArray(stagesOrTimeline)
    ? stagesOrTimeline
    : stagesOrTimeline.stages;

  if (!stages || stages.length === 0) {
    return {
      stage: "notification",
      label: "Notification",
      status: "completed",
      progressIndex: 0,
      progressPercent: 0,
      message: "Notification released",
    };
  }

  // 1. Look for an ACTIVE stage (search backwards to pick latest ongoing milestone)
  let activeIdx = -1;
  for (let i = stages.length - 1; i >= 0; i--) {
    if (stages[i].status === "active") {
      activeIdx = i;
      break;
    }
  }
  if (activeIdx !== -1) {
    const s = stages[activeIdx];
    const pct = stages.length > 1 ? (activeIdx / (stages.length - 1)) * 100 : 50;
    const cleanLabel = s.label.replace(/\s+out$/i, "");
    const msg =
      s.id === "admitCard"
        ? `${cleanLabel} is available to download (${s.dateDisplay || "Active"})`
        : s.id === "application"
        ? `Application is currently ongoing (${s.dateDisplay || "Active"})`
        : `${s.label} is currently ongoing (${s.dateDisplay || "Active"})`;
    return {
      stage: s.id,
      label: s.label,
      status: "active",
      progressIndex: activeIdx,
      progressPercent: Math.round(pct),
      message: msg,
    };
  }

  // 2. Look for the latest COMPLETED stage
  let lastCompletedIdx = -1;
  for (let i = 0; i < stages.length; i++) {
    if (stages[i].status === "completed") {
      lastCompletedIdx = i;
    }
  }

  // If all are completed
  if (lastCompletedIdx === stages.length - 1) {
    const s = stages[lastCompletedIdx];
    return {
      stage: s.id,
      label: s.label,
      status: "completed",
      progressIndex: lastCompletedIdx,
      progressPercent: 100,
      message: `${s.label} officially declared / completed`,
    };
  }

  // If some completed, next stage is upcoming or unavailable
  if (lastCompletedIdx >= 0) {
    const nextIdx = lastCompletedIdx + 1;
    const nextStage = stages[nextIdx];
    const pct = stages.length > 1 ? (lastCompletedIdx / (stages.length - 1)) * 100 : 25;

    return {
      stage: nextStage ? nextStage.id : stages[lastCompletedIdx].id,
      label: nextStage ? nextStage.label : stages[lastCompletedIdx].label,
      status: nextStage ? nextStage.status : "completed",
      progressIndex: nextStage ? nextIdx : lastCompletedIdx,
      progressPercent: Math.round(pct),
      message: nextStage
        ? `Next stage: ${nextStage.label} (${nextStage.dateDisplay || "Pending"})`
        : `Completed: ${stages[lastCompletedIdx].label}`,
    };
  }

  // Fallback: first stage
  return {
    stage: stages[0].id,
    label: stages[0].label,
    status: stages[0].status,
    progressIndex: 0,
    progressPercent: 0,
    message: `${stages[0].label} (${stages[0].dateDisplay || "Upcoming"})`,
  };
}
