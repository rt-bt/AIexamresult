"use client";

import { Search, ArrowRight, FileCheck, Award, Briefcase, KeyRound, Sparkles } from "lucide-react";
import { useState } from "react";
import { trendingExams } from "@/lib/data";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

const trendingTags = [
  { label: "SSC CGL 2026", query: "SSC CGL" },
  { label: "RRB NTPC", query: "RRB NTPC" },
  { label: "UPSC Civil Services", query: "UPSC" },
  { label: "UP Police Constable", query: "UP Police" },
  { label: "CTET 2026", query: "CTET" },
  { label: "NEET UG", query: "NEET" },
  { label: "Bihar Board 10th/12th", query: "Bihar Board" },
];

const quickCards = [
  {
    title: "Sarkari Results",
    desc: "Scorecards, merit lists & cut-offs",
    href: "/results",
    icon: Award,
    color: "from-emerald-600 to-teal-700",
    badge: "Declared",
    badgeBg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300",
  },
  {
    title: "Admit Cards",
    desc: "Hall tickets & exam city slips",
    href: "/admit-card",
    icon: FileCheck,
    color: "from-blue-600 to-indigo-700",
    badge: "Available",
    badgeBg: "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300",
  },
  {
    title: "Latest Jobs",
    desc: "Central & state govt vacancies",
    href: "/latest-jobs",
    icon: Briefcase,
    color: "from-amber-600 to-orange-700",
    badge: "Apply Online",
    badgeBg: "bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300",
  },
  {
    title: "Answer Keys",
    desc: "Official keys & objection forms",
    href: "/answer-key",
    icon: KeyRound,
    color: "from-purple-600 to-violet-700",
    badge: "Released",
    badgeBg: "bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300",
  },
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
    if (q.length >= 2) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/results");
    }
  }

  function handleTagClick(query: string) {
    setExam(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/15 sm:flex-row sm:items-center">
          {/* Exam Name Input */}
          <div className="relative flex-1">
            <label htmlFor="hero-search-exam" className="sr-only">Search exam or job</label>
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="hero-search-exam"
              aria-label="Search exam name or job title"
              type="text"
              value={exam}
              onChange={(e) => { setExam(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              placeholder="Search exam (e.g. SSC CGL, RRB NTPC, UPSC, CTET)..."
              className="w-full rounded-xl bg-transparent py-3 pl-10 pr-10 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none dark:text-white dark:placeholder-slate-500"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <VoiceSearchBtn
                onResult={(val) => {
                  setExam(val);
                  router.push(`/search?q=${encodeURIComponent(val)}`);
                }}
                className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              />
            </div>
            {showDropdown && filtered.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-56 overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                {filtered.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onMouseDown={() => { setExam(e); setShowDropdown(false); router.push(`/search?q=${encodeURIComponent(e)}`); }}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <span>{e}</span>
                    <span className="text-xs text-slate-400">Exam</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Roll Number (Optional) */}
          <div className="relative sm:w-48 sm:border-l sm:border-slate-200 sm:dark:border-slate-800">
            <label htmlFor="hero-search-roll" className="sr-only">Roll number (optional)</label>
            <input
              id="hero-search-roll"
              aria-label="Roll number (optional)"
              type="text"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="Roll No. (Scorecard)"
              className="w-full rounded-xl bg-transparent px-3 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none dark:text-white dark:placeholder-slate-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-md transition hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] sm:py-3"
          >
            <span>Find Result</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Trending Quick Search Tags */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="font-semibold text-slate-300 dark:text-slate-400 flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          Trending:
        </span>
        {trendingTags.map((tag) => (
          <button
            key={tag.label}
            type="button"
            onClick={() => handleTagClick(tag.query)}
            className="rounded-lg border border-white/15 bg-white/10 px-2.5 py-1 font-medium text-white transition hover:bg-white/20 hover:border-white/30 active:scale-95"
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#0F172A] text-white">
      {/* Subtle institutional grid texture */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      <div className="container-page relative pt-10 sm:pt-14 pb-12 sm:pb-16">
        <div className="mx-auto max-w-3xl text-center">

          {/* National Trust Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-950/60 px-4 py-1.5 text-xs font-semibold text-indigo-200 shadow-inner backdrop-blur-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-amber-300 font-bold">LIVE 2026:</span>
            <span>All India Sarkari Results, Admit Cards &amp; Govt Job Alerts</span>
          </div>

          {/* Authority Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white">
            Fastest Sarkari Results,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
              Admit Cards
            </span>{' '}
            &amp; Exam Updates
          </h1>

          <p className="mt-3.5 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Direct verified links to official notifications, answer keys, scorecards and merit lists for UPSC, SSC, Railways, State PSCs, Teaching &amp; Board examinations.
          </p>

          {/* Search Box */}
          <div className="mt-8">
            <ResultFinder />
          </div>
        </div>

        {/* 4 Fast-Track Action Pillars (Core of Indian Exam Portals) */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 max-w-4xl mx-auto">
          {quickCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group relative flex flex-col justify-between rounded-xl border border-white/15 bg-white/10 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-white/30 hover:bg-white/15 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${card.color} text-white shadow-sm`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${card.badgeBg}`}>
                      {card.badge}
                    </span>
                  </div>
                  <h2 className="mt-3 text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {card.title}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-300 line-clamp-1">
                    {card.desc}
                  </p>
                </div>
                <div className="mt-3 flex items-center text-xs font-semibold text-amber-400 group-hover:text-amber-300">
                  <span>Explore</span>
                  <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
