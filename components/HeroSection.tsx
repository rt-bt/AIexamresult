"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { VoiceSearchBtn } from "./site/voice-search";
import { HeroBackground } from "./HeroBackground";
import { LiveUpdateItem } from "./LiveUpdatesCard";
import { CategoryTiles, CategoryCounts } from "./CategoryTiles";
import { JobHuntConstellation } from "./site/jobhunt-constellation";
import type { PostCard } from "@/lib/data";

interface HeroSectionProps {
  liveUpdates?: LiveUpdateItem[];
  counts?: CategoryCounts;
  constellationJobs?: PostCard[];
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

export function HeroSection({
  liveUpdates = [],
  counts,
  constellationJobs = []
}: HeroSectionProps) {
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
    <section className="relative w-full bg-[#071322] text-white font-sans border-b border-white/10 overflow-hidden">
      {/* 1. Base ambient gradient */}
      <HeroBackground />

      {/* 2. Full-bleed 3D Bioluminescent JobHunt Constellation Background */}
      <JobHuntConstellation
        items={constellationJobs}
        variant="background"
      />

      {/* 3. Foreground Hero Typography & Interactions */}
      <div className="relative z-10 container-page pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-32 pointer-events-none">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">

          {/* Live Pill badge */}
          <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1 rounded-full bg-black/40 border border-white/15 text-[12px] font-medium text-white/85 backdrop-blur-md pointer-events-auto shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Live • Official Government Exam Updates
          </div>

          {/* H1 */}
          <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.08] text-white font-heading mb-4 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            Exam{" "}
            <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent">
              results
            </span>
            ,<br className="hidden sm:inline" />{" "}finally made simple.
          </h1>

          {/* Subtext */}
          <p className="text-[15px] sm:text-lg text-white/70 max-w-xl mb-7 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            Government exam results, admit cards, answer keys and job
            notifications — all in one place with direct official links.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl mb-4 pointer-events-auto">
            <div className="group flex items-center w-full rounded-2xl bg-white p-2 border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-all focus-within:shadow-[0_12px_40px_rgba(13,148,136,0.3)] focus-within:ring-2 focus-within:ring-[#0D9488]">
              <div className="flex flex-1 items-center pl-3 min-w-0">
                <Search className="h-5 w-5 text-gray-400 shrink-0 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search SSC CGL, Railway RRB, UPSC, Bihar Police, Results..."
                  aria-label="Search exam name or job title"
                  className="w-full bg-transparent pl-3 pr-2 py-2 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 outline-none"
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
                className="rounded-xl px-5 sm:px-6 py-2.5 text-sm font-semibold text-white bg-[#0D9488] hover:bg-[#0F766E] active:scale-[0.97] transition-all shadow-md shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick chips */}
          <div className="w-full max-w-2xl flex items-center justify-center gap-2 mb-7 flex-wrap pointer-events-auto">
            <span className="text-[11px] text-white/50 shrink-0 font-mono">Popular:</span>
            {QUICK_CHIPS.map(chip => (
              <Link
                key={chip.label}
                href={chip.href}
                className="px-3.5 py-1 rounded-full text-[12px] font-medium text-white/75 bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 transition-all shrink-0 active:scale-95 backdrop-blur-md"
              >
                {chip.label}
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mb-6 pointer-events-auto">
            <Link
              href="/results"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#0D9488] hover:bg-[#0F766E] text-white px-7 py-3 text-sm font-semibold shadow-[0_0_24px_rgba(13,148,136,0.4)] hover:shadow-[0_0_28px_rgba(13,148,136,0.6)] active:scale-[0.98] transition-all"
            >
              Check Latest Results
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/latest-jobs"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white px-7 py-3 text-sm font-semibold active:scale-[0.98] transition-all backdrop-blur-md"
            >
              Browse Latest Jobs
            </Link>
          </div>

          {/* Live Alert ticker pill */}
          {liveUpdates && liveUpdates.length > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/10 text-xs text-white/80 backdrop-blur-md max-w-full pointer-events-auto">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-teal-300 font-bold font-mono uppercase text-[10px] shrink-0">
                Live Alert:
              </span>
              <Link
                href={`/post/${liveUpdates[0].slug}`}
                className="text-white/85 hover:text-white transition-colors truncate max-w-xs sm:max-w-md font-medium"
              >
                {liveUpdates[0].title}
              </Link>
            </div>
          )}

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
