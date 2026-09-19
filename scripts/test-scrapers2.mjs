import cloudscraper from "cloudscraper";
import * as cheerio from "cheerio";
import * as https from "https";
import * as http from "http";
const FETCH_TIMEOUT = 25000;
function fetchHtmlFallback(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const mod = u.protocol === "https:" ? https : http;
    const req = mod.get(url, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: FETCH_TIMEOUT }, (res) => {
      let data = ""; res.on("data", (c) => { data += c; }); res.on("end", () => resolve(data));
    });
    req.on("error", reject); req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
  });
}
async function fetchHtml(url) {
  try {
    const html = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Timeout")), FETCH_TIMEOUT);
      cloudscraper({ uri: url, method: "GET" }).then((h) => { clearTimeout(timer); resolve(h); }).catch((err) => { clearTimeout(timer); reject(err); });
    });
    if (html.length < 500) return fetchHtmlFallback(url);
    return html;
  } catch { return fetchHtmlFallback(url); }
}
const spam_nt = ["whatsapp","telegram","pm kisan","aadhaar","pan card","scholarship","sarkari yojna","yojana","ayushman","bijli","driving licence","voter card","birth certificate","passport","ration card","sahara"];
console.log("=== Testing naukaritime.com ===");
try {
  const html = await fetchHtml("https://naukaritime.com/");
  const $ = cheerio.load(html);
  const items = []; const seen = new Set();
  h2 a[href], h3 a[href], li a[href].each((_, a) => {
    const href = .attr("href") || ""; const text = .text().trim();
    if (!href || text.length < 20 || seen.has(href)) return;
    if (href.includes("#") || href.startsWith("javascript")) return;
    if (!href.includes("naukaritime.com")) return;
    if (spam_nt.some(s => text.toLowerCase().includes(s))) return;
    seen.add(href); items.push(text);
  });
  console.log("  Items:", items.length); items.slice(0,5).forEach(t => console.log("   -", t.slice(0,70)));
} catch(e) { console.log("  Error:", e.message); }
console.log("=== Testing freejobalert.com ===");
try {
  const html = await fetchHtml("https://www.freejobalert.com/");
  const $ = cheerio.load(html);
  const items = []; const seen = new Set();
  const spam = ["search-jobs","government-jobs","bank-jobs","login","new-updates","last-date-reminder","colleges.freejobalert","slate.freejobalert","user.freejobalert","sarkariresult.freejobalert","google.com","play.google.com"];
  ul.listcontentnu li a[href], table.qltpmnu td a[href].each((_, a) => {
    const href = .attr("href") || ""; const text = .text().trim();
    if (!href || text.length < 15 || seen.has(href)) return;
    if (href.includes("#") || href.startsWith("javascript")) return;
    if (spam.some(s => href.toLowerCase().includes(s) || text.toLowerCase().includes(s))) return;
    if (!href.includes("freejobalert.com")) return;
    seen.add(href); items.push(text);
  });
  console.log("  Items:", items.length); items.slice(0,5).forEach(t => console.log("   -", t.slice(0,70)));
} catch(e) { console.log("  Error:", e.message); }
console.log("DONE");
