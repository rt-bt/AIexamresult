"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Signal, BookOpen, BarChart3, FlaskConical, Lightbulb, Loader2, RefreshCw, Layers, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExamAnalysis, ShiftAnalysis } from "@/lib/exam-analysis";

const EXAM_SLUGS = ["ssc-cgl", "rrb-ntpc", "ibps-po", "sbi-po", "upsc-cse", "ssc-chsl", "ssc-mts", "ibps-clerk", "rrb-group-d"];

const EXAM_LABELS: Record<string, string> = {
  "ssc-cgl": "SSC CGL",
  "rrb-ntpc": "RRB NTPC",
  "ibps-po": "IBPS PO",
  "sbi-po": "SBI PO",
  "upsc-cse": "UPSC CSE",
  "ssc-chsl": "SSC CHSL",
  "ssc-mts": "SSC MTS",
  "ibps-clerk": "IBPS Clerk",
  "rrb-group-d": "RRB Group D",
};

const ICON_MAP: Record<string, LucideIcon> = {
  "Quantitative Aptitude": BarChart3,
  "Mathematics": BarChart3,
  "Numerical Aptitude": BarChart3,
  "General Intelligence": Lightbulb,
  "Reasoning": Lightbulb,
  "English": BookOpen,
  "English Comprehension": BookOpen,
  "General Awareness": FlaskConical,
  "General Science": FlaskConical,
  "GS Paper 1": BookOpen,
  "CSAT": BarChart3,
  "Computer": Layers,
  "Optional Subject": Layers,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  "Easy": "#10B981",
  "Easy-Moderate": "#34D399",
  "Moderate": "#F97316",
  "Moderate-Difficult": "#EF4444",
  "Difficult": "#DC2626",
  "Very Difficult": "#7C3AED",
  "Very Hard": "#7C3AED",
  "Hard": "#DC2626",
};

function difficultyRating(d: string): number {
  const map: Record<string, number> = {
    "Easy": 2, "Easy-Moderate": 3.5, "Moderate": 5, "Moderate-Difficult": 6.5, "Difficult": 8, "Very Difficult": 9.5, "Very Hard": 9.5, "Hard": 8,
  };
  return map[d] ?? 5;
}

function getIcon(name: string): LucideIcon {
  const key = Object.keys(ICON_MAP).find((k) => name.toLowerCase().includes(k.toLowerCase()));
  return key ? ICON_MAP[key] : BookOpen;
}

export default function DifficultyMeterPage() {
  const [slug, setSlug] = useState("ssc-cgl");
  const [data, setData] = useState<ExamAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [shiftIdx, setShiftIdx] = useState(0);

  const fetchData = useCallback(async (s: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/exam-analysis?slug=${s}`);
      const json: ExamAnalysis = await res.json();
      setData(json);
      setShiftIdx(0);
    } catch {
      setData(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData(slug);
  }, [slug, fetchData]);

  const shift = data?.shifts?.[shiftIdx];

  const avgNum = data?.shifts?.length
    ? data.shifts.reduce((sum, s) => sum + difficultyRating(s.overallDifficulty), 0) / data.shifts.length
    : 0;
  const avgDifficulty = avgNum ? avgNum.toFixed(1) : "—";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Exam Difficulty Meter</h1>
              <p className="mt-2 text-gray-500 text-sm">Real shift-wise difficulty data from recent exams — automatically updated</p>
            </div>

            {/* Exam selector */}
            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-lg">
              <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5"><Signal className="h-4 w-4 text-brand" /> Select Exam</label>
              <div className="flex flex-wrap gap-1.5">
                {EXAM_SLUGS.map((s) => (
                  <button key={s} onClick={() => setSlug(s)}
                    className={cn("rounded-full px-3 py-1.5 text-xs font-semibold border transition",
                      slug === s ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-gray-200 hover:border-brand/30"
                    )}>
                    {EXAM_LABELS[s]}
                    {s === "upsc-cse" && <span className="ml-1 text-[10px] text-purple-500 font-bold">📄</span>}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  {data ? `Last updated: ${new Date(data.lastUpdated).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : " "}
                </p>
                <button onClick={() => fetchData(slug)} disabled={loading}
                  className="flex items-center gap-1 text-xs text-brand font-semibold hover:text-brand/70 transition">
                  <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} /> Refresh
                </button>
              </div>
            </div>

            {/* Mode badge */}
            {data && !loading && (
              <div className="mt-4">
                <div className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border",
                  data.mode === "Offline (Pen & Paper)" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-sky-50 text-sky-700 border-sky-200"
                )}>
                  {data.mode === "Offline (Pen & Paper)" ? "📄" : "💻"} {data.mode}
                </div>
              </div>
            )}

            {loading ? (
              <div className="mt-6 flex items-center justify-center rounded-2xl bg-white border border-gray-100 p-12 shadow-sm">
                <Loader2 className="h-6 w-6 animate-spin text-brand" />
                <span className="ml-2 text-sm text-gray-500">Fetching live analysis...</span>
              </div>
            ) : data && data.shifts.length > 0 ? (
              <>
                {/* Stats summary */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-white border border-gray-100 p-3 text-center shadow-sm">
                    <p className="text-xs text-gray-400">{data.mode === "Offline (Pen & Paper)" ? "Total Papers" : "Total Shifts"}</p>
                    <p className="text-lg font-black text-gray-800">{data.shifts.length}</p>
                  </div>
                  <div className="rounded-xl bg-white border border-gray-100 p-3 text-center shadow-sm">
                    <p className="text-xs text-gray-400">Avg Difficulty</p>
                    <p className="text-lg font-black" style={{ color: DIFFICULTY_COLORS[avgNum >= 6.5 ? "Difficult" : avgNum >= 4.5 ? "Moderate" : "Easy"] || "#F97316" }}>
                      {avgNum >= 6.5 ? "Hard" : avgNum >= 4.5 ? "Moderate" : "Easy"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white border border-gray-100 p-3 text-center shadow-sm">
                    <p className="text-xs text-gray-400">Rating</p>
                    <p className="text-lg font-black text-gray-800">{avgDifficulty}/10</p>
                  </div>
                </div>

                {/* Shift/Paper selector */}
                <div className="mt-4 rounded-2xl bg-white border border-gray-100 p-5 shadow-lg">
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                    {data.mode === "Offline (Pen & Paper)" ? "Select Paper" : "Select Shift"}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {data.shifts.map((s, i) => (
                      <button key={i} onClick={() => setShiftIdx(i)}
                        className={cn("rounded-full px-2.5 py-1 text-xs font-semibold border transition",
                          i === shiftIdx ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-gray-200 hover:border-brand/30"
                        )}>
                        {data.mode === "Offline (Pen & Paper)" ? s.date : `${s.date} — ${s.shift}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected shift detail */}
                {shift && (
                  <div className="mt-4 rounded-2xl bg-white border border-gray-100 p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-400">{shift.date}</p>
                        <p className="text-lg font-bold text-gray-800">{shift.shift}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Overall</p>
                        <span className="inline-block rounded-full px-3 py-1 text-xs font-bold text-white"
                          style={{ backgroundColor: DIFFICULTY_COLORS[shift.overallDifficulty] || "#F97316" }}>
                          {shift.overallDifficulty}
                        </span>
                      </div>
                    </div>

                    {shift.subjects.length > 0 && (
                      <div className="space-y-2.5">
                        {shift.subjects.map((sub, si) => {
                          const Icon = getIcon(sub.name);
                          const color = DIFFICULTY_COLORS[sub.difficulty] || "#6B7280";
                          return (
                            <div key={si} className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                              <Icon className="h-5 w-5 shrink-0" style={{ color }} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-700">{sub.name}</p>
                              </div>
                              <span className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ backgroundColor: color }}>{sub.difficulty}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {shift.subjects.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-4">Detailed subject-wise data not available for this shift</p>
                    )}
                  </div>
                )}

                {/* Difficulty distribution */}
                <div className="mt-4 rounded-2xl bg-white border border-gray-100 p-6 shadow-lg">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-3">{data.mode === "Offline (Pen & Paper)" ? "Difficulty Distribution (Papers)" : "Difficulty Distribution (Shifts)"}</p>
                  {(["Easy", "Moderate", "Difficult"] as const).map((level) => {
                    const count = data.shifts.filter((s) => s.overallDifficulty.toLowerCase().includes(level.toLowerCase()) || (level === "Easy" && (s.overallDifficulty === "Easy" || s.overallDifficulty === "Easy-Moderate")) || (level === "Difficult" && (s.overallDifficulty === "Difficult" || s.overallDifficulty === "Very Difficult"))).length;
                    const pct = data.shifts.length ? Math.round((count / data.shifts.length) * 100) : 0;
                    return (
                      <div key={level} className="mb-2 last:mb-0">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-gray-600">{level}</span>
                          <span className="text-gray-400">{count} {data.mode === "Offline (Pen & Paper)" ? "papers" : "shifts"} ({pct}%)</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-100">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: DIFFICULTY_COLORS[level] }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="mt-6 rounded-2xl bg-white border border-gray-100 p-12 text-center shadow-sm">
                <Signal className="mx-auto h-8 w-8 text-gray-200 mb-2" />
                <p className="text-sm text-gray-400">No analysis data available for this exam yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
