import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { scholarshipItems } from "@/lib/data";
import { getCategoryCta } from "@/lib/categories";
import { Award, ChevronRight, ExternalLink, GraduationCap, FileCheck, CheckCircle2 } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aiexamresult.com";

export const metadata: Metadata = {
  title: { absolute: "Sarkari Scholarships 2026 : Online Form, Eligibility & Status Check" },
  description: "Check latest government scholarship schemes 2026 for Pre-Matric, Post-Matric, Higher Education, UP Scholarship, NSP & State welfare yojanas in India.",
  alternates: { canonical: `${SITE_URL}/scholarships` },
  openGraph: {
    title: "Sarkari Scholarships 2026 : Online Form, Eligibility & Status Check",
    description: "Check latest government scholarship schemes 2026 for Pre-Matric, Post-Matric, Higher Education, UP Scholarship, NSP & State welfare yojanas in India.",
    url: `${SITE_URL}/scholarships`,
    images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarkari Scholarships 2026 : Online Form, Eligibility & Status Check",
    description: "Check latest government scholarship schemes 2026 for Pre-Matric, Post-Matric, Higher Education, UP Scholarship, NSP & State welfare yojanas in India.",
  },
};

export default function ScholarshipsHubPage() {
  const items = scholarshipItems;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/scholarships#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Scholarships 2026", item: `${SITE_URL}/scholarships` },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/scholarships#page`,
        name: "Sarkari Scholarships 2026 - Central & State Welfare Schemes",
        description: "Official notices, online application portals, renewal links, and status tracker for Indian student scholarship schemes.",
        url: `${SITE_URL}/scholarships`,
        isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: items.length,
          itemListElement: items.map((item, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: item.title,
            url: item.slug ? `${SITE_URL}/post/${item.slug}` : `${SITE_URL}/scholarships`,
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
                <li className="font-semibold text-[#FFD84D]">Scholarships</li>
              </ol>
            </nav>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD84D]/30 bg-white/5 px-3.5 py-1 text-xs font-semibold text-[#FFD84D] mb-3">
              <Award className="h-3.5 w-3.5" />
              <span>Government Student Welfare Schemes · 2026</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white font-heading tracking-tight">
              Sarkari Scholarships 2026
            </h1>
            <p className="mt-3 max-w-2xl text-neutral-300 text-sm sm:text-base leading-relaxed">
              Find verified application forms, renewal schedules, eligibility criteria, and disbursement status for central &amp; state government scholarships.
            </p>
          </div>
        </div>

        {/* Scholarships Grid */}
        <section className="container-page py-10">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                Active Scholarship Schemes &amp; Status
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Verified application and renewal links from state and central portals
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, idx) => {
              const cta = getCategoryCta("scholarships", item.title);
              return (
                <div
                  key={item.slug || idx}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-500/40 hover:shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 ring-1 ring-blue-200 font-heading">
                        <Award className="h-3 w-3" />
                        Scholarship
                      </span>
                      {item.date && (
                        <span className="text-[11px] font-medium text-slate-400">
                          {item.date}
                        </span>
                      )}
                    </div>
                    <Link href={item.slug ? `/post/${item.slug}` : "#"}>
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition line-clamp-2 text-sm leading-snug font-heading">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.excerpt || "Check eligibility requirements, income certificate limits, required documents, and online application portal link."}
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

        {/* Essential Documents Checklist for Scholarships */}
        <section className="container-page py-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <FileCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-heading">
                  Essential Documents for Scholarship Application
                </h2>
                <p className="text-xs text-slate-500">Ensure these documents are ready before filling out online forms</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 text-xs text-slate-600">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm mb-1 font-heading flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Income Certificate
                </h3>
                <p className="leading-relaxed">Current financial year income certificate issued by Tehsildar or Revenue Authority with valid verification number.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm mb-1 font-heading flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Caste / Domicile
                </h3>
                <p className="leading-relaxed">Category certificate for SC, ST, OBC, EWS candidates and state resident certificate matching school or college records.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm mb-1 font-heading flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Bank Passbook
                </h3>
                <p className="leading-relaxed">Aadhaar-seeded bank account in the student's own name with active DBT (Direct Benefit Transfer) facility.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm mb-1 font-heading flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Fee Receipt &amp; Marksheet
                </h3>
                <p className="leading-relaxed">Previous qualification marksheet and current academic year college/school fee deposit receipt.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
