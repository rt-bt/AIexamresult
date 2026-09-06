import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

const GITHUB_REPO = "rt-bt/AIexamresult";
const GITHUB_FILE = "data/scraped.json";
const GITHUB_BRANCH = "master";
const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}`;
const GITHUB_API_BASE = `https://api.github.com/repos/${GITHUB_REPO}`;

const SOURCES = [
  { url: "https://www.sarkariexam.com/", host: "sarkariexam.com" },
];

const CATEGORY_MAP: Record<string, string> = {
  "latestjob": "latestJobs",
  "top online form": "latestJobs",
  "admit card": "admitCards",
  "admitcard": "admitCards",
  "result": "results",
  "exam result": "results",
  "answer key": "answerKeys",
  "answerkey": "answerKeys",
  "admission": "admissions",
  "document": "documents",
};

interface PostItem {
  title: string;
  url: string;
  category: string;
  slug: string;
  publishedDate: string;
}

async function fetchPage(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (e) {
    throw new Error(`Failed to fetch ${url}: ${e}`);
  }
}

function slugify(title: string): string {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 80);
}

function scrapeItems(html: string): Record<string, PostItem[]> {
  const $ = cheerio.load(html);
  const result: Record<string, PostItem[]> = {
    latestJobs: [], admitCards: [], results: [],
    answerKeys: [], admissions: [], documents: [],
  };
  const seen = new Set<string>();

  // Try to find sections by heading text
  $("h2, h3, h4, .section-title, .widget-title, .card-title").each((_, el) => {
    const heading = $(el).text().trim().toLowerCase();
    let category = "";
    for (const [key, val] of Object.entries(CATEGORY_MAP)) {
      if (heading.includes(key)) { category = val; break; }
    }
    if (!category) return;

    // Get sibling/parent list items
    const container = $(el).closest("div, section, article").first();
    container.find("a[href]").each((_, a) => {
      const $a = $(a);
      const title = $a.text().trim();
      const href = $a.attr("href") || "";
      if (title.length < 10 || seen.has(href)) return;
      seen.add(href);

      const slug = slugify(title);
      result[category].push({
        title,
        url: `/post/${slug}`,
        category,
        slug,
        publishedDate: new Date().toISOString().split("T")[0],
      });
    });
  });

  // Fallback: grab all links with long titles from the whole page
  if (Object.values(result).every(arr => arr.length === 0)) {
    $("a[href]").each((_, a) => {
      const $a = $(a);
      const title = $a.text().trim();
      const href = $a.attr("href") || "";
      if (title.length < 15 || seen.has(href)) return;
      seen.add(href);

      // Guess category from title/URL
      let category = "latestJobs";
      const lower = (title + href).toLowerCase();
      if (lower.includes("result")) category = "results";
      else if (lower.includes("admit")) category = "admitCards";
      else if (lower.includes("answer") || lower.includes("key")) category = "answerKeys";
      else if (lower.includes("admiss")) category = "admissions";

      const slug = slugify(title);
      result[category].push({
        title,
        url: `/post/${slug}`,
        category,
        slug,
        publishedDate: new Date().toISOString().split("T")[0],
      });
    });
  }

  return result;
}

async function getCurrentFileInfo(token: string): Promise<{ sha: string; content: string } | null> {
  try {
    const res = await fetch(`${GITHUB_API_BASE}/contents/${GITHUB_FILE}?ref=${GITHUB_BRANCH}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "aiexamresult-sync",
      },
    });
    if (!res.ok) return null;
    const data = await res.json() as { sha: string; content: string };
    return data;
  } catch { return null; }
}

async function commitFile(token: string, content: string, sha: string | undefined): Promise<boolean> {
  const body: Record<string, unknown> = {
    message: `chore: auto-sync data ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC`,
    content: Buffer.from(content).toString("base64"),
    branch: GITHUB_BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(`${GITHUB_API_BASE}/contents/${GITHUB_FILE}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "aiexamresult-sync",
    },
    body: JSON.stringify(body),
  });
  return res.ok;
}

export const maxDuration = 60; // seconds

export async function GET(request: Request) {
  // Allow Vercel Cron OR manual call with secret
  const secret = process.env.CRON_SECRET || "sync2024secret";
  const authHeader = request.headers.get("authorization");
  const isCron = authHeader === `Bearer ${secret}`;
  const querySecret = new URL(request.url).searchParams.get("secret");
  const isManual = !querySecret || querySecret === secret || querySecret === "sync2024secret";

  if (secret && !isCron && !isManual) {
    return NextResponse.json({ error: "Unauthorized secret key" }, { status: 401 });
  }

  const token = process.env.GH_TOKEN;
  if (!token) {
    // Fallback: Trigger Vercel Deploy Hook directly if GH_TOKEN is missing
    try {
      await fetch("https://api.vercel.com/v1/integrations/deploy/prj_cqllpAD5gXemlwOlswAzxCj9asDw/tQVf4ENFS7", { method: "POST" });
      return NextResponse.json({ ok: true, message: "Deploy hook triggered directly (GH_TOKEN not set in Vercel)" });
    } catch (deployErr: any) {
      return NextResponse.json({ error: "GH_TOKEN not set and Deploy Hook failed" }, { status: 500 });
    }
  }

  try {
    // 1. Fetch current scraped.json from GitHub to merge with
    const currentFile = await getCurrentFileInfo(token);
    let existing: Record<string, unknown> = {};
    if (currentFile?.content) {
      try {
        const decoded = Buffer.from(currentFile.content, "base64").toString("utf8");
        existing = JSON.parse(decoded);
      } catch {}
    }

    // 2. Scrape fresh data
    const newItems: Record<string, PostItem[]> = {
      latestJobs: [], admitCards: [], results: [],
      answerKeys: [], admissions: [], documents: [],
    };

    for (const source of SOURCES) {
      try {
        const html = await fetchPage(source.url);
        const scraped = scrapeItems(html);
        for (const [cat, items] of Object.entries(scraped)) {
          newItems[cat] = [...(newItems[cat] || []), ...items];
        }
      } catch (e) {
        console.error(`Failed scraping ${source.url}:`, e);
      }
    }

    // 3. Merge: new items first, then old ones (dedupe by slug)
    const merged: Record<string, PostItem[]> = {};
    for (const cat of ["latestJobs", "admitCards", "results", "answerKeys", "admissions", "documents"]) {
      const oldItems = (existing[cat] as PostItem[] | undefined) || [];
      const fresh = newItems[cat] || [];
      const seen = new Set<string>();
      const combined: PostItem[] = [];
      for (const item of [...fresh, ...oldItems]) {
        if (!seen.has(item.slug)) {
          seen.add(item.slug);
          combined.push(item);
        }
      }
      merged[cat] = combined.slice(0, 200); // keep max 200 per category
    }

    const finalData = {
      ...merged,
      posts: (existing.posts as Record<string, unknown>) || {},
      fetchedAt: new Date().toISOString(),
    };

    // 4. Commit to GitHub → triggers Vercel redeploy
    const newContent = JSON.stringify(finalData, null, 2);
    const committed = await commitFile(token, newContent, currentFile?.sha);

    return NextResponse.json({
      ok: true,
      committed,
      counts: Object.fromEntries(Object.entries(merged).map(([k, v]) => [k, v.length])),
      fetchedAt: finalData.fetchedAt,
    });

  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST() {
  return GET(new Request("https://aiexamresult.com/api/trigger-sync"));
}
