"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarDays, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { PostCard } from "@/lib/data";

const categoryConfig: Record<string, { slug: string }> = {
  "Result":         { slug: "results" },
  "Admit Card":     { slug: "admit-card" },
  "Latest Vacancy": { slug: "latest-jobs" },
  "Answer Keys":    { slug: "answer-key" },
  "Admissions":     { slug: "admissions" },
  "Documents":      { slug: "documents" },
};

const now = Date.now();

function isWithinDays(date: string, days: number): boolean {
  try {
    const d = new Date(date);
    const ms = days * 24 * 60 * 60 * 1000;
    return (now - d.getTime()) <= ms && d.getTime() <= now;
  } catch { return false; }
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const colItem = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function CategoryColumns({ sections }: { sections: { label: string; items: PostCard[] }[] }) {
  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC] font-sans border-b border-[#E2E8F0]">
      <div className="container-page">
        {/* Section Heading */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F28A2E]" />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#8B8F96]">
                CATEGORIZED PORTAL
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight font-heading">
              Latest Updates by Category
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#8B8F96] max-w-md">
            Direct verified links for government examinations, recruitment notifications and official keys.
          </p>
        </div>

        {/* 6-Column Responsive Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {sections.map((section) => {
            const cfg = categoryConfig[section.label];
            return (
              <motion.div
                key={section.label}
                variants={colItem}
                className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-xs hover:shadow-md hover:border-[#8B8F96]/50 transition-all duration-200 flex flex-col h-full"
              >
                {/* Column Header: Dark Slate Minimal */}
                <div className="bg-[#343A46] px-5 py-3.5 flex items-center justify-between border-b border-white/[0.15]">
                  <h3 className="text-base font-bold text-white tracking-wide font-heading">
                    {section.label}
                  </h3>
                  <span className="rounded bg-[#F28A2E] px-2.5 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider">
                    {section.items.length} Updates
                  </span>
                </div>

                {/* Updates List */}
                <ul className="divide-y divide-[#F1F5F9] flex-1">
                  {section.items.slice(0, 8).map((item, i) => (
                    <li key={item.title}>
                      <Link
                        href={item.slug ? `/post/${item.slug}` : "#"}
                        className="group flex items-start gap-3 px-5 py-3 text-sm transition-colors hover:bg-slate-50"
                      >
                        <span
                          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                            i === 0 ? "bg-[#F28A2E]" : "bg-slate-300"
                          }`}
                          aria-hidden="true"
                        />
                        <div className="min-w-0 flex-1">
                          <span className={`block leading-snug ${
                            i === 0 ? "font-semibold text-[#172033]" : "font-normal text-slate-700"
                          } line-clamp-2 group-hover:text-[#F28A2E] transition-colors`}>
                            {item.title}
                          </span>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11.5px] text-[#8B8F96]">
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" aria-hidden="true" />
                              {item.date}
                            </span>
                            {isWithinDays(item.date, 3) ? (
                              <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.2 bg-[#F28A2E]/10 text-[10px] font-bold text-[#F28A2E]">
                                <Sparkles className="h-2.5 w-2.5" /> NEW
                              </span>
                            ) : section.label === "Latest Vacancy" && item.isExpired ? (
                              <span className="rounded px-1.5 py-0.2 bg-red-50 text-[10px] font-bold text-red-600">
                                EXPIRED
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Column Footer */}
                <div className="border-t border-[#E2E8F0] bg-slate-50/70 px-5 py-2.5 mt-auto">
                  <Link
                    href={cfg?.slug ? `/${cfg.slug}` : "#"}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#343A46] hover:text-[#F28A2E] transition-colors font-heading"
                  >
                    <span>View All {section.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
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
