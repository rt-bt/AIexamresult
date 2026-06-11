"use client";

import { ShieldCheck, TrendingUp, BarChart3, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { trendingExams } from "@/lib/data";

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
    <div ref={ref} className="flex flex-col items-center gap-1.5 py-2 sm:py-0">
      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#5EEAD4]" />
      <p className="text-2xl sm:text-3xl font-black text-white">{count.toLocaleString()}+</p>
      <p className="text-[10px] sm:text-xs text-white/70 whitespace-nowrap">{label}</p>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-6 sm:pt-14 lg:pb-28 lg:pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#0F172A]" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `radial-gradient(circle at 25% 25%, rgba(94,234,212,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(234,88,12,0.15) 0%, transparent 50%)` }} />

      <div className="hidden md:block shape-blob left-[-10%] top-[-10%] h-[500px] w-[500px] bg-[#14B8A6]/40" />
      <div className="hidden md:block shape-blob bottom-[-20%] right-[-5%] h-[400px] w-[400px] bg-[#EA580C]/15" />

      <div className="hidden md:block absolute left-[10%] top-[20%] h-2 w-2 rounded-full bg-white/30 animate-ping" />
      <div className="hidden md:block absolute right-[25%] top-[10%] h-3 w-3 rounded-full bg-[#5EEAD4]/30 animate-ping" style={{ animationDelay: "0.5s" }} />
      <div className="hidden md:block absolute left-[35%] bottom-[25%] h-2 w-2 rounded-full bg-[#FBBF24]/20 animate-ping" style={{ animationDelay: "1s" }} />
      <div className="hidden md:block absolute right-[15%] bottom-[35%] h-3 w-3 rounded-full bg-white/10 animate-ping" style={{ animationDelay: "1.5s" }} />

      <div className="hidden md:block absolute left-[5%] top-[40%] h-16 w-16 rotate-45 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm" />
      <div className="hidden md:block absolute right-[8%] top-[25%] h-20 w-20 rotate-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm" />
      <div className="hidden md:block absolute bottom-[20%] left-[50%] h-12 w-12 -rotate-12 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm" />

      <div className="container-page relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <motion.span initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.4, delay: 0.2 }} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm ring-1 ring-white/20">
            <ShieldCheck className="h-4 w-4 text-[#5EEAD4]" />
            Trusted exam intelligence since 2024
          </motion.span>

          <h1 className="mx-auto mt-4 sm:mt-6 max-w-4xl text-2xl sm:text-4xl lg:text-7xl font-black leading-[1.1] tracking-tight text-white">
            <span className="text-white">Every Exam.</span>{" "}
            <span className="bg-gradient-to-r from-[#5EEAD4] to-[#FBBF24] bg-clip-text text-transparent">Every Result.</span>{" "}
            <span className="bg-gradient-to-r from-[#FBBF24] to-[#F97316] bg-clip-text text-transparent">All India.</span>
          </h1>

          <p className="mx-auto mt-3 sm:mt-5 max-w-2xl text-sm sm:text-lg leading-6 sm:leading-8 text-white/70">
            Find verified Sarkari results, government jobs, admit cards & answer keys — all in one blazing-fast portal.
          </p>

          <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {trendingExams.map((exam) => (
              <span key={exam} className="cursor-default rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white/70 backdrop-blur-sm transition hover:bg-white/15 hover:text-white">
                {exam}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mx-auto mt-8 sm:mt-12 max-w-4xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-sm ring-1 ring-white/5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4">
              <Counter to={18240} label="Results Tracked" icon={BarChart3} />
              <Counter to={3712} label="Active Job Posts" icon={Award} />
              <Counter to={928} label="Admit Card Alerts" icon={TrendingUp} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


