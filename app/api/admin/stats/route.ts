import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { categorySections } from "@/lib/data";

export async function GET() {
  const postsDir = path.join(process.cwd(), "data", "posts");
  let postFiles = 0;
  try { postFiles = fs.readdirSync(postsDir).filter((f) => f.endsWith(".json")).length; } catch {}

  const totalItems = categorySections.reduce((sum, s) => sum + s.items.length, 0);

  const catCounts: Record<string, number> = {};
  for (const s of categorySections) {
    catCounts[s.label] = s.items.length;
  }

  const now = Date.now();
  const WEEK = 7 * 24 * 60 * 60 * 1000;
  let lastWeek = 0;
  for (const s of categorySections) {
    for (const item of s.items) {
      const d = Date.parse(item.date);
      if (!isNaN(d) && now - d < WEEK) lastWeek++;
    }
  }

  let fetchedAt: string | null = null;
  try {
    const mod = await import("@/data/scraped-data");
    fetchedAt = mod.scrapedData?.fetchedAt || null;
  } catch {}

  return NextResponse.json({
    totalPosts: totalItems,
    postFiles,
    lastWeek,
    categories: catCounts,
    fetchedAt,
    categoryCount: categorySections.length,
  });
}
