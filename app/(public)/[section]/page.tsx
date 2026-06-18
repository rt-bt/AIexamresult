import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SectionContent } from "@/components/site/section-content";
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

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  const title = sections[section] ?? "Updates";
  const descs: Record<string, string> = {
    results: "Sarkari result 2026: Find latest government exam results including SSC, UPSC, Railway, UP Board, Bihar Board and more. Verified result updates with direct official links.",
    "latest-jobs": "Sarkari naukri 2026: Latest government job notifications, central and state government vacancies, application forms, eligibility criteria and important dates for sarkari exam.",
    "admit-card": "Download sarkari admit cards for upcoming government exams 2026. Get hall tickets for SSC, Railway, UPSC, state exams with direct official links.",
    "answer-key": "Download official sarkari answer keys for government exams 2026. Raise objections, check expected scores and calculate marks for SSC, Railway, UPSC.",
    admissions: "University and college admission notifications 2026. Find entrance exam dates, application forms, merit lists and counselling schedules.",
    syllabus: "Exam syllabus and preparation resources for SSC, UPSC, Railway, Banking and state government sarkari exams 2026.",
  };
  const desc = descs[section] || `${title} updates with verified official links, important dates and eligibility details.`;
  return {
    title,
    description: desc,
    alternates: { canonical: `/${section}` },
    openGraph: { title: `Sarkari Result ${title} 2026 | All India Exam Result`, description: desc, url: `${SITE_URL}/${section}`, images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: `Sarkari ${title} 2026 | All India Exam Result`, description: desc },
    robots: { index: true, follow: true }
  };
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const title = sections[section] ?? "Updates";
  const informational = ["contact", "about", "privacy-policy", "disclaimer"].includes(section);
  const items = sectionItems[section];
  const h1Prefix = ["results", "admit-card", "answer-key", "latest-jobs"].includes(section) ? "Sarkari " : "";

  return (
    <>
      <Header />
      <main>
        <div className="bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#115E59] py-16">
          <div className="container-page">
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
          <SectionContent title={title} items={items} />
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
