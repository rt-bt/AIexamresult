export const dynamic = "force-dynamic";

import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import dynamicImport from "next/dynamic";
import { NotificationSubscribe } from "@/components/site/nnotification-subscribe";
import { PushNotificationPrompt } from "@/components/push-notification-prompt";
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
    { "@type": "Question", name: "What is Sarkari Result and how to check online?", acceptedAnswer: { "@type": "Answer", text: "Sarkari Result means Indian government exam results. All India Exam Result provides verified sarkari result updates, job alerts, admit cards, answer keys and admissions." } },
    { "@type": "Question", name: "How to get latest Sarkari job alert updates?", acceptedAnswer: { "@type": "Answer", text: "Our data is synced every 30 minutes from official sources. You get real-time sarkari job alerts, rojgar result updates, exam notifications and results." } },
    { "@type": "Question", name: "Is this an official Sarkari result website?", acceptedAnswer: { "@type": "Answer", text: "No, this is an independent information portal. All sarkari result data is sourced from publicly available government notifications. We link to official websites for verification." } },
    { "@type": "Question", name: "Which Sarkari exams are covered for naukri?", acceptedAnswer: { "@type": "Answer", text: "We cover all major sarkari exams: SSC, UPSC, Railway RRB, Banking, Teaching (CTET, UPTET), Defence, state govt jobs and board results across India." } },
    { "@type": "Question", name: "How to search Sarkari exam results and admit cards?", acceptedAnswer: { "@type": "Answer", text: "Use our search bar to find any sarkari exam result, admit card, or job notification instantly. Browse by category or visit exam-specific pages." } },
  ]
};

export default function HomePage() {
  const trending = featuredResults.slice(0, 4);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Header />
      <main>
        <h1 className="sr-only">All India Exam Result - Sarkari Result, Govt Jobs, Admit Card, Answer Key 2026</h1>
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

        <PushNotificationPrompt />

        <section className="border-t border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900 py-16 sm:py-20">
          <div className="container-page">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Frequently Asked Questions</h2>
              <p className="mt-3 text-base text-slate-500 dark:text-slate-400">Quick answers about government exams in India</p>
            </div>
            <div className="mx-auto mt-12 max-w-4xl" itemScope itemType="https://schema.org/FAQPage">
              <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
                {[
                  { q: "What is Sarkari Result and how to check sarkari results online?", a: "Sarkari Result means Indian government exam results. All India Exam Result is India's fastest portal providing verified sarkari result updates, job alerts, admit cards, answer keys and admissions across all Indian government exams." },
                  { q: "How to get latest Sarkari job alert and rojgar result?", a: "Every 30 minutes we sync data from official sources. You get real-time sarkari job alerts, rojgar result updates, exam notifications, admit cards and answer keys on our site." },
                  { q: "How to find SSC CGL Sarkari result or UPSC exam updates?", a: "Use exam-specific pages like /exam/ssc-cgl for SSC CGL sarkari result or /exam/upsc-cse for UPSC exams, or use the search bar at the top." },
                  { q: "Can I download Sarkari admit cards and answer keys here?", a: "Yes, each post includes direct official links to download sarkari admit cards, answer keys and exam results from government websites." },
                  { q: "Which Sarkari exams are covered for government jobs?", a: "All major sarkari exams: SSC, UPSC, Railway RRB, Banking (IBPS, SBI, RBI), Teaching (CTET, UPTET), Defence, State govt jobs, and board results." },
                  { q: "Is this an official Sarkari result website?", a: "No, this is an independent information portal. All sarkari result data is sourced from publicly available government notifications with links to official websites." },
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

        <StateGrid />
      </main>
      <Footer />
    </>
  );
}
