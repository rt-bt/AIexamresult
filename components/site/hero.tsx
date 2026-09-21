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
      <div className="group relative flex items-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg shadow-black/15 transition-all focus-within:border-[#5EEAD4]/60 focus-within:bg-white/15 focus-within:ring-4 focus-within:ring-[#5EEAD4]/10">
        <Search className="absolute left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-white/50 group-focus-within:text-[#5EEAD4] transition-colors pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder="Search by Exam, Job, Result or Board (e.g. SSC CGL, Railway, CTET)..."
          className="w-full bg-transparent pl-11 sm:pl-12 pr-28 py-3 text-xs sm:text-sm text-white placeholder-white/50 outline-none"
        />
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <VoiceSearchBtn
            onResult={(val) => {
              setQuery(val);
              router.push(`/search?q=${encodeURIComponent(val)}`);
            }}
            className="p-1.5 text-white/70 hover:text-white transition-all active:scale-90"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-[#5EEAD4] to-[#2DD4BF] px-3.5 py-1.5 sm:py-2 text-xs font-black text-slate-900 shadow-sm transition-all hover:brightness-105 active:scale-95 cursor-pointer"
          >
            Search
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {showDropdown && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-40 mt-1.5 max-h-52 overflow-auto rounded-xl border border-white/15 bg-slate-950/95 backdrop-blur-xl shadow-2xl divide-y divide-white/5">
          {filtered.map((e) => (
            <button
              key={e}
              type="button"
              onMouseDown={() => {
                setQuery(e);
                setShowDropdown(false);
                router.push(`/search?q=${encodeURIComponent(e)}`);
              }}
              className="w-full px-4 py-2.5 text-left text-xs sm:text-sm text-white/85 transition hover:bg-[#0D9488]/20 hover:text-white"
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
      {/* Decorative Radial Background Lights */}
      <div className="absolute -top-20 left-1/4 h-64 w-64 rounded-full bg-[#5EEAD4]/15 blur-3xl pointer-events-none" />
      <div className="absolute -top-10 right-1/4 h-64 w-64 rounded-full bg-[#38BDF8]/10 blur-3xl pointer-events-none" />

      <div className="container-page relative py-6 sm:py-8">
        <div className="mx-auto max-w-3xl text-center">

          {/* Polished Live Updates Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-md shadow-xs mb-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Live Sarkari Result &amp; Job Alerts 2026
          </div>

          {/* Refined Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-white leading-tight">
            Sarkari Result 2026 : All India Exam Result
          </h1>

          <p className="mx-auto mt-1.5 max-w-xl text-xs sm:text-sm text-white/80 font-medium leading-normal">
            Fastest alerts for verified Sarkari Naukri, Admit Card, Answer Key &amp; Real-Time Exam Results.
          </p>

          {/* Search Box */}
          <div className="mt-4 sm:mt-4.5">
            <SearchBox />
          </div>

          {/* Polished Trending Chips */}
          <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <span className="inline-flex items-center gap-1 text-white/60 text-[11px] font-medium mr-1">
              <Sparkles className="h-3 w-3 text-amber-300" /> Trending:
            </span>
            {trendingExams.slice(0, 6).map((exam) => (
              <Link
                key={exam}
                href={`/search?q=${encodeURIComponent(exam)}`}
                className="rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-white/85 backdrop-blur-xs transition-all hover:border-white/30 hover:bg-white/15 hover:text-white"
              >
                {exam}
              </Link>
            ))}
          </div>

          {/* 4 Sleek Quick Action Cards (Polished & Compact) */}
          <div className="mt-4 sm:mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto">
            <Link
              href="/latest-jobs"
              className="group flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 p-2.5 backdrop-blur-md transition-all hover:border-indigo-300/40 hover:bg-white/15 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/30 text-indigo-300 group-hover:scale-105 transition-transform">
                <Briefcase className="h-4 w-4" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-bold text-white truncate">Latest Jobs</p>
                <p className="text-[10px] text-white/60 truncate">Apply Online</p>
              </div>
            </Link>

            <Link
              href="/admit-card"
              className="group flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 p-2.5 backdrop-blur-md transition-all hover:border-orange-300/40 hover:bg-white/15 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/30 text-orange-300 group-hover:scale-105 transition-transform">
                <FileText className="h-4 w-4" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-bold text-white truncate">Admit Card</p>
                <p className="text-[10px] text-white/60 truncate">Hall Ticket</p>
              </div>
            </Link>

            <Link
              href="/results"
              className="group flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 p-2.5 backdrop-blur-md transition-all hover:border-teal-300/40 hover:bg-white/15 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/30 text-[#5EEAD4] group-hover:scale-105 transition-transform">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-bold text-white truncate">Results</p>
                <p className="text-[10px] text-white/60 truncate">Scorecards</p>
              </div>
            </Link>

            <Link
              href="/answer-key"
              className="group flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 p-2.5 backdrop-blur-md transition-all hover:border-purple-300/40 hover:bg-white/15 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/30 text-purple-300 group-hover:scale-105 transition-transform">
                <KeyRound className="h-4 w-4" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-bold text-white truncate">Answer Key</p>
                <p className="text-[10px] text-white/60 truncate">Response Sheet</p>
              </div>
            </Link>
          </div>

        </div>
      </div>

      {/* Subtle bottom fade border for seamless visual blend */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
}
