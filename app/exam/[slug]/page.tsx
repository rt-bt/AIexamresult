import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SectionContent } from "@/components/site/section-content";
import { sectionItems } from "@/lib/data";
import type { PostCard } from "@/lib/data";

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
  ssc: "Find latest SSC recruitment 2026 notifications, admit cards, answer keys and results for CGL, CHSL, MTS, GD Constable, JE, CPO and Stenographer exams.",
  "ssc-cgl": "SSC CGL 2026 recruitment notification, online application, eligibility, exam pattern, syllabus, admit card, answer key and result.",
  upsc: "UPSC 2026 exam calendar, notification, application, admit card, answer key and result for Civil Services (IAS), NDA, CDS, CAPF and other exams.",
  railway: "Railway recruitment 2026 notifications for RRB NTPC, ALP, Group D, JE and other posts. Application forms, admit cards and results.",
  banking: "Banking exam 2026 notifications for IBPS PO, Clerk, RRB, SBI PO, Clerk and RBI Grade B. Apply online, download admit cards.",
  ctet: "CTET 2026 notification, application form, exam date, admit card, answer key and result. Central Teacher Eligibility Test updates.",
  "state-govt-jobs": "Latest state government job notifications 2026 for UP, Bihar, Rajasthan, MP, Maharashtra and all Indian states.",
  "board-exams": "Board exam results 2026 for CBSE, Bihar Board (BSEB), UP Board, Rajasthan Board (RBSE) and other state boards.",
};

function titleCase(slug: string): string {
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export async function generateStaticParams() {
  return Object.keys(examNames).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = examNames[slug] || titleCase(slug);
  const desc = examDescriptions[slug] || `Find latest ${name} 2026 updates including notifications, application forms, admit cards, answer keys and results.`;
  return {
    title: `${name} 2026 - Notification, Admit Card, Answer Key, Result`,
    description: desc,
    alternates: { canonical: `/exam/${slug}` },
    openGraph: { title: `${name} 2026 | All India Exam Result`, description: desc },
  };
}

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
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.aiexamresult.com" },
          { "@type": "ListItem", position: 2, name: "Exams", item: "https://www.aiexamresult.com/exam" },
          { "@type": "ListItem", position: 3, name: name, item: `https://www.aiexamresult.com/exam/${slug}` },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `https://www.aiexamresult.com/exam/${slug}#page`,
        name: `${name} 2026 — Latest Updates, Result, Admit Card & Answer Key`,
        description: desc,
        isPartOf: { "@id": "https://www.aiexamresult.com/#website" },
        about: { "@id": "https://www.aiexamresult.com/#organization" },
        inLanguage: "en-IN",
        mainEntity: {
          "@type": "ItemList",
          itemListElement: filtered.slice(0, 10).map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `https://www.aiexamresult.com/post/${p.slug}`,
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
            <p className="text-sm font-bold uppercase tracking-wide text-[#5EEAD4]">Exam Wise Updates</p>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">{name} 2026</h1>
            <p className="mt-3 max-w-2xl text-white/80">{desc}</p>
          </div>
        </div>
        {filtered.length > 0 ? (
          <SectionContent title={name} items={filtered} />
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
