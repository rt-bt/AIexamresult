"use client";

import { Search, Sparkles, Languages } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/site/logo";
import { featuredResults, latestJobs } from "@/lib/data";
import { useLang } from "@/lib/hooks/use-lang";
import { MobileBottomNav } from "@/components/site/mobile-bottom-nav";
import { LanguageSelector } from "@/components/site/language-selector";

const nav: [string, string][] = [
  ["Home", "/"],
  ["Exam", "/exam"],
  ["Study Hub", "/study-hub"],
  ["Tools", "/tools"],
  ["Contact Us", "/contact"],
  ["About Us", "/about"]
];

const tickerItems = [
  ...featuredResults.slice(0, 5),
  ...latestJobs.slice(0, 5),
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLang();

  return (
    <header className="sticky top-0 z-50 bg-[#0D9488]">
      <div className="h-1 bg-gradient-to-r from-[#F97316] via-[#EA580C] to-[#4F46E5]" />
      <div className="container-page flex h-14 lg:h-[4.5rem] items-center gap-4 py-2 lg:py-3">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-auto lg:h-10" showTagline={false} dark />
        </Link>

        <nav className="ml-5 hidden items-center gap-1 lg:flex">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-base font-semibold text-white/80 transition hover:bg-white/15 hover:text-white"
            >
              {t(`nav.${label.toLowerCase().replace(/\s+/g, "-")}`)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:gap-3">
          <LanguageSelector />
          <Link href="/search" className="hidden items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#0D9488] transition hover:bg-white/90 lg:inline-flex">
            <Search className="h-4 w-4" /> {t("nav.search")}
          </Link>
          <Link href="/search" className="rounded-full border border-white/20 p-2 text-white transition hover:bg-white/15 active:scale-90 lg:hidden">
            <Search className="h-4 w-4" />
          </Link>
          <button onClick={() => setOpen((value) => !value)} className="hidden rounded-full border border-white/20 p-2.5 text-white transition hover:bg-white/15 lg:hidden">
            {open ? "✕" : "☰"}
          </button>
        </div>
        </div>

        <div className="hidden lg:block overflow-hidden border-t border-white/10 bg-[#0F766E]">
          <div className="flex items-center gap-3 px-4 py-1.5 text-xs">
            <span className="flex shrink-0 items-center gap-1.5 rounded bg-[#EA580C] px-2 py-1 font-bold text-white">
              <Sparkles className="h-3 w-3" /> Latest
            </span>
            <div className="overflow-hidden">
              <div className="animate-marquee whitespace-nowrap">
                {tickerItems.map((item, i) => (
                  <Link key={i} href={item.slug ? `/post/${item.slug}` : "#"} className="mx-4 inline text-white/80 transition hover:text-white">
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={cn("container-page grid transition-all lg:hidden", open ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]")}>
          <div className="overflow-hidden">
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-xl">
              {nav.map(([label, href]) => (
                <Link key={href} href={href} className="block rounded-xl px-3 py-3 text-sm font-semibold text-white/80 transition active:bg-white/10 active:text-white">
                  {t(`nav.${label.toLowerCase().replace(/\s+/g, "-")}`)}
                </Link>
              ))}
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
