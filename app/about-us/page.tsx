import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Building2, Mail, Phone, ShieldCheck, Zap, Award, CheckCircle2, Globe, HeartHandshake } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aiexamresult.com";

export const metadata: Metadata = {
  title: "About Us | All India Exam Result - Sarkari Result 2026 Portal",
  description: "Learn about All India Exam Result (aiexamresult.com), India's leading independent government recruitment news and exam information portal.",
  alternates: { canonical: "/about-us" },
  openGraph: {
    title: "About Us | All India Exam Result",
    description: "India's fastest and most reliable government job notifications, admit cards, answer keys, and exam results portal.",
    url: `${SITE_URL}/about-us`,
    images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630 }]
  },
  twitter: { card: "summary_large_image", title: "About Us | All India Exam Result" },
  robots: { index: true, follow: true },
};

export default function AboutUsPage() {
  return (
    <>
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

          {/* Official Contact Info Card */}
          <div className="bg-gradient-to-tr from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl">
            <div>
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Get In Touch</span>
              <h2 className="text-2xl font-black text-white mt-1">Contact & Editorial Desk</h2>
              <p className="text-xs text-slate-400 mt-1">Have a query, correction, or press inquiry? Reach out to our team directly.</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col items-start gap-2">
                <Mail className="w-5 h-5 text-teal-400" />
                <span className="text-slate-400 font-sans font-bold">General Enquiries:</span>
                <a href="mailto:contact@aiexamresult.com" className="text-teal-300 font-bold hover:underline">contact@aiexamresult.com</a>
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
