import React from "react";
import Link from "next/link";
import { Briefcase, IdCard, Trophy, FileCheck2, BookOpen } from "lucide-react";

export interface CategoryCounts {
  jobs?: number;
  admit?: number;
  results?: number;
  answerKeys?: number;
  syllabus?: number;
}

interface CategoryTilesProps {
  counts?: CategoryCounts;
}

const CATEGORIES = [
  {
    key: "jobs",
    title: "Latest Jobs",
    href: "/latest-jobs",
    icon: Briefcase,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    hoverBorder: "hover:border-amber-200",
    hoverText: "group-hover:text-amber-600",
    dot: "bg-amber-400",
  },
  {
    key: "admit",
    title: "Admit Card",
    href: "/admit-card",
    icon: IdCard,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    hoverBorder: "hover:border-sky-200",
    hoverText: "group-hover:text-sky-600",
    dot: "bg-sky-400",
  },
  {
    key: "results",
    title: "Result",
    href: "/results",
    icon: Trophy,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    hoverBorder: "hover:border-emerald-200",
    hoverText: "group-hover:text-emerald-600",
    dot: "bg-emerald-400",
  },
  {
    key: "answerKeys",
    title: "Answer Key",
    href: "/answer-key",
    icon: FileCheck2,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    hoverBorder: "hover:border-violet-200",
    hoverText: "group-hover:text-violet-600",
    dot: "bg-violet-400",
  },
  {
    key: "syllabus",
    title: "Syllabus",
    href: "/syllabus",
    icon: BookOpen,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
    hoverBorder: "hover:border-teal-200",
    hoverText: "group-hover:text-teal-600",
    dot: "bg-teal-400",
  },
] as const;

type CatKey = typeof CATEGORIES[number]["key"];

const FALLBACK: Record<CatKey, string> = {
  jobs:       "478+ Vacancies",
  admit:      "234+ Hall Tickets",
  results:    "329+ Declared",
  answerKeys: "123+ Official Keys",
  syllabus:   "22+ Exam Patterns",
};

export function CategoryTiles({ counts }: CategoryTilesProps) {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full"
      aria-label="Popular exam categories"
    >
      {CATEGORIES.map((cat, idx) => {
        const Icon = cat.icon;
        const count =
          counts?.[cat.key] != null
            ? `${counts[cat.key]}+ ${cat.key === "jobs" ? "Vacancies" : cat.key === "admit" ? "Hall Tickets" : cat.key === "results" ? "Declared" : cat.key === "answerKeys" ? "Official Keys" : "Exam Patterns"}`
            : FALLBACK[cat.key];

        // Last tile spans full width on mobile (2-col) but not on sm+
        const spanFull = idx === CATEGORIES.length - 1;

        return (
          <Link
            key={cat.title}
            href={cat.href}
            className={`group flex flex-col justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md ${cat.hoverBorder} hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 min-h-[88px] ${
              spanFull ? "col-span-2 sm:col-span-1" : ""
            }`}
          >
            {/* Icon + dot indicator */}
            <div className="flex items-center justify-between">
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${cat.iconBg}`}>
                <Icon className={`h-4.5 w-4.5 ${cat.iconColor}`} size={18} />
              </span>
              <span className={`h-1.5 w-1.5 rounded-full ${cat.dot} opacity-70`} aria-hidden="true" />
            </div>

            {/* Text */}
            <div>
              <h3 className={`text-[13px] font-semibold text-gray-800 ${cat.hoverText} transition-colors leading-tight`}>
                {cat.title}
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">{count}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default CategoryTiles;
