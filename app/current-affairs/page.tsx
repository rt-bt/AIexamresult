"use client";

import { useState } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Newspaper, CalendarDays, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { date: "June 13, 2026", title: "India's GDP Growth Revised to 6.8% for FY 2025-26", category: "Economy" },
  { date: "June 13, 2026", title: "DRDO Successfully Test-Fires Advanced Air Defense Missile", category: "Defence" },
  { date: "June 12, 2026", title: "New Education Policy 2026 Implementation in All States", category: "Education" },
  { date: "June 12, 2026", title: "UPSC Announces 2026 Exam Schedule Changes", category: "Exam" },
  { date: "June 11, 2026", title: "SSC Releases Tentative Calendar for 2026-27", category: "Exam" },
  { date: "June 11, 2026", title: "India Wins 5 Gold Medals in Asian Athletics", category: "Sports" },
  { date: "June 10, 2026", title: "Railway Budget: 5,000 New Stations to Be Upgraded", category: "Railway" },
  { date: "June 10, 2026", title: "Digital India 3.0 Launched with ₹50,000 Cr Outlay", category: "Technology" },
  { date: "June 9, 2026", title: "7th Pay Commission DA Hike Expected in July", category: "Salary" },
  { date: "June 9, 2026", title: "RBI Keeps Repo Rate Unchanged at 6.25%", category: "Economy" },
  { date: "June 8, 2026", title: "NEET PG 2026 Exam Date Announced", category: "Exam" },
  { date: "June 8, 2026", title: "India-Middle East-Europe Corridor Gets Final Nod", category: "International" },
];

const categories = Array.from(new Set(items.map((i) => i.category)));

// Quiz questions
const quiz = [
  { q: "India's GDP growth revised to ___ for FY 2025-26", options: ["6.5%", "6.8%", "7.2%", "6.2%"], answer: 1 },
  { q: "Which organisation launched Digital India 3.0?", options: ["NITI Aayog", "Ministry of IT", "MeitY", "State Govt"], answer: 2 },
  { q: "DA hike under which pay commission?", options: ["6th", "7th", "8th", "5th"], answer: 1 },
  { q: "RBI kept repo rate unchanged at ___?", options: ["6.00%", "6.25%", "6.50%", "5.75%"], answer: 1 },
];

export default function CurrentAffairsPage() {
  const [catFilter, setCatFilter] = useState("");
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const filtered = catFilter ? items.filter((i) => i.category === catFilter) : items;

  const handleAnswer = (optIdx: number) => {
    if (selected !== null) return;
    setSelected(optIdx);
    if (optIdx === quiz[qIdx].answer) setScore((s) => s + 1);
  };

  const nextQ = () => {
    if (qIdx < quiz.length - 1) {
      setQIdx((i) => i + 1);
      setSelected(null);
    } else setDone(true);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Current Affairs</h1>
              <p className="mt-2 text-gray-500 text-sm">Latest news & GK updates for competitive exams</p>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              <button onClick={() => setCatFilter("")}
                className={cn("rounded-full px-3 py-1.5 text-xs font-semibold border transition",
                  !catFilter ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-gray-200"
                )}>All</button>
              {categories.map((c) => (
                <button key={c} onClick={() => setCatFilter(c)}
                  className={cn("rounded-full px-3 py-1.5 text-xs font-semibold border transition",
                    catFilter === c ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-gray-200"
                  )}>{c}</button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-2">
              {filtered.map((item, i) => (
                <div key={i} className="rounded-xl bg-white border border-gray-100 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays className="h-3 w-3 text-gray-300" />
                    <span className="text-xs text-gray-400">{item.date}</span>
                    <span className="rounded-full bg-brand/10 text-brand px-2 py-0.5 text-[10px] font-bold">{item.category}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{item.title}</p>
                </div>
              ))}
            </div>

            {/* Quiz */}
            <div className="mt-8 rounded-2xl bg-gradient-to-r from-brand to-emerald-700 p-6 text-white shadow-lg">
              <h2 className="text-center text-lg font-bold mb-4">📝 Quick Quiz — Current Affairs</h2>
              {!done ? (
                <div>
                  <p className="text-sm font-semibold text-white/90 mb-3">Q{qIdx + 1}. {quiz[qIdx].q}</p>
                  <div className="space-y-2">
                    {quiz[qIdx].options.map((opt, oi) => (
                      <button key={oi} onClick={() => handleAnswer(oi)}
                        className={cn("w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-left transition",
                          selected === oi
                            ? oi === quiz[qIdx].answer ? "bg-emerald-400 text-white" : "bg-red-400 text-white"
                            : "bg-white/20 text-white hover:bg-white/30"
                        )}>
                        {selected !== null && oi === quiz[qIdx].answer && <CheckCircle className="inline h-4 w-4 mr-1.5" />}
                        {selected !== null && selected === oi && oi !== quiz[qIdx].answer && <XCircle className="inline h-4 w-4 mr-1.5" />}
                        {opt}
                      </button>
                    ))}
                  </div>
                  {selected !== null && (
                    <button onClick={nextQ} className="mt-3 w-full rounded-xl bg-white text-brand py-2.5 text-sm font-bold hover:bg-white/90 transition">
                      {qIdx < quiz.length - 1 ? "Next →" : "See Result"}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-4xl font-black">{score}/{quiz.length}</p>
                  <p className="text-sm text-white/70 mt-1">Your Quiz Score</p>
                  <button onClick={() => { setQIdx(0); setSelected(null); setScore(0); setDone(false); }}
                    className="mt-3 rounded-xl bg-white text-brand px-6 py-2.5 text-sm font-bold">Retry Quiz</button>
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
