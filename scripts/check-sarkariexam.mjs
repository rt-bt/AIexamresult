import cloudscraper from "cloudscraper";
import * as cheerio from "cheerio";

const html = await cloudscraper({ uri: "https://www.sarkariexam.com/", method: "GET" });
const $ = cheerio.load(html);

$(".below-block").each((i, block) => {
  const $b = $(block);
  const heading = $b.find("h4.wp-block-heading").text().trim() || $b.find("h4").text().trim();
  const links = $b.find("ul.wp-block-latest-posts__list li a");
  console.log("\n=== " + heading + " (" + links.length + " items) ===");
  links.each((j, link) => {
    const $l = $(link);
    console.log("  " + $l.text().trim().substring(0, 70));
    console.log("    -> " + ($l.attr("href") || "").substring(0, 80));
  });
});
