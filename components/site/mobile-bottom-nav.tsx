"use client";

import {
  Home,
  Search,
  Bookmark,
  Grid3X3,
  X,
  ChevronRight,
  LayoutDashboard,
  MapPin,
  Calendar,
  Phone,
  User,
  FileText,
  Calculator,
  BarChart3,
  Scale,
  ListChecks,
  GraduationCap,
  BookOpen,
  HelpCircle,
  AlertTriangle,
  ClipboardList,
  Activity,
  DollarSign,
  ShieldCheck,
  BrainCircuit,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const tools: [string, string, typeof Home][] = [
  ["Job Finder", "/job-finder", User],
  ["Eligibility Checker", "/eligibility-checker", ShieldCheck],
  ["Salary Calculator", "/salary-calculator", DollarSign],
  ["Vacancy Analyzer", "/vacancy-analyzer", BarChart3],
  ["Fee Calculator", "/fee-calculator", Calculator],
  ["Form Guide", "/form-guide", FileText],
  ["Syllabus Tracker", "/syllabus-tracker", BookOpen],
  ["Mock Tests", "/mock-tests", GraduationCap],
  ["Current Affairs", "/current-affairs", Activity],
  ["Objection Tracker", "/objection-tracker", AlertTriangle],
  ["Counselling Guide", "/counselling-guide", ClipboardList],
  ["Difficulty Meter", "/difficulty-meter", Scale],
  ["Exam Comparison", "/exam-comparison", ListChecks],
  ["Document Checklist", "/document-checklist", ClipboardList],
  ["Question Papers", "/question-papers", FileText],
  ["State Map", "/state-map", MapPin],
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Result Predictor", "/result-predictor", BrainCircuit],
  ["Exam Calendar", "/exam-calendar", Calendar],
  ["IQ Test", "/iq-test", HelpCircle],
];

const moreLinks: [string, string, typeof Home][] = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["States", "/state-map", MapPin],
  ["Results", "/results", Grid3X3],
  ["Exam Calendar", "/exam-calendar", Calendar],
  ["Latest Vacancies", "/latest-jobs", FileText],
  ["Admit Cards", "/admit-card", FileText],
  ["Answer Keys", "/answer-key", FileText],
  ["Contact Us", "/contact", Phone],
  ["About Us", "/about", User],
];

type Sheet = "tools" | "more" | null;

export function MobileBottomNav() {
  const pathname = usePathname();
  const [sheet, setSheet] = useState<Sheet>(null);

  useEffect(() => {
    setSheet(null);
  }, [pathname]);

  useEffect(() => {
    if (sheet) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheet]);

  const tabs = [
    { label: "Home", href: "/", icon: Home, sheet: null as Sheet },
    { label: "Search", href: "/search", icon: Search, sheet: null as Sheet },
    { label: "Tools", href: "#", icon: Grid3X3, sheet: "tools" as Sheet },
    { label: "Bookmarks", href: "/bookmarks", icon: Bookmark, sheet: null as Sheet },
    { label: "More", href: "#", icon: MoreHorizontal, sheet: "more" as Sheet },
  ];

  return (
    <>
      {/* Dimming Frosted Backdrop */}
      {sheet && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={() => setSheet(null)}
        />
      )}

      {/* Double-Bezel Tools Sheet */}
      {sheet === "tools" && (
        <div className="fixed inset-x-0 bottom-0 z-50 max-h-[78vh] rounded-t-[2rem] border-t border-slate-200/90 bg-white/95 pb-safe shadow-2xl backdrop-blur-2xl lg:hidden animate-slide-up dark:border-white/10 dark:bg-slate-950/95">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.08] px-6 py-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-900 dark:text-white">
                All Interactive Tools
              </h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                Calculators, eligibility matchers &amp; trackers
              </p>
            </div>
            <button
              onClick={() => setSheet(null)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200/80 bg-slate-100 text-slate-500 hover:bg-slate-200 active:scale-95 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-400 dark:hover:bg-white/[0.1] transition-all"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2.5 overflow-y-auto p-4 pb-4 max-h-[50vh]">
            {tools.map(([label, href, Icon]) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSheet(null)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-2xl p-2 text-[10px] font-medium transition-all duration-200 active:scale-95",
                    active
                      ? "bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 font-semibold ring-1 ring-teal-500/30"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-slate-200"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-xl transition-transform duration-200",
                      active
                        ? "bg-teal-500 text-white shadow-xs"
                        : "bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-center leading-tight">{label}</span>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-slate-100 dark:border-white/[0.08] px-5 py-3.5">
            <Link
              href="/tools"
              onClick={() => setSheet(null)}
              className="flex items-center justify-center gap-1.5 rounded-full bg-slate-900 dark:bg-white py-2.5 text-xs font-semibold text-white dark:text-slate-950 shadow-md transition-all active:scale-[0.98]"
            >
              <span>Explore All Tools Directory</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Double-Bezel More Sheet */}
      {sheet === "more" && (
        <div className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] rounded-t-[2rem] border-t border-slate-200/90 bg-white/95 pb-safe shadow-2xl backdrop-blur-2xl lg:hidden animate-slide-up dark:border-white/10 dark:bg-slate-950/95">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.08] px-6 py-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-900 dark:text-white">
                Navigation &amp; Portals
              </h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                Direct indices for results, admit cards, and states
              </p>
            </div>
            <button
              onClick={() => setSheet(null)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200/80 bg-slate-100 text-slate-500 hover:bg-slate-200 active:scale-95 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-400 dark:hover:bg-white/[0.1] transition-all"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5 overflow-y-auto p-5 pb-6">
            {moreLinks.map(([label, href, Icon]) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSheet(null)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-2xl p-3 text-[10px] font-medium transition-all active:scale-95",
                    active
                      ? "bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 font-semibold ring-1 ring-teal-500/30"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-slate-200"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-xl transition-transform",
                      active
                        ? "bg-teal-500 text-white shadow-xs"
                        : "bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-center leading-tight">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Island Dock (Detached from screen edges) */}
      <nav className="fixed bottom-3 inset-x-3 sm:inset-x-6 max-w-md mx-auto z-40 lg:hidden">
        <div className="rounded-full border border-slate-200/90 dark:border-white/10 bg-white/85 dark:bg-slate-950/85 p-1 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-300">
          <div className="flex items-center justify-around">
            {tabs.map(({ label, href, icon: Icon, sheet: tabSheet }) => {
              const active = tabSheet
                ? sheet === tabSheet
                : pathname === href || (href !== "/" && pathname.startsWith(href));

              if (tabSheet) {
                return (
                  <button
                    key={label}
                    onClick={() => setSheet(sheet === tabSheet ? null : tabSheet)}
                    className={cn(
                      "flex flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-[9px] font-semibold tracking-tight transition-all duration-300 active:scale-90",
                      active
                        ? "text-teal-600 dark:text-teal-400 font-bold"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                        active && "bg-teal-500/10 dark:bg-teal-400/15 scale-110"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span>{label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={label}
                  href={href}
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-[9px] font-semibold tracking-tight transition-all duration-300 active:scale-90",
                    active
                      ? "text-teal-600 dark:text-teal-400 font-bold"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      active && "bg-teal-500/10 dark:bg-teal-400/15 scale-110"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
