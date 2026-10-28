export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ResultsDirectory } from "@/components/site/results-directory";
import { sectionItems } from "@/lib/data";
import type { PostCard } from "@/lib/data";
import {
  Trophy,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  FileText,
  Building,
  CheckCircle2,
  HelpCircle,
  FileCheck2,
  Zap,
  Globe2,
  DownloadCloud
} from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aiexamresult.com";

export const metadata: Metadata = {
  title: { absolute: "Sarkari Result 2026 : Check Govt Exam Results Online" },
  description: "Check latest Sarkari Result 2026, scorecards, merit lists and cut-off marks for SSC, UPSC, Railway, Banking and State exams with direct official links.",
  alternates: { canonical: `${SITE_URL}/results` },
  openGraph: {
    title: "Sarkari Result 2026 : Check Govt Exam Results Online",
    description: "Check latest Sarkari Result 2026, scorecards, merit lists and cut-off marks for SSC, UPSC, Railway, Banking and State exams with direct official links.",
    url: `${SITE_URL}/results`,
    images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarkari Result 2026 : Check Govt Exam Results Online",
    description: "Check latest Sarkari Result 2026, scorecards, merit lists and cut-off marks for SSC, UPSC, Railway, Banking and State exams with direct official links.",
  }
};

export default function ResultsPage() {
  const allItems: PostCard[] = sectionItems.results;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Sarkari Results 2026", item: `${SITE_URL}/results` },
        ]
      },
      {
        "@type": "CollectionPage",
        name: "Sarkari Result 2026 : Government Exam Results",
        description: "Latest Sarkari exam results, score cards, merit list and direct download links across India.",
        url: `${SITE_URL}/results`,
        isPartOf: { "@type": "WebSite", url: SITE_URL, name: "All India Exam Result" },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: allItems.slice(0, 30).length,
          itemListElement: allItems.slice(0, 30).map((item, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: item.title,
            url: item.slug ? `${SITE_URL}/post/${item.slug}` : `${SITE_URL}/results`
          }))
        }
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How can I check my Sarkari Result 2026 online?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Search for your exam name on the All India Exam Result directory, click on 'Check Result', and access the direct official commission server link using your Roll Number or Registration Number."
            }
          },
          {
            "@type": "Question",
            name: "Are the Sarkari Result links on this website verified and direct?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, 100% of links on AI Exam Result resolve directly to official government commission portals (.gov.in, .nic.in, and official state examination servers) without intermediate ad redirects or third-party watermarks."
            }
          },
          {
            "@type": "Question",
            name: "What should I do if the official result portal is down or running slow?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "During heavy server traffic on result declaration days, we provide alternative direct PDF download mirrors and regional board server links on each dedicated result post."
            }
          },
          {
            "@type": "Question",
            name: "Where can I find cutoff marks and merit lists?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Category-wise cut-off marks (General, OBC, EWS, SC, ST) and complete merit list PDFs are published inside each exam result's detail page under the Important Links section."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="bg-slate-50/60 min-h-screen font-sans pb-16">
        {/* Redesigned Premium Brand Hero */}
        <div className="relative overflow-hidden border-b border-[#222222] bg-[#111111] py-12 sm:py-16">
          {/* Ambient Lighting Gradients */}
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#FFD84D]/10 blur-3xl pointer-events-none" />
          <div className="absolute left-1/4 -bottom-24 h-72 w-72 rounded-full bg-[#FF5B3E]/10 blur-3xl pointer-events-none" />

          <div className="container-page relative z-10">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-4 flex">
              <ol className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-neutral-400">
                <li>
                  <Link href="/" className="font-medium transition hover:text-white">
                    Home
                  </Link>
                </li>
                <ChevronRight className="h-3.5 w-3.5 text-neutral-500" />
                <li className="font-semibold text-[#FFD84D]">Sarkari Results 2026</li>
              </ol>
            </nav>

            {/* Pill Badge with Live Pulse */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD84D]/30 bg-white/5 px-3.5 py-1 text-xs font-semibold text-[#FFD84D] mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Live Results Feed · 100% Verified Official Board Links</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight leading-tight">
              Sarkari Result 2026 : All Government Exam Results
            </h1>

            {/* Editorial Lead Description */}
            <p className="mt-3 max-w-3xl text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
              Find verified real-time results for SSC, Railway RRB, UPSC, State PSCs, Police Recruitment, Banking, and Board examinations. Direct score card and cut-off marks links.
            </p>

            {/* 4 Metric Bento Cards */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[#FFD84D] mb-1">
                  <Zap className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Fast Updates</span>
                </div>
                <p className="text-lg sm:text-xl font-black text-white">Live Board Sync</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">Updated minute-by-minute</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Zero Spam</span>
                </div>
                <p className="text-lg sm:text-xl font-black text-white">100% Official Links</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">Direct .gov.in servers</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sky-400 mb-1">
                  <DownloadCloud className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Merit Lists</span>
                </div>
                <p className="text-lg sm:text-xl font-black text-white">Direct PDFs</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">No ads or watermark</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-purple-400 mb-1">
                  <Globe2 className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">All India</span>
                </div>
                <p className="text-lg sm:text-xl font-black text-white">Central & State</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">Complete 28 states hub</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Results Directory with Filters, Search, Grid/Table Toggle */}
        <ResultsDirectory items={allItems} />

        {/* "How to Check Your Sarkari Result" Educational Guidance Section */}
        <section className="container-page mt-8 mb-12">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm">
            <div className="max-w-2xl mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 mb-2 border border-amber-200">
                <CheckCircle2 className="h-3.5 w-3.5" /> Candidate Guide
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">
                How to Check Sarkari Exam Results Online
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Follow these 4 verified steps to download your official scorecard, check category cutoffs, and save your qualification merit list PDF without confusion.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-black text-sm mb-4">
                  01
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">Search Your Exam</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Use the quick search bar or board filters above to locate your specific recruitment cycle (e.g. SSC, BPSC, RRB).
                </p>
              </div>

              <div className="relative rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF5B3E] text-white font-black text-sm mb-4">
                  02
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">Keep Credentials Ready</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Have your Roll Number, Registration ID, and Date of Birth ready as specified on your original exam admit card.
                </p>
              </div>

              <div className="relative rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-black text-sm mb-4">
                  03
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">Open Official Link</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Click 'Check Result' on our verified card to connect directly to the commission server or download the official PDF list.
                </p>
              </div>

              <div className="relative rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white font-black text-sm mb-4">
                  04
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">Verify Cutoff & Next Stage</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Check your roll number in the qualified list and note dates for Skill Test, Document Verification (DV), or Mains exam.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Accessible Frequently Asked Questions Accordion */}
        <section className="container-page mb-8">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm">
            <div className="max-w-2xl mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 mb-2 border border-blue-200">
                <HelpCircle className="h-3.5 w-3.5" /> FAQ Assistance
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">
                Frequently Asked Questions (Sarkari Result 2026)
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Get quick answers to common queries regarding score verification, slow portals, and result announcements.
              </p>
            </div>

            <div className="space-y-4">
              <details className="group rounded-2xl border border-slate-200 bg-slate-50/50 p-5 transition-all open:bg-white open:shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-900 text-sm sm:text-base outline-none">
                  <span>How fast are government exam results published on All India Exam Result?</span>
                  <span className="ml-4 flex h-6 w-6 items-center justify-center rounded-full bg-slate-200/60 text-slate-600 group-open:rotate-180 transition-transform">
                    <ChevronRight className="h-4 w-4 rotate-90" />
                  </span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Our system continuously synchronizes official notifications across central and state recruitment boards (UPSC, SSC, Railway RRBs, State PSCs, Police Recruitment Boards) minute-by-minute as soon as official PDFs or server logins go live.
                </p>
              </details>

              <details className="group rounded-2xl border border-slate-200 bg-slate-50/50 p-5 transition-all open:bg-white open:shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-900 text-sm sm:text-base outline-none">
                  <span>What should I do if the official result server crashes or loads slowly?</span>
                  <span className="ml-4 flex h-6 w-6 items-center justify-center rounded-full bg-slate-200/60 text-slate-600 group-open:rotate-180 transition-transform">
                    <ChevronRight className="h-4 w-4 rotate-90" />
                  </span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Heavy traffic on result days frequently overloads state and central servers. We provide alternate direct PDF download links and mirror links inside the post detail page so candidates can view merit lists without waiting for server recovery.
                </p>
              </details>

              <details className="group rounded-2xl border border-slate-200 bg-slate-50/50 p-5 transition-all open:bg-white open:shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-900 text-sm sm:text-base outline-none">
                  <span>What is the difference between a Merit List and Cut-Off Marks?</span>
                  <span className="ml-4 flex h-6 w-6 items-center justify-center rounded-full bg-slate-200/60 text-slate-600 group-open:rotate-180 transition-transform">
                    <ChevronRight className="h-4 w-4 rotate-90" />
                  </span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  A Merit List contains the roll numbers and names of candidates selected for the next stage based on overall rank, whereas Cut-Off Marks represent the minimum qualifying score required for each category (General, OBC, EWS, SC, ST) to make the list.
                </p>
              </details>

              <details className="group rounded-2xl border border-slate-200 bg-slate-50/50 p-5 transition-all open:bg-white open:shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-900 text-sm sm:text-base outline-none">
                  <span>Are the links on All India Exam Result direct and safe?</span>
                  <span className="ml-4 flex h-6 w-6 items-center justify-center rounded-full bg-slate-200/60 text-slate-600 group-open:rotate-180 transition-transform">
                    <ChevronRight className="h-4 w-4 rotate-90" />
                  </span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Yes, every link published on AI Exam Result resolves directly to official commission portals (.gov.in, .nic.in, and authorized examination portals). We strictly prohibit third-party watermarks, click-traps, or spam redirect domains.
                </p>
              </details>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
