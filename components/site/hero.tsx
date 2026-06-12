"use client";

import { TrendingUp, BarChart3, Award, Search, ArrowRight, Clock, Sparkles, Zap, ChevronRight, Flame, Target, Rocket, Bell, Users, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { featuredResults, trendingExams, latestJobs } from "@/lib/data";
import Link from "next/link";

function Counter({ to, label, icon: Icon, suffix = "+" }: { to: number; label: string; icon: typeof TrendingUp; suffix?: string }) {
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
      <Icon className="mx-auto h-5 w-5 text-[#5EEAD4]" />
      <p className="mt-1 text-2xl font-black text-white tabular-nums">{count.toLocaleString()}{suffix}</p>
      <p className="text-[11px] text-white/60">{label}</p>
    </div>
  );
}

function Ticker() {
  const items = featuredResults.slice(0, 8).map(p => p.title);
  const [i, setI] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setI(j => (j + 1) % items.length), 3000);
    return () => clearInterval(iv);
  }, [items.length]);

  return (
    <Link href="/results" className="group flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md ring-1 ring-white/10 hover:bg-white/[0.14] transition-all">
      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/25 px-2.5 py-1 text-[10px] font-bold text-emerald-300 ring-1 ring-emerald-400/20">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        LIVE
      </span>
      <div className="relative h-5 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute left-0 top-0 text-sm font-semibold text-white/90 truncate w-full"
          >
            {items[i]}
          </motion.p>
        </AnimatePresence>
      </div>
      <span className="shrink-0 text-xs font-bold text-[#5EEAD4] group-hover:text-white transition-colors">View All →</span>
    </Link>
  );
}

function SearchBar() {
  const [q, setQ] = useState("");
  const suggestions = trendingExams.filter(e => e.toLowerCase().includes(q.toLowerCase())).slice(0, 4);

  return (
    <div className="relative mx-auto max-w-xl">
      <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.08] p-1.5 backdrop-blur-md ring-1 ring-white/5 transition-all duration-300 focus-within:border-[#5EEAD4]/50 focus-within:ring-[#5EEAD4]/30 focus-within:shadow-lg focus-within:shadow-[#5EEAD4]/10">
        <Search className="ml-3 h-5 w-5 text-white/50 shrink-0" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search exam, result or job..."
          className="flex-1 bg-transparent px-1 py-3 text-sm text-white placeholder-white/40 outline-none"
          onKeyDown={(e) => { if (e.key === "Enter" && q.trim()) window.location.href = `/search?q=${encodeURIComponent(q.trim())}`; }}
        />
        {q.trim() ? (
          <Link href={`/search?q=${encodeURIComponent(q.trim())}`} className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#0D9488] transition-all hover:bg-white/90 hover:shadow-lg hover:shadow-white/20">
            Search <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className="hidden sm:flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white/50">
            <Zap className="h-3.5 w-3.5" /> Instant
          </span>
        )}
      </div>
      {q && suggestions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl shadow-xl">
          {suggestions.map(s => (
            <Link key={s} href={`/search?q=${encodeURIComponent(s)}`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors">
              <Search className="h-3.5 w-3.5 text-white/30" />
              {s}
            </Link>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const trendingItems = trendingExams;
  const deadlineItems = latestJobs.slice(0, 3);

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden pb-16 pt-4 sm:pt-12 lg:pb-28 lg:pt-16">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#0F172A]" />
      <div className="absolute inset-0">
        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 3, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#5EEAD4]/10 blur-3xl" />
        <motion.div animate={{ scale: [1.1, 1, 1.1], rotate: [0, -3, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-[#F97316]/10 blur-3xl" />
        <motion.div animate={{ scale: [1, 1.15, 1], y: [0, -20, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} className="absolute left-1/3 bottom-0 h-64 w-64 rounded-full bg-[#A78BFA]/10 blur-3xl" />
      </div>

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden hidden md:block">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-white/20"
            style={{ left: `${10 + i * 15}%`, top: `${15 + (i % 3) * 30}%` }}
            animate={{ y: [-8, 8, -8], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3 + i % 2, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
      </div>

      <div className="container-page relative z-10">
        {/* Live Ticker */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Ticker />
        </motion.div>

        {/* Main Content */}
        <div className="mx-auto mt-8 max-w-4xl text-center">
          {/* Badge */}
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm ring-1 ring-white/15 shadow-lg mb-4">
            <Rocket className="h-4 w-4 text-[#5EEAD4]" />
            India&apos;s Fastest Exam Tracker
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-3xl sm:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
            <span className="text-white">Never Miss a </span>
            <span className="bg-gradient-to-r from-[#5EEAD4] via-[#2DD4BF] to-[#FBBF24] bg-clip-text text-transparent">Result</span>
            <span className="text-white">, </span>
            <span className="bg-gradient-to-r from-[#FBBF24] via-[#F97316] to-[#EA580C] bg-clip-text text-transparent">Job</span>
            <span className="text-white"> or </span>
            <span className="bg-gradient-to-r from-[#A78BFA] to-[#818CF8] bg-clip-text text-transparent">Deadline</span>
            <span className="text-white">.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-white/65 leading-relaxed">
            Real-time alerts for Sarkari results, government jobs and application deadlines — all in one place.
          </motion.p>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} className="mt-6">
            <SearchBar />
          </motion.div>

          {/* Trending Chips */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-5 flex flex-wrap justify-center gap-2">
            {trendingItems.map((exam) => (
              <Link key={exam} href={`/search?q=${encodeURIComponent(exam)}`} className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60 backdrop-blur-sm transition-all hover:bg-white/15 hover:text-white hover:border-white/30 hover:shadow-lg">
                <Flame className="h-3 w-3 text-orange-400 group-hover:text-orange-300" />
                {exam}
              </Link>
            ))}
          </motion.div>

          {/* Quick Action Cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }} className="mx-auto mt-8 grid max-w-3xl grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { href: "/results", icon: BarChart3, label: "Results", color: "#5EEAD4" },
              { href: "/latest-jobs", icon: Award, label: "Jobs", color: "#FBBF24" },
              { href: "/admit-card", icon: Clock, label: "Admit Card", color: "#F97316" },
              { href: "/answer-key", icon: Sparkles, label: "Answer Key", color: "#A78BFA" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="group flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-4 backdrop-blur-xl ring-1 ring-white/5 transition-all hover:bg-white/15 hover:-translate-y-1 hover:shadow-xl active:scale-95">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition-transform group-hover:scale-110" style={{ color: item.color }}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-white/80">{item.label}</span>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Bottom Stats + Deadlines Row */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mx-auto mt-10 max-w-5xl">
          <div className="grid gap-3 sm:grid-cols-3">

            {/* Stats */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl ring-1 ring-white/5">
              <div className="grid grid-cols-3 gap-3">
                <Counter to={18240} label="Results Tracked" icon={BarChart3} />
                <Counter to={3712} label="Active Jobs" icon={Award} />
                <Counter to={928} label="Alerts Sent" icon={Bell} />
              </div>
            </div>

            {/* Closing Soon */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl ring-1 ring-white/5">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/20">
                  <Clock className="h-3.5 w-3.5 text-orange-300" />
                </span>
                <h3 className="text-xs font-black text-orange-200 uppercase tracking-wider">Closing Soon</h3>
              </div>
              <div className="space-y-1.5">
                {deadlineItems.length > 0 ? deadlineItems.map((item, i) => (
                  <Link key={i} href={item.slug ? `/post/${item.slug}` : "#"} className="group flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5 transition-all hover:bg-white/10">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[10px] font-bold text-white/50 group-hover:bg-orange-500/20 group-hover:text-orange-300 transition-colors">{i + 1}</span>
                    <span className="flex-1 truncate text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{item.title}</span>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/20 group-hover:text-white/40 transition-colors" />
                  </Link>
                )) : (
                  <p className="text-xs text-white/50">No upcoming deadlines</p>
                )}
              </div>
              <Link href="/latest-jobs" className="mt-2 flex items-center gap-1 text-[11px] font-bold text-orange-300 hover:text-orange-200 transition-colors group">
                View all <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Student Quick Links */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl ring-1 ring-white/5">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/20">
                  <BookOpen className="h-3.5 w-3.5 text-indigo-300" />
                </span>
                <h3 className="text-xs font-black text-indigo-200 uppercase tracking-wider">Quick Links</h3>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { href: "/admissions", label: "Open Admissions", icon: Target },
                  { href: "/results", label: "Latest Results", icon: BarChart3 },
                  { href: "/latest-jobs", label: "Active Vacancies", icon: Users },
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="group flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5 transition-all hover:bg-white/10">
                    <link.icon className="h-4 w-4 text-white/40 group-hover:text-[#5EEAD4] transition-colors" />
                    <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{link.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 ml-auto text-white/20 group-hover:text-white/40 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
