"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarDays, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { PostCard } from "@/lib/data";

const categoryConfig: Record<string, { slug: string; from: string; via: string }> = {
  "Result":         { slug: "results",     from: "#111111", via: "#222222" },
  "Admit Card":     { slug: "admit-card",  from: "#181818", via: "#2a2a2a" },
  "Latest Vacancy": { slug: "latest-jobs", from: "#0f0f0f", via: "#1f1f1f" },
  "Answer Keys":    { slug: "answer-key",  from: "#141414", via: "#262626" },
  "Admissions":     { slug: "admissions",  from: "#1c1c1c", via: "#2e2e2e" },
  "Documents":      { slug: "documents",   from: "#111111", via: "#222222" },
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
    <section className="py-6 sm:py-8 font-sans">
      <div className="container-page">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-9 w-1.5 rounded-full bg-gradient-to-b from-[#FFD84D] via-[#FF5B3E] to-[#111111]" />
          <div>
            <h2 className="text-2xl font-bold text-[#111111] font-heading">Latest Updates</h2>
            <p className="text-sm text-neutral-500 font-sans">Browse the latest government job notifications, results and admit cards</p>
          </div>
        </div>
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => {
            const cfg = categoryConfig[section.label];
            return (
              <motion.div
                key={section.label}
                variants={colItem}
                className="group/card rounded-3xl p-1 bg-gradient-to-b from-[#DEDEDE]/80 via-white to-[#DEDEDE]/40 shadow-xs hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              >
                <div className="overflow-hidden rounded-[22px] border border-[#DEDEDE] bg-white flex flex-col h-full">
                  <div className="relative px-5 py-4 text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${cfg?.from || "#111111"}, ${cfg?.via || "#222222"})` }}>
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#FFD84D]/10 blur-xl pointer-events-none" />
                    <div className="flex items-center justify-between relative z-10">
                      <h3 className="text-[17px] font-bold tracking-wide font-heading text-white">{section.label}</h3>
                      <span className="rounded-full bg-[#FFD84D] px-3 py-0.5 text-xs font-bold text-[#111111] shadow-xs">{section.items.length} Posts</span>
                    </div>
                  </div>
                  <ul className="divide-y divide-neutral-100 flex-1">
                    {section.items.slice(0, 8).map((item, i) => (
                      <li key={item.title}>
                        <Link
                          href={item.slug ? `/post/${item.slug}` : "#"}
                          className="group/item flex items-start gap-3.5 px-5 py-3.5 text-[15px] transition-all duration-200 hover:bg-neutral-50/80 active:bg-neutral-100"
                        >
                          <span className={`mt-2 h-2 w-2 shrink-0 rounded-full transition-transform duration-200 group-hover/item:scale-125 ${i === 0 ? "bg-[#FF5B3E]" : "bg-neutral-300"}`} aria-hidden="true" />
                          <div className="min-w-0 flex-1">
                            <span className={`block leading-snug ${i === 0 ? "font-bold text-[#111111]" : "font-medium text-neutral-800"} line-clamp-2 transition-colors duration-200 group-hover/item:text-[#FF5B3E]`}>
                              {item.title}
                            </span>
                            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[12.5px] text-neutral-400">
                              <span className="inline-flex items-center gap-1">
                                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                                {item.date}
                              </span>
                              {isWithinDays(item.date, 3) ? (
                                <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-bold text-[#EA580C] ring-1 ring-orange-200 font-heading">
                                  <Sparkles className="h-3 w-3" aria-hidden="true" /> NEW
                                </span>
                              ) : section.label === "Latest Vacancy" && item.isExpired ? (
                                <span className="inline-flex items-center gap-0.5 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-600 ring-1 ring-red-200 font-heading">
                                  EXPIRED
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-[#DEDEDE] bg-neutral-50/80 px-5 py-3 mt-auto">
                    <Link
                      href={cfg?.slug ? `/${cfg.slug}` : "#"}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#111111] transition-all duration-200 hover:text-[#FF5B3E] hover:translate-x-1 font-heading"
                    >
                      View All {section.label} <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
