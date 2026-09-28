import { NextResponse } from "next/server";

const base = "https://www.aiexamresult.com";

const sitemaps = [
  "results", "latest-jobs", "admit-cards", "answer-keys",
  "admissions", "documents", "exams", "states", "pages",
];

export async function GET() {
  const now = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((id) => `  <sitemap>
    <loc>${base}/sitemap/${id}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`).join("\n")}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
