"use client";

import { Award, BookOpen, BriefcaseBusiness, ClipboardCheck, FileCheck2, GraduationCap, KeyRound, Megaphone, type LucideIcon, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const links: Array<[string, string, LucideIcon]> = [
  ["Results", "Board, university & recruitment", FileCheck2],
  ["Latest Vacancy", "Central & state vacancies", BriefcaseBusiness],
  ["Admit Card", "Hall tickets & city info", ClipboardCheck],
  ["Answer Key", "Official keys & objections", KeyRound],
  ["Admissions", "Entrance & college notices", GraduationCap],
  ["Syllabus", "Exam pattern & prep", BookOpen],
  ["Scholarships", "Student schemes & aid", Award],
  ["Updates", "Pinned public notices", Megaphone]
];

export function QuickAccess() {
  return (
    <section className="pb-14">
      <div className="container-page">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-8 w-1.5 rounded-full bg-gradient-to-b from-[#0D9488] via-[#EA580C] to-[#4F46E5]" />
          <div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">Browse Categories</h2>
            <p className="text-xs text-slate-500 dark:text-slate-300">Quick access to all exam updates</p>
          </div>
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {links.map(([title, desc, Icon]) => (
            <Link
              key={title}
              href={`/${title.toLowerCase().replace(/\s+/g, "-")}`}
              className="group flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:border-teal-500 hover:shadow-md active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 transition group-hover:text-teal-700 truncate">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">{desc}</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-teal-600" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}