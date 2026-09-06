import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { FileText, Shield, Scale, AlertTriangle, Mail, Phone, Check } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aiexamresult.com";

export const metadata: Metadata = {
  title: "Terms of Service | All India Exam Result",
  description: "Terms of Service and conditions of use for All India Exam Result (aiexamresult.com).",
  alternates: { canonical: "/terms" },
  openGraph: { title: "Terms of Service | All India Exam Result", url: `${SITE_URL}/terms` },
  robots: { index: true, follow: true },
};

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pb-16">
        {/* Header Banner */}
        <section className="bg-slate-900 text-white py-14 px-4">
          <div className="mx-auto max-w-4xl text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-bold uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5" /> Terms & Conditions
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Terms of Service</h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
              Please read these terms carefully before using All India Exam Result.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 -mt-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
            
            {/* Agreement to Terms */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" /> 1. Agreement to Terms
              </h2>
              <p>
                By accessing or using the website <strong>All India Exam Result</strong> (<a href="https://www.aiexamresult.com" className="text-teal-600 underline">https://www.aiexamresult.com</a>), you agree to be bound by these Terms of Service. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            {/* Intellectual Property & Content Nature */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-600" /> 2. Content & Portal Nature
              </h2>
              <p>
                All India Exam Result is an independent recruitment news aggregator. The materials contained on this website—including job digests, notification summaries, syllabus guides, exam dates, admit card links, and answer keys—are provided for educational and informational purposes only.
              </p>
              <p>
                All logos, official trademarks, and government department names mentioned belong to their respective official owners. We do not claim ownership over official government logos or notification documents.
              </p>
            </section>

            {/* Links to External Official Portals */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" /> 3. Links to Third-Party Government Websites
              </h2>
              <p>
                Our portal contains direct links to official government websites (e.g. <code>ssc.gov.in</code>, <code>upsc.gov.in</code>, <code>rrbcdg.gov.in</code>, etc.). All India Exam Result has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by All India Exam Result. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            {/* User Obligations & Prohibited Activities */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">4. Prohibited Uses</h2>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs text-slate-600">
                <li>Attempting to scrape, overload, or disrupt site infrastructure via automated bots or malicious scripts.</li>
                <li>Using our brand name or domain for phishing, fraudulent job schemes, or charging money from candidates under our name.</li>
                <li>Misrepresenting information from our portal to deceive candidates.</li>
              </ul>
            </section>

            {/* Limitations of Liability */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">5. Limitation of Liability</h2>
              <p>
                In no event shall All India Exam Result or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on All India Exam Result's website.
              </p>
            </section>

            {/* Governing Law */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">6. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in India.
              </p>
            </section>

            {/* Contact Details */}
            <section className="pt-6 border-t border-slate-200 space-y-3">
              <h2 className="text-lg font-bold text-slate-900">7. Contact Information</h2>
              <p className="text-xs text-slate-600">For questions regarding these Terms of Service, please reach out to our legal support desk:</p>
              <div className="p-4 rounded-2xl bg-slate-100 text-xs font-mono space-y-1">
                <p><strong>Website:</strong> https://www.aiexamresult.com</p>
                <p><strong>Primary Email:</strong> contact@aiexamresult.com</p>
                <p><strong>Help Desk:</strong> help@aiexamresult.com</p>
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
