"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { VoiceSearchBtn } from "./site/voice-search";
import { HeroBackground } from "./HeroBackground";
import { LiveUpdatesCard, LiveUpdateItem } from "./LiveUpdatesCard";
import { CategoryTiles, CategoryCounts } from "./CategoryTiles";

interface HeroSectionProps {
  liveUpdates?: LiveUpdateItem[];
  counts?: CategoryCounts;
}

const QUICK_CHIPS = [
  { label: "SSC",     href: "/search?q=SSC"     },
  { label: "Railway", href: "/search?q=Railway"  },
  { label: "UPSC",    href: "/search?q=UPSC"     },
  { label: "Banking", href: "/search?q=Banking"  },
  { label: "Bihar",   href: "/search?q=Bihar"    },
  { label: "UP",      href: "/search?q=UP"       },
  { label: "Police",  href: "/search?q=Police"   },
];

export function HeroSection({ liveUpdates = [], counts }: HeroSectionProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(query.trim()
      ? `/search?q=${encodeURIComponent(query.trim())}`
      : "/results"
    );
  }

  return (
    <section className="relative w-full bg-[#071322] text-white font-sans border-b border-white/10">
      {/* Animated mesh gradient background */}
      <HeroBackground />

      <div className="relative z-10 container-page pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 xl:gap-16 items-center">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">

            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full bg-white/8 border border-white/15 text-[12px] font-medium text-white/70">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              Live • Official Government Exam Updates
            </div>

            {/* H1 */}
            <h1 className="text-3xl sm:text-5xl lg:text-[58px] font-bold tracking-tight leading-[1.08] text-white font-heading mb-4">
              Exam{" "}
              <span className="bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">
                results
              </span>
              ,<br className="hidden sm:inline" />{" "}finally made simple.
            </h1>

            {/* Subtext */}
            <p className="text-[15px] sm:text-base text-white/55 max-w-lg mb-8 leading-relaxed">
              Government exam results, admit cards, answer keys and job
              notifications — all in one place.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="w-full max-w-xl mb-4">
              <div className="group flex items-center w-full rounded-xl bg-white p-1.5 border border-transparent shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all focus-within:shadow-[0_8px_32px_rgba(13,148,136,0.2)] focus-within:ring-1 focus-within:ring-[#0D9488]">
                <div className="flex flex-1 items-center pl-2 min-w-0">
                  <Search className="h-4 w-4 text-gray-400 shrink-0 pointer-events-none" />
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search SSC CGL, RRB NTPC, UPSC, Bihar Police..."
                    aria-label="Search exam name or job title"
                    className="w-full bg-transparent pl-2.5 pr-2 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none"
                  />
                  <VoiceSearchBtn
                    onResult={val => {
                      setQuery(val);
                      router.push(`/search?q=${encodeURIComponent(val)}`);
                    }}
                    className="p-1.5 text-gray-400 hover:text-gray-600 transition mr-1 shrink-0"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-[#0D9488] hover:bg-[#0F766E] active:scale-[0.97] transition-all shrink-0"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick chips */}
            <div className="w-full max-w-xl flex items-center gap-2 mb-8 overflow-x-auto scrollbar-hide -mx-2 px-2 sm:mx-0 sm:px-0 sm:flex-wrap">
              <span className="text-[11px] text-white/35 shrink-0">Popular:</span>
              {QUICK_CHIPS.map(chip => (
                <Link
                  key={chip.label}
                  href={chip.href}
                  className="px-3 py-1 rounded-full text-[12px] font-medium text-white/65 bg-white/8 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all shrink-0 active:scale-95"
                >
                  {chip.label}
                </Link>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Link
                href="/results"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#0D9488] hover:bg-[#0F766E] text-white px-6 py-3 text-sm font-semibold shadow-[0_0_24px_rgba(13,148,136,0.4)] hover:shadow-[0_0_28px_rgba(13,148,136,0.6)] active:scale-[0.98] transition-all"
              >
                Check Latest Results
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/latest-jobs"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/8 hover:bg-white/15 text-white/85 hover:text-white px-6 py-3 text-sm font-semibold active:scale-[0.98] transition-all"
              >
                Browse Latest Jobs
              </Link>
            </div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="lg:col-span-5 w-full">
            <LiveUpdatesCard items={liveUpdates} />
          </div>

        </div>
      </div>

      {/* Category tiles overlapping bottom */}
      <div className="relative z-20 container-page translate-y-8 sm:translate-y-12 -mb-8 sm:-mb-12">
        <CategoryTiles counts={counts} />
      </div>
    </section>
  );
}

export default HeroSection;
