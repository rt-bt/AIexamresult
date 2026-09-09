export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SectionContent } from "@/components/site/section-content";
import { boardResults } from "@/lib/data";
import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Board Results 2026 - CBSE, UP Board, Bihar Board, RBSE, MP Board Results",
  description:
    "Check all Board Results 2026 — CBSE Class 10th & 12th, UP Board, Bihar Board (BSEB), Rajasthan Board (RBSE), MP Board (MPBSE), Maharashtra Board, Tamil Nadu Board and more. Download marksheets from official websites.",
  keywords: [
    "board result 2026", "CBSE result 2026", "UP Board result", "Bihar Board result",
    "RBSE result 2026", "MP Board result", "10th result", "12th result", "sarkari board result",
  ],
  alternates: { canonical: "/board-results" },
  openGraph: {
    title: "Board Results 2026 | All India Exam Result",
    description: "CBSE, UP Board, Bihar Board, RBSE, MP Board & all state board results in one place.",
    type: "website",
  },
};

const BOARDS = [
  { name: "CBSE", full: "Central Board of Secondary Education", states: "All India", href: "#cbse" },
  { name: "UP Board", full: "UPMSP - Uttar Pradesh Board", states: "Uttar Pradesh", href: "#up-board" },
  { name: "Bihar Board", full: "BSEB - Bihar School Exam Board", states: "Bihar", href: "#bihar-board" },
  { name: "RBSE", full: "Rajasthan Board of Secondary Education", states: "Rajasthan", href: "#rbse" },
  { name: "MP Board", full: "MPBSE - Madhya Pradesh Board", states: "Madhya Pradesh", href: "#mp-board" },
  { name: "Maharashtra", full: "MSBSHSE Board", states: "Maharashtra", href: "#msbshse" },
  { name: "TN Board", full: "Tamil Nadu Board (SSLC / HSC)", states: "Tamil Nadu", href: "#tn-board" },
  { name: "HBSE", full: "Haryana Board of School Education", states: "Haryana", href: "#hbse" },
  { name: "ICSE / ISC", full: "CISCE Board (ICSE & ISC)", states: "All India", href: "#cisce" },
];

export default function BoardResultsPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#4C1D95] py-14">
          <div className="container-page">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <GraduationCap className="h-6 w-6 text-white" />
              </span>
              <p className="text-sm font-bold uppercase tracking-widest text-purple-200">
                All India Exam Result
              </p>
            </div>
            <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">
              Board Results 2026
            </h1>
            <p className="mt-3 max-w-2xl text-white/75 text-sm leading-7">
              Class 10th & 12th results for CBSE, UP Board, Bihar Board (BSEB), Rajasthan Board
              (RBSE), MP Board, Maharashtra, Tamil Nadu, Haryana, ICSE and all other state boards.
              Check roll number wise marks and download your marksheet.
            </p>
          </div>
        </div>

        {/* Quick Board Jump Links */}
        <div className="border-b border-slate-100 bg-white">
          <div className="container-page py-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">
              Jump to Board
            </p>
            <div className="flex flex-wrap gap-2">
              {BOARDS.map((b) => (
                <a
                  key={b.name}
                  href={b.href}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#7C3AED] hover:bg-[#7C3AED] hover:text-white"
                >
                  {b.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Board Cards Overview */}
        <section className="bg-slate-50 py-10">
          <div className="container-page">
            <h2 className="mb-6 text-xl font-black text-slate-800">State Board Wise Results</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {BOARDS.map((b) => (
                <a
                  key={b.name}
                  href={b.href}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#7C3AED]/40 hover:shadow-md"
                >
                  <div>
                    <p className="font-bold text-slate-800 group-hover:text-[#7C3AED]">{b.name}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{b.full}</p>
                    <span className="mt-2 inline-block rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-purple-600">
                      {b.states}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#7C3AED]" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* All Board Results Listing */}
        <SectionContent title="Board Results" items={boardResults} />

        {/* Info Box */}
        <section className="bg-purple-50 py-10">
          <div className="container-page">
            <div className="rounded-2xl border border-purple-100 bg-white p-6 sm:p-8">
              <h2 className="text-xl font-black text-slate-800">
                How to Check Board Result 2026?
              </h2>
              <ol className="mt-4 space-y-3 text-sm text-slate-600">
                {[
                  "Click on your board name above (CBSE, UP Board, Bihar Board, etc.)",
                  "Open the result link on the official board website",
                  "Enter your Roll Number and Date of Birth / School Code",
                  "Click Submit to view your marks",
                  "Download and save the marksheet / scorecard as PDF",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#7C3AED] text-[11px] font-black text-white">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 rounded-xl bg-purple-50 p-4 text-xs text-purple-800">
                <strong>Note:</strong> Always check results from the official board website. This
                portal aggregates result links from government sources for your convenience.
              </div>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="border-t border-slate-100 bg-white py-8">
          <div className="container-page">
            <h2 className="mb-4 text-base font-black text-slate-700">Related Pages</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Latest Vacancy", href: "/latest-jobs" },
                { label: "Admit Card", href: "/admit-card" },
                { label: "Answer Keys", href: "/answer-key" },
                { label: "All Results", href: "/results" },
                { label: "Admissions", href: "/admissions" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-[#0D9488] hover:text-[#0D9488]"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
