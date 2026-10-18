"use client";

import { Search, Sparkles, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/site/logo";
import { defaultTickerItems, type TickerItem } from "@/lib/ticker";
import { useLang } from "@/lib/hooks/use-lang";
import { MobileBottomNav } from "@/components/site/mobile-bottom-nav";
import { LanguageSelector } from "@/components/site/language-selector";
import { VoiceSearchBtn } from "@/components/site/voice-search";
import { BookmarkListBtn } from "@/components/site/bookmark-list-btn";

const examSubNav: [string, string][] = [
  ["Latest Job", "/latest-jobs"],
  ["Admit Card", "/admit-card"],
  ["Result", "/results"],
  ["Answer Key", "/answer-key"],
  ["Syllabus", "/syllabus"],
];

const studyHubSubNav: [string, string][] = [
  ["Current Affairs", "/current-affairs"],
  ["Mock Test", "/mock-test"],
  ["IQ Test", "/iq-test"],
  ["Calendar", "/exam-calendar"],
];

const nav: [string, string, [string, string][]?][] = [
  ["Home", "/"],
  ["Exam", "/exam", examSubNav],
  ["Study Hub", "/study-hub", studyHubSubNav],
  ["Radio", "/radio"],
  ["Tools", "/tools"],
  ["Contact Us", "/contact-us"],
  ["About Us", "/about-us"],
];

function getTickerItems(): TickerItem[] {
  return defaultTickerItems;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { t } = useLang();
  const pathname = usePathname();

  const tickerList = useMemo(() => {
    const items = getTickerItems();
    return [...items, ...items];
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#343A46] border-b border-white/[0.22] font-sans">
      {/* Compact Main Navigation Bar */}
      <div className="container-page flex h-14 sm:h-16 items-center justify-between gap-4">
        {/* Left: Logo + Brand Title */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <Logo className="h-9 w-9 sm:h-10 sm:w-10 transition-transform group-hover:scale-105" dark />
          <div className="flex flex-col leading-none">
            <span className="text-[14px] sm:text-[15px] font-bold tracking-tight text-white font-heading">
              All India
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#F28A2E] mt-0.5">
              EXAM RESULT
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {nav.map(([label, href, dropdown]) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return dropdown ? (
              <div key={href} className="group relative">
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-3 py-1.5 text-[13.5px] font-medium transition-colors tracking-wide",
                    isActive
                      ? "text-[#F28A2E] font-semibold"
                      : "text-[#D7D9DC] hover:text-white hover:bg-white/[0.06]"
                  )}
                >
                  {t(`nav.${label.toLowerCase().replace(/\s+/g, "-")}`)}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180 opacity-70" />
                </Link>
                <div className="invisible absolute left-0 top-full z-50 pt-2 w-52 opacity-0 -translate-y-1 scale-95 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
                  <div className="rounded-xl border border-white/[0.22] bg-[#343A46] p-1.5 shadow-2xl backdrop-blur-xl">
                    {dropdown.map(([subLabel, subHref]) => {
                      const isSubActive = pathname === subHref;
                      return (
                        <Link
                          key={subHref}
                          href={subHref}
                          className={cn(
                            "block rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                            isSubActive
                              ? "bg-white/10 text-[#F28A2E] font-semibold"
                              : "text-[#D7D9DC] hover:bg-white/[0.08] hover:text-white"
                          )}
                        >
                          {subLabel}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[13.5px] font-medium transition-colors tracking-wide",
                  isActive
                    ? "text-[#F28A2E] font-semibold"
                    : "text-[#D7D9DC] hover:text-white hover:bg-white/[0.06]"
                )}
              >
                {t(`nav.${label.toLowerCase().replace(/\s+/g, "-")}`)}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions & Hamburger Menu Button */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <LanguageSelector />
          <BookmarkListBtn />
          <VoiceSearchBtn />

          {/* Search Action */}
          <Link
            href="/search"
            aria-label="Search exams"
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.22] bg-white/[0.06] hover:bg-white/[0.12] hover:text-white px-2.5 py-1.5 text-xs font-semibold text-[#D7D9DC] transition"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{t("nav.search")}</span>
          </Link>

          {/* Hamburger / Menu Icon Button (Visible on mobile and desktop drawer) */}
          <button
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation menu"
            className="rounded-lg border border-white/[0.22] bg-white/[0.06] hover:bg-white/[0.14] p-1.5 text-white transition active:scale-95"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Breaking Updates Ticker: Sleek Thin Strip with Horizontal Divider */}
      <div
        role="region"
        aria-label="Breaking Exam Updates"
        className="overflow-hidden border-t border-white/[0.22] bg-[#2E333D]"
      >
        <div className="container-page flex items-center gap-3 py-1.5 text-xs">
          <span className="flex shrink-0 items-center gap-1.5 rounded bg-[#F28A2E]/15 border border-[#F28A2E]/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#F28A2E]">
            <Sparkles className="h-3 w-3" aria-hidden="true" /> Latest
          </span>
          <div className="overflow-hidden relative flex-1">
            <div className="animate-marquee whitespace-nowrap inline-block hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none">
              {tickerList.map((item, i) => (
                <Link
                  key={i}
                  href={item.slug ? `/post/${item.slug}` : "#"}
                  className="mx-3 inline-flex items-center gap-2 text-white/90 transition hover:text-[#F28A2E] hover:underline focus-visible:underline"
                >
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10.5px] font-semibold text-[#D7D9DC]">
                    {item.category || "Update"}
                  </span>
                  <span className="text-[12.5px] font-medium text-white">{item.title}</span>
                  <span className="ml-2 text-white/30" aria-hidden="true">
                    /
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hamburger Dropdown Drawer Panel */}
      <div
        className={cn(
          "container-page grid transition-all duration-300",
          open ? "grid-rows-[1fr] py-4 border-t border-white/[0.22]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="rounded-xl bg-[#2E333D] border border-white/[0.22] p-4 text-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Primary Routes */}
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#F28A2E]">
                  Navigation
                </p>
                <div className="space-y-1">
                  {nav.map(([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-2.5 py-1.5 text-xs font-medium text-[#D7D9DC] hover:bg-white/10 hover:text-white transition"
                    >
                      {t(`nav.${label.toLowerCase().replace(/\s+/g, "-")}`)}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Exam Sub-Sections */}
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#F28A2E]">
                  Exam Categories
                </p>
                <div className="space-y-1">
                  {examSubNav.map(([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-2.5 py-1.5 text-xs font-medium text-[#D7D9DC] hover:bg-white/10 hover:text-white transition"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Study Hub */}
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#F28A2E]">
                  Study Hub
                </p>
                <div className="space-y-1">
                  {studyHubSubNav.map(([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-2.5 py-1.5 text-xs font-medium text-[#D7D9DC] hover:bg-white/10 hover:text-white transition"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Tools */}
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#F28A2E]">
                  Candidate Tools
                </p>
                <div className="grid grid-cols-1 gap-1">
                  {[
                    ["Job Finder", "/job-finder"],
                    ["Eligibility Checker", "/eligibility-checker"],
                    ["Salary Calculator", "/salary-calculator"],
                    ["Exam Calendar", "/exam-calendar"],
                    ["Mock Tests", "/mock-tests"],
                    ["All Tools →", "/tools"],
                  ].map(([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className="rounded-md bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-[#D7D9DC] hover:bg-white/[0.1] hover:text-[#F28A2E] transition"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </header>
  );
}
