export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SectionContent } from "@/components/site/section-content";
import { sectionItems } from "@/lib/data";
import type { PostCard } from "@/lib/data";

export const metadata: Metadata = {
  title: "All Updates",
  description: "Browse all government exam updates in one place — results, admit cards, job notifications, answer keys, admissions and documents. Verified from official sources.",
  alternates: { canonical: "/results" },
  openGraph: { title: "All Updates | All India Exam Result", description: "All government exam updates in one place." }
};

export default function ResultsPage() {
  const allItems: PostCard[] = Object.values(sectionItems).flat();

  return (
    <>
      <Header />
      <main>
        <div className="bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#115E59] py-16">
          <div className="container-page">
            <p className="text-sm font-bold uppercase tracking-wide text-[#5EEAD4]">All India Exam Result</p>
            <h1 className="mt-3 text-4xl font-black text-white">All Updates</h1>
            <p className="mt-3 max-w-2xl text-white/80">
              Every government exam update across all categories in one place. Results, jobs, admit cards, answer keys, admissions and more.
            </p>
          </div>
        </div>
        <SectionContent title="All Updates" items={allItems} />
      </main>
      <Footer />
    </>
  );
}
