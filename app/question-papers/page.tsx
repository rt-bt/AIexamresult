"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Search, Download, FileText, BookOpen, ExternalLink, Eye, CheckCircle, Calendar } from "lucide-react";
import { getAllPapers, getUniqueExams, getUniqueYears } from "@/lib/question-papers";

const papers = getAllPapers();
const exams = getUniqueExams();
const years = getUniqueYears();

export default function QuestionPapersPage() {
  const [search, setSearch] = useState("");
  const [selectedExam, setSelectedExam] = useState("All");
  const [selectedYear, setSelectedYear] = useState<number | "All">("All");

  const filtered = useMemo(() => {
    return papers.filter((p) => {
      if (selectedExam !== "All" && p.examSlug !== selectedExam) return false;
      if (selectedYear !== "All" && p.year !== selectedYear) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.exam.toLowerCase().includes(q) && !p.title.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [search, selectedExam, selectedYear]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20 lg:pb-10">
        <div className="container-page py-10 sm:py-14">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-1.5 text-xs font-bold tracking-wider text-indigo-700 shadow-sm">
                <FileText className="h-3.5 w-3.5" />
                Question Paper Archive
              </span>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Previous Year Question Papers
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-500">
                Download official previous year question papers with answer keys from SSC, UPSC, Railway, Banking, NTA & more.
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search exam..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none text-slate-700 focus:border-indigo-500"
              >
                <option value="All">All Exams</option>
                {exams.map((e) => (
                  <option key={e.slug} value={e.slug}>{e.name}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value === "All" ? "All" : Number(e.target.value))}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none text-slate-700 focus:border-indigo-500"
              >
                <option value="All">All Years</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Results */}
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-100/20"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700">{p.exam}</span>
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{p.year}</span>
                      <span className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${
                        p.type === "Both"
                          ? "bg-purple-50 text-purple-700"
                          : p.type === "Mains"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-blue-50 text-blue-700"
                      }`}>{p.type}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      {p.hasSolution && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          <CheckCircle className="h-3 w-3" /> Sol.
                        </span>
                      )}
                      {p.hasAnswerKey && (
                        <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                          <CheckCircle className="h-3 w-3" /> Key
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-800">{p.title}</h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.pdfs.map((pdf, i) => (
                      <a
                        key={i}
                        href={pdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-[11px] font-bold text-white transition-all hover:bg-indigo-700 active:scale-95"
                      >
                        <Download className="h-3.5 w-3.5" />
                        {pdf.label}
                      </a>
                    ))}
                  </div>

                  <p className="mt-2 text-[10px] text-slate-400">Source: {p.sourceLabel}</p>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm">
                <BookOpen className="mx-auto h-12 w-12 text-slate-200" />
                <p className="mt-4 text-base font-medium text-slate-500">No question papers found</p>
                <p className="mt-1 text-sm text-slate-400">Try a different search term or filter.</p>
              </div>
            )}

            <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="text-sm text-slate-500">
                <ExternalLink className="-mt-0.5 mr-1 inline h-4 w-4 text-slate-400" />
                Question papers are sourced from official government websites. Always verify with the respective official portal for the latest updates.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
