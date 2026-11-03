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
    <section className="relative w-full bg-[#071322] text-white font-sans border-b border-white/10 overflow-hidden min-h-[600px] sm:min-h-[680px] lg:min-h-[720px]">
      {/* 1. Base dark navy background */}
      <HeroBackground />

      {/* 2. Full-bleed 3D JobHunt Constellation — fills entire hero like jobhunt.asmcleod.com */}
      <JobHuntConstellation
        items={constellationJobs}
        variant="background"
      />

      {/* 3. Left-side foreground content — exactly like jobhunt.asmcleod.com layout */}
      <div className="relative z-10 h-full w-full">
        <div className="container-page h-full flex items-center py-16 sm:py-20 lg:py-24">

          {/* Left content block — max half-width so animation shows on right */}
          <div className="w-full max-w-[520px] lg:max-w-[560px] flex flex-col items-start text-left">

            {/* Live Pill badge */}
            <div className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full bg-black/50 border border-white/15 text-[11px] font-semibold text-white/85 backdrop-blur-md shadow-sm tracking-wide uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              Live • Official Exam Updates
            </div>

            {/* H1 — large, bold, left-aligned exactly like jobhunt */}
            <h1 className="text-[36px] sm:text-[52px] lg:text-[60px] font-black tracking-[-0.03em] leading-[1.02] text-white font-heading mb-4">
              Exam{" "}
              <span className="bg-gradient-to-r from-[#00f5d4] via-[#00d4f5] to-[#38bdf8] bg-clip-text text-transparent">
                Results
              </span>
              {" &"}<br />
              <span className="text-white/90">Sarkari Jobs</span>
            </h1>

            {/* Subtext */}
            <p className="text-[15px] sm:text-base text-white/60 max-w-md mb-7 leading-relaxed">
              Government exam results, admit cards, answer keys &amp; job
              notifications — all in one place with direct official links.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="w-full max-w-xl mb-4">
              <div className="group flex items-center w-full rounded-2xl bg-white/95 p-1.5 border border-white/20 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-all focus-within:shadow-[0_16px_48px_rgba(0,240,255,0.2)] focus-within:ring-2 focus-within:ring-[#00f5d4]">
                <div className="flex flex-1 items-center pl-3 min-w-0">
                  <Search className="h-4.5 w-4.5 text-gray-400 shrink-0 pointer-events-none" />
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search SSC CGL, RRB NTPC, UPSC, Bihar Police..."
                    aria-label="Search exam name or job title"
                    className="w-full bg-transparent pl-2.5 pr-2 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none font-medium"
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
                  className="rounded-xl px-5 py-2.5 text-sm font-bold text-white bg-[#0D9488] hover:bg-[#0a7870] active:scale-[0.97] transition-all shadow-md shrink-0"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick chips */}
            <div className="flex items-center gap-1.5 mb-7 flex-wrap">
              <span className="text-[10px] text-white/40 shrink-0 font-mono tracking-widest uppercase">Popular:</span>
              {QUICK_CHIPS.map(chip => (
                <Link
                  key={chip.label}
                  href={chip.href}
                  className="px-3 py-1 rounded-full text-[11px] font-semibold text-white/70 bg-white/8 hover:bg-white/15 border border-white/10 hover:border-[#00f5d4]/40 hover:text-[#00f5d4] transition-all shrink-0 active:scale-95 backdrop-blur-md"
                >
                  {chip.label}
                </Link>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-row items-center gap-3 mb-6 flex-wrap">
              <Link
                href="/results"
                className="group inline-flex items-center gap-2 rounded-full bg-[#0D9488] hover:bg-[#0a7870] text-white px-6 py-3 text-sm font-bold shadow-[0_0_28px_rgba(13,148,136,0.45)] hover:shadow-[0_0_36px_rgba(13,148,136,0.65)] active:scale-[0.97] transition-all"
              >
                Check Results
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/latest-jobs"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 hover:bg-white/15 text-white/90 hover:text-white px-6 py-3 text-sm font-bold active:scale-[0.97] transition-all backdrop-blur-md"
              >
                Latest Jobs
              </Link>
            </div>

            {/* Live Alert ticker */}
            {liveUpdates && liveUpdates.length > 0 && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 border border-[#00f5d4]/25 text-xs text-white/75 backdrop-blur-md max-w-full">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                <span className="text-[#00f5d4] font-bold font-mono uppercase text-[9px] tracking-widest shrink-0">New:</span>
                <Link
                  href={`/post/${liveUpdates[0].slug}`}
                  className="text-white/80 hover:text-white transition-colors truncate font-medium max-w-[260px] sm:max-w-xs"
                >
                  {liveUpdates[0].title}
                </Link>
              </div>
            )}

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
