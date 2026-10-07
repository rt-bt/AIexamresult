import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

const base = "https://www.aiexamresult.com";

const sitemaps = [
  "results",
  "latest-jobs",
  "admit-cards",
  "answer-keys",
  "admissions",
  "documents",
  "syllabus",
  "scholarships",
  "exams",
  "states",
  "pages",
];

function getStableDate(): string {
  try {
    const jsonPath = path.join(process.cwd(), "data", "scraped.json");
    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
      if (data.fetchedAt) return new Date(data.fetchedAt).toISOString();
    }
  } catch {}
  return "2026-10-07T07:44:00.000Z";
}

export async function GET() {
  const lastmod = getStableDate();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((id) => `  <sitemap>
    <loc>${base}/sitemap/${id}.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`).join("\n")}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
