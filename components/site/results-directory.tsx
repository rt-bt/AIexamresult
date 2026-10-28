"use client";

import { useState, useMemo, useId } from "react";
import Link from "next/link";
import {
  Search,
  Trophy,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Flame,
  LayoutGrid,
  List,
  Building2,
  CheckCircle2,
  X,
  GraduationCap,
  Shield,
  Train,
  Landmark,
  FileText,
  MapPin,
  ShieldCheck,
  ChevronDown,
  RotateCcw
} from "lucide-react";
import type { PostCard } from "@/lib/data";

const RESULT_SECTORS = [
  { id: "all", label: "All Results", icon: Trophy },
  { id: "new", label: "Recently Declared", icon: Flame, badgeColor: "bg-rose-500" },
  { id: "ssc", label: "SSC & Central", icon: Building2 },
  { id: "railway", label: "Railway (RRB)", icon: Train },
  { id: "psc", label: "UPSC & State PSC", icon: Landmark },
  { id: "police", label: "Police & Defence", icon: Shield },
  { id: "banking", label: "Banking & PSU", icon: Building2 },
  { id: "teaching", label: "Teaching & Boards", icon: GraduationCap },
  { id: "scorecard", label: "Marks & Scorecards", icon: FileText },
] as const;

type ResultSectorId = (typeof RESULT_SECTORS)[number]["id"];

function matchesResultSector(title: string, sector: ResultSectorId, dateStr?: string): boolean {
  const t = title.toLowerCase();
  switch (sector) {
    case "new":
      if (/out|declared|revised|final marks|score card|released/i.test(t)) return true;
      if (!dateStr) return false;
      try {
        const d = Date.parse(dateStr);
        if (isNaN(d)) return false;
        const diffDays = (Date.now() - d) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 7;
      } catch {
        return false;
      }
    case "ssc":
      return /ssc|cgl|chsl|mts|cpo|gd constable|selection post|junior engineer|phase/i.test(t);
    case "railway":
      return /rrb|railway|ntpc|alp|technician|section controller|group d/i.test(t);
    case "psc":
      return /upsc|bpsc|uppsc|mppsc|hpsc|rpsc|ukpsc|jssc|gpsc|opsc|wbpsc|psc/i.test(t);
    case "police":
      return /police|home guard|cisf|bsf|crpf|itbp|army|navy|air force|coast guard|constable|sub inspector|si|daroga/i.test(t);
    case "banking":
      return /bank|ibps|sbi|rbi|nabard|bob|baroda|uco|pnb|canara|insurance|nicl|lic|uiic/i.test(t);
    case "teaching":
      return /teacher|tre|prt|tgt|pgt|professor|stet|tet|ctet|dsssb|ugc net|school|board|matric|inter/i.test(t);
    case "scorecard":
      return /marks|score|scorecard|cut-off|cutoff|merit list|reserve list/i.test(t);
    case "all":
    default:
      return true;
  }
}

function getResultTag(title: string): { label: string; color: string } {
  const t = title.toLowerCase();
  if (t.includes("revised")) {
    return { label: "Revised Result", color: "bg-purple-50 text-purple-700 border-purple-200" };
  }
  if (t.includes("final marks") || t.includes("marks")) {
    return { label: "Final Marks", color: "bg-blue-50 text-blue-700 border-blue-200" };
  }
  if (t.includes("score card") || t.includes("scorecard")) {
    return { label: "Scorecard Out", color: "bg-indigo-50 text-indigo-700 border-indigo-200" };
  }
  if (t.includes("merit list")) {
    return { label: "Merit List PDF", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  }
  if (t.includes("skill test")) {
    return { label: "Skill Test Result", color: "bg-amber-50 text-amber-700 border-amber-200" };
  }
  if (t.includes("out") || t.includes("declared")) {
    return { label: "Declared", color: "bg-rose-50 text-rose-700 border-rose-200" };
  }
  return { label: "Result Declared", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
}

function isRecentDate(dateStr?: string): boolean {
  if (!dateStr) return false;
  try {
    const d = Date.parse(dateStr);
    if (isNaN(d)) return false;
    const diffDays = (Date.now() - d) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 4;
  } catch {
    return false;
  }
}

export function ResultsDirectory({ items }: { items: PostCard[] }) {
  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState<ResultSectorId>("all");
  const [selectedState, setSelectedState] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "az" | "oldest">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [visibleCount, setVisibleCount] = useState(24);
  const searchInputId = useId();

  // Extract unique states for dropdown
  const states = useMemo(() => {
    const stateSet = new Set<string>();
    items.forEach((item) => {
      if (item.state && item.state.trim() !== "") {
        stateSet.add(item.state.trim());
      }
    });
    return ["All", "India", ...Array.from(stateSet).filter((s) => s !== "India").sort()];
  }, [items]);

  // Sector counts
  const sectorCounts = useMemo(() => {
    const counts: Record<string, number> = { all: items.length };
    RESULT_SECTORS.forEach((sec) => {
      if (sec.id !== "all") {
        counts[sec.id] = items.filter((item) => matchesResultSector(item.title, sec.id, item.date)).length;
      }
    });
    return counts;
  }, [items]);

  // Filtered & sorted results
  const filteredResults = useMemo(() => {
    let result = items;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q) ||
          (item.state && item.state.toLowerCase().includes(q))
      );
    }

    // Sector filter
    if (selectedSector !== "all") {
      result = result.filter((item) => matchesResultSector(item.title, selectedSector, item.date));
    }

    // State filter
    if (selectedState !== "All") {
      result = result.filter((item) => item.state === selectedState);
    }

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortOrder === "az") {
        return a.title.localeCompare(b.title);
      }
      const dateA = a.date ? Date.parse(a.date) : 0;
      const dateB = b.date ? Date.parse(b.date) : 0;
      if (sortOrder === "oldest") {
        return (isNaN(dateA) ? 0 : dateA) - (isNaN(dateB) ? 0 : dateB);
      }
      // default newest first
      return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
    });

    return result;
  }, [items, search, selectedSector, selectedState, sortOrder]);

  const displayedResults = useMemo(() => {
    return filteredResults.slice(0, visibleCount);
  }, [filteredResults, visibleCount]);

  const resetAllFilters = () => {
    setSearch("");
    setSelectedSector("all");
    setSelectedState("All");
    setSortOrder("newest");
    setVisibleCount(24);
  };

  return (
    <div className="container-page py-8">
      {/* Search and Filter Controls Panel */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm">
        {/* Top Control Bar: Search Input, State Dropdown, Sort, View Mode */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <label htmlFor={searchInputId} className="sr-only">
              Search exam results by name, board, or state
            </label>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              id={searchInputId}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(24);
              }}
              placeholder="Search exam results (e.g. SSC GD, BPSC ASO, UP Police, Railway)..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-11 pr-10 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#FF5B3E] focus:bg-white focus:ring-4 focus:ring-[#FF5B3E]/10"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filters & View Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* State Filter */}
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setVisibleCount(24);
                }}
                className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-8 text-xs sm:text-sm font-semibold text-slate-700 outline-none hover:border-slate-300 focus:border-[#FF5B3E] focus:ring-2 focus:ring-[#FF5B3E]/10 cursor-pointer"
                aria-label="Filter by State"
              >
                {states.map((st) => (
                  <option key={st} value={st}>
                    {st === "All" ? "All Locations" : st}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Sort Order */}
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "newest" | "az" | "oldest")}
                className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-8 text-xs sm:text-sm font-semibold text-slate-700 outline-none hover:border-slate-300 focus:border-[#FF5B3E] focus:ring-2 focus:ring-[#FF5B3E]/10 cursor-pointer"
                aria-label="Sort Results"
              >
                <option value="newest">Newest First</option>
                <option value="az">Title (A to Z)</option>
                <option value="oldest">Oldest First</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Grid / Table View Switcher */}
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100/70 p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                  viewMode === "grid"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                aria-label="Grid View"
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                  viewMode === "table"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                aria-label="Table View"
                title="Table View"
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sector Category Filter Pills */}
        <div className="mt-5 pt-5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {RESULT_SECTORS.map((sec) => {
            const Icon = sec.icon;
            const count = sectorCounts[sec.id] || 0;
            const isSelected = selectedSector === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  setSelectedSector(sec.id);
                  setVisibleCount(24);
                }}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? "bg-[#111111] text-[#FFD84D] shadow-md shadow-black/10 scale-[1.02]"
                    : "bg-slate-50 border border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isSelected ? "text-[#FFD84D]" : "text-slate-500"}`} />
                <span>{sec.label}</span>
                <span
                  className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isSelected ? "bg-white/20 text-[#FFD84D]" : "bg-slate-200/80 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Search Context & Popular Tags */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">
              Showing {displayedResults.length} of {filteredResults.length} results
            </span>
            {(search || selectedSector !== "all" || selectedState !== "All") && (
              <button
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1 font-semibold text-[#FF5B3E] hover:underline ml-2"
              >
                <RotateCcw className="h-3 w-3" /> Reset Filters
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400">Trending:</span>
            {["SSC GD Revised", "BPSC ASO", "UPSSSC Steno", "ISRO Assistant", "UP Home Guard"].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setSearch(chip);
                  setVisibleCount(24);
                }}
                className="rounded-md bg-slate-100 hover:bg-[#FFD84D]/30 hover:text-slate-900 px-2 py-0.5 text-[11px] font-medium text-slate-600 transition"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: Results Grid or Table View */}
      {filteredResults.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-4">
            <Search className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No exam results match your query</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
            Try checking for spelling variations or clear active board and location filters to see all available results.
          </p>
          <button
            onClick={resetAllFilters}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#111111] px-5 py-2.5 text-sm font-semibold text-[#FFD84D] transition hover:bg-black"
          >
            <RotateCcw className="h-4 w-4" /> Reset All Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid Cards View */
        <div className="mt-8 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedResults.map((item) => {
            const tag = getResultTag(item.title);
            const isFresh = isRecentDate(item.date);
            const postHref = item.slug ? `/post/${item.slug}` : "/results";

            return (
              <div
                key={item.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#FF5B3E]/40 hover:shadow-lg"
              >
                <div>
                  {/* Card Header Badges */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-[11px] font-bold ${tag.color}`}
                    >
                      {tag.label}
                    </span>

                    {isFresh && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-black text-rose-600">
                        <Sparkles className="h-2.5 w-2.5 text-rose-500" /> NEW
                      </span>
                    )}
                  </div>

                  {/* Title Link */}
                  <h3 className="text-base sm:text-lg font-bold leading-snug text-slate-900 group-hover:text-[#FF5B3E] transition">
                    <Link href={postHref} className="focus:outline-none">
                      {item.title}
                    </Link>
                  </h3>

                  {/* Excerpt */}
                  {item.excerpt && (
                    <p className="mt-2.5 line-clamp-2 text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
                      {item.excerpt}
                    </p>
                  )}
                </div>

                {/* Card Meta & CTA Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3.5">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {item.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {item.state || "India"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Verified
                    </span>
                  </div>

                  <Link
                    href={postHref}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 group-hover:bg-[#FF5B3E] px-4 py-2.5 text-xs sm:text-sm font-bold text-white transition-all shadow-sm"
                  >
                    <span>Check Result</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table / List View */
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase text-slate-600">
                <tr>
                  <th scope="col" className="px-5 py-4">
                    Announcement Date
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Exam / Result Title
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Location
                  </th>
                  <th scope="col" className="px-5 py-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedResults.map((item) => {
                  const tag = getResultTag(item.title);
                  const postHref = item.slug ? `/post/${item.slug}` : "/results";
                  const isFresh = isRecentDate(item.date);

                  return (
                    <tr key={item.title} className="hover:bg-slate-50/80 transition-colors">
                      <td className="whitespace-nowrap px-5 py-4 text-xs font-semibold text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {item.date}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={postHref}
                          className="font-bold text-slate-900 hover:text-[#FF5B3E] transition line-clamp-2"
                        >
                          {item.title}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${tag.color}`}
                          >
                            {tag.label}
                          </span>
                          {isFresh && (
                            <span className="rounded bg-rose-50 px-1 py-0.5 text-[9px] font-bold text-rose-600">
                              NEW
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-xs font-medium text-slate-500">
                        {item.state || "India"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <Link
                          href={postHref}
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#FF5B3E]"
                        >
                          <span>Check</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredResults.length && (
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setVisibleCount((prev) => Math.min(prev + 24, filteredResults.length))}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#111111] px-6 py-3.5 text-sm font-bold text-[#FFD84D] shadow-sm transition hover:bg-black"
          >
            <span>Load More Results (+24)</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            onClick={() => setVisibleCount(filteredResults.length)}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Show All ({filteredResults.length})
          </button>
        </div>
      )}
    </div>
  );
}
