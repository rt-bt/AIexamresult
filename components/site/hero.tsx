"use client";

import { Search, ArrowRight, Clock, BarChart3, Award, Sparkles, ChevronRight, Bell, BookOpen, Target, Zap, TrendingUp } from "lucide-react";
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
      <div className="flex h-8 w-8 mx-auto items-center justify-center rounded-lg bg-white/10 text-[#5EEAD4]">
        <TrendingUp className="h-3.5 w-3.5" />
      </div>
      <p className="mt-1.5 text-lg sm:text-xl font-bold text-white tracking-tight">{count.toLocaleString()}<span className="text-[#5EEAD4]">+</span></p>
      <p className="text-[10px] text-white/50 mt-0.5 font-medium tracking-wide">{label}</p>
    </div>
  );
}

function SearchBar() {
  const [q, setQ] = useState("");
  const suggestions = trendingExams.filter(e => e.toLowerCase().includes(q.toLowerCase())).slice(0, 4);

  return (
    <div className="relative mx-auto max-w-xl">
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
        <div className="absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-xl bg-[#0F172A] border border-white/10 shadow-xl">
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
    <section className="relative overflow-hidden pb-16 sm:pb-20">
      {/* Clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#0F172A]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      <div className="container-page relative">
        <div className="mx-auto max-w-3xl pt-12 sm:pt-16 lg:pt-20 text-center">

          {/* Top badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-white/80 backdrop-blur-sm border border-white/10 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Real-time exam updates
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight text-white">
            Never Miss a{' '}
            <span className="text-[#5EEAD4]">Result</span>,{' '}
            <span className="text-[#FBBF24]">Job</span> or{' '}
            <span className="text-[#A78BFA]">Deadline</span>.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base text-white/60 leading-relaxed">
            Real-time alerts for Sarkari results, government jobs and application deadlines — all in one place.
          </p>

          {/* Search */}
          <div className="mt-6">
            <SearchBar />
          </div>

          {/* Trending */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
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
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
            {[
              { href: "/results", icon: BarChart3, label: "Results", color: "#5EEAD4" },
              { href: "/latest-jobs", icon: Award, label: "Jobs", color: "#FBBF24" },
              { href: "/admit-card", icon: Clock, label: "Admit Card", color: "#F97316" },
              { href: "/answer-key", icon: Sparkles, label: "Answer Key", color: "#A78BFA" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-4 hover:bg-white/15 hover:-translate-y-0.5 transition-all">
                <div className="flex items-center justify-center" style={{ color: item.color }}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-white/80">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mx-auto mt-10 max-w-4xl grid gap-3 sm:grid-cols-3">
          {/* Stats */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 sm:col-span-3">
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

          {/* Closing Soon */}
          <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-orange-300" />
              <h3 className="text-xs font-semibold text-orange-200">Closing Soon</h3>
            </div>
            <div className="space-y-1.5">
              {latestJobs.slice(0, 2).map((item, i) => (
                <Link key={i} href={item.slug ? `/post/${item.slug}` : "#"} className="flex items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-white/10 transition-colors">
                  <span className="text-[10px] font-semibold text-white/40 w-4">{i + 1}.</span>
                  <span className="flex-1 text-xs font-medium text-white/80 truncate">{item.title}</span>
                  <ChevronRight className="h-3 w-3 text-white/30 shrink-0" />
                </Link>
              ))}
              <Link href="/latest-jobs" className="flex items-center gap-1 text-xs font-medium text-orange-300 hover:text-orange-200 transition-colors px-2.5">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-indigo-300" />
              <h3 className="text-xs font-semibold text-indigo-200">Explore</h3>
            </div>
            <div className="space-y-1">
              {[
                { href: "/admissions", label: "Open Admissions", icon: Target },
                { href: "/results", label: "Latest Results", icon: TrendingUp },
                { href: "/latest-jobs", label: "Active Vacancies", icon: Bell },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-white/10 transition-colors">
                  <link.icon className="h-3.5 w-3.5 text-white/40" />
                  <span className="text-xs font-medium text-white/80">{link.label}</span>
                  <ChevronRight className="h-3 w-3 text-white/30 ml-auto" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
