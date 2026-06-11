import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { QuickAccess } from "@/components/site/quick-access";
import { CategoryColumns } from "@/components/site/category-columns";
import { StateGrid } from "@/components/site/state-grid";
import { categorySections, featuredResults } from "@/lib/data";
import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is All India Exam Result?", acceptedAnswer: { "@type": "Answer", text: "All India Exam Result is India's fastest government exam information portal providing verified updates on Sarkari results, job notifications, admit cards, answer keys and admissions." } },
    { "@type": "Question", name: "How often is the data updated?", acceptedAnswer: { "@type": "Answer", text: "Our data is synced every 30 minutes directly from official government sources to ensure you get the latest exam notifications and results." } },
    { "@type": "Question", name: "Is this an official government website?", acceptedAnswer: { "@type": "Answer", text: "No, this is an independent information portal. All data is sourced from publicly available government notifications. We always link to official websites for final verification." } },
    { "@type": "Question", name: "Which exams are covered?", acceptedAnswer: { "@type": "Answer", text: "We cover all major Indian government exams including SSC, UPSC, Railway, Bihar Board, UP Board, CTET, NEET, JEE and state-level exams across all Indian states." } },
    { "@type": "Question", name: "How can I search for specific exams?", acceptedAnswer: { "@type": "Answer", text: "Use our search bar at the top of the page to find any exam, result, or job notification instantly." } },
  ]
};

export default function HomePage() {
  const trending = featuredResults.slice(0, 4);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Header />
      <main>
        <Hero />
        <QuickAccess />

        <section className="py-10">
          <div className="container-page">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#EA580C] to-[#F97316] shadow-md shadow-orange-200">
                  <TrendingUp className="h-5 w-5 text-white" />
                </span>
                <div>
                  <h2 className="text-xl font-black text-ink">Trending Now</h2>
                  <p className="text-sm text-slate-500">Most viewed posts today</p>
                </div>
              </div>
              <Link href="/results" className="hidden items-center gap-1 text-sm font-bold text-[#0D9488] transition hover:gap-1.5 sm:inline-flex">
                View All <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trending.map((post, i) => (
                <Link key={i} href={post.slug ? `/post/${post.slug}` : "#"} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5">
                  <div className={`absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-bl-2xl text-[11px] font-black ${i === 0 ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                    #{i + 1}
                  </div>
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-black text-white shadow-sm ${i === 0 ? "bg-gradient-to-br from-amber-400 to-orange-500" : "bg-slate-300"}`}>{i + 1}</span>
                    <div>
                      <h3 className="text-sm font-bold leading-snug text-slate-800 transition group-hover:text-[#0D9488] line-clamp-2">{post.title}</h3>
                      <p className="mt-1.5 text-xs text-slate-400">{post.category} · {post.date}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="bg-gradient-to-b from-white to-[#f0fdfa]">
          <CategoryColumns sections={categorySections} />
        </div>

        <div className="bg-gradient-to-t from-white to-[#eef2ff]">
          <StateGrid />
        </div>
      </main>
      <Footer />
    </>
  );
}
