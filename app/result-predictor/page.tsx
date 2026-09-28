"use client";

import { useState } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { BarChart3, TrendingUp, Users, Award, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const exams = [
  { name: "SSC CGL", tiers: "Tier-I (200 marks)" },
  { name: "SSC CHSL", tiers: "Tier-I (200 marks)" },
  { name: "RRB NTPC", tiers: "CBT 1 (100 marks)" },
  { name: "IBPS PO", tiers: "Prelims (100 marks)" },
  { name: "SBI PO", tiers: "Prelims (100 marks)" },
  { name: "UPSC CSE", tiers: "Prelims (400 marks)" },
];

type Category = "UR" | "OBC" | "SC" | "ST" | "EWS";

const cutoffData: Record<string, Record<Category, { min: number; max: number }>> = {
  "SSC CGL": { UR: { min: 145, max: 165 }, OBC: { min: 130, max: 150 }, SC: { min: 120, max: 140 }, ST: { min: 110, max: 130 }, EWS: { min: 130, max: 150 } },
  "SSC CHSL": { UR: { min: 140, max: 160 }, OBC: { min: 125, max: 145 }, SC: { min: 115, max: 135 }, ST: { min: 105, max: 125 }, EWS: { min: 125, max: 145 } },
  "RRB NTPC": { UR: { min: 75, max: 95 }, OBC: { min: 65, max: 80 }, SC: { min: 55, max: 70 }, ST: { min: 45, max: 60 }, EWS: { min: 65, max: 80 } },
  "IBPS PO": { UR: { min: 55, max: 70 }, OBC: { min: 45, max: 55 }, SC: { min: 40, max: 50 }, ST: { min: 35, max: 45 }, EWS: { min: 45, max: 55 } },
  "SBI PO": { UR: { min: 58, max: 72 }, OBC: { min: 48, max: 58 }, SC: { min: 42, max: 52 }, ST: { min: 37, max: 47 }, EWS: { min: 48, max: 58 } },
  "UPSC CSE": { UR: { min: 98, max: 110 }, OBC: { min: 88, max: 98 }, SC: { min: 80, max: 90 }, ST: { min: 70, max: 80 }, EWS: { min: 88, max: 98 } },
};

const CATEGORIES: Category[] = ["UR", "OBC", "SC", "ST", "EWS"];

export default function ResultPredictorPage() {
  const [exam, setExam] = useState("SSC CGL");
  const [marks, setMarks] = useState("");
  const [category, setCategory] = useState<Category>("UR");

  const marksNum = parseInt(marks) || 0;
  const cutoff = cutoffData[exam]?.[category];
  const prediction = cutoff && marksNum > 0
    ? marksNum >= cutoff.min
      ? marksNum >= cutoff.max ? { label: "Strong Selection", color: "text-emerald-600 bg-emerald-50 border-emerald-200", pct: 95 }
        : { label: "Likely Selected", color: "text-blue-600 bg-blue-50 border-blue-200", pct: 75 }
      : marksNum >= cutoff.min - 15
        ? { label: "Borderline / Waiting", color: "text-amber-600 bg-amber-50 border-amber-200", pct: 40 }
        : { label: "Unlikely to Qualify", color: "text-red-600 bg-red-50 border-red-200", pct: 10 }
    : null;

  const maxMarks = parseInt(exam === "UPSC CSE" ? "400" : exam === "RRB NTPC" ? "100" : "200");
  const pct = Math.min(100, (marksNum / maxMarks) * 100);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3.5 py-1 text-xs font-semibold text-teal-700 mb-3">
                <Zap className="h-3 w-3" /> AI Estimator
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Result Predictor & Rank Estimator</h1>
              <p className="mt-2 text-gray-500 text-sm">Enter your expected marks to estimate selection chance & rank range</p>
            </div>

            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-lg shadow-gray-200/40 space-y-5">
              {/* Exam Select */}
              <div>
                <label className="text-sm font-bold text-gray-700">Select Exam</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {exams.map((e) => (
                    <button key={e.name} onClick={() => setExam(e.name)}
                      className={cn("rounded-full px-4 py-2 text-xs font-semibold border transition",
                        exam === e.name ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-gray-200 hover:border-brand/30"
                      )}>{e.name}</button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-bold text-gray-700">Your Category</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button key={c} onClick={() => setCategory(c)}
                      className={cn("rounded-full px-4 py-2 text-xs font-semibold border transition",
                        category === c ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-gray-200 hover:border-brand/30"
                      )}>{c}</button>
                  ))}
                </div>
              </div>

              {/* Marks Input */}
              <div>
                <label className="text-sm font-bold text-gray-700">Estimated Marks (out of {maxMarks})</label>
                <input type="number" value={marks} onChange={(e) => {
                  const v = e.target.value;
                  if (v === "") { setMarks(""); return; }
                  const num = parseInt(v);
                  if (num >= 0 && num <= maxMarks) setMarks(v);
                }} min={0} max={maxMarks} placeholder={`Enter your expected marks (max ${maxMarks})...`}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-lg font-bold text-gray-800 outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
                />
              </div>

              {/* Progress Bar */}
              {marksNum > 0 && (
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Score: {marksNum}/{maxMarks}</span>
                    <span>{pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-emerald-400 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )}

              {/* Prediction Result */}
              {prediction && (
                <div className={cn("rounded-xl border-2 p-5 text-center", prediction.color)}>
                  <Target className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-lg font-black">{prediction.label}</p>
                  <p className="mt-1 text-sm opacity-80">
                    {exam} · {category} · {marksNum} marks
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs">
                    <span>Cutoff range for {category}:</span>
                    <span className="font-bold">{cutoff?.min} - {cutoff?.max}</span>
                  </div>
                </div>
              )}

              {/* No prediction */}
              {marksNum === 0 && (
                <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-400">
                  <BarChart3 className="mx-auto h-8 w-8 mb-2 text-gray-300" />
                  Enter your marks above to see selection probability
                </div>
              )}
            </div>

            <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-700">
              <strong>Note:</strong> This is an estimated prediction based on previous year cutoff trends. Actual cutoff varies each year based on exam difficulty, number of candidates, and vacancy. Always check official website for final cutoff.
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
