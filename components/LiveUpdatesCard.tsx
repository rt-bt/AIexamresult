"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";

export type UpdateType = "RESULT" | "ADMIT CARD" | "JOB" | "ANSWER KEY";

export interface LiveUpdateItem {
  type: UpdateType;
  title: string;
  slug: string;
  date: string;
}

interface LiveUpdatesCardProps {
  items: LiveUpdateItem[];
}

const TYPE_CONFIG: Record<UpdateType, { dot: string; label: string; link: string }> = {
  RESULT:       { dot: "bg-emerald-400",  label: "Result",     link: "/results"     },
  "ADMIT CARD": { dot: "bg-sky-400",      label: "Admit Card", link: "/admit-card"  },
  JOB:          { dot: "bg-amber-400",    label: "Job",        link: "/latest-jobs" },
  "ANSWER KEY": { dot: "bg-violet-400",   label: "Answer Key", link: "/answer-key"  },
};

export function LiveUpdatesCard({ items = [] }: LiveUpdatesCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused]       = useState(false);
  const [reduced, setReduced]         = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches || window.innerWidth < 768) setReduced(true);
  }, []);

  useEffect(() => {
    if (reduced || isPaused || items.length <= 1) return;
    const t = setInterval(() => setActiveIndex(p => (p + 1) % items.length), 3200);
    return () => clearInterval(t);
  }, [reduced, isPaused, items.length]);

  const displayItems = items.length > 0 ? items : [
    { type: "RESULT"      as UpdateType, title: "SBI Clerk JA Pre Result 2026 Declared",           slug: "results",     date: "Today" },
    { type: "ADMIT CARD"  as UpdateType, title: "UPSSSC PET Exam Admit Card 2026 Download",         slug: "admit-card",  date: "Today" },
    { type: "JOB"         as UpdateType, title: "Railway RRB NTPC 11,558 Posts Recruitment",        slug: "latest-jobs", date: "Active" },
    { type: "ANSWER KEY"  as UpdateType, title: "SSC CGL Tier 1 Official Answer Key Released",      slug: "answer-key",  date: "Today" },
  ];

  return (
    <div
      className="w-full max-w-lg mx-auto lg:max-w-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Live exam and job updates"
    >
      {/* Card */}
      <div className="rounded-2xl border border-white/15 bg-white/[0.07] backdrop-blur-xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[13px] font-semibold text-white/90 tracking-normal">
              Live Updates
            </span>
          </div>
          <Link
            href="/results"
            className="flex items-center gap-1 text-xs text-white/50 hover:text-teal-300 transition-colors"
          >
            View all
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Feed Items */}
        <div className="divide-y divide-white/[0.06]">
          {displayItems.slice(0, 4).map((item, idx) => {
            const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.RESULT;
            const isActive = !reduced && activeIndex === idx;

            return (
              <Link
                key={idx}
                href={item.slug ? `/post/${item.slug}` : cfg.link}
                onFocus={() => setActiveIndex(idx)}
                className={`group flex items-center gap-3.5 px-4 py-3.5 transition-colors duration-200 ${
                  isActive
                    ? "bg-white/[0.09]"
                    : "hover:bg-white/[0.05]"
                } ${idx >= 3 ? "hidden sm:flex" : "flex"}`}
              >
                {/* Left accent dot */}
                <span className={`shrink-0 w-1.5 h-1.5 rounded-full mt-0.5 ${cfg.dot}`} aria-hidden="true" />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                      item.type === "RESULT"      ? "text-emerald-400" :
                      item.type === "ADMIT CARD"  ? "text-sky-400"     :
                      item.type === "JOB"         ? "text-amber-400"   :
                                                    "text-violet-400"
                    }`}>
                      {cfg.label}
                    </span>
                    {item.date && (
                      <span className="text-[10px] text-white/35">{item.date}</span>
                    )}
                  </div>
                  <p className="text-[13px] leading-snug text-white/80 group-hover:text-white line-clamp-2 transition-colors">
                    {item.title}
                  </p>
                </div>

                {/* Arrow */}
                <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-teal-300 shrink-0 transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-200" />
              </Link>
            );
          })}
        </div>

        {/* Footer link */}
        <div className="px-4 py-3 border-t border-white/[0.06]">
          <Link
            href="/results"
            className="text-[11px] text-white/35 hover:text-teal-300 transition-colors"
          >
            See all exam results & job alerts →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LiveUpdatesCard;
