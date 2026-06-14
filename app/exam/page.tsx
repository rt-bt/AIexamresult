import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import Link from "next/link";
import { ShieldCheck, BookOpen, Train, Landmark, Swords, GraduationCap, Building2, ScrollText, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "All Exams 2026 - SSC, UPSC, Railway, Banking, State Jobs",
  description: "Browse all government exam categories in one place. SSC, UPSC, Railway RRB, Banking IBPS SBI, Teaching CTET, Defence, State government jobs and board exam results 2026.",
  alternates: { canonical: "/exam" },
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

        <section className="container-page -mt-7 pb-16">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((cat) => {
              const exams = examGroups.filter(cat.filter);
              const Icon = cat.icon;
              return (
                <div key={cat.label} className="group rounded-2xl border border-gray-100 bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Category Header */}
                  <div className={`bg-gradient-to-r ${cat.gradient} px-5 py-4`}>
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                        <Icon className="h-5 w-5 text-white" />
                      </span>
                      <div>
                        <h2 className="text-base font-bold text-white">{cat.label}</h2>
                        <p className="text-[10px] font-medium text-white/70">{cat.badge}</p>
                      </div>
                    </div>
                  </div>

                  {/* Exam List */}
                  <div className="p-4">
                    <div className="space-y-1">
                      {exams.map((exam) => (
                        <Link
                          key={exam.slug}
                          href={`/exam/${exam.slug}`}
                          className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-[#0D9488] group/link"
                        >
                          <span className="font-medium">{exam.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="hidden lg:block text-[11px] text-gray-400">{exam.description}</span>
                            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-gray-300 transition group-hover/link:translate-x-0.5 group-hover/link:text-[#0D9488]" />
                          </div>
                        </Link>
                      ))}
                    </div>

                    <Link
                      href={`/${exams[0]?.slug?.split("-")[0] || ""}`}
                      className="mt-3 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-200 py-2.5 text-xs font-semibold text-gray-400 transition hover:border-[#0D9488]/30 hover:text-[#0D9488]"
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
