import * as fs from "fs";
import * as path from "path";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { BookmarkBtn } from "@/components/site/bookmark-btn";
import { ShareButtons } from "@/components/site/share-buttons";
import { getPostBySlug } from "@/lib/data";
import { CalendarDays, Clock, ExternalLink, AlertTriangle, CheckCircle, ChevronRight, BadgeInfo, Banknote, ArrowUpRight } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aiexamresult.com";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostDetail(slug);
  if (!post) return { title: "Post not found" };
  const cat = post.category || "Government Exam";
  const desc = post.intro ? post.intro.substring(0, 160) : `Latest ${cat} update with important dates, application fee and official links.`;
  return {
    title: `${post.title} - ${cat}`,
    description: desc,
    alternates: { canonical: `/post/${slug}` },
    openGraph: {
      title: `${post.title} - ${cat} 2026`,
      description: desc,
      type: "article",
      publishedTime: post.publishedDate,
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }]
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} - ${cat}`,
      description: desc,
    },
    robots: { index: true, follow: true }
  };
}

async function getPostDetail(slug: string) {
  const summary = getPostBySlug(slug);
  if (!summary) return null;
  try {
    const filePath = path.join(process.cwd(), "data", "posts", `${slug}.json`);
    if (fs.existsSync(filePath)) {
      let raw = fs.readFileSync(filePath, "utf-8");
      if (raw.charCodeAt(0) === 0xFEFF) raw = raw.substring(1);
      return JSON.parse(raw);
    }
  } catch {}
  return null;
}

function DateBadge({ label, date, isExpired }: { label: string; date: string; isExpired?: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border p-4 ${isExpired ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"}`}>
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isExpired ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
        {isExpired ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className={`text-sm font-bold ${isExpired ? "text-red-700" : "text-emerald-700"}`}>{date}</p>
      </div>
      {isExpired && (
        <span className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-black text-red-700 ring-1 ring-red-200">Expired</span>
      )}
    </div>
  );
}

function SectionCard({ icon, title, children, gradient }: { icon: React.ReactNode; title: string; children: React.ReactNode; gradient?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className={`px-5 py-4 ${gradient || "border-b border-slate-100 bg-slate-50"}`}>
        <h2 className="flex items-center gap-2.5 text-lg font-black text-slate-800">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">{icon}</span>
          {title}
        </h2>
      </div>
      <div className="px-5 py-4">
        {children}
      </div>
    </div>
  );
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostDetail(slug);

  if (!post) {
    return (
      <>
        <Header />
        <main className="container-page py-20 text-center">
          <h1 className="text-4xl font-black">Post not found</h1>
          <p className="mt-4 text-slate-500">The page you are looking for does not exist.</p>
        </main>
        <Footer />
      </>
    );
  }

  const title = post.title;
  const publishedDate = post.publishedDate ? new Date(post.publishedDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }) : new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  const officialUrl = post.importantLinks?.find((l: { label: string; url: string }) =>
    l.label?.toLowerCase().includes("official website") || l.label?.toLowerCase().includes("official site")
  )?.url;
  const catSlug = post.category?.toLowerCase().replace(/\s+/g, "-") || "updates";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: post.category || "Updates", item: `${SITE_URL}/${catSlug}` },
          { "@type": "ListItem", position: 3, name: title }
        ]
      },
      {
        "@type": "Article",
        headline: title,
        datePublished: post.publishedDate,
        author: { "@type": "Organization", name: "All India Exam Result" },
        publisher: { "@type": "Organization", name: "All India Exam Result" },
        mainEntityOfPage: `${SITE_URL}/post/${slug}`,
        image: `${SITE_URL}/og-image.png`
      }
    ]
  };

  const cleanLinks = (post.importantLinks || []).filter((l: { label: string; url: string | undefined }) =>
    l.url && !l.url.includes("sarkariexam.com") && !l.url.includes("sarkariresult")
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-16">
        <div className="container-page py-4 sm:py-8">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

          <nav aria-label="Breadcrumb" className="mb-6 hidden sm:flex">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <li><Link href="/" className="font-medium transition hover:text-brand">Home</Link></li>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
              <li><Link href={`/${catSlug}`} className="font-medium transition hover:text-brand">{post.category || "Updates"}</Link></li>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
              <li className="max-w-[260px] truncate font-semibold text-slate-800">{title}</li>
            </ol>
          </nav>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

            {/* Main Content */}
            <div className="space-y-6">

              {/* Hero Card */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40">
                <div className="bg-gradient-to-br from-brand/5 via-brand/[0.02] to-transparent p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand ring-1 ring-brand/20">
                      <BadgeInfo className="h-3 w-3" />
                      {post.category || "Verified Update"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold text-slate-600">
                      <CalendarDays className="h-3 w-3" />
                      {publishedDate}
                    </span>
                  </div>

                  <h1 className="mt-5 text-2xl font-black leading-tight text-slate-900 sm:text-3xl lg:text-4xl">{title}</h1>

                  {post.lastDate && (
                    <div className="mt-5 space-y-3">
                      <DateBadge label="Last Date to Apply" date={post.lastDate} isExpired={post.isExpired} />
                    </div>
                  )}

                  {post.intro && (
                    <div className="mt-6 rounded-xl border-l-4 border-brand bg-white/80 px-5 py-4 shadow-sm backdrop-blur-sm">
                      <p className="text-base leading-7 text-slate-700 sm:text-lg">{post.intro}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Important Dates */}
              {post.importantDates && post.importantDates.length > 0 && (
                <SectionCard icon={<CalendarDays className="h-4 w-4" />} title="Important Dates" gradient="border-b border-brand/10 bg-brand/[0.04]">
                  <div className="divide-y divide-slate-100">
                    {post.importantDates.map((d: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                        <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-black text-brand">{i + 1}</span>
                        <p className="text-sm leading-6 text-slate-700" dangerouslySetInnerHTML={{ __html: d }} />
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Application Fee */}
              {post.applicationFee && post.applicationFee.length > 0 && (
                <SectionCard icon={<Banknote className="h-4 w-4" />} title="Application Fee" gradient="border-b border-orange-100 bg-orange-50/50">
                  <div className="divide-y divide-slate-100">
                    {post.applicationFee.map((f: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                        <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-black text-orange-600">₹</span>
                        <p className="text-sm leading-6 text-slate-700" dangerouslySetInnerHTML={{ __html: f }} />
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Important Links */}
              {cleanLinks.length > 0 && (
                <SectionCard icon={<ExternalLink className="h-4 w-4" />} title="Important Links" gradient="border-b border-indigo-100 bg-indigo-50/50">
                  <div className="grid gap-3">
                    {cleanLinks.map((link: { label: string; url: string | undefined }, i: number) => (
                      <a
                        key={i}
                        href={link.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                      >
                        <span className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-indigo-500 text-xs font-black text-white shadow-sm">{i + 1}</span>
                          <span className="text-sm font-bold text-slate-700 transition group-hover:text-brand">{link.label}</span>
                        </span>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                      </a>
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Official Website CTA */}
              {officialUrl && (
                <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-emerald-700 p-6 shadow-lg sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-black text-white">Official Website</h2>
                      <p className="mt-1 text-sm text-white/80">Visit the official portal for detailed information and online application.</p>
                    </div>
                    <a
                      href={officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black text-brand shadow-lg transition hover:bg-white/90 hover:shadow-xl"
                    >
                      Visit Now
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              <div className="sticky top-24 space-y-5">
                {/* Telegram Card */}
                <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E3A5F] to-[#0D2137] p-5 text-white shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    </div>
                    <div>
                      <h3 className="text-base font-black">Telegram</h3>
                      <p className="text-xs text-slate-300">Instant exam alerts</p>
                    </div>
                  </div>
                  <a href="https://t.me/aiexamresults" target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-3 text-sm font-bold backdrop-blur-sm transition hover:bg-white/25">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    Join Channel
                  </a>
                </div>

                {/* Quick Stats */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-black text-slate-800">Quick Info</h3>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Category</span>
                      <span className="font-bold text-slate-800">{post.category || "Update"}</span>
                    </div>
                    <div className="h-px bg-slate-100" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Published</span>
                      <span className="font-bold text-slate-800">{publishedDate}</span>
                    </div>
                    {post.lastDate && (
                      <>
                        <div className="h-px bg-slate-100" />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Last Date</span>
                          <span className={`font-bold ${post.isExpired ? "text-red-600" : "text-emerald-600"}`}>
                            {post.lastDate} {post.isExpired ? "(Expired)" : ""}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Save & Share */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <BookmarkBtn slug={slug} title={title} category={post.category || "Update"} date={publishedDate} />
                    <div className="h-8 w-px bg-slate-200" />
                    <ShareButtons title={title} url={`${SITE_URL}/post/${slug}`} />
                  </div>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
