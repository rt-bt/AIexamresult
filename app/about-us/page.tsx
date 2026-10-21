import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import {
  Building2,
  Mail,
  Phone,
  ShieldCheck,
  Zap,
  Award,
  CheckCircle2,
  Globe,
  HeartHandshake,
  User,
  GraduationCap,
  Code2,
  Sparkles,
} from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aiexamresult.com";

export const metadata: Metadata = {
  title: "About Us | All India Exam Result",
  description: "Learn about All India Exam Result (aiexamresult.com) — founded by Aditya Raj (B.Tech Computer Science). India's premier portal for verified government job alerts, admit cards, and results.",
  alternates: { canonical: "/about-us" },
  openGraph: {
    title: "About Us | All India Exam Result",
    description: "Learn about All India Exam Result (aiexamresult.com) — founded by Aditya Raj (B.Tech Computer Science). India's premier portal for verified government job alerts, admit cards, and results.",
    url: `${SITE_URL}/about-us`,
    images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630 }]
  },
  twitter: { card: "summary_large_image", title: "About Us | All India Exam Result" },
  robots: { index: true, follow: true },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${SITE_URL}/about-us#webpage`,
      "url": `${SITE_URL}/about-us`,
      "name": "About Us | All India Exam Result",
      "description": "Learn about All India Exam Result (aiexamresult.com) — founded by Aditya Raj (B.Tech Computer Science). India's premier independent portal providing verified government job alerts, admit cards, and results.",
      "isPartOf": {
        "@id": `${SITE_URL}/#website`
      }
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": "All India Exam Result",
      "url": SITE_URL,
      "logo": `${SITE_URL}/og-image.svg`,
      "founder": {
        "@type": "Person",
        "@id": `${SITE_URL}/about-us#founder`,
        "name": "Aditya Raj",
        "alternateName": "Adity Raj",
        "jobTitle": "Founder & Lead Developer",
        "knowsAbout": [
          "Computer Science",
          "Full Stack Web Development",
          "Information Retrieval",
          "Government Recruitment Systems",
          "Software Engineering"
        ],
        "hasCredential": {
          "@type": "EducationalOccupationalCredential",
          "credentialCategory": "degree",
          "name": "Bachelor of Technology (B.Tech) in Computer Science"
        }
      }
    }
  ]
};

export default function AboutUsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <Header />
      <main className="min-h-screen bg-slate-50 pb-16">
        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-16 px-4">
          <div className="mx-auto max-w-4xl text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" /> About Our Platform
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Empowering Millions of Job Aspirants Across India
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              All India Exam Result (<strong className="text-teal-400">aiexamresult.com</strong>) is an independent recruitment news and government exam information portal committed to providing real-time, accurate, and verified recruitment notifications.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 -mt-8 space-y-8">
          {/* Key Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Updates Tracked", val: "5,000+", icon: Zap },
              { label: "Exam Categories", val: "25+", icon: Award },
              { label: "Official Sources", val: "100%", icon: ShieldCheck },
              { label: "Daily Readers", val: "50,000+", icon: Globe }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <stat.icon className="w-6 h-6 text-teal-600 mx-auto mb-2" />
                <p className="text-2xl font-black text-slate-900">{stat.val}</p>
                <p className="text-xs font-bold text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Founder & Engineering Leadership Profile */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-teal-50 text-teal-600">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">Founder &amp; Engineering Leadership</h2>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60 text-[10px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-teal-600" /> E-E-A-T Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">The software architect and editorial director behind All India Exam Result</p>
                </div>
              </div>
            </div>

            {/* Profile Overview Card */}
            <div className="flex flex-col md:flex-row items-start gap-6 p-6 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-teal-50/30 border border-slate-200/80">
              {/* Avatar / Monogram Badge */}
              <div className="shrink-0 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-900 via-teal-900 to-teal-600 text-white flex items-center justify-center text-2xl font-black shadow-md border-2 border-white">
                  AR
                </div>
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-100/70 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-teal-600" /> Verified Author
                </div>
              </div>

              {/* Bio & Credentials */}
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    Aditya Raj <span className="text-xs font-semibold text-slate-400 font-sans">(Adity Raj)</span>
                  </h3>
                  <p className="text-xs font-bold text-teal-600 flex items-center gap-1.5 mt-0.5">
                    <Code2 className="w-3.5 h-3.5" /> Founder &amp; Chief Technology Architect
                  </p>
                </div>

                {/* Qualification Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs font-semibold text-slate-800">
                  <GraduationCap className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>
                    Educational Qualification: <strong className="text-slate-950 font-bold">B.Tech in Computer Science</strong>
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                  All India Exam Result (<strong className="text-slate-800">aiexamresult.com</strong>) was conceived, engineered, and built by <strong>Aditya Raj</strong> (<strong>Adity Raj</strong>), a graduate with a <strong>B.Tech degree in Computer Science</strong>. Combining high-performance web architecture, automated data retrieval systems, and strict editorial verification standards, Aditya launched this platform to solve a major issue faced by millions of Indian youth: scattered, delayed, and misleading recruitment notices.
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  With a technical foundation in full-stack software development, information retrieval, and search optimization, Aditya oversees both the technical roadmap and editorial accuracy of the portal—ensuring every update links directly to authentic <code className="text-teal-700 bg-teal-50 px-1 py-0.5 rounded text-[11px]">.gov.in</code> or <code className="text-teal-700 bg-teal-50 px-1 py-0.5 rounded text-[11px]">.nic.in</code> gazettes and official commission servers without clickbait or unverified dates.
                </p>
              </div>
            </div>

            {/* Technical & Editorial Pillars */}
            <div className="grid sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-1.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-teal-600" /> Computer Science Pedigree
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Applying algorithmic data structures to parse government notifications, eliminate redundant entries, and deliver sub-second search speeds across 1,300+ exams.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-1.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" /> Anti-Hallucination Standards
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Aditya established strict quality gates requiring primary source cross-referencing so aspirants never encounter fake dates, unconfirmed admit cards, or dead links.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-1.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-teal-600" /> Direct Accountability
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Reach out directly to Aditya and the technical team for corrections, technical feedback, or recruitment news submissions via our dedicated editorial channels.
                </p>
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-teal-50 text-teal-600">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Our Mission & Purpose</h2>
                <p className="text-xs text-slate-500">Why All India Exam Result was founded</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Navigating government job notifications in India can be overwhelming due to scattered official websites, conflicting news reports, and delayed updates. Our mission is to centralize, structure, and simplify official recruitment information so every candidate—regardless of location—gets instant access to legitimate opportunities.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              We cover major examinations conducted by Central and State bodies including **SSC (CGL, CHSL, GD, MTS), UPSC (IAS, NDA, CDS), Railway Recruitment Boards (RRB NTPC, Group D), Banking (IBPS, SBI, RBI), Defence (Army, Navy, Airforce), State Public Service Commissions (UPPSC, BPSC, MPPSC, RPSC), CTET/UPTET, Police Recruitments, and State Board Results**.
            </p>
          </div>

          {/* Core Principles */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Our Core Principles</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Strict Source Verification", desc: "Every notice is cross-checked with official (.gov.in / .nic.in) government portals before publishing." },
                { title: "Direct Official Links", desc: "We always provide direct links to official notification PDFs and official online application portals." },
                { title: "Clear & Concise Summaries", desc: "Key eligibility details, age limits, application fees, and important dates are presented in structured tables." },
                { title: "100% Free Access", desc: "All our exam updates, guides, syllabus tools, and notifications are 100% free for all students." }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editorial Policy & Fact-Checking Standards */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-teal-50 text-teal-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Editorial Policy & Verification Standards</h2>
                <p className="text-xs text-slate-500">How we source, fact-check, and maintain data integrity</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">1. Primary Source Mandate</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our editorial desk relies strictly on primary official sources. Information regarding exam dates, scorecard links, vacancy counts, answer keys, and syllabus schemes is extracted directly from gazette notices, recruitment advertisements, and official press communiques published on verified government domains (such as <code className="text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">.gov.in</code>, <code className="text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">.nic.in</code>, and recognized state university portals). We do not publish speculative reports or social media rumors.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">2. Official Link & Mirror Transparency</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Transparency in link destinations is paramount. Every article published on AIExamResult explicitly distinguishes between:
                </p>
                <ul className="text-xs text-slate-600 list-disc list-inside space-y-1 pl-2">
                  <li><strong className="text-slate-800">Official Source Links:</strong> Direct links pointing to genuine commission/board portals, indicated by our green Official Source badge.</li>
                  <li><strong className="text-slate-800">Alternate / Mirror Links:</strong> Backup server mirrors or PDF document viewers hosted externally to assist candidates during heavy server downtime. These are clearly marked as &ldquo;Direct Link / Mirror&rdquo; and never misrepresented as government servers.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">3. Continuous Review & Timely Updates</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Government exam timelines change frequently due to administrative revisions, court rulings, or answer key objections. When an exam board issues an addendum, corrigendum, revised answer key, or date extension, our team updates the respective page with the revised details and displays the latest timestamp.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 space-y-2">
                <h3 className="text-sm font-bold text-amber-900">4. Corrections Policy</h3>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Despite rigorous verification, mistakes or discrepancies in recruitment notices can occur. We welcome reader feedback and take corrections seriously. If you spot an inaccurate date, a broken official link, or an outdated syllabus topic, please email our dedicated editorial desk at <a href="mailto:corrections@aiexamresult.com" className="font-semibold text-amber-950 underline hover:text-amber-700">corrections@aiexamresult.com</a> with the URL and reference document. Our team reviews all reports within 24 business hours.
                </p>
              </div>
            </div>
          </div>

          {/* Official Contact Info Card */}
          <div className="bg-gradient-to-tr from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl">
            <div>
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Get In Touch</span>
              <h2 className="text-2xl font-black text-white mt-1">Contact & Editorial Desk</h2>
              <p className="text-xs text-slate-400 mt-1">Have a query, correction, or press inquiry? Reach out to our team directly.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col items-start gap-2">
                <Mail className="w-5 h-5 text-teal-400" />
                <span className="text-slate-400 font-sans font-bold">General Enquiries:</span>
                <a href="mailto:contact@aiexamresult.com" className="text-teal-300 font-bold hover:underline">contact@aiexamresult.com</a>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col items-start gap-2">
                <Mail className="w-5 h-5 text-teal-400" />
                <span className="text-slate-400 font-sans font-bold">Corrections Desk:</span>
                <a href="mailto:corrections@aiexamresult.com" className="text-teal-300 font-bold hover:underline">corrections@aiexamresult.com</a>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col items-start gap-2">
                <Mail className="w-5 h-5 text-teal-400" />
                <span className="text-slate-400 font-sans font-bold">Student Support:</span>
                <a href="mailto:help@aiexamresult.com" className="text-teal-300 font-bold hover:underline">help@aiexamresult.com</a>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col items-start gap-2">
                <Phone className="w-5 h-5 text-teal-400" />
                <span className="text-slate-400 font-sans font-bold">Helpline Number:</span>
                <a href="tel:+918969799697" className="text-teal-300 font-bold hover:underline">+91 8969799697</a>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-4 text-xs">
              <Link href="/contact-us" className="px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold hover:bg-teal-400 transition">Contact Form</Link>
              <Link href="/disclaimer" className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:text-white transition">View Disclaimer</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
