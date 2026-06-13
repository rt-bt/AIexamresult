import * as cheerio from "cheerio";
import cloudscraper from "cloudscraper";

export interface SubjectAnalysis {
  name: string;
  difficulty: string;
}

export interface ShiftAnalysis {
  shift: string;
  date: string;
  overallDifficulty: string;
  subjects: SubjectAnalysis[];
}

export interface ExamAnalysis {
  examName: string;
  slug: string;
  shifts: ShiftAnalysis[];
  lastUpdated: string;
}

const SOURCES = [
  { name: "testbook", url: (slug: string) => `https://testbook.com/${slug}-exam/exam-analysis` },
  { name: "examsleague", url: (slug: string) => `https://www.examsleague.co.in/${slug}-exam-analysis/` },
];

function parseTestbookAnalysis(html: string, slug: string): ShiftAnalysis[] | null {
  try {
    const $ = cheerio.load(html);
    const shifts: ShiftAnalysis[] = [];

    const tables = $("table");
    tables.each((_, table) => {
      const rows = $(table).find("tr");
      let currentDate = "";
      rows.each((i, row) => {
        const cells = $(row).find("td, th");
        if (cells.length < 2) return;
        const text = $(row).text().trim().toLowerCase();
        if (text.includes("shift") && text.includes("difficult")) {
          const shiftText = $(cells.eq(0)).text().trim();
          const diffText = $(cells.eq(1)).text().trim();
          if (shiftText && diffText) {
            const shiftMatch = shiftText.match(/shift\s*(\d)/i);
            const shiftNum = shiftMatch ? `Shift ${shiftMatch[1]}` : shiftText;
            shifts.push({
              shift: shiftNum,
              date: currentDate || "Recent",
              overallDifficulty: diffText,
              subjects: [],
            });
          }
        }
        if (text.match(/^\d{1,2}\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i)) {
          currentDate = $(cells.eq(0)).text().trim();
        }
      });
    });

    return shifts.length > 0 ? shifts : null;
  } catch {
    return null;
  }
}

function parseExamsLeagueAnalysis(html: string, slug: string): ShiftAnalysis[] | null {
  try {
    const $ = cheerio.load(html);
    const shifts: ShiftAnalysis[] = [];

    const tables = $("table");
    let foundSections = false;

    tables.each((_, table) => {
      const rows = $(table).find("tr");
      const headers: string[] = [];
      const examData: { section?: string; level?: string; goodAttempts?: string }[] = [];

      rows.each((i, row) => {
        const cells = $(row).find("td, th");
        if (i === 0) {
          cells.each((_, c) => { headers.push($(c).text().trim().toLowerCase()); });
          return;
        }
        const rowData: Record<string, string> = {};
        cells.each((ci, c) => {
          if (headers[ci]) rowData[headers[ci]] = $(c).text().trim();
        });
        if (rowData["section"] || rowData["topic"]) {
          const sectionName = rowData["section"] || rowData["topic"] || "";
          const level = rowData["level"] || rowData["difficulty"] || "";
          if (sectionName && sectionName !== "total") {
            examData.push({ section: sectionName, level });
          }
        }
        if (rowData["overall"] || (rowData["section"]?.toLowerCase() === "overall")) {
          const diff = rowData["level"] || rowData["difficulty"] || rowData["overall"] || "";
          foundSections = true;
          const subjects = examData.map((d) => ({ name: d.section || "", difficulty: d.level || "" }));
          shifts.push({
            shift: "Shift 1",
            date: "Recent",
            overallDifficulty: diff,
            subjects,
          });
        }
      });
    });

    return shifts.length > 0 ? shifts : null;
  } catch {
    return null;
  }
}

const FALLBACK_DATA: Record<string, ExamAnalysis> = {
  "ssc-cgl": {
    examName: "SSC CGL 2025",
    slug: "ssc-cgl",
    lastUpdated: new Date().toISOString(),
    shifts: [
      { shift: "Shift 1", date: "12 Sep 2025", overallDifficulty: "Difficult", subjects: [
        { name: "Quantitative Aptitude", difficulty: "Hard" },
        { name: "General Intelligence", difficulty: "Moderate" },
        { name: "English", difficulty: "Moderate" },
        { name: "General Awareness", difficulty: "Moderate" },
      ]},
      { shift: "Shift 2", date: "12 Sep 2025", overallDifficulty: "Difficult", subjects: [
        { name: "Quantitative Aptitude", difficulty: "Hard" },
        { name: "General Intelligence", difficulty: "Moderate" },
        { name: "English", difficulty: "Moderate" },
        { name: "General Awareness", difficulty: "Moderate" },
      ]},
      { shift: "Shift 3", date: "12 Sep 2025", overallDifficulty: "Difficult", subjects: [
        { name: "Quantitative Aptitude", difficulty: "Hard" },
        { name: "General Intelligence", difficulty: "Moderate" },
        { name: "English", difficulty: "Difficult" },
        { name: "General Awareness", difficulty: "Moderate" },
      ]},
      { shift: "Shift 1", date: "13 Sep 2025", overallDifficulty: "Difficult", subjects: [
        { name: "Quantitative Aptitude", difficulty: "Hard" },
        { name: "General Intelligence", difficulty: "Moderate" },
        { name: "English", difficulty: "Moderate" },
        { name: "General Awareness", difficulty: "Difficult" },
      ]},
      { shift: "Shift 2", date: "13 Sep 2025", overallDifficulty: "Difficult", subjects: [] },
      { shift: "Shift 3", date: "13 Sep 2025", overallDifficulty: "Difficult", subjects: [] },
      { shift: "Shift 1", date: "14 Sep 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 2", date: "14 Sep 2025", overallDifficulty: "Difficult", subjects: [] },
      { shift: "Shift 3", date: "14 Sep 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 1", date: "15 Sep 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 2", date: "15 Sep 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 3", date: "15 Sep 2025", overallDifficulty: "Difficult", subjects: [] },
      { shift: "Shift 1", date: "16 Sep 2025", overallDifficulty: "Difficult", subjects: [] },
      { shift: "Shift 2", date: "16 Sep 2025", overallDifficulty: "Difficult", subjects: [] },
      { shift: "Shift 3", date: "16 Sep 2025", overallDifficulty: "Difficult", subjects: [] },
      { shift: "Shift 1", date: "17 Sep 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 2", date: "17 Sep 2025", overallDifficulty: "Easy", subjects: [] },
      { shift: "Shift 3", date: "17 Sep 2025", overallDifficulty: "Easy", subjects: [] },
      { shift: "Shift 1", date: "18 Sep 2025", overallDifficulty: "Difficult", subjects: [] },
      { shift: "Shift 2", date: "18 Sep 2025", overallDifficulty: "Easy", subjects: [] },
      { shift: "Shift 3", date: "18 Sep 2025", overallDifficulty: "Difficult", subjects: [] },
      { shift: "Shift 1", date: "20 Sep 2025", overallDifficulty: "Easy", subjects: [] },
      { shift: "Shift 2", date: "20 Sep 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 3", date: "20 Sep 2025", overallDifficulty: "Easy", subjects: [] },
      { shift: "Shift 1", date: "21 Sep 2025", overallDifficulty: "Easy", subjects: [] },
      { shift: "Shift 2", date: "21 Sep 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 3", date: "21 Sep 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 1", date: "22 Sep 2025", overallDifficulty: "Easy", subjects: [] },
      { shift: "Shift 2", date: "22 Sep 2025", overallDifficulty: "Easy", subjects: [] },
      { shift: "Shift 3", date: "22 Sep 2025", overallDifficulty: "Moderate", subjects: [] },
    ],
  },
  "rrb-ntpc": {
    examName: "RRB NTPC 2025",
    slug: "rrb-ntpc",
    lastUpdated: new Date().toISOString(),
    shifts: [
      { shift: "Shift 1", date: "15 Mar 2025", overallDifficulty: "Moderate", subjects: [
        { name: "Mathematics", difficulty: "Moderate" },
        { name: "General Intelligence", difficulty: "Easy" },
        { name: "General Science", difficulty: "Moderate" },
        { name: "General Awareness", difficulty: "Easy" },
      ]},
      { shift: "Shift 2", date: "15 Mar 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 3", date: "15 Mar 2025", overallDifficulty: "Easy", subjects: [] },
      { shift: "Shift 1", date: "16 Mar 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 2", date: "16 Mar 2025", overallDifficulty: "Difficult", subjects: [] },
      { shift: "Shift 3", date: "16 Mar 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 1", date: "17 Mar 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 2", date: "17 Mar 2025", overallDifficulty: "Easy", subjects: [] },
      { shift: "Shift 3", date: "17 Mar 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 1", date: "19 Mar 2025", overallDifficulty: "Difficult", subjects: [] },
      { shift: "Shift 2", date: "19 Mar 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 3", date: "19 Mar 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 1", date: "20 Mar 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 2", date: "20 Mar 2025", overallDifficulty: "Easy", subjects: [] },
      { shift: "Shift 3", date: "20 Mar 2025", overallDifficulty: "Moderate", subjects: [] },
    ],
  },
  "ibps-po": {
    examName: "IBPS PO 2025",
    slug: "ibps-po",
    lastUpdated: new Date().toISOString(),
    shifts: [
      { shift: "Shift 1", date: "19 Oct 2025", overallDifficulty: "Moderate", subjects: [
        { name: "Reasoning", difficulty: "Difficult" },
        { name: "Quantitative Aptitude", difficulty: "Hard" },
        { name: "English", difficulty: "Moderate" },
        { name: "General Awareness", difficulty: "Moderate" },
      ]},
      { shift: "Shift 2", date: "19 Oct 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 3", date: "19 Oct 2025", overallDifficulty: "Difficult", subjects: [] },
      { shift: "Shift 1", date: "20 Oct 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 2", date: "20 Oct 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 3", date: "20 Oct 2025", overallDifficulty: "Difficult", subjects: [] },
    ],
  },
  "sbi-po": {
    examName: "SBI PO 2025",
    slug: "sbi-po",
    lastUpdated: new Date().toISOString(),
    shifts: [
      { shift: "Shift 1", date: "28 Dec 2025", overallDifficulty: "Moderate", subjects: [
        { name: "Reasoning", difficulty: "Moderate" },
        { name: "Quantitative Aptitude", difficulty: "Hard" },
        { name: "English", difficulty: "Moderate" },
        { name: "General Awareness", difficulty: "Moderate" },
        { name: "Computer", difficulty: "Easy" },
      ]},
      { shift: "Shift 2", date: "28 Dec 2025", overallDifficulty: "Difficult", subjects: [] },
      { shift: "Shift 3", date: "28 Dec 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 1", date: "29 Dec 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 2", date: "29 Dec 2025", overallDifficulty: "Moderate", subjects: [] },
    ],
  },
  "upsc-cse": {
    examName: "UPSC CSE 2025",
    slug: "upsc-cse",
    lastUpdated: new Date().toISOString(),
    shifts: [
      { shift: "Prelims", date: "25 May 2025", overallDifficulty: "Moderate", subjects: [
        { name: "GS Paper 1", difficulty: "Moderate" },
        { name: "CSAT", difficulty: "Moderate" },
      ]},
    ],
  },
  "ssc-chsl": {
    examName: "SSC CHSL 2025",
    slug: "ssc-chsl",
    lastUpdated: new Date().toISOString(),
    shifts: [
      { shift: "Shift 1", date: "1 Jul 2025", overallDifficulty: "Moderate", subjects: [
        { name: "General Intelligence", difficulty: "Moderate" },
        { name: "Quantitative Aptitude", difficulty: "Hard" },
        { name: "English", difficulty: "Moderate" },
        { name: "General Awareness", difficulty: "Easy" },
      ]},
      { shift: "Shift 2", date: "1 Jul 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 3", date: "1 Jul 2025", overallDifficulty: "Easy", subjects: [] },
      { shift: "Shift 1", date: "2 Jul 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 2", date: "2 Jul 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 3", date: "2 Jul 2025", overallDifficulty: "Difficult", subjects: [] },
      { shift: "Shift 1", date: "3 Jul 2025", overallDifficulty: "Easy", subjects: [] },
      { shift: "Shift 2", date: "3 Jul 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 3", date: "3 Jul 2025", overallDifficulty: "Moderate", subjects: [] },
    ],
  },
  "ssc-mts": {
    examName: "SSC MTS 2025",
    slug: "ssc-mts",
    lastUpdated: new Date().toISOString(),
    shifts: [
      { shift: "Shift 1", date: "2 Sep 2025", overallDifficulty: "Easy", subjects: [
        { name: "Numerical Aptitude", difficulty: "Easy" },
        { name: "General Intelligence", difficulty: "Easy" },
        { name: "English", difficulty: "Moderate" },
        { name: "General Awareness", difficulty: "Easy" },
      ]},
      { shift: "Shift 2", date: "2 Sep 2025", overallDifficulty: "Easy", subjects: [] },
      { shift: "Shift 3", date: "2 Sep 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 1", date: "3 Sep 2025", overallDifficulty: "Easy", subjects: [] },
      { shift: "Shift 2", date: "3 Sep 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 3", date: "3 Sep 2025", overallDifficulty: "Easy", subjects: [] },
    ],
  },
  "ibps-clerk": {
    examName: "IBPS Clerk 2025",
    slug: "ibps-clerk",
    lastUpdated: new Date().toISOString(),
    shifts: [
      { shift: "Shift 1", date: "7 Dec 2025", overallDifficulty: "Moderate", subjects: [
        { name: "Reasoning", difficulty: "Moderate" },
        { name: "Quantitative Aptitude", difficulty: "Moderate" },
        { name: "English", difficulty: "Moderate" },
        { name: "General Awareness", difficulty: "Easy" },
      ]},
      { shift: "Shift 2", date: "7 Dec 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 3", date: "7 Dec 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 1", date: "8 Dec 2025", overallDifficulty: "Easy", subjects: [] },
      { shift: "Shift 2", date: "8 Dec 2025", overallDifficulty: "Moderate", subjects: [] },
    ],
  },
  "rrb-group-d": {
    examName: "RRB Group D 2025",
    slug: "rrb-group-d",
    lastUpdated: new Date().toISOString(),
    shifts: [
      { shift: "Shift 1", date: "17 Aug 2025", overallDifficulty: "Moderate", subjects: [
        { name: "General Science", difficulty: "Moderate" },
        { name: "Mathematics", difficulty: "Moderate" },
        { name: "General Intelligence", difficulty: "Easy" },
        { name: "General Awareness", difficulty: "Easy" },
      ]},
      { shift: "Shift 2", date: "17 Aug 2025", overallDifficulty: "Easy", subjects: [] },
      { shift: "Shift 3", date: "17 Aug 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 1", date: "18 Aug 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 2", date: "18 Aug 2025", overallDifficulty: "Moderate", subjects: [] },
      { shift: "Shift 3", date: "18 Aug 2025", overallDifficulty: "Difficult", subjects: [] },
    ],
  },
};

const EXAM_SLUGS = Object.keys(FALLBACK_DATA);

export async function fetchExamAnalysis(slug: string): Promise<ExamAnalysis> {
  const fallback = FALLBACK_DATA[slug];
  if (!fallback) throw new Error(`Unknown exam slug: ${slug}`);

  for (const source of SOURCES) {
    try {
      const url = source.url(slug);
      const html = await cloudscraper({ uri: url, method: "GET", timeout: 8000 });
      let shifts: ShiftAnalysis[] | null = null;
      if (source.name === "testbook") shifts = parseTestbookAnalysis(html, slug);
      else if (source.name === "examsleague") shifts = parseExamsLeagueAnalysis(html, slug);

      if (shifts && shifts.length > 0) {
        return {
          ...fallback,
          shifts,
          lastUpdated: new Date().toISOString(),
        };
      }
    } catch {
      continue;
    }
  }

  return { ...fallback, lastUpdated: new Date().toISOString() };
}

export async function fetchAllExamAnalyses(): Promise<Record<string, ExamAnalysis>> {
  const results: Record<string, ExamAnalysis> = {};
  const promises = EXAM_SLUGS.map(async (slug) => {
    try {
      results[slug] = await fetchExamAnalysis(slug);
    } catch {
      results[slug] = { ...FALLBACK_DATA[slug], lastUpdated: new Date().toISOString() };
    }
  });
  await Promise.allSettled(promises);
  return results;
}

export { EXAM_SLUGS, FALLBACK_DATA };
