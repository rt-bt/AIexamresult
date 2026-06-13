"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CheckCircle, XCircle, GraduationCap, Users, Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const QUALIFICATIONS = ["10th Pass", "12th Pass", "ITI / Diploma", "Graduation", "Post Graduation", "Engineering", "B.Ed", "Any Degree"];
const CATEGORIES = ["General (UR)", "OBC", "SC", "ST", "EWS"];

const exams = [
  { name: "SSC CGL", minQual: "Graduation", minAge: 18, maxAge: 32, allCat: true, slug: "ssc-cgl" },
  { name: "SSC CHSL", minQual: "12th Pass", minAge: 18, maxAge: 27, allCat: true, slug: "ssc-chsl" },
  { name: "SSC MTS", minQual: "10th Pass", minAge: 18, maxAge: 25, allCat: true, slug: "ssc-mts" },
  { name: "RRB NTPC", minQual: "12th Pass", minAge: 18, maxAge: 36, allCat: true, slug: "rrb-ntpc" },
  { name: "RRB Group D", minQual: "10th Pass", minAge: 18, maxAge: 36, allCat: true, slug: "rrb-group-d" },
  { name: "IBPS PO", minQual: "Graduation", minAge: 20, maxAge: 30, allCat: true, slug: "ibps-po" },
  { name: "IBPS Clerk", minQual: "12th Pass", minAge: 20, maxAge: 28, allCat: true, slug: "ibps-clerk" },
  { name: "SBI PO", minQual: "Graduation", minAge: 21, maxAge: 30, allCat: true, slug: "sbi-po" },
  { name: "UPSC CSE", minQual: "Graduation", minAge: 21, maxAge: 32, allCat: true, slug: "upsc-cse" },
  { name: "CTET", minQual: "12th Pass", minAge: 18, maxAge: 99, allCat: true, slug: "ctet" },
  { name: "Indian Army", minQual: "10th Pass", minAge: 17, maxAge: 23, allCat: true, slug: "indian-army-agniveer" },
];

export default function EligibilityCheckerPage() {
  const [qual, setQual] = useState("");
  const [age, setAge] = useState("");
  const [cat, setCat] = useState("");

  const ageNum = parseInt(age) || 0;

  const results = exams.map((e) => {
    const qualOk = !qual || e.minQual === qual || (e.minQual === "12th Pass" && qual === "Graduation") || (e.minQual === "Graduation" && qual === "Post Graduation") || (e.minQual === "10th Pass" && (qual === "12th Pass" || qual === "Graduation"));
    const ageOk = !ageNum || (ageNum >= e.minAge && ageNum <= e.maxAge);
    return { ...e, eligible: qualOk && ageOk };
  });

  const eligible = results.filter((r) => r.eligible);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Eligibility Checker</h1>
              <p className="mt-2 text-gray-500 text-sm">Apni age, qualification & category daalein — kaunse exams ke eligible hain dekhein</p>
            </div>

            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-lg space-y-5">
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5"><GraduationCap className="h-4 w-4 text-brand" /> Qualification</label>
                <div className="flex flex-wrap gap-1.5">
                  {QUALIFICATIONS.map((q) => (
                    <button key={q} onClick={() => setQual(qual === q ? "" : q)}
                      className={cn("rounded-full px-3 py-1.5 text-xs font-semibold border transition",
                        qual === q ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-gray-200 hover:border-brand/30"
                      )}>{q}</button>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5"><Calendar className="h-4 w-4 text-brand" /> Your Age</label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 24"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5"><Users className="h-4 w-4 text-brand" /> Category</label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((c) => (
                      <button key={c} onClick={() => setCat(c === cat ? "" : c)}
                        className={cn("rounded-full px-3 py-1.5 text-xs font-semibold border transition",
                          cat === c ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-gray-200 hover:border-brand/30"
                        )}>{c}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              {eligible.length > 0 && <p className="text-sm font-semibold text-emerald-700 mb-3">✅ {eligible.length} exams ke eligible hain aap</p>}
              {results.map((r) => {
                if (!r.eligible) return null;
                return (
                  <Link key={r.slug} href={`/post/${r.slug}`}
                    className="flex items-center justify-between gap-4 rounded-xl bg-white border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-emerald-200 transition group">
                    <div className="flex items-center gap-3 min-w-0">
                      <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                      <div>
                        <p className="text-sm font-bold text-gray-800 group-hover:text-brand">{r.name}</p>
                        <p className="text-xs text-gray-400">Age: {r.minAge}-{r.maxAge > 90 ? "No Limit" : r.maxAge} · Min: {r.minQual}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
                  </Link>
                );
              })}
              {eligible.length === 0 && qual && ageNum > 0 && (
                <div className="rounded-xl bg-white p-8 text-center text-sm text-gray-400">
                  <XCircle className="mx-auto h-8 w-8 text-red-200 mb-2" />
                  No eligible exams found. Try different qualification or age.
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
