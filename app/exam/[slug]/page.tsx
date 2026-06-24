import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { TableContent } from "@/components/site/table-content";
import { sectionItems } from "@/lib/data";
import type { PostCard } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

const examNames: Record<string, string> = {
  ssc: "SSC (Staff Selection Commission)",
  "ssc-cgl": "SSC CGL (Combined Graduate Level)",
  "ssc-chsl": "SSC CHSL (Combined Higher Secondary Level)",
  "ssc-mts": "SSC MTS (Multi-Tasking Staff)",
  "ssc-gd": "SSC GD Constable",
  "ssc-je": "SSC Junior Engineer",
  "ssc-stenographer": "SSC Stenographer",
  "ssc-cpo": "SSC CPO",
  upsc: "UPSC (Union Public Service Commission)",
  "upsc-cse": "UPSC Civil Services Examination (IAS)",
  "upsc-ifs": "UPSC Indian Forest Service",
  "upsc-nda": "UPSC NDA (National Defence Academy)",
  "upsc-cds": "UPSC CDS (Combined Defence Services)",
  "upsc-epfo": "UPSC EPFO",
  "upsc-capf": "UPSC CAPF",
  railway: "Railway Recruitment",
  "railway-rrb": "RRB (Railway Recruitment Board) Exams",
  "rrb-ntpc": "RRB NTPC",
  "rrb-alp": "RRB ALP (Assistant Loco Pilot)",
  "rrb-group-d": "RRB Group D",
  "rrb-je": "RRB Junior Engineer",
  banking: "Banking Exams",
  "ibps-po": "IBPS PO",
  "ibps-clerk": "IBPS Clerk",
  "ibps-rrb": "IBPS RRB",
  "sbi-po": "SBI PO",
  "sbi-clerk": "SBI Clerk",
  "rbi-grade-b": "RBI Grade B",
  "teaching-exams": "Teaching Exams",
  ctet: "CTET (Central Teacher Eligibility Test)",
  uptet: "UPTET",
  reet: "REET (Rajasthan Teacher Eligibility Test)",
  "bihar-teacher": "Bihar Teacher Recruitment",
  "defence-exams": "Defence Exams",
  "indian-army": "Indian Army Recruitment",
  "indian-navy": "Indian Navy Recruitment",
  "indian-airforce": "Indian Air Force Recruitment",
  "state-govt-jobs": "State Government Jobs",
  "up-govt-jobs": "Uttar Pradesh Government Jobs",
  "bihar-govt-jobs": "Bihar Government Jobs",
  "rajasthan-govt-jobs": "Rajasthan Government Jobs",
  "mp-govt-jobs": "Madhya Pradesh Government Jobs",
  "maharashtra-govt-jobs": "Maharashtra Government Jobs",
  "board-exams": "Board Exam Results",
  "cbse-result": "CBSE Result",
  "bseb-result": "Bihar Board (BSEB) Result",
  "up-board-result": "UP Board Result",
  "rbse-result": "RBSE Rajasthan Board Result",
};

const examDescriptions: Record<string, string> = {
  ssc: "Sarkari result SSC 2026: Find latest SSC recruitment notifications, admit cards, answer keys and results for CGL, CHSL, MTS, GD Constable, JE, CPO and Stenographer exams.",
  "ssc-cgl": "SSC CGL Sarkari result 2026: Recruitment notification, online application, eligibility, exam pattern, syllabus, admit card, answer key and result.",
  "ssc-chsl": "SSC CHSL Sarkari result 2026: Combined Higher Secondary Level exam notification, admit card, answer key and result updates.",
  "ssc-mts": "SSC MTS Sarkari result 2026: Multi-Tasking Staff exam notification, application, admit card, answer key and result.",
  "ssc-gd": "SSC GD Constable Sarkari result 2026: Notification, admit card, answer key and result for General Duty exam.",
  upsc: "UPSC Sarkari result 2026: Exam calendar, notification, application, admit card, answer key and result for Civil Services (IAS), NDA, CDS, CAPF and other exams.",
  "upsc-nda": "UPSC NDA Sarkari result 2026: National Defence Academy exam notification, admit card, answer key and result.",
  "upsc-cds": "UPSC CDS Sarkari result 2026: Combined Defence Services exam notification, admit card, answer key and result.",
  railway: "Railway Sarkari result 2026: RRB recruitment notifications for NTPC, ALP, Group D, JE and other posts. Application forms, admit cards and results.",
  "rrb-ntpc": "RRB NTPC Sarkari result 2026: Notification, admit card, answer key and result for Railway NTPC exam.",
  "rrb-alp": "RRB ALP Sarkari result 2026: Assistant Loco Pilot exam notification, admit card, answer key and result.",
  "rrb-group-d": "RRB Group D Sarkari result 2026: Notification, admit card, answer key and result for Group D exam.",
  banking: "Banking Sarkari result 2026: IBPS PO, Clerk, RRB, SBI PO, Clerk and RBI Grade B exam notifications, admit cards, answer keys and results.",
  "ibps-po": "IBPS PO Sarkari result 2026: Probationary Officer exam notification, admit card, answer key and result.",
  "ibps-clerk": "IBPS Clerk Sarkari result 2026: Clerk exam notification, admit card, answer key and result.",
  ctet: "CTET Sarkari result 2026: Central Teacher Eligibility Test notification, application form, exam date, admit card, answer key and result.",
  "state-govt-jobs": "Latest state government Sarkari result and job notifications 2026 for UP, Bihar, Rajasthan, MP, Maharashtra and all Indian states.",
  "board-exams": "Board exam Sarkari result 2026: CBSE, Bihar Board (BSEB), UP Board, Rajasthan Board (RBSE) and other state board results.",
};

function titleCase(slug: string): string {
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateStaticParams() {
  return Object.keys(examNames).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = examNames[slug] || titleCase(slug);
  const desc = examDescriptions[slug] || `Find latest ${name} 2026 updates including notifications, application forms, admit cards, answer keys and results.`;
  return {
    title: `${name} Sarkari Result 2026 - Notification, Admit Card, Answer Key`,
    description: desc,
    alternates: { canonical: `/exam/${slug}` },
    openGraph: { title: `${name} Sarkari Result 2026 | All India Exam Result`, description: desc, images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: `${name} Sarkari Result 2026 | All India Exam Result`, description: desc },
    robots: { index: true, follow: true },
  };
}

import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function ExamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = examNames[slug] || titleCase(slug);
  const desc = examDescriptions[slug] || `Latest ${name} 2026 updates.`;

  const query = slug.replace(/-/g, " ");
  const allItems: PostCard[] = Object.values(sectionItems).flat();
  const filtered = allItems.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase()));

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/exam/${slug}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Exams", item: `${SITE_URL}/exam` },
          { "@type": "ListItem", position: 3, name: name, item: `${SITE_URL}/exam/${slug}` },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/exam/${slug}#page`,
        name: `${name} 2026 — Latest Updates, Result, Admit Card & Answer Key`,
        description: desc,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-IN",
        mainEntity: {
          "@type": "ItemList",
          itemListElement: filtered.slice(0, 10).map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_URL}/post/${p.slug}`,
            name: p.title
          }))
        }
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
                <li><Link href="/exam" className="font-medium transition hover:text-white">Exams</Link></li>
                <ChevronRight className="h-3.5 w-3.5" />
                <li className="font-semibold text-white">{name}</li>
              </ol>
            </nav>
            <p className="text-sm font-bold uppercase tracking-wide text-[#5EEAD4]">Exam Wise Updates</p>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">{name} 2026</h1>
            <p className="mt-3 max-w-2xl text-white/80">{desc}</p>
          </div>
        </div>
        {filtered.length > 0 ? (
          <TableContent title={name} items={filtered} />
        ) : (
          <section className="container-page py-20 text-center">
            <h2 className="text-2xl font-black text-ink">Updates Coming Soon</h2>
            <p className="mt-2 text-slate-500">Latest {name} updates will appear here. Browse other categories.</p>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
