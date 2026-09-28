"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Globe, MapPin, TrendingUp, Database, Clock, Sparkles } from "lucide-react";

type ContentStats = {
  totalPosts: number; postFiles: number; lastWeek: number;
  categories: Record<string, number>; fetchedAt: string | null; categoryCount: number;
};

type AnalyticsStats = {
  totalViews: number; uniquePaths: number; viewsToday: number; viewsThisWeek: number;
  topPaths: { path: string; count: number }[];
  viewsByCountry: Record<string, number>;
  viewsByRegion: Record<string, number>;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsStats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats).catch(() => {});
    fetch("/api/analytics/stats").then((r) => r.json()).then(setAnalytics).catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-4">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] bg-ink p-6 text-white">
          <p className="text-sm font-black uppercase tracking-wide text-[#EA580C]">Admin Command Center</p>
          <h1 className="mt-2 text-4xl font-black">Publishing dashboard</h1>
          {stats?.fetchedAt && (
            <p className="mt-2 text-xs text-slate-400">Last synced: {new Date(stats.fetchedAt).toLocaleString("en-IN")}</p>
          )}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {([["Total Posts", stats?.totalPosts ?? "—", Database],
            ["Views Today", analytics?.viewsToday ?? "—", Eye],
            ["Views This Week", analytics?.viewsThisWeek ?? "—", TrendingUp],
            ["Total Views", analytics?.totalViews ?? "—", Globe]] as const).map(([label, value, Icon]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="h-5 w-5 text-[#0D9488]" />
              <p className="mt-4 text-sm font-bold text-slate-500">{label}</p>
              <p className="mt-1 text-3xl font-black text-ink">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-black">Top Pages</h2>
            <div className="mt-4 space-y-2">
              {analytics?.topPaths.map((p) => (
                <div key={p.path} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                  <span className="truncate font-semibold text-slate-700">{p.path}</span>
                  <span className="ml-2 shrink-0 rounded-full bg-[#0D9488]/10 px-2 py-0.5 text-xs font-bold text-[#0D9488]">{p.count}</span>
                </div>
              )) || <p className="text-sm text-slate-400">No data yet</p>}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="flex items-center gap-2 text-lg font-black"><Globe className="h-4 w-4" /> By Country</h2>
            <div className="mt-4 space-y-2">
              {analytics && Object.keys(analytics.viewsByCountry).length > 0 ? (
                Object.entries(analytics.viewsByCountry).map(([c, n]) => (
                  <div key={c} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                    <span className="font-semibold text-slate-700">{c}</span>
                    <span className="rounded-full bg-[#0D9488]/10 px-2 py-0.5 text-xs font-bold text-[#0D9488]">{n}</span>
                  </div>
                ))
              ) : <p className="text-sm text-slate-400">No country data yet. Visit the site to populate.</p>}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="flex items-center gap-2 text-lg font-black"><MapPin className="h-4 w-4" /> By State/Region</h2>
            <div className="mt-4 space-y-2">
              {analytics && Object.keys(analytics.viewsByRegion).length > 0 ? (
                Object.entries(analytics.viewsByRegion).map(([r, n]) => (
                  <div key={r} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                    <span className="font-semibold text-slate-700">{r}</span>
                    <span className="rounded-full bg-[#0D9488]/10 px-2 py-0.5 text-xs font-bold text-[#0D9488]">{n}</span>
                  </div>
                ))
              ) : <p className="text-sm text-slate-400">No region data yet. Visit the site to populate.</p>}
            </div>
          </section>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_380px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-black">Category Breakdown</h2>
            <div className="mt-4 space-y-3">
              {stats ? (
                Object.entries(stats.categories).map(([cat, count]) => (
                  <div key={cat} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                    <span className="font-bold text-slate-700">{cat}</span>
                    <span className="rounded-full bg-[#0D9488]/10 px-3 py-1 text-sm font-bold text-[#0D9488]">{count} posts</span>
                  </div>
                ))
              ) : <p className="text-sm text-slate-400">Loading...</p>}
            </div>
          </section>
          <section className="rounded-2xl bg-[#0D9488] p-5 text-white">
            <Sparkles className="h-8 w-8" />
            <h2 className="mt-4 text-2xl font-black">AI generation health</h2>
            <p className="mt-2 text-[#5EEAD4]">OpenAI content generation, humanizing, SEO metadata ready.</p>
            <Link href="/admin/ai-generator" className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-[#0D9488]">Open AI Generator</Link>
          </section>
        </div>
      </div>
    </main>
  );
}
