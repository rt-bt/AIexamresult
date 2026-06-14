import { scrapePostDetail } from "./lib/scraper";

async function main() {
  const urls = [
    "https://www.sarkariexam.com/rrb-alp-cen-01-2026",
    "https://www.sarkariexam.com/ssc-cgl-2026",
    "https://www.sarkariexam.com/rajasthan-state-eligibility-test-set-2026",
    "https://www.sarkariexam.com/aiims-cre-group-b-c-2026",
  ];
  for (const url of urls) {
    const result = await scrapePostDetail(url);
    if (result) {
      console.log("✅", result.title);
      console.log("   slug:", result.slug);
      console.log("   dates:", result.importantDates.length);
      result.importantDates.slice(0,8).forEach(d => console.log("     -", d));
      console.log("   fee:", result.applicationFee.length);
      result.applicationFee.slice(0,8).forEach(f => console.log("     -", f));
      console.log("   links:", result.importantLinks.length);
      console.log("   lastDate:", result.lastDate, "expired:", result.isExpired);
    } else {
      console.log("❌", url);
    }
    console.log();
  }
}
main();
