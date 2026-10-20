"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Sparkles, CheckCircle2, Bell } from "lucide-react";

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

const TYPE_STYLES: Record<UpdateType, { badge: string }> = {
  RESULT: {
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  },
  "ADMIT CARD": {
    badge: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  },
  JOB: {
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  },
  "ANSWER KEY": {
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  },
};

export function LiveUpdatesCard({ items = [] }: LiveUpdatesCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isStaticMode, setIsStaticMode] = useState(false);

  // Check screen width and prefers-reduced-motion
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isMobile || prefersReducedMotion) {
      setIsStaticMode(true);
      return;
    }

    setIsStaticMode(false);
  }, []);

  // Auto-rotate every 3 seconds unless hovered or in static mode
  useEffect(() => {
    if (isStaticMode || isPaused || items.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isStaticMode, isPaused, items.length]);

  // Fallback items if none provided
  const displayItems =
    items.length > 0
      ? items
      : [
          {
            type: "RESULT" as UpdateType,
            title: "SBI Clerk JA Pre Result 2026 Declared",
            slug: "results",
            date: "Today",
          },
          {
            type: "ADMIT CARD" as UpdateType,
            title: "UPSSSC PET Exam Admit Card 2026 Download",
            slug: "admit-card",
            date: "Today",
          },
          {
            type: "JOB" as UpdateType,
            title: "Railway RRB NTPC 11,558 Posts Recruitment",
            slug: "latest-jobs",
            date: "Active",
          },
          {
            type: "ANSWER KEY" as UpdateType,
            title: "SSC CGL Tier 1 Official Answer Key Released",
            slug: "answer-key",
            date: "Today",
          },
        ];

  return (
    <div
      className="relative w-full max-w-lg mx-auto lg:max-w-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Live exam and job updates"
    >
      {/* Decorative Floating Chip 1: New Alert (Top-Right) */}
      <div
        className="absolute -top-3.5 -right-2 sm:-right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D9488] text-white text-[11px] font-bold shadow-lg shadow-teal-950/40 border border-teal-300/40 pointer-events-none"
        style={{ animation: "float 4s ease-in-out infinite" }}
        aria-hidden="true"
      >
        <Sparkles className="w-3 h-3 text-teal-200" />
        <span>NEW ALERTS</span>
      </div>

      {/* Decorative Floating Chip 2: Verified (Bottom-Left) */}
      <div
        className="absolute -bottom-3 -left-2 sm:-left-3 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/95 text-white text-[11px] font-medium shadow-lg backdrop-blur-md border border-white/20 pointer-events-none"
        style={{ animation: "float 4.5s ease-in-out 1s infinite" }}
        aria-hidden="true"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>100% Verified</span>
      </div>

      {/* Decorative Floating Chip 3: Real-Time (Mid-Right on Desktop) */}
      <div
        className="absolute top-1/2 -right-3 sm:-right-4 z-20 hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 text-white text-[10px] font-medium shadow-md backdrop-blur-md border border-white/20 pointer-events-none"
        style={{ animation: "float 5s ease-in-out 2s infinite" }}
        aria-hidden="true"
      >
        <Bell className="w-3 h-3 text-amber-300" />
        <span>Live Feed</span>
      </div>

      {/* Glassmorphism Main Card Container */}
      <div className="relative z-10 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-4 sm:p-5 lg:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        {/* Card Header with Pulsing Live Dot */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-sm sm:text-base font-bold text-white tracking-wide uppercase font-heading">
              Live Updates
            </span>
          </div>
          <Link
            href="/results"
            className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-teal-300 hover:text-teal-200 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Stack of Update Items */}
        <div className="flex flex-col gap-2.5">
          {displayItems.slice(0, 4).map((item, index) => {
            const isHighlighted = !isStaticMode && activeIndex === index;
            const style = TYPE_STYLES[item.type] || TYPE_STYLES.RESULT;

            return (
              <Link
                key={item.slug || index}
                href={item.slug ? `/post/${item.slug}` : "/results"}
                className={`group flex items-start justify-between gap-3 p-3 rounded-xl border transition-all duration-300 min-h-[48px] ${
                  index >= 3 ? "hidden sm:flex" : "flex"
                } ${
                  isHighlighted
                    ? "bg-white/[0.16] border-teal-400/60 shadow-md shadow-teal-950/30 sm:translate-x-1"
                    : "bg-white/[0.05] border-white/10 hover:bg-white/[0.12] hover:border-white/25"
                }`}
                onFocus={() => setActiveIndex(index)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${style.badge}`}
                    >
                      {item.type}
                    </span>
                    {item.date && (
                      <span className="text-[11px] text-white/60">
                        {item.date}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs sm:text-[13px] font-semibold text-white/95 group-hover:text-teal-300 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-white/5 group-hover:bg-teal-500/20 text-white/40 group-hover:text-teal-300 transition-all shrink-0 mt-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default LiveUpdatesCard;
