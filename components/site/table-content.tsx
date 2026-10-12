"use client";

import { useState, useMemo, useId } from "react";
import Link from "next/link";
import {
  ExternalLink,
  CalendarDays,
  Sparkles,
  Search,
  LayoutGrid,
  List,
  ChevronDown,
  ArrowUpRight,
  X
} from "lucide-react";
import type { PostCard } from "@/lib/data";
import { getCategoryCta } from "@/lib/categories";

const now = Date.now();

function isWithinDays(date: string, days: number): boolean {
  try {
    const d = new Date(date);
    return (now - d.getTime()) <= days * 24 * 60 * 60 * 1000 && d.getTime() <= now;
  } catch {
    return false;
  }
}

function getHeaderActionLabel(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("result")) return "Check Result";
  if (t.includes("admit card") || t.includes("hall ticket")) return "Download Admit Card";
  if (t.includes("answer key")) return "View Answer Key";
  if (t.includes("syllabus")) return "View Syllabus";
  if (t.includes("scholarship")) return "Check Scholarship";
  if (t.includes("admission")) return "Check Admission";
  if (t.includes("job") || t.includes("vacancy")) return "Apply Online";
  return "Official Link";
}

export function TableContent({ title, items }: { title: string; items: PostCard[] }) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [visibleCount, setVisibleCount] = useState(30);
  const searchInputId = useId();

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase().trim();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        (item.state && item.state.toLowerCase().includes(q))
    );
  }, [items, search]);

  const displayedItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  if (items.length === 0) return null;
  const headerAction = getHeaderActionLabel(title);
  const hasMore = visibleCount < filteredItems.length;

  return (
    <section className="py-8 font-sans">
      <div className="container-page">
        {/* Controls Bar: Search & View Toggle */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id={searchInputId}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(30);
              }}
              placeholder={`Search ${items.length} updates in this section...`}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-9 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#FF5B3E] focus:bg-white focus:ring-2 focus:ring-[#FF5B3E]/10"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500">
            <span className="font-semibold">
              {filteredItems.length} {filteredItems.length === 1 ? "Update" : "Updates"}
            </span>

            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-0.5">
              <button
                onClick={() => setViewMode("cards")}
                className={`rounded-lg p-1.5 transition ${
                  viewMode === "cards" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
                title="Card View"
                aria-label="Card view"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`rounded-lg p-1.5 transition ${
                  viewMode === "table" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
                title="Table View"
                aria-label="Table view"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Zero Results State */}
        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-12 text-center text-sm text-slate-500">
            No updates found matching &ldquo;{search}&rdquo;. Try another search keyword.
          </div>
        ) : viewMode === "cards" ? (
          /* MODERN CARDS VIEW */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayedItems.map((item) => {
              const cta = getCategoryCta(item.category, item.title, item.isExpired);
              const isNew = isWithinDays(item.date, 4);

              return (
                <div
                  key={item.slug || item.title}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#FF5B3E]/40 hover:shadow-xl hover:shadow-black/5"
                >
                  <div>
                    <div className="mb-2.5 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                        {item.state || "All India"}
                      </span>
                      {isNew && (
                        <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[#FF5B3E]/10 px-2 py-0.5 text-[10px] font-extrabold text-[#FF5B3E] ring-1 ring-[#FF5B3E]/30">
                          <Sparkles className="h-2.5 w-2.5" /> NEW
                        </span>
                      )}
                    </div>

                    <Link href={item.slug ? `/post/${item.slug}` : "#"}>
                      <h3 className="text-sm sm:text-[15px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#FF5B3E] font-heading line-clamp-2">
                        {item.title}
                      </h3>
                    </Link>

                    <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                      <CalendarDays className="h-3 w-3" />
                      {item.date || "2026"}
                    </span>

                    <Link
                      href={item.slug ? `/post/${item.slug}` : "#"}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFD84D] px-3.5 py-1.5 text-xs font-bold text-[#111111] transition hover:bg-[#FF5B3E] hover:text-white font-heading shadow-xs"
                    >
                      <span>{cta.actionText || headerAction}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* MODERN DATA TABLE VIEW */
          <div className="overflow-x-auto rounded-3xl border border-slate-200/90 bg-white shadow-xs">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
                    Notification Name
                  </th>
                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
                    Date
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
                    {headerAction}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedItems.map((item) => {
                  const cta = getCategoryCta(item.category, item.title, item.isExpired);
                  const isNew = isWithinDays(item.date, 4);

                  return (
                    <tr key={item.slug || item.title} className="transition hover:bg-slate-50/60">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={item.slug ? `/post/${item.slug}` : "#"}
                            className="font-bold text-slate-900 transition hover:text-[#FF5B3E] font-heading line-clamp-1"
                          >
                            {item.title}
                          </Link>
                          {isNew && (
                            <span className="inline-flex shrink-0 items-center gap-0.5 rounded bg-[#FF5B3E]/10 px-1.5 py-0.2 text-[10px] font-bold text-[#FF5B3E]">
                              <Sparkles className="h-2.5 w-2.5" /> NEW
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 shrink-0" /> {item.date || "2026"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <Link
                          href={item.slug ? `/post/${item.slug}` : "#"}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFD84D] px-3.5 py-1.5 text-xs font-bold text-[#111111] transition hover:bg-[#FF5B3E] hover:text-white font-heading"
                        >
                          {cta.actionText || headerAction} <ExternalLink className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Load More Pagination */}
        {hasMore && (
          <div className="mt-8 flex flex-col items-center justify-center gap-2">
            <button
              onClick={() => setVisibleCount((prev) => prev + 30)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-2.5 text-xs font-bold text-slate-900 shadow-xs transition hover:border-[#FF5B3E] hover:text-[#FF5B3E] active:scale-95 font-heading"
            >
              <span>Load More ({filteredItems.length - visibleCount} remaining)</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <p className="text-xs text-slate-400">
              Showing {displayedItems.length} of {filteredItems.length} updates
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
