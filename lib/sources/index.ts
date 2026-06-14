import { fetchHtml, type ScrapedItem } from "../scraper";
import * as cheerio from "cheerio";

function slugFromUrl(url: string): string {
  const clean = url.split("?")[0].replace(/\/$/, "");
  return clean.split("/").pop()?.replace(/\.html$/, "") || "";
}

export async function scrapeResultBharat(): Promise<ScrapedItem[]> {
  const html = await fetchHtml("https://www.resultbharat.com/");
  const $ = cheerio.load(html);
  const items: ScrapedItem[] = [];
  const seen = new Set<string>();

  // resultbharat has h3 headings for post titles, with links inside
  $("h3 a[href]").each((_, a) => {
    const $a = $(a);
    let href = $a.attr("href") || "";
    const text = $a.text().trim();
    if (!href || text.length < 15 || seen.has(href)) return;
    seen.add(href);
    if (!href.startsWith("http")) href = "https://www.resultbharat.com" + (href.startsWith("/") ? href : "/" + href);
    items.push({
      title: text,
      url: href,
      category: categorizeTitle(text),
      slug: slugFromUrl(href),
    });
  });

  return items;
}

export async function scrapeTestbookResult(): Promise<ScrapedItem[]> {
  const html = await fetchHtml("https://testbook.com/news/result/");
  const $ = cheerio.load(html);
  const items: ScrapedItem[] = [];
  const seen = new Set<string>();

  $("article a[href], h2 a[href], h3 a[href]").each((_, a) => {
    const $a = $(a);
    let href = $a.attr("href") || "";
    const text = $a.text().trim();
    if (!href || text.length < 20 || seen.has(href)) return;
    seen.add(href);
    if (!href.startsWith("http")) href = "https://testbook.com" + (href.startsWith("/") ? href : "/" + href);
    items.push({
      title: text,
      url: href,
      category: categorizeTitle(text),
      slug: slugFromUrl(href),
    });
  });

  return items;
}

export async function scrapeSarkariResultShine(): Promise<ScrapedItem[]> {
  const html = await fetchHtml("https://sarkariresultshine.com/");
  const $ = cheerio.load(html);
  const items: ScrapedItem[] = [];
  const seen = new Set<string>();

  const spam = ["whatsapp", "telegram", "facebook", "twitter", "instagram", "youtube"];
  $("a[href]").each((_, a) => {
    const $a = $(a);
    let href = $a.attr("href") || "";
    const text = $a.text().trim();
    if (!href || text.length < 20 || seen.has(href)) return;
    const lowerHref = href.toLowerCase();
    if (spam.some(s => lowerHref.includes(s))) return;
    const lowerText = text.toLowerCase();
    if (spam.some(s => lowerText.includes(s))) return;
    seen.add(href);
    if (!href.startsWith("http")) href = "https://sarkariresultshine.com" + (href.startsWith("/") ? href : "/" + href);
    items.push({
      title: text,
      url: href,
      category: categorizeTitle(text),
      slug: slugFromUrl(href),
    });
  });

  return items;
}

function categorizeTitle(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("admit card") || lower.includes("exam city") || lower.includes("hall ticket") || lower.includes("call letter") || lower.includes("exam date")) return "admitCards";
  if (lower.includes("answer key") || lower.includes("answer-key") || lower.includes("response sheet")) return "answerKeys";
  if (lower.includes("cutoff") || lower.includes("cut-off") || lower.includes("merit list") || lower.includes("merit-list")) return "results";
  if (lower.includes("result") && !lower.includes("online form") && !lower.includes("exam date") && !lower.includes("admit card")) return "results";
  if (lower.includes("vacancy") || lower.includes("online form") || lower.includes("apply") || lower.includes("recruitment") || lower.includes("apprentice") || lower.includes("posts") || lower.includes("notification")) return "latestJobs";
  if (lower.includes("admission") || lower.includes("counselling") || lower.includes("counseling") || lower.includes("schedule")) return "admissions";
  if (lower.includes("syllabus") || lower.includes("exam pattern") || lower.includes("documents")) return "documents";
  return "results";
}

export async function scrapeSarkariExam(): Promise<ScrapedItem[]> {
  const urls = [
    "https://www.sarkariexam.com/",
    "https://www.sarkariexam.com/category/admit-card/",
    "https://www.sarkariexam.com/category/hot-job/",
    "https://www.sarkariexam.com/category/exam-result/",
    "https://www.sarkariexam.com/category/top-online-form/",
    "https://www.sarkariexam.com/category/answer-keys/",
  ];
  const allItems: ScrapedItem[] = [];
  const seen = new Set<string>();

  for (const url of urls) {
    try {
      const html = await fetchHtml(url);
      const $ = cheerio.load(html);

      $("a[href]").each((_, a) => {
        const $a = $(a);
        let href = $a.attr("href") || "";
        const text = $a.text().trim();
        if (!href || text.length < 15 || seen.has(href)) return;
        if (!href.includes("sarkariexam.com") || href.includes("#") || href.includes("facebook") || href.includes("twitter") || href.includes("telegram") || href.includes("instagram") || href.includes("youtube") || href.includes("whatsapp") || href.startsWith("javascript")) return;
        if (href.includes("/category/") || href.includes("/tag/") || href.includes("/author/") || href.includes("/page/") || href.includes("feed") || href.includes("comment") || href.includes("replytocom") || href.includes("sarkariresult")) return;
        const lowerText = text.toLowerCase();
        if (lowerText.includes("@instagram") || lowerText.includes("@facebook") || lowerText.includes("@twitter") || lowerText.includes("join our") || lowerText.includes("follow us")) return;

        seen.add(href);
        if (!href.startsWith("http")) href = "https://www.sarkariexam.com" + (href.startsWith("/") ? href : "/" + href);

        allItems.push({
          title: text,
          url: href.split("?")[0].replace(/\/$/, ""),
          category: categorizeTitle(text),
          slug: slugFromUrl(href),
        });
      });
    } catch {
      // skip failed category pages
    }
  }

  return allItems;
}
