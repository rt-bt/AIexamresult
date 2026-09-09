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

import { SeoContentSection } from "@/components/site/seo-content-section";
import { AdUnit } from "@/components/ads/ad-unit";

const QuickAccess = dynamicImport(() => import("@/components/site/quick-access").then(m => m.QuickAccess), { ssr: true });
const CategoryColumns = dynamicImport(() => import("@/components/site/category-columns").then(m => m.CategoryColumns), { ssr: true });

export default function HomePage() {
  const trending = featuredResults.slice(0, 4);
  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* 6 Main Sections: Latest Jobs, Admit Card, Answer Keys, Result, Admissions, Documents */}
        <div className="bg-gradient-to-b from-white to-[#f0fdfa]">
          <CategoryColumns sections={categorySections} />
        </div>

        {/* Homepage Leaderboard Ad */}
        <div className="container-page py-2">
          <AdUnit format="horizontal" />
        </div>

        <QuickAccess />

        {/* Jobs By Qualification Quick Filter */}
        <section className="py-6 border-y border-slate-100 bg-slate-50/50">
          <div className="container-page">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white font-bold text-xs shadow-sm">
                  🎓
                </span>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Govt Jobs by Qualification</h2>
                  <p className="text-xs text-slate-500">Find Sarkari Naukri matching your education</p>
                </div>
              </div>
              <Link href="/latest-jobs" className="text-xs font-bold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1">
                All Vacancies <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
              {[
                { name: "10th Pass", href: "/jobs/10th-pass", color: "hover:border-teal-400 hover:bg-teal-50" },
                { name: "12th Pass", href: "/jobs/12th-pass", color: "hover:border-blue-400 hover:bg-blue-50" },
                { name: "Graduate", href: "/jobs/graduate", color: "hover:border-purple-400 hover:bg-purple-50" },
                { name: "ITI / Diploma", href: "/jobs/iti-diploma", color: "hover:border-amber-400 hover:bg-amber-50" },
                { name: "Police Bharti", href: "/jobs/police-jobs", color: "hover:border-red-400 hover:bg-red-50" },
                { name: "Railway Jobs", href: "/jobs/railway-jobs", color: "hover:border-emerald-400 hover:bg-emerald-50" },
                { name: "Defence Jobs", href: "/jobs/defence-jobs", color: "hover:border-indigo-400 hover:bg-indigo-50" },
                { name: "Teaching Jobs", href: "/jobs/teaching-jobs", color: "hover:border-pink-400 hover:bg-pink-50" },
                { name: "Bank Jobs", href: "/jobs/banking-jobs", color: "hover:border-cyan-400 hover:bg-cyan-50" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 bg-white text-center shadow-xs transition ${item.color} group`}
                >
                  <span className="text-xs font-bold text-slate-800 group-hover:text-slate-900 transition">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Jobs 2026</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

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

        <SeoContentSection />

        <div className="container-page py-4">
          <AdUnit format="horizontal" />
        </div>

        <StateGrid />
      </main>
      <Footer />
    </>
  );
}
