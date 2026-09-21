"use client";

import { Search, ArrowRight, Briefcase, FileText, CheckCircle2, KeyRound, Sparkles } from "lucide-react";
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
    <form onSubmit={handleSubmit} className="relative mx-auto max-w-2xl">
      <div className="relative flex items-center shadow-lg shadow-black/10 rounded-2xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder="Search by Exam, Post, Department (e.g. SSC CGL, Railway, Police, CTET)..."
          className="w-full rounded-2xl border border-white/25 bg-white/15 pl-12 pr-28 py-3.5 text-sm sm:text-base text-white placeholder-white/60 outline-none backdrop-blur-md transition-all focus:border-white/60 focus:bg-white/20"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          <VoiceSearchBtn
            onResult={(val) => {
              setQuery(val);
              router.push(`/search?q=${encodeURIComponent(val)}`);
            }}
            className="p-2 text-white/70 hover:text-white transition active:scale-90"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs sm:text-sm font-extrabold text-[#0D9488] shadow-md transition hover:bg-white/90 active:scale-95"
          >
            Search
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showDropdown && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1.5 max-h-56 overflow-auto rounded-2xl border border-white/15 bg-[#0F172A]/95 backdrop-blur-md shadow-2xl">
          {filtered.map((e) => (
            <button
              key={e}
              type="button"
              onMouseDown={() => {
                setQuery(e);
                setShowDropdown(false);
                router.push(`/search?q=${encodeURIComponent(e)}`);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
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
      {/* Subtle Background Glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#5EEAD4]/15 blur-3xl rounded-full pointer-events-none" />

      <div className="container-page relative py-8 sm:py-11">
        <div className="mx-auto max-w-3xl text-center">

          {/* Live Notification Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold text-white/90 border border-white/15 mb-3.5 backdrop-blur-sm shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Sarkari Result &amp; Job Alerts 2026
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
            Sarkari Result 2026 : All India Exam Result
          </h1>

          <p className="mx-auto mt-2.5 max-w-2xl text-xs sm:text-sm md:text-base text-white/85 font-medium leading-relaxed">
            India&apos;s fastest portal for verified Government Jobs, Admit Card download, Answer Key &amp; Real-Time Sarkari Results.
          </p>

          {/* Search Box */}
          <div className="mt-5 sm:mt-6">
            <SearchBox />
          </div>

          {/* Trending Searches */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <span className="text-white/60 text-xs font-medium mr-1 inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-300" /> Trending:
            </span>
            {trendingExams.slice(0, 6).map((exam) => (
              <Link
                key={exam}
                href={`/search?q=${encodeURIComponent(exam)}`}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-medium text-white/90 hover:text-white transition-all backdrop-blur-xs"
              >
                {exam}
              </Link>
            ))}
          </div>

          {/* 4 Feature Quick Action Cards */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <Link
              href="/latest-jobs"
              className="group flex flex-col items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 p-3 sm:p-3.5 text-center backdrop-blur-sm transition-all hover:bg-white/20 hover:-translate-y-0.5 hover:shadow-lg hover:border-white/30"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/30 text-indigo-300 group-hover:scale-110 transition-transform">
                <Briefcase className="h-4 w-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-white">Latest Vacancy</span>
              <span className="text-[10px] text-white/60">Apply Online</span>
            </Link>

            <Link
              href="/admit-card"
              className="group flex flex-col items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 p-3 sm:p-3.5 text-center backdrop-blur-sm transition-all hover:bg-white/20 hover:-translate-y-0.5 hover:shadow-lg hover:border-white/30"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/30 text-orange-300 group-hover:scale-110 transition-transform">
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-white">Admit Card</span>
              <span className="text-[10px] text-white/60">Hall Ticket</span>
            </Link>

            <Link
              href="/results"
              className="group flex flex-col items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 p-3 sm:p-3.5 text-center backdrop-blur-sm transition-all hover:bg-white/20 hover:-translate-y-0.5 hover:shadow-lg hover:border-white/30"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/30 text-[#5EEAD4] group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-white">Result</span>
              <span className="text-[10px] text-white/60">Scorecard &amp; Cutoff</span>
            </Link>

            <Link
              href="/answer-key"
              className="group flex flex-col items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 p-3 sm:p-3.5 text-center backdrop-blur-sm transition-all hover:bg-white/20 hover:-translate-y-0.5 hover:shadow-lg hover:border-white/30"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/30 text-purple-300 group-hover:scale-110 transition-transform">
                <KeyRound className="h-4 w-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-white">Answer Key</span>
              <span className="text-[10px] text-white/60">Response Sheet</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
