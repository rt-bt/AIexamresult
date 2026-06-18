"use client";

import { Search, ArrowRight, Clock, BarChart3, Award, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { featuredResults, trendingExams, latestJobs } from "@/lib/data";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

  return (
    <form onSubmit={handleSubmit} className="relative mx-auto max-w-2xl">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={exam}
            onChange={(e) => { setExam(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder="Exam name (e.g. SSC CGL, UPSC, Railway)"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-11 py-3.5 text-sm text-white placeholder-white/40 outline-none backdrop-blur-sm transition-all focus:border-white/40 focus:bg-white/15"
          />
          {showDropdown && filtered.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-auto rounded-xl border border-white/10 bg-[#0F172A] shadow-xl">
              {filtered.map((e) => (
                <button
                  key={e}
                  type="button"
                  onMouseDown={() => { setExam(e); setShowDropdown(false); }}
                  className="w-full px-4 py-2.5 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>
        <input
          type="text"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          placeholder="Roll number (optional)"
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 text-sm text-white placeholder-white/40 outline-none backdrop-blur-sm transition-all focus:border-white/40 focus:bg-white/15 sm:w-44"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-[#0D9488] shadow-lg shadow-black/10 transition hover:bg-white/90 active:scale-[0.98]"
        >
          Find Result
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-white/40">
        Popular: SSC CGL · UPSC · RRB NTPC · CTET · NEET · Bihar Board · UP Board
      </p>
    </form>
  );
}

function Counter({ to, label }: { to: number; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !done.current) {
        done.current = true;
        let start = 0;
        const dur = 2000;
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
      <p className="text-lg sm:text-xl font-bold text-white tracking-tight">{count.toLocaleString()}<span className="text-[#5EEAD4]">+</span></p>
      <p className="text-[10px] text-white/50 mt-0.5 font-medium">{label}</p>
    </div>
  );
}

export function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#0F172A]" />

      <div className="container-page relative pt-1 sm:pt-2 pb-6 sm:pb-10">
        <div className="mx-auto max-w-3xl text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-white/80 border border-white/10 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Real-time exam updates
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white">
            Never Miss a{' '}
            <span className="text-[#5EEAD4]">Result</span>,{' '}
            <span className="text-[#FBBF24]">Job</span> or{' '}
            <span className="text-[#A78BFA]">Deadline</span>.
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm sm:text-base text-white/60 leading-relaxed">
            Real-time Sarkari result alerts, government jobs (sarkari naukri), admit cards and answer keys — all in one place.
          </p>

          {/* Result Finder */}
          <div className="mt-5">
            <ResultFinder />
          </div>

          {/* Trending */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {trendingExams.slice(0, 6).map((exam) => (
              <Link
                key={exam}
                href={`/search?q=${encodeURIComponent(exam)}`}
                className="px-3 py-1.5 rounded-full border border-white/15 text-xs font-medium text-white/60 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all"
              >
                {exam}
              </Link>
            ))}
          </div>

          {/* Quick Action Cards */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-sm mx-auto">
            {[
              { href: "/results", icon: BarChart3, label: "Results", color: "#5EEAD4" },
              { href: "/latest-jobs", icon: Award, label: "Jobs", color: "#FBBF24" },
              { href: "/admit-card", icon: Clock, label: "Admit Card", color: "#F97316" },
              { href: "/answer-key", icon: Sparkles, label: "Answer Key", color: "#A78BFA" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1.5 rounded-xl bg-white/10 border border-white/10 px-3 py-3.5 hover:bg-white/15 hover:-translate-y-0.5 transition-all">
                <div style={{ color: item.color }}><item.icon className="h-5 w-5" /></div>
                <span className="text-xs font-semibold text-white/80">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="mx-auto mt-5 max-w-lg">
          <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
            <div className="flex divide-x divide-white/10">
              <div className="flex-1 min-w-0 px-3 text-center">
                <Counter to={18240} label="Results Tracked" />
              </div>
              <div className="flex-1 min-w-0 px-3 text-center">
                <Counter to={3712} label="Active Jobs" />
              </div>
              <div className="flex-1 min-w-0 px-3 text-center">
                <Counter to={928} label="Alerts Sent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
