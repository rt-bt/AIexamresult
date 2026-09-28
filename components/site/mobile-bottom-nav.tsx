"use client";

import { Home, Search, Bookmark, Grid3X3, X, ChevronRight, LayoutDashboard, MapPin, Calendar, Phone, User, FileText, Calculator, BarChart3, Scale, ListChecks, GraduationCap, BookOpen, HelpCircle, AlertTriangle, ClipboardList, Activity, DollarSign, ShieldCheck, BrainCircuit } from "lucide-react";
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
  ["Latest Vacancy", "/latest-jobs", FileText],
  ["Admit Card", "/admit-card", FileText],
  ["Answer Key", "/answer-key", FileText],
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
    return () => { document.body.style.overflow = ""; };
  }, [sheet]);

  const tabs = [
    { label: "Home", href: "/", icon: Home, sheet: null as Sheet },
    { label: "Search", href: "/search", icon: Search, sheet: null as Sheet },
    { label: "Tools", href: "#", icon: Grid3X3, sheet: "tools" as Sheet },
    { label: "Bookmarks", href: "/bookmarks", icon: Bookmark, sheet: null as Sheet },
    { label: "More", href: "#", icon: Grid3X3, sheet: "more" as Sheet },
  ];

  return (
    <>
      {/* Backdrop */}
      {sheet && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSheet(null)}
        />
      )}

      {/* Tools Sheet */}
      {sheet === "tools" && (
        <div className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] rounded-t-2xl bg-white pb-safe shadow-2xl lg:hidden animate-slide-up">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
            <h2 className="text-sm font-bold text-gray-800">All Tools</h2>
            <button onClick={() => setSheet(null)} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 active:scale-90 touch-manipulation">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2 overflow-y-auto p-4 pb-6">
            {tools.map(([label, href, Icon]) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl p-2.5 text-[10px] font-semibold transition active:scale-90 touch-manipulation",
                    active ? "bg-brand/10 text-brand" : "text-gray-500 hover:bg-gray-50 active:bg-gray-100"
                  )}
                >
                  <div className={cn("rounded-lg p-2", active ? "bg-brand/15" : "bg-gray-50")}>
                    <Icon className={cn("h-4 w-4", active ? "text-brand" : "text-gray-400")} />
                  </div>
                  <span className="text-center leading-tight">{label}</span>
                </Link>
              );
            })}
          </div>
          <div className="border-t border-gray-100 px-4 py-2.5">
            <Link href="/tools" onClick={() => setSheet(null)}
              className="flex items-center justify-center gap-1 rounded-xl bg-brand py-2.5 text-xs font-bold text-white active:scale-95 touch-manipulation"
            >
              View All Tools <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* More Sheet */}
      {sheet === "more" && (
        <div className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] rounded-t-2xl bg-white pb-safe shadow-2xl lg:hidden animate-slide-up">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
            <h2 className="text-sm font-bold text-gray-800">More</h2>
            <button onClick={() => setSheet(null)} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 active:scale-90 touch-manipulation">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 overflow-y-auto p-4 pb-6">
            {moreLinks.map(([label, href, Icon]) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  onClick={() => setSheet(null)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl p-3 text-[10px] font-semibold transition active:scale-90 touch-manipulation",
                    active ? "bg-brand/10 text-brand" : "text-gray-500 hover:bg-gray-50 active:bg-gray-100"
                  )}
                >
                  <div className={cn("rounded-lg p-2", active ? "bg-brand/15" : "bg-gray-50")}>
                    <Icon className={cn("h-4 w-4", active ? "text-brand" : "text-gray-400")} />
                  </div>
                  <span className="text-center leading-tight">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/80 pb-safe backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-around py-1">
          {tabs.map(({ label, href, icon: Icon, sheet: tabSheet }) => {
            const active = tabSheet
              ? sheet === tabSheet
              : pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <button key={label}
                onClick={() => {
                  if (tabSheet) {
                    setSheet(sheet === tabSheet ? null : tabSheet);
                  }
                }}
                className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-semibold transition active:scale-90 touch-manipulation"
              >
                {tabSheet ? (
                  <>
                    <div className={`rounded-lg p-1.5 transition-all ${active ? "bg-brand/10 scale-110" : ""}`}>
                      <Icon className={`h-5 w-5 ${active ? "text-brand" : "text-slate-400"}`} />
                    </div>
                    <span className={active ? "text-brand" : "text-slate-400"}>{label}</span>
                  </>
                ) : (
                  <Link href={href}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <div className={`rounded-lg p-1.5 transition-all ${active ? "bg-brand/10 scale-110" : ""}`}>
                      <Icon className={`h-5 w-5 ${active ? "text-brand" : "text-slate-400"}`} />
                    </div>
                    <span className={active ? "text-brand" : "text-slate-400"}>{label}</span>
                  </Link>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
