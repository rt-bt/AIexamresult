import * as cheerio from "cheerio";
import * as https from "https";
import * as http from "http";
import cloudscraper from "cloudscraper";

export interface ScrapedItem {
  title: string;
  url: string;
  category: string;
  slug: string;
  publishedDate?: string;
}

export interface PostSummary {
  title: string;
  slug: string;
  url: string;
  category: string;
  publishedDate: string;
  intro: string;
}

export interface PostDetail extends PostSummary {
  importantDates: string[];
  applicationFee: string[];
  importantLinks: { label: string; url: string | undefined }[];
  fullContentHtml: string;
}

export interface ScrapedData {
  results: ScrapedItem[];
  admitCards: ScrapedItem[];
  latestJobs: ScrapedItem[];
  answerKeys: ScrapedItem[];
  documents: ScrapedItem[];
  admissions: ScrapedItem[];
  posts: Record<string, PostDetail>;
  fetchedAt: string;
}

const SOURCE_URL = "https://www.sarkariexam.com/";
const HEADING_MAP: Record<string, keyof Omit<ScrapedData, "posts" | "fetchedAt">> = {
  "result": "results",
  "admit card": "admitCards",
  "top online form": "latestJobs",
  "answer keys": "answerKeys",
  "admission form": "admissions",
  "document verification": "documents",
};

async function fetchHtml(url: string, attempt = 1): Promise<string> {
  try {
    const html = await cloudscraper({ uri: url, method: "GET" });
    if (html && !html.includes("Just a moment")) return html;
  } catch {}
  const u = new URL(url);
  const mod = u.protocol === "https:" ? https : http;
  return new Promise((resolve, reject) => {
    const req = mod.get(
      url,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        timeout: 15000,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk: string) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode !== 200 && attempt < 3) {
            setTimeout(() => resolve(fetchHtml(url, attempt + 1)), 2000);
          } else {
            resolve(data);
          }
        });
      }
    );
    req.on("error", (err) => {
      if (attempt < 3) setTimeout(() => resolve(fetchHtml(url, attempt + 1)), 2000);
      else reject(err);
    });
    req.on("timeout", () => {
      req.destroy();
      if (attempt < 3) setTimeout(() => resolve(fetchHtml(url, attempt + 1)), 2000);
      else reject(new Error("Timeout after retries"));
    });
  });
}

function extractSections($: cheerio.CheerioAPI): ScrapedItem[] {
  const items: ScrapedItem[] = [];
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
      const slug = url.replace(/\/$/, "").split("/").pop() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      items.push({ title, url, category: key, slug });
    });
  });

  $(".content-five-post").each((_, block) => {
    const $block = $(block);
    const heading = $block.find(".content-mid-sub-heading h2").text().trim().toLowerCase();
    const key = HEADING_MAP[heading];
    if (!key) return;

    $block.find("span.block-list-b ul li a").each((__, link) => {
      const $link = $(link);
      const url = $link.attr("href") || "";
      if (!url || seen.has(url)) return;
      seen.add(url);
      const title = $link.text().trim();
      const slug = url.replace(/\/$/, "").split("/").pop() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      items.push({ title, url, category: key, slug });
    });
  });

  return items;
}

function extractSectionItems($: cheerio.CheerioAPI, $table: cheerio.Cheerio, sectionText: string): string[] {
  const items: string[] = [];
  $table.find("h3").each((_, h) => {
    const $h = $(h);
    if ($h.text().toLowerCase().includes(sectionText)) {
      const $td = $h.closest("td.pd-0");
      $td.find("ul li").each((__, li) => {
        items.push($(li).text().trim());
      });
    }
  });
  return items;
}

export async function scrapePostDetail(url: string): Promise<PostDetail | null> {
  try {
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);

    const title = $("h1.entry-title").text().trim();
    if (!title) return null;

    const publishedDate = $("time.entry-date.published").attr("datetime") || "";
    const intro = $("div.post-desc p").text().trim() || $("div.entry-content.clear p").first().text().trim();

    const importantDates: string[] = [];
    const applicationFee: string[] = [];
    const $table1 = $("div.newtable1");
    if ($table1.length) {
      importantDates.push(...extractSectionItems($, $table1, "important dates"));
      applicationFee.push(...extractSectionItems($, $table1, "application fee"));
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

    const $content = $("div.entry-content.clear").first();
    $content.find("script, style, ins, iframe, .newtable1, .newtable2").remove();
    const fullContentHtml = $content.html() || "";

    const slug = url.replace(/\/$/, "").split("/").pop() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    return {
      title,
      slug,
      url,
      category: "",
      publishedDate,
      intro,
      importantDates,
      applicationFee,
      importantLinks,
      fullContentHtml,
    };
  } catch {
    return null;
  }
}

export async function scrapeSarkariResult(): Promise<ScrapedData> {
  const html = await fetchHtml(SOURCE_URL);
  const $ = cheerio.load(html);

  const allItems = extractSections($);
  const itemsByCategory: Record<string, ScrapedItem[]> = {
    results: [], admitCards: [], latestJobs: [], answerKeys: [], documents: [], admissions: [],
  };
  for (const item of allItems) {
    const cat = item.category as keyof typeof itemsByCategory;
    if (itemsByCategory[cat]) itemsByCategory[cat].push(item);
  }

  const data: ScrapedData = {
    results: itemsByCategory.results,
    admitCards: itemsByCategory.admitCards,
    latestJobs: itemsByCategory.latestJobs,
    answerKeys: itemsByCategory.answerKeys,
    documents: itemsByCategory.documents,
    admissions: itemsByCategory.admissions,
    posts: {},
    fetchedAt: new Date().toISOString(),
  };

  return data;
}
