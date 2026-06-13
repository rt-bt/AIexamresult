"use client";

import { useState } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ExternalLink, Lightbulb, BookOpen, BarChart3, FlaskConical, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const exams = ["SSC CGL", "SSC CHSL", "SSC MTS", "RRB NTPC", "IBPS PO", "IBPS Clerk", "SBI PO", "UPSC Prelims"];

const recommendations: Record<string, { subject: string; icon: LucideIcon; tips: string[] }[]> = {
  "SSC CGL": [
    { subject: "General Intelligence", icon: Lightbulb, tips: ["Practice puzzles & seating arrangement daily", "Focus on non-verbal reasoning", "Use 15 min daily for syllogism"] },
    { subject: "Quantitative Aptitude", icon: BarChart3, tips: ["Master time-speed-distance & algebra", "Practice DI from previous papers", "Learn all short tricks for calculation"] },
    { subject: "English", icon: BookOpen, tips: ["Read editorial daily for comprehension", "Practice synonyms-antonyms", "Focus on error detection"] },
    { subject: "General Awareness", icon: FlaskConical, tips: ["Follow monthly current affairs PDF", "Focus on static GK (history, polity)", "Make short notes for revision"] },
  ],
  "RRB NTPC": [
    { subject: "Mathematics", icon: BarChart3, tips: ["Focus on number system & LCM/HCF", "Practice profit-loss & percentage", "Time & work is high weightage"] },
    { subject: "General Intelligence", icon: Lightbulb, tips: ["Analogies & classification are key", "Practice coding-decoding", "Daily reasoning puzzle"] },
    { subject: "General Science", icon: FlaskConical, tips: ["NCERT Physics & Chemistry basics", "Biology diagrams & functions", "Focus on everyday science"] },
    { subject: "General Awareness", icon: BookOpen, tips: ["Railway budget & schemes", "Current affairs last 6 months", "Static GK rapid revision"] },
  ],
};

const GENERAL = [
  { subject: "Time Management", icon: BarChart3, tips: ["Divide time equally across sections", "Attempt easy questions first", "Use sectional cutoff strategy"] },
  { subject: "Mock Test Strategy", icon: Lightbulb, tips: ["Give 1 mock test daily in exam season", "Analyze every test thoroughly", "Work on weak areas identified"] },
];

export default function MockTestsPage() {
  const [exam, setExam] = useState("SSC CGL");
  const recs = recommendations[exam] || [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Mock Test Recommendations</h1>
              <p className="mt-2 text-gray-500 text-sm">Exam-specific topic-wise preparation tips & strategy</p>
            </div>

            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-lg">
              <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5"><ExternalLink className="h-4 w-4 text-brand" /> Select Exam</label>
              <div className="flex flex-wrap gap-1.5">
                {exams.map((e) => (
                  <button key={e} onClick={() => setExam(e)}
                    className={cn("rounded-full px-3 py-1.5 text-xs font-semibold border transition",
                      exam === e ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-gray-200 hover:border-brand/30"
                    )}>{e}</button>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {recs.map((r) => {
                const Icon = r.icon;
                return (
                  <div key={r.subject} className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="h-5 w-5 text-brand" />
                      <p className="text-sm font-bold text-gray-800">{r.subject}</p>
                    </div>
                    <ul className="space-y-1.5">
                      {r.tips.map((t, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}

              {/* General tips */}
              <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5">
                <p className="text-xs font-bold text-amber-700 mb-3">📌 General Preparation Tips</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {GENERAL.map((g) => (
                    <div key={g.subject}>
                      <p className="text-xs font-bold text-amber-700 mb-1">{g.subject}</p>
                      <ul className="space-y-1">
                        {g.tips.map((t, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-amber-600"><span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />{t}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
