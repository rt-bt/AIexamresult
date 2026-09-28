import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { AdUnit } from "@/components/ads/ad-unit";
import { sectionItems, PostCard } from "@/lib/data";
import {
  ChevronRight,
  GraduationCap,
  Briefcase,
  Calendar,
  CheckCircle2,
  HelpCircle,
  Search,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aiexamresult.com";

interface QualConfig {
  title: string;
  seoTitle: string;
  metaDesc: string;
  badge: string;
  heading: string;
  subheading: string;
  keywords: string[];
  faqs: { q: string; a: string }[];
  overview: string;
}

const QUAL_MAP: Record<string, QualConfig> = {
  "10th-pass": {
    title: "10th Pass Govt Jobs 2026",
    seoTitle: "10th Pass Govt Jobs 2026 : Latest Matric Pass Vacancy, Online Form",
    metaDesc: "Latest 10th pass govt jobs 2026 notifications. Apply online for SSC GD, Railway Group D, MTS, Police Constable, Post Office & state government vacancies for matric pass candidates.",
    badge: "Matriculation / 10th Level",
    heading: "10th Pass Government Jobs 2026",
    subheading: "All central and state government recruitment notifications requiring 10th class / matriculation qualification.",
    keywords: ["10th", "matric", "highschool", "high school", "class 10", "gd constable", "group d", "mts", "peon", "safai", "driver", "security", "post office", "dak sevak", "gds"],
    faqs: [
      {
        q: "Which are the best government jobs for 10th pass candidates in 2026?",
        a: "The top govt jobs for 10th pass include SSC GD Constable, Railway Group D (RRB Track Maintainer, Helper), SSC MTS, India Post GDS (Gramin Dak Sevak), State Police Constable, and Indian Army Agniveer."
      },
      {
        q: "What is the age limit for 10th pass Sarkari jobs?",
        a: "The general age limit is 18 to 25 or 27 years. OBC candidates receive a 3-year relaxation (up to 28/30 years), and SC/ST candidates receive a 5-year relaxation (up to 30/32 years)."
      },
      {
        q: "What is the starting salary for 10th pass government employees?",
        a: "The pay matrix for 10th pass government posts typically falls under Level 1 (Grade Pay ₹1,800), offering an in-hand monthly starting salary of ₹22,000 to ₹28,000 including DA, HRA, and allowances."
      }
    ],
    overview: "Candidates who have completed Class 10 (High School/Matriculation) from any recognized educational board have extensive opportunities in Central and State departments. Popular recruitments include Staff Selection Commission General Duty (SSC GD), Railway Recruitment Cell (RRC Group D), India Post Office Dak Sevak, and State Police Constable vacancies."
  },
  "12th-pass": {
    title: "12th Pass Govt Jobs 2026",
    seoTitle: "12th Pass Govt Jobs 2026 : Intermediate Vacancy Apply Online Form",
    metaDesc: "Explore latest 12th pass government jobs 2026. Apply for SSC CHSL, Railway NTPC Undergraduate, State Police Constable, Stenographer, Forest Guard & Army Clerk vacancies.",
    badge: "Intermediate / 10+2 Level",
    heading: "12th Pass Government Jobs 2026",
    subheading: "Find all government job recruitments for Intermediate (10+2) Science, Arts, and Commerce students.",
    keywords: ["12th", "intermediate", "10+2", "class 12", "chsl", "constable", "clerk", "stenographer", "stenography", "deo", "data entry", "forest guard", "nda", "airforce", "navy ssr"],
    faqs: [
      {
        q: "Which top central exams are available after 12th pass?",
        a: "Major exams include SSC CHSL (LDC, JSA, DEO), RRB NTPC Undergraduate (Junior Clerk, Trains Clerk), UPSC NDA (National Defence Academy), SSC Stenographer Grade C & D, and Indian Air Force Agniveer Vayu."
      },
      {
        q: "Can 12th Arts/Commerce students apply for Railway jobs?",
        a: "Yes. Non-technical posts like RRB NTPC Junior Clerk cum Typist and Accounts Clerk only require 12th pass in any stream with minimum 50% marks."
      },
      {
        q: "What is the salary range for 12th pass Sarkari Naukri?",
        a: "Posts like SSC CHSL and Police Constable fall under Pay Level 2 to Level 4 (₹19,900 to ₹25,500 basic), leading to an in-hand monthly salary of ₹28,000 to ₹38,000."
      }
    ],
    overview: "Passing Class 12 opens doors to prestigious non-gazetted and clerical positions across Ministries, Armed Forces, and Public Sector Undertakings. Notifications such as SSC Combined Higher Secondary Level (CHSL), Railway NTPC Undergraduate, and State Police Constables provide stable careers with promotion prospects."
  },
  "graduate": {
    title: "Graduate Govt Jobs 2026",
    seoTitle: "Graduate Govt Jobs 2026 : BA, BSc, BCom, BTech Vacancy Online Form",
    metaDesc: "Latest Graduate government jobs 2026 notifications. Apply for UPSC Civil Services, SSC CGL, Bank PO/Clerk, State PSC, Sub Inspector & Assistant Officer posts.",
    badge: "Degree / Bachelor's Level",
    heading: "Graduate Government Jobs 2026",
    subheading: "All central and state government job openings requiring any Bachelor's degree (BA, BSc, BCom, BTech, BCA, BBA).",
    keywords: ["graduate", "graduation", "degree", "b.a", "b.sc", "b.com", "b.tech", "cgl", "po ", "probationary", "officer", "assistant", "inspector", "sub inspector", "si ", "upsc", "bpsc", "uppsc", "mppsc", "ras", "administrative", "executive", "daroga"],
    faqs: [
      {
        q: "What are the most prestigious government exams for graduates?",
        a: "UPSC Civil Services (IAS/IPS/IFS), SSC CGL (Income Tax Inspector, ASO, Excise Inspector), State PCS (SDM, DSP), RBI Grade B, and IBPS/SBI Probationary Officer."
      },
      {
        q: "Is any minimum graduation percentage required for SSC CGL or Bank PO?",
        a: "For SSC CGL and UPSC CSE, a simple pass degree in any discipline is sufficient. For some banking exams (like RBI Grade B), 60% marks in graduation are mandatory."
      },
      {
        q: "What is the salary for Graduate Sarkari jobs?",
        a: "Graduate officers enter Pay Level 6 to Level 8 (Grade Pay ₹4,200 to ₹4,800), with starting gross monthly compensation ranging from ₹55,000 to ₹85,000+ depending on posting city tier."
      }
    ],
    overview: "Graduates are eligible for India's highest-ranking administrative and managerial public positions. From UPSC Civil Services to SSC CGL and Public Sector Bank Probationary Officers (PO), graduation is the gateway to leadership roles with attractive salaries and government benefits."
  },
  "iti-diploma": {
    title: "ITI & Diploma Govt Jobs 2026",
    seoTitle: "ITI & Diploma Govt Jobs 2026 : Polytechnic & Technical Vacancies",
    metaDesc: "Find latest ITI & Polytechnic Diploma government jobs 2026. Railway ALP, Technician, SSC JE, DRDO, ISRO, PSU Apprentice, and State Electricity Board recruitment.",
    badge: "Technical & Vocational",
    heading: "ITI & Diploma Government Jobs 2026",
    subheading: "Recruitment notices for Polytechnic Diploma holders and ITI Trade Certificate holders in Railway, Defense, and PSUs.",
    keywords: ["iti", "diploma", "polytechnic", "technician", "alp", "assistant loco pilot", "apprentice", "junior engineer", "je ", "tradesman", "fitter", "electrician", "mechanic", "drdo", "isro", "bhel", "ongc", "sail"],
    faqs: [
      {
        q: "Which government departments hire the most ITI & Diploma holders?",
        a: "Indian Railways (RRB ALP & Technician), State Power Distribution Companies (DISCOMs), DRDO, ISRO, Ordnance Factories, SSC (Junior Engineer), and PSUs like ONGC, BHEL, and IOCL."
      },
      {
        q: "Can Diploma engineers apply for SSC Junior Engineer (JE)?",
        a: "Yes! Diploma in Civil, Mechanical, or Electrical Engineering with 2 years of experience (or B.E./B.Tech) is fully eligible for SSC JE in CPWD, MES, and Central Water Commission."
      }
    ],
    overview: "Technical qualifications like ITI Trade certificates and 3-Year Polytechnic Diplomas have specialized quotas in Indian Railways, SSC Junior Engineer, and Maharatna PSUs. These posts offer technical career advancement and steady salary increments."
  },
  "police-jobs": {
    title: "Police Jobs 2026",
    seoTitle: "Police Bharti 2026 : Constable, Sub Inspector (SI) & ASI Online Form",
    metaDesc: "Latest Police Bharti 2026 updates for all states. Apply for UP Police, Delhi Police, Bihar Police, MP Police Constable, Sub Inspector, Jail Warder and Driver recruitment.",
    badge: "Law Enforcement & State Police",
    heading: "Police Bharti & Defence Vacancies 2026",
    subheading: "State Police Constable, Sub Inspector (SI), ASI, Home Guard, and Paramilitary recruitment notifications.",
    keywords: ["police", "constable", "sub inspector", "si recruitment", "asi ", "home guard", "daroga", "jail warder", "cisf", "crpf", "bsf", "itbp", "ssb", "rpf"],
    faqs: [
      {
        q: "What physical fitness standards are required for Police Constable bharti?",
        a: "Generally, male candidates require a minimum height of 168 cm (165 cm for reserved categories) and must run 4.8 km in 24-25 minutes. Female candidates require 152 cm height and run 2.4 km in 14-16 minutes."
      },
      {
        q: "What is the qualification needed to become a Sub Inspector (SI)?",
        a: "To become a Police Sub Inspector (Daroga), a candidate must possess a Bachelor's Degree in any discipline from a recognized University."
      }
    ],
    overview: "State Police organizations like UP Police, Delhi Police, Bihar Police, and Central Armed Police Forces (CAPF) hire lakhs of young candidates annually for Constable and Sub Inspector posts. Physical endurance tests and computer-based examinations determine selection."
  },
  "railway-jobs": {
    title: "Railway Jobs 2026",
    seoTitle: "Railway Jobs 2026 : RRB NTPC, Group D, ALP & Technician Vacancies",
    metaDesc: "Get latest Railway Recruitment Board (RRB) 2026 notifications. Check RRB NTPC, Group D, ALP, Technician, RPF Constable & SI exam dates and online application form.",
    badge: "Indian Railways / RRB & RRC",
    heading: "Railway Recruitment 2026 (RRB & RRC)",
    subheading: "Centralized railway vacancies across 21 RRB zones for 10th pass, 12th pass, ITI, and Graduates.",
    keywords: ["railway", "rrb", "rrc", "ntpc", "group d", "alp", "loco pilot", "technician", "station master", "goods guard", "ticket collector", "tc ", "rpf constable", "rpf si"],
    faqs: [
      {
        q: "What is the selection process for RRB NTPC 2026?",
        a: "RRB NTPC selection involves CBT-1 (Screening Test), CBT-2 (Scoring Exam), Typing Skill Test or Computer Based Aptitude Test (CBAT for Station Master), followed by Document Verification & Medical Examination."
      },
      {
        q: "What is the difference between RRB and RRC?",
        a: "RRB (Railway Recruitment Board) conducts exams for Group C posts (NTPC, ALP, JE). RRC (Railway Recruitment Cell) handles recruitment for Group D level 1 posts and Apprenticeships."
      }
    ],
    overview: "Indian Railways is one of India's largest employers. Candidates from 10th pass (Group D), 12th pass (Junior Clerk), ITI (Technician/ALP) to Graduates (Station Master, Goods Train Manager) find stable government employment with rail travel concessions and medical facilities."
  },
  "defence-jobs": {
    title: "Defence Jobs 2026",
    seoTitle: "Defence Jobs 2026 : Army, Navy, Airforce, NDA & CDS Online Form",
    metaDesc: "Latest Defence jobs 2026 online form. Join Indian Army Agniveer, Indian Navy SSR/MR, Indian Airforce Vayu, NDA, CDS, AFCAT and Coast Guard recruitment notifications.",
    badge: "Indian Armed Forces",
    heading: "Indian Armed Forces Recruitment 2026",
    subheading: "Join Indian Army, Navy, Air Force, Coast Guard, NDA, and Paramilitary through official recruitment entries.",
    keywords: ["army", "navy", "airforce", "air force", "nda", "cds", "afcat", "agniveer", "coast guard", "defence", "defense", "military", "soldier", "territorial army"],
    faqs: [
      {
        q: "What is the age limit for Indian Army Agniveer 2026?",
        a: "The age limit for Agniveer (General Duty, Technical, Clerk, Tradesman) is 17.5 to 21 years on the date of recruitment."
      },
      {
        q: "How can 12th pass students join Indian Armed Forces as officers?",
        a: "Through the UPSC NDA (National Defence Academy) Examination held twice a year, or through 10+2 Technical Entry Scheme (TES) for Indian Army and Navy."
      }
    ],
    overview: "Serving in the Indian Armed Forces combines prestigious national service with disciplined professional growth. Opportunities exist through the Agniveer scheme for matric and intermediate pass youths, as well as Officer entries like NDA, CDS, and AFCAT."
  },
  "teaching-jobs": {
    title: "Teaching Govt Jobs 2026",
    seoTitle: "Teaching Govt Jobs 2026 : CTET, KVS, NVS, PRT, TGT, PGT Vacancies",
    metaDesc: "Apply for latest government teaching jobs 2026. CTET, State TET, KVS, NVS, DSSSB, Assistant Professor, PRT, TGT, PGT school and university teacher recruitments.",
    badge: "Education & Academic",
    heading: "Government Teaching Jobs 2026 (TET, PRT, TGT, PGT)",
    subheading: "Central and state school teacher vacancies, eligibility test notifications, and university faculty recruitment.",
    keywords: ["teacher", "teaching", "tgt", "pgt", "prt", "ctet", "tet", "stet", "uptet", "htet", "reet", "professor", "lecturer", "kvs", "nvs", "dsssb", "b.ed", "bed", "deled", "d.el.ed", "shikshak", "assistant teacher"],
    faqs: [
      {
        q: "What is the difference between PRT, TGT, and PGT teachers?",
        a: "PRT (Primary Teacher) teaches classes 1 to 5 (Requires 12th + D.El.Ed + CTET Paper 1). TGT (Trained Graduate Teacher) teaches classes 6 to 10 (Requires Graduation + B.Ed + CTET Paper 2). PGT (Post Graduate Teacher) teaches classes 11 and 12 (Requires Master's Degree + B.Ed)."
      },
      {
        q: "Is CTET compulsory for government teacher jobs?",
        a: "CTET qualification is mandatory for Central Government schools like KVS, NVS, DSSSB, and Tibetan Schools. State schools generally accept CTET or their respective State TET."
      }
    ],
    overview: "Teaching jobs offer high societal respect, fixed working hours, and stable pay scales. Eligibility typically requires D.El.Ed or B.Ed alongside qualifying marks in Central Teacher Eligibility Test (CTET) or State TET."
  },
  "banking-jobs": {
    title: "Bank Jobs 2026",
    seoTitle: "Bank Jobs 2026 : SBI, IBPS, RBI PO, Clerk & SO Online Form",
    metaDesc: "Latest Bank Jobs 2026 notifications. Apply online for IBPS PO, IBPS Clerk, SBI PO, SBI Clerk, RBI Grade B, Assistant & Regional Rural Banks (RRB) recruitment.",
    badge: "Banking & Financial Sector",
    heading: "Public Sector Bank Jobs 2026 (SBI, IBPS, RBI)",
    subheading: "Recruitment notifications for Probationary Officers (PO), Clerks, Specialist Officers (SO), and Assistants in nationalized banks.",
    keywords: ["bank", "banking", "ibps", "sbi", "rbi", "nabard", "sebi", "po ", "probationary", "clerk", "specialist officer", "so ", "cooperative bank"],
    faqs: [
      {
        q: "What is the syllabus for Bank PO / Clerk prelims?",
        a: "Bank prelims consists of 3 sections: English Language (30 marks), Quantitative Aptitude (35 marks), and Reasoning Ability (35 marks) with sectional timing of 20 minutes each (Total 100 marks, 60 minutes)."
      },
      {
        q: "What is the annual recruitment calendar for public sector banks?",
        a: "IBPS releases its tentative exam calendar every January covering IBPS RRB PO/Clerk (Aug-Sep), IBPS Clerk (Aug-Oct), IBPS PO (Oct-Nov), and IBPS SO (Dec-Jan). SBI PO and Clerk notifications follow independently."
      }
    ],
    overview: "Public sector banking examinations are renowned for their strict calendars, transparent selection processes, and fast joining times. Fresh graduates and post-graduates can build lucrative careers across SBI, PNB, Bank of Baroda, and Reserve Bank of India."
  },
};

export async function generateMetadata({ params }: { params: Promise<{ qualification: string }> }): Promise<Metadata> {
  const { qualification } = await params;
  const config = QUAL_MAP[qualification];
  if (!config) return { title: "Jobs by Qualification - Sarkari Result" };

  const canonicalUrl = `${SITE_URL}/jobs/${qualification}`;

  return {
    title: config.seoTitle,
    description: config.metaDesc,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${config.seoTitle} | All India Exam Result`,
      description: config.metaDesc,
      url: canonicalUrl,
      images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.seoTitle} | All India Exam Result`,
      description: config.metaDesc,
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
      },
    },
  };
}

export default async function QualificationPage({ params }: { params: Promise<{ qualification: string }> }) {
  const { qualification } = await params;
  const config = QUAL_MAP[qualification];

  if (!config) {
    notFound();
  }

  // Filter posts that match keywords for this qualification
  const allPosts = [
    ...(sectionItems["latest-jobs"] || []),
    ...(sectionItems["results"] || []),
    ...(sectionItems["admit-card"] || []),
  ];

  const matchedPosts: PostCard[] = [];
  const seenSlugs = new Set<string>();

function matchesQualification(qualification: string, title: string, keywords: string[]): boolean {
  // If teaching jobs, reject non-teaching / non-faculty explicitly
  if (qualification === "teaching-jobs") {
    if (/\bnon[-\s]teaching\b/i.test(title) || /\bnon[-\s]faculty\b/i.test(title)) {
      return false;
    }
  }

  for (const kw of keywords) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const reg = new RegExp(`\\b${escaped}\\b`, "i");
    if (reg.test(title)) {
      return true;
    }
  }
  return false;
}

  for (const post of allPosts) {
    if (!post.slug || seenSlugs.has(post.slug)) continue;
    if (matchesQualification(qualification, post.title, config.keywords)) {
      matchedPosts.push(post);
      seenSlugs.add(post.slug);
    }
  }

  // Fallback to top latest jobs if matched list is short
  const displayPosts = matchedPosts.length >= 5
    ? matchedPosts
    : [
        ...matchedPosts,
        ...(sectionItems["latest-jobs"] || []).filter((p) => p.slug && !seenSlugs.has(p.slug)),
      ].slice(0, 30);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/jobs/${qualification}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Jobs", item: `${SITE_URL}/latest-jobs` },
          { "@type": "ListItem", position: 3, name: config.title },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/jobs/${qualification}#page`,
        name: config.seoTitle,
        description: config.metaDesc,
        url: `${SITE_URL}/jobs/${qualification}`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-IN",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: displayPosts.length,
          itemListElement: displayPosts.slice(0, 25).map((p, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            url: `${SITE_URL}/post/${p.slug}`,
            name: p.title,
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/jobs/${qualification}#faq`,
        mainEntity: config.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      },
    ],
  };

  const qualKeys = Object.keys(QUAL_MAP);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="min-h-screen bg-slate-50 pb-16">
        {/* Hero Header */}
        <div className="border-b border-emerald-900/30 bg-gradient-to-br from-[#0F766E] via-[#115E59] to-[#042F2E] py-10 text-white sm:py-14">
          <div className="container-page">
            <nav aria-label="Breadcrumb" className="mb-4 flex">
              <ol className="flex flex-wrap items-center gap-2 text-xs font-medium text-white/75 sm:text-sm">
                <li>
                  <Link href="/" className="transition hover:text-white">
                    Home
                  </Link>
                </li>
                <ChevronRight className="h-3.5 w-3.5" />
                <li>
                  <Link href="/latest-jobs" className="transition hover:text-white">
                    Jobs
                  </Link>
                </li>
                <ChevronRight className="h-3.5 w-3.5" />
                <li className="font-bold text-white">{config.title}</li>
              </ol>
            </nav>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#5EEAD4] backdrop-blur-sm">
              <GraduationCap className="h-3.5 w-3.5" />
              {config.badge}
            </span>

            <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              {config.heading}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/85 sm:text-base">
              {config.subheading}
            </p>

            {/* Quick Qualification Pills */}
            <div className="mt-6 flex flex-wrap gap-2 pt-2 border-t border-white/10">
              <span className="text-xs font-bold text-white/70 self-center mr-1">Other Qualifications:</span>
              {qualKeys.map((key) => {
                const isActive = key === qualification;
                return (
                  <Link
                    key={key}
                    href={`/jobs/${key}`}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      isActive
                        ? "bg-[#5EEAD4] text-slate-900 shadow-sm"
                        : "bg-white/10 text-white/90 hover:bg-white/20"
                    }`}
                  >
                    {QUAL_MAP[key].title.replace(" Govt Jobs 2026", "").replace(" Jobs 2026", "")}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Ad Unit */}
        <div className="container-page pt-6">
          <AdUnit format="horizontal" />
        </div>

        <div className="container-page mt-6 grid gap-8 lg:grid-cols-3">
          {/* Main Column: Vacancy List */}
          <div className="space-y-6 lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-800">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Live Vacancies & Applications
                    </h2>
                    <p className="text-xs text-slate-500">
                      Showing {displayPosts.length} active notifications
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Verified
                </span>
              </div>

              {/* Job rows */}
              <div className="divide-y divide-slate-100">
                {displayPosts.map((job, idx) => (
                  <div
                    key={job.slug || idx}
                    className="group flex flex-col justify-between gap-3 p-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-teal-700">
                          {job.state || "Central Govt"}
                        </span>
                        <span>•</span>
                        <span>{job.date || "2026"}</span>
                        {job.lastDate && (
                          <>
                            <span>•</span>
                            <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
                              Last Date: {job.lastDate}
                            </span>
                          </>
                        )}
                      </div>
                      <Link
                        href={`/post/${job.slug}`}
                        className="mt-1 block font-bold text-slate-900 group-hover:text-teal-700 transition"
                      >
                        {job.title}
                      </Link>
                      {job.excerpt && (
                        <p className="mt-1 line-clamp-1 max-w-2xl text-xs text-slate-500 overflow-hidden text-ellipsis">
                          {job.excerpt.length > 90 ? job.excerpt.substring(0, 87) + "…" : job.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Link
                        href={`/post/${job.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-teal-800 active:scale-95"
                      >
                        Apply Online
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* In-depth Overview Article for High SEO Topical Authority */}
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                About {config.heading}
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
                <p>{config.overview}</p>
                <div className="rounded-xl bg-teal-50/70 border border-teal-100 p-4">
                  <h3 className="flex items-center gap-2 font-bold text-teal-900">
                    <ShieldCheck className="h-4 w-4 text-teal-700" />
                    Key Eligibility Guidelines
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-xs text-teal-950">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 mt-0.5 shrink-0" />
                      <span>Educational certificates must be issued by a recognized State Board, CBSE, ICSE, or UGC-approved University.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 mt-0.5 shrink-0" />
                      <span>Candidates must meet category-wise age criteria as on the cut-off date mentioned in the official advertisement.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 mt-0.5 shrink-0" />
                      <span>Reserved category applicants (SC/ST/OBC/EWS/PwD) must hold valid domicile and caste certificates.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* FAQ Accordion */}
              <div className="mt-8 border-t border-slate-100 pt-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <HelpCircle className="h-5 w-5 text-teal-700" />
                  Frequently Asked Questions (FAQs)
                </h3>
                <div className="mt-4 divide-y divide-slate-100">
                  {config.faqs.map((faq, i) => (
                    <details key={i} className="group py-3.5 [&[open]>summary_.chevron]:rotate-180">
                      <summary className="flex cursor-pointer items-start justify-between gap-4 text-sm font-semibold text-slate-800 hover:text-teal-700 list-none">
                        <span>{faq.q}</span>
                        <ChevronRight className="chevron mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200" />
                      </summary>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 pl-1">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Quick Browse by Category */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Jobs by Qualification
              </h3>
              <div className="mt-3 space-y-1.5">
                {qualKeys.map((key) => {
                  const isActive = key === qualification;
                  return (
                    <Link
                      key={key}
                      href={`/jobs/${key}`}
                      className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? "bg-teal-50 text-teal-800 font-bold border border-teal-200"
                          : "text-slate-700 hover:bg-slate-50 hover:text-teal-700"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-teal-600" />
                        {QUAL_MAP[key].title}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Sidebar Ad */}
            <AdUnit format="rectangle" />

            {/* Important Tools Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Candidate Utilities
              </h3>
              <div className="mt-3 space-y-2 text-sm">
                <Link
                  href="/tools/age-calculator"
                  className="flex items-center gap-2.5 rounded-xl border border-slate-100 p-2.5 text-slate-700 hover:border-teal-200 hover:bg-teal-50/50 transition"
                >
                  <Calendar className="h-4 w-4 text-teal-600" />
                  <div>
                    <p className="font-semibold text-xs">Govt Exam Age Calculator</p>
                    <p className="text-[11px] text-slate-400">Calculate eligibility cut-off date</p>
                  </div>
                </Link>
                <Link
                  href="/tools/image-compressor"
                  className="flex items-center gap-2.5 rounded-xl border border-slate-100 p-2.5 text-slate-700 hover:border-teal-200 hover:bg-teal-50/50 transition"
                >
                  <Search className="h-4 w-4 text-teal-600" />
                  <div>
                    <p className="font-semibold text-xs">Photo & Signature Resizer</p>
                    <p className="text-[11px] text-slate-400">20KB - 50KB online form format</p>
                  </div>
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom Banner Ad */}
        <div className="container-page mt-10">
          <AdUnit format="horizontal" />
        </div>
      </main>
      <Footer />
    </>
  );
}
