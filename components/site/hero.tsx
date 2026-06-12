"use client";

import { ShieldCheck, TrendingUp, BarChart3, Award, Search, ArrowRight, ExternalLink, Clock, Sparkles, Zap, AlertTriangle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { featuredResults, trendingExams, latestJobs } from "@/lib/data";
import Link from "next/link";

function Counter({ to, label, icon: Icon }: { to: number; label: string; icon: typeof TrendingUp }) {
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
    <div ref={ref} className="flex flex-col items-center gap-1 py-2 sm:py-0">
      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#5EEAD4]" />
      <p className="text-2xl sm:text-3xl font-black text-white">{count.toLocaleString()}+</p>
      <p className="text-[10px] sm:text-xs text-white/70 whitespace-nowrap">{label}</p>
    </div>
  );
}

function Ticker() {
  const items = featuredResults.slice(0, 6).map(p => p.title);
  const [i, setI] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setI(j => (j + 1) % items.length), 3500);
    return () => clearInterval(iv);
  }, [items.length]);

  return (
    <div className="flex items-center gap-3 overflow-hidden rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-sm ring-1 ring-white/10">
      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-red-500/20 px-2.5 py-0.5 text-[10px] font-bold text-red-300">
        <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
        LIVE
      </span>
      <div className="relative h-5 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 top-0 text-sm font-semibold text-white/90 truncate w-full"
          >
            {items[i]}
          </motion.p>
        </AnimatePresence>
      </div>
      <Link href="/results" className="shrink-0 text-[10px] font-bold text-[#5EEAD4] hover:underline">View All</Link>
    </div>
  );
}

export function Hero() {
  const [searchQ, setSearchQ] = useState("");

  const urgentItems = latestJobs.slice(0, 4);

  return (
    <section className="relative overflow-hidden pb-16 pt-4 sm:pt-10 lg:pb-28 lg:pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#0F172A]" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `radial-gradient(circle at 25% 25%, rgba(94,234,212,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(234,88,12,0.15) 0%, transparent 50%)` }} />

      <div className="hidden md:block shape-blob left-[-10%] top-[-10%] h-[500px] w-[500px] bg-[#14B8A6]/40" />
      <div className="hidden md:block shape-blob bottom-[-20%] right-[-5%] h-[400px] w-[400px] bg-[#EA580C]/15" />

      <div className="hidden md:block absolute left-[10%] top-[20%] h-2 w-2 rounded-full bg-white/30 animate-ping" />
      <div className="hidden md:block absolute right-[25%] top-[10%] h-3 w-3 rounded-full bg-[#5EEAD4]/30 animate-ping" style={{ animationDelay: "0.5s" }} />
      <div className="hidden md:block absolute left-[35%] bottom-[25%] h-2 w-2 rounded-full bg-[#FBBF24]/20 animate-ping" style={{ animationDelay: "1s" }} />
      <div className="hidden md:block absolute right-[15%] bottom-[35%] h-3 w-3 rounded-full bg-white/10 animate-ping" style={{ animationDelay: "1.5s" }} />

      <div className="container-page relative">

        {/* Live Ticker */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-4">
          <Ticker />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <motion.span initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.4, delay: 0.2 }} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm ring-1 ring-white/20">
            <ShieldCheck className="h-4 w-4 text-[#5EEAD4]" />
            India&apos;s #1 fastest exam result tracker
          </motion.span>

          <h1 className="mx-auto mt-4 sm:mt-6 max-w-4xl text-3xl sm:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-white">
            <span className="text-white">Never Miss</span>{" "}
            <span className="bg-gradient-to-r from-[#5EEAD4] to-[#FBBF24] bg-clip-text text-transparent">a Result,</span>{" "}
            <span className="text-white">Job or</span>{" "}
            <span className="bg-gradient-to-r from-[#FBBF24] to-[#F97316] bg-clip-text text-transparent">Deadline</span>
            <span className="text-white">.</span>
          </h1>

          <p className="mx-auto mt-3 sm:mt-5 max-w-2xl text-sm sm:text-lg leading-6 sm:leading-8 text-white/70">
            From Sarkari results to government job alerts with application deadlines — one place for every update that matters to your career.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-6 max-w-xl">
            <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 p-1.5 backdrop-blur-md ring-1 ring-white/10 transition focus-within:border-[#5EEAD4]/50 focus-within:ring-[#5EEAD4]/30">
              <div className="flex items-center gap-2 pl-3 text-white/50">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Search exam, result, job or vacancy..."
                className="flex-1 bg-transparent px-1 py-3 text-sm text-white placeholder-white/50 outline-none"
                onKeyDown={(e) => { if (e.key === "Enter" && searchQ.trim()) window.location.href = `/search?q=${encodeURIComponent(searchQ.trim())}`; }}
              />
              {searchQ.trim() ? (
                <Link
                  href={`/search?q=${encodeURIComponent(searchQ.trim())}`}
                  className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#0D9488] transition hover:bg-white/90"
                >
                  Search <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2.5 text-[10px] font-bold text-white/50">
                  <Zap className="h-3 w-3" /> Instant
                </span>
              )}
            </div>
          </div>

          {/* Quick Action Chips */}
          <div className="mx-auto mt-5 flex flex-wrap justify-center gap-2">
            <Link href="/results" className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm ring-1 ring-white/15 transition hover:bg-white/20 hover:ring-white/30">
              <BarChart3 className="h-3.5 w-3.5 text-[#5EEAD4]" /> Latest Results
            </Link>
            <Link href="/latest-jobs" className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm ring-1 ring-white/15 transition hover:bg-white/20 hover:ring-white/30">
              <Award className="h-3.5 w-3.5 text-[#FBBF24]" /> Active Jobs
            </Link>
            <Link href="/admit-card" className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm ring-1 ring-white/15 transition hover:bg-white/20 hover:ring-white/30">
              <Clock className="h-3.5 w-3.5 text-[#F97316]" /> Admit Cards
            </Link>
            <Link href="/answer-key" className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm ring-1 ring-white/15 transition hover:bg-white/20 hover:ring-white/30">
              <Sparkles className="h-3.5 w-3.5 text-[#A78BFA]" /> Answer Keys
            </Link>
          </div>

          {/* Trending Exams */}
          <div className="mt-5 flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {trendingExams.map((exam) => (
              <Link
                key={exam}
                href={`/search?q=${encodeURIComponent(exam)}`}
                className="cursor-pointer rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white/70 backdrop-blur-sm transition hover:bg-white/15 hover:text-white"
              >
                {exam}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Bottom Section: Stats + Urgent Deadlines + Quick Cards */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mx-auto mt-8 sm:mt-12 max-w-6xl">
          <div className="grid gap-4 lg:grid-cols-3">

            {/* Stats */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-sm ring-1 ring-white/5">
              <div className="grid grid-cols-3 gap-4">
                <Counter to={18240} label="Results Tracked" icon={BarChart3} />
                <Counter to={3712} label="Active Jobs" icon={Award} />
                <Counter to={928} label="Admit Alerts" icon={TrendingUp} />
              </div>
            </div>

            {/* Urgent Deadlines - NEW */}
            <div className="rounded-2xl border border-red-500/20 bg-white/5 p-4 sm:p-5 backdrop-blur-sm ring-1 ring-red-500/10">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-300" />
                </span>
                <h3 className="text-xs font-black text-red-300 uppercase tracking-wider">Urgent Deadlines</h3>
              </div>
              <div className="space-y-2">
                {urgentItems.length > 0 ? urgentItems.map((item, i) => (
                  <Link key={i} href={item.slug ? `/post/${item.slug}` : "#"} className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 transition hover:bg-white/10">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-red-500/20 text-[9px] font-black text-red-300">{i + 1}</span>
                    <span className="flex-1 truncate text-xs font-semibold text-white/80">{item.title}</span>
                    <ChevronRight className="h-3 w-3 shrink-0 text-white/30" />
                  </Link>
                )) : (
                  <p className="text-xs text-white/50">No urgent deadlines right now</p>
                )}
              </div>
              <Link href="/latest-jobs" className="mt-2 flex items-center gap-1 text-[10px] font-bold text-red-300 hover:underline">
                View all deadlines <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Quick Value Cards */}
            <div className="grid grid-cols-2 gap-3">
              <Link href="/results" className="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm ring-1 ring-white/5 transition hover:bg-white/15">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#5EEAD4]/20 text-[#5EEAD4]">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <p className="mt-3 text-sm font-bold text-white">Today&apos;s Results</p>
                <p className="mt-0.5 text-xs text-white/60">Newly declared</p>
              </Link>
              <Link href="/latest-jobs" className="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm ring-1 ring-white/5 transition hover:bg-white/15">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FBBF24]/20 text-[#FBBF24]">
                  <Award className="h-4 w-4" />
                </div>
                <p className="mt-3 text-sm font-bold text-white">Apply Soon</p>
                <p className="mt-0.5 text-xs text-white/60">Deadline near</p>
              </Link>
              <Link href="/admit-card" className="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm ring-1 ring-white/5 transition hover:bg-white/15">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F97316]/20 text-[#F97316]">
                  <Clock className="h-4 w-4" />
                </div>
                <p className="mt-3 text-sm font-bold text-white">Admit Cards</p>
                <p className="mt-0.5 text-xs text-white/60">Download now</p>
              </Link>
              <Link href="/admissions" className="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm ring-1 ring-white/5 transition hover:bg-white/15">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A78BFA]/20 text-[#A78BFA]">
                  <ExternalLink className="h-4 w-4" />
                </div>
                <p className="mt-3 text-sm font-bold text-white">Admissions</p>
                <p className="mt-0.5 text-xs text-white/60">Open now</p>
              </Link>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
