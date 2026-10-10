import cloudscraper from "cloudscraper";
import * as cheerio from "cheerio";
import { writeFileSync, existsSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = resolve(__dirname, "..", "data", "radio-stations.json");

const BASE_URL = "https://onlineradiofm.in";

async function fetchHtml(url) {
  return await cloudscraper({
    uri: url,
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    },
  });
}

async function scrapePage(pageNum = 1) {
  const url = pageNum === 1 ? `${BASE_URL}/stations` : `${BASE_URL}/stations?page=${pageNum}`;
  console.log(`Fetching listing page: ${url}`);
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  const stations = [];
  $("ul.stations li").each((_, li) => {
    const $li = $(li);
    const link = $li.find("a.h4").first();
    const name = link.text().trim();
    const href = link.attr("href") || "";
    let img = link.find("img").attr("data-src") || link.find("img").attr("src") || "";
    if (img && !img.startsWith("http")) {
      img = `${BASE_URL}/${img.replace(/^\//, "")}`;
    }
    const rating = parseInt($li.find(".reiting span").text().trim(), 10) || 0;

    let country = "India";
    let genre = "";
    let frequency = "Live Radio";
    let language = "";

    $li.find(".name").each((__, n) => {
      const text = $(n).text().trim();
      if (text.startsWith("Country:")) country = text.replace("Country:", "").trim();
      else if (text.startsWith("Genre:")) genre = text.replace("Genre:", "").replace(/\.$/, "").trim();
      else if (text.startsWith("Frequency:")) frequency = text.replace("Frequency:", "").trim();
      else if (text.startsWith("Language:")) language = text.replace("Language:", "").replace(/\.$/, "").trim();
      else if (text.includes("Web Radio")) frequency = "Web Radio";
    });

    const slug = href.replace(/^stations\/?/, "").replace(/^\//, "") || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    if (name && href) {
      stations.push({
        id: slug,
        name,
        slug,
        href: href.startsWith("http") ? href : `${BASE_URL}/${href.replace(/^\//, "")}`,
        logo: img,
        rating,
        country,
        genre: genre || "Bollywood, Indian Music",
        frequency: frequency || "FM Radio",
        language: language || "Hindi",
        streamUrl: "",
      });
    }
  });

  return stations;
}

async function fetchStreamUrl(station) {
  try {
    const html = await fetchHtml(station.href);
    const streamMatch = html.match(/var\s+FILE\s*=\s*["']([^"']+)["']/i);
    if (streamMatch && streamMatch[1]) {
      return streamMatch[1].trim();
    }
    // Check fallback audio src
    const audioMatch = html.match(/<audio[^>]+src=["']([^"']+)["']/i);
    if (audioMatch && audioMatch[1]) {
      return audioMatch[1].trim();
    }
  } catch (err) {
    console.warn(`  ⚠️ Failed fetching stream for ${station.name}:`, err.message);
  }
  return "";
}

async function main() {
  console.log("Starting Radio Stations Scraper from onlineradiofm.in...");
  
  // Page 1 and Page 2
  const p1 = await scrapePage(1);
  const p2 = await scrapePage(2);
  const allListings = [...p1, ...p2];

  // Dedup by slug
  const map = new Map();
  for (const s of allListings) {
    if (!map.has(s.slug)) {
      map.set(s.slug, s);
    }
  }
  const stations = Array.from(map.values());
  console.log(`Total unique stations discovered: ${stations.length}`);

  // Fetch streams with concurrency
  const CONCURRENCY = 6;
  const results = [];
  for (let i = 0; i < stations.length; i += CONCURRENCY) {
    const batch = stations.slice(i, i + CONCURRENCY);
    console.log(`Fetching streams batch ${i + 1} - ${Math.min(i + CONCURRENCY, stations.length)} / ${stations.length}...`);
    const batchPromises = batch.map(async (st) => {
      const stream = await fetchStreamUrl(st);
      return {
        ...st,
        streamUrl: stream,
      };
    });
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  // Filter out any with completely missing streams if needed, or keep with fallback
  const validStreams = results.filter(s => s.streamUrl && s.streamUrl.startsWith("http"));
  console.log(`Stations with active live streams: ${validStreams.length} / ${results.length}`);

  // Sort by rating or popularity
  results.sort((a, b) => (a.rating || 999) - (b.rating || 999));

  writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), "utf8");
  console.log(`✅ Saved ${results.length} radio stations to: ${OUTPUT_FILE}`);
}

main().catch(console.error);
