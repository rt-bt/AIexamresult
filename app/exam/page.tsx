import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "All Exams 2026 - SSC, UPSC, Railway, Banking, State Jobs",
  description: "Browse all government exam categories in one place. SSC, UPSC, Railway RRB, Banking IBPS SBI, Teaching CTET, Defence, State government jobs and board exam results 2026.",
  alternates: { canonical: "/exam" },
};

const examGroups: Array<{ title: string; slug: string; description: string }> = [
  { title: "SSC (Staff Selection Commission)", slug: "ssc", description: "CGL, CHSL, MTS, GD Constable, JE, CPO, Stenographer" },
  { title: "SSC CGL", slug: "ssc-cgl", description: "Combined Graduate Level exam" },
  { title: "SSC CHSL", slug: "ssc-chsl", description: "Combined Higher Secondary Level exam" },
  { title: "SSC MTS", slug: "ssc-mts", description: "Multi-Tasking Staff exam" },
  { title: "SSC GD Constable", slug: "ssc-gd", description: "General Duty Constable" },
  { title: "UPSC Civil Services (IAS)", slug: "upsc-cse", description: "IAS, IFS, IPS exam" },
  { title: "UPSC NDA", slug: "upsc-nda", description: "National Defence Academy" },
  { title: "UPSC CDS", slug: "upsc-cds", description: "Combined Defence Services" },
  { title: "Railway RRB NTPC", slug: "rrb-ntpc", description: "Non-Technical Popular Categories" },
  { title: "Railway RRB ALP", slug: "rrb-alp", description: "Assistant Loco Pilot" },
  { title: "Railway RRB Group D", slug: "rrb-group-d", description: "Level 1 posts" },
  { title: "IBPS PO", slug: "ibps-po", description: "Probationary Officer" },
  { title: "IBPS Clerk", slug: "ibps-clerk", description: "Clerical cadre" },
  { title: "SBI PO", slug: "sbi-po", description: "State Bank of India PO" },
  { title: "SBI Clerk", slug: "sbi-clerk", description: "State Bank of India Clerk" },
  { title: "RBI Grade B", slug: "rbi-grade-b", description: "Reserve Bank of India" },
  { title: "CTET", slug: "ctet", description: "Central Teacher Eligibility Test" },
  { title: "Indian Army", slug: "indian-army", description: "Army recruitment and exams" },
  { title: "Indian Navy", slug: "indian-navy", description: "Navy recruitment and exams" },
  { title: "Indian Air Force", slug: "indian-airforce", description: "Air Force Agniveer and other exams" },
  { title: "State Government Jobs", slug: "state-govt-jobs", description: "All state govt vacancies" },
  { title: "UP Government Jobs", slug: "up-govt-jobs", description: "Uttar Pradesh govt exams" },
  { title: "Bihar Government Jobs", slug: "bihar-govt-jobs", description: "Bihar govt exams and results" },
  { title: "CBSE Result", slug: "cbse-result", description: "CBSE board exam results" },
  { title: "Bihar Board (BSEB) Result", slug: "bseb-result", description: "Bihar board exam results" },
  { title: "UP Board Result", slug: "up-board-result", description: "UP board exam results" },
];

const examGroupsStructured = [
  { label: "SSC Exams", exams: examGroups.filter(e => e.slug.startsWith("ssc")) },
  { label: "UPSC Exams", exams: examGroups.filter(e => e.slug.startsWith("upsc")) },
  { label: "Railway Exams", exams: examGroups.filter(e => e.slug.startsWith("rrb") || e.slug === "railway") },
  { label: "Banking Exams", exams: examGroups.filter(e => ["ibps", "sbi", "rbi"].some(p => e.slug.startsWith(p))) },
  { label: "Defence Exams", exams: examGroups.filter(e => ["indian-army", "indian-navy", "indian-airforce", "upsc-nda", "upsc-cds"].includes(e.slug)) },
  { label: "Teaching Exams", exams: examGroups.filter(e => e.slug === "ctet" || e.slug.startsWith("teaching")) },
  { label: "State Jobs", exams: examGroups.filter(e => e.slug.includes("govt-jobs") || e.slug.includes("state")) },
  { label: "Board Results", exams: examGroups.filter(e => e.slug.includes("result") || e.slug.includes("board")) },
];

export default function ExamIndexPage() {
  return (
    <>
      <Header />
      <main>
        <div className="bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#115E59] py-16">
          <div className="container-page">
            <p className="text-sm font-bold uppercase tracking-wide text-[#5EEAD4]">All India Exam Result</p>
            <h1 className="mt-3 text-4xl font-black text-white">All Exams 2026</h1>
            <p className="mt-3 max-w-2xl text-white/80">
              Complete list of government exam categories. Find notifications, admit cards, answer keys and results for SSC, UPSC, Railway, Banking, Defence, Teaching and state-level exams.
            </p>
          </div>
        </div>
        <section className="container-page py-10">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {examGroupsStructured.map((group) => (
              <div key={group.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-black text-ink">{group.label}</h2>
                <ul className="mt-4 space-y-2">
                  {group.exams.map((exam) => (
                    <li key={exam.slug}>
                      <Link href={`/exam/${exam.slug}`} className="group flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#0D9488]">
                        <ArrowUpRight className="h-3 w-3 shrink-0 transition group-hover:translate-x-0.5" />
                        {exam.title}
                        <span className="ml-auto text-[10px] text-slate-400">{exam.description}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
