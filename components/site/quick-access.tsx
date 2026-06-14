"use client";

import { Award, BookOpen, BriefcaseBusiness, ClipboardCheck, FileCheck2, GraduationCap, KeyRound, Megaphone, type LucideIcon, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const links: Array<[string, string, LucideIcon, string, string]> = [
  ["Results", "Board, university & recruitment", FileCheck2, "#0D9488", "#14B8A6"],
  ["Latest Vacancy", "Central & state vacancies", BriefcaseBusiness, "#D97706", "#F59E0B"],
  ["Admit Card", "Hall tickets & city info", ClipboardCheck, "#059669", "#10B981"],
  ["Answer Key", "Official keys & objections", KeyRound, "#DC2626", "#EF4444"],
  ["Admissions", "Entrance & college notices", GraduationCap, "#7C3AED", "#A78BFA"],
  ["Syllabus", "Exam pattern & prep", BookOpen, "#2563EB", "#60A5FA"],
  ["Scholarships", "Student schemes & aid", Award, "#DB2777", "#F472B6"],
  ["Updates", "Pinned public notices", Megaphone, "#EA580C", "#FB923C"]
];

export function QuickAccess() {
  return (
    <section className="pb-14">
      <div className="container-page">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-8 w-1.5 rounded-full bg-gradient-to-b from-[#0D9488] via-[#EA580C] to-[#4F46E5]" />
          <div>
            <h2 className="text-lg font-black text-slate-800">Browse Categories</h2>
            <p className="text-xs text-slate-500">Quick access to all exam updates</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {links.map(([title, desc, Icon, from, to]) => (
            <Link
              key={title}
              href={`/${title.toLowerCase().replace(/\s+/g, "-")}`}
              className="group relative block overflow-hidden rounded-2xl p-5 text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]"
              style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
            >
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl transition-all duration-300 group-hover:scale-150" />
              <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-black/5 blur-xl" />
              <div className="relative flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Icon className="h-5 w-5" />
                </span>
                <ArrowUpRight className="h-4 w-4 text-white/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/90" />
              </div>
              <div className="relative mt-4">
                <h3 className="text-base font-extrabold tracking-tight drop-shadow-sm">{title}</h3>
                <p className="mt-1 text-xs leading-4 text-white/80">{desc}</p>
              </div>
              <div className="relative mt-3 h-1 w-8 rounded-full bg-white/30 transition-all duration-300 group-hover:w-full group-hover:bg-white/50" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}