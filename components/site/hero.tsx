"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { VoiceSearchBtn } from "./voice-search";

/**
 * Fullscreen Foldcraft Looping Video Background
 * URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204221_5339e40b-e73d-4ab0-9c65-79c18c66fd50.mp4
 * Styling: absolute positioned, full width/height, object-cover, object-position at 70% horizontal center
 * Attributes: autoPlay, muted, loop, playsInline
 */
function HeroFoldcraftVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204221_5339e40b-e73d-4ab0-9c65-79c18c66fd50.mp4"
        playsInline
        muted
        autoPlay
        loop
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "70% center" }}
      />
      {/* Subtle bottom fade to blend with the stats divider */}
      <div
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}

export function Hero() {
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
    <section className="relative min-h-[620px] lg:min-h-[700px] w-full overflow-hidden bg-black text-white font-sans border-b border-white/15">
      {/* 1. Foldcraft Video Background Layer */}
      <HeroFoldcraftVideoBackground />

      {/* 2. Main Hero Content Layer at z-10 */}
      <div className="relative z-10 container-page flex flex-col justify-center pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24">
        
        {/* Content Column: Badge, Heading, Description, CTAs, Capsule Search */}
        <div className="max-w-2xl lg:max-w-3xl flex flex-col items-center lg:items-start text-center lg:text-left">
          
          {/* Top Badge with fadeSlideUp 0.2s */}
          <div
            className="inline-flex items-center gap-2 mb-5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
            style={{ animation: "fadeSlideUp 0.8s ease 0.2s both" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#F28A2E]" aria-hidden="true" />
            <span className="text-xs sm:text-[13px] font-medium tracking-wide text-white/95">
              Official Government Exam Updates
            </span>
          </div>

          {/* Main Heading with fadeSlideUp 0.4s */}
          <h1
            className="text-3xl sm:text-5xl lg:text-[58px] font-medium tracking-tight leading-[1.1] mb-5 font-heading drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]"
            style={{ animation: "fadeSlideUp 0.8s ease 0.4s both" }}
          >
            Exam results,<br />
            <span className="text-[#F28A2E]">finally made simple.</span>
          </h1>

          {/* Description with fadeSlideUp 0.7s */}
          <p
            className="text-base sm:text-lg text-white/80 max-w-xl mb-8 leading-relaxed font-normal drop-shadow-md"
            style={{ animation: "fadeSlideUp 0.8s ease 0.7s both" }}
          >
            Get the latest government exam results, admit cards, answer keys and job notifications in one place.
          </p>

          {/* Unified Hero Interactive Command Deck (Search & CTAs) */}
          <div
            className="w-full max-w-xl flex flex-col items-stretch lg:items-start gap-4 mb-2"
            style={{ animation: "fadeSlideUp 0.8s ease 0.9s both" }}
          >
            {/* Primary Command Search Bar */}
            <form onSubmit={handleSearch} className="w-full">
              <div className="group relative flex items-center w-full rounded-full bg-white/95 backdrop-blur-xl p-1.5 sm:p-2 border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.35)] ring-1 ring-black/5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#F28A2E] focus-within:border-[#F28A2E] focus-within:shadow-[0_8px_32px_rgba(242,138,46,0.25)]">
                <div className="relative flex-1 flex items-center pl-2.5 sm:pl-3 min-w-0">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 shrink-0 pointer-events-none group-focus-within:text-[#F28A2E] transition-colors" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search exam or job (e.g. SSC, UPSC, Railway)"
                    aria-label="Search exam name or job title"
                    className="w-full bg-transparent pl-2.5 sm:pl-3 pr-2 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none"
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
                  className="rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white transition-all duration-200 bg-[#F28A2E] hover:bg-[#FF9E42] shadow-md hover:shadow-lg active:scale-95 shrink-0 flex items-center justify-center gap-1.5"
                >
                  <span>Search</span>
                </button>
              </div>
            </form>

            {/* Quick Action Navigation Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Link
                href="/results"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-gray-950 shadow-lg shadow-black/30 hover:bg-white/95 hover:shadow-[0_4px_20px_rgba(255,255,255,0.25)] active:scale-[0.98] transition-all duration-300"
              >
                <span>Check Latest Results</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/5 group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="h-3 w-3 text-gray-950" />
                </span>
              </Link>
              
              <Link
                href="/latest-jobs"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/40 text-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold shadow-sm active:scale-[0.98] transition-all duration-300"
              >
                <span>Browse Latest Jobs</span>
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Small Stats Section at the Bottom of the Hero (Glass Strip) */}
      <div className="relative z-10 border-t border-white/15 bg-black/60 backdrop-blur-md">
        <div className="container-page py-5 sm:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
            
            {/* Stat 1: 500+ Exam Updates */}
            <div className="flex flex-col items-center justify-center lg:border-r lg:border-white/15 lg:last:border-r-0">
              <span className="font-silkscreen text-2xl sm:text-3xl font-normal text-white tracking-tight">
                500+
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 mt-1">
                Exam Updates
              </span>
            </div>

            {/* Stat 2: 100% Verified Links */}
            <div className="flex flex-col items-center justify-center lg:border-r lg:border-white/15 lg:last:border-r-0">
              <span className="font-silkscreen text-2xl sm:text-3xl font-normal text-[#F28A2E] tracking-tight">
                100%
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 mt-1">
                Verified Links
              </span>
            </div>

            {/* Stat 3: All India Coverage */}
            <div className="flex flex-col items-center justify-center lg:border-r lg:border-white/15 lg:last:border-r-0">
              <span className="font-silkscreen text-2xl sm:text-3xl font-normal text-white tracking-tight">
                PAN-IN
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 mt-1">
                All India Coverage
              </span>
            </div>

            {/* Stat 4: Daily Notifications */}
            <div className="flex flex-col items-center justify-center">
              <span className="font-silkscreen text-2xl sm:text-3xl font-normal text-white tracking-tight">
                DAILY
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 mt-1">
                Live Notifications
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
