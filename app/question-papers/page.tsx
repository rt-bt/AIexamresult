"use client";

import { useState } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Search, Download, FileText, BookOpen, Filter, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

type Paper = {
  exam: string;
  year: number;
  title: string;
  type: "Prelims" | "Mains" | "Both";
  hasAnswerKey: boolean;
  hasSolution: boolean;
};

const papers: Paper[] = [
  { exam: "SSC CGL", year: 2025, title: "Tier I (All Shifts)", type: "Prelims", hasAnswerKey: true, hasSolution: false },
  { exam: "SSC CGL", year: 2024, title: "Tier I & II", type: "Both", hasAnswerKey: true, hasSolution: true },
  { exam: "SSC CGL", year: 2023, title: "Tier I & II", type: "Both", hasAnswerKey: true, hasSolution: true },
  { exam: "SSC CGL", year: 2022, title: "Tier I & II", type: "Both", hasAnswerKey: true, hasSolution: true },
  { exam: "SSC CHSL", year: 2025, title: "Tier I (All Shifts)", type: "Prelims", hasAnswerKey: true, hasSolution: false },
  { exam: "SSC CHSL", year: 2024, title: "Tier I & II", type: "Both", hasAnswerKey: true, hasSolution: true },
  { exam: "SSC CHSL", year: 2023, title: "Tier I", type: "Prelims", hasAnswerKey: true, hasSolution: true },
  { exam: "SSC MTS", year: 2024, title: "Paper I", type: "Prelims", hasAnswerKey: true, hasSolution: false },
  { exam: "SSC MTS", year: 2023, title: "Paper I", type: "Prelims", hasAnswerKey: true, hasSolution: true },
  { exam: "SSC GD Constable", year: 2025, title: "Computer Based Exam", type: "Prelims", hasAnswerKey: true, hasSolution: false },
  { exam: "SSC GD Constable", year: 2024, title: "Computer Based Exam", type: "Prelims", hasAnswerKey: true, hasSolution: true },
  { exam: "SSC JE", year: 2024, title: "Paper I", type: "Prelims", hasAnswerKey: true, hasSolution: false },
  { exam: "SSC CPO", year: 2024, title: "Paper I & II", type: "Both", hasAnswerKey: true, hasSolution: true },
  { exam: "RRB NTPC", year: 2024, title: "CBT 1 (All Shifts)", type: "Prelims", hasAnswerKey: true, hasSolution: false },
  { exam: "RRB NTPC", year: 2023, title: "CBT 1 & 2", type: "Both", hasAnswerKey: true, hasSolution: true },
  { exam: "RRB Group D", year: 2024, title: "CBT", type: "Prelims", hasAnswerKey: true, hasSolution: false },
  { exam: "RRB JE", year: 2024, title: "CBT 1", type: "Prelims", hasAnswerKey: true, hasSolution: true },
  { exam: "RRB ALP", year: 2024, title: "CBT 1 & 2", type: "Both", hasAnswerKey: true, hasSolution: true },
  { exam: "UPSC CSE", year: 2025, title: "Prelims", type: "Prelims", hasAnswerKey: true, hasSolution: false },
  { exam: "UPSC CSE", year: 2024, title: "Prelims & Mains", type: "Both", hasAnswerKey: true, hasSolution: true },
  { exam: "UPSC CSE", year: 2023, title: "Prelims & Mains", type: "Both", hasAnswerKey: true, hasSolution: true },
  { exam: "UPSC NDA", year: 2024, title: "Paper I & II", type: "Both", hasAnswerKey: true, hasSolution: true },
  { exam: "UPSC CDS", year: 2024, title: "All Papers", type: "Both", hasAnswerKey: true, hasSolution: false },
  { exam: "IBPS PO", year: 2025, title: "Prelims", type: "Prelims", hasAnswerKey: true, hasSolution: false },
  { exam: "IBPS PO", year: 2024, title: "Prelims & Mains", type: "Both", hasAnswerKey: true, hasSolution: true },
  { exam: "IBPS CLERK", year: 2024, title: "Prelims & Mains", type: "Both", hasAnswerKey: true, hasSolution: true },
  { exam: "IBPS RRB", year: 2024, title: "Office Assistant & Officer", type: "Both", hasAnswerKey: true, hasSolution: false },
  { exam: "SBI PO", year: 2024, title: "Prelims & Mains", type: "Both", hasAnswerKey: true, hasSolution: true },
  { exam: "SBI Clerk", year: 2025, title: "Prelims", type: "Prelims", hasAnswerKey: true, hasSolution: false },
  { exam: "CTET", year: 2025, title: "Paper I & II (Jan)", type: "Both", hasAnswerKey: true, hasSolution: false },
  { exam: "CTET", year: 2024, title: "Paper I & II", type: "Both", hasAnswerKey: true, hasSolution: true },
  { exam: "UPTET", year: 2024, title: "Paper I & II", type: "Both", hasAnswerKey: true, hasSolution: false },
  { exam: "NEET UG", year: 2025, title: "Full Paper", type: "Prelims", hasAnswerKey: true, hasSolution: true },
  { exam: "NEET UG", year: 2024, title: "Full Paper", type: "Prelims", hasAnswerKey: true, hasSolution: true },
  { exam: "JEE Main", year: 2025, title: "All Sessions", type: "Prelims", hasAnswerKey: true, hasSolution: true },
  { exam: "JEE Main", year: 2024, title: "All Sessions", type: "Prelims", hasAnswerKey: true, hasSolution: true },
  { exam: "JEE Advanced", year: 2024, title: "Paper I & II", type: "Both", hasAnswerKey: true, hasSolution: true },
  { exam: "CUET UG", year: 2025, title: "All Subjects", type: "Prelims", hasAnswerKey: true, hasSolution: false },
  { exam: "CUET UG", year: 2024, title: "All Subjects", type: "Prelims", hasAnswerKey: true, hasSolution: true },
];

const exams = [...new Set(papers.map(p => p.exam))].sort();

export default function QuestionPapersPage() {
  const [search, setSearch] = useState("");
  const [selectedExam, setSelectedExam] = useState("All");
  const [selectedYear, setSelectedYear] = useState<number | "All">("All");

  const filtered = papers.filter((p) => {
    if (selectedExam !== "All" && p.exam !== selectedExam) return false;
    if (selectedYear !== "All" && p.year !== selectedYear) return false;
    if (search && !p.exam.toLowerCase().includes(search.toLowerCase()) && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20 lg:pb-10">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Question Paper Archive</h1>
              <p className="mt-2 text-gray-500 text-sm">Previous year papers with answer keys & solutions</p>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text" placeholder="Search exam..."
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
                />
              </div>
              <select
                value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand"
              >
                <option value="All">All Exams</option>
                {exams.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
              <select
                value={selectedYear} onChange={(e) => setSelectedYear(e.target.value === "All" ? "All" : Number(e.target.value))}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand"
              >
                <option value="All">All Years</option>
                {[2025, 2024, 2023, 2022].map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Results */}
            <div className="grid gap-3 sm:grid-cols-2">
              {filtered.map((p, i) => (
                <div key={i} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="rounded bg-brand/10 px-2 py-0.5 text-[11px] font-bold text-brand">{p.exam}</span>
                        <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">{p.year}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 truncate">{p.title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[10px] font-semibold rounded px-1.5 py-0.5 ${
                          p.type === "Both" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                        }`}>{p.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {p.hasSolution && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600" title="Solution available">
                          Sol.
                        </span>
                      )}
                      {p.hasAnswerKey && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600" title="Answer key available">
                          Key
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="rounded-2xl bg-white border border-gray-100 p-12 text-center shadow-sm">
                <BookOpen className="mx-auto h-10 w-10 text-gray-200" />
                <p className="mt-3 text-gray-400 text-sm">No question papers found. Try a different filter.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
