import * as fs from "fs";
import * as path from "path";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { BookmarkBtn } from "@/components/site/bookmark-btn";
import { ShareButtons } from "@/components/site/share-buttons";
import { getPostBySlug, parseDate } from "@/lib/data";
import { CalendarDays, ExternalLink, AlertTriangle, CheckCircle, ChevronRight, BadgeInfo, Banknote, ArrowUpRight, Gauge, Users, Clock, GraduationCap, IndianRupee, FileText, Mail, Download, Bell } from "lucide-react";

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

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: "green" | "red" | "brand" }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-2.5 last:border-0">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className={`text-sm font-bold text-right ${
        highlight === "green" ? "text-emerald-700" :
        highlight === "red" ? "text-red-600" :
        highlight === "brand" ? "text-brand" : "text-gray-800"
      }`}>{value}</span>
    </div>
  );
}

function TableCard({ icon, title, gradient, children }: { icon: React.ReactNode; title: string; gradient?: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className={`px-5 py-4 ${gradient || "border-b border-gray-100 bg-gray-50/80"}`}>
        <h2 className="flex items-center gap-2.5 text-base font-bold text-gray-900">
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

function ExpiryBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700 ring-1 ring-red-200">
      <AlertTriangle className="h-3 w-3" />
      EXPIRED
    </span>
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
          <p className="mt-4 text-gray-500">The page you are looking for does not exist.</p>
        </main>
        <Footer />
      </>
    );
  }

  const title = post.title;
  const publishedDate = post.publishedDate ? parseDate(post.publishedDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }) : new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  const officialUrl = post.importantLinks?.find((l: { label: string; url: string }) =>
    l.label?.toLowerCase().includes("official website") || l.label?.toLowerCase().includes("official site")
  )?.url;
  const catSlug = post.category?.toLowerCase().replace(/\s+/g, "-") || "updates";
  const shortTitle = title.replace(/2026|2025|online\s*form|recruitment|notification|batch|result|admit\s*card|answer\s*key/gi, "").trim().substring(0, 60);

  const faqQ = [
    `How to check ${shortTitle} result?`,
    `What are the important dates for ${shortTitle}?`,
    `What is the direct link to apply for ${shortTitle}?`,
    `What is the official website for ${shortTitle}?`,
  ];
  const faqA = [
    `To check ${shortTitle} result, visit the official website and enter your roll number or registration details. You can also find the direct result link on this page when officially released.`,
    `The important dates for ${shortTitle} include application start date, last date to apply, exam date, admit card release, and result declaration. Check the Important Dates section above for specific dates.`,
    `The direct link to apply for ${shortTitle} is available in the Important Links section above. Click on the "Apply Online" link to fill the application form before the last date.`,
    `The official website for ${shortTitle} is linked in the Important Links section above under "Official Website". Visit it for complete information and updates.`,
  ];
  const faqHiQ = [
    `${shortTitle} का रिजल्ट कैसे देखें?`,
    `${shortTitle} की महत्वपूर्ण तिथियां क्या हैं?`,
    `${shortTitle} में आवेदन करने का सीधा लिंक क्या है?`,
    `${shortTitle} की आधिकारिक वेबसाइट क्या है?`,
  ];
  const faqHiA = [
    `${shortTitle} का रिजल्ट देखने के लिए आधिकारिक वेबसाइट पर जाएं और अपना रोल नंबर या रजिस्ट्रेशन डिटेल्स दर्ज करें। आधिकारिक रूप से जारी होने पर इस पेज पर डायरेक्ट रिजल्ट लिंक भी उपलब्ध होगा।`,
    `${shortTitle} की महत्वपूर्ण तिथियों में आवेदन शुरू होने की तारीख, आवेदन की अंतिम तिथि, परीक्षा तिथि, एडमिट कार्ड जारी होने और रिजल्ट घोषणा शामिल हैं। विशिष्ट तिथियों के लिए ऊपर Important Dates सेक्शन देखें।`,
    `${shortTitle} में आवेदन करने का सीधा लिंक ऊपर Important Links सेक्शन में उपलब्ध है। आवेदन पत्र भरने के लिए अंतिम तिथि से पहले "Apply Online" लिंक पर क्लिक करें।`,
    `${shortTitle} की आधिकारिक वेबसाइट ऊपर Important Links सेक्शन में "Official Website" के तहत लिंक की गई है। पूरी जानकारी और अपडेट के लिए इसे विज़िट करें।`,
  ];

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
      },
      {
        "@type": "FAQPage",
        mainEntity: faqQ.map((q, i) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faqA[i]
          },
          inLanguage: "en"
        })).concat(faqHiQ.map((q, i) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faqHiA[i]
          },
          inLanguage: "hi"
        })))
      }
    ]
  };

  const cleanLinks = (post.importantLinks || []).filter((l: { label: string; url: string | undefined }) =>
    l.url && !l.url.includes("sarkariexam.com") && !l.url.includes("sarkariresult")
  );

  const contentLower = (post.fullContentHtml || "").toLowerCase();
  const titleLower = (post.title || "").toLowerCase();
  const hasCutoffContent = contentLower.includes("cutoff") || contentLower.includes("merit list") || contentLower.includes("cut-off") || titleLower.includes("cutoff") || titleLower.includes("merit");

  function extractLabel(text: string): { label: string; value: string } {
    const idx = text.indexOf(":");
    if (idx === -1) return { label: "", value: text };
    return {
      label: text.substring(0, idx).trim(),
      value: text.substring(idx + 1).trim()
    };
  }

  const summaryDates = (post.importantDates || []).filter((d: string) => {
    const lower = d.toLowerCase();
    return lower.includes("apply") || lower.includes("last date") || lower.includes("exam date") ||
           lower.includes("admit") || lower.includes("result") || lower.includes("fee payment") ||
           lower.includes("correction") || lower.includes("registration");
  }).slice(0, 6);

  function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "").replace(/&#?\w+;/g, " ").replace(/\s+/g, " ").trim();
  }

  const introText = post.intro || (post.fullContentHtml ? stripHtml(post.fullContentHtml).substring(0, 300) : "");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-16">
        <div className="container-page py-4 sm:py-8">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

          <nav aria-label="Breadcrumb" className="mb-6 hidden sm:flex">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <li><Link href="/" className="font-medium transition hover:text-brand">Home</Link></li>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
              <li><Link href={`/${catSlug}`} className="font-medium transition hover:text-brand">{post.category || "Updates"}</Link></li>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
              <li className="max-w-[260px] truncate font-semibold text-gray-800">{title}</li>
            </ol>
          </nav>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

            {/* Main Content */}
            <div className="space-y-6">

              {/* Hero Header */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg shadow-gray-200/40">
                <div className="bg-gradient-to-br from-brand/5 via-brand/[0.02] to-transparent p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand ring-1 ring-brand/20">
                        <BadgeInfo className="h-3 w-3" />
                        {post.category || "Verified Update"}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3.5 py-1 text-xs font-bold text-gray-600">
                        <CalendarDays className="h-3 w-3" />
                        {publishedDate}
                      </span>
                    </div>
                    {post.isExpired && <ExpiryBadge />}
                  </div>

                  <h1 className="mt-5 text-2xl font-black leading-tight text-gray-900 sm:text-3xl lg:text-4xl">{title}</h1>

                  {introText && (
                    <div className="mt-5 rounded-xl border-l-4 border-brand bg-white/80 px-5 py-4 shadow-sm backdrop-blur-sm">
                      <p className="text-sm leading-7 text-gray-700 sm:text-base">{introText}</p>
                    </div>
                  )}

                  {/* Quick Summary Table */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-gray-200 bg-white/90 p-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Key Dates</h3>
                      <div className="space-y-0 divide-y divide-gray-50">
                        {summaryDates.length > 0 ? summaryDates.map((d: string, i: number) => {
                          const { label, value } = extractLabel(d);
                          const lower = d.toLowerCase();
                          let hl: "green" | "red" | "brand" | undefined;
                          if (lower.includes("last date")) hl = post.isExpired ? "red" : "green";
                          else if (lower.includes("apply")) hl = "brand";
                          return <InfoRow key={i} label={label || `Date ${i + 1}`} value={value || d} highlight={hl} />;
                        }) : (
                          <p className="text-sm text-gray-400 py-2">No key dates available</p>
                        )}
                      </div>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white/90 p-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Quick Info</h3>
                      <div className="space-y-0 divide-y divide-gray-50">
                        <InfoRow label="Category" value={post.category || "Update"} />
                        {post.totalVacancies && <InfoRow label="Total Vacancies" value={post.totalVacancies} highlight="brand" />}
                        <InfoRow label="Published" value={publishedDate} />
                        {post.lastDate && (
                          <InfoRow label="Last Date" value={post.lastDate} highlight={post.isExpired ? "red" : "green"} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Dates */}
              {post.importantDates && post.importantDates.length > 0 && (
                <TableCard icon={<CalendarDays className="h-4 w-4" />} title="Important Dates" gradient="border-b border-brand/10 bg-brand/[0.04]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-brand/20">
                          <th className="py-3 pr-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 w-10">#</th>
                          <th className="py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Event</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {post.importantDates.map((d: string, i: number) => {
                          const lower = d.toLowerCase();
                          let badge = "bg-gray-100 text-gray-600";
                          if (lower.includes("last date")) badge = "bg-red-50 text-red-700";
                          else if (lower.includes("apply start") || lower.includes("application start")) badge = "bg-green-50 text-green-700";
                          else if (lower.includes("exam date") || lower.includes("examination")) badge = "bg-orange-50 text-orange-700";
                          else if (lower.includes("admit card")) badge = "bg-purple-50 text-purple-700";
                          else if (lower.includes("result")) badge = "bg-blue-50 text-blue-700";
                          else if (lower.includes("answer key")) badge = "bg-indigo-50 text-indigo-700";
                          else if (lower.includes("correction")) badge = "bg-amber-50 text-amber-700";

                          const label = d.includes(":") ? d.split(":")[0].trim() : "";
                          const value = d.includes(":") ? d.split(":").slice(1).join(":").trim() : d;

                          return (
                            <tr key={i} className="hover:bg-gray-50/50">
                              <td className="py-3 pr-4 align-top">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 text-xs font-black text-brand">{i + 1}</span>
                              </td>
                              <td className="py-3">
                                {label && <span className="text-xs font-bold text-gray-400 uppercase">{label}</span>}
                                <p className={`text-sm leading-6 ${value ? "text-gray-800 font-medium" : "text-gray-600"}`}>{value || d}</p>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </TableCard>
              )}

              {/* Application Fee */}
              {post.applicationFee && post.applicationFee.length > 0 && (
                <TableCard icon={<IndianRupee className="h-4 w-4" />} title="Application Fee" gradient="border-b border-orange-100 bg-orange-50/50">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-orange-200">
                          <th className="py-3 pr-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 w-10">#</th>
                          <th className="py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Category & Fee Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-orange-50">
                        {post.applicationFee.map((f: string, i: number) => {
                          const lower = f.toLowerCase();
                          let catBadge = "bg-gray-100 text-gray-600";
                          if (lower.includes("general") || lower.includes("ur") || lower.includes("ews")) catBadge = "bg-blue-50 text-blue-700";
                          else if (lower.includes("obc")) catBadge = "bg-orange-50 text-orange-700";
                          else if (lower.includes("sc") || lower.includes("st")) catBadge = "bg-purple-50 text-purple-700";
                          else if (lower.includes("female") || lower.includes("women")) catBadge = "bg-pink-50 text-pink-700";
                          else if (lower.includes("ph") || lower.includes("pwd") || lower.includes("handicap")) catBadge = "bg-teal-50 text-teal-700";

                          return (
                            <tr key={i} className="hover:bg-orange-50/30">
                              <td className="py-3 pr-4 align-top">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-black text-orange-600">₹</span>
                              </td>
                              <td className="py-3">
                                <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${catBadge}`}>
                                  {f.includes(":") ? f.split(":")[0].trim() : "All"}
                                </span>
                                <p className="mt-1 text-sm text-gray-700">{f.includes(":") ? f.split(":").slice(1).join(":").trim() : f}</p>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </TableCard>
              )}

              {/* Eligibility / Age Limit / Qualification - extracted from importantDates */}
              {post.importantDates?.filter((d: string) =>
                d.toLowerCase().includes("age") || d.toLowerCase().includes("qualification") || d.toLowerCase().includes("eligible")
              ).length > 0 && (
                <TableCard icon={<GraduationCap className="h-4 w-4" />} title="Eligibility & Age Limit" gradient="border-b border-sky-100 bg-sky-50/50">
                  <div className="divide-y divide-gray-50">
                    {post.importantDates.filter((d: string) =>
                      d.toLowerCase().includes("age") || d.toLowerCase().includes("qualification") || d.toLowerCase().includes("eligible")
                    ).map((d: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-black text-sky-600">
                          <CheckCircle className="h-3.5 w-3.5" />
                        </span>
                        <p className="text-sm leading-6 text-gray-700" dangerouslySetInnerHTML={{ __html: d }} />
                      </div>
                    ))}
                  </div>
                </TableCard>
              )}

              {/* Vacancy Details - extracted from importantDates */}
              {post.importantDates?.filter((d: string) =>
                d.toLowerCase().includes("vacancy") || d.toLowerCase().includes("total post") || d.toLowerCase().includes("total seat")
              ).length > 0 && (
                <TableCard icon={<Users className="h-4 w-4" />} title="Vacancy Details" gradient="border-b border-violet-100 bg-violet-50/50">
                  <div className="divide-y divide-gray-50">
                    {post.importantDates.filter((d: string) =>
                      d.toLowerCase().includes("vacancy") || d.toLowerCase().includes("total post") || d.toLowerCase().includes("total seat")
                    ).map((d: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-black text-violet-600">
                          <Users className="h-3.5 w-3.5" />
                        </span>
                        <p className="text-sm leading-6 text-gray-700" dangerouslySetInnerHTML={{ __html: d }} />
                      </div>
                    ))}
                  </div>
                </TableCard>
              )}

              {/* How to Apply */}
              {post.importantDates?.filter((d: string) =>
                d.toLowerCase().includes("apply") || d.toLowerCase().includes("how to apply")
              ).length > 0 && (
                <TableCard icon={<FileText className="h-4 w-4" />} title="How to Apply" gradient="border-b border-emerald-100 bg-emerald-50/50">
                  <div className="divide-y divide-gray-50">
                    {post.importantDates.filter((d: string) =>
                      d.toLowerCase().includes("apply") || d.toLowerCase().includes("how to apply")
                    ).map((d: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-600">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                        <p className="text-sm leading-6 text-gray-700" dangerouslySetInnerHTML={{ __html: d }} />
                      </div>
                    ))}
                  </div>
                </TableCard>
              )}

              {/* Result Timeline Tracker */}
              {post.importantDates && post.importantDates.length > 0 && (() => {
                const phases = [
                  { label: "Notification", key: "notif", done: true },
                  { label: "Apply Start", key: "apply", done: (post.importantDates || []).some((d: string) => d.toLowerCase().includes("apply") || d.toLowerCase().includes("application")) },
                  { label: "Admit Card", key: "admit", done: (post.importantDates || []).some((d: string) => d.toLowerCase().includes("admit card")) },
                  { label: "Exam Date", key: "exam", done: (post.importantDates || []).some((d: string) => d.toLowerCase().includes("exam date") || d.toLowerCase().includes("examination") || d.toLowerCase().includes("exam")) },
                  { label: "Answer Key", key: "anskey", done: (post.importantDates || []).some((d: string) => d.toLowerCase().includes("answer key")) },
                  { label: "Result", key: "result", done: (post.importantDates || []).some((d: string) => d.toLowerCase().includes("result")) },
                  { label: "Merit", key: "merit", done: false },
                ];
                const doneCount = phases.filter(p => p.done).length;
                return (
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
                      <h2 className="flex items-center gap-2.5 text-base font-bold text-gray-900">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                          <Clock className="h-4 w-4" />
                        </span>
                        Result Timeline
                      </h2>
                    </div>
                    <div className="px-5 py-5">
                      <div className="flex items-center justify-between gap-1 mb-4">
                        {phases.map((p, i) => (
                          <div key={p.key} className="flex flex-col items-center flex-1">
                            <div className="flex items-center w-full">
                              <div className={`h-2 w-full rounded-full ${p.done ? "bg-brand" : "bg-gray-100"}`} />
                              <div className={`shrink-0 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                p.done ? "bg-brand text-white" : "bg-gray-100 text-gray-400"
                              }`}>
                                {p.done ? <CheckCircle className="h-3.5 w-3.5" /> : <span className="text-[10px]">{i + 1}</span>}
                              </div>
                              <div className={`h-2 w-full rounded-full ${i < phases.length - 1 ? (phases[i + 1].done ? "bg-brand" : "bg-gray-100") : "hidden"}`} />
                            </div>
                            <span className={`mt-1.5 text-[10px] font-semibold text-center whitespace-nowrap ${p.done ? "text-brand" : "text-gray-400"}`}>
                              {p.label}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-brand/5 px-4 py-2.5">
                        <span className="text-xs font-medium text-gray-600">Progress</span>
                        <span className="text-sm font-bold text-brand">{doneCount}/{phases.length} completed</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Cutoff & Merit */}
              {hasCutoffContent && (
                <TableCard icon={<Gauge className="h-4 w-4" />} title="Cutoff &amp; Merit List" gradient="border-b border-amber-100 bg-amber-50/50">
                  <div className="space-y-3">
                    {[
                      { cat: "General (UR)", marks: "—", pct: 85, color: "bg-blue-500" },
                      { cat: "OBC", marks: "—", pct: 75, color: "bg-orange-500" },
                      { cat: "EWS", marks: "—", pct: 72, color: "bg-yellow-500" },
                      { cat: "SC", marks: "—", pct: 60, color: "bg-purple-500" },
                      { cat: "ST", marks: "—", pct: 50, color: "bg-teal-500" },
                      { cat: "PwD", marks: "—", pct: 55, color: "bg-pink-500" },
                    ].map((row) => (
                      <div key={row.cat} className="rounded-lg bg-white border border-amber-100 px-4 py-3 hover:border-amber-200 transition">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-semibold text-gray-700">{row.cat}</span>
                          <span className="text-sm font-bold text-gray-900">{row.marks}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-amber-50 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${row.color} transition-all`}
                            style={{ width: `${row.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-gray-400">Cutoff data will be updated when officially released. Check official website for detailed category-wise cutoff.</p>
                </TableCard>
              )}

              {/* Important Links */}
              {cleanLinks.length > 0 && (
                <TableCard icon={<ExternalLink className="h-4 w-4" />} title="Important Links" gradient="border-b border-indigo-100 bg-indigo-50/50">
                  <div className="grid gap-3">
                    {cleanLinks.map((link: { label: string; url: string | undefined }, i: number) => {
                      let linkColor = "from-brand to-indigo-500";
                      const ll = link.label.toLowerCase();
                      if (ll.includes("apply") || ll.includes("registration")) linkColor = "from-emerald-500 to-teal-600";
                      else if (ll.includes("admit") || ll.includes("hall")) linkColor = "from-orange-500 to-amber-600";
                      else if (ll.includes("result")) linkColor = "from-blue-500 to-indigo-600";
                      else if (ll.includes("answer key")) linkColor = "from-purple-500 to-violet-600";
                      else if (ll.includes("syllabus")) linkColor = "from-rose-500 to-pink-600";
                      else if (ll.includes("official")) linkColor = "from-sky-500 to-cyan-600";
                      else if (ll.includes("download")) linkColor = "from-teal-500 to-emerald-600";

                      return (
                        <a
                          key={i}
                          href={link.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                        >
                          <span className="flex items-center gap-3 min-w-0">
                            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${linkColor} text-xs font-black text-white shadow-sm`}>
                              {i + 1}
                            </span>
                            <span className="text-sm font-bold text-gray-700 transition group-hover:text-brand truncate">{link.label}</span>
                          </span>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-gray-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                        </a>
                      );
                    })}
                  </div>
                </TableCard>
              )}

              {/* Official Website CTA */}
              {officialUrl && (
                <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-emerald-700 p-6 shadow-lg sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                        <ExternalLink className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-white">Apply Online</h2>
                        <p className="mt-1 text-sm text-white/80">Visit the official portal to submit your application.</p>
                      </div>
                    </div>
                    <a
                      href={officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black text-brand shadow-lg transition hover:bg-white/90 hover:shadow-xl"
                    >
                      Visit Official Website
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              )}

              {/* FAQ Section */}
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
                  <h2 className="flex items-center gap-2.5 text-base font-bold text-gray-900">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <BadgeInfo className="h-4 w-4" />
                    </span>
                    Frequently Asked Questions (FAQ)
                  </h2>
                </div>
                <div className="divide-y divide-gray-50 px-5">
                  {faqQ.map((q, i) => (
                    <details key={i} className="group py-4 [&[open]>summary_.chevron]:rotate-180">
                      <summary className="flex cursor-pointer items-start justify-between gap-4 text-sm font-semibold text-gray-800 hover:text-brand transition-colors list-none">
                        <span className="flex items-start gap-2">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[10px] font-black text-brand">{i + 1}</span>
                          {q}
                        </span>
                        <ChevronRight className="chevron mt-0.5 h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200" />
                      </summary>
                      <p className="mt-3 text-sm leading-6 text-gray-600 pl-7">{faqA[i]}</p>
                    </details>
                  ))}
                </div>
              </div>

              {/* Notification Section */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-5">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-gray-800">Stay Updated</p>
                    <p className="mt-0.5 text-xs text-gray-500">Bookmark this page and subscribe to notifications for real-time updates on this recruitment.</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                      <span>📌</span>
                      <span>Never miss important updates — we notify you instantly.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              <div className="sticky top-24 space-y-5">
                {/* Notification Subscribe */}
                <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-emerald-700 p-5 text-white shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black">Get Alerts</h3>
                      <p className="text-xs text-white/70">Instant notification for this exam</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="flex-1 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder-white/50 outline-none backdrop-blur-sm focus:border-white/40"
                    />
                    <button className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-brand transition hover:bg-white/90">
                      Subscribe
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-black text-gray-800">Quick Summary</h3>
                  <div className="mt-4 space-y-0">
                    <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                      <span className="text-sm text-gray-500">Category</span>
                      <span className="text-sm font-bold text-gray-800">{post.category || "Update"}</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                      <span className="text-sm text-gray-500">Published</span>
                      <span className="text-sm font-bold text-gray-800">{publishedDate}</span>
                    </div>
                    {post.lastDate && (
                      <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                        <span className="text-sm text-gray-500">Last Date</span>
                        <span className={`text-sm font-bold ${post.isExpired ? "text-red-600" : "text-emerald-600"}`}>
                          {post.lastDate}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Save & Share */}
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Save & Share</h3>
                  <BookmarkBtn slug={slug} title={title} category={post.category || "Update"} date={publishedDate} />
                  <div className="mt-3">
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
