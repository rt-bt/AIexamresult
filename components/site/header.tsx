"use client";

import { Search, Sparkles, Languages, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/site/logo";
import { sectionItems, boardResults, parseDate } from "@/lib/data";
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
  ["Tools", "/tools"],
  ["Contact Us", "/contact"],
  ["About Us", "/about"]
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
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLang();
  const pathname = usePathname();

  const tickerList = useMemo(() => {
    const items = getTickerItems();
    return [...items, ...items];
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#5B0111] border-b border-[#40000b] shadow-md font-sans">
      <div className="h-0.5 bg-gradient-to-r from-[#FFD84D] via-[#FF5B3E] to-[#FFD84D]" />
      <div className="container-page flex h-18 lg:h-22 items-center gap-4 py-2 lg:py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo className="h-16 w-16 lg:h-20 lg:w-20" dark />
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="text-[15px] font-black tracking-tight text-white font-heading">All India</span>
            <span className="text-[11px] font-bold tracking-widest text-[#FFD84D]">EXAM RESULT</span>
          </span>
        </Link>

        <nav className="ml-5 hidden items-center lg:flex">
          {nav.map(([label, href, dropdown]) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return dropdown ? (
              <div key={href} className="group relative">
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-4 py-2 text-[15.5px] font-semibold transition font-heading tracking-wide",
                    isActive ? "bg-white/10 text-[#FFD84D]" : "text-white/90 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {t(`nav.${label.toLowerCase().replace(/\s+/g, "-")}`)}
                  <ChevronDown className="h-4 w-4 transition duration-200 group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute left-1/2 top-full z-50 mt-1.5 w-56 -translate-x-1/2 translate-y-1 scale-95 rounded-xl border border-[#DEDEDE] bg-white py-1.5 shadow-2xl opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
                  <div className="space-y-0.5 p-1.5">
                    {dropdown.map(([subLabel, subHref]) => {
                      const isSubActive = pathname === subHref;
                      return (
                        <Link
                          key={subHref}
                          href={subHref}
                          className={cn(
                            "group/sub relative block rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-all",
                            isSubActive
                              ? "bg-amber-50 text-[#111111]"
                              : "text-[#111111] hover:bg-amber-50/80 hover:text-[#FF5B3E]"
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
                  "rounded-lg px-4 py-2 text-[15.5px] font-semibold transition font-heading tracking-wide",
                  isActive ? "bg-white/10 text-[#FFD84D]" : "text-white/90 hover:bg-white/10 hover:text-white"
                )}
              >
                {t(`nav.${label.toLowerCase().replace(/\s+/g, "-")}`)}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:gap-3">
          <LanguageSelector />
          <BookmarkListBtn />
          <VoiceSearchBtn />
          <Link href="/search" className="hidden items-center gap-2 rounded-full bg-[#FFD84D] px-5 py-2.5 text-[15px] font-bold text-[#111111] transition hover:bg-[#ffe270] lg:inline-flex shadow-md shadow-black/20 font-heading">
            <Search className="h-4.5 w-4.5" /> {t("nav.search")}
          </Link>
          <Link href="/search" className="rounded-full border border-white/20 p-2.5 text-white transition hover:bg-white/15 active:scale-90 flex lg:hidden">
            <Search className="h-4 w-4" />
          </Link>
          <button onClick={() => setOpen((value) => !value)} className="rounded-full border border-white/20 p-2.5 text-white transition hover:bg-white/15 active:scale-90 flex lg:hidden">
            {open ? "✕" : "☰"}
          </button>
        </div>
        </div>

        <div role="region" aria-label="Breaking Exam Updates" className="overflow-hidden border-t border-black/20 bg-[#48000d]">
          <div className="flex items-center gap-3 px-4 py-2 text-sm">
            <span className="flex shrink-0 items-center gap-1.5 rounded-md bg-[#FF5B3E] px-3 py-1 text-xs sm:text-[13px] font-bold text-white shadow-sm font-heading">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-[#FFD84D]" aria-hidden="true" /> Latest Updates
            </span>
            <div className="overflow-hidden relative flex-1">
              <div className="animate-marquee whitespace-nowrap inline-block hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none">
                {tickerList.map((item, i) => (
                  <Link
                    key={i}
                    href={item.slug ? `/post/${item.slug}` : "#"}
                    className="mx-4 inline-flex items-center gap-2 text-white/95 transition hover:text-[#FFD84D] hover:underline focus-visible:underline"
                  >
                    <span className="rounded bg-black/40 px-2 py-0.5 text-xs font-bold text-[#FFD84D] border border-white/10 font-heading">
                      {item.category || "Update"}
                    </span>
                    <span className="text-[13.5px] font-medium text-white/90">{item.title}</span>
                    <span className="ml-2 text-white/40" aria-hidden="true">•</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={cn("container-page grid transition-all lg:hidden", open ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]")}>
          <div className="overflow-hidden">
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-xl">
              {nav.map(([label, href, dropdown]) => (
                <div key={href}>
                  <Link href={href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-semibold text-white/80 transition active:bg-white/10 active:text-white">
                    {t(`nav.${label.toLowerCase().replace(/\s+/g, "-")}`)}
                  </Link>
                  {dropdown && (
                    <div className="ml-3 border-l border-white/10 pl-3">
                      {dropdown.map(([subLabel, subHref]) => (
                        <Link key={subHref} href={subHref} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-xs font-medium text-white/60 transition active:bg-white/10 active:text-white">
                          {t(`nav.${subLabel.toLowerCase().replace(/\s+/g, "-")}`)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="mt-3 border-t border-white/10 pt-3">
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-white/40">All Tools</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {["/job-finder","/eligibility-checker","/salary-calculator","/vacancy-analyzer","/fee-calculator","/form-guide","/syllabus-tracker","/mock-tests","/current-affairs","/objection-tracker","/counselling-guide","/difficulty-meter","/exam-comparison","/document-checklist","/question-papers","/state-map","/dashboard","/result-predictor","/exam-calendar","/iq-test"].map((href) => {
                    const label = href.replace("/","").split("-").map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(" ");
                    return (
                      <Link key={href} href={href} onClick={() => setOpen(false)}
                        className="rounded-lg px-2 py-1.5 text-[10px] font-medium text-white/60 transition active:bg-white/10 active:text-white text-center leading-tight">
                        {label}
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div className="mt-3 border-t border-white/10 pt-3">
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-white/40">More</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {["/dashboard","/state-map","/results","/exam-calendar","/latest-jobs","/admit-card","/answer-key","/contact","/about"].map((href) => {
                    const label = href.replace("/","").split("-").map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(" ");
                    return (
                      <Link key={href} href={href} onClick={() => setOpen(false)}
                        className="rounded-lg px-2 py-1.5 text-[10px] font-medium text-white/60 transition active:bg-white/10 active:text-white text-center leading-tight">
                        {label}
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div className="mt-2">
                <LanguageSelector />
              </div>
            </div>
          </div>
      </div>
      <MobileBottomNav />
    </header>
  );
}
