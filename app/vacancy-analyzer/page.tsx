"use client";

import { useState } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { BarChart3, Users } from "lucide-react";

type Category = "General" | "OBC" | "SC" | "ST" | "EWS";

const exams = [
  {
    name: "SSC CGL 2025", slug: "ssc-cgl",
    total: 8327,
    vacancies: { General: 3375, OBC: 2248, SC: 1249, ST: 625, EWS: 830 },
    posts: ["Asst Audit Officer", "Accountant", "Inspector", "SI", "Clerk", "Asst"],
  },
  {
    name: "SSC CHSL 2024", slug: "ssc-chsl",
    total: 3712,
    vacancies: { General: 1496, OBC: 1000, SC: 556, ST: 278, EWS: 382 },
    posts: ["LDC", "DEO", "Postal Asst", "Court Clerk"],
  },
  {
    name: "RRB NTPC 2024", slug: "rrb-ntpc",
    total: 11558,
    vacancies: { General: 4630, OBC: 3090, SC: 1734, ST: 865, EWS: 1039 },
    posts: ["Clerk", "Station Master", "TC", "JE", "Asst"],
  },
  {
    name: "RRB Group D", slug: "rrb-group-d",
    total: 10380,
    vacancies: { General: 4150, OBC: 2780, SC: 1557, ST: 777, EWS: 1116 },
    posts: ["Track Maintainer", "Helper", "Peon", "Sweeper"],
  },
  {
    name: "IBPS PO 2024", slug: "ibps-po",
    total: 5445,
    vacancies: { General: 2180, OBC: 1470, SC: 817, ST: 408, EWS: 570 },
    posts: ["Probationary Officer"],
  },
  {
    name: "IBPS Clerk 2024", slug: "ibps-clerk",
    total: 4670,
    vacancies: { General: 1870, OBC: 1260, SC: 701, ST: 350, EWS: 489 },
    posts: ["Clerical Cadre"],
  },
  {
    name: "UPSC CSE 2024", slug: "upsc-cse",
    total: 1056,
    vacancies: { General: 422, OBC: 285, SC: 158, ST: 79, EWS: 112 },
    posts: ["IAS", "IPS", "IFS", "IRS"],
  },
  {
    name: "SSC MTS 2024", slug: "ssc-mts",
    total: 4887,
    vacancies: { General: 1955, OBC: 1319, SC: 733, ST: 366, EWS: 514 },
    posts: ["Multi Tasking Staff"],
  },
];

const categories: Category[] = ["General", "OBC", "SC", "ST", "EWS"];
const COLORS = ["#0D9488", "#F97316", "#6366F1", "#8B5CF6", "#10B981"];

export default function VacancyAnalyzerPage() {
  const [selected, setSelected] = useState("SSC CGL 2025");
  const exam = exams.find((e) => e.name === selected)!;
  const maxVal = Math.max(...categories.map((c) => exam.vacancies[c]));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Vacancy Analyzer</h1>
              <p className="mt-2 text-gray-500 text-sm">Category-wise vacancy breakdown with visual charts</p>
            </div>

            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-lg">
              <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5"><BarChart3 className="h-4 w-4 text-brand" /> Select Exam</label>
              <select value={selected} onChange={(e) => setSelected(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-brand">
                {exams.map((e) => <option key={e.name} value={e.name}>{e.name} ({e.total.toLocaleString()} posts)</option>)}
              </select>

              {/* Bar chart */}
              <div className="mt-6 space-y-3">
                {categories.map((cat, i) => {
                  const val = exam.vacancies[cat];
                  const pct = Math.round((val / maxVal) * 100);
                  const share = Math.round((val / exam.total) * 100);
                  return (
                    <div key={cat}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-bold text-gray-700">{cat}</span>
                        <span className="text-gray-500">{val.toLocaleString()} ({share}%)</span>
                      </div>
                      <div className="h-6 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2 text-xs font-bold text-white"
                          style={{ width: `${pct}%`, backgroundColor: COLORS[i] }}>
                          {pct > 15 ? `${val.toLocaleString()}` : ""}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="mt-5 rounded-xl bg-gradient-to-r from-brand to-emerald-700 p-4 text-white text-center shadow-lg">
                <p className="text-sm text-white/70">Total Vacancies</p>
                <p className="text-2xl font-black">{exam.total.toLocaleString()}</p>
              </div>

              {/* Posts */}
              <div className="mt-4">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Posts under this exam</p>
                <div className="flex flex-wrap gap-1.5">
                  {exam.posts.map((p) => (
                    <span key={p} className="rounded-full bg-teal-50 text-brand px-3 py-1 text-xs font-semibold">{p}</span>
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
