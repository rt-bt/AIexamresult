import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { syllabusItems } from "@/lib/data";
import { getCategoryCta } from "@/lib/categories";
import { BookOpen, FileText, ChevronRight, Sparkles, ExternalLink, GraduationCap, Shield, HelpCircle } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aiexamresult.com";

export const metadata: Metadata = {
  title: { absolute: "Sarkari Exam Syllabus 2026 : Download Exam Pattern & Syllabus PDF" },
  description: "Download latest Sarkari exam syllabus 2026 and exam pattern PDFs for SSC, UPSC, Railway RRB, Police, State PSC & Teaching recruitment exams in India.",
  alternates: { canonical: `${SITE_URL}/syllabus` },
  openGraph: {
    title: "Sarkari Exam Syllabus 2026 : Download Exam Pattern & Syllabus PDF",
    description: "Download latest Sarkari exam syllabus 2026 and exam pattern PDFs for SSC, UPSC, Railway RRB, Police, State PSC & Teaching recruitment exams in India.",
    url: `${SITE_URL}/syllabus`,
    images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarkari Exam Syllabus 2026 : Download Exam Pattern & Syllabus PDF",
    description: "Download latest Sarkari exam syllabus 2026 and exam pattern PDFs for SSC, UPSC, Railway RRB, Police, State PSC & Teaching recruitment exams in India.",
  },
};

export default function SyllabusHubPage() {
  const items = syllabusItems;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/syllabus#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Syllabus 2026", item: `${SITE_URL}/syllabus` },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/syllabus#page`,
        name: "Sarkari Exam Syllabus 2026 - Exam Pattern & Syllabus PDF",
        description: "Comprehensive repository of official syllabus and examination pattern documents for competitive examinations across India.",
        url: `${SITE_URL}/syllabus`,
        isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: items.length,
          itemListElement: items.map((item, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: item.title,
            url: item.slug ? `${SITE_URL}/post/${item.slug}` : `${SITE_URL}/syllabus`,
          })),
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="min-h-screen bg-slate-50 font-sans pb-16">
        {/* Hero Section */}
        <div className="border-b border-[#222222] bg-[#111111] py-12 sm:py-16 relative overflow-hidden">
          <div className="container-page relative z-10">
            <nav aria-label="Breadcrumb" className="mb-4 flex">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-neutral-400">
                <li><Link href="/" className="font-medium transition hover:text-white">Home</Link></li>
                <ChevronRight className="h-3.5 w-3.5 text-neutral-500" />
                <li className="font-semibold text-[#FFD84D]">Syllabus</li>
              </ol>
            </nav>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD84D]/30 bg-white/5 px-3.5 py-1 text-xs font-semibold text-[#FFD84D] mb-3">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Official Exam Pattern &amp; Curriculum · 2026</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white font-heading tracking-tight">
              Sarkari Exam Syllabus 2026
            </h1>
            <p className="mt-3 max-w-2xl text-neutral-300 text-sm sm:text-base leading-relaxed">
              Download official syllabus PDFs, subject-wise marking schemes, negative marking details, and exam patterns for Central and State government competitive exams.
            </p>
          </div>
        </div>

        {/* Featured Syllabus Grid */}
        <section className="container-page py-10">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                Latest Syllabus &amp; Pattern Updates
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Showing {items.length} verified curriculum and exam structure notices
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Official Board PDFs</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, idx) => {
              const cta = getCategoryCta("syllabus", item.title);
              return (
                <div
                  key={item.slug || idx}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-[#0D9488]/40 hover:shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-bold text-teal-700 ring-1 ring-teal-200 font-heading">
                        <FileText className="h-3 w-3" />
                        Syllabus PDF
                      </span>
                      {item.date && (
                        <span className="text-[11px] font-medium text-slate-400">
                          {item.date}
                        </span>
                      )}
                    </div>
                    <Link href={item.slug ? `/post/${item.slug}` : "#"}>
                      <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition line-clamp-2 text-sm leading-snug font-heading">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.excerpt || "Download complete topic-wise syllabus, marks distribution, and official exam pattern PDF."}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">
                      State: {item.state || "All India"}
                    </span>
                    <Link
                      href={item.slug ? `/post/${item.slug}` : "#"}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#FFD84D] px-3 py-1.5 text-xs font-bold text-[#111111] transition hover:bg-[#FF5B3E] hover:text-white font-heading"
                    >
                      {cta.actionText}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Preparation Guide Box */}
        <section className="container-page py-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-heading">
                  How to Use the Official Syllabus for Preparation
                </h2>
                <p className="text-xs text-slate-500">Key steps to maximize your competitive exam score</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mt-6 text-xs text-slate-600">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm mb-1.5 font-heading">1. Scrutinize Exam Pattern</h3>
                <p className="leading-relaxed">Check the number of tiers (Prelims, Mains, Interview), total marks, duration, and negative marking penalty before beginning preparation.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm mb-1.5 font-heading">2. Topic-Wise Weightage</h3>
                <p className="leading-relaxed">Identify high-yield topics in General Awareness, Quantitative Aptitude, Reasoning, and English or Hindi to allocate study hours effectively.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm mb-1.5 font-heading">3. Solve Previous Papers</h3>
                <p className="leading-relaxed">Cross-reference syllabus topics with previous 5 years' question papers to understand exam difficulty and question trends.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
