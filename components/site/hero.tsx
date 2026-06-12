"use client";

import { Search, ArrowRight, Clock, BarChart3, Award, Sparkles, Bell, TrendingUp, Zap } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { featuredResults, trendingExams, latestJobs } from "@/lib/data";
import Link from "next/link";

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

function SearchBar() {
  const [q, setQ] = useState("");
  const suggestions = trendingExams.filter(e => e.toLowerCase().includes(q.toLowerCase())).slice(0, 4);

  return (
    <div className="relative mx-auto max-w-lg">
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 focus-within:border-white/40 focus-within:bg-white/15 transition-all">
        <Search className="h-4 w-4 text-white/50 shrink-0" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search exam, result or job..."
          className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none"
          onKeyDown={(e) => { if (e.key === "Enter" && q.trim()) window.location.href = `/search?q=${encodeURIComponent(q.trim())}`; }}
        />
        {q.trim() ? (
          <Link href={`/search?q=${encodeURIComponent(q.trim())}`} className="flex items-center gap-1 rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-[#0D9488] hover:bg-white/90 transition-colors">
            Search <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <span className="hidden sm:flex items-center gap-1 text-xs text-white/40">
            <Zap className="h-3 w-3" /> Instant
          </span>
        )}
      </div>
      {q && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-xl bg-[#0F172A] border border-white/10 shadow-xl z-10">
          {suggestions.map(s => (
            <Link key={s} href={`/search?q=${encodeURIComponent(s)}`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors">
              <Search className="h-3.5 w-3.5 text-white/30" />
              {s}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#0F172A]" />

      <div className="container-page relative py-6 sm:py-10">
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
            Real-time alerts for Sarkari results, government jobs and application deadlines — all in one place.
          </p>

          {/* Search */}
          <div className="mt-5">
            <SearchBar />
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
