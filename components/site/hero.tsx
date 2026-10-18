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

          {/* CTAs with fadeSlideUp 0.9s */}
          <div
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8 w-full sm:w-auto"
            style={{ animation: "fadeSlideUp 0.8s ease 0.9s both" }}
          >
            <Link
              href="/results"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black hover:scale-105 transition-transform shadow-xl shadow-black/40"
            >
              <span>Check Latest Results</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            
            <Link
              href="/latest-jobs"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-6 py-3 text-sm font-medium transition-colors"
            >
              <span>Browse Latest Jobs</span>
            </Link>
          </div>

          {/* Capsule Search Field */}
          <form
            onSubmit={handleSearch}
            className="w-full sm:max-w-md"
            style={{ animation: "fadeSlideUp 0.8s ease 0.9s both" }}
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center rounded-2xl sm:rounded-full bg-white/95 p-1.5 shadow-2xl backdrop-blur-md border border-white/40 gap-2 sm:gap-0">
              <div className="relative flex-1 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400 shrink-0 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search exam or job"
                  aria-label="Search exam name or job title"
                  className="w-full bg-transparent pl-2.5 pr-2 py-2 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none"
                />
                <VoiceSearchBtn
                  onResult={(val) => {
                    setQuery(val);
                    router.push(`/search?q=${encodeURIComponent(val)}`);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-700 transition mr-1"
                />
              </div>
              <button
                type="submit"
                className="rounded-full px-6 py-2.5 text-xs font-semibold text-white transition-all bg-[#F28A2E] hover:bg-[#FF9E42] shadow-md shrink-0"
              >
                Search
              </button>
            </div>
          </form>

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
