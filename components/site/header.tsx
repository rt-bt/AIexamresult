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
  const categoryLists = [
    sectionItems["latest-jobs"] || [],
    sectionItems["results"] || [],
    sectionItems["admit-card"] || [],
    sectionItems["answer-key"] || [],
    sectionItems["admissions"] || [],
    sectionItems["documents"] || [],
    boardResults || [],
  ];

  const mixed: (typeof categoryLists[0][0])[] = [];
  const seen = new Set<string>();

  let maxLen = 0;
  for (const list of categoryLists) {
    if (list.length > maxLen) maxLen = list.length;
  }

  for (let i = 0; i < maxLen && mixed.length < 40; i++) {
    for (const list of categoryLists) {
      if (i < list.length) {
        const item = list[i];
        const key = item.slug || item.title;
        if (key && !seen.has(key)) {
          seen.add(key);
          mixed.push(item);
          if (mixed.length >= 40) break;
        }
      }
    }
  }

  return mixed;
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
    <header className="sticky top-0 z-50 bg-[#0D9488]">
      <div className="h-1 bg-gradient-to-r from-[#F97316] via-[#EA580C] to-[#4F46E5]" />
      <div className="container-page flex h-20 lg:h-28 items-center gap-4 py-2 lg:py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo className="h-20 w-20 lg:h-24 lg:w-24" dark />
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="text-[15px] font-black tracking-tight text-white">All India</span>
            <span className="text-[11px] font-bold tracking-wide text-white/70">EXAM RESULT</span>
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
                    "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[15px] font-semibold transition",
                    isActive ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/15 hover:text-white"
                  )}
                >
                  {t(`nav.${label.toLowerCase().replace(/\s+/g, "-")}`)}
                  <ChevronDown className="h-3.5 w-3.5 transition duration-200 group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute left-1/2 top-full z-50 mt-1.5 w-52 -translate-x-1/2 translate-y-1 scale-95 rounded-xl bg-white py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
                  <div className="pointer-events-none absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-sm bg-white" />
                  <div className="absolute left-4 right-4 top-0 h-px bg-gradient-to-r from-transparent via-teal-200 to-transparent" />
                  <div className="space-y-0.5 p-1.5">
                    {dropdown.map(([subLabel, subHref]) => {
                      const isSubActive = pathname === subHref;
                      return (
                        <Link
                          key={subHref}
                          href={subHref}
                          className={cn(
                            "group/sub relative block rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all",
                            isSubActive
                              ? "bg-teal-50 text-teal-700"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          )}
                        >
                          <span className={cn(
                            "absolute left-0 top-1/2 h-0 w-0.5 -translate-y-1/2 rounded-full bg-teal-500 transition-all",
                            "group-hover/sub:h-5"
                          )} />
                          {t(`nav.${subLabel.toLowerCase().replace(/\s+/g, "-")}`)}
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
                  "rounded-lg px-3.5 py-2 text-[15px] font-semibold transition",
                  isActive ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/15 hover:text-white"
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
          <Link href="/search" className="hidden items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#0D9488] transition hover:bg-white/90 lg:inline-flex">
            <Search className="h-4 w-4" /> {t("nav.search")}
          </Link>
          <Link href="/search" className="rounded-full border border-white/20 p-2.5 text-white transition hover:bg-white/15 active:scale-90 flex lg:hidden">
            <Search className="h-4 w-4" />
          </Link>
          <button onClick={() => setOpen((value) => !value)} className="rounded-full border border-white/20 p-2.5 text-white transition hover:bg-white/15 active:scale-90 flex lg:hidden">
            {open ? "✕" : "☰"}
          </button>
        </div>
        </div>

        <div className="overflow-hidden border-t border-white/10 bg-[#0F766E]">
          <div className="flex items-center gap-2.5 px-3 py-1.5 text-xs">
            <span className="flex shrink-0 items-center gap-1 rounded-md bg-[#EA580C] px-2 py-0.5 text-[11px] font-extrabold text-white shadow-sm">
              <Sparkles className="h-3 w-3 animate-pulse" /> Latest Updates
            </span>
            <div className="overflow-hidden relative flex-1">
              <div className="animate-marquee whitespace-nowrap inline-block hover:[animation-play-state:paused]">
                {tickerList.map((item, i) => (
                  <Link
                    key={i}
                    href={item.slug ? `/post/${item.slug}` : "#"}
                    className="mx-3.5 inline-flex items-center gap-1.5 text-white/90 transition hover:text-white hover:underline"
                  >
                    <span className="rounded bg-white/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-300 border border-white/10">
                      {item.category || "Update"}
                    </span>
                    <span className="text-[12px] font-medium">{item.title}</span>
                    <span className="ml-2 text-white/30">•</span>
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
