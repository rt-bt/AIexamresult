// Lightweight 15-min sync script - only fetches new posts
import cloudscraper from "cloudscraper";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

const HEADING_MAP: Record<string, string> = {
  "result": "results",
  "admit card": "admitCards",
  "top online form": "latestJobs",
  "answer keys": "answerKeys",
  "admission form": "admissions",
  "document verification": "documents",
};

const DATA_FILE = path.resolve(process.cwd(), "data", "scraped-data.ts");
const JSON_FILE = path.resolve(process.cwd(), "data", "scraped.json");

function loadExistingSlugs(): Set<string> {
  try {
    const mod = require(DATA_FILE);
    const data = mod.scrapedData;
    const slugs = new Set<string>();
    for (const key of ["results", "admitCards", "latestJobs", "answerKeys", "documents", "admissions"]) {
      for (const item of data[key] || []) {
        if (item.slug) slugs.add(item.slug);
      }
    }
    for (const slug of Object.keys(data.posts || {})) slugs.add(slug);
    return slugs;
  } catch { return new Set(); }
}

function categorizeByTitle(title: string): string | null {
  const lower = title.toLowerCase();
  if (lower.includes("admit card") || lower.includes("hall ticket") || lower.includes("call letter") || lower.includes("exam city") || lower.includes("exam date")) return "admitCards";
  if (lower.includes("answer key") || lower.includes("response sheet")) return "answerKeys";
  if (lower.includes("admission") || lower.includes("counselling") || lower.includes("counseling")) return "admissions";
  if (lower.includes("online form") || lower.includes("apply") || lower.includes("recruitment") || lower.includes("apprentice") || lower.includes("vacancy")) return "latestJobs";
  return null;
}

function extractListings(html: string): { title: string; url: string; category: string; slug: string }[] {
  const $ = cheerio.load(html);
  const items: { title: string; url: string; category: string; slug: string }[] = [];
  const seen = new Set<string>();

  $(".below-block").each((_, block) => {
    const $block = $(block);
    const heading = $block.find("h4.wp-block-heading").text().trim().toLowerCase().replace(/<\/?strong>/g, "");
    const key = HEADING_MAP[heading];
    if (!key) return;

    $block.find("ul.wp-block-latest-posts__list li a.wp-block-latest-posts__post-title").each((__, link) => {
      const $link = $(link);
      const url = $link.attr("href") || "";
      if (!url || seen.has(url)) return;
      seen.add(url);
      const title = $link.text().trim();
      const slug = url.replace(/\/$/, "").split("/").pop() || "";
      // Use title-based categorization to override section-based when title clearly indicates a different type
      const titleCat = categorizeByTitle(title);
      const finalCat = titleCat || key;
      items.push({ title, url, category: finalCat, slug });
    });
  });
  return items;
}

async function fetchPostDetail(url: string): Promise<{ publishedDate: string; intro: string; importantDates: string[]; applicationFee: string[]; importantLinks: { label: string; url: string | undefined }[] } | null> {
  try {
    const html = await cloudscraper({ uri: url, method: "GET" });
    const $ = cheerio.load(html);
    const publishedDate = $("time.entry-date.published").attr("datetime") || "";
    const intro = $("div.post-desc p").text().trim() || "";

    const importantDates: string[] = [];
    const applicationFee: string[] = [];
    const $table1 = $("div.newtable1");
    if ($table1.length) {
      $table1.find("h3").each((_, h) => {
        const $h = $(h);
        if ($h.text().toLowerCase().includes("important dates")) {
          $h.closest("td.pd-0").find("ul li").each((__, li) => importantDates.push($(li).text().trim()));
        }
        if ($h.text().toLowerCase().includes("application fee")) {
          $h.closest("td.pd-0").find("ul li").each((__, li) => applicationFee.push($(li).text().trim()));
        }
      });
    }

    const spamLabels = ["sarkari exam mobile app", "join whatsapp channel", "join telegram channel"];
    const importantLinks: { label: string; url: string | undefined }[] = [];
    const $table2 = $("div.newtable2");
    if ($table2.length) {
      $table2.find("table tbody tr").each((_, row) => {
        const $tds = $(row).find("td.tcell");
        if ($tds.length >= 2) {
          const label = $tds.eq(0).find("h4 span, h4").text().trim();
          const linkUrl = $tds.eq(1).find("a").attr("href");
          if (label && !label.toLowerCase().includes("important links")) {
            const lower = label.toLowerCase();
            if (spamLabels.some((s) => lower.includes(s))) return;
            if (linkUrl && (linkUrl.includes("sarkariexam.com") || linkUrl.includes("sarkariresult"))) return;
            importantLinks.push({ label, url: linkUrl });
          }
        }
      });
    }
    return { publishedDate, intro, importantDates, applicationFee, importantLinks };
  } catch { return null; }
}

async function main() {
  const start = Date.now();
  console.log(`[${new Date().toLocaleTimeString()}] Auto-sync: checking sarkariexam.com...`);

  const html = await cloudscraper({ uri: "https://www.sarkariexam.com/", method: "GET" });
  const listings = extractListings(html);
  const existing = loadExistingSlugs();
  const newItems = listings.filter((item) => !existing.has(item.slug));

  if (newItems.length === 0) {
    console.log(`  No new posts found. (${listings.length} total, all synced)`);
    return;
  }

  console.log(`  Found ${newItems.length} new posts. Fetching details...`);

  const postsDir = path.resolve(process.cwd(), "data", "posts");
  fs.mkdirSync(postsDir, { recursive: true });

  const newPosts: Record<string, { title: string; slug: string; url: string; category: string; publishedDate: string; publishedAt: string; intro: string }> = {};

  for (const item of newItems) {
    const detail = await fetchPostDetail(item.url);
    if (!detail) {
      console.log(`  [SKIP] ${item.title} - could not fetch details`);
      continue;
    }

    const postFilePath = path.join(postsDir, `${item.slug}.json`);
    let existingPost: any = null;
    if (fs.existsSync(postFilePath)) {
      try {
        existingPost = JSON.parse(fs.readFileSync(postFilePath, "utf-8"));
      } catch {}
    }

    let publishedAt: string;
    let publishedDate: string;
    let createdAt: string;
    let updatedAt: string;

    if (existingPost) {
      publishedAt = existingPost.publishedAt || existingPost.createdAt || existingPost.publishedDate || detail.publishedDate || new Date().toISOString();
      publishedDate = existingPost.publishedDate || detail.publishedDate || publishedAt;
      createdAt = existingPost.createdAt || publishedAt;
      updatedAt = new Date().toISOString();
    } else {
      publishedDate = detail.publishedDate || "";
      publishedAt = publishedDate ? (new Date(publishedDate).toISOString() || new Date().toISOString()) : new Date().toISOString();
      createdAt = publishedAt;
      updatedAt = publishedAt;
    }

    const post = {
      title: item.title,
      slug: item.slug,
      url: item.url,
      category: item.category,
      publishedDate,
      publishedAt,
      createdAt,
      updatedAt,
      intro: detail.intro,
      importantDates: detail.importantDates,
      applicationFee: detail.applicationFee,
      importantLinks: detail.importantLinks,
      fullContentHtml: "",
    };
    fs.writeFileSync(postFilePath, JSON.stringify(post, null, 2), "utf-8");
    newPosts[item.slug] = {
      title: item.title,
      slug: item.slug,
      url: item.url,
      category: item.category,
      publishedDate,
      publishedAt,
      intro: detail.intro,
    };
    console.log(`  [NEW] ${item.title}`);
  }

  if (Object.keys(newPosts).length === 0) {
    console.log("  No new posts could be fetched.");
    return;
  }

  // Rebuild scraped-data.ts with new posts merged
  const mod = require(DATA_FILE);
  const oldData = mod.scrapedData;
  const merged = {
    results: [...oldData.results],
    admitCards: [...oldData.admitCards],
    latestJobs: [...oldData.latestJobs],
    answerKeys: [...oldData.answerKeys],
    documents: [...oldData.documents],
    admissions: [...oldData.admissions],
    posts: { ...oldData.posts },
    fetchedAt: new Date().toISOString(),
  };

  for (const item of newItems) {
    const cat = item.category as keyof typeof merged;
    const postInfo = newPosts[item.slug];
    if (merged[cat]) {
      const idx = (merged[cat] as any[]).findIndex((x: { slug: string }) => x.slug === item.slug);
      if (idx === -1) {
        merged[cat].push({
          ...item,
          publishedDate: postInfo?.publishedDate || "",
          publishedAt: postInfo?.publishedAt || "",
        });
      } else {
        merged[cat][idx] = {
          ...merged[cat][idx],
          ...item,
          publishedDate: merged[cat][idx].publishedDate || postInfo?.publishedDate || "",
          publishedAt: merged[cat][idx].publishedAt || postInfo?.publishedAt || "",
        };
      }
    }
    if (postInfo) merged.posts[item.slug] = postInfo;
  }

  const jsonContent = JSON.stringify(merged, null, 2);
  const tsContent = `// Auto-generated by auto-sync - DO NOT EDIT\nexport const scrapedData = ${jsonContent} as const;\n`;
  fs.writeFileSync(DATA_FILE, tsContent, "utf-8");
  fs.writeFileSync(JSON_FILE, jsonContent, "utf-8");

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`  Synced ${Object.keys(newPosts).length} new posts in ${elapsed}s. Total: ${Object.keys(merged.posts).length}`);
}

main().catch((err) => console.error("[auto-sync] Error:", err.message));
