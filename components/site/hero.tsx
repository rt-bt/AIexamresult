"use client";

import { Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import { trendingExams } from "@/lib/data";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VoiceSearchBtn } from "./voice-search";

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

function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = query.trim()
    ? examOptions.filter((e) => e.toLowerCase().includes(query.toLowerCase()))
    : [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative mx-auto max-w-xl">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder="Search Exam, Job or Result (e.g. SSC CGL, Railway, CTET)..."
          className="w-full rounded-xl border border-white/20 bg-white/10 pl-10 pr-24 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-white/50 outline-none backdrop-blur-md transition-all focus:border-white/50 focus:bg-white/15"
        />
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <VoiceSearchBtn
            onResult={(val) => {
              setQuery(val);
              router.push(`/search?q=${encodeURIComponent(val)}`);
            }}
            className="p-1.5 text-white/70 hover:text-white transition active:scale-90"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#0D9488] shadow-sm transition hover:bg-white/90 active:scale-95"
          >
            Search
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {showDropdown && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-48 overflow-auto rounded-xl border border-white/15 bg-[#0F172A]/95 backdrop-blur-md shadow-2xl">
          {filtered.map((e) => (
            <button
              key={e}
              type="button"
              onMouseDown={() => {
                setQuery(e);
                setShowDropdown(false);
                router.push(`/search?q=${encodeURIComponent(e)}`);
              }}
              className="w-full px-4 py-2 text-left text-xs sm:text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#0F172A] text-white">
      <div className="container-page relative py-5 sm:py-7">
        <div className="mx-auto max-w-3xl text-center">

          {/* Compact Live Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-0.5 text-[11px] font-semibold text-white/90 border border-white/15 mb-2.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Sarkari Result &amp; Job Alerts 2026
          </div>

          {/* Compact Clean Headline */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
            Sarkari Result 2026 : Latest{" "}
            <span className="text-[#5EEAD4]">Jobs</span>,{" "}
            <span className="text-[#FBBF24]">Admit Card</span> &amp;{" "}
            <span className="text-[#A78BFA]">Results</span>
          </h1>

          <p className="mx-auto mt-1.5 max-w-xl text-xs sm:text-sm text-white/80 font-medium">
            Fastest real-time updates for Government Jobs, Admit Card, Answer Key &amp; Sarkari Results.
          </p>

          {/* Sleek Search Bar */}
          <div className="mt-3.5">
            <SearchBox />
          </div>

          {/* Trending Exam Chips */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <span className="text-white/60 text-[11px] font-medium mr-1 hidden sm:inline">Trending:</span>
            {trendingExams.slice(0, 6).map((exam) => (
              <Link
                key={exam}
                href={`/search?q=${encodeURIComponent(exam)}`}
                className="px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-medium text-white/85 hover:text-white transition-all"
              >
                {exam}
              </Link>
            ))}
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="mt-3.5 flex flex-wrap justify-center gap-2">
            {[
              { label: "⚡ Latest Vacancy", href: "/latest-jobs", bg: "bg-indigo-500/25 border-indigo-400/30 hover:bg-indigo-500/40" },
              { label: "🎟️ Admit Card", href: "/admit-card", bg: "bg-orange-500/25 border-orange-400/30 hover:bg-orange-500/40" },
              { label: "🎯 Result", href: "/results", bg: "bg-teal-500/25 border-teal-400/30 hover:bg-teal-500/40" },
              { label: "🔑 Answer Key", href: "/answer-key", bg: "bg-purple-500/25 border-purple-400/30 hover:bg-purple-500/40" },
              { label: "📄 Documents", href: "/documents", bg: "bg-amber-500/25 border-amber-400/30 hover:bg-amber-500/40" },
            ].map((btn) => (
              <Link
                key={btn.href}
                href={btn.href}
                className={`px-3 py-1 rounded-lg border text-xs font-bold text-white transition-all backdrop-blur-sm ${btn.bg}`}
              >
                {btn.label}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
