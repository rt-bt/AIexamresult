import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import Link from "next/link";
import { ShieldCheck, BookOpen, Train, Landmark, Swords, GraduationCap, Building2, ScrollText, ArrowRight } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aiexamresult.com";

export const metadata: Metadata = {
  title: "All Exams 2026 - SSC, UPSC, Railway, Banking, State Jobs",
  description: "Browse all government exam categories: SSC, UPSC, Railway RRB, Banking, Defence, Teaching and State PSCs. Find syllabus, notifications, and results 2026.",
  alternates: { canonical: "/exam" },
  openGraph: { title: "All Exams 2026 | All India Exam Result", description: "Browse all government exam categories: SSC, UPSC, Railway RRB, Banking, Defence, Teaching and State PSCs. Find syllabus, notifications, and results 2026.", url: `${SITE_URL}/exam`, images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "All Exams 2026 | All India Exam Result", description: "Browse all government exam categories: SSC, UPSC, Railway RRB, Banking, Defence, Teaching and State PSCs. Find syllabus, notifications, and results 2026." },
  robots: { index: true, follow: true },
};

interface Exam { title: string; slug: string; description: string }

const examGroups: Exam[] = [
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

const categories: { label: string; icon: typeof ShieldCheck; gradient: string; badge: string; filter: (e: Exam) => boolean }[] = [
  { label: "SSC Exams", icon: ShieldCheck, gradient: "from-blue-600 to-blue-700", badge: "Staff Selection Commission", filter: e => e.slug.startsWith("ssc") },
  { label: "UPSC Exams", icon: BookOpen, gradient: "from-amber-600 to-orange-600", badge: "Union Public Service Commission", filter: e => e.slug.startsWith("upsc") },
  { label: "Railway Exams", icon: Train, gradient: "from-indigo-600 to-indigo-700", badge: "RRB / Indian Railways", filter: e => e.slug.startsWith("rrb") || e.slug === "railway" },
  { label: "Banking Exams", icon: Landmark, gradient: "from-emerald-600 to-emerald-700", badge: "IBPS / SBI / RBI", filter: e => ["ibps", "sbi", "rbi"].some(p => e.slug.startsWith(p)) },
  { label: "Defence Exams", icon: Swords, gradient: "from-red-600 to-red-700", badge: "Army / Navy / Air Force", filter: e => ["indian-army", "indian-navy", "indian-airforce", "upsc-nda", "upsc-cds"].includes(e.slug) },
  { label: "Teaching Exams", icon: GraduationCap, gradient: "from-violet-600 to-violet-700", badge: "CTET / State TET", filter: e => e.slug === "ctet" || e.slug.startsWith("teaching") },
  { label: "State Jobs", icon: Building2, gradient: "from-teal-600 to-teal-700", badge: "State Government", filter: e => e.slug.includes("govt-jobs") || e.slug.includes("state") },
  { label: "Board Results", icon: ScrollText, gradient: "from-pink-600 to-pink-700", badge: "Class 10 & 12 Results", filter: e => e.slug.includes("result") || e.slug.includes("board") },
];

export default function ExamIndexPage() {
  return (
    <>
      <Header />
      <main className="bg-white min-h-screen font-sans">
        {/* Brand Kit Dark Hero Banner */}
        <div className="relative overflow-hidden bg-[#111111] border-b border-[#222222] py-14 sm:py-18">
          <div className="container-page relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD84D]/40 bg-white/10 px-3.5 py-1 text-xs font-semibold text-[#FFD84D] backdrop-blur-md mb-4 font-heading">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF5B3E] animate-pulse" />
              <span>All India Exam Result · 2026 Directory</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-heading">
              All Government Exams <span className="text-[#FFD84D]">2026</span>
            </h1>
            <p className="mt-3 max-w-2xl text-neutral-300 text-sm sm:text-base leading-relaxed font-sans">
              Complete directory of official government exams. Direct links for notifications, syllabus, admit cards, answer keys, and scorecards across central and state commissions.
            </p>
          </div>
        </div>

        {/* Clean Light Surface Cards */}
        <section className="container-page py-12">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((cat) => {
              const exams = examGroups.filter(cat.filter);
              const Icon = cat.icon;
              return (
                <div key={cat.label} className="group rounded-2xl border border-[#DEDEDE] bg-white shadow-sm hover:shadow-xl hover:border-[#111111]/40 transition-all duration-300 overflow-hidden">
                  {/* Category Card Header (#111111 with Warm Yellow #FFD84D accent) */}
                  <div className="bg-gradient-to-r from-[#111111] to-[#222222] px-5 py-4 text-white">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm text-[#FFD84D] border border-white/10">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="text-base font-bold text-white font-heading tracking-wide">{cat.label}</h2>
                        <p className="text-[11px] font-medium text-[#FFD84D]">{cat.badge}</p>
                      </div>
                    </div>
                  </div>

                  {/* Exam List on Clean White */}
                  <div className="p-4 bg-white">
                    <div className="space-y-1">
                      {exams.map((exam) => (
                        <Link
                          key={exam.slug}
                          href={`/exam/${exam.slug}`}
                          className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-neutral-700 transition hover:bg-neutral-50 hover:text-[#FF5B3E] group/link"
                        >
                          <span className="font-medium">{exam.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="hidden lg:block text-[11px] text-neutral-400">{exam.description}</span>
                            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-neutral-300 transition group-hover/link:translate-x-0.5 group-hover/link:text-[#FF5B3E]" />
                          </div>
                        </Link>
                      ))}
                    </div>

                    <Link
                      href={`/${exams[0]?.slug?.split("-")[0] || ""}`}
                      className="mt-3 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#111111]/30 py-2.5 text-xs font-semibold text-[#111111] transition hover:bg-neutral-50 hover:border-[#FF5B3E] hover:text-[#FF5B3E] font-heading"
                    >
                      View all {cat.label.toLowerCase()} posts
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
