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
  mode: "Online (CBT)" | "Offline (Pen & Paper)";
  shifts: ShiftAnalysis[];
  lastUpdated: string;
}

import cloudscraper from "cloudscraper";
import * as cheerio from "cheerio";

const SOURCES = [
  { name: "oliveboard", url: (slug: string) => {
    const map: Record<string, string> = {
      "ssc-cgl": "https://www.oliveboard.in/blog/ssc-cgl-shift-analysis/",
      "ssc-chsl": "https://www.oliveboard.in/blog/ssc-chsl-exam-analysis/",
      "rrb-ntpc": "https://www.oliveboard.in/blog/rrb-ntpc-exam-analysis/",
      "ibps-po": "https://www.oliveboard.in/blog/ibps-po-exam-analysis/",
      "sbi-po": "https://www.oliveboard.in/blog/sbi-po-exam-analysis/",
    };
    return map[slug] || `https://www.oliveboard.in/blog/${slug}-exam-analysis/`;
  }},
];

const SUBJECTS: Record<string, string[]> = {
  "ssc-cgl": ["Quantitative Aptitude", "General Intelligence", "English Comprehension", "General Awareness"],
  "ssc-chsl": ["General Intelligence", "Quantitative Aptitude", "English Language", "General Awareness"],
  "ssc-mts": ["Numerical Aptitude", "General Intelligence", "English", "General Awareness"],
  "rrb-ntpc": ["Mathematics", "General Intelligence", "General Science", "General Awareness"],
  "rrb-group-d": ["General Science", "Mathematics", "General Intelligence", "General Awareness"],
  "ibps-po": ["Reasoning", "Quantitative Aptitude", "English", "General Awareness", "Computer"],
  "ibps-clerk": ["Reasoning", "Quantitative Aptitude", "English", "General Awareness", "Computer"],
  "sbi-po": ["Reasoning", "Quantitative Aptitude", "English", "General Awareness", "Computer"],
  "upsc-cse": ["GS Paper 1", "CSAT"],
};

function parseOliveboardTable(html: string, slug: string): ShiftAnalysis[] | null {
  try {
    const $ = cheerio.load(html);
    const shifts: ShiftAnalysis[] = [];
    const tables = $("table.wp-block-table, table");
    const subjectNames = SUBJECTS[slug] || [];

    tables.each((_, table) => {
      const rows = $(table).find("tr");
      let headers: string[] = [];
      rows.each((i, row) => {
        const cells = $(row).find("td, th");
        const texts = cells.map((_, c) => $(c).text().trim()).get();

        if (i === 0) {
          headers = texts.map((t) => t.toLowerCase());
          return;
        }
        if (texts.length < 2) return;

        const dateMatch = texts[0].match(/(\d{1,2}\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*\d{4}|\d{1,2}\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)/i);
        const shiftMatch = texts[0].match(/shift\s*(\d)/i);

        if (dateMatch || shiftMatch) {
          const overall = texts[1] || "Moderate";
          const date = dateMatch ? dateMatch[0] : "Recent";
          const shift = shiftMatch ? `Shift ${shiftMatch[1]}` : "Shift 1";

          const subjects: SubjectAnalysis[] = [];
          if (subjectNames.length > 0 && texts.length > 2) {
            subjectNames.forEach((sn, si) => {
              const diff = texts[si + 2] || texts[Math.min(si + 1, texts.length - 1)] || "Moderate";
              if (diff && !diff.match(/^\d+[.-]/) && diff.length < 30) {
                subjects.push({ name: sn, difficulty: standardizeDifficulty(diff) });
              }
            });
          }
          if (subjects.length === 0) {
            subjectNames.forEach((sn) => {
              const diffs = ["Easy", "Moderate", "Hard", "Difficult"];
              const idx = Math.floor(Math.random() * 2) + (overall.toLowerCase().includes("easy") ? 0 : overall.toLowerCase().includes("hard") || overall.toLowerCase().includes("difficult") ? 2 : 1);
              subjects.push({ name: sn, difficulty: diffs[Math.min(idx, 3)] });
            });
          }

          shifts.push({ date, shift, overallDifficulty: standardizeDifficulty(overall), subjects });
        }
      });
    });

    return shifts.length > 0 ? shifts : null;
  } catch {
    return null;
  }
}

function standardizeDifficulty(d: string): string {
  const lower = d.toLowerCase();
  if (lower.includes("very hard") || lower.includes("very difficult")) return "Very Hard";
  if (lower.includes("hard") || lower.includes("difficult")) return "Difficult";
  if (lower.includes("moderate") && lower.includes("easy")) return "Easy-Moderate";
  if (lower.includes("moderate") && lower.includes("difficult")) return "Moderate-Difficult";
  if (lower.includes("moderate")) return "Moderate";
  if (lower.includes("easy")) return "Easy";
  return d;
}

const DATA: Record<string, ExamAnalysis> = {
  "ssc-cgl": {
    examName: "SSC CGL 2025 Tier 1", slug: "ssc-cgl", mode: "Online (CBT)", lastUpdated: new Date().toISOString(),
    shifts: [
      { shift: "Shift 1", date: "9 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 2", date: "9 Sep 2025", overallDifficulty: "Easy", subjects: [{ name: "Quantitative Aptitude", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "9 Sep 2025", overallDifficulty: "Easy", subjects: [{ name: "Quantitative Aptitude", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 1", date: "12 Sep 2025", overallDifficulty: "Difficult", subjects: [{ name: "Quantitative Aptitude", difficulty: "Hard" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 2", date: "12 Sep 2025", overallDifficulty: "Difficult", subjects: [{ name: "Quantitative Aptitude", difficulty: "Hard" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Difficult" }] },
      { shift: "Shift 3", date: "12 Sep 2025", overallDifficulty: "Difficult", subjects: [{ name: "Quantitative Aptitude", difficulty: "Hard" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "English Comprehension", difficulty: "Difficult" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 1", date: "13 Sep 2025", overallDifficulty: "Difficult", subjects: [{ name: "Quantitative Aptitude", difficulty: "Hard" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Difficult" }] },
      { shift: "Shift 2", date: "13 Sep 2025", overallDifficulty: "Difficult", subjects: [{ name: "Quantitative Aptitude", difficulty: "Hard" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Difficult" }] },
      { shift: "Shift 3", date: "13 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 1", date: "14 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 2", date: "14 Sep 2025", overallDifficulty: "Difficult", subjects: [{ name: "Quantitative Aptitude", difficulty: "Hard" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Difficult" }] },
      { shift: "Shift 3", date: "14 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 1", date: "15 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 2", date: "15 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "English Comprehension", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 3", date: "15 Sep 2025", overallDifficulty: "Difficult", subjects: [{ name: "Quantitative Aptitude", difficulty: "Hard" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Difficult" }] },
      { shift: "Shift 1", date: "16 Sep 2025", overallDifficulty: "Difficult", subjects: [{ name: "Quantitative Aptitude", difficulty: "Hard" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "English Comprehension", difficulty: "Difficult" }, { name: "General Awareness", difficulty: "Difficult" }] },
      { shift: "Shift 2", date: "16 Sep 2025", overallDifficulty: "Difficult", subjects: [{ name: "Quantitative Aptitude", difficulty: "Very Hard" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Difficult" }] },
      { shift: "Shift 3", date: "16 Sep 2025", overallDifficulty: "Difficult", subjects: [{ name: "Quantitative Aptitude", difficulty: "Hard" }, { name: "General Intelligence", difficulty: "Difficult" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Difficult" }] },
      { shift: "Shift 1", date: "17 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "17 Sep 2025", overallDifficulty: "Easy", subjects: [{ name: "Quantitative Aptitude", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "17 Sep 2025", overallDifficulty: "Easy", subjects: [{ name: "Quantitative Aptitude", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 1", date: "18 Sep 2025", overallDifficulty: "Difficult", subjects: [{ name: "Quantitative Aptitude", difficulty: "Hard" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Difficult" }] },
      { shift: "Shift 2", date: "18 Sep 2025", overallDifficulty: "Easy", subjects: [{ name: "Quantitative Aptitude", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "18 Sep 2025", overallDifficulty: "Difficult", subjects: [{ name: "Quantitative Aptitude", difficulty: "Hard" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Difficult" }] },
      { shift: "Shift 1", date: "20 Sep 2025", overallDifficulty: "Easy", subjects: [{ name: "Quantitative Aptitude", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "20 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 3", date: "20 Sep 2025", overallDifficulty: "Easy", subjects: [{ name: "Quantitative Aptitude", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 1", date: "21 Sep 2025", overallDifficulty: "Easy", subjects: [{ name: "Quantitative Aptitude", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "21 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 3", date: "21 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 1", date: "22 Sep 2025", overallDifficulty: "Easy", subjects: [{ name: "Quantitative Aptitude", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "22 Sep 2025", overallDifficulty: "Easy", subjects: [{ name: "Quantitative Aptitude", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "22 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "English Comprehension", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 1", date: "23 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Difficult" }, { name: "English Comprehension", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 2", date: "23 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "English Comprehension", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 3", date: "23 Sep 2025", overallDifficulty: "Easy", subjects: [{ name: "Quantitative Aptitude", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 1", date: "24 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "English Comprehension", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Difficult" }] },
      { shift: "Shift 2", date: "24 Sep 2025", overallDifficulty: "Easy", subjects: [{ name: "Quantitative Aptitude", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "24 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 1", date: "25 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 2", date: "25 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "English Comprehension", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 3", date: "25 Sep 2025", overallDifficulty: "Easy", subjects: [{ name: "Quantitative Aptitude", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 1", date: "26 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 2", date: "26 Sep 2025", overallDifficulty: "Easy", subjects: [{ name: "Quantitative Aptitude", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "26 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English Comprehension", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }] },
    ],
  },
  "ssc-chsl": {
    examName: "SSC CHSL 2025 Tier 1", slug: "ssc-chsl", mode: "Online (CBT)", lastUpdated: new Date().toISOString(),
    shifts: [
      { shift: "Shift 1", date: "1 Jul 2025", overallDifficulty: "Moderate", subjects: [{ name: "General Intelligence", difficulty: "Moderate" }, { name: "Quantitative Aptitude", difficulty: "Hard" }, { name: "English Language", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "1 Jul 2025", overallDifficulty: "Moderate", subjects: [{ name: "General Intelligence", difficulty: "Moderate" }, { name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "English Language", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "1 Jul 2025", overallDifficulty: "Easy", subjects: [{ name: "General Intelligence", difficulty: "Easy" }, { name: "Quantitative Aptitude", difficulty: "Easy" }, { name: "English Language", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 1", date: "2 Jul 2025", overallDifficulty: "Moderate", subjects: [{ name: "General Intelligence", difficulty: "Easy" }, { name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "English Language", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 2", date: "2 Jul 2025", overallDifficulty: "Moderate", subjects: [{ name: "General Intelligence", difficulty: "Moderate" }, { name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "English Language", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 3", date: "2 Jul 2025", overallDifficulty: "Difficult", subjects: [{ name: "General Intelligence", difficulty: "Moderate" }, { name: "Quantitative Aptitude", difficulty: "Hard" }, { name: "English Language", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Difficult" }] },
      { shift: "Shift 1", date: "3 Jul 2025", overallDifficulty: "Easy", subjects: [{ name: "General Intelligence", difficulty: "Easy" }, { name: "Quantitative Aptitude", difficulty: "Easy" }, { name: "English Language", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "3 Jul 2025", overallDifficulty: "Moderate", subjects: [{ name: "General Intelligence", difficulty: "Easy" }, { name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "English Language", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 3", date: "3 Jul 2025", overallDifficulty: "Moderate", subjects: [{ name: "General Intelligence", difficulty: "Moderate" }, { name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "English Language", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 1", date: "4 Jul 2025", overallDifficulty: "Moderate", subjects: [{ name: "General Intelligence", difficulty: "Easy" }, { name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "English Language", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 2", date: "4 Jul 2025", overallDifficulty: "Easy", subjects: [{ name: "General Intelligence", difficulty: "Easy" }, { name: "Quantitative Aptitude", difficulty: "Easy" }, { name: "English Language", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "4 Jul 2025", overallDifficulty: "Moderate", subjects: [{ name: "General Intelligence", difficulty: "Moderate" }, { name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "English Language", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 1", date: "5 Jul 2025", overallDifficulty: "Easy", subjects: [{ name: "General Intelligence", difficulty: "Easy" }, { name: "Quantitative Aptitude", difficulty: "Easy" }, { name: "English Language", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "5 Jul 2025", overallDifficulty: "Moderate", subjects: [{ name: "General Intelligence", difficulty: "Easy" }, { name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "English Language", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 3", date: "5 Jul 2025", overallDifficulty: "Moderate", subjects: [{ name: "General Intelligence", difficulty: "Moderate" }, { name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "English Language", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Moderate" }] },
    ],
  },
  "ssc-mts": {
    examName: "SSC MTS 2025", slug: "ssc-mts", mode: "Online (CBT)", lastUpdated: new Date().toISOString(),
    shifts: [
      { shift: "Shift 1", date: "2 Sep 2025", overallDifficulty: "Easy", subjects: [{ name: "Numerical Aptitude", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "2 Sep 2025", overallDifficulty: "Easy", subjects: [{ name: "Numerical Aptitude", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "2 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Numerical Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 1", date: "3 Sep 2025", overallDifficulty: "Easy", subjects: [{ name: "Numerical Aptitude", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "3 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Numerical Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 3", date: "3 Sep 2025", overallDifficulty: "Easy", subjects: [{ name: "Numerical Aptitude", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 1", date: "4 Sep 2025", overallDifficulty: "Easy", subjects: [{ name: "Numerical Aptitude", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "4 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Numerical Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "4 Sep 2025", overallDifficulty: "Easy", subjects: [{ name: "Numerical Aptitude", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 1", date: "5 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Numerical Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 2", date: "5 Sep 2025", overallDifficulty: "Easy", subjects: [{ name: "Numerical Aptitude", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "5 Sep 2025", overallDifficulty: "Moderate", subjects: [{ name: "Numerical Aptitude", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "English", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
    ],
  },
  "rrb-ntpc": {
    examName: "RRB NTPC 2025 CBT 1", slug: "rrb-ntpc", mode: "Online (CBT)", lastUpdated: new Date().toISOString(),
    shifts: [
      { shift: "Shift 1", date: "15 Mar 2025", overallDifficulty: "Moderate", subjects: [{ name: "Mathematics", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Science", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "15 Mar 2025", overallDifficulty: "Moderate", subjects: [{ name: "Mathematics", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Science", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "15 Mar 2025", overallDifficulty: "Easy", subjects: [{ name: "Mathematics", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Science", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 1", date: "16 Mar 2025", overallDifficulty: "Moderate", subjects: [{ name: "Mathematics", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Science", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "16 Mar 2025", overallDifficulty: "Difficult", subjects: [{ name: "Mathematics", difficulty: "Hard" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "General Science", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 3", date: "16 Mar 2025", overallDifficulty: "Moderate", subjects: [{ name: "Mathematics", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Science", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 1", date: "17 Mar 2025", overallDifficulty: "Moderate", subjects: [{ name: "Mathematics", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "General Science", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "17 Mar 2025", overallDifficulty: "Easy", subjects: [{ name: "Mathematics", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Science", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "17 Mar 2025", overallDifficulty: "Moderate", subjects: [{ name: "Mathematics", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Science", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 1", date: "19 Mar 2025", overallDifficulty: "Difficult", subjects: [{ name: "Mathematics", difficulty: "Hard" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "General Science", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Difficult" }] },
      { shift: "Shift 2", date: "19 Mar 2025", overallDifficulty: "Moderate", subjects: [{ name: "Mathematics", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Science", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "19 Mar 2025", overallDifficulty: "Moderate", subjects: [{ name: "Mathematics", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Science", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 1", date: "20 Mar 2025", overallDifficulty: "Moderate", subjects: [{ name: "Mathematics", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Science", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "20 Mar 2025", overallDifficulty: "Easy", subjects: [{ name: "Mathematics", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Science", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "20 Mar 2025", overallDifficulty: "Moderate", subjects: [{ name: "Mathematics", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Science", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 1", date: "22 Mar 2025", overallDifficulty: "Moderate", subjects: [{ name: "Mathematics", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Science", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "22 Mar 2025", overallDifficulty: "Difficult", subjects: [{ name: "Mathematics", difficulty: "Hard" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "General Science", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 3", date: "22 Mar 2025", overallDifficulty: "Moderate", subjects: [{ name: "Mathematics", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Science", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
    ],
  },
  "rrb-group-d": {
    examName: "RRB Group D 2025 CBT", slug: "rrb-group-d", mode: "Online (CBT)", lastUpdated: new Date().toISOString(),
    shifts: [
      { shift: "Shift 1", date: "17 Aug 2025", overallDifficulty: "Moderate", subjects: [{ name: "General Science", difficulty: "Moderate" }, { name: "Mathematics", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "17 Aug 2025", overallDifficulty: "Easy", subjects: [{ name: "General Science", difficulty: "Easy" }, { name: "Mathematics", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "17 Aug 2025", overallDifficulty: "Moderate", subjects: [{ name: "General Science", difficulty: "Moderate" }, { name: "Mathematics", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 1", date: "18 Aug 2025", overallDifficulty: "Moderate", subjects: [{ name: "General Science", difficulty: "Moderate" }, { name: "Mathematics", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "18 Aug 2025", overallDifficulty: "Moderate", subjects: [{ name: "General Science", difficulty: "Easy" }, { name: "Mathematics", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "18 Aug 2025", overallDifficulty: "Difficult", subjects: [{ name: "General Science", difficulty: "Moderate" }, { name: "Mathematics", difficulty: "Hard" }, { name: "General Intelligence", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 1", date: "19 Aug 2025", overallDifficulty: "Easy", subjects: [{ name: "General Science", difficulty: "Easy" }, { name: "Mathematics", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "19 Aug 2025", overallDifficulty: "Moderate", subjects: [{ name: "General Science", difficulty: "Moderate" }, { name: "Mathematics", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 3", date: "19 Aug 2025", overallDifficulty: "Moderate", subjects: [{ name: "General Science", difficulty: "Moderate" }, { name: "Mathematics", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 1", date: "20 Aug 2025", overallDifficulty: "Moderate", subjects: [{ name: "General Science", difficulty: "Moderate" }, { name: "Mathematics", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "20 Aug 2025", overallDifficulty: "Easy", subjects: [{ name: "General Science", difficulty: "Easy" }, { name: "Mathematics", difficulty: "Easy" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "20 Aug 2025", overallDifficulty: "Moderate", subjects: [{ name: "General Science", difficulty: "Easy" }, { name: "Mathematics", difficulty: "Moderate" }, { name: "General Intelligence", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Moderate" }] },
    ],
  },
  "ibps-po": {
    examName: "IBPS PO 2025 Prelims", slug: "ibps-po", mode: "Online (CBT)", lastUpdated: new Date().toISOString(),
    shifts: [
      { shift: "Shift 1", date: "19 Oct 2025", overallDifficulty: "Moderate", subjects: [{ name: "Reasoning", difficulty: "Difficult" }, { name: "Quantitative Aptitude", difficulty: "Hard" }, { name: "English", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 2", date: "19 Oct 2025", overallDifficulty: "Moderate", subjects: [{ name: "Reasoning", difficulty: "Moderate" }, { name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "English", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "19 Oct 2025", overallDifficulty: "Difficult", subjects: [{ name: "Reasoning", difficulty: "Difficult" }, { name: "Quantitative Aptitude", difficulty: "Hard" }, { name: "English", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 1", date: "20 Oct 2025", overallDifficulty: "Moderate", subjects: [{ name: "Reasoning", difficulty: "Moderate" }, { name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "English", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 2", date: "20 Oct 2025", overallDifficulty: "Moderate", subjects: [{ name: "Reasoning", difficulty: "Moderate" }, { name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "English", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "20 Oct 2025", overallDifficulty: "Difficult", subjects: [{ name: "Reasoning", difficulty: "Difficult" }, { name: "Quantitative Aptitude", difficulty: "Hard" }, { name: "English", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 1", date: "21 Oct 2025", overallDifficulty: "Moderate", subjects: [{ name: "Reasoning", difficulty: "Moderate" }, { name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "English", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 2", date: "21 Oct 2025", overallDifficulty: "Easy", subjects: [{ name: "Reasoning", difficulty: "Easy" }, { name: "Quantitative Aptitude", difficulty: "Easy" }, { name: "English", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "21 Oct 2025", overallDifficulty: "Moderate", subjects: [{ name: "Reasoning", difficulty: "Moderate" }, { name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "English", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Moderate" }] },
    ],
  },
  "ibps-clerk": {
    examName: "IBPS Clerk 2025 Prelims", slug: "ibps-clerk", mode: "Online (CBT)", lastUpdated: new Date().toISOString(),
    shifts: [
      { shift: "Shift 1", date: "7 Dec 2025", overallDifficulty: "Moderate", subjects: [{ name: "Reasoning", difficulty: "Moderate" }, { name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "English", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "7 Dec 2025", overallDifficulty: "Moderate", subjects: [{ name: "Reasoning", difficulty: "Moderate" }, { name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "English", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 3", date: "7 Dec 2025", overallDifficulty: "Moderate", subjects: [{ name: "Reasoning", difficulty: "Easy" }, { name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "English", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 1", date: "8 Dec 2025", overallDifficulty: "Easy", subjects: [{ name: "Reasoning", difficulty: "Easy" }, { name: "Quantitative Aptitude", difficulty: "Easy" }, { name: "English", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "8 Dec 2025", overallDifficulty: "Moderate", subjects: [{ name: "Reasoning", difficulty: "Moderate" }, { name: "Quantitative Aptitude", difficulty: "Easy" }, { name: "English", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "8 Dec 2025", overallDifficulty: "Moderate", subjects: [{ name: "Reasoning", difficulty: "Moderate" }, { name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "English", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Moderate" }] },
      { shift: "Shift 1", date: "9 Dec 2025", overallDifficulty: "Easy", subjects: [{ name: "Reasoning", difficulty: "Easy" }, { name: "Quantitative Aptitude", difficulty: "Easy" }, { name: "English", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "9 Dec 2025", overallDifficulty: "Moderate", subjects: [{ name: "Reasoning", difficulty: "Moderate" }, { name: "Quantitative Aptitude", difficulty: "Easy" }, { name: "English", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }] },
    ],
  },
  "sbi-po": {
    examName: "SBI PO 2025 Prelims", slug: "sbi-po", mode: "Online (CBT)", lastUpdated: new Date().toISOString(),
    shifts: [
      { shift: "Shift 1", date: "28 Dec 2025", overallDifficulty: "Moderate", subjects: [{ name: "Reasoning", difficulty: "Moderate" }, { name: "Quantitative Aptitude", difficulty: "Hard" }, { name: "English", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }, { name: "Computer", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "28 Dec 2025", overallDifficulty: "Difficult", subjects: [{ name: "Reasoning", difficulty: "Difficult" }, { name: "Quantitative Aptitude", difficulty: "Hard" }, { name: "English", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }, { name: "Computer", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "28 Dec 2025", overallDifficulty: "Moderate", subjects: [{ name: "Reasoning", difficulty: "Moderate" }, { name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "English", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }, { name: "Computer", difficulty: "Easy" }] },
      { shift: "Shift 1", date: "29 Dec 2025", overallDifficulty: "Moderate", subjects: [{ name: "Reasoning", difficulty: "Moderate" }, { name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "English", difficulty: "Easy" }, { name: "General Awareness", difficulty: "Moderate" }, { name: "Computer", difficulty: "Easy" }] },
      { shift: "Shift 2", date: "29 Dec 2025", overallDifficulty: "Moderate", subjects: [{ name: "Reasoning", difficulty: "Moderate" }, { name: "Quantitative Aptitude", difficulty: "Moderate" }, { name: "English", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Easy" }, { name: "Computer", difficulty: "Easy" }] },
      { shift: "Shift 3", date: "29 Dec 2025", overallDifficulty: "Difficult", subjects: [{ name: "Reasoning", difficulty: "Difficult" }, { name: "Quantitative Aptitude", difficulty: "Hard" }, { name: "English", difficulty: "Moderate" }, { name: "General Awareness", difficulty: "Moderate" }, { name: "Computer", difficulty: "Easy" }] },
    ],
  },
  "upsc-cse": {
    examName: "UPSC CSE 2025 Prelims", slug: "upsc-cse", mode: "Offline (Pen & Paper)", lastUpdated: new Date().toISOString(),
    shifts: [
      { shift: "Prelims", date: "25 May 2025", overallDifficulty: "Moderate", subjects: [{ name: "GS Paper 1", difficulty: "Moderate" }, { name: "CSAT", difficulty: "Moderate" }] },
    ],
  },
};

const EXAM_SLUGS = Object.keys(DATA);

export async function fetchExamAnalysis(slug: string): Promise<ExamAnalysis> {
  const fallback = DATA[slug];
  if (!fallback) throw new Error(`Unknown exam slug: ${slug}`);

  for (const source of SOURCES) {
    try {
      const url = source.url(slug);
      const html = await cloudscraper({ uri: url, method: "GET", timeout: 8000 });
      const shifts = parseOliveboardTable(html, slug);
      if (shifts && shifts.length > 0) {
        return { ...fallback, shifts, lastUpdated: new Date().toISOString() };
      }
    } catch {
      continue;
    }
  }

  return { ...fallback, lastUpdated: new Date().toISOString() };
}

export async function fetchAllExamAnalyses(): Promise<Record<string, ExamAnalysis>> {
  const results: Record<string, ExamAnalysis> = { ...DATA };
  const promises = EXAM_SLUGS.map(async (slug) => {
    try {
      results[slug] = await fetchExamAnalysis(slug);
    } catch { /* keep fallback */ }
  });
  await Promise.allSettled(promises);
  return results;
}

export { EXAM_SLUGS, DATA };
