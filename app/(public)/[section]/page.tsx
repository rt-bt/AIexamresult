import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { TableContent } from "@/components/site/table-content";
import { sectionItems } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

const sections: Record<string, string> = {
  results: "Results",
  "latest-jobs": "Latest Government Jobs",
  "admit-card": "Admit Card",
  "answer-key": "Answer Key",
  admissions: "Admissions",
  syllabus: "Syllabus",
  contact: "Contact",
  about: "About",
  "privacy-policy": "Privacy Policy",
  disclaimer: "Disclaimer"
};

const sectionDescriptions: Record<string, string> = {
  results: "Sarkari result 2026: Find latest government exam results including SSC, UPSC, Railway, UP Board, Bihar Board and more. Verified result updates with direct official links.",
  "latest-jobs": "Sarkari naukri 2026: Latest government job notifications, central and state government vacancies, application forms, eligibility criteria and important dates for sarkari exam.",
  "admit-card": "Download sarkari admit cards for upcoming government exams 2026. Get hall tickets for SSC, Railway, UPSC, state exams with direct official links.",
  "answer-key": "Download official sarkari answer keys for government exams 2026. Raise objections, check expected scores and calculate marks for SSC, Railway, UPSC.",
  admissions: "University and college admission notifications 2026. Find entrance exam dates, application forms, merit lists and counselling schedules.",
  syllabus: "Exam syllabus and preparation resources for SSC, UPSC, Railway, Banking and state government sarkari exams 2026.",
  contact: "Contact All India Exam Result for support, partnership or feedback. Get in touch via email or phone for government exam related queries.",
  about: "All India Exam Result is India's fastest government exam information portal. Learn about our mission to provide verified sarkari result updates.",
  "privacy-policy": "Privacy policy of All India Exam Result. Learn how we collect, use and protect your personal information when you visit our website.",
  disclaimer: "Disclaimer for All India Exam Result. All exam data is sourced from public government notifications. We are not an official government website.",
};

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  const title = sections[section] ?? "Updates";
  const desc = sectionDescriptions[section] || `${title} updates with verified official links, important dates and eligibility details.`;
  const ogTitle = ["results", "admit-card", "answer-key", "latest-jobs"].includes(section)
    ? `Sarkari ${title} 2026 | All India Exam Result`
    : `${title} | All India Exam Result`;
  return {
    title,
    description: desc,
    alternates: { canonical: `/${section}` },
    openGraph: { title: ogTitle, description: desc, url: `${SITE_URL}/${section}`, images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: ogTitle, description: desc },
    robots: { index: true, follow: true }
  };
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const title = sections[section] ?? "Updates";
  const informational = ["contact", "about", "privacy-policy", "disclaimer"].includes(section);
  const items = sectionItems[section];
  const h1Prefix = ["results", "admit-card", "answer-key", "latest-jobs"].includes(section) ? "Sarkari " : "";

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/${section}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: title }
        ]
      },
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/${section}#page`,
        name: `${h1Prefix}${title} 2026 - Latest Updates`,
        description: sectionDescriptions[section] || `${title} updates with verified official links.`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-IN",
        mainEntity: items?.length ? {
          "@type": "ItemList",
          itemListElement: items.slice(0, 20).map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_URL}/post/${p.slug}`,
            name: p.title
          }))
        } : undefined
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header />
      <main>
        <div className="bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#115E59] py-16">
          <div className="container-page">
            <nav aria-label="Breadcrumb" className="mb-4 flex">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-white/70">
                <li><Link href="/" className="font-medium transition hover:text-white">Home</Link></li>
                <ChevronRight className="h-3.5 w-3.5" />
                <li className="font-semibold text-white">{title}</li>
              </ol>
            </nav>
            <p className="text-sm font-bold uppercase tracking-wide text-[#5EEAD4]">All India Exam Result</p>
            <h1 className="mt-3 text-4xl font-black text-white">{h1Prefix}{title}</h1>
            <p className="mt-3 max-w-2xl text-white/80">
              {informational
                ? "Transparent information, editorial standards and contact details for the portal."
                : "Verified updates with instant search, official links, SEO-rich summaries and mobile-first reading."}
            </p>
          </div>
        </div>
        {informational ? (
          <section className="container-page py-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 leading-8 text-slate-700">
              <p>All India Exam Result is an independent information portal. We summarize public notices and link readers to official websites for final verification.</p>
              <p className="mt-4">For corrections, partnerships or support, contact: support@aiexamresult.com.</p>
            </div>
          </section>
        ) : items && items.length > 0 ? (
          <TableContent title={title} items={items} />
        ) : (
          <section className="container-page py-20 text-center">
            <h2 className="text-2xl font-black text-ink">Coming Soon</h2>
            <p className="mt-2 text-slate-500">Updates for this section will appear shortly.</p>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
