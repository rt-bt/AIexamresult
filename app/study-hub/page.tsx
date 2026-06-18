import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { BookOpen, FileText, Video, HelpCircle, ExternalLink } from "lucide-react";

const resources = [
  { title: "SSC Study Material", desc: "CGL, CHSL, MTS, GD, JE — syllabus, books, practice sets", href: "/exam/ssc", icon: BookOpen },
  { title: "UPSC Preparation", desc: "IAS, NDA, CDS — NCERT notes, previous papers, strategy", href: "/exam/upsc-cse", icon: FileText },
  { title: "Railway RRB Guide", desc: "NTPC, ALP, Group D, JE — study plan, subject-wise tips", href: "/exam/rrb-ntpc", icon: BookOpen },
  { title: "Banking Exams", desc: "IBPS PO, Clerk, RRB, SBI — reasoning, quant, English", href: "/exam/ibps-po", icon: Video },
  { title: "Teaching Exams", desc: "CTET, UPTET, REET, Bihar Teacher — subject-wise notes", href: "/exam/ctet", icon: HelpCircle },
  { title: "State Govt Jobs", desc: "UP, Bihar, Rajasthan, MP, Maharashtra — state exam prep", href: "/state/uttar-pradesh", icon: BookOpen },
];

export const metadata: Metadata = {
  title: "Study Hub | All India Exam Result",
  description: "Preparation resources, guides and study material for SSC, UPSC, Railway, Banking, Teaching & state government exams.",
};

export default function StudyHubPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 pb-20 lg:pb-10">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Study Hub</h1>
              <p className="mt-2 text-gray-500 text-sm sm:text-base">
                Preparation resources, guides and study material for competitive exams
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((r) => {
                const Icon = r.icon;
                return (
                  <Link key={r.href} href={r.href} className="group rounded-2xl bg-white p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-sm">
                      <Icon className="h-5 w-5 text-white" />
                    </span>
                    <h2 className="mt-4 font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{r.title}</h2>
                    <p className="mt-1 text-sm text-gray-500 leading-relaxed">{r.desc}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
