export const dynamic = "force-dynamic";

import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import dynamicImport from "next/dynamic";
import { NotificationSubscribe } from "@/components/site/nnotification-subscribe";
import { StateGrid } from "@/components/site/state-grid";
import { categorySections, featuredResults } from "@/lib/data";
import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";

const QuickAccess = dynamicImport(() => import("@/components/site/quick-access").then(m => m.QuickAccess), { ssr: true });
const CategoryColumns = dynamicImport(() => import("@/components/site/category-columns").then(m => m.CategoryColumns), { ssr: true });

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

        {/* 6 Main Sections: Latest Jobs, Admit Card, Answer Keys, Result, Admissions, Documents */}
        <div className="bg-gradient-to-b from-white to-[#f0fdfa]">
          <CategoryColumns sections={categorySections} />
        </div>

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

        <NotificationSubscribe />

        <section className="border-t border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900 py-16 sm:py-20">
          <div className="container-page">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Frequently Asked Questions</h2>
              <p className="mt-3 text-base text-slate-500 dark:text-slate-400">Quick answers about government exams in India</p>
            </div>
            <div className="mx-auto mt-12 max-w-4xl" itemScope itemType="https://schema.org/FAQPage">
              <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
                {[
                  { q: "What is All India Exam Result?", a: "India's fastest government exam information portal providing verified updates on Sarkari results, job notifications, admit cards, answer keys and admissions across SSC, UPSC, Railway, Banking, State exams and board results." },
                  { q: "How often is exam data updated?", a: "Every 30 minutes directly from official government sources to ensure you get the latest exam notifications, results, admit cards and answer keys." },
                  { q: "How do I find SSC CGL or UPSC updates?", a: "Use exam-specific pages like /exam/ssc-cgl for SSC CGL or /exam/upsc-cse for UPSC Civil Services, or use the search bar at the top of the page." },
                  { q: "Can I download admit cards here?", a: "Yes, each post page includes direct official links to download admit cards, answer keys and results from government commission websites." },
                  { q: "Which exams does this site cover?", a: "All major exams: SSC, UPSC, Railway RRB, Banking (IBPS, SBI, RBI), Teaching (CTET, UPTET), Defence, State govt jobs, and board results." },
                  { q: "Is this an official government site?", a: "No, this is an independent information portal. All data is sourced from publicly available government notifications with links to official websites." },
                ].map((faq, i) => (
                  <div key={i} itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                    <h3 itemProp="name" className="text-[15px] font-semibold leading-6 text-slate-900 dark:text-white">{faq.q}</h3>
                    <div className="mt-2" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                      <p itemProp="text" className="text-sm leading-6 text-slate-500 dark:text-slate-400">{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="bg-gradient-to-t from-white to-[#eef2ff]">
          <StateGrid />
        </div>
      </main>
      <Footer />
    </>
  );
}
