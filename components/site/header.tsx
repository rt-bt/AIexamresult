"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  Briefcase,
  FileCheck2,
  Award,
  KeyRound,
  BookOpen,
  Calendar,
  Compass,
  Layers,
  MapPin,
  HelpCircle,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Command,
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
  { label: "IQ Test", href: "/iq-test", desc: "Reasoning & aptitude evaluation", icon: Brain },
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
  const { lang, t } = useLang();
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
    <header className="sticky top-0 z-50 w-full">
      {/* 1. Subtle Minimalist Top Alert Bar */}
      <div
        role="region"
        aria-label="Breaking Exam Alerts"
        className="border-b border-slate-200/70 bg-slate-50/90 text-slate-700 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80 dark:text-slate-300"
      >
        <div className="container-page flex h-8 items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:border-teal-500/40 dark:bg-teal-500/15 dark:text-teal-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-500" />
              </span>
              Live Alerts
            </span>

            <div className="relative overflow-hidden">
              <div className="animate-marquee whitespace-nowrap inline-block hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none">
                {tickerList.map((item, i) => (
                  <Link
                    key={`${item.slug}-${i}`}
                    href={item.slug ? `/post/${item.slug}` : "#"}
                    className="mx-3 inline-flex items-center gap-1.5 transition hover:text-teal-600 dark:hover:text-teal-400"
                  >
                    <span className="rounded border border-slate-200/90 bg-white/80 px-1.5 py-0.2 font-mono text-[9px] font-semibold uppercase text-slate-600 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-400">
                      {item.category || "Update"}
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[260px] sm:max-w-none">
                      {item.title}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-slate-400 dark:text-slate-500 sm:flex shrink-0 font-mono text-[10px]">
            <CheckCircle2 className="h-3 w-3 text-teal-600 dark:text-teal-400" />
            <span>Govt Verified Sync</span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar (Linear / SaaS Minimalist) */}
      <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90 transition-colors">
        <div className="container-page flex h-14 lg:h-16 items-center justify-between gap-3 lg:gap-6">
          {/* Logo / Brand */}
          <Link href="/" className="group flex items-center gap-2.5 shrink-0 focus-visible:outline-none">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white p-1 shadow-2xs transition group-hover:border-teal-500/40 dark:border-slate-800 dark:bg-slate-900">
              <Logo className="h-7 w-7 object-contain" />
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white">
                  All India
                </span>
                <span className="rounded bg-teal-500/10 px-1 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-teal-700 dark:bg-teal-500/20 dark:text-teal-300">
                  Govt
                </span>
              </div>
              <span className="mt-0.5 font-mono text-[10px] font-bold tracking-wider text-teal-600 dark:text-teal-400">
                EXAM RESULT
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
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
                      "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold tracking-tight transition-all",
                      isActive
                        ? "bg-slate-100 text-slate-950 dark:bg-slate-800/90 dark:text-white font-bold"
                        : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white"
                    )}
                  >
                    <span>{t(`nav.${item.label.toLowerCase().replace(/\s+/g, "-")}`) || item.label}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform duration-200 group-hover:rotate-180 dark:text-slate-500" />
                  </button>

                  {/* Sleek Floating Dropdown Menu */}
                  <div className="invisible absolute left-0 top-full z-50 mt-1 w-64 origin-top-left rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-xl backdrop-blur-xl opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-slate-950/60">
                    {item.dropdown.map((sub) => {
                      const isSubActive = pathname === sub.href;
                      const Icon = sub.icon;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={cn(
                            "flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-xs transition",
                            isSubActive
                              ? "bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300 font-semibold"
                              : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                          )}
                        >
                          {Icon && (
                            <Icon className="mt-0.5 h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
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
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-2.5 py-1.5 text-xs font-semibold tracking-tight transition-all",
                    isActive
                      ? "bg-slate-100 text-slate-950 dark:bg-slate-800/90 dark:text-white font-bold"
                      : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white"
                  )}
                >
                  {t(`nav.${item.label.toLowerCase().replace(/\s+/g, "-")}`) || item.label}
                </Link>
              );
            })}
          </nav>

          {/* Quick Search & Actions Suite */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Linear-style Search Pill (Desktop) */}
            <Link
              href="/search"
              className="hidden lg:flex items-center gap-2.5 rounded-lg border border-slate-200/90 bg-slate-100/60 px-3 py-1.5 text-xs text-slate-500 transition hover:border-slate-300 hover:bg-white hover:text-slate-800 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              <Search className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              <span className="w-36 text-left truncate">Search sarkari exams...</span>
              <kbd className="inline-flex h-4 items-center gap-0.5 rounded border border-slate-200 bg-white px-1 font-mono text-[9px] font-medium text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                ⌘K
              </kbd>
            </Link>

            {/* Mobile Search Button */}
            <Link
              href="/search"
              className="flex lg:hidden h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              title="Search"
              aria-label="Search"
            >
              <Search className="h-3.5 w-3.5" />
            </Link>

            {/* Voice Search */}
            <VoiceSearchBtn
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition"
            />

            {/* Bookmarks */}
            <BookmarkListBtn />

            {/* Language Selector */}
            <LanguageSelector />

            {/* Theme Toggle (Linear-style Light/Dark/System) */}
            <ThemeToggle />

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex lg:hidden h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Navigation Sheet */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-xl lg:hidden dark:border-slate-800 dark:bg-slate-950/95 animate-fade-up">
          <div className="space-y-1">
            {navItems.map((item) => (
              <div key={item.label} className="border-b border-slate-100 dark:border-slate-900 py-1 last:border-none">
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
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
                        className="rounded-lg px-2 py-1.5 text-[11px] text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
            <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Interactive Tools
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {toolsSubNav.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50/80 px-2 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                >
                  <tool.icon className="h-3 w-3 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span className="truncate">{tool.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Docked Mobile Bottom Navigation */}
      <MobileBottomNav />
    </header>
  );
}
