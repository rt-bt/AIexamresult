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
  lastDate?: string;
  isExpired?: boolean;
  vacancyDetails?: string[];
  divisionWiseVacancy?: { division: string; posts: string }[];
  cutoff?: Record<string, string>;
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

const SOURCE_URL = "https://www.sarkariresult.com/";

const CATEGORY_MAP: Record<string, keyof Omit<ScrapedData, "posts" | "fetchedAt">> = {
  "result": "results",
  "admitcard": "admitCards",
  "latestjob": "latestJobs",
  "answerkey": "answerKeys",
  "admission": "admissions",
};

// Ordered "View More" button paths on the homepage
const HOME_CATEGORIES = ["result", "admitcard", "latestjob"];

export async function fetchHtml(url: string, attempt = 1): Promise<string> {
  try {
    const html = await cloudscraper({ uri: url, method: "GET" });
    if (html && !html.includes("Just a moment") && !html.includes("_cf_chl")) return html;
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

  // Find "View More" gb-button links to get category order
  const viewMorePaths: string[] = [];
  $("a.gb-button").each((_, a) => {
    const $a = $(a);
    if ($a.text().trim().toLowerCase() === "view more") {
      const href = $a.attr("href") || "";
      const path = href.replace(/https?:\/\/[^/]+\//, "").replace(/\/$/, "");
      viewMorePaths.push(path);
    }
  });

  // Extract links from gb-containers that have >3 post links
  let containerIdx = 0;
  $("div[class*=gb-container]").each((_, el) => {
    const $el = $(el);
    const postLinks = $el.find("a[href]").filter((_, a) => $(a).text().trim().length > 15);
    if (postLinks.length < 3) return;

    // Determine category from viewMorePaths at same index, or from partial URL match
    const vmPath = viewMorePaths[containerIdx] || "";
    const category = CATEGORY_MAP[vmPath] || "";
    containerIdx++;

    // Skip containers whose category isn't in our mapping
    if (!category) return;

    postLinks.each((_, a) => {
      const $a = $(a);
      const url = $a.attr("href") || "";
      if (!url || seen.has(url)) return;
      seen.add(url);
      const title = $a.text().trim();
      const slug = url.replace(/\/$/, "").split("/").pop() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      items.push({ title, url, category, slug });
    });
  });

  return items;
}

function parseLastDate(dates: string[]): string | undefined {
  for (const d of dates) {
    const lower = d.toLowerCase();
    if (lower.includes("last date") || lower.includes("apply") || lower.includes("last")) {
      // Extract date pattern: DD/MM/YYYY or DD Month YYYY
      const match = d.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
      if (match) return match[1];
      const match2 = d.match(/(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/i);
      if (match2) return match2[1];
    }
  }
  // Fallback: try to find any date pattern in the first few items
  for (const d of dates.slice(0, 6)) {
    const lower = d.toLowerCase();
    if (lower.includes("begin") || lower.includes("start")) continue;
    const match = d.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
    if (match) return match[1];
  }
  return undefined;
}

function isExpired(lastDateStr?: string): boolean {
  if (!lastDateStr) return false;
  const parts = lastDateStr.split("/");
  if (parts.length !== 3) return false;
  const d = new Date(+parts[2], +parts[1] - 1, +parts[0]);
  return d < new Date();
}

export async function scrapePostDetail(url: string): Promise<PostDetail | null> {
  try {
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);

    let title = "";
    let publishedDate = "";
    let intro = "";

    // Try table format first (sarkariresult.com, resultbharat.com)
    const $infoTable = $("table").first();
    if ($infoTable.length) {
      $infoTable.find("tr").each((_, tr) => {
        const $tds = $(tr).find("td");
        const label = $tds.eq(0).text().trim().toLowerCase();
        const value = $tds.eq(1).text().trim();
        if (label.includes("name of post")) title = value;
        else if (label.includes("post date") || label.includes("update")) publishedDate = value;
        else if (label.includes("short information")) intro = value;
      });
    }

    // Fallback: h1 or h2 title
    if (!title) title = $("h1.entry-title").text().trim();
    if (!title) title = $("h1").first().text().trim();
    if (!title) return null;

    // Prefer <title> tag when it's more descriptive
    const titleTag = $("title").text().trim().replace(/\s*[–-].+\w+\s*$/, "").trim();
    if (titleTag && titleTag.length > title.length && !titleTag.includes("Just a moment")) {
      title = titleTag;
    }

    const importantDates: string[] = [];
    const applicationFee: string[] = [];
    const importantLinks: { label: string; url: string | undefined }[] = [];
    const spamLabels = ["join whatsapp", "join telegram", "android app", "apple ios", "mobile app", "sarkari result channel"];

    const $mainTable = $("table").eq(1);
    if ($mainTable.length) {
      $mainTable.find("h2, h3, h4").each((_, h) => {
        const $h = $(h);
        const txt = $h.text().trim().toLowerCase();
        if (txt.includes("important date")) {
          const $td = $h.closest("td");
          $td.find("ul li").each((_, li) => {
            const t = $(li).text().trim();
            if (t) importantDates.push(t);
          });
        }
        if (txt.includes("application fee")) {
          const $td = $h.closest("td");
          $td.find("ul li").each((_, li) => {
            const t = $(li).text().trim().replace(/[^\x20-\x7E₹]/g, "").replace(/�/g, "").replace(/[\uFFFD\u2013\u2014]/g, "-");
            if (t) applicationFee.push(t);
          });
        }
      });

      $mainTable.find("h2, h3, h4").each((_, h) => {
        const $h = $(h);
        const txt = $h.text().trim().toLowerCase();
        if (txt.includes("important links") || txt.includes("useful links")) {
          const $currentTr = $h.closest("tr");
          $currentTr.nextAll("tr").each((_, tr) => {
            const cells = $(tr).find("td");
            if (cells.length >= 2) {
              const label = $(cells[0]).text().trim();
              if (!label || label.length > 80) return;
              const linkUrl = $(cells[1]).find("a").attr("href");
              const lower = label.toLowerCase();
              if (spamLabels.some(s => lower.includes(s))) return;
              if (linkUrl && (linkUrl.includes("sarkariresult") || linkUrl.includes("sarkariresults"))) return;
              if (label && !label.includes("Click Here") && !label.includes("Mobile Apps")) {
                importantLinks.push({ label, url: linkUrl });
              }
            }
          });
        }
      });
    } else {
      // Fallback for article-based pages: extract date, fee, links from content
      if (!publishedDate || !intro) {
        const $firstP = $("p").first();
        const firstText = $firstP.text().trim();
        if (!intro && firstText.length > 20) intro = firstText;
        // Try to find a date from the first paragraph or heading
        $("p, li, div, h2, h3, h4, span").each((_, el) => {
          const txt = $(el).text().trim().toLowerCase();
          if (!publishedDate) {
            const dateMatch = txt.match(/(?:post|published|updated|start|created|released)\s*(?:date\s*)?[:\-]?\s*(\d{1,2}\s+(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4})/i);
            if (dateMatch) publishedDate = dateMatch[1];
          }
          // Fallback: any visible DD Month YYYY pattern
          if (!publishedDate) {
            const anyDate = txt.match(/(\d{1,2}\s+(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4})/i);
            if (anyDate) {
              const lower = txt;
              if (!lower.includes("last") && !lower.includes("fee") && !lower.includes("age") && !lower.includes("salary") && !lower.includes("birth") && !lower.includes("exam")) {
                publishedDate = anyDate[1];
              }
            }
          }
          if (txt.includes("last date") || txt.includes("application deadline") || txt.includes("apply before")) {
            importantDates.push($(el).text().trim());
          }
          if (txt.includes("application fee") || txt.includes("exam fee") || txt.includes("registration fee")) {
            applicationFee.push($(el).text().trim());
          }
        });
      }
    }

    // Fallback: extract dates/fee from first table (sarkariexam.com format)
    if ((importantDates.length === 0 || applicationFee.length === 0) && $infoTable.length) {
      $infoTable.find("tr").each((_, tr) => {
        const $cells = $(tr).find("td");
        if ($cells.length === 0) return;
        // Some rows have colspan with all content in one cell
        const fullText = $cells.first().text().trim();
        const lines = fullText.split("\n").map((l) => l.trim()).filter(Boolean);
        const header = lines[0]?.toLowerCase() || "";
        const contentLines = lines.slice(1).filter((l) => !l.includes("(adsbygoogle") && !l.includes("window."));
        if (importantDates.length === 0 && (header.includes("important date") || header.includes("important dates"))) {
          contentLines.forEach((l) => { if (l) importantDates.push(l); });
        }
        if ((applicationFee.length === 0 || applicationFee.length < 3) && (header.includes("application fee") || header.includes("exam fee"))) {
          const cleanLines = contentLines.map(l => l.replace(/[^\x20-\x7E₹]/g, "").replace(/�/g, "").replace(/[\uFFFD\u2013\u2014]/g, "-").trim()).filter(Boolean);
          cleanLines.forEach((l) => { if (l) applicationFee.push(l); });
        }
      });
    }

    // Fallback: extract importantLinks from div.newtable2 (sarkariexam.com format)
    if (importantLinks.length === 0) {
      const newtable = $("div.newtable2 table");
      if (newtable.length) {
        newtable.find("tr").each((_, tr) => {
          const tds = $(tr).find("td");
          if (tds.length >= 2) {
            const label = $(tds[0]).text().trim();
            if (label && label.length < 80) {
              const linkUrl = $(tds[1]).find("a").attr("href");
              const lower = label.toLowerCase();
              if (!spamLabels.some(s => lower.includes(s)) && !lower.includes("click here") && !lower.includes("mobile app")) {
                importantLinks.push({ label, url: linkUrl });
              }
            }
          }
        });
      }
      // Also check for section with linked buttons (common on many sites)
      if (importantLinks.length === 0) {
        $("h2, h3, h4").each((_, h) => {
          const $h = $(h);
          const txt = $h.text().trim().toLowerCase();
          if (txt.includes("important links") || txt.includes("useful links")) {
            const $next = $h.nextAll("table, div, ul").first();
            if ($next.length) {
              $next.find("a[href]").each((_, a) => {
                const $a = $(a);
                const label = $a.text().trim();
                const linkUrl = $a.attr("href");
                if (label && label.length < 80 && linkUrl && !linkUrl.includes("sarkariresult") && !spamLabels.some(s => label.toLowerCase().includes(s))) {
                  importantLinks.push({ label, url: linkUrl });
                }
              });
            }
          }
        });
      }
    }

    // Better publishedDate extraction for all sources
    if (!publishedDate) {
      const datePattern = /(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/i;
      const postDateEl = $("time[datetime]").first().attr("datetime");
      if (postDateEl) {
        const d = new Date(postDateEl);
        if (!isNaN(d.getTime())) {
          publishedDate = d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
        }
      }
      if (!publishedDate) {
        const metaDate = $('meta[property="article:published_time"]').attr("content") || $('meta[name="pubdate"]').attr("content") || $('meta[name="publish-date"]').attr("content");
        if (metaDate) {
          const d = new Date(metaDate);
          if (!isNaN(d.getTime())) {
            publishedDate = d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
          }
        }
      }
      // Last resort: scan first few paragraphs for a date
      if (!publishedDate) {
        $("p").slice(0, 3).each((_, p) => {
          const txt = $(p).text().trim();
          const m = txt.match(datePattern);
          if (m && !txt.toLowerCase().includes("last date") && !txt.toLowerCase().includes("fee")) {
            publishedDate = m[1];
            return false;
          }
        });
      }
    }

    // Discard published dates that are in the future (source data errors)
    if (publishedDate) {
      const m = publishedDate.match(/(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December),?\s+(\d{4})/i);
      if (m) {
        const months: Record<string, number> = {january:0,february:1,march:2,april:3,may:4,june:5,july:6,august:7,september:8,october:9,november:10,december:11};
        const d = new Date(+m[3], months[m[2].toLowerCase()], +m[1]);
        if (!isNaN(d.getTime()) && d > new Date()) publishedDate = "";
      }
    }

    // Better intro extraction
    if (!intro) {
      const $firstP = $("p").first();
      const firstText = $firstP.text().trim();
      if (firstText.length > 30 && firstText.length < 500) intro = firstText;
      if (!intro) {
        const $introEl = $("div.entry-content p, div.post-content p, article p").first();
        const t = $introEl.text().trim();
        if (t.length > 30) intro = t;
      }
    }

    // Extract last date
    const lastDate = parseLastDate(importantDates);

    // Content HTML
    const fullContentHtml = (() => {
      const $article = $("article.dynamic-content-template, article[class*=post], article.post, article");
      if ($article.length) {
        const clone = $article.first().clone();
        clone.find("script, style, ins, iframe, .gb-button-wrapper, nav, header, footer").remove();
        clone.find("a[href*=sarkariresult], a[href*=sarkariresults]").remove();
        clone.find("h2:contains('SARKARIRESULT'), h2:contains('WWW.'), h2:contains('Sarkari Result')").remove();
        clone.find("h2:contains('Mobile Apps'), h2:contains('Android'), h2:contains('Apple'), h2:contains('Telegram')").remove();
        clone.find("h2:contains('WhatsApp'), h2:contains('Download Mobile'), h2:contains('Join Sarkari')").remove();
        return clone.html() || "";
      }
      const $ec = $("div.entry-content");
      if ($ec.length) return $ec.first().html() || "";
      return "";
    })();

    // Extract vacancy details from first table (sarkariexam.com format)
    const vacancyDetails: string[] = [];
    const divisionWiseVacancy: { division: string; posts: string }[] = [];
    if ($infoTable.length) {
      $infoTable.find("tr").each((_, tr) => {
        const $cells = $(tr).find("td");
        if ($cells.length === 0) return;
        const fullText = $cells.first().text().trim();
        const lines = fullText.split("\n").map((l) => l.trim()).filter(Boolean);
        const header = lines[0]?.toLowerCase() || "";
        if (header.includes("vacancy details") || header.includes("total post")) {
          const totalMatch = fullText.match(/Total\s*Post[:\s]*([\d,]+)/i);
          if (totalMatch) vacancyDetails.push(`Total Posts : ${totalMatch[1]}`);
          // Check for nested table with post name/count
          $cells.first().find("table").each((_, nt) => {
            $(nt).find("tr").each((j, r) => {
              const tds = $(r).find("td, th");
              if (tds.length >= 2) {
                const name = $(tds[0]).text().trim();
                const count = $(tds[1]).text().trim();
                if (name && !name.toLowerCase().includes("post name") && count && !count.toLowerCase().includes("no. of post") && !isNaN(Number(count.replace(/,/g, "")))) {
                  vacancyDetails.push(`${name} : ${count}`);
                }
              }
            });
          });
        }
        if (header.includes("division") || header.includes("zone")) {
          const isHeaderRow = lines[0]?.toLowerCase().includes("division") || lines[0]?.toLowerCase().includes("zone");
          const rows = isHeaderRow ? lines.slice(1) : lines;
          for (const line of rows) {
            const parts = line.split("\t").map(s => s.trim()).filter(Boolean);
            if (parts.length >= 2) {
              const divName = parts[0];
              const divCount = parts[parts.length - 1];
              if (divName && divCount && !divName.toLowerCase().includes("division") && !isNaN(Number(divCount.replace(/,/g, "")))) {
                divisionWiseVacancy.push({ division: divName, posts: divCount });
              }
            }
          }
          // Also check nested tables
          $cells.first().find("table").each((_, nt) => {
            $(nt).find("tr").each((j, r) => {
              const tds = $(r).find("td, th");
              if (tds.length >= 2) {
                const divName = $(tds[0]).text().trim();
                const divCount = $(tds[tds.length - 1]).text().trim();
                if (divName && !divName.toLowerCase().includes("division") && !divName.toLowerCase().includes("name") && divCount && !divCount.toLowerCase().includes("post") && !isNaN(Number(divCount.replace(/,/g, "")))) {
                  // Avoid duplicates
                  if (!divisionWiseVacancy.some(d => d.division === divName)) {
                    divisionWiseVacancy.push({ division: divName, posts: divCount });
                  }
                }
              }
            });
          });
        }
      });
    }
    // Also check stand-alone tables for division vacancy (table 2+)
    if (divisionWiseVacancy.length === 0) {
      $("table").slice(1).each((_, t) => {
        const rows: { division: string; posts: string }[] = [];
        $(t).find("tr").each((j, r) => {
          const tds = $(r).find("td, th");
          if (tds.length >= 2) {
            const hdr = $(tds[0]).text().trim().toLowerCase();
            const val = $(tds[tds.length - 1]).text().trim();
            if (j === 0 && (hdr.includes("division") || hdr.includes("zone") || hdr.includes("name"))) return;
            if (hdr && !hdr.includes("division") && !hdr.includes("name") && !hdr.includes("post") && val && !isNaN(Number(val.replace(/,/g, "")))) {
              rows.push({ division: $(tds[0]).text().trim(), posts: val });
            }
          }
        });
        if (rows.length >= 3) {
          divisionWiseVacancy.push(...rows);
        }
      });
    }

    const slug = (() => {
      const clean = url.split("?")[0].replace(/\/$/, "");
      const last = clean.split("/").pop()?.replace(/\.html$/, "") || "";
      if (last && !last.startsWith("?")) return last;
      return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").slice(0, 80);
    })();

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
      lastDate,
      isExpired: isExpired(lastDate),
      vacancyDetails: vacancyDetails.length > 0 ? vacancyDetails : undefined,
      divisionWiseVacancy: divisionWiseVacancy.length > 0 ? divisionWiseVacancy : undefined,
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
