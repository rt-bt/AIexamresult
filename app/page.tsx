import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { QuickAccess } from "@/components/site/quick-access";
import { NotificationSubscribe } from "@/components/site/nnotification-subscribe";
import { CategoryColumns } from "@/components/site/category-columns";
import { StateGrid } from "@/components/site/state-grid";
import { categorySections, featuredResults, latestJobs } from "@/lib/data";
import Link from "next/link";
import { ArrowUpRight, TrendingUp, Clock, Sparkles } from "lucide-react";

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

        {/* Latest Updates — mobile only, right after hero */}
        <section className="lg:hidden -mt-4 pb-2">
          <div className="container-page">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#EA580C] to-[#F97316]">
                <Sparkles className="h-4 w-4 text-white" />
              </span>
              <h2 className="text-sm font-black text-ink">Latest Updates</h2>
              <span className="ml-auto text-[10px] text-slate-400 font-medium"><Clock className="h-3 w-3 inline mr-0.5" />Just now</span>
            </div>
            <div className="space-y-2">
              {latestJobs.slice(0, 6).map((post, i) => (
                <Link key={i} href={post.slug ? `/post/${post.slug}` : "#"} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm active:scale-[0.98] transition touch-manipulation">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-emerald-600 text-xs font-black text-white shadow-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold leading-snug text-slate-800 line-clamp-2">{post.title}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{post.category}{post.date ? ` · ${post.date}` : ""}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-[9px] font-bold text-brand">New</span>
                </Link>
              ))}
            </div>
            <Link href="/results" className="mt-2 flex items-center justify-center gap-1 rounded-xl border border-brand/20 bg-brand/5 py-2.5 text-xs font-bold text-brand active:scale-[0.98] transition touch-manipulation">
              View All Updates <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

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

        <NotificationSubscribe />

        <section className="bg-gradient-to-b from-white to-[#f0fdfa] py-12">
          <div className="container-page">
            <h2 className="text-center text-2xl font-black text-ink">Frequently Asked Questions</h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-slate-500">Quick answers about government exams in India</p>
            <div className="mx-auto mt-8 grid max-w-3xl gap-4" itemScope itemType="https://schema.org/FAQPage">
              {[
                { q: "What is All India Exam Result?", a: "All India Exam Result is India's fastest government exam information portal providing verified updates on Sarkari results, job notifications, admit cards, answer keys and admissions across SSC, UPSC, Railway, Banking, State exams and board results." },
                { q: "How often is exam data updated?", a: "Our data is synced every 30 minutes directly from official government sources to ensure you get the latest exam notifications, results, admit cards and answer keys." },
                { q: "How can I find SSC CGL or UPSC exam updates?", a: "Use our exam-specific pages: /exam/ssc-cgl for SSC CGL, /exam/upsc-cse for UPSC Civil Services, /exam/rrb-ntpc for Railway NTPC, or use the search bar at the top." },
                { q: "Can I download admit cards and answer keys?", a: "Yes, each post includes direct official links to download admit cards, answer keys and results. We link to the respective government commission websites." },
                { q: "Which government exams are covered?", a: "We cover SSC (CGL, CHSL, MTS, GD, JE, CPO), UPSC (IAS, NDA, CDS), Railway (RRB NTPC, ALP, Group D), Banking (IBPS, SBI, RBI), Teaching (CTET, UPTET), Defence (Army, Navy, Air Force), State govt jobs and board exam results." },
                { q: "Is this an official government website?", a: "No, this is an independent information portal. All data is sourced from publicly available government notifications. We always link to official websites for final verification." },
              ].map((faq, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <h3 itemProp="name" className="font-bold text-slate-800">{faq.q}</h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p itemProp="text" className="mt-2 text-sm leading-6 text-slate-500">{faq.a}</p>
                  </div>
                </div>
              ))}
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
