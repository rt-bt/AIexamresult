"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ArrowRight, ShieldCheck, FileText, CheckCircle2, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { VoiceSearchBtn } from "./voice-search";

/**
 * Looping Video Background with custom fade-in/fade-out transitions
 * via requestAnimationFrame and manual loop on ended event.
 */
function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let timeoutId: NodeJS.Timeout | null = null;
    let isResetting = false;

    const updateFade = () => {
      if (!isResetting && video && video.duration && !isNaN(video.duration)) {
        const cur = video.currentTime;
        const dur = video.duration;
        let op = 1;

        // Fade in over 0.5s at the start (opacity 0 to 1)
        if (cur < 0.5) {
          op = cur / 0.5;
        }
        // Fade out over 0.5s before the end (opacity 1 to 0)
        else if (dur > 0.5 && cur > dur - 0.5) {
          op = Math.max(0, (dur - cur) / 0.5);
        } else {
          op = 1;
        }

        video.style.opacity = String(Math.max(0, Math.min(1, op)));
      }

      animFrameRef.current = requestAnimationFrame(updateFade);
    };

    const handleEnded = () => {
      isResetting = true;
      if (video) {
        video.style.opacity = "0";
      }
      // On ended event: set opacity to 0, wait 100ms, reset currentTime = 0, then play() again
      timeoutId = setTimeout(() => {
        if (video) {
          video.currentTime = 0;
          video.play().catch(() => {});
          isResetting = false;
        }
      }, 100);
    };

    video.addEventListener("ended", handleEnded);

    // Initial play
    video.play().catch(() => {});
    animFrameRef.current = requestAnimationFrame(updateFade);

    return () => {
      video.removeEventListener("ended", handleEnded);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Video Background Layer with requested positioning */}
      <div
        className="absolute w-full h-full"
        style={{ top: "300px", inset: "auto 0 0 0" }}
      >
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
          playsInline
          muted
          autoPlay
          preload="auto"
          className="w-full h-full min-h-[380px] object-cover transition-opacity duration-75"
          style={{ opacity: 0 }}
        />
      </div>

      {/* Gradient overlays: absolute inset-0 bg-gradient-to-b from-background via-transparent to-background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#464B55] via-transparent to-[#464B55] opacity-90 z-10 pointer-events-none"
        aria-hidden="true"
      />
      {/* Dark Slate Tint for high readability and contrast */}
      <div
        className="absolute inset-0 bg-[#343A46]/60 z-10 pointer-events-none"
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
    <section className="relative min-h-[580px] overflow-hidden bg-[#464B55] text-white font-sans border-b border-white/[0.22]">
      {/* Cinematic Looping Video Background Layer */}
      <HeroVideoBackground />

      {/* Main Hero Container with plenty of empty space */}
      <div className="relative z-10 container-page pt-14 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24">
        {/* Clean 2-column layout on desktop; stacked & centered on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading, Description, Buttons, Search */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Small label: “LATEST EXAM UPDATES” */}
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F28A2E]" aria-hidden="true" />
              <span className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#D7D9DC]">
                LATEST EXAM UPDATES
              </span>
            </div>

            {/* Main heading: “Exam results, finally made simple.” with animate-fade-rise */}
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-bold text-white tracking-tight leading-[1.12] mb-6 font-heading animate-fade-rise">
              Exam results,<br />
              <span className="text-[#F28A2E]">finally made simple.</span>
            </h1>

            {/* Description with animate-fade-rise-delay */}
            <p className="text-base sm:text-lg text-[#D7D9DC] max-w-xl mb-9 leading-relaxed font-normal animate-fade-rise-delay">
              Get the latest government exam results, admit cards, answer keys and job notifications in one place.
            </p>

            {/* CTAs: Primary & Secondary with animate-fade-rise-delay-2 */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-8 w-full sm:w-auto animate-fade-rise-delay-2">
              <Link
                href="/results"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F28A2E] hover:bg-[#FF9E42] text-white px-7 py-3.5 text-sm sm:text-[15px] font-bold transition-colors duration-200 shadow-md shadow-black/20 active:scale-[0.99] font-heading"
              >
                <span>Check Latest Results →</span>
              </Link>
              
              <Link
                href="/latest-jobs"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.22] bg-white/[0.05] hover:bg-white/[0.12] text-white px-7 py-3.5 text-sm sm:text-[15px] font-semibold transition-colors duration-200 active:scale-[0.99]"
              >
                <span>Browse Latest Jobs</span>
              </Link>
            </div>

            {/* Simple Search Field Below Buttons: “Search exam or job” with animate-fade-rise-delay-2 */}
            <form
              onSubmit={handleSearch}
              className="w-full sm:max-w-md relative flex items-center animate-fade-rise-delay-2"
            >
              <Search className="absolute left-4 h-4 w-4 text-[#D7D9DC]/70 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search exam or job"
                aria-label="Search exam or job"
                className="w-full rounded-lg border border-white/[0.22] bg-[#343A46]/90 hover:bg-[#343A46] focus:bg-[#343A46] pl-11 pr-24 py-3 text-sm font-medium text-white placeholder-[#D7D9DC]/70 outline-none transition focus:border-[#F28A2E] focus:ring-1 focus:ring-[#F28A2E]"
              />
              <div className="absolute right-2 flex items-center gap-1.5">
                <VoiceSearchBtn
                  onResult={(val) => {
                    setQuery(val);
                    router.push(`/search?q=${encodeURIComponent(val)}`);
                  }}
                  className="p-1.5 text-[#D7D9DC] hover:text-white transition"
                />
                <button
                  type="submit"
                  className="rounded-md bg-[#F28A2E] hover:bg-[#FF9E42] text-white px-3 py-1.5 text-xs font-bold transition-colors font-heading"
                >
                  Search
                </button>
              </div>
            </form>

          </div>

          {/* Right Column: Subtle Abstract Document Texture / Preview (Desktop only, minimal space) */}
          <div className="hidden lg:flex lg:col-span-5 justify-end">
            <div className="w-full max-w-md rounded-xl bg-[#343A46]/85 border border-white/[0.22] p-6 shadow-2xl backdrop-blur-sm relative overflow-hidden">
              {/* Subtle Document Watermark / Abstract Lines Texture */}
              <div 
                className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/[0.02] border border-white/[0.08] pointer-events-none" 
                aria-hidden="true" 
              />
              
              {/* Document Header */}
              <div className="flex items-center justify-between border-b border-white/[0.14] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#F28A2E]" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-white">
                    OFFICIAL NOTIFICATION
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </span>
              </div>

              {/* Document Title & Commission */}
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#D7D9DC] mb-1">
                Staff Selection Commission (SSC)
              </p>
              <h2 className="text-base font-bold text-white mb-3 leading-snug">
                Combined Graduate Level (CGL) 2026 Tier-I Result Declared
              </h2>

              {/* Minimal Cut-Off Abstract Table */}
              <div className="rounded-lg bg-[#2E333D] border border-white/[0.12] p-3 mb-4 text-xs">
                <div className="flex justify-between items-center text-[10.5px] uppercase tracking-wider text-[#D7D9DC] border-b border-white/[0.08] pb-1.5 mb-2">
                  <span>Category</span>
                  <span>Cut-off</span>
                  <span>Status</span>
                </div>
                <div className="space-y-1.5 text-white">
                  <div className="flex justify-between items-center">
                    <span className="text-[#D7D9DC]">Unreserved (UR)</span>
                    <span className="font-bold">142.50</span>
                    <span className="text-emerald-400 font-medium text-[11px]">Qualified</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#D7D9DC]">OBC Non-Creamy</span>
                    <span className="font-bold">138.00</span>
                    <span className="text-emerald-400 font-medium text-[11px]">Qualified</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#D7D9DC]">SC / ST Candidates</span>
                    <span className="font-bold">124.25</span>
                    <span className="text-emerald-400 font-medium text-[11px]">Qualified</span>
                  </div>
                </div>
              </div>

              {/* Abstract Document Bar Lines */}
              <div className="space-y-1.5 mb-5 opacity-40">
                <div className="h-1.5 bg-white/30 rounded w-full" />
                <div className="h-1.5 bg-white/20 rounded w-4/5" />
                <div className="h-1.5 bg-white/20 rounded w-2/3" />
              </div>

              {/* Document Direct Action */}
              <Link
                href="/results"
                className="flex items-center justify-between w-full rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.18] text-white px-4 py-2.5 text-xs font-semibold transition-colors"
              >
                <span>Download Official Gazette &amp; Merit List</span>
                <Download className="h-3.5 w-3.5 text-[#F28A2E]" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Small Stats Section at the Bottom of the Hero (Thin Horizontal Divider) */}
      <div className="relative z-10 border-t border-white/[0.22] bg-[#343A46]/60 backdrop-blur-xs">
        <div className="container-page py-6 sm:py-8">
          {/* Desktop: 4 items in a row with thin vertical dividers; Mobile: 2x2 grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            
            {/* Stat 1: 500+ Exam Updates */}
            <div className="flex flex-col items-center justify-center lg:border-r lg:border-white/[0.14] lg:last:border-r-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
                500+
              </span>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#D7D9DC] mt-1">
                Exam Updates
              </span>
            </div>

            {/* Stat 2: 100% Verified Links */}
            <div className="flex flex-col items-center justify-center lg:border-r lg:border-white/[0.14] lg:last:border-r-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#F28A2E] tracking-tight font-heading">
                100%
              </span>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#D7D9DC] mt-1">
                Verified Links
              </span>
            </div>

            {/* Stat 3: All India Coverage */}
            <div className="flex flex-col items-center justify-center lg:border-r lg:border-white/[0.14] lg:last:border-r-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
                All India
              </span>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#D7D9DC] mt-1">
                Coverage
              </span>
            </div>

            {/* Stat 4: Daily Notifications */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
                Daily
              </span>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#D7D9DC] mt-1">
                Notifications
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
