import * as fs from "fs";
import * as path from "path";

const IS_VERCEL = process.env.VERCEL === "1";
const DATA_DIR = IS_VERCEL
  ? path.join("/tmp", "data", "analytics")
  : path.join(process.cwd(), "data", "analytics");
const LOG_FILE = path.join(DATA_DIR, "visits.jsonl");

function ensureDir() { try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch {} }

export type VisitLog = {
  path: string;
  timestamp: string;
  ip: string;
  country: string;
  region: string;
  city: string;
  referrer: string;
};

export function logVisit(visit: VisitLog) {
  ensureDir();
  try { fs.appendFileSync(LOG_FILE, JSON.stringify(visit) + "\n", "utf-8"); } catch {}
}

function computeStats(lines: VisitLog[]) {
  const totalViews = lines.length;
  const uniquePaths = new Set(lines.map((l) => l.path)).size;

  const viewsByPath: Record<string, number> = {};
  for (const l of lines) viewsByPath[l.path] = (viewsByPath[l.path] || 0) + 1;
  const topPaths = Object.entries(viewsByPath)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));

  const viewsByCountry: Record<string, number> = {};
  const viewsByRegion: Record<string, number> = {};
  for (const l of lines) {
    if (l.country) viewsByCountry[l.country] = (viewsByCountry[l.country] || 0) + 1;
    if (l.region && l.country) {
      const key = `${l.country} - ${l.region}`;
      viewsByRegion[key] = (viewsByRegion[key] || 0) + 1;
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const viewsToday = lines.filter((l) => l.timestamp.slice(0, 10) === today).length;
  const thisWeek = lines.filter((l) => {
    const diff = Date.now() - new Date(l.timestamp).getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  }).length;

  return {
    totalViews,
    uniquePaths,
    viewsToday,
    viewsThisWeek: thisWeek,
    topPaths,
    viewsByCountry: Object.fromEntries(
      Object.entries(viewsByCountry).sort((a, b) => b[1] - a[1])
    ),
    viewsByRegion: Object.fromEntries(
      Object.entries(viewsByRegion).sort((a, b) => b[1] - a[1])
    ),
  };
}

export function getStats() {
  ensureDir();
  try {
    const raw = fs.readFileSync(LOG_FILE, "utf-8");
    const lines: VisitLog[] = raw.trim().split("\n").filter(Boolean).map(l => JSON.parse(l));
    return computeStats(lines);
  } catch {
    return {
      totalViews: 0, uniquePaths: 0, viewsToday: 0, viewsThisWeek: 0,
      topPaths: [], viewsByCountry: {}, viewsByRegion: {},
    };
  }
}
