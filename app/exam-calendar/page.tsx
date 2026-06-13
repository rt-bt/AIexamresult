"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CalendarDays, ChevronRight, ChevronLeft, AlertCircle, FileText, ClipboardCheck, Timer, Award, Filter, Calendar, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type CalendarEvent = {
  title: string;
  slug: string;
  dateLabel: string;
  dateStr: string;
  category: string;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const LABEL_ICONS: Record<string, React.ReactNode> = {
  "Last Date": <Timer className="h-3.5 w-3.5" />,
  "Exam Date": <ClipboardCheck className="h-3.5 w-3.5" />,
  "Result": <Award className="h-3.5 w-3.5" />,
  "Admit Card": <FileText className="h-3.5 w-3.5" />,
  "Apply Start": <Calendar className="h-3.5 w-3.5" />,
  "Answer Key": <FileText className="h-3.5 w-3.5" />,
  "Correction": <AlertCircle className="h-3.5 w-3.5" />,
};

const LABEL_COLORS: Record<string, string> = {
  "Last Date": "bg-red-50 text-red-700 border-red-200",
  "Exam Date": "bg-orange-50 text-orange-700 border-orange-200",
  "Result": "bg-green-50 text-green-700 border-green-200",
  "Admit Card": "bg-purple-50 text-purple-700 border-purple-200",
  "Apply Start": "bg-blue-50 text-blue-700 border-blue-200",
  "Answer Key": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Correction": "bg-amber-50 text-amber-700 border-amber-200",
  "Other": "bg-gray-50 text-gray-600 border-gray-200",
};

const FILTER_TYPES = ["All", "Last Date", "Exam Date", "Result", "Admit Card", "Apply Start", "Answer Key"];

function getRelativeDay(dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 0 && diff <= 7) return `In ${diff} days`;
  if (diff > 0 && diff <= 30) return `In ${Math.round(diff / 7)} week${Math.round(diff / 7) > 1 ? "s" : ""}`;
  if (diff < 0 && diff >= -7) return `${Math.abs(diff)} day${Math.abs(diff) > 1 ? "s" : ""} ago`;
  if (diff < 0 && diff >= -30) return `${Math.abs(Math.round(diff / 7))} week${Math.abs(Math.round(diff / 7)) > 1 ? "s" : ""} ago`;
  return "";
}

export default function ExamCalendarPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // Simulated data - in production this comes from posts
  const events: CalendarEvent[] = useMemo(() => {
    if (typeof window === "undefined") return [];
    // This won't work in client component - need to fetch
    return [];
  }, []);

  // For now show placeholder data from server-rendered version
  const [hydrated, setHydrated] = useState(false);
  const [serverEvents, setServerEvents] = useState<CalendarEvent[]>([]);

  useMemo(() => {
    fetch("/api/calendar-events")
      .then((r) => r.json())
      .then((data) => setServerEvents(data))
      .catch(() => {});
    setHydrated(true);
  }, []);

  const allEvents = serverEvents;

  const filtered = useMemo(() => {
    let list = allEvents;
    if (filter !== "All") list = list.filter((e) => e.dateLabel === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((e) => e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q));
    }
    return list;
  }, [allEvents, filter, search]);

  const grouped = useMemo(() => {
    const g: Record<string, CalendarEvent[]> = {};
    for (const e of filtered) {
      const d = new Date(e.dateStr);
      if (isNaN(d.getTime())) continue;
      const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
      if (!g[key]) g[key] = [];
      g[key].push(e);
    }
    return g;
  }, [filtered]);

  const monthKeys = useMemo(() => Object.keys(grouped), [grouped]);
  const [currentMonthIdx, setCurrentMonthIdx] = useState(0);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return allEvents
      .filter((e) => new Date(e.dateStr) >= now)
      .sort((a, b) => new Date(a.dateStr).getTime() - new Date(b.dateStr).getTime())
      .slice(0, 5);
  }, [allEvents]);

  const stats = useMemo(() => ({
    total: allEvents.length,
    upcoming: allEvents.filter((e) => new Date(e.dateStr) >= new Date()).length,
    lastDates: allEvents.filter((e) => e.dateLabel === "Last Date").length,
    results: allEvents.filter((e) => e.dateLabel === "Result").length,
  }), [allEvents]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20 lg:pb-10">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-4 py-1.5 text-xs font-semibold text-teal-700 mb-3 shadow-sm">
                <CalendarDays className="h-3.5 w-3.5" /> Exam Calendar 2026
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Exam Calendar</h1>
              <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
                Track important dates for government exams — application start, last date, exam date, result
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Total Events", value: stats.total, icon: CalendarDays, color: "text-teal-600" },
                { label: "Upcoming", value: stats.upcoming, icon: Timer, color: "text-blue-600" },
                { label: "Last Dates", value: stats.lastDates, icon: AlertCircle, color: "text-red-600" },
                { label: "Results", value: stats.results, icon: Award, color: "text-green-600" },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-4 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <div className={cn("rounded-xl bg-gray-50 p-2.5", s.color)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                        <div className="text-xs text-gray-500">{s.label}</div>
                      </div>
                    </div>
                    <div className={cn("absolute right-0 top-0 h-full w-1", {
                      "bg-teal-400": s.label === "Total Events",
                      "bg-blue-400": s.label === "Upcoming",
                      "bg-red-400": s.label === "Last Dates",
                      "bg-green-400": s.label === "Results",
                    })} />
                  </div>
                );
              })}
            </div>

            {/* Upcoming Next */}
            {upcomingEvents.length > 0 && (
              <div className="mb-6 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-500 p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Timer className="h-4 w-4 text-teal-100" />
                  <h2 className="text-sm font-bold text-white">Upcoming Next</h2>
                </div>
                <div className="space-y-2">
                  {upcomingEvents.map((e, i) => {
                    const d = new Date(e.dateStr);
                    const relative = getRelativeDay(e.dateStr);
                    return (
                      <Link key={i} href={`/post/${e.slug}`} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-2.5 transition hover:bg-white/20">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
                          {d.getDate()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white truncate">{e.title}</p>
                          <p className="text-xs text-teal-100">{MONTHS[d.getMonth()]} {d.getDate()} {d.getFullYear()} &middot; <span className="font-semibold">{relative}</span></p>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-white/50" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Search + Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exams..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 shadow-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {FILTER_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={cn(
                      "rounded-lg px-3 py-2 text-xs font-semibold transition border",
                      filter === t
                        ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-teal-200 hover:text-teal-600"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Month Navigation */}
            {monthKeys.length > 1 && (
              <div className="mb-4 flex items-center justify-between rounded-xl bg-white border border-gray-100 px-4 py-2 shadow-sm">
                <button
                  onClick={() => setCurrentMonthIdx(Math.max(0, currentMonthIdx - 1))}
                  disabled={currentMonthIdx === 0}
                  className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none px-2">
                  {monthKeys.map((key, i) => (
                    <button
                      key={key}
                      onClick={() => setCurrentMonthIdx(i)}
                      className={cn(
                        "whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                        i === currentMonthIdx
                          ? "bg-teal-100 text-teal-700"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      )}
                    >
                      {key}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentMonthIdx(Math.min(monthKeys.length - 1, currentMonthIdx + 1))}
                  disabled={currentMonthIdx === monthKeys.length - 1}
                  className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Monthly view */}
            {monthKeys.length === 0 && (
              <div className="rounded-2xl bg-white border border-gray-100 p-16 text-center shadow-sm">
                <CalendarDays className="mx-auto h-12 w-12 text-gray-200" />
                <p className="mt-4 text-gray-400 font-medium">No exam dates found</p>
                <p className="text-xs text-gray-300 mt-1">Data will populate after the next scrape</p>
              </div>
            )}

            {monthKeys.map((monthYear, idx) => {
              if (monthKeys.length > 1 && idx !== currentMonthIdx && !search && filter === "All") return null;
              if (search || filter !== "All") {
                // In filtered mode, show all months
              } else if (monthKeys.length > 1 && idx !== currentMonthIdx) return null;

              const monthEvents = grouped[monthYear];
              const now = new Date();

              return (
                <div key={monthYear} className="mb-6 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden transition hover:shadow-md">
                  <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-teal-200" />
                        {monthYear}
                      </h2>
                      <p className="text-sm text-teal-100">{monthEvents.length} event{monthEvents.length > 1 ? "s" : ""}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-white/20 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-white/60 transition-all"
                          style={{ width: `${Math.min(100, (monthEvents.filter((e: CalendarEvent) => new Date(e.dateStr) >= now).length / monthEvents.length) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-teal-100 font-medium">
                        {monthEvents.filter((e: CalendarEvent) => new Date(e.dateStr) >= now).length} upcoming
                      </span>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {monthEvents.map((event: CalendarEvent, i: number) => {
                      const d = new Date(event.dateStr);
                      const isPast = d < now;
                      const relative = getRelativeDay(event.dateStr);
                      const Icon = LABEL_ICONS[event.dateLabel] || null;
                      const colorClass = LABEL_COLORS[event.dateLabel] || LABEL_COLORS["Other"];

                      return (
                        <Link
                          key={i}
                          href={`/post/${event.slug}`}
                          className={cn(
                            "flex items-center gap-4 px-4 sm:px-6 py-4 transition group",
                            isPast ? "hover:bg-gray-50" : "hover:bg-teal-50/50"
                          )}
                        >
                          {/* Date Badge */}
                          <div className={cn(
                            "shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl border-2 transition",
                            isPast ? "border-gray-100 bg-gray-50" : "border-teal-200 bg-teal-50"
                          )}>
                            <span className={cn(
                              "text-lg font-bold leading-none",
                              isPast ? "text-gray-500" : "text-teal-700"
                            )}>{d.getDate()}</span>
                            <span className={cn(
                              "text-[10px] font-semibold uppercase leading-tight",
                              isPast ? "text-gray-400" : "text-teal-500"
                            )}>{MONTHS[d.getMonth()]}</span>
                          </div>

                          {/* Content */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className={cn(
                                "text-sm font-semibold transition-colors line-clamp-1",
                                isPast ? "text-gray-500" : "text-gray-800 group-hover:text-teal-600"
                              )}>
                                {event.title}
                              </h3>
                              {!isPast && relative && (
                                <span className="shrink-0 rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
                                  {relative}
                                </span>
                              )}
                              {isPast && (
                                <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                                  Past
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", colorClass)}>
                                {Icon}
                                {event.dateLabel}
                              </span>
                              <span className="text-[11px] text-gray-400">{event.category}</span>
                            </div>
                          </div>

                          <ChevronRight className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isPast ? "text-gray-200 group-hover:text-gray-400" : "text-gray-300 group-hover:text-teal-500"
                          )} />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Legend */}
            <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 mb-2">Legend</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(LABEL_COLORS).map(([label, cls]) => (
                  <span key={label} className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold", cls)}>
                    {LABEL_ICONS[label] || null}
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
