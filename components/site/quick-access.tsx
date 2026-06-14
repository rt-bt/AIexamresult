"use client";

import { Award, BookOpen, BriefcaseBusiness, ClipboardCheck, FileCheck2, GraduationCap, KeyRound, Megaphone, type LucideIcon } from "lucide-react";
import Link from "next/link";

const links: Array<[string, string, LucideIcon, string]> = [
  ["Results", "Board, university & recruitment", FileCheck2, "#0D9488"],
  ["Latest Vacancy", "Central & state vacancies", BriefcaseBusiness, "#F59E0B"],
  ["Admit Card", "Hall tickets & city info", ClipboardCheck, "#10B981"],
  ["Answer Key", "Official keys & objections", KeyRound, "#EF4444"],
  ["Admissions", "Entrance & college notices", GraduationCap, "#8B5CF6"],
  ["Syllabus", "Exam pattern & prep", BookOpen, "#3B82F6"],
  ["Scholarships", "Student schemes & aid", Award, "#EC4899"],
  ["Updates", "Pinned public notices", Megaphone, "#F97316"]
];

export function QuickAccess() {
  return (
    <section className="pb-14">
      <div className="container-page">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {links.map(([title, desc, Icon, color]) => (
            <Link
              key={title}
              href={`/${title.toLowerCase().replace(/\s+/g, "-")}`}
              className="group relative block overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-slate-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/60 pointer-events-none" />
              <div className="flex items-center gap-4">
                <span
                  className="relative inline-grid h-12 w-12 shrink-0 place-items-center rounded-xl shadow-sm transition-transform duration-200 group-hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
                >
                  <Icon className="h-6 w-6 text-white" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                  <p className="mt-0.5 text-xs leading-4 text-slate-500 line-clamp-1">{desc}</p>
                </div>
              </div>
              <div className="mt-3 h-0.5 w-0 rounded-full transition-all duration-300 group-hover:w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
