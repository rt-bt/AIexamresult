import React from "react";
import Link from "next/link";
import {
  Briefcase,
  IdCard,
  Trophy,
  FileCheck2,
  BookOpen,
  ArrowRight,
} from "lucide-react";

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

export function CategoryTiles({ counts }: CategoryTilesProps) {
  const jobsCount = counts?.jobs || 470;
  const admitCount = counts?.admit || 230;
  const resultsCount = counts?.results || 320;
  const answerKeysCount = counts?.answerKeys || 120;
  const syllabusCount = counts?.syllabus || 25;

  const categories = [
    {
      title: "Latest Jobs",
      count: `${jobsCount}+ Vacancies`,
      href: "/latest-jobs",
      icon: Briefcase,
      color: "text-amber-600 bg-amber-50 group-hover:bg-amber-100",
      accentBorder: "group-hover:border-amber-300",
    },
    {
      title: "Admit Card",
      count: `${admitCount}+ Hall Tickets`,
      href: "/admit-card",
      icon: IdCard,
      color: "text-sky-600 bg-sky-50 group-hover:bg-sky-100",
      accentBorder: "group-hover:border-sky-300",
    },
    {
      title: "Result",
      count: `${resultsCount}+ Declared`,
      href: "/results",
      icon: Trophy,
      color: "text-emerald-600 bg-emerald-50 group-hover:bg-emerald-100",
      accentBorder: "group-hover:border-emerald-300",
    },
    {
      title: "Answer Key",
      count: `${answerKeysCount}+ Official Keys`,
      href: "/answer-key",
      icon: FileCheck2,
      color: "text-purple-600 bg-purple-50 group-hover:bg-purple-100",
      accentBorder: "group-hover:border-purple-300",
    },
    {
      title: "Syllabus",
      count: `${syllabusCount}+ Exam Patterns`,
      href: "/syllabus",
      icon: BookOpen,
      color: "text-teal-600 bg-teal-50 group-hover:bg-teal-100",
      accentBorder: "group-hover:border-teal-300",
    },
  ];

  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 w-full"
      aria-label="Popular Exam Categories"
    >
      {categories.map((cat, idx) => {
        const Icon = cat.icon;
        const isLastOnMobile = idx === categories.length - 1;

        return (
          <Link
            key={cat.title}
            href={cat.href}
            className={`group relative rounded-2xl border border-gray-200/90 bg-white/95 backdrop-blur-xl p-3.5 sm:p-4 lg:p-5 shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(13,148,136,0.18)] hover:-translate-y-1 hover:border-teal-500/60 active:scale-[0.98] transition-all duration-300 flex flex-col justify-between min-h-[92px] sm:min-h-[104px] ${
              isLastOnMobile ? "col-span-2 lg:col-span-1" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div
                className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl transition-colors ${cat.color}`}
              >
                <Icon className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
              </div>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#0D9488] transition-colors font-heading leading-tight">
                {cat.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">
                {cat.count}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default CategoryTiles;
