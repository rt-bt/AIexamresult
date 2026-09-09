export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SectionContent } from "@/components/site/section-content";
import { sectionItems } from "@/lib/data";
import type { PostCard } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aiexamresult.com";

export const metadata: Metadata = {
  title: "Sarkari Result 2026 : Check All Government Exam Results Online",
  description: "Sarkari Result 2026: Check latest Sarkari exam results, score cards, cut off marks, merit list & direct download links for SSC, UPSC, Railway, Banking, Police, UP & Bihar Board exams.",
  alternates: { canonical: `${SITE_URL}/results` },
  openGraph: {
    title: "Sarkari Result 2026 : All Govt Exam Results - Sarkari Exam",
    description: "Check latest Sarkari exam results, score cards, cut off marks & merit list.",
    url: `${SITE_URL}/results`,
    images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarkari Result 2026 : All Govt Exam Results Online",
    description: "Check latest Sarkari exam results, score cards, cut off marks & merit list.",
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
      <main>
        <div className="bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#115E59] py-14 sm:py-16">
          <div className="container-page">
            <p className="text-sm font-bold uppercase tracking-wide text-[#5EEAD4]">Sarkari Result · Sarkari Exam</p>
            <h1 className="mt-3 text-3xl sm:text-4xl font-black text-white">Sarkari Result 2026 : All Government Exam Results</h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/85 leading-relaxed">
              Find verified real-time results for SSC, Railway RRB, UPSC, State PSCs, Police Recruitment, Banking, and Board examinations. Direct score card and cut-off marks links.
            </p>
          </div>
        </div>
        <SectionContent title="Sarkari Exam Results 2026" items={allItems} />
      </main>
      <Footer />
    </>
  );
}
