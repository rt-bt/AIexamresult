import type { MetadataRoute } from "next";
import * as fs from "fs";
import * as path from "path";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aiexamresult.com";
  
  const staticRoutes = [
    { path: "", priority: 1, freq: "hourly" as const },
    { path: "/results", priority: 0.9, freq: "hourly" as const },
    { path: "/latest-jobs", priority: 0.9, freq: "hourly" as const },
    { path: "/admit-card", priority: 0.8, freq: "daily" as const },
    { path: "/answer-key", priority: 0.8, freq: "daily" as const },
    { path: "/admissions", priority: 0.7, freq: "daily" as const },
    { path: "/syllabus", priority: 0.6, freq: "daily" as const },
    { path: "/search", priority: 0.5, freq: "daily" as const },
    { path: "/bookmarks", priority: 0.3, freq: "weekly" as const },
    { path: "/about", priority: 0.4, freq: "monthly" as const },
    { path: "/contact", priority: 0.4, freq: "monthly" as const },
    { path: "/privacy-policy", priority: 0.3, freq: "monthly" as const },
    { path: "/disclaimer", priority: 0.3, freq: "monthly" as const },
  ];

  const now = new Date();

  const routes = staticRoutes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority
  }));

  // Add state pages
  const states = ["up", "bihar", "rajasthan", "maharashtra", "mp", "delhi", "west-bengal", "tamil-nadu", "karnataka", "gujarat", "odisha", "jharkhand", "uttarakhand", "haryana", "punjab", "andhra-pradesh", "telangana", "kerala", "assam", "chhattisgarh", "himachal-pradesh", "jammu-kashmir"];
  for (const state of states) {
    routes.push({ url: `${base}/state/${state}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.7 });
  }

  // Add post pages
  try {
    const postsDir = path.join(process.cwd(), "data", "posts");
    if (fs.existsSync(postsDir)) {
      const slugs = fs.readdirSync(postsDir).filter((f) => f.endsWith(".json")).map((f) => f.replace(".json", ""));
      for (const slug of slugs) {
        routes.push({ url: `${base}/post/${slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 });
      }
    }
  } catch {}

  return routes;
}
