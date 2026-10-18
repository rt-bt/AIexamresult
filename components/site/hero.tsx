"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ArrowRight, ShieldCheck, FileText, CheckCircle2, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { VoiceSearchBtn } from "./voice-search";

/**
 * Nexum-style Full-bleed Cinematic Looping Video Background
 * URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260803_192301_9231ed6b-c55c-4a48-909c-4ebe11cf2e11.mp4
 * Behavior: Absolutely positioned inset-0, full-cover, autoPlay, loop, muted, playsInline.
 * No overlay gradient; content sits directly over the video at z-10.
 */
function HeroVideoBackground() {
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
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260803_192301_9231ed6b-c55c-4a48-909c-4ebe11cf2e11.mp4"
        playsInline
        muted
        autoPlay
        loop
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
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
      {/* 1. Full-Bleed Video Background (No overlay gradient; sits directly underneath) */}
      <HeroVideoBackground />

      {/* 2. Main Hero Content Layer at z-10 */}
      <div className="relative z-10 container-page flex flex-col justify-between pt-12 pb-14 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20">
        
        {/* Top & Middle Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-end">
          
          {/* Left Column: Headline, Description, CTAs, Capsule Search */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Small Pill Tag: “LATEST EXAM UPDATES” */}
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-lg border border-white/15">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F28A2E]" aria-hidden="true" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                LATEST EXAM UPDATES
              </span>
            </div>

            {/* Main Heading: “Exam results, finally made simple.” */}
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-semibold text-white tracking-tight leading-[1.1] mb-5 font-heading animate-fade-rise drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              Exam results,<br />
              <span className="text-[#F28A2E]">finally made simple.</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-white/85 max-w-xl mb-8 leading-relaxed font-normal animate-fade-rise-delay drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              Get the latest government exam results, admit cards, answer keys and job notifications in one place.
            </p>

            {/* CTAs: Primary Gradient Pill & Secondary Glass Pill */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-7 w-full sm:w-auto animate-fade-rise-delay-2">
              <Link
                href="/results"
                className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white transition-opacity duration-200 active:scale-[0.99] shadow-xl shadow-black/50"
                style={{ background: "linear-gradient(to bottom, #2B2B2B, #101010)" }}
              >
                <span>Check Latest Results →</span>
              </Link>
              
              <Link
                href="/latest-jobs"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white px-7 py-3 text-sm font-medium transition-colors duration-200 active:scale-[0.99]"
              >
                <span>Browse Latest Jobs</span>
              </Link>
            </div>

            {/* Capsule Search Field (Nexum capsule design) */}
            <form
              onSubmit={handleSearch}
              className="w-full sm:max-w-md animate-fade-rise-delay-2"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center rounded-2xl sm:rounded-full bg-white/95 p-1.5 shadow-2xl backdrop-blur-md border border-white/40 gap-2 sm:gap-0">
                <div className="relative flex-1 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400 shrink-0 pointer-events-none" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search exam or job"
                    aria-label="Search exam or job"
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
                  className="rounded-full px-6 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 shadow-md shrink-0"
                  style={{ background: "linear-gradient(to bottom, #2B2B2B, #101010)" }}
                >
                  Search
                </button>
              </div>
            </form>

          </div>

          {/* Right Column: Nexum Glass Cards (Directly over video at z-10) */}
          <div className="hidden lg:flex lg:col-span-5 justify-end">
            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col w-full max-w-sm">
              
              {/* Glass Card 1: Stats Card (with Silkscreen typography) */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-5 shadow-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-silkscreen text-3xl font-normal tracking-tight text-white">
                    42,500+
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                    <CheckCircle2 className="h-3 w-3" />
                    LIVE
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-white/80 font-normal">
                  Aspirants check verified government exam results, cutoffs and admit cards daily.
                </p>
              </div>

              {/* Glass Card 2: Official Notice Bulletin Card */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-5 shadow-2xl">
                {/* Header Row */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="h-6 w-6 rounded-md bg-black flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    S
                  </div>
                  <span className="text-sm font-semibold text-white">
                    Staff Selection Commission
                  </span>
                </div>

                {/* Notice text */}
                <p className="text-xs sm:text-[13px] leading-relaxed text-white/85 mb-4">
                  "SSC CGL 2026 Tier-I official merit list &amp; category-wise cutoff marks published."
                </p>

                {/* Footer Link */}
                <Link
                  href="/results"
                  className="flex items-center justify-between pt-3 border-t border-white/15 text-xs font-semibold text-white hover:text-[#F28A2E] transition-colors"
                >
                  <span>Download Merit List PDF</span>
                  <Download className="h-3.5 w-3.5 text-[#F28A2E]" />
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* 3. Small Stats Section at the Bottom of the Hero (Glass Strip) */}
      <div className="relative z-10 border-t border-white/15 bg-black/40 backdrop-blur-md">
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
