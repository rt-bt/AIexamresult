import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { submitToIndexNow } from "@/lib/indexnow";

const GITHUB_REPO = "rt-bt/AIexamresult";
const GITHUB_FILE = "data/scraped.json";
const GITHUB_BRANCH = "master";
const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}`;
const GITHUB_API_BASE = `https://api.github.com/repos/${GITHUB_REPO}`;
const SOURCE_HOME = "https://www.sarkariexam.com/";

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
        publishedDate: "", // populated later from scrapePostDetail
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
        publishedDate: "", // populated later from scrapePostDetail
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

// Commit a single post detail file to GitHub
async function commitPostFile(token: string, slug: string, content: string): Promise<void> {
  const filePath = `data/posts/${slug}.json`;
  // Check if file already exists to get SHA
  let sha: string | undefined;
  try {
    const r = await fetch(`${GITHUB_API_BASE}/contents/${filePath}?ref=${GITHUB_BRANCH}`, {
      headers: { Authorization: `Bearer ${token}`, "User-Agent": "aiexamresult-sync" },
    });
    if (r.ok) {
      const d = await r.json() as { sha: string };
      sha = d.sha;
    }
  } catch {}

  const body: Record<string, unknown> = {
    message: `chore: sync post ${slug}`,
    content: Buffer.from(content).toString("base64"),
    branch: GITHUB_BRANCH,
  };
  if (sha) body.sha = sha;

  await fetch(`${GITHUB_API_BASE}/contents/${filePath}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "aiexamresult-sync",
    },
    body: JSON.stringify(body),
  });
}

function cleanText(text: string): string {
  return (text || "")
    .replace(/sarkari\s*exam/gi, "")
    .replace(/sarkariexam\.com/gi, "")
    .replace(/join\s+our\s+(whatsapp|telegram)\s+(channel|group)/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isPublicLink(href: string): boolean {
  if (!href || href === "#" || href.startsWith("javascript")) return false;
  try {
    const u = new URL(href, SOURCE_HOME);
    return u.hostname !== "www.sarkariexam.com" && !u.hostname.includes("sarkariresult");
  } catch { return false; }
}

function isSpamLabel(label: string): boolean {
  const lower = label.toLowerCase();
  return !lower || lower.includes("whatsapp") || lower.includes("telegram") ||
    lower.includes("facebook") || lower.includes("youtube") || lower.includes("home page");
}

async function scrapePostDetail(sourceUrl: string, item: { title: string; slug: string; category: string }) {
  try {
    const res = await fetch(sourceUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36" },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);

    const publishedDate = $("time.entry-date.published").attr("datetime") || $("time").first().attr("datetime") || "";
    const intro = cleanText($("div.post-desc p").text() || $("div.entry-content p").first().text() || "");
    const importantDates: string[] = [];
    const applicationFee: string[] = [];

    $("table tr").each((_, row) => {
      const cells = $(row).find("td, th");
      if (cells.length < 2) return;
      const first = cleanText($(cells[0]).text());
      const second = cleanText($(cells[1]).text());
      const lower = first.toLowerCase();
      if (first && second && (lower.includes("date") || lower.includes("last") || lower.includes("exam") || lower.includes("admit"))) {
        importantDates.push(`${first}: ${second}`);
      }
    });

    const importantLinks: { label: string; url: string }[] = [];
    $("table tr").each((_, row) => {
      const label = cleanText($(row).find("td").first().text());
      const href = $(row).find("a[href]").first().attr("href") || "";
      if (!isSpamLabel(label) && isPublicLink(href)) {
        importantLinks.push({ label, url: new URL(href, SOURCE_HOME).toString() });
      }
    });

    return {
      title: item.title,
      slug: item.slug,
      url: `/post/${item.slug}`,
      category: item.category,
      publishedDate,
      intro,
      importantDates: [...new Set(importantDates.map(cleanText).filter(Boolean))],
      applicationFee: [...new Set(applicationFee.map(cleanText).filter(Boolean))],
      importantLinks: importantLinks.slice(0, 12),
      fullContentHtml: "",
    };
  } catch {
    return {
      title: item.title, slug: item.slug, url: `/post/${item.slug}`,
      category: item.category, publishedDate: "", intro: "",
      importantDates: [], applicationFee: [], importantLinks: [], fullContentHtml: "",
    };
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: Request) {
  let providedSecret = "";
  try {
    const body = await request.json();
    providedSecret = body.secret || "";
  } catch {
    providedSecret = new URL(request.url).searchParams.get("secret") || "";
  }

  const serverSecret = process.env.CRON_SECRET || "AdityaSync2026#SecurePin";
  const authHeader = request.headers.get("authorization");
  const isCron = authHeader === `Bearer ${serverSecret}`;
  const isManual = providedSecret === serverSecret;

  if (!isCron && !isManual) {
    return NextResponse.json({ error: "Incorrect Secret Password. Access Denied." }, { status: 401, headers: corsHeaders });
  }

  const token = process.env.GH_TOKEN;
  if (!token) {
    // Fallback: Trigger Vercel Deploy Hook directly if GH_TOKEN is missing
    try {
      await fetch("https://api.vercel.com/v1/integrations/deploy/prj_cqllpAD5gXemlwOlswAzxCj9asDw/tQVf4ENFS7", { method: "POST" });
      return NextResponse.json({ ok: true, message: "Deploy hook triggered directly (GH_TOKEN not set in Vercel)" }, { headers: corsHeaders });
    } catch (deployErr: any) {
      return NextResponse.json({ error: "GH_TOKEN not set and Deploy Hook failed" }, { status: 500, headers: corsHeaders });
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

    const merged: Record<string, PostItem[]> = {};
    for (const cat of ["latestJobs", "admitCards", "results", "answerKeys", "admissions", "documents"]) {
      const oldItems = (existing[cat] as PostItem[] | undefined) || [];
      const fresh = newItems[cat] || [];
      const seen = new Set<string>();
      const combined: PostItem[] = [];

      // Build a map of old items by slug to preserve their publishedDate
      const oldBySlug = new Map<string, PostItem>();
      for (const item of oldItems) {
        if (item.slug) oldBySlug.set(item.slug, item);
      }

      for (const item of [...fresh, ...oldItems]) {
        if (!seen.has(item.slug)) {
          seen.add(item.slug);
          // If fresh item has no publishedDate, restore from existing record
          if (!item.publishedDate && oldBySlug.has(item.slug)) {
            item.publishedDate = oldBySlug.get(item.slug)!.publishedDate || "";
          }
          combined.push(item);
        }
      }
      merged[cat] = combined.slice(0, 200); // keep max 200 per category
    }

    // 4. Scrape and commit post detail files for NEW items only (max 10 to stay within timeout)
    const allFreshItems = Object.values(newItems).flat();
    const existingSlugs = new Set(Object.keys((existing.posts as Record<string, unknown>) || {}));
    const newPostItems = allFreshItems.filter(item => !existingSlugs.has(item.slug)).slice(0, 10);

    // Also get sourceUrl from homepage scrape to build sarkariexam.com post URL
    const postCommitPromises = newPostItems.map(async (item) => {
      // Reconstruct the source URL from sarkariexam.com based on slug
      const guessedUrl = `https://www.sarkariexam.com/${item.slug}/`;
      const detail = await scrapePostDetail(guessedUrl, item);

      // Sync real publishedDate back into the listing item (so scraped.json gets the actual date)
      if (detail.publishedDate) {
        item.publishedDate = detail.publishedDate;
        // Also update in merged data
        for (const cat of Object.values(merged)) {
          const found = (cat as PostItem[]).find(m => m.slug === item.slug);
          if (found) found.publishedDate = detail.publishedDate;
        }
      }

      await commitPostFile(token, item.slug, JSON.stringify(detail, null, 2));
    });
    await Promise.allSettled(postCommitPromises);

    const finalData = {
      ...merged,
      posts: (existing.posts as Record<string, unknown>) || {},
      fetchedAt: new Date().toISOString(),
    };

    // 5. Commit scraped.json to GitHub → triggers Vercel redeploy
    const newContent = JSON.stringify(finalData, null, 2);
    const committed = await commitFile(token, newContent, currentFile?.sha);

    // 6. Automatically ping IndexNow for all fresh URLs (fast search engine indexing)
    const freshUrls = newPostItems.map(item => `https://www.aiexamresult.com/post/${item.slug}`);
    if (freshUrls.length > 0) {
      submitToIndexNow(freshUrls).catch(() => {});
    }

    return NextResponse.json({
      ok: true,
      committed,
      counts: Object.fromEntries(Object.entries(merged).map(([k, v]) => [k, v.length])),
      newPostsCommitted: newPostItems.length,
      indexNowSubmitted: freshUrls.length,
      fetchedAt: finalData.fetchedAt,
    }, { headers: corsHeaders });

  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500, headers: corsHeaders });
  }
}

export async function GET(request: Request) {
  return POST(request);
}
