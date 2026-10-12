export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { JobsDirectory } from "@/components/site/jobs-directory";
import { latestJobs } from "@/lib/data";
import {
  Briefcase,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Building,
  GraduationCap,
  Clock,
  HelpCircle,
  FileText,
  CheckCircle2
} from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aiexamresult.com";

export const metadata: Metadata = {
  title: { absolute: "Sarkari Naukri 2026 : Latest Jobs Online Form, Notification | All India Exam Result" },
  description:
    "Sarkari Naukri 2026: Latest government job notifications, vacancies, eligibility criteria, and direct online application forms for SSC, Railway, UPSC, Banking, Police & State exams.",
  alternates: { canonical: `${SITE_URL}/latest-jobs` },
  openGraph: {
    title: "Sarkari Naukri 2026 : Latest Jobs Online Form, Notification | All India Exam Result",
    description:
      "Sarkari Naukri 2026: Latest government job notifications, vacancies, eligibility, and online forms for SSC, Railway, UPSC, Banking, and State exams.",
    url: `${SITE_URL}/latest-jobs`,
    images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarkari Naukri 2026 : Latest Jobs Online Form, Notification | All India Exam Result",
    description:
      "Sarkari Naukri 2026: Latest government job notifications, vacancies, eligibility, and online forms for SSC, Railway, UPSC, Banking, and State exams.",
  },
};

export default function LatestJobsPage() {
  const items = latestJobs;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/latest-jobs#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Latest Jobs 2026", item: `${SITE_URL}/latest-jobs` },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/latest-jobs#page`,
        name: "Sarkari Naukri 2026 : Latest Jobs Online Form, Notification",
        description:
          "Latest government job notifications, vacancies, eligibility criteria, and direct online application links for SSC, Railway, UPSC, Banking, Police & State exams.",
        url: `${SITE_URL}/latest-jobs`,
        isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "All India Exam Result" },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: items.slice(0, 30).length,
          itemListElement: items.slice(0, 30).map((item, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: item.title,
            url: item.slug ? `${SITE_URL}/post/${item.slug}` : `${SITE_URL}/latest-jobs`,
          })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How can I apply online for Sarkari Naukri 2026 vacancies?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Click on any active recruitment notification to review eligibility requirements, age criteria, and educational qualifications. Use the verified Official Apply Online link to fill out the form on the official recruiting board's portal.",
            },
          },
          {
            "@type": "Question",
            name: "What documents are required to fill out a Sarkari online form?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Candidates typically need scanned passport-size photographs, signature, 10th/12th marksheets, graduation certificate, category/caste certificate (SC/ST/OBC/EWS), Domicile certificate, and a valid Government ID (Aadhaar/PAN/Voter ID).",
            },
          },
          {
            "@type": "Question",
            name: "How frequently is the Latest Jobs section updated?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "All India Exam Result synchronizes official recruitment notices multiple times daily across UPSC, SSC, Railway Recruitment Boards (RRB), State PSCs, Police Recruitment Boards, and Banking institutions.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="min-h-screen bg-slate-50/50 font-sans pb-16">
        {/* Premium Brand Hero Section */}
        <div className="relative overflow-hidden border-b border-[#222222] bg-[#111111] py-12 sm:py-16">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#FFD84D]/10 blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 -bottom-24 h-64 w-64 rounded-full bg-[#FF5B3E]/10 blur-3xl pointer-events-none" />

          <div className="container-page relative z-10">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-4 flex">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-neutral-400">
                <li>
                  <Link href="/" className="font-medium transition hover:text-white">
                    Home
                  </Link>
                </li>
                <ChevronRight className="h-3.5 w-3.5 text-neutral-500" />
                <li className="font-semibold text-[#FFD84D]">Latest Jobs 2026</li>
              </ol>
            </nav>

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD84D]/30 bg-white/5 px-3.5 py-1 text-xs font-semibold text-[#FFD84D] mb-3">
              <Sparkles className="h-3.5 w-3.5 text-[#FFD84D]" />
              <span>Verified Government Recruitment Hub · 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight leading-tight">
              Sarkari Naukri 2026 : Latest Jobs Online Form
            </h1>

            {/* Editorial Lead Description */}
            <p className="mt-3 max-w-3xl text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
              Find verified real-time recruitment notices for SSC, Railway RRB, UPSC, Defence, Banking, Police, Teaching, and State Govt vacancies. Direct official notification PDFs and online application portals.
            </p>

            {/* 4 Metric Bento Cards */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-[#FFD84D] font-heading">{items.length}+</div>
                <div className="text-xs font-medium text-neutral-400 mt-0.5">Active Vacancies</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-white font-heading">Central &amp; States</div>
                <div className="text-xs font-medium text-neutral-400 mt-0.5">All India Coverage</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-heading">100% Free</div>
                <div className="text-xs font-medium text-neutral-400 mt-0.5">Verified Official Links</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-rose-400 font-heading">Real-Time</div>
                <div className="text-xs font-medium text-neutral-400 mt-0.5">Daily Instant Alerts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Directory Section (Search, Sector Pills, State Filter, Grid/Table View) */}
        <JobsDirectory items={items} />

        {/* Application Checklist & FAQ Guidance */}
        <section className="container-page py-6">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                  Sarkari Job Application Guidelines &amp; Important Instructions
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Follow these essential steps before submitting any government recruitment application
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-600">
              <div className="rounded-2xl bg-slate-50/80 p-4 border border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm mb-1.5 font-heading flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 1. Check Eligibility
                </h3>
                <p className="leading-relaxed">
                  Verify age limit, relaxation rules, minimum educational qualification, and experience details in the official advertisement PDF.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50/80 p-4 border border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm mb-1.5 font-heading flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 2. Prepare Documents
                </h3>
                <p className="leading-relaxed">
                  Keep digital scans ready: Passport photo with plain background, signature, Aadhaar card, caste certificate, and qualification marksheet.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50/80 p-4 border border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm mb-1.5 font-heading flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 3. Avoid Last-Day Rush
                </h3>
                <p className="leading-relaxed">
                  Official servers often experience severe traffic bottlenecks during the final 48 hours. Submit application fees well before the last date.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50/80 p-4 border border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm mb-1.5 font-heading flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 4. Save Final Printout
                </h3>
                <p className="leading-relaxed">
                  Download and print the completed application confirmation page along with the fee receipt for document verification and interview.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
