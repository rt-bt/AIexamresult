import * as fs from "fs";
import * as path from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const AGE_KEYWORDS = [
  "born between", "born before", "born after", "born on", "born not",
  "age between", "age limit", "maximum age", "minimum age",
  "not be born", "candidate born", "year born",
];

function isAgeRelated(text: string): boolean {
  const lower = text.toLowerCase();
  return AGE_KEYWORDS.some((kw) => lower.includes(kw));
}

function extractDate(text: string): string | null {
  if (isAgeRelated(text)) return null;

  const m = text.match(/(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})/i);
  if (m) {
    const day = parseInt(m[1]);
    const year = parseInt(m[3]);
    if (day < 1 || day > 31 || year < 2022 || year > 2030) return null;
    return `${m[1]} ${m[2]} ${m[3]}`;
  }

  const m2 = text.match(/(\d{1,2})-(\d{1,2})-(\d{4})/);
  if (m2) {
    const d = parseInt(m2[1]);
    const mo = parseInt(m2[2]);
    const yr = parseInt(m2[3]);
    if (d < 1 || d > 31 || mo < 1 || mo > 12) return null;
    const monthName = MONTHS[mo - 1];
    if (!monthName || yr < 2022 || yr > 2030) return null;
    return `${m2[1]} ${monthName} ${m2[3]}`;
  }

  return null;
}

function categorizeDate(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("apply start") || lower.includes("application start")) return "Apply Start";
  if (lower.includes("last date") || lower.includes("apply last")) return "Last Date";
  if (lower.includes("exam date") || lower.includes("examination")) return "Exam Date";
  if (lower.includes("admit card")) return "Admit Card";
  if (lower.includes("result")) return "Result";
  if (lower.includes("answer key")) return "Answer Key";
  if (lower.includes("correction")) return "Correction";
  return "Other";
}

export async function GET() {
  const postsDir = path.join(process.cwd(), "data", "posts");
  let files: string[] = [];
  try { files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".json")); } catch {
    return NextResponse.json([]);
  }

  const events: { title: string; slug: string; dateLabel: string; dateStr: string; category: string }[] = [];

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
      const post = JSON.parse(raw);
      const dates = post.importantDates || [];
      for (const d of dates) {
        const parsed = extractDate(d);
        if (parsed) {
          events.push({
            title: post.title,
            slug: post.slug,
            dateLabel: categorizeDate(d),
            dateStr: parsed,
            category: post.category || "Uncategorized",
          });
        }
      }
    } catch {}
  }

  events.sort((a, b) => new Date(a.dateStr).getTime() - new Date(b.dateStr).getTime());

  return NextResponse.json(events);
}
