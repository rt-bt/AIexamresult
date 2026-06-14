import { scrapeSarkariResult, scrapePostDetail, type ScrapedItem, type PostDetail } from "./scraper";
import { scrapeResultBharat, scrapeTestbookResult, scrapeSarkariResultShine, scrapeSarkariExam } from "./sources";
import * as fs from "fs";
import * as path from "path";

function sanitizeSlug(s: string): string {
  return s.replace(/[<>:"/\\|?*]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "") || "post";
}

async function main() {
  // Scrape listings from all 5 sources
  const sources: [string, Promise<ScrapedItem[]>][] = [
    ["sarkariresult.com", scrapeSarkariResult().then(d => [...d.results, ...d.admitCards, ...d.latestJobs, ...d.answerKeys, ...d.documents, ...d.admissions] as ScrapedItem[])],
    ["resultbharat.com", scrapeResultBharat()],
    ["testbook.com", scrapeTestbookResult()],
    ["sarkariresultshine.com", scrapeSarkariResultShine()],
    ["sarkariexam.com", scrapeSarkariExam()],
  ];

  const allItems: ScrapedItem[] = [];
  for (const [name, promise] of sources) {
    try {
      const items = await promise;
      console.log(`${name}: ${items.length} items`);
      allItems.push(...items);
    } catch (e: unknown) {
      console.log(`${name}: Error - ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  // Deduplicate by URL
  const urlSeen = new Set<string>();
  const urlDeduped: ScrapedItem[] = [];
  for (const item of allItems) {
    if (!urlSeen.has(item.url)) {
      urlSeen.add(item.url);
      urlDeduped.push(item);
    }
  }

  // Also deduplicate by normalized title (same exam from different sources)
  function titleKey(title: string): string {
    let t = title.toLowerCase()
      .replace(/^\[.*?\]\s*/, "") // remove [domain.com] prefix
      .replace(/cen\s*\.?\s*(?:no\.?)?\s*[\d\/\-]+\s*/g, "") // CEN 01/2025, CEN.No.02/2025
      .replace(/advt\s*[\d\/\-]+\s*/g, "") // advt 01-2026
      .replace(/\bcbt\s*[-i]*\s*\d*\s*/g, "") // cbt, cbt 1, cbt-i, cbti
      .replace(/\bphase\s*\d+\s*/g, "") // phase 1, phase 2
      .replace(/\d{4}\s*/g, "") // years 2024-2026
      // Remove only truly generic/SEO words; keep exam identifiers (alp, ntpc, cgl, graduate, ug etc.)
      .replace(/\b(result|online\s*form|notification|recruitment|admission|counselling|apply|download|out|pdf|link|active|check|view|merit\s*list|score\s*card|cut\s*off|list|zone|zonal|wise|new|released|declared|announced|available|update|status|posts|post|the|and|for|of|to|in|by|date|details|information|notice|page|railway|exam|level|grade|batch|year|sarkari|answer\s*key|admit\s*card|exam\s*date|syllabus|vacancy|scholarship|scorecard|cutoff|final|marks|staff|gr|iii|ii|ug|undergraduate)\b/g, "");
    t = t.replace(/[^a-z\s]+/g, " "); // remove all remaining non-alpha chars
    t = t.replace(/\s+/g, " ").trim();
    return t.slice(0, 60);
  }
  const titleSeen = new Set<string>();
  const uniqueItems: ScrapedItem[] = [];
  for (const item of urlDeduped) {
    const key = titleKey(item.title);
    if (key.length > 3 && titleSeen.has(key)) continue;
    if (key.length > 3) titleSeen.add(key);
    uniqueItems.push(item);
  }
  console.log(`Total unique items: ${uniqueItems.length}`);

  // Scrape post details
  const postsDir = path.resolve(process.cwd(), "data", "posts");
  fs.mkdirSync(postsDir, { recursive: true });

  const posts: Record<string, PostDetail> = {};
  const CONCURRENCY = 5;
  let completed = 0;

  for (let i = 0; i < uniqueItems.length; i += CONCURRENCY) {
    const batch = uniqueItems.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(batch.map((item) => scrapePostDetail(item.url)));
    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      if (result.status === "fulfilled" && result.value) {
        const post = result.value;
        const safeSlug = sanitizeSlug(post.slug);
        post.slug = safeSlug;
        const listingItem = uniqueItems.find((u) => u.url === post.url);
        if (listingItem) {
          listingItem.publishedDate = post.publishedDate;
          listingItem.slug = safeSlug;
          if (post.category !== listingItem.category) {
            post.category = listingItem.category;
          }
        }
        posts[safeSlug] = post;
        fs.writeFileSync(path.join(postsDir, `${safeSlug}.json`), JSON.stringify(post, null, 2), "utf-8");
      }
    }
    completed += batch.length;
    console.log(`  ${completed}/${uniqueItems.length} posts processed`);
  }

  console.log(`Saved ${Object.keys(posts).length} individual post files`);

  // Write scraped data
  const outDir = path.resolve(process.cwd(), "data");
  fs.mkdirSync(outDir, { recursive: true });

  // Flatten categories from all items
  const catItems: Record<string, ScrapedItem[]> = {
    results: [], admitCards: [], latestJobs: [], answerKeys: [], documents: [], admissions: [],
  };
  for (const item of uniqueItems) {
    const cat = item.category as keyof typeof catItems;
    if (catItems[cat]) catItems[cat].push(item);
    else catItems.results.push(item); // default category
  }

  // Build slim listing (no full post content) + lastDate/isExpired lookup
  const slimPosts: Record<string, { lastDate?: string; isExpired?: boolean }> = {};
  for (const [slug, p] of Object.entries(posts)) {
    slimPosts[slug] = { lastDate: p.lastDate, isExpired: p.isExpired };
  }

  const output = {
    results: catItems.results,
    admitCards: catItems.admitCards,
    latestJobs: catItems.latestJobs,
    answerKeys: catItems.answerKeys,
    documents: catItems.documents,
    admissions: catItems.admissions,
    posts: slimPosts,
    fetchedAt: new Date().toISOString(),
  };

  fs.writeFileSync(path.join(outDir, "scraped.json"), JSON.stringify({
    ...output,
    posts, // full posts in scraped.json only
  }, null, 2), "utf-8");

  const tsContent = `// Auto-generated by npm run scrape - DO NOT EDIT
export const scrapedData = ${JSON.stringify(output, null, 2)};
`;
  fs.writeFileSync(path.join(outDir, "scraped-data.ts"), tsContent, "utf-8");

  console.log("Saved listing to data/scraped-data.ts");
}

main().catch(console.error);
