"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  Briefcase,
  FileCheck2,
  Award,
  KeyRound,
  BookOpen,
  Calendar,
  Compass,
  Layers,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/site/logo";
import { sectionItems } from "@/lib/data";
import { useLang } from "@/lib/hooks/use-lang";
import { MobileBottomNav } from "@/components/site/mobile-bottom-nav";
import { LanguageSelector } from "@/components/site/language-selector";
import { VoiceSearchBtn } from "@/components/site/voice-search";
import { BookmarkListBtn } from "@/components/site/bookmark-list-btn";
import { ThemeToggle } from "@/components/site/theme-toggle";

interface DropdownItem {
  label: string;
  href: string;
  desc?: string;
  icon?: any;
}

const examSubNav: DropdownItem[] = [
  { label: "Latest Job", href: "/latest-jobs", desc: "Recruitment notices & openings", icon: Briefcase },
  { label: "Admit Card", href: "/admit-card", desc: "Hall tickets & exam city slips", icon: FileCheck2 },
  { label: "Result", href: "/results", desc: "Scorecards, merit lists & cut-offs", icon: Award },
  { label: "Answer Key", href: "/answer-key", desc: "Official keys & objections", icon: KeyRound },
  { label: "Syllabus", href: "/syllabus", desc: "Exam schemes & topic patterns", icon: BookOpen },
];

const studyHubSubNav: DropdownItem[] = [
  { label: "Current Affairs", href: "/current-affairs", desc: "Daily quiz & national digests", icon: Compass },
  { label: "Mock Test", href: "/mock-tests", desc: "Timed practice tests", icon: Layers },
  { label: "IQ Test", href: "/iq-test", desc: "Reasoning & aptitude evaluation", icon: Sparkles },
  { label: "Calendar", href: "/exam-calendar", desc: "Official upcoming exam schedules", icon: Calendar },
];

const toolsSubNav: DropdownItem[] = [
  { label: "Eligibility Checker", href: "/eligibility-checker", desc: "Age & qualification matcher", icon: ShieldCheck },
  { label: "Salary Calculator", href: "/salary-calculator", desc: "7th Pay Commission in-hand pay", icon: Briefcase },
  { label: "Vacancy Analyzer", href: "/vacancy-analyzer", desc: "Historical category trends", icon: Layers },
  { label: "State Map", href: "/state-map", desc: "State-wise recruitment explorer", icon: MapPin },
];

interface NavItem {
  label: string;
  href: string;
  dropdown?: DropdownItem[];
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Exam", href: "/exam", dropdown: examSubNav },
  { label: "Study Hub", href: "/study-hub", dropdown: studyHubSubNav },
  { label: "Tools", href: "/tools" },
  { label: "Contact Us", href: "/contact" },
  { label: "About Us", href: "/about" },
];

function getTickerItems() {
  const topJobs = (sectionItems["latest-jobs"] || []).slice(0, 3);
  const topResults = (sectionItems["results"] || []).slice(0, 3);
  const topAdmit = (sectionItems["admit-card"] || []).slice(0, 2);

  const mixed: (typeof topJobs[0])[] = [];
  const seen = new Set<string>();

  for (const item of [...topJobs, ...topResults, ...topAdmit]) {
    const key = item.slug || item.title;
    if (key && !seen.has(key)) {
      seen.add(key);
      mixed.push(item);
    }
  }

  return mixed.slice(0, 8);
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLang();
  const pathname = usePathname();
  const router = useRouter();

  const tickerList = useMemo(() => {
    const items = getTickerItems();
    return [...items, ...items];
  }, []);

  // Keyboard shortcut: Cmd+K or Ctrl+K opens /search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        router.push("/search");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <header className="sticky top-0 z-50 w-full transition-all">
      {/* 1. Academic Live Status & Exam Ticker */}
      <div
        role="region"
        aria-label="Breaking Exam Alerts"
        className="border-b border-indigo-100/70 bg-indigo-50/60 text-slate-700 backdrop-blur-xl dark:border-indigo-950/60 dark:bg-slate-950/80 dark:text-slate-300"
      >
        <div className="container-page flex h-7 items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-2 overflow-hidden">
            {/* Double-Bezel Micro Pulse Badge */}
            <div className="rounded-full p-0.5 bg-amber-500/10 dark:bg-amber-400/10 ring-1 ring-amber-500/25">
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-amber-800 dark:text-amber-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                </span>
                LIVE ALERTS
              </span>
            </div>

            <div className="relative overflow-hidden">
              <div className="animate-marquee whitespace-nowrap inline-block hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none">
                {tickerList.map((item, i) => (
                  <Link
                    key={`${item.slug}-${i}`}
                    href={item.slug ? `/post/${item.slug}` : "#"}
                    className="mx-3 inline-flex items-center gap-1.5 transition-colors duration-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <span className="rounded-full border border-indigo-200/80 bg-white px-1.5 py-0.2 font-mono text-[9px] font-semibold uppercase text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300">
                      {item.category || "Update"}
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[280px] sm:max-w-none">
                      {item.title}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-slate-500 dark:text-slate-400 sm:flex shrink-0 font-mono text-[10px]">
            <CheckCircle2 className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
            <span className="tracking-wide">Govt Gazettes Verified</span>
          </div>
        </div>
      </div>

      {/* 2. Fluid Floating Island Navbar (Modern EdTech Double-Bezel) */}
      <div className="container-page py-2">
        <div className="rounded-2xl sm:rounded-full p-1 bg-white/85 dark:bg-slate-950/85 border border-slate-200/90 dark:border-indigo-950/70 shadow-[0_4px_24px_rgba(79,70,229,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
          <div className="flex h-12 items-center justify-between gap-3 px-3 sm:px-4">
            
            {/* Brand Logo & Precision Mark */}
            <Link href="/" className="group flex items-center gap-2.5 shrink-0 focus-visible:outline-none">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl sm:rounded-full border border-indigo-100 bg-white p-1 shadow-2xs transition-all duration-300 group-hover:scale-105 group-hover:border-indigo-300 dark:border-indigo-900/60 dark:bg-slate-900">
                <Logo className="h-6 w-6 object-contain" />
              </div>
              <div className="flex flex-col leading-none">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white transition-colors">
                    All India
                  </span>
                  <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/80 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80">
                    Govt
                  </span>
                </div>
                <span className="mt-0.5 font-mono text-[9px] font-bold tracking-[0.14em] text-indigo-600 dark:text-indigo-400">
                  EXAM RESULT
                </span>
              </div>
            </Link>

            {/* Center Navigation Links (EdTech Pill Bar) */}
            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(item.href + "/");

                return item.dropdown ? (
                  <div key={item.label} className="group relative">
                    <button
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold tracking-tight transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                        isActive
                          ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 dark:bg-indigo-500 dark:text-white font-bold"
                          : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-indigo-950/50 dark:hover:text-white"
                      )}
                    >
                      <span>{t(`nav.${item.label.toLowerCase().replace(/\s+/g, "-")}`) || item.label}</span>
                      <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-180">
                        <ChevronDown className="h-2.5 w-2.5 text-current" />
                      </div>
                    </button>

                    {/* Concentric Double-Bezel Dropdown Panel */}
                    <div className="invisible absolute left-0 top-full z-50 mt-2 w-72 origin-top-left rounded-2xl p-1.5 bg-white/95 dark:bg-slate-950/95 border border-slate-200/90 dark:border-indigo-950/80 shadow-[0_16px_50px_rgba(79,70,229,0.12)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl opacity-0 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 translate-y-1">
                      <div className="space-y-0.5">
                        {item.dropdown.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          const Icon = sub.icon;
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={cn(
                                "group/sub flex items-start gap-2.5 rounded-xl px-3 py-2 text-xs transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]",
                                isSubActive
                                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 font-semibold border border-indigo-200/80 dark:border-indigo-800/80"
                                  : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                              )}
                            >
                              {Icon && (
                                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover/sub:scale-110 transition-transform">
                                  <Icon className="h-3 w-3" />
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="font-semibold leading-tight">{sub.label}</span>
                                {sub.desc && (
                                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal mt-0.5 leading-snug">
                                    {sub.desc}
                                  </span>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-semibold tracking-tight transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 dark:bg-indigo-500 dark:text-white font-bold"
                        : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-indigo-950/50 dark:hover:text-white"
                    )}
                  >
                    {t(`nav.${item.label.toLowerCase().replace(/\s+/g, "-")}`) || item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Search & Controls Suite */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Nested Button-in-Button Search Pill (Desktop) */}
              <Link
                href="/search"
                className="group hidden lg:flex items-center gap-2 rounded-full border border-slate-200/90 bg-slate-100/60 pl-3 pr-1.5 py-1 text-xs text-slate-500 transition-all duration-300 hover:border-indigo-300 hover:bg-white hover:text-slate-800 dark:border-indigo-950 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:border-indigo-800 dark:hover:bg-slate-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
              >
                <Search className="h-3 w-3 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                <span className="w-28 text-left truncate text-[11px]">Search exams...</span>
                
                {/* Micro Island Keycaps */}
                <div className="flex h-5 items-center rounded-full border border-slate-200 bg-white px-1.5 font-mono text-[9px] font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 shadow-2xs">
                  ⌘K
                </div>
              </Link>

              {/* Mobile Search Button */}
              <Link
                href="/search"
                className="flex lg:hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-100 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-transform"
                title="Search"
                aria-label="Search"
              >
                <Search className="h-3.5 w-3.5" />
              </Link>

              {/* Voice Search with Circular Bezel */}
              <VoiceSearchBtn
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-100 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-all"
              />

              {/* Bookmarks */}
              <BookmarkListBtn className="rounded-full" />

              {/* Language Selector */}
              <LanguageSelector className="rounded-full" />

              {/* Theme Toggle (Sun/Moon Island) */}
              <ThemeToggle className="rounded-full" />

              {/* Morphing Hamburger Toggle for Mobile */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative flex lg:hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-100 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-all"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                <div className="relative h-3 w-3.5">
                  <span
                    className={cn(
                      "absolute left-0 top-0 h-0.5 w-3.5 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      mobileMenuOpen && "top-1.5 rotate-45"
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 top-1.5 h-0.5 w-3.5 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      mobileMenuOpen && "opacity-0 scale-0"
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 top-3 h-0.5 w-3.5 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      mobileMenuOpen && "top-1.5 -rotate-45"
                    )}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Fluid Expanded Mobile Drawer (EdTech Indigo & Amber) */}
      {mobileMenuOpen && (
        <div className="container-page pb-3 lg:hidden animate-fade-up">
          <div className="rounded-2xl p-1 bg-white/95 dark:bg-slate-950/95 border border-slate-200/90 dark:border-indigo-950/80 shadow-2xl backdrop-blur-2xl">
            <div className="p-3 space-y-1">
              {navItems.map((item) => (
                <div key={item.label} className="border-b border-slate-100 dark:border-slate-900 py-1 last:border-none">
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition"
                  >
                    <span>{t(`nav.${item.label.toLowerCase().replace(/\s+/g, "-")}`) || item.label}</span>
                  </Link>
                  {item.dropdown && (
                    <div className="ml-3 grid grid-cols-2 gap-1 py-1">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="rounded-lg px-2.5 py-1.5 text-[11px] text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Tools Tray */}
            <div className="border-t border-slate-100 dark:border-slate-900 p-3 bg-indigo-50/40 dark:bg-indigo-950/30 rounded-b-xl">
              <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-400">
                Interactive Aspirant Tools
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {toolsSubNav.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-1.5 rounded-xl border border-indigo-100 bg-white px-2.5 py-2 text-[11px] font-medium text-slate-700 hover:border-indigo-400 dark:border-indigo-900/60 dark:bg-slate-900 dark:text-slate-300 transition"
                  >
                    <tool.icon className="h-3 w-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="truncate">{tool.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Docked Mobile Bottom Navigation */}
      <MobileBottomNav />
    </header>
  );
}
