"use client";

import { useState, useMemo, useId } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Briefcase,
  Calendar,
  Clock,
  Sparkles,
  ArrowUpRight,
  Flame,
  LayoutGrid,
  List,
  ChevronDown,
  Building2,
  CheckCircle2,
  X,
  ExternalLink,
  GraduationCap,
  Shield,
  Train,
  Scale
} from "lucide-react";
import type { PostCard } from "@/lib/data";
import { getCategoryCta } from "@/lib/categories";

const SECTORS = [
  { id: "all", label: "All Jobs", icon: Briefcase },
  { id: "closing", label: "Closing Soon", icon: Flame, badgeColor: "bg-rose-500" },
  { id: "railway", label: "Railway", icon: Train },
  { id: "police", label: "Police & Defence", icon: Shield },
  { id: "ssc", label: "SSC & Central", icon: Building2 },
  { id: "bank", label: "Banking & PSU", icon: Building2 },
  { id: "teaching", label: "Teaching", icon: GraduationCap },
  { id: "10th12th", label: "10th / 12th Pass", icon: CheckCircle2 },
  { id: "law", label: "Courts & Legal", icon: Scale },
] as const;

type SectorId = (typeof SECTORS)[number]["id"];

function extractVacancyBadge(title: string): string | null {
  const m = title.match(/\((\d[\d,]*\s*posts?)\)/i) || title.match(/\b(\d[\d,]*\+?\s*posts?)\b/i);
  return m ? m[1].replace(/\bposts?\b/i, "Posts").trim() : null;
}

function matchesSector(title: string, sector: SectorId): boolean {
  const t = title.toLowerCase();
  switch (sector) {
    case "closing":
      return /last date|extend|closing/i.test(t);
    case "railway":
      return /rrb|railway/i.test(t);
    case "police":
      return /police|army|navy|air force|coast guard|rifles|constable|sub inspector|\bsi\b|cpo|capf|nda|cds/i.test(t);
    case "ssc":
      return /ssc|upsc/i.test(t);
    case "bank":
      return /bank|ibps|sbi|rbi|nabard/i.test(t);
    case "teaching":
      return /teacher|tre|prt|tgt|pgt|professor|bed|deled/i.test(t);
    case "10th12th":
      return /10th|12th|10\+2|matric|safai karamchari|tradesman|chowkidar|peon/i.test(t);
    case "law":
      return /court|judiciary|judicial|spa & pa/i.test(t);
    case "all":
    default:
      return true;
  }
}

function isRecent(dateStr?: string): boolean {
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

export function JobsDirectory({ items }: { items: PostCard[] }) {
  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState<SectorId>("all");
  const [selectedState, setSelectedState] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "closing" | "az">("newest");
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
    SECTORS.forEach((sec) => {
      if (sec.id !== "all") {
        counts[sec.id] = items.filter((item) => matchesSector(item.title, sec.id)).length;
      }
    });
    return counts;
  }, [items]);

  // Filtered & sorted jobs
  const filteredJobs = useMemo(() => {
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
      result = result.filter((item) => matchesSector(item.title, selectedSector));
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
      if (sortOrder === "closing") {
        const aClosing = /last date|extend/i.test(a.title) ? 1 : 0;
        const bClosing = /last date|extend/i.test(b.title) ? 1 : 0;
        if (aClosing !== bClosing) return bClosing - aClosing;
      }
      // default newest first
      const dateA = a.date ? Date.parse(a.date) : 0;
      const dateB = b.date ? Date.parse(b.date) : 0;
      return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
    });

    return result;
  }, [items, search, selectedSector, selectedState, sortOrder]);

  const displayedJobs = useMemo(() => {
    return filteredJobs.slice(0, visibleCount);
  }, [filteredJobs, visibleCount]);

  const hasMore = visibleCount < filteredJobs.length;

  return (
    <section className="container-page py-8">
      {/* Search and Main Controls */}
      <div className="mb-6 rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm">
        {/* Search input with keyboard hint */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            id={searchInputId}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(24);
            }}
            placeholder="Search 480+ vacancies by exam name, board, qualification or posts (e.g. SSC, Railway, Police, 10+2, 3548 Posts)..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3.5 pl-12 pr-10 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#FF5B3E] focus:bg-white focus:ring-4 focus:ring-[#FF5B3E]/10"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sector Filter Chips */}
        <div className="mb-4 flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SECTORS.map((sector) => {
            const Icon = sector.icon;
            const count = sectorCounts[sector.id] || 0;
            const isSelected = selectedSector === sector.id;

            return (
              <button
                key={sector.id}
                onClick={() => {
                  setSelectedSector(sector.id);
                  setVisibleCount(24);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 whitespace-nowrap active:scale-95 ${
                  isSelected
                    ? "bg-[#111111] text-[#FFD84D] shadow-sm ring-1 ring-[#111111]"
                    : "bg-slate-100/90 text-slate-700 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-200 border border-transparent"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isSelected ? "text-[#FFD84D]" : "text-slate-500"}`} />
                <span>{sector.label}</span>
                <span
                  className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isSelected ? "bg-[#FFD84D] text-[#111111]" : "bg-slate-200/80 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sub-Controls: State Filter, Sort & View Mode */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* State selector */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500">State:</span>
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setVisibleCount(24);
                  }}
                  className="appearance-none rounded-xl border border-slate-200 bg-white py-1.5 pl-3 pr-7 text-xs font-semibold text-slate-700 outline-none hover:border-slate-300 focus:border-[#FF5B3E]"
                >
                  {states.map((st) => (
                    <option key={st} value={st}>
                      {st === "All" ? "All India / All States" : st}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Sort selector */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500">Sort:</span>
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as "newest" | "closing" | "az")}
                  className="appearance-none rounded-xl border border-slate-200 bg-white py-1.5 pl-3 pr-7 text-xs font-semibold text-slate-700 outline-none hover:border-slate-300 focus:border-[#FF5B3E]"
                >
                  <option value="newest">Newest First</option>
                  <option value="closing">Closing Soon</option>
                  <option value="az">Alphabetical (A-Z)</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">
              {filteredJobs.length} {filteredJobs.length === 1 ? "Job" : "Jobs"} Found
            </span>

            {/* View toggle */}
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-lg p-1.5 transition ${
                  viewMode === "grid"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Grid / Card View"
                aria-label="Grid view"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`rounded-lg p-1.5 transition ${
                  viewMode === "table"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Table / List View"
                aria-label="Table view"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Zero State */}
      {filteredJobs.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white py-16 text-center shadow-xs">
          <Briefcase className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-3 text-lg font-bold text-slate-900 font-heading">No Jobs Matched Your Filters</h3>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your search query, sector pill, or state filter.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedSector("all");
              setSelectedState("All");
            }}
            className="mt-4 rounded-xl bg-[#111111] px-4 py-2 text-xs font-bold text-[#FFD84D] hover:bg-black transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID / CARD VIEW */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayedJobs.map((job) => {
            const vacancyBadge = extractVacancyBadge(job.title);
            const isClosing = /last date|extend/i.test(job.title);
            const isExtended = /extend/i.test(job.title);
            const isCorrection = /correction|edit/i.test(job.title);
            const isNew = isRecent(job.date);
            const cta = getCategoryCta("latest-jobs", job.title, job.isExpired);

            return (
              <div
                key={job.slug || job.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#FF5B3E]/40 hover:shadow-xl hover:shadow-black/5"
              >
                <div>
                  {/* Top Badges Row */}
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                        <Building2 className="h-3 w-3 text-slate-500" />
                        {job.state || "All India"}
                      </span>

                      {vacancyBadge && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200/80">
                          {vacancyBadge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {isNew && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-[#FF5B3E]/10 px-2 py-0.5 text-[10px] font-extrabold text-[#FF5B3E] ring-1 ring-[#FF5B3E]/30">
                          <Sparkles className="h-2.5 w-2.5" /> NEW
                        </span>
                      )}

                      {isExtended && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-300">
                          Extended
                        </span>
                      )}

                      {isClosing && !isExtended && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 ring-1 ring-rose-200">
                          <Clock className="h-2.5 w-2.5" /> Last Date
                        </span>
                      )}

                      {isCorrection && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 ring-1 ring-indigo-200">
                          Correction
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <Link href={job.slug ? `/post/${job.slug}` : "#"}>
                    <h3 className="text-[15px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#FF5B3E] font-heading line-clamp-2">
                      {job.title}
                    </h3>
                  </Link>

                  {/* Summary / Excerpt */}
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2 font-sans">
                    {job.excerpt || "Check eligibility criteria, total vacancies, age limit, selection process and online application details."}
                  </p>
                </div>

                {/* Bottom Strip: Dates & Primary Action */}
                <div className="mt-5 border-t border-slate-100 pt-3.5 flex items-center justify-between gap-2">
                  <div className="flex flex-col text-[11px] text-slate-500 font-sans">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {job.date ? `Updated: ${job.date}` : "2026"}
                    </span>
                    {job.lastDate && (
                      <span className="font-semibold text-rose-600">
                        Last Date: {job.lastDate}
                      </span>
                    )}
                  </div>

                  <Link
                    href={job.slug ? `/post/${job.slug}` : "#"}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFD84D] px-3.5 py-1.5 text-xs font-bold text-[#111111] transition-all duration-200 hover:bg-[#FF5B3E] hover:text-white font-heading shadow-xs group-hover:shadow-md"
                  >
                    <span>{cta.actionText || "Apply Online"}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE / LIST VIEW */
        <div className="overflow-x-auto rounded-3xl border border-slate-200/90 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
                  Job Notification &amp; Board
                </th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
                  State / Scope
                </th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
                  Updated Date
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedJobs.map((job) => {
                const vacancyBadge = extractVacancyBadge(job.title);
                const isNew = isRecent(job.date);
                const cta = getCategoryCta("latest-jobs", job.title, job.isExpired);

                return (
                  <tr key={job.slug || job.title} className="transition hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Link
                            href={job.slug ? `/post/${job.slug}` : "#"}
                            className="font-bold text-slate-900 transition hover:text-[#FF5B3E] font-heading line-clamp-1"
                          >
                            {job.title}
                          </Link>
                          {isNew && (
                            <span className="inline-flex shrink-0 items-center gap-0.5 rounded bg-[#FF5B3E]/10 px-1.5 py-0.2 text-[10px] font-bold text-[#FF5B3E]">
                              NEW
                            </span>
                          )}
                        </div>
                        {vacancyBadge && (
                          <span className="text-[11px] font-semibold text-emerald-700">
                            Total: {vacancyBadge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">
                      {job.state || "All India"}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {job.date || "2026"}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <Link
                        href={job.slug ? `/post/${job.slug}` : "#"}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFD84D] px-3.5 py-1.5 text-xs font-bold text-[#111111] transition hover:bg-[#FF5B3E] hover:text-white font-heading"
                      >
                        <span>{cta.actionText || "Apply"}</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination / Load More */}
      {hasMore && (
        <div className="mt-8 flex flex-col items-center justify-center gap-2">
          <button
            onClick={() => setVisibleCount((prev) => prev + 24)}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:border-[#FF5B3E] hover:text-[#FF5B3E] active:scale-95 font-heading"
          >
            <span>Load More Vacancies ({filteredJobs.length - visibleCount} remaining)</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          <p className="text-xs text-slate-400">
            Showing {displayedJobs.length} of {filteredJobs.length} Sarkari jobs
          </p>
        </div>
      )}
    </section>
  );
}
