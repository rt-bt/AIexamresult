"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarDays, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { PostCard } from "@/lib/data";

const categoryConfig: Record<string, { slug: string; from: string; via: string }> = {
  "Result":      { slug: "results",     from: "#0D9488", via: "#14B8A6" },
  "Admit Card":  { slug: "admit-card",  from: "#EA580C", via: "#F97316" },
  "Latest Vacancy": { slug: "latest-jobs", from: "#4F46E5", via: "#6366F1" },
  "Answer Keys": { slug: "answer-key", from: "#7C3AED", via: "#A78BFA" },
  "Admissions":  { slug: "admissions",  from: "#E11D48", via: "#FB7185" },
  "Documents":   { slug: "documents",   from: "#D97706", via: "#FBBF24" },
};

const now = Date.now();
const threeDaysMs = 3 * 24 * 60 * 60 * 1000;

function isWithinDays(date: string, days: number): boolean {
  try {
    const d = new Date(date);
    const ms = days * 24 * 60 * 60 * 1000;
    return (now - d.getTime()) <= ms && d.getTime() <= now;
  } catch { return false; }
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const colItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export function CategoryColumns({ sections }: { sections: { label: string; items: PostCard[] }[] }) {
  return (
    <section className="py-10">
      <div className="container-page">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-9 w-1.5 rounded-full bg-gradient-to-b from-[#0D9488] via-[#EA580C] to-[#4F46E5]" />
          <div>
            <h2 className="text-2xl font-black text-slate-800">Latest Updates</h2>
            <p className="text-sm text-slate-500">Browse the latest government job notifications, results and admit cards</p>
          </div>
        </div>
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => {
            const cfg = categoryConfig[section.label];
            return (
              <motion.div key={section.label} variants={colItem} className="group/card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all active:scale-[0.98] hover:shadow-xl hover:-translate-y-0.5">
                    <div className="relative px-4 py-3 sm:px-5 sm:py-3.5 text-white" style={{ background: `linear-gradient(135deg, ${cfg?.from || "#0D9488"}, ${cfg?.via || "#14B8A6"})` }}>
                  <div className="absolute right-2 top-2 h-16 w-16 rounded-full bg-white/10 blur-xl" />
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black tracking-wide">{section.label}</h3>
                    <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold backdrop-blur-sm">{section.items.length} Posts</span>
                  </div>
                </div>
                <ul className="divide-y divide-slate-100">
                  {section.items.slice(0, 10).map((item, i) => (
                    <li key={item.title}>
                      <Link
                        href={item.slug ? `/post/${item.slug}` : "#"}
                        className="group/item flex items-start gap-3 px-4 sm:px-5 py-3 text-sm transition active:bg-slate-100 hover:bg-slate-50"
                      >
                        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${i === 0 ? "bg-amber-400" : "bg-slate-300"}`} />
                        <div className="min-w-0 flex-1">
                          <span className={`leading-snug ${i === 0 ? "font-bold text-slate-800" : "font-medium text-slate-600"} line-clamp-2 transition group-hover/item:text-[${cfg?.from || "#0D9488"}]`}>
                            {item.title}
                          </span>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" />
                              {item.date}
                            </span>
                            {isWithinDays(item.date, 3) ? (
                              <span className="inline-flex items-center gap-0.5 rounded bg-orange-50 px-1.5 py-0.5 text-[10px] font-bold text-[#EA580C] ring-1 ring-orange-200">
                                <Sparkles className="h-2.5 w-2.5" /> NEW
                              </span>
                            ) : section.label === "Latest Vacancy" && item.isExpired ? (
                              <span className="inline-flex items-center gap-0.5 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-600 ring-1 ring-red-200">
                                EXPIRED
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
                  <Link
                    href={cfg?.slug ? `/${cfg.slug}` : "#"}
                    className="inline-flex items-center gap-1.5 text-sm font-bold transition hover:gap-2"
                    style={{ color: cfg?.from || "#0D9488" }}
                  >
                    View All {section.label} <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
