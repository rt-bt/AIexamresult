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
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
        <Icon className="h-4 w-4 text-[#5EEAD4]" />
      </span>
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
    <div className="flex items-center gap-3 overflow-hidden rounded-xl bg-white/10 px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-md ring-1 ring-white/10 shadow-lg shadow-black/5">
      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-300">
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
      <Link href="/results" className="shrink-0 text-[10px] font-bold text-[#5EEAD4] hover:text-[#2DD4BF] transition-colors">View All</Link>
    </div>
  );
}

function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[15%] top-[20%] h-32 w-32 rounded-full bg-[#5EEAD4]/10 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -30, 40, 0], y: [0, 30, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[20%] top-[40%] h-40 w-40 rounded-full bg-[#F97316]/10 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 20, -30, 0], y: [0, -20, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[40%] bottom-[10%] h-24 w-24 rounded-full bg-[#A78BFA]/10 blur-3xl"
      />
    </div>
  );
}

function GlowButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm ring-1 ring-white/15 transition-all hover:bg-white/20 hover:ring-[#5EEAD4]/40 hover:shadow-lg hover:shadow-[#5EEAD4]/10"
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#5EEAD4]/0 via-[#5EEAD4]/5 to-[#5EEAD4]/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="relative">{children}</span>
    </Link>
  );
}

export function Hero() {
  const [searchQ, setSearchQ] = useState("");

  const urgentItems = latestJobs.slice(0, 4);

  return (
    <section className="relative overflow-hidden pb-16 pt-4 sm:pt-10 lg:pb-28 lg:pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#0F172A]" />
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `radial-gradient(circle at 20% 30%, rgba(94,234,212,0.25) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(234,88,12,0.12) 0%, transparent 40%)` }} />
      <FloatingOrbs />

      <div className="hidden md:block shape-blob left-[-10%] top-[-10%] h-[500px] w-[500px] bg-[#14B8A6]/30" />
      <div className="hidden md:block shape-blob bottom-[-20%] right-[-5%] h-[400px] w-[400px] bg-[#EA580C]/10" />

      <div className="hidden md:block absolute left-[10%] top-[20%] h-2 w-2 rounded-full bg-white/30 animate-ping" />
      <div className="hidden md:block absolute right-[25%] top-[10%] h-3 w-3 rounded-full bg-[#5EEAD4]/30 animate-ping" style={{ animationDelay: "0.5s" }} />
      <div className="hidden md:block absolute left-[35%] bottom-[25%] h-2 w-2 rounded-full bg-[#FBBF24]/20 animate-ping" style={{ animationDelay: "1s" }} />

      <div className="container-page relative">

        {/* Live Ticker */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-4">
          <Ticker />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <motion.span initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.4, delay: 0.2 }} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm ring-1 ring-white/20 shadow-lg">
            <ShieldCheck className="h-4 w-4 text-[#5EEAD4]" />
            India&apos;s #1 fastest exam result tracker
          </motion.span>

          <h1 className="mx-auto mt-4 sm:mt-6 max-w-4xl text-3xl sm:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-white">
            <span className="text-white">Never Miss</span>{" "}
            <span className="bg-gradient-to-r from-[#5EEAD4] via-[#2DD4BF] to-[#FBBF24] bg-clip-text text-transparent">a Result,</span>{" "}
            <span className="text-white">Job or</span>{" "}
            <span className="bg-gradient-to-r from-[#FBBF24] via-[#F97316] to-[#EA580C] bg-clip-text text-transparent">Deadline</span>
            <span className="text-white">.</span>
          </h1>

          <p className="mx-auto mt-3 sm:mt-5 max-w-2xl text-sm sm:text-lg leading-6 sm:leading-8 text-white/70">
            From Sarkari results to government job alerts with application deadlines — one place for every update that matters to your career.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-6 max-w-xl">
            <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 p-1.5 backdrop-blur-md ring-1 ring-white/10 transition-all duration-300 focus-within:border-[#5EEAD4]/50 focus-within:ring-[#5EEAD4]/30 focus-within:shadow-lg focus-within:shadow-[#5EEAD4]/10">
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
                  className="relative flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#0D9488] transition-all hover:bg-white/90 hover:shadow-lg hover:shadow-white/20"
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
            <GlowButton href="/results"><BarChart3 className="h-3.5 w-3.5 text-[#5EEAD4]" /> Latest Results</GlowButton>
            <GlowButton href="/latest-jobs"><Award className="h-3.5 w-3.5 text-[#FBBF24]" /> Active Jobs</GlowButton>
            <GlowButton href="/admit-card"><Clock className="h-3.5 w-3.5 text-[#F97316]" /> Admit Cards</GlowButton>
            <GlowButton href="/answer-key"><Sparkles className="h-3.5 w-3.5 text-[#A78BFA]" /> Answer Keys</GlowButton>
          </div>

          {/* Trending Exams */}
          <div className="mt-5 flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {trendingExams.map((exam) => (
              <Link
                key={exam}
                href={`/search?q=${encodeURIComponent(exam)}`}
                className="cursor-pointer rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white/60 backdrop-blur-sm transition-all hover:bg-white/15 hover:text-white hover:border-white/30 hover:shadow-lg"
              >
                {exam}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mx-auto mt-8 sm:mt-12 max-w-6xl">
          <div className="grid gap-4 lg:grid-cols-3">

            {/* Stats */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 sm:p-5 backdrop-blur-xl ring-1 ring-white/5 shadow-lg shadow-black/5">
              <div className="grid grid-cols-3 gap-4">
                <Counter to={18240} label="Results Tracked" icon={BarChart3} />
                <Counter to={3712} label="Active Jobs" icon={Award} />
                <Counter to={928} label="Admit Alerts" icon={TrendingUp} />
              </div>
            </div>

            {/* Latest Deadlines */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 sm:p-5 backdrop-blur-xl ring-1 ring-white/5 shadow-lg shadow-black/5">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20">
                  <Clock className="h-3.5 w-3.5 text-amber-300" />
                </span>
                <h3 className="text-xs font-black text-amber-200 uppercase tracking-wider">Closing Soon</h3>
              </div>
              <div className="space-y-1.5">
                {urgentItems.length > 0 ? urgentItems.map((item, i) => (
                  <Link key={i} href={item.slug ? `/post/${item.slug}` : "#"} className="group flex items-center gap-3 rounded-xl bg-white/5 px-3.5 py-2.5 transition-all hover:bg-white/10 hover:pl-4">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white/60 group-hover:bg-amber-500/20 group-hover:text-amber-300 transition-colors">{i + 1}</div>
                    <span className="flex-1 text-sm font-semibold text-white/80 group-hover:text-white transition-colors leading-tight line-clamp-2">{item.title}</span>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/20 group-hover:text-white/50 transition-all group-hover:translate-x-0.5" />
                  </Link>
                )) : (
                  <p className="text-xs text-white/50">No deadlines right now</p>
                )}
              </div>
              <Link href="/latest-jobs" className="mt-3 flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors group">
                View all deadlines <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Quick Value Cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: "/results", icon: BarChart3, color: "text-[#5EEAD4]", bg: "bg-[#5EEAD4]/20", title: "Today&apos;s Results", sub: "Newly declared" },
                { href: "/latest-jobs", icon: Award, color: "text-[#FBBF24]", bg: "bg-[#FBBF24]/20", title: "Apply Soon", sub: "Deadline near" },
                { href: "/admit-card", icon: Clock, color: "text-[#F97316]", bg: "bg-[#F97316]/20", title: "Admit Cards", sub: "Download now" },
                { href: "/admissions", icon: ExternalLink, color: "text-[#A78BFA]", bg: "bg-[#A78BFA]/20", title: "Admissions", sub: "Open now" },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="group relative rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl ring-1 ring-white/5 transition-all hover:bg-white/15 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/10"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.bg} ${item.color} transition-transform group-hover:scale-110`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <p className="mt-3 text-sm font-bold text-white">{item.title}</p>
                  <p className="mt-0.5 text-xs text-white/50">{item.sub}</p>
                </Link>
              ))}
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
