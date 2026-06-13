"use client";

import { useState } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Signal, Layers, BookOpen, BarChart3, FlaskConical, Lightbulb, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Difficulty = "Easy" | "Medium" | "Hard" | "Very Hard";

interface ExamDifficulty {
  name: string;
  slug: string;
  overall: Difficulty;
  subjects: { name: string; icon: LucideIcon; level: Difficulty; color: string }[];
  rating: number; // 1-10
  color: string;
}

const exams: ExamDifficulty[] = [
  {
    name: "SSC CGL", slug: "ssc-cgl", overall: "Medium", rating: 6.5, color: "#0D9488",
    subjects: [
      { name: "Quantitative Aptitude", icon: BarChart3, level: "Hard", color: "#F97316" },
      { name: "General Intelligence", icon: Lightbulb, level: "Medium", color: "#6366F1" },
      { name: "English", icon: BookOpen, level: "Medium", color: "#0D9488" },
      { name: "General Awareness", icon: FlaskConical, level: "Easy", color: "#10B981" },
    ],
  },
  {
    name: "UPSC CSE", slug: "upsc-cse", overall: "Very Hard", rating: 9.2, color: "#EF4444",
    subjects: [
      { name: "GS Paper 1", icon: BookOpen, level: "Very Hard", color: "#EF4444" },
      { name: "CSAT", icon: BarChart3, level: "Medium", color: "#6366F1" },
      { name: "Optional Subject", icon: Layers, level: "Very Hard", color: "#EF4444" },
      { name: "Essay", icon: BookOpen, level: "Hard", color: "#F97316" },
    ],
  },
  {
    name: "RRB NTPC", slug: "rrb-ntpc", overall: "Medium", rating: 5.8, color: "#6366F1",
    subjects: [
      { name: "Mathematics", icon: BarChart3, level: "Medium", color: "#0D9488" },
      { name: "General Intelligence", icon: Lightbulb, level: "Easy", color: "#10B981" },
      { name: "General Science", icon: FlaskConical, level: "Medium", color: "#F97316" },
      { name: "General Awareness", icon: BookOpen, level: "Easy", color: "#10B981" },
    ],
  },
  {
    name: "IBPS PO", slug: "ibps-po", overall: "Hard", rating: 7.2, color: "#F97316",
    subjects: [
      { name: "Reasoning", icon: Lightbulb, level: "Hard", color: "#EF4444" },
      { name: "Quantitative Aptitude", icon: BarChart3, level: "Hard", color: "#F97316" },
      { name: "English", icon: BookOpen, level: "Medium", color: "#6366F1" },
      { name: "General Awareness", icon: FlaskConical, level: "Medium", color: "#0D9488" },
    ],
  },
  {
    name: "SSC MTS", slug: "ssc-mts", overall: "Easy", rating: 3.2, color: "#10B981",
    subjects: [
      { name: "Numerical Aptitude", icon: BarChart3, level: "Easy", color: "#10B981" },
      { name: "General Intelligence", icon: Lightbulb, level: "Easy", color: "#10B981" },
      { name: "English", icon: BookOpen, level: "Medium", color: "#6366F1" },
      { name: "General Awareness", icon: FlaskConical, level: "Easy", color: "#10B981" },
    ],
  },
];

const difficultyColors: Record<Difficulty, string> = {
  "Easy": "#10B981",
  "Medium": "#F97316",
  "Hard": "#EF4444",
  "Very Hard": "#7C3AED",
};

export default function DifficultyMeterPage() {
  const [selected, setSelected] = useState(exams[0]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Exam Difficulty Meter</h1>
              <p className="mt-2 text-gray-500 text-sm">Subject-wise difficulty analysis based on past data</p>
            </div>

            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-lg">
              <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5"><Signal className="h-4 w-4 text-brand" /> Select Exam</label>
              <div className="flex flex-wrap gap-1.5">
                {exams.map((e) => (
                  <button key={e.name} onClick={() => setSelected(e)}
                    className={cn("rounded-full px-3 py-1.5 text-xs font-semibold border transition",
                      selected.name === e.name ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-gray-200"
                    )}>
                    {e.overall === "Very Hard" ? "🔥 " : e.overall === "Hard" ? "⚡ " : e.overall === "Medium" ? "📊 " : "✅ "}
                    {e.name}
                  </button>
                ))}
              </div>

              {/* Overall Rating */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-400 uppercase font-bold">Overall Difficulty</p>
                <p className="text-5xl font-black mt-1" style={{ color: difficultyColors[selected.overall] }}>{selected.overall}</p>
                <p className="text-sm text-gray-500 mt-1">Rating: {selected.rating}/10</p>
                <div className="mx-auto mt-2 h-2 w-full max-w-xs rounded-full bg-gray-100">
                  <div className="h-full rounded-full transition-all" style={{ width: `${selected.rating * 10}%`, backgroundColor: difficultyColors[selected.overall] }} />
                </div>
              </div>

              {/* Subject breakdown */}
              <div className="mt-6 space-y-3">
                {selected.subjects.map((s) => {
                  const Icon = s.icon;
                  const lvlColor = difficultyColors[s.level];
                  return (
                    <div key={s.name} className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                      <Icon className="h-5 w-5 shrink-0" style={{ color: lvlColor }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-700">{s.name}</p>
                      </div>
                      <span className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ backgroundColor: lvlColor }}>{s.level}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 rounded-xl bg-white border border-gray-100 p-4 shadow-sm text-xs">
              <p className="font-bold text-gray-700 mb-2">🔑 Difficulty Guide</p>
              <div className="flex flex-wrap gap-3">
                {(["Easy", "Medium", "Hard", "Very Hard"] as Difficulty[]).map((d) => (
                  <span key={d} className="flex items-center gap-1">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: difficultyColors[d] }} />
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
