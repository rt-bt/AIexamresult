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
import { TiltCard } from "@/components/unlumen-ui/tilt-card";
import DotField from "@/components/DotField";

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

        {/* 6 Main Sections: Latest Jobs, Admit Card, Answer Keys, Result, Admissions, Documents (Latest Updates) */}
        <div className="relative overflow-hidden bg-gradient-to-b from-white via-[#f0fdfa]/40 to-[#f0fdfa]">
          <DotField
            dotRadius={1.5}
            dotSpacing={14}
            bulgeStrength={67}
            glowRadius={160}
            sparkle={false}
            waveAmplitude={0}
            cursorRadius={500}
            cursorForce={0.1}
            bulgeOnly
            gradientFrom="#0D9488"
            gradientTo="#14B8A6"
            glowColor="#0D9488"
          />
          <div className="relative z-10">
            <CategoryColumns sections={categorySections} />
          </div>
        </div>

        {/* Featured & Trending Alerts with 3D TiltCards */}
        <section className="py-8 bg-gradient-to-b from-teal-50/50 via-white to-slate-50/70 border-b border-slate-200/80">
          <div className="container-page">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#EA580C] to-[#F97316] text-white shadow-md shadow-orange-200">
                  <TrendingUp className="h-5 w-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Trending Now</h2>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100 text-teal-800 animate-pulse">
                      LIVE ALERTS
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500">Most viewed sarkari results &amp; recruitment updates today</p>
                </div>
              </div>
              <Link href="/results" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-800 transition">
                <span>View All Updates</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trending.map((post, i) => {
                const cardConfigs = [
                  {
                    image: "/cards/card-result.svg",
                    badge: "🔥 HOT",
                    variant: "warning" as const,
                    action: "Check Scorecard",
                    accent: "#0D9488",
                  },
                  {
                    image: "/cards/card-job.svg",
                    badge: "⚡ LIVE",
                    variant: "success" as const,
                    action: "Apply Online",
                    accent: "#EA580C",
                  },
                  {
                    image: "/cards/card-admit.svg",
                    badge: "✨ NEW",
                    variant: "success" as const,
                    action: "Download Hall Ticket",
                    accent: "#4F46E5",
                  },
                  {
                    image: "/cards/card-key.svg",
                    badge: "📈 TRENDING",
                    variant: "warning" as const,
                    action: "View Answer Key",
                    accent: "#7C3AED",
                  },
                ];

                const cfg = cardConfigs[i % cardConfigs.length];

                return (
                  <TiltCard
                    key={post.slug || i}
                    title={post.title}
                    description={`${post.category} · ${post.date || "Active Update"}`}
                    category={post.category || "Govt Exam"}
                    price={`#${i + 1}`}
                    badgeLabel={cfg.badge}
                    badgeVariant={cfg.variant}
                    actionText={cfg.action}
                    accentColor={cfg.accent}
                    imageSrc={cfg.image}
                    imageAlt={post.title}
                    href={post.slug ? `/post/${post.slug}` : "#"}
                  />
                );
              })}
            </div>
          </div>
        </section>

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
