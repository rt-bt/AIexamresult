"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CalendarDays, Search, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { currentAffairs, quiz } from "@/data/current-affairs";

const categories = Array.from(new Set(currentAffairs.map((i) => i.category))).sort();

export default function CurrentAffairsPage() {
  const [catFilter, setCatFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCount, setShowCount] = useState(20);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const filtered = useMemo(() => {
    let items = catFilter ? currentAffairs.filter((i) => i.category === catFilter) : currentAffairs;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter((i) => i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
    }
    return items;
  }, [catFilter, searchQuery]);

  const visible = filtered.slice(0, showCount);
  const hasMore = showCount < filtered.length;

  const uniqueDates = useMemo(() => Array.from(new Set(currentAffairs.map((i) => i.date))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()), []);

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
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Current Affairs</h1>
              <p className="mt-2 text-gray-500 text-sm">Latest news & GK updates for competitive exams — {currentAffairs.length}+ updates across {categories.length} categories</p>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search current affairs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>

            {/* Filters - Category + Date */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              <button onClick={() => setCatFilter("")}
                className={cn("rounded-full px-3 py-1.5 text-xs font-semibold border transition",
                  !catFilter ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                )}>All ({currentAffairs.length})</button>
              {categories.map((c) => (
                <button key={c} onClick={() => setCatFilter(c)}
                  className={cn("rounded-full px-3 py-1.5 text-xs font-semibold border transition",
                    catFilter === c ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  )}>{c} ({currentAffairs.filter(i => i.category === c).length})</button>
              ))}
            </div>

            {/* Stats Bar */}
            <div className="mb-4 flex items-center justify-between text-xs text-gray-400">
              <span>{filtered.length} update{filtered.length !== 1 ? "s" : ""} found</span>
              <span>Last {uniqueDates.length} days</span>
            </div>

            {/* List */}
            <div className="space-y-2">
              {visible.map((item, i) => (
                <div key={i} className="rounded-xl bg-white border border-gray-100 p-4 shadow-sm transition hover:shadow-md">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays className="h-3 w-3 text-gray-300" />
                    <span className="text-xs text-gray-400">{item.date}</span>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold",
                      item.category === "Result" ? "bg-emerald-50 text-emerald-700" :
                      item.category === "Exam" ? "bg-blue-50 text-blue-700" :
                      item.category === "Admit Card" ? "bg-orange-50 text-orange-700" :
                      item.category === "Answer Key" ? "bg-purple-50 text-purple-700" :
                      item.category === "Admission" ? "bg-rose-50 text-rose-700" :
                      item.category === "Economy" ? "bg-amber-50 text-amber-700" :
                      item.category === "Defence" ? "bg-red-50 text-red-700" :
                      item.category === "Sports" ? "bg-green-50 text-green-700" :
                      item.category === "Science" ? "bg-cyan-50 text-cyan-700" :
                      item.category === "Technology" ? "bg-indigo-50 text-indigo-700" :
                      item.category === "Education" ? "bg-yellow-50 text-yellow-700" :
                      item.category === "Railway" ? "bg-violet-50 text-violet-700" :
                      item.category === "Environment" ? "bg-teal-50 text-teal-700" :
                      item.category === "International" ? "bg-sky-50 text-sky-700" :
                      item.category === "Salary" ? "bg-pink-50 text-pink-700" :
                      "bg-gray-50 text-gray-700"
                    )}>{item.category}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{item.title}</p>
                </div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <button onClick={() => setShowCount((c) => c + 20)}
                className="mt-4 w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-500 hover:border-gray-300 hover:text-gray-700 transition flex items-center justify-center gap-1">
                <ChevronDown className="h-4 w-4" /> Show {Math.min(20, filtered.length - showCount)} More
              </button>
            )}
            {!hasMore && filtered.length > 20 && (
              <button onClick={() => setShowCount(20)}
                className="mt-4 w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-500 hover:border-gray-300 hover:text-gray-700 transition flex items-center justify-center gap-1">
                <ChevronUp className="h-4 w-4" /> Show Less
              </button>
            )}

            {/* Quiz */}
            <div className="mt-8 rounded-2xl bg-gradient-to-r from-brand to-emerald-700 p-6 text-white shadow-lg">
              <h2 className="text-center text-lg font-bold mb-1">Quick Quiz — Current Affairs</h2>
              <p className="text-center text-sm text-white/70 mb-4">Test your GK with {quiz.length} questions</p>
              {!done ? (
                <div>
                  <p className="text-sm font-semibold text-white/90 mb-3">Q{qIdx + 1}/{quiz.length}. {quiz[qIdx].q}</p>
                  <div className="space-y-2">
                    {quiz[qIdx].options.map((opt, oi) => (
                      <button key={oi} onClick={() => handleAnswer(oi)}
                        className={cn("w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-left transition",
                          selected === oi
                            ? oi === quiz[qIdx].answer ? "bg-emerald-400 text-white" : "bg-red-400 text-white"
                            : "bg-white/20 text-white hover:bg-white/30"
                        )}>
                          <span className="inline-flex items-center gap-1.5">
                            {selected !== null && oi === quiz[qIdx].answer && <CheckCircle className="h-4 w-4 shrink-0" />}
                            {selected !== null && selected === oi && oi !== quiz[qIdx].answer && <XCircle className="h-4 w-4 shrink-0" />}
                            {String.fromCharCode(65 + oi)}. {opt}
                          </span>
                      </button>
                    ))}
                  </div>
                  {selected !== null && (
                    <button onClick={nextQ} className="mt-3 w-full rounded-xl bg-white text-brand py-2.5 text-sm font-bold hover:bg-white/90 transition">
                      {qIdx < quiz.length - 1 ? "Next Question →" : "See Your Score"}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-5xl font-black">{score}/{quiz.length}</p>
                  <p className="text-sm text-white/70 mt-1">Your Quiz Score</p>
                  <p className="text-xs text-white/50 mt-1">{score === quiz.length ? "Perfect! You're a GK expert!" : score >= quiz.length / 2 ? "Good job! Keep practicing." : "Keep reading current affairs to improve!"}</p>
                  <button onClick={() => { setQIdx(0); setSelected(null); setScore(0); setDone(false); }}
                    className="mt-4 rounded-xl bg-white text-brand px-6 py-2.5 text-sm font-bold hover:bg-white/90 transition">Retry Quiz</button>
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
