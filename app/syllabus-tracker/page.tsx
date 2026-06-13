"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CheckCircle, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const subjects: Record<string, string[]> = {
  "SSC CGL": ["General Intelligence", "General Awareness", "Quantitative Aptitude", "English Comprehension"],
  "SSC CHSL": ["General Intelligence", "General Awareness", "Quantitative Aptitude", "English"],
  "SSC MTS": ["General Intelligence", "General Awareness", "Numerical Aptitude", "English"],
  "RRB NTPC": ["General Awareness", "Mathematics", "General Intelligence", "General Science"],
  "RRB Group D": ["General Science", "Mathematics", "General Intelligence", "General Awareness"],
  "IBPS PO": ["Reasoning", "Quantitative Aptitude", "English", "General Awareness", "Computer"],
  "IBPS Clerk": ["Reasoning", "Quantitative Aptitude", "English", "General Awareness", "Computer"],
  "SBI PO": ["Reasoning", "Quantitative Aptitude", "English", "General Awareness", "Computer"],
  "UPSC CSE": ["History", "Geography", "Polity", "Economy", "Science & Tech", "Environment", "CSAT"],
  "CTET": ["Child Development", "Language I", "Language II", "Mathematics", "Environmental Studies"],
};

export default function SyllabusTrackerPage() {
  const [exam, setExam] = useState("SSC CGL");
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const key = `syllabus_${exam}`;
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "[]");
      setCompleted(saved);
    } catch { setCompleted([]); }
  }, [exam]);

  const toggle = (topic: string) => {
    const next = completed.includes(topic) ? completed.filter((t) => t !== topic) : [...completed, topic];
    setCompleted(next);
    try { localStorage.setItem(`syllabus_${exam}`, JSON.stringify(next)); } catch {}
  };

  const topics = subjects[exam] || [];
  const pct = topics.length ? Math.round((completed.length / topics.length) * 100) : 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Syllabus Tracker</h1>
              <p className="mt-2 text-gray-500 text-sm">Topic-wise syllabus track karein — checkbox tick karte jaayein</p>
            </div>

            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-lg">
              <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-brand" /> Select Exam</label>
              <select value={exam} onChange={(e) => setExam(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-brand">
                {Object.keys(subjects).map((k) => <option key={k}>{k}</option>)}
              </select>

              {/* Progress */}
              <div className="mt-5">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-bold text-gray-700">Progress</span>
                  <span className="text-brand font-bold">{completed.length}/{topics.length} ({pct}%)</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand to-emerald-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </div>

              {/* Topics */}
              <div className="mt-5 space-y-2">
                {topics.map((t) => (
                  <button key={t} onClick={() => toggle(t)}
                    className={cn("w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition text-left",
                      completed.includes(t) ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-gray-100 text-gray-600 hover:border-brand/30"
                    )}>
                    <CheckCircle className={cn("h-5 w-5 shrink-0", completed.includes(t) ? "text-emerald-500" : "text-gray-200")} />
                    {t}
                  </button>
                ))}
              </div>

              {completed.length === topics.length && topics.length > 0 && (
                <div className="mt-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white text-center shadow-lg">
                  <CheckCircle className="mx-auto h-6 w-6" />
                  <p className="text-sm font-bold mt-1">🎉 Syllabus complete! All topics done.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
