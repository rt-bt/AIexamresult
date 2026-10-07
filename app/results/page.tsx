export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SectionContent } from "@/components/site/section-content";
import { sectionItems } from "@/lib/data";
import type { PostCard } from "@/lib/data";

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
  const allItems: PostCard[] = Object.values(sectionItems).flat();

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
      <main className="bg-white min-h-screen font-sans">
        <div className="border-b border-[#222222] bg-[#111111] py-12 sm:py-16 relative overflow-hidden">
          <div className="container-page relative z-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#FFD84D] font-heading">All India Exam Result · 2026</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-white font-heading">Sarkari Result 2026 : All Government Exam Results</h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
              Find verified real-time results for SSC, Railway RRB, UPSC, State PSCs, Police Recruitment, Banking, and Board examinations. Direct score card and cut-off marks links.
            </p>
          </div>
        </div>
        <SectionContent title="Latest Results 2026" items={allItems} />
      </main>
      <Footer />
    </>
  );
}
