"use client";

import { Search, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { trendingExams } from "@/lib/data";
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
          <label htmlFor="hero-search-exam" className="sr-only">Search exam or job</label>
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" aria-hidden="true" />
          <input
            id="hero-search-exam"
            aria-label="Search exam name or job title"
            type="text"
            value={exam}
            onChange={(e) => { setExam(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder="Search exam (e.g. SSC CGL, UPSC, Railway)"
            className="w-full rounded-xl border border-white/30 bg-white/15 pl-11 pr-11 py-3.5 text-sm text-white placeholder-white/70 outline-none backdrop-blur-sm transition-all focus:border-white focus:bg-white/20"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <VoiceSearchBtn
              onResult={(val) => {
                setExam(val);
                router.push(`/search?q=${encodeURIComponent(val)}`);
              }}
              className="p-1.5 text-white/70 hover:text-white transition active:scale-90"
            />
          </div>
          {showDropdown && filtered.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-auto rounded-xl border border-white/10 bg-[#0F172A] shadow-xl">
              {filtered.map((e) => (
                <button
                  key={e}
                  type="button"
                  onMouseDown={() => { setExam(e); setShowDropdown(false); }}
                  className="w-full px-4 py-2.5 text-left text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="relative sm:w-52">
          <label htmlFor="hero-search-roll" className="sr-only">Roll number (optional, for scorecard)</label>
          <input
            id="hero-search-roll"
            aria-label="Roll number (optional, for scorecard lookup)"
            type="text"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            placeholder="Roll No. (Scorecard lookup)"
            className="w-full rounded-xl border border-white/30 bg-white/15 px-4 py-3.5 text-sm text-white placeholder-white/70 outline-none backdrop-blur-sm transition-all focus:border-white focus:bg-white/20"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-teal-800 shadow-md transition hover:bg-white/95 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-white"
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
      <p className="text-lg sm:text-xl font-bold text-white tracking-tight">{count.toLocaleString()}<span className="text-[#5EEAD4]">+</span></p>
      <p className="text-[10px] text-white/70 mt-0.5 font-medium">{label}</p>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* CSS-only gradient background — no Three.js WebGL */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 25%, #0E877D 0%, #084c47 60%, #042724 100%)",
          }}
        />
        {/* Subtle animated glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-30 blur-3xl"
          style={{
            background: "radial-gradient(circle, #5EEAD4 0%, transparent 70%)",
            animation: "pulse 4s ease-in-out infinite",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25 pointer-events-none" />
      </div>

      <div className="container-page relative pt-8 sm:pt-12 pb-8 sm:pb-14">
        <div className="mx-auto max-w-3xl text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-white/90 border border-white/10 mb-5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Sarkari Result &amp; Job Alerts 2026
          </div>

          {/* Headline — short & punchy */}
          <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.12] tracking-tight text-white">
            Sarkari Result 2026{' '}
            <span className="text-[#5EEAD4]">Exam</span>,{' '}
            <span className="text-[#FBBF24]">Jobs</span> &amp;{' '}
            <span className="text-[#A78BFA]">Admit Card</span>
          </h1>

          {/* Search bar */}
          <div className="mt-6">
            <ResultFinder />
          </div>
        </div>

        {/* Stats bar */}
        <div className="mx-auto mt-8 max-w-lg">
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

