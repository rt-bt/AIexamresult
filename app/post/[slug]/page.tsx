import * as fs from "fs";
import * as path from "path";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { BookmarkBtn } from "@/components/site/bookmark-btn";
import { ShareButtons } from "@/components/site/share-buttons";
import { getPostBySlug } from "@/lib/data";

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

  return (
    <>
      <Header />
      <main className="container-page py-4 sm:py-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 transition hover:text-brand lg:hidden mb-3">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back to Home
        </Link>
        <nav aria-label="Breadcrumb" className="hidden sm:flex text-sm font-semibold text-slate-500">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link href="/" className="hover:text-brand transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/${catSlug}`} className="hover:text-brand transition-colors">{post.category || "Updates"}</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-slate-800 truncate max-w-[200px] sm:max-w-[400px]">{title}</li>
          </ol>
        </nav>
        <article className="mt-5 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/50 dark:border-white/10 dark:bg-white/10">
            <div className="bg-gradient-to-r from-brand/5 via-transparent to-transparent p-6 sm:p-8 lg:p-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-brand ring-1 ring-brand/20">{post.category || "Verified Update"}</span>
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-ink dark:text-white">{title}</h1>

              {post.publishedDate && (
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                  Published: {new Date(post.publishedDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              )}

              {post.intro && (
                <div className="mt-6 rounded-2xl border-l-4 border-brand bg-brand/5 px-5 py-4">
                  <p className="text-base sm:text-lg leading-7 sm:leading-8 text-slate-700 dark:text-slate-300">{post.intro}</p>
                </div>
              )}
            </div>

            <div className="space-y-6 px-6 sm:px-8 lg:px-10 pb-8 sm:pb-10">
              {post.importantDates && post.importantDates.length > 0 && (
                <section>
                  <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-black text-ink">
                    <svg className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                    Important Dates
                  </h2>
                  <div className="mt-4 space-y-3">
                    {post.importantDates.map((d: string, i: number) => (
                      <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5">
                        <p className="text-slate-700 dark:text-slate-300 leading-6" dangerouslySetInnerHTML={{ __html: d }} />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {post.applicationFee && post.applicationFee.length > 0 && (
                <section>
                  <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-black text-ink">
                    <svg className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    Application Fee
                  </h2>
                  <div className="mt-4 space-y-3">
                    {post.applicationFee.map((f: string, i: number) => (
                      <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5">
                        <p className="text-slate-700 dark:text-slate-300 leading-6" dangerouslySetInnerHTML={{ __html: f }} />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {(() => {
                const cleanLinks = (post.importantLinks || []).filter((l: { label: string; url: string | undefined }) =>
                  l.url && !l.url.includes("sarkariexam.com") && !l.url.includes("sarkariresult")
                );
                return cleanLinks.length > 0 ? (
                  <section>
                    <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-black text-ink">
                      <svg className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                      Important Links
                    </h2>
                    <div className="mt-4 grid gap-3">
                      {cleanLinks.map((link: { label: string; url: string | undefined }, i: number) => (
                        <a key={i} href={link.url || "#"} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 font-bold text-brand shadow-sm transition hover:border-brand/30 hover:shadow-md dark:border-white/10 dark:bg-white/5">
                          <span className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand text-sm font-black">{i + 1}</span>
                            <span>{link.label}</span>
                          </span>
                          <span className="flex items-center gap-1 text-xs font-semibold text-slate-400 transition group-hover:translate-x-1">
                            Click Here <span aria-hidden="true">&rarr;</span>
                          </span>
                        </a>
                      ))}
                    </div>
                  </section>
                ) : null;
              })()}

              {officialUrl && (
                <section className="rounded-2xl bg-gradient-to-br from-brand/10 to-transparent p-6 sm:p-8">
                  <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-black text-ink">
                    <svg className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" /></svg>
                    Official Website
                  </h2>
                  <a href={officialUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-black text-white shadow-lg shadow-brand/30 transition hover:bg-[#0F766E] hover:shadow-xl hover:shadow-brand/40">
                    Visit Official Website
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 17l9.2-9.2M17 17V7H7" /></svg>
                  </a>
                </section>
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl bg-ink p-5 text-white">
              <h3 className="text-xl font-black">Join Telegram</h3>
              <p className="mt-2 text-sm text-slate-300">Get instant exam alerts and result notices.</p>
              <a href="https://t.me/AllIndiaExamResult" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-black text-ink transition hover:bg-white/90">Join Channel</a>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/10">
              <h3 className="font-black">Save</h3>
              <div className="mt-3">
                <BookmarkBtn slug={slug} title={title} category={post.category || "Update"} date={publishedDate} />
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/10">
              <h3 className="font-black">Share</h3>
              <div className="mt-3">
                <ShareButtons title={title} url={`${SITE_URL}/post/${slug}`} />
              </div>
            </div>
          </aside>
        </article>
      </main>
      <Footer />
    </>
  );
}
