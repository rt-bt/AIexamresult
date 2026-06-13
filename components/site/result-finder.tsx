"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { trendingExams } from "@/lib/data";

const examOptions = [
  ...trendingExams,
  "SSC CHSL", "SSC MTS", "SSC GD Constable", "SSC JE", "SSC CPO",
  "RRB NTPC", "RRB Group D", "RRB JE", "RRB Technician",
  "UPSC IAS", "UPSC NDA", "UPSC CDS", "UPSC CAPF",
  "IBPS PO", "IBPS Clerk", "IBPS RRB", "SBI PO", "SBI Clerk",
  "CTET", "UPTET", "REET", "Bihar Board 10th", "Bihar Board 12th",
  "UP Board 10th", "UP Board 12th", "CBSE 10th", "CBSE 12th",
  "NEET UG", "JEE Main", "JEE Advanced", "CUET UG",
  "Indian Army", "Indian Navy", "Indian Air Force", "Agniveer",
];

export function ResultFinder() {
  const router = useRouter();
  const [exam, setExam] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = exam
    ? examOptions.filter((e) => e.toLowerCase().includes(exam.toLowerCase()))
    : [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = [exam, rollNo].filter(Boolean).join(" ");
    if (q.length >= 3) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <section className="bg-gradient-to-b from-white to-[#f0fdfa] py-10">
      <div className="container-page">
        <div className="mx-auto max-w-3xl rounded-2xl border border-brand/20 bg-white p-6 shadow-lg shadow-brand/5 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
              <Search className="h-5 w-5 text-brand" />
            </span>
            <div>
              <h2 className="text-lg font-black text-ink">Result Finder</h2>
              <p className="text-sm text-slate-500">Find your exam result, admit card or answer key instantly</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                value={exam}
                onChange={(e) => { setExam(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder="Exam name (e.g. SSC CGL, UPSC, Railway)"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
              />
              {showDropdown && filtered.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                  {filtered.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onMouseDown={() => { setExam(e); setShowDropdown(false); }}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-brand/5 hover:text-brand"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="text"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="Roll number (optional)"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 sm:w-48"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-md shadow-brand/20 transition hover:bg-brand/90 active:scale-[0.98]"
            >
              Find Result
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-3 text-xs text-slate-400">
            Popular: SSC CGL · UPSC · RRB NTPC · CTET · NEET · Bihar Board · UP Board
          </p>
        </div>
      </div>
    </section>
  );
}
