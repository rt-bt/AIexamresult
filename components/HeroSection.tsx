"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
  Globe2,
  Bell,
} from "lucide-react";
import { VoiceSearchBtn } from "./site/voice-search";
import { HeroBackground } from "./HeroBackground";
import { LiveUpdatesCard, LiveUpdateItem } from "./LiveUpdatesCard";
import { CategoryTiles, CategoryCounts } from "./CategoryTiles";

interface HeroSectionProps {
  liveUpdates?: LiveUpdateItem[];
  counts?: CategoryCounts;
}

const QUICK_CHIPS = [
  { label: "SSC", href: "/search?q=SSC" },
  { label: "Railway", href: "/search?q=Railway" },
  { label: "UPSC", href: "/search?q=UPSC" },
  { label: "Banking", href: "/search?q=Banking" },
  { label: "Bihar", href: "/search?q=Bihar" },
  { label: "UP", href: "/search?q=UP" },
  { label: "Police", href: "/search?q=Police" },
];

export function HeroSection({ liveUpdates = [], counts }: HeroSectionProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/results");
    }
  }

  return (
    <section className="relative w-full bg-[#071322] text-white font-sans border-b border-white/10">
      {/* Background Layer: Mesh gradient, drifting orbs, dot-grid */}
      <HeroBackground />

      {/* Main Hero Container */}
      <div className="relative z-10 container-page pt-12 pb-14 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          
          {/* ========================================================
              LEFT COLUMN: Headline, Search, Chips, CTAs, Trust Row
             ======================================================== */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Pill Badge with Pulsing Live Dot */}
            <div className="inline-flex items-center gap-2 mb-4 sm:mb-5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-[13px] font-medium text-white/95 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Live • Official Government Exam Updates</span>
            </div>

            {/* H1 Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] text-white font-heading mb-4 sm:mb-5">
              Exam{" "}
              <span className="bg-gradient-to-r from-teal-300 via-teal-400 to-cyan-300 bg-clip-text text-transparent">
                results
              </span>
              ,<br className="hidden sm:inline" /> finally made simple.
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-white/70 max-w-xl mb-6 sm:mb-8 leading-relaxed font-normal">
              Get the latest government exam results, admit cards, answer keys
              and job notifications in one place.
            </p>

            {/* Large Glass Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-xl mb-3.5">
              <div className="group relative flex items-center w-full rounded-2xl bg-white/95 backdrop-blur-xl p-1.5 sm:p-2 border border-white/40 shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-black/5 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#0D9488] focus-within:border-[#0D9488]">
                <div className="relative flex-1 flex items-center pl-2.5 sm:pl-3 min-w-0">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 shrink-0 pointer-events-none group-focus-within:text-[#0D9488] transition-colors" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search SSC CGL, RRB NTPC, UPSC, Bihar Police..."
                    aria-label="Search exam name or job title"
                    className="w-full bg-transparent pl-2.5 sm:pl-3 pr-2 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none"
                  />
                  <VoiceSearchBtn
                    onResult={(val) => {
                      setQuery(val);
                      router.push(`/search?q=${encodeURIComponent(val)}`);
                    }}
                    className="p-1 sm:p-1.5 text-gray-400 hover:text-gray-700 transition mr-1 shrink-0"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition-all duration-200 bg-[#0D9488] hover:bg-[#0F766E] shadow-md hover:shadow-lg active:scale-95 shrink-0 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1"
                >
                  <span>Search</span>
                </button>
              </div>
            </form>

            {/* Quick-Search Chips: Horizontal scroll on mobile, wrap on desktop */}
            <div className="w-full max-w-xl flex items-center gap-2 mb-6 sm:mb-8 overflow-x-auto scrollbar-hide py-1 -mx-2 px-2 sm:mx-0 sm:px-0 sm:flex-wrap">
              <span className="text-xs text-white/50 font-medium shrink-0">
                Popular:
              </span>
              {QUICK_CHIPS.map((chip) => (
                <Link
                  key={chip.label}
                  href={chip.href}
                  className="px-3 py-1 rounded-full text-xs font-medium text-white/85 bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md transition-all shrink-0 hover:text-white hover:border-teal-400/50 active:scale-95"
                >
                  {chip.label}
                </Link>
              ))}
            </div>

            {/* Two CTAs: Full-width on mobile, row on desktop */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-8 sm:mb-10">
              <Link
                href="/results"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#0D9488] hover:bg-[#0F766E] text-white px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold shadow-[0_0_30px_rgba(13,148,136,0.45)] hover:shadow-[0_0_35px_rgba(13,148,136,0.65)] active:scale-[0.98] transition-all duration-300"
              >
                <span>Check Latest Results</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="h-3 w-3 text-white" />
                </span>
              </Link>

              <Link
                href="/latest-jobs"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/40 text-white px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold shadow-sm active:scale-[0.98] transition-all duration-300"
              >
                <span>Browse Latest Jobs</span>
              </Link>
            </div>

            {/* Trust Row: 4 compact pills */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs text-white/80 font-medium">
                <GraduationCap className="h-3.5 w-3.5 text-teal-300 shrink-0" />
                <span>500+ Exam Updates</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs text-white/80 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>100% Verified Links</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs text-white/80 font-medium">
                <Globe2 className="h-3.5 w-3.5 text-sky-300 shrink-0" />
                <span>All India Coverage</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs text-white/80 font-medium">
                <Bell className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                <span>Daily Live Alerts</span>
              </div>
            </div>

          </div>

          {/* ========================================================
              RIGHT COLUMN: Glassmorphism Live Updates Card
             ======================================================== */}
          <div className="lg:col-span-5 w-full">
            <LiveUpdatesCard items={liveUpdates} />
          </div>

        </div>
      </div>

      {/* ========================================================
          CATEGORY TILES (Overlapping bottom edge by ~48px)
         ======================================================== */}
      <div className="relative z-20 container-page translate-y-8 sm:translate-y-12 -mb-8 sm:-mb-12">
        <CategoryTiles counts={counts} />
      </div>
    </section>
  );
}

export default HeroSection;
