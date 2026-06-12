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
      category: "results",
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
      category: "results",
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
      category: "results",
      slug: slugFromUrl(href),
    });
  });

  return items;
}
