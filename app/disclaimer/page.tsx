import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { AlertOctagon, ShieldAlert, CheckCircle2, Mail, Phone, ExternalLink } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aiexamresult.com";

export const metadata: Metadata = {
  title: "Disclaimer | All India Exam Result",
  description: "Official Disclaimer for All India Exam Result (aiexamresult.com) - Non-government portal notice and verification guidelines for job aspirants.",
  alternates: { canonical: "/disclaimer" },
  openGraph: { title: "Disclaimer | All India Exam Result", url: `${SITE_URL}/disclaimer` },
  robots: { index: true, follow: true },
};

export default function DisclaimerPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pb-16">
        {/* Header Banner */}
        <section className="bg-slate-900 text-white py-14 px-4">
          <div className="mx-auto max-w-4xl text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" /> Non-Government Portal Notice
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Disclaimer</h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
              Important notice regarding government recruitment information provided on aiexamresult.com.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 -mt-8 space-y-6">
          
          {/* Highlight Box */}
          <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-3 text-amber-950">
            <div className="flex items-center gap-2 font-black text-lg text-amber-900">
              <AlertOctagon className="w-6 h-6 text-amber-600 shrink-0" />
              <span>NON-GOVERNMENT ENTITY DECLARATION</span>
            </div>
            <p className="text-xs sm:text-sm font-medium leading-relaxed text-amber-900">
              <strong>All India Exam Result (www.aiexamresult.com) is an independent recruitment news portal and is NOT affiliated, associated, authorized, endorsed by, or in any way officially connected with any Government of India department, Union Public Service Commission (UPSC), Staff Selection Commission (SSC), Railway Recruitment Boards (RRB), National Testing Agency (NTA), IBPS, or any State Government Public Service Commission.</strong>
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
            
            {/* Information Accuracy & Source */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">1. Source of Information & Accuracy</h2>
              <p>
                All job notifications, exam schedules, admit card links, answer keys, cut-off marks, and result announcements published on <strong>All India Exam Result</strong> are collected from publicly available official government portals (ending in <code>.gov.in</code> or <code>.nic.in</code>), official press releases, and reputable employment news bulletins.
              </p>
              <p>
                While we make every effort to verify and publish accurate information promptly, All India Exam Result does not guarantee the completeness, accuracy, or timeliness of any notification. Exam dates, vacancies, eligibility criteria, and instructions are subject to change by the respective official exam conducting authorities.
              </p>
            </section>

            {/* Verification Advice for Candidates */}
            <section className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600" /> 2. Mandatory Verification Guidelines for Candidates
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Candidates are strictly advised to double-check all details on the official government website before:
              </p>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1.5 font-medium pl-2">
                <li>Filling online recruitment application forms.</li>
                <li>Paying examination fees or application processing fees.</li>
                <li>Booking travel or making preparations based on exam dates.</li>
                <li>Relying on answer keys or result merit lists.</li>
              </ul>
            </section>

            {/* No Job Guarantee / No Fees */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">3. No Fees & No Job Guarantee Notice</h2>
              <p>
                All India Exam Result does NOT charge candidates any money for job alerts, application updates, or content access. We never ask for money or offer guaranteed government job placements. Beware of fraudulent emails, calls, or messages claiming to represent us and asking for payments.
              </p>
            </section>

            {/* External Links */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">4. External Websites Disclaimer</h2>
              <p>
                Our articles contain hyperlinks to third-party official websites. These links are provided solely for the user's convenience to access official PDF notifications and application forms. We have no control over the content, availability, or privacy practices of these external official sites.
              </p>
            </section>

            {/* Contact Details */}
            <section className="pt-6 border-t border-slate-200 space-y-3">
              <h2 className="text-lg font-bold text-slate-900">5. Contact Support</h2>
              <p className="text-xs text-slate-600">If you spot any typographical error, outdated link, or discrepancy, please inform our desk:</p>
              <div className="p-4 rounded-2xl bg-slate-100 text-xs font-mono space-y-1">
                <p><strong>Website:</strong> https://www.aiexamresult.com</p>
                <p><strong>Email:</strong> contact@aiexamresult.com</p>
                <p><strong>Helpdesk:</strong> help@aiexamresult.com</p>
                <p><strong>Helpline Phone:</strong> +91 8969799697</p>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
