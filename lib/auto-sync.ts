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
      items.push({ title, url, category: key, slug });
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

  const newPosts: Record<string, { title: string; slug: string; url: string; category: string; publishedDate: string; intro: string }> = {};

  for (const item of newItems) {
    const detail = await fetchPostDetail(item.url);
    if (!detail) {
      console.log(`  [SKIP] ${item.title} - could not fetch details`);
      continue;
    }
    const post = {
      title: item.title,
      slug: item.slug,
      url: item.url,
      category: item.category,
      publishedDate: detail.publishedDate,
      intro: detail.intro,
      importantDates: detail.importantDates,
      applicationFee: detail.applicationFee,
      importantLinks: detail.importantLinks,
      fullContentHtml: "",
    };
    fs.writeFileSync(path.join(postsDir, `${item.slug}.json`), JSON.stringify(post, null, 2), "utf-8");
    newPosts[item.slug] = {
      title: item.title,
      slug: item.slug,
      url: item.url,
      category: item.category,
      publishedDate: detail.publishedDate,
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
    if (merged[cat]) {
      if (!merged[cat].find((x: { slug: string }) => x.slug === item.slug)) {
        merged[cat].push({ ...item, publishedDate: newPosts[item.slug]?.publishedDate || "" });
      }
    }
    if (newPosts[item.slug]) merged.posts[item.slug] = newPosts[item.slug];
  }

  const tsContent = `// Auto-generated by auto-sync - DO NOT EDIT\nexport const scrapedData = ${JSON.stringify(merged, null, 2)} as const;\n`;
  fs.writeFileSync(DATA_FILE, tsContent, "utf-8");

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`  Synced ${Object.keys(newPosts).length} new posts in ${elapsed}s. Total: ${Object.keys(merged.posts).length}`);
}

main().catch((err) => console.error("[auto-sync] Error:", err.message));
