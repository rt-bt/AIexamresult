export const dynamic = "force-dynamic";

import * as fs from "fs";
import * as path from "path";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { BookmarkBtn } from "@/components/site/bookmark-btn";
import { ShareButtons } from "@/components/site/share-buttons";
import { getPostBySlug, parseDate, sectionItems } from "@/lib/data";
import { CalendarDays, ExternalLink, AlertTriangle, CheckCircle, ChevronRight, BadgeInfo, Banknote, ArrowUpRight, Gauge, Users, Clock, GraduationCap, IndianRupee, FileText, Mail, Download, Bell } from "lucide-react";
import { AdUnit } from "@/components/ads/ad-unit";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aiexamresult.com";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostDetail(slug);
  if (!post) return { title: "Post not found" };

  const title = (post.title || "").trim();
  const cat = post.category || "Government Exam";
  const tLower = title.toLowerCase();
  const catLower = cat.toLowerCase();

  // Intent-targeted suffix for top search engine match
  let intentSuffix = "";
  if (catLower.includes("job") || tLower.includes("recruitment") || tLower.includes("vacancy") || tLower.includes("apply") || tLower.includes("online form")) {
    intentSuffix = tLower.includes("online form") ? "Apply Online" : "Online Form 2026, Notification PDF";
  } else if (catLower.includes("admit") || tLower.includes("admit card") || tLower.includes("hall ticket")) {
    intentSuffix = "Admit Card 2026 Download Link";
  } else if (catLower.includes("result") || tLower.includes("result") || tLower.includes("score")) {
    intentSuffix = "Result 2026 Direct Link, Scorecard";
  } else if (catLower.includes("answer") || tLower.includes("answer key")) {
    intentSuffix = "Answer Key 2026 Objection Link";
  } else if (catLower.includes("syllabus")) {
    intentSuffix = "Syllabus & Exam Pattern 2026 PDF";
  } else if (catLower.includes("admission")) {
    intentSuffix = "Admission Online Form 2026";
  }

  const hasYear = /202[4-9]|203\d/.test(title);
  const yearStr = hasYear ? "" : " 2026";
  const seoTitle = intentSuffix
    ? `${title}${yearStr} : ${intentSuffix} - Sarkari Result | Sarkari Exam`
    : `${title}${yearStr} - Sarkari Result | Sarkari Exam`;

  // Build high-CTR meta description (strip any adinserter / shortcodes)
  let rawIntro = (post.intro || "").replace(/\[adinserter[^\]]*\]/gi, "").replace(/<[^>]*>/g, "").trim();
  let desc = "";

  if (rawIntro.length > 50) {
    desc = rawIntro.substring(0, 150).replace(/\s+\S*$/, "") + "… Check full notification & apply at Sarkari Result.";
  } else {
    const dateHint = post.importantDates?.find((d: string) =>
      /last|apply|exam date|admit/i.test(d)
    );
    const dateStr = dateHint ? " " + dateHint.replace(/^.*?:/, "").trim() + "." : ".";
    if (intentSuffix.includes("Online Form") || catLower.includes("job")) {
      desc = `${title}: Check eligibility criteria, age limit, application fee, last date to apply${dateStr} Download official notification PDF at Sarkari Result | Sarkari Exam.`;
    } else if (intentSuffix.includes("Admit Card") || catLower.includes("admit")) {
      desc = `${title}: Download Sarkari admit card, check exam date, reporting time & exam city slip${dateStr} Direct login link at Sarkari Result | Sarkari Exam.`;
    } else if (intentSuffix.includes("Result") || catLower.includes("result")) {
      desc = `${title}: Check Sarkari result, download scorecard, cut-off marks & qualifying merit list${dateStr} Direct official link at Sarkari Result | Sarkari Exam.`;
    } else {
      desc = `${title}: Check important dates, application fee, eligibility & official direct links${dateStr} Complete details at Sarkari Result | Sarkari Exam.`;
    }
  }

  if (desc.length > 165) desc = desc.substring(0, 160) + "…";

  // Absolute canonical URL
  const canonicalUrl = `${SITE_URL}/post/${slug}`;

  // Dynamic 1200x630 Feature Image for Google Discover & Social sharing
  const publishedDateStr = post.publishedDate ? post.publishedDate.split("T")[0] : "2026";
  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&cat=${encodeURIComponent(cat)}&date=${encodeURIComponent(publishedDateStr)}`;

  return {
    title: seoTitle,
    description: desc,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: seoTitle,
      description: desc,
      type: "article",
      url: canonicalUrl,
      publishedTime: post.publishedDate || undefined,
      modifiedTime: post.lastDate || post.publishedDate || undefined,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title, type: "image/png" }],
      siteName: "All India Exam Result",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: desc,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      }
    },
  };
}

const GITHUB_RAW = "https://raw.githubusercontent.com/rt-bt/AIexamresult/master/data/posts";

async function getPostDetail(slug: string) {
  // Try local filesystem first (works in local dev)
  try {
    const filePath = path.join(process.cwd(), "data", "posts", `${slug}.json`);
    if (fs.existsSync(filePath)) {
      let raw = fs.readFileSync(filePath, "utf-8");
      if (raw.charCodeAt(0) === 0xFEFF) raw = raw.substring(1);
      return JSON.parse(raw);
    }
  } catch {}
  // Fallback: fetch from GitHub raw content (works on Vercel where files are excluded)
  try {
    const res = await fetch(`${GITHUB_RAW}/${encodeURIComponent(slug)}.json`, {
      next: { revalidate: 3600 }, // cache for 1 hour
    });
    if (res.ok) {
      const text = await res.text();
      return JSON.parse(text.charCodeAt(0) === 0xFEFF ? text.substring(1) : text);
    }
  } catch {}
  return null;
}

function extractDatesFromHtml(html: string): string[] {
  const dates: string[] = [];
  const patterns = [
    /<strong>Important Dates<\/strong>[\s\S]*?<\/h[234]>([\s\S]*?)(?=<\/ul>)/gi,
    /<h[234][^>]*>\s*Important Dates\s*<\/h[234]>\s*<ul[^>]*>([\s\S]*?)<\/ul>/gi,
    /<h[234][^>]*>\s*<strong>Important Dates[^<]*<\/strong>\s*<\/h[234]>\s*<div[^>]*>([\s\S]*?)<\/ul>/gi,
  ];
  for (const pattern of patterns) {
    const match = pattern.exec(html);
    if (match) {
      const ulContent = match[1];
      const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let liMatch;
      while ((liMatch = liRegex.exec(ulContent)) !== null) {
        const text = liMatch[1].replace(/<[^>]*>/g, "").trim();
        if (text && text.length > 5) dates.push(text);
      }
      if (dates.length > 0) break;
    }
  }
  if (dates.length === 0) {
    const lines = html.split("\n");
    let inSection = false;
    for (const line of lines) {
      const clean = line.replace(/<[^>]*>/g, "").trim();
      if (/important\s*dates/i.test(clean)) { inSection = true; continue; }
      if (inSection) {
        if (/<\/?table/i.test(line) || clean.startsWith("Application Fee") || clean.startsWith("Age Limit")) break;
        if (clean.startsWith("•") || clean.startsWith("-") || clean.startsWith("<li")) {
          const text = clean.replace(/^[•\-]\s*/, "");
          if (text && text.length > 5) dates.push(text);
        }
      }
    }
  }
  return dates;
}

function extractFeeFromHtml(html: string): string[] {
  const fees: string[] = [];
  const feeHeaders = /(Application Fee|Application Fees|Exam Fee)/i;
  const lines = html.split("\n");
  let inSection = false;
  for (const line of lines) {
    const clean = line.replace(/<[^>]*>/g, "").replace(/[^\x20-\x7E₹]/g, "").replace(/�/g, "").replace(/[\uFFFD\u2013\u2014]/g, "-").trim();
    if (feeHeaders.test(clean) && !inSection) { inSection = true; continue; }
    if (inSection) {
      if (/Important Dates|Age Limit|Vacancy Details|Important Links/i.test(clean)) break;
      if (clean.startsWith("•") || clean.startsWith("-") || clean.startsWith("<li")) {
        const text = clean.replace(/^[•\-]\s*/, "").replace(/[^\x20-\x7E₹]/g, "").replace(/�/g, "").trim();
        if (text && text.length > 3) fees.push(text);
      }
    }
  }
  return fees;
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

  if (post && post.fullContentHtml) {
    if (!post.importantDates || post.importantDates.length === 0) {
      post.importantDates = extractDatesFromHtml(post.fullContentHtml);
    }
    if (!post.applicationFee || post.applicationFee.length === 0) {
      post.applicationFee = extractFeeFromHtml(post.fullContentHtml);
    }
  }

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
  const publishedDate = post.publishedDate
    ? (() => {
        const d = parseDate(post.publishedDate);
        // Use stored date as-is — never replace with today's date
        return isNaN(d.getTime())
          ? post.publishedDate // show raw string if unparseable
          : d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
      })()
    : "";
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

  // Detect if post is a job recruitment for Google Jobs (JobPosting schema)
  const isJobPost = (post.category || "").toLowerCase().includes("job") ||
    title.toLowerCase().includes("recruitment") ||
    title.toLowerCase().includes("online form") ||
    title.toLowerCase().includes("vacancy");

  let validThroughDate = "";
  if (post.lastDate) {
    const d = parseDate(post.lastDate);
    if (d && !isNaN(d.getTime())) validThroughDate = d.toISOString();
  }
  if (!validThroughDate && post.importantDates) {
    for (const item of post.importantDates) {
      if (/last date|apply/i.test(item)) {
        const clean = item.replace(/^.*?:/, "").trim();
        const d = parseDate(clean);
        if (d && !isNaN(d.getTime())) {
          validThroughDate = d.toISOString();
          break;
        }
      }
    }
  }

  const orgMatch = title.match(/^(SSC|UPSC|UPSSSC|UPPSC|BPSC|BSSC|RRB|RRC|Railway|SBI|IBPS|RBI|DSSSB|NTA|UKSSSC|HSSC|RSMSSB|JSSC|MPSC|MPPEB|CGPSC|APPSC|TSPSC|AFCAT|Army|Navy|Airforce)/i);
  const hiringOrg = orgMatch ? orgMatch[0].toUpperCase() : "Government of India";

  const cleanIntro = (post.intro || `${title} — check latest updates, important dates, application fee, eligibility and official links.`)
    .replace(/\[adinserter[^\]]*\]/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();

  // Determine HowTo steps based on post intent
  const postType = catSlug.includes("job") || isJobPost
    ? "job"
    : catSlug.includes("result")
    ? "result"
    : catSlug.includes("admit")
    ? "admit"
    : catSlug.includes("answer")
    ? "answer"
    : "general";

  let howToTitle = `How to Apply for ${shortTitle} Online Form 2026`;
  let howToDescription = `Step-by-step complete instructions to register, fill online form, upload documents, and submit fees for ${shortTitle}.`;
  let howToSteps = [
    {
      name: "Check Eligibility & Read Notification",
      text: `Carefully read the official notification to verify educational qualification, age limit, and category eligibility for ${shortTitle}.`,
    },
    {
      name: "Visit Official Portal & Register",
      text: "Go to the official website or click the 'Apply Online' link below. Complete the initial registration using your mobile number and email ID.",
    },
    {
      name: "Fill Online Application Form",
      text: "Log in with your registration credentials and accurately fill personal details, education details, and preferred exam cities.",
    },
    {
      name: "Upload Photo, Signature & Documents",
      text: "Upload scanned copies of recent passport size photograph, signature, and necessary certificates in the prescribed format and size.",
    },
    {
      name: "Pay Application Fee & Submit",
      text: "Pay the required application fee through online payment mode (UPI, Net Banking, Cards). Submit the form and download the confirmation printout for future reference.",
    },
  ];

  if (postType === "result") {
    howToTitle = `How to Check & Download ${shortTitle} Result 2026`;
    howToDescription = `Step-by-step procedure to check scorecard, cut-off marks, and merit list for ${shortTitle}.`;
    howToSteps = [
      {
        name: "Visit Official Result Portal",
        text: `Open the official website link provided in the Important Links table below for ${shortTitle}.`,
      },
      {
        name: "Locate Result / Scorecard Link",
        text: `Click on '${shortTitle} Result 2026' or Scorecard link on the notification panel.`,
      },
      {
        name: "Enter Roll Number & Credentials",
        text: "Submit your Examination Roll Number, Registration Number, and Date of Birth / Password.",
      },
      {
        name: "Download Scorecard & Check Cut-off",
        text: "View your subject-wise marks and qualifying status. Download and print the result scorecard PDF.",
      },
    ];
  } else if (postType === "admit") {
    howToTitle = `How to Download ${shortTitle} Admit Card 2026`;
    howToDescription = `Step-by-step procedure to download hall ticket, exam city slip, and candidate instructions for ${shortTitle}.`;
    howToSteps = [
      {
        name: "Open Examination Portal",
        text: `Access the official examination website through the direct link in the Important Links section below.`,
      },
      {
        name: "Click on Admit Card Download Link",
        text: `Click on the notification link for '${shortTitle} Admit Card / Hall Ticket 2026'.`,
      },
      {
        name: "Login with Candidate Details",
        text: "Enter your Application Number / Roll Number and Password or Date of Birth.",
      },
      {
        name: "Verify Details & Print Hall Ticket",
        text: "Confirm your exam venue address, shift time, and exam-day guidelines. Print two clear copies of the admit card.",
      },
    ];
  } else if (postType === "answer") {
    howToTitle = `How to Download & Check ${shortTitle} Answer Key 2026`;
    howToDescription = `Step-by-step guide to download provisional answer key, candidate response sheet, and submit objections for ${shortTitle}.`;
    howToSteps = [
      {
        name: "Visit Answer Key Portal",
        text: `Click on the official link provided below to access the answer key portal for ${shortTitle}.`,
      },
      {
        name: "Login to View Response Sheet",
        text: "Enter your examination Roll Number and Date of Birth to view your submitted answers.",
      },
      {
        name: "Cross-check Answers with Official Key",
        text: "Compare each question's response with the official provisional answer key and calculate your score.",
      },
      {
        name: "Submit Online Objection (If Any)",
        text: "If you detect an incorrect answer, submit an online objection with supporting documentary proof before the last date.",
      },
    ];
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/post/${slug}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: post.category || "Updates", item: `${SITE_URL}/${catSlug}` },
          { "@type": "ListItem", position: 3, name: title }
        ]
      },
      {
        "@type": "Article",
        "@id": `${SITE_URL}/post/${slug}#article`,
        headline: title,
        description: cleanIntro,
        ...(post.publishedDate && { datePublished: post.publishedDate }),
        ...(post.lastDate || post.publishedDate ? { dateModified: post.lastDate || post.publishedDate } : {}),
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/post/${slug}` },
        image: `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&cat=${encodeURIComponent(post.category || "Sarkari Result")}&date=${encodeURIComponent(post.publishedDate ? post.publishedDate.split("T")[0] : "2026")}`,
        articleSection: post.category || "Government Exam",
        inLanguage: "en-IN",
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "h2", "h3"] }
      },
      ...(isJobPost ? [{
        "@type": "JobPosting",
        "@id": `${SITE_URL}/post/${slug}#jobposting`,
        title: title,
        description: cleanIntro,
        datePosted: post.publishedDate ? (parseDate(post.publishedDate)?.toISOString() || new Date().toISOString()) : new Date().toISOString(),
        ...(validThroughDate ? { validThrough: validThroughDate } : {}),
        employmentType: "FULL_TIME",
        hiringOrganization: {
          "@type": "Organization",
          name: hiringOrg,
          sameAs: officialUrl || SITE_URL
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressCountry: "IN"
          }
        },
        directApply: true
      }] : []),
      {
        "@type": "HowTo",
        "@id": `${SITE_URL}/post/${slug}#howto`,
        name: howToTitle,
        description: howToDescription,
        step: howToSteps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.name,
          text: s.text,
          url: `${SITE_URL}/post/${slug}#step-${i + 1}`
        }))
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/post/${slug}#faq`,
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

  const postDateStr = post.publishedDate ? post.publishedDate.split("T")[0] : "2026";
  const postOgImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&cat=${encodeURIComponent(post.category || "Sarkari Result")}&date=${encodeURIComponent(postDateStr)}`;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-16">
        <div className="container-page py-4 sm:py-8">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

          <nav aria-label="Breadcrumb" className="mb-4 flex">
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

              {/* Google Discover 1200x630 Feature Image Banner */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-md">
                <img
                  src={postOgImageUrl}
                  alt={title}
                  width={1200}
                  height={630}
                  className="h-auto w-full object-cover"
                  loading="eager"
                />
              </div>

              {/* Top Leaderboard Ad Slot */}
              <AdUnit format="horizontal" />

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
                  <div className="divide-y divide-orange-100">
                    {post.applicationFee.map((f: string, i: number) => {
                      const clean = f.replace(/[^\x20-\x7E₹:\/.,\-\s\w]/g, "").trim();
                      const lower = clean.toLowerCase();
                      const isSection = lower.includes("fee refund") || lower.includes("correction charges") || lower.includes("payment mode") || lower.includes("pay their") || lower.includes("through") || lower.includes("candidates have");
                      if (isSection) {
                        return (
                          <div key={i} className="py-3 first:pt-0">
                            <p className="text-xs font-bold uppercase tracking-wider text-orange-700">{clean.replace(/^:\s*/, "")}</p>
                          </div>
                        );
                      }
                      const parts = clean.split(":");
                      const cat = parts[0]?.trim() || "";
                      const amt = parts.slice(1).join(":").trim().replace(/^Rs\.?\s*/i, "₹").replace(/\/–$/, "/-");
                      return (
                        <div key={i} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                          <span className="text-sm font-medium text-gray-700">{cat}</span>
                          <span className="text-sm font-bold text-gray-900">{amt}</span>
                        </div>
                      );
                    })}
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

              {/* In-Article Responsive Ad Unit */}
              <AdUnit format="in-article" />

              {/* Vacancy Details - structured from scraper or extracted from importantDates */}
              {post.vacancyDetails && post.vacancyDetails.length > 0 ? (
                <TableCard icon={<Users className="h-4 w-4" />} title="Vacancy Details" gradient="border-b border-violet-100 bg-violet-50/50">
                  <div className="divide-y divide-violet-100">
                    {post.vacancyDetails.map((v: string, i: number) => {
                      const lower = v.toLowerCase();
                      if (lower.includes("total post") || lower.includes("total posts")) {
                        return (
                          <div key={i} className="flex items-center justify-between py-3 first:pt-0">
                            <span className="text-sm font-semibold text-violet-700">Total Posts</span>
                            <span className="text-lg font-black text-violet-800">{v.split(":")[1]?.trim() || v}</span>
                          </div>
                        );
                      }
                      const parts = v.split(":");
                      const name = parts[0]?.trim() || "";
                      const count = parts.slice(1).join(":").trim();
                      return (
                        <div key={i} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                          <span className="text-sm font-medium text-gray-700">{name}</span>
                          <span className="text-sm font-bold text-gray-900">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                  {post.divisionWiseVacancy && post.divisionWiseVacancy.length > 0 && (
                    <details className="group mt-3">
                      <summary className="cursor-pointer text-xs font-semibold text-violet-600 hover:text-violet-700 select-none">
                        Division Wise Vacancy ({post.divisionWiseVacancy.length} divisions) ▼
                      </summary>
                      <div className="mt-3 max-h-64 overflow-y-auto border border-violet-100 rounded-lg">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-violet-50">
                              <th className="py-2 px-3 text-left font-semibold text-violet-700">Division</th>
                              <th className="py-2 px-3 text-right font-semibold text-violet-700">Posts</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-violet-50">
                            {post.divisionWiseVacancy.map((d: { division: string; posts: string }, i: number) => (
                              <tr key={i} className="hover:bg-violet-50/50">
                                <td className="py-1.5 px-3 text-gray-700">{d.division}</td>
                                <td className="py-1.5 px-3 text-right font-semibold text-gray-900">{d.posts}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </details>
                  )}
                </TableCard>
              ) : post.importantDates?.filter((d: string) =>
                d.toLowerCase().includes("vacancy") || d.toLowerCase().includes("total post") || d.toLowerCase().includes("total seat")
              ).length > 0 ? (
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
              ) : null}

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
                function isFuture(val: string): boolean {
                  const v = val.toLowerCase().trim();
                  if (/notify later|before exam|available soon|tentative|to be announced|will be notified|soon|update soon/i.test(v)) return true;
                  const now = new Date();
                  const months = ["january","february","march","april","may","june","july","august","september","october","november","december"];
                  const monthIdx: Record<string, number> = {};
                  months.forEach((m, i) => { monthIdx[m] = i; });
                  const ddmmyy = v.match(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/);
                  if (ddmmyy) {
                    const d = new Date(parseInt(ddmmyy[3]), parseInt(ddmmyy[2]) - 1, parseInt(ddmmyy[1]));
                    if (!isNaN(d.getTime())) return d > now;
                  }
                  const ddmonyy = v.match(/(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december),?\s+(\d{4})/i);
                  if (ddmonyy) {
                    const d = new Date(parseInt(ddmonyy[3]), monthIdx[ddmonyy[2].toLowerCase()], parseInt(ddmonyy[1]));
                    if (!isNaN(d.getTime())) return d > now;
                  }
                  const monyy = v.match(/(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})/i);
                  if (monyy) {
                    const m = monthIdx[monyy[1].toLowerCase()];
                    const y = parseInt(monyy[2]);
                    if (y > now.getFullYear()) return true;
                    if (y === now.getFullYear() && m > now.getMonth()) return true;
                  }
                  for (let m = now.getMonth() + 1; m < 12; m++) {
                    if (v.includes(months[m])) return true;
                  }
                  for (let y = now.getFullYear() + 1; y <= 2030; y++) {
                    if (v.includes(y.toString())) return true;
                  }
                  return false;
                }
                function isDone(keyword: string): boolean {
                  return (post.importantDates || []).some((d: string) => {
                    const lower = d.toLowerCase();
                    if (!lower.includes(keyword.toLowerCase())) return false;
                    const parts = d.split(/[:–-]/).map((s: string) => s.trim());
                    if (parts.length < 2) return true;
                    const val = parts.slice(1).join(" ");
                    return !isFuture(val);
                  });
                }
                const phases = [
                  { label: "Notification", key: "notif", done: true },
                  { label: "Apply Start", key: "apply", done: isDone("Apply Start") || isDone("Application Start") || (post.importantDates || []).some((d: string) => (d.toLowerCase().includes("apply") || d.toLowerCase().includes("application")) && !isFuture(d.split(/[:–-]/).slice(1).join(" "))) },
                  { label: "Admit Card", key: "admit", done: isDone("Admit Card") },
                  { label: "Exam Date", key: "exam", done: isDone("Exam Date") || isDone("Exam") },
                  { label: "Answer Key", key: "anskey", done: isDone("Answer Key") },
                  { label: "Result", key: "result", done: isDone("Result") },
                  { label: "Merit", key: "merit", done: isDone("Merit") || isDone("Merit List") },
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
              {(post.cutoff || hasCutoffContent) && (
                <TableCard icon={<Gauge className="h-4 w-4" />} title="Cutoff &amp; Merit List" gradient="border-b border-amber-100 bg-amber-50/50">
                  <div className="space-y-3">
                    {post.cutoff ? (
                      (Object.entries(post.cutoff) as [string, string][]).map(([cat, marks]) => (
                        <div key={cat} className="rounded-lg bg-white border border-amber-100 px-4 py-3 hover:border-amber-200 transition">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-semibold text-gray-700">{cat}</span>
                            <span className="text-sm font-bold text-gray-900">{marks}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      [
                        { cat: "General (UR)", marks: "—", color: "bg-blue-500", pct: 85 },
                        { cat: "OBC", marks: "—", color: "bg-orange-500", pct: 75 },
                        { cat: "EWS", marks: "—", color: "bg-yellow-500", pct: 72 },
                        { cat: "SC", marks: "—", color: "bg-purple-500", pct: 60 },
                        { cat: "ST", marks: "—", color: "bg-teal-500", pct: 50 },
                        { cat: "PwD", marks: "—", color: "bg-pink-500", pct: 55 },
                      ].map((row) => (
                        <div key={row.cat} className="rounded-lg bg-white border border-amber-100 px-4 py-3 hover:border-amber-200 transition">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-semibold text-gray-700">{row.cat}</span>
                            <span className="text-sm font-bold text-gray-900">{row.marks}</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-amber-50 overflow-hidden">
                            <div className={`h-full rounded-full ${row.color} transition-all`} style={{ width: `${row.pct}%` }} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {!post.cutoff && <p className="mt-4 text-xs text-gray-400">Cutoff data will be updated when officially released. Check official website for detailed category-wise cutoff.</p>}
                </TableCard>
              )}

              {/* High-CTR Ad Slot (Directly above Important Links) */}
              <AdUnit format="rectangle" className="my-6 shadow-sm border-indigo-100 bg-indigo-50/20" />

              {/* Important Links */}
              {cleanLinks.length > 0 && (
                <div id="important-links" className="scroll-mt-24">
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
              </div>
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

              {/* Full Article Content */}
              {post.fullContentHtml && (() => {
                const articleHtml = post.fullContentHtml
                  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
                  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
                  .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, "")
                  .replace(/<div[^>]*id="shareBtnWrap"[^>]*>[\s\S]*?<\/div>/gi, "")
                  .replace(/<img[^>]*>/gi, "")
                  .replace(/class="[^"]*"/g, "")
                  .replace(/<nav[\s\S]*?<\/nav>/gi, "")
                  .replace(/<header[\s\S]*?<\/header>/gi, "")
                  .replace(/<footer[\s\S]*?<\/footer>/gi, "")
                  .replace(/<a[^>]*>You May Also Like[\s\S]*?(?=<h|<div|$)/gi, "")
                  .replace(/<div[^>]*>[\s\S]*?Post navigation[\s\S]*?<\/div>/gi, "")
                  .replace(/<div class="entry-details">[\s\S]*?<div class="entry-content">/, '<div class="entry-content">')
                  .replace(/<div class="entry-image[\s\S]*?<\/div>/, "")
                  .replace(/\s*style="[^"]*"/g, "")
                  .replace(/<br\s*\/?>/g, " ")
                  .replace(/\s{2,}/g, " ")
                  .replace(/>\s+</g, "><")
                  .trim();
                const hasContent = articleHtml.length > 200 && /<h[1-4]|<p|<ul|<ol/.test(articleHtml);
                if (!hasContent) return null;
                return (
                  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
                      <h2 className="flex items-center gap-2.5 text-base font-bold text-gray-900">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                          <FileText className="h-4 w-4" />
                        </span>
                        Full Article
                      </h2>
                    </div>
                    <div className="prose prose-sm max-w-none p-5 text-gray-700 [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-gray-900 [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-800 [&_p]:mb-3 [&_p]:leading-7 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_li]:leading-7 [&_a]:text-brand [&_a]:underline [&_a]:font-medium" dangerouslySetInnerHTML={{ __html: articleHtml }} />
                  </div>
                );
              })()}

              {/* HowTo Step-by-Step Interactive Guide */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 bg-gradient-to-r from-teal-50 to-emerald-50/50 px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white font-bold text-sm shadow-xs">
                      📋
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">
                        {howToTitle}
                      </h2>
                      <p className="text-xs text-gray-500">
                        Official step-by-step instructions & application procedure
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <p className="text-xs leading-relaxed text-gray-600">
                    {howToDescription}
                  </p>
                  <ol className="relative border-l border-teal-200 pl-4 space-y-4 ml-2">
                    {howToSteps.map((step, idx) => (
                      <li key={idx} id={`step-${idx + 1}`} className="relative group">
                        <span className="absolute -left-[23px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white text-[11px] font-black ring-4 ring-white shadow-xs">
                          {idx + 1}
                        </span>
                        <div className="rounded-xl bg-gray-50/80 p-3.5 border border-gray-100 group-hover:border-teal-200 group-hover:bg-teal-50/40 transition">
                          <h3 className="text-sm font-bold text-gray-900">
                            {step.name}
                          </h3>
                          <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                            {step.text}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  {cleanLinks.length > 0 && (
                    <div className="mt-4 flex items-center justify-between rounded-xl bg-teal-50/70 p-3.5 border border-teal-100 text-xs">
                      <span className="text-teal-950 font-medium">Ready to take action? Check direct links below.</span>
                      <a href="#important-links" className="font-bold text-teal-700 hover:text-teal-900 underline flex items-center gap-1">
                        Go to Links ↓
                      </a>
                    </div>
                  )}
                </div>
              </div>

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
                <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10">
                      <Bell className="h-4.5 w-4.5 text-brand" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-gray-800">Get Alerts</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Instant notification for this exam</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Your email"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/10"
                      />
                    </div>
                    <button className="rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand/90 active:scale-[0.97]">
                      Subscribe
                    </button>
                  </div>
                  <p className="mt-2.5 text-[11px] text-gray-400 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    Free · No spam · Unsubscribe anytime
                  </p>
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

                {/* Sidebar Sticky Ad Unit */}
                <AdUnit format="rectangle" />

                {/* Save & Share */}
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Save & Share</h3>
                  <BookmarkBtn slug={slug} title={title} category={post.category || "Update"} date={publishedDate} />
                  <div className="mt-3">
                    <ShareButtons title={title} url={`${SITE_URL}/post/${slug}`} />
                  </div>
                </div>

                {/* Related Posts */}
                {(() => {
                  const cat = post.category || "";
                  const related = Object.values(sectionItems).flat()
                    .filter(p => p.slug !== slug && (p.category === cat || p.title.toLowerCase().includes(title.split(" ").slice(0,2).join(" ").toLowerCase())))
                    .slice(0, 5);
                  if (related.length === 0) return null;
                  return (
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Related Posts</h3>
                      <div className="space-y-3">
                        {related.map((p, i) => (
                          <Link key={i} href={`/post/${p.slug}`} className="group block">
                            <p className="text-sm font-semibold text-gray-700 transition group-hover:text-brand line-clamp-2">{p.title}</p>
                            <p className="mt-0.5 text-xs text-gray-400">{p.category} · {p.date}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </aside>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
