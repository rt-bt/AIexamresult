"use client";

import { Search, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { trendingExams } from "@/lib/data";
import { useRouter } from "next/navigation";
import { VoiceSearchBtn } from "./voice-search";
import { VideoScrubBg } from "./video-scrub-bg";

const examOptions = [
  ...trendingExams,
  "SSC CHSL", "SSC MTS", "SSC GD Constable", "SSC JE", "SSC CPO",
  "RRB NTPC", "RRB Group D", "RRB JE", "RRB Technician",
  "UPSC IAS", "UPSC NDA", "UPSC CDS", "UPSC CAPF",
  "IBPS PO", "IBPS Clerk", "IBPS RRB", "SBI PO", "SBI Clerk",
  "CTET", "UPTET", "REET", "Bihar Board 10th", "Bihar Board 12th",
  "UP Board 10th", "UP Board 12th", "CBSE 10th", "CBSE 12th",
  "NEET UG", "JEE Main", "JEE Advanced", "CUET UG",
  "Indian Army", "Indian Navy", "Indian Air Force", "Agniveer",
];

function ResultFinder() {
  const router = useRouter();
  const [exam, setExam] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = exam
    ? examOptions.filter((e) => e.toLowerCase().includes(exam.toLowerCase()))
    : [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = [exam, rollNo].filter(Boolean).join(" ");
    if (q.length >= 3) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  const quickBadges = ["SSC CGL", "RRB NTPC", "UPSC IAS", "NEET UG", "CTET"];

  return (
    <div className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/15 bg-black/40 p-2 sm:p-2.5 shadow-2xl backdrop-blur-2xl transition hover:border-white/25"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* Exam Name Search Input */}
          <div className="relative flex-1">
            <label htmlFor="hero-search-exam" className="sr-only">Search exam or job</label>
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden="true" />
            <input
              id="hero-search-exam"
              aria-label="Search exam name or job title"
              type="text"
              value={exam}
              onChange={(e) => { setExam(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              placeholder="Search exam (e.g. SSC CGL, Railway, UPSC)..."
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-11 py-3 text-[15px] font-medium text-white placeholder-white/40 outline-none transition focus:border-white/40 focus:bg-white/10 font-sans"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <VoiceSearchBtn
                onResult={(val) => {
                  setExam(val);
                  router.push(`/search?q=${encodeURIComponent(val)}`);
                }}
                className="p-1.5 text-white/50 hover:text-white transition active:scale-95"
              />
            </div>
            {showDropdown && filtered.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-56 overflow-auto rounded-xl border border-white/15 bg-black/90 py-1.5 shadow-2xl backdrop-blur-2xl">
                {filtered.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onMouseDown={() => { setExam(e); setShowDropdown(false); }}
                    className="w-full px-4 py-2.5 text-left text-[14.5px] font-medium text-white/80 transition hover:bg-white/15 hover:text-white font-sans"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Roll No input */}
          <div className="relative sm:w-48">
            <label htmlFor="hero-search-roll" className="sr-only">Roll number</label>
            <input
              id="hero-search-roll"
              aria-label="Roll number (optional)"
              type="text"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="Roll No. (Optional)"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[15px] font-medium text-white placeholder-white/40 outline-none transition focus:border-white/40 focus:bg-white/10 font-sans"
            />
          </div>

          {/* Submit CTA button (Brand Accent #FF5B3E) */}
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF5B3E] px-6 py-3 text-[15px] font-bold text-white shadow-md shadow-black/25 transition-all duration-200 hover:bg-[#e0482d] active:scale-[0.98] font-heading"
          >
            <span>Search</span>
            <ArrowRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </form>

      {/* Quick clickable tags */}
      <div className="mt-3 flex flex-wrap items-center justify-start gap-1.5 text-xs">
        <span className="text-white/40 font-medium mr-1 text-[11px]">Trending:</span>
        {quickBadges.map((badge) => (
          <button
            key={badge}
            type="button"
            onClick={() => router.push(`/search?q=${encodeURIComponent(badge)}`)}
            className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-white/80 backdrop-blur-md transition-colors duration-200 hover:border-[#FFD84D]/60 hover:bg-[#FFD84D]/15 hover:text-[#FFD84D]"
          >
            {badge}
          </button>
        ))}
      </div>
    </div>
  );
}

function Counter({ to, label }: { to: number; label: string }) {
  const [count, setCount] = useState(to);
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setCount(0);
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !done.current) {
        done.current = true;
        let start = 0;
        const dur = 1500;
        const step = Math.ceil(to / (dur / 16));
        const iv = setInterval(() => {
          start += step;
          if (start >= to) { setCount(to); clearInterval(iv); }
          else setCount(start);
        }, 16);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-xl sm:text-2xl font-black text-white tracking-tight">
        {count.toLocaleString()}<span className="text-white/40">+</span>
      </p>
      <p className="text-[11px] uppercase tracking-wider text-white/60 mt-0.5 font-semibold">{label}</p>
    </div>
  );
}

export function Hero() {
  const router = useRouter();

  return (
    <>
      {/* ========================================================
          1. DESKTOP / WEB VIEW (sm:block, hidden on mobile)
          100% UNTOUCHED, EXACT ORIGINAL DESIGN & BACKGROUND
          ======================================================== */}
      <section className="hidden sm:flex relative overflow-hidden min-h-[75vh] md:min-h-[85vh] flex-col justify-center">
        {/* Background: Video scrub + cinematic color blend */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <VideoScrubBg />
          {/* Soft left vignette so text is perfectly readable without hiding the video */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
        </div>

        <div className="container-page relative z-10 py-12 sm:py-20">
          <div className="max-w-2xl text-left">
            {/* Live Badge (Brand Kit: #FFD84D Surface on Dark Glass) */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD84D]/40 bg-[#111111]/80 px-4 py-1.5 text-[13px] font-semibold text-[#FFD84D] backdrop-blur-md mb-4 shadow-sm font-heading">
              <span className="h-2 w-2 rounded-full bg-[#FF5B3E] animate-pulse" />
              <span className="tracking-wide">Live Sarkari Alerts · 2026</span>
            </div>

            {/* Clean 2-Line Headline in Space Grotesk */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[64px] font-bold leading-[1.08] tracking-tight text-white mb-3.5">
              Exam Results, <br className="hidden sm:block" />
              Admit Cards &amp; Jobs.
            </h1>

            {/* Ultra-Short 1-Line Subtitle in DM Sans */}
            <p className="font-sans text-base sm:text-lg text-white/85 max-w-xl mb-7 leading-relaxed">
              Instant verified links for SSC, UPSC, Railway, Banking &amp; State exams.
            </p>

            {/* Action Buttons (#FFD84D Surface Yellow + Clean Frosted Secondary) */}
            <div className="flex flex-wrap items-center gap-3.5 mb-7">
              <button
                onClick={() => {
                  const searchEl = document.getElementById("hero-search-exam");
                  searchEl?.focus();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFD84D] px-7 py-3 text-[15px] font-bold text-[#111111] shadow-lg shadow-black/25 transition hover:bg-[#ffe270] hover:scale-[1.01] active:scale-[0.98] font-heading"
              >
                <span>Find Results</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </button>

              <button
                onClick={() => router.push("/latest-jobs")}
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-7 py-3 text-[15px] font-semibold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-[0.98] font-heading"
              >
                <span>Latest Jobs</span>
              </button>
            </div>

            {/* Clean Search Bar */}
            <div className="max-w-xl">
              <ResultFinder />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. MOBILE VIEW ONLY (sm:hidden, only on phones)
          CLEAN, SPACIOUS, UNCLUTTERED, NO VIDEO ARTIFACTS
          ======================================================== */}
      <section className="sm:hidden relative overflow-hidden bg-[#5B0111] px-4 py-8">
        {/* Subtle crimson radial gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#7a0217_0%,_#45000c_100%)] pointer-events-none" />

        <div className="relative z-10 max-w-md mx-auto">
          {/* Compact Live Alert Pill */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FFD84D]/40 bg-black/30 px-3 py-1 text-[11px] font-bold text-[#FFD84D] mb-3">
            <span className="h-2 w-2 rounded-full bg-[#FF5B3E] animate-pulse" />
            <span>Sarkari Result 2026</span>
          </div>

          {/* Minimal, Uncluttered Title */}
          <h2 className="font-heading text-[25px] font-extrabold text-white leading-tight tracking-tight mb-4">
            Exam Results &amp; Job Alerts
          </h2>

          {/* Clean Mobile Search Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.currentTarget.elements.namedItem("m-exam") as HTMLInputElement)?.value;
              if (input && input.length >= 2) router.push(`/search?q=${encodeURIComponent(input)}`);
            }}
            className="rounded-2xl border border-white/20 bg-black/40 p-2 shadow-xl backdrop-blur-xl"
          >
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-white/50" />
              <input
                name="m-exam"
                type="text"
                aria-label="Search exam name or job title"
                placeholder="Search exam (SSC, Railway, Police)..."
                className="w-full rounded-xl border border-white/10 bg-white/10 pl-10 pr-24 py-2.5 text-[14px] font-medium text-white placeholder-white/50 outline-none focus:border-[#FFD84D]/60 focus:bg-white/15 font-sans"
              />
              <button
                type="submit"
                className="absolute right-1 inline-flex items-center justify-center rounded-lg bg-[#FFD84D] px-3.5 py-1.5 text-xs font-bold text-[#111111] hover:bg-[#ffe270] active:scale-95 transition font-heading"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Trending Badges */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#FFD84D]/80">Trending:</span>
            {["SSC CGL", "RRB NTPC", "UPSC", "NEET", "CTET"].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => router.push(`/search?q=${encodeURIComponent(tag)}`)}
                className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/90 active:scale-95 transition hover:bg-white/20"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

