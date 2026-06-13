"use client";

import { Award, BookOpen, BriefcaseBusiness, ClipboardCheck, FileCheck2, GraduationCap, KeyRound, Megaphone, type LucideIcon, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const links: Array<[string, string, LucideIcon, string, string]> = [
  ["Results", "Board, university & recruitment", FileCheck2, "from-[#0D9488] to-[#14B8A6]", "#0D9488"],
  ["Latest Vacancy", "Central & state vacancies", BriefcaseBusiness, "from-[#F59E0B] to-[#FBBF24]", "#F59E0B"],
  ["Admit Card", "Hall tickets & city info", ClipboardCheck, "from-[#10B981] to-[#34D399]", "#10B981"],
  ["Answer Key", "Official keys & objections", KeyRound, "from-[#EF4444] to-[#F87171]", "#EF4444"],
  ["Admissions", "Entrance & college notices", GraduationCap, "from-[#8B5CF6] to-[#A78BFA]", "#8B5CF6"],
  ["Syllabus", "Exam pattern & prep", BookOpen, "from-[#3B82F6] to-[#60A5FA]", "#3B82F6"],
  ["Scholarships", "Student schemes & aid", Award, "from-[#EC4899] to-[#F472B6]", "#EC4899"],
  ["Updates", "Pinned public notices", Megaphone, "from-[#F97316] to-[#FB923C]", "#F97316"]
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function QuickAccess() {
  return (
    <section className="relative -mt-10 pb-10">
      <div className="container-page">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {links.map(([title, desc, Icon, gradient, color]) => (
            <motion.div key={title} variants={item}>
              <Link
                href={`/${title.toLowerCase().replace(/\s+/g, "-")}`}
                className="group relative block overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/60 bg-white p-4 sm:p-5 shadow-lg shadow-black/[0.03] transition-all active:scale-[0.97] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/[0.05]"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100" style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-0 blur-sm transition-all group-hover:scale-150 group-hover:opacity-10" style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }} />
                <div className="flex items-start justify-between">
                  <span className="inline-grid h-10 w-10 sm:h-12 sm:w-12 shrink-0 place-items-center rounded-lg sm:rounded-xl shadow-md transition-all group-hover:scale-110 group-hover:-rotate-3" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" style={{ color }} />
                </div>
                <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-black text-slate-800">{title}</h3>
                <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-500">{desc}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
