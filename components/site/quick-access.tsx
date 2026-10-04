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
          <span className="h-8 w-1.5 rounded-full bg-gradient-to-b from-[#FFD84D] via-[#FF5B3E] to-[#111111]" />
          <div>
            <h2 className="text-lg font-bold text-[#111111] font-heading">Browse Categories</h2>
            <p className="text-xs text-neutral-500 font-sans">Quick access to all exam updates</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {links.map(([title, desc, Icon]) => (
            <Link
              key={title}
              href={`/${title.toLowerCase().replace(/\s+/g, "-")}`}
              className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-[#DEDEDE] bg-white p-3 sm:p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:border-[#111111]/40 hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <span className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-[#111111] transition group-hover:bg-[#FFD84D] group-hover:text-[#111111]">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-[#111111] transition group-hover:text-[#FF5B3E] truncate font-heading">
                    {title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-neutral-500 truncate font-sans hidden xs:block">{desc}</p>
                </div>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-[#FF5B3E] hidden sm:block" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}