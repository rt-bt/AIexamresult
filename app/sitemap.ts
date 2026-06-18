import type { MetadataRoute } from "next";
import * as fs from "fs";
import * as path from "path";

const examSlugs = [
  "ssc", "ssc-cgl", "ssc-chsl", "ssc-mts", "ssc-gd", "ssc-je", "ssc-stenographer", "ssc-cpo",
  "upsc", "upsc-cse", "upsc-ifs", "upsc-nda", "upsc-cds", "upsc-epfo", "upsc-capf",
  "railway", "rrb-ntpc", "rrb-alp", "rrb-group-d", "rrb-je",
  "banking", "ibps-po", "ibps-clerk", "ibps-rrb", "sbi-po", "sbi-clerk", "rbi-grade-b",
  "teaching-exams", "ctet", "uptet", "reet", "bihar-teacher",
  "defence-exams", "indian-army", "indian-navy", "indian-airforce",
  "state-govt-jobs", "up-govt-jobs", "bihar-govt-jobs", "rajasthan-govt-jobs", "mp-govt-jobs", "maharashtra-govt-jobs",
  "board-exams", "cbse-result", "bseb-result", "up-board-result", "rbse-result",
];

const staticRoutes: { path: string; freq: "hourly" | "daily" | "weekly" | "monthly"; prio: number }[] = [
  { path: "", freq: "hourly", prio: 1.0 },
  { path: "/results", freq: "hourly", prio: 0.9 },
  { path: "/latest-jobs", freq: "hourly", prio: 0.9 },
  { path: "/admit-card", freq: "hourly", prio: 0.8 },
  { path: "/answer-key", freq: "hourly", prio: 0.8 },
  { path: "/admissions", freq: "daily", prio: 0.7 },
  { path: "/syllabus", freq: "daily", prio: 0.6 },
  { path: "/exam", freq: "daily", prio: 0.9 },
  { path: "/state", freq: "daily", prio: 0.7 },
  { path: "/state-map", freq: "weekly", prio: 0.6 },
  { path: "/search", freq: "daily", prio: 0.5 },
  { path: "/bookmarks", freq: "weekly", prio: 0.3 },
  { path: "/study-hub", freq: "daily", prio: 0.6 },
  { path: "/current-affairs", freq: "daily", prio: 0.7 },
  { path: "/exam-calendar", freq: "daily", prio: 0.7 },
  { path: "/exam-comparison", freq: "weekly", prio: 0.5 },
  { path: "/job-finder", freq: "daily", prio: 0.7 },
  { path: "/eligibility-checker", freq: "weekly", prio: 0.5 },
  { path: "/salary-calculator", freq: "weekly", prio: 0.5 },
  { path: "/vacancy-analyzer", freq: "daily", prio: 0.6 },
  { path: "/fee-calculator", freq: "weekly", prio: 0.5 },
  { path: "/form-guide", freq: "weekly", prio: 0.5 },
  { path: "/syllabus-tracker", freq: "weekly", prio: 0.5 },
  { path: "/mock-tests", freq: "weekly", prio: 0.5 },
  { path: "/question-papers", freq: "daily", prio: 0.7 },
  { path: "/objection-tracker", freq: "daily", prio: 0.6 },
  { path: "/counselling-guide", freq: "daily", prio: 0.6 },
  { path: "/document-checklist", freq: "weekly", prio: 0.5 },
  { path: "/difficulty-meter", freq: "weekly", prio: 0.5 },
  { path: "/result-predictor", freq: "weekly", prio: 0.5 },
  { path: "/iq-test", freq: "weekly", prio: 0.5 },
  { path: "/tools", freq: "daily", prio: 0.6 },
  { path: "/tools/age-calculator", freq: "weekly", prio: 0.4 },
  { path: "/tools/image-compressor", freq: "weekly", prio: 0.4 },
  { path: "/tools/pdf-compressor", freq: "weekly", prio: 0.4 },
  { path: "/about", freq: "monthly", prio: 0.4 },
  { path: "/contact", freq: "monthly", prio: 0.4 },
  { path: "/privacy-policy", freq: "monthly", prio: 0.3 },
  { path: "/disclaimer", freq: "monthly", prio: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aiexamresult.com";
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [];

  staticRoutes.forEach((r) => {
    routes.push({ url: `${base}${r.path}`, lastModified: now, changeFrequency: r.freq, priority: r.prio });
  });

  // Exam pages
  examSlugs.forEach((slug) => {
    routes.push({ url: `${base}/exam/${slug}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.8 });
  });

  // State pages
  const states = ["uttar-pradesh","bihar","rajasthan","maharashtra","madhya-pradesh","delhi","west-bengal","tamil-nadu","karnataka","gujarat","odisha","jharkhand","uttarakhand","haryana","punjab","andhra-pradesh","telangana","kerala","assam","chhattisgarh","himachal-pradesh","jammu-kashmir"];
  states.forEach((state) => {
    routes.push({ url: `${base}/state/${state}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.7 });
  });

  // Post pages — read actual published date from each post JSON for accurate lastModified
  try {
    const postsDir = path.join(process.cwd(), "data", "posts");
    if (fs.existsSync(postsDir)) {
      const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".json"));
      files.forEach((file) => {
        const slug = file.replace(".json", "");
        let lastMod = now;
        let cat = "";
        try {
          const post = JSON.parse(fs.readFileSync(path.join(postsDir, file), "utf-8")) as { publishedDate?: string; category?: string };
          if (post.publishedDate && post.publishedDate.length > 5) {
            const d = new Date(post.publishedDate);
            if (!isNaN(d.getTime())) lastMod = d;
          }
          cat = post.category ?? "";
        } catch {}
        const priority = cat === "results" ? 0.8 : ["latestJobs","admitCards","answerKeys"].includes(cat) ? 0.7 : 0.6;
        routes.push({ url: `${base}/post/${slug}`, lastModified: lastMod, changeFrequency: "daily" as const, priority });
      });
    }
  } catch {}

  return routes;
}
