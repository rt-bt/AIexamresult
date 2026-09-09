import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ShieldCheck, Lock, Eye, FileText, Mail, Phone, Globe, Server } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aiexamresult.com";

export const metadata: Metadata = {
  title: "Privacy Policy | All India Exam Result",
  description: "Privacy Policy for All India Exam Result (aiexamresult.com). Read about how we collect, use, and protect your data, including Google AdSense and cookie compliance.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: { title: "Privacy Policy | All India Exam Result", url: `${SITE_URL}/privacy-policy` },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pb-16">
        {/* Header Banner */}
        <section className="bg-slate-900 text-white py-14 px-4">
          <div className="mx-auto max-w-4xl text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Legal & Data Transparency
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Privacy Policy</h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
              Last Updated: March 2026 • Effective Date: January 1, 2026
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 -mt-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
            
            {/* Introduction */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-teal-600" /> 1. Introduction
              </h2>
              <p>
                At <strong>All India Exam Result</strong> (accessible from <a href="https://www.aiexamresult.com" className="text-teal-600 underline">https://www.aiexamresult.com</a>), one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by All India Exam Result and how we use it.
              </p>
              <p>
                If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <strong>contact@aiexamresult.com</strong> or <strong>help@aiexamresult.com</strong>.
              </p>
            </section>

            {/* Google AdSense & DoubleClick Cookie Section */}
            <section className="p-6 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-3 text-slate-900">
              <h2 className="text-lg font-black text-teal-950 flex items-center gap-2">
                <Globe className="w-5 h-5 text-teal-600" /> 2. Google DoubleClick DART Cookie & Google AdSense Policy
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed">
                Google is one of the third-party vendors on our website. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to <strong>www.aiexamresult.com</strong> and other sites on the internet.
              </p>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1.5 font-medium pl-2">
                <li>Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to our site and/or other sites on the Internet.</li>
                <li>Users may opt-out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline font-bold">Google Ads Settings</a>.</li>
                <li>Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline font-bold">www.aboutads.info</a>.</li>
                <li>For a complete breakdown of all cookies we use, cookie categories, and browser controls, please read our dedicated <Link href="/cookies-policy" className="text-teal-700 underline font-bold">Cookies Policy</Link>.</li>
              </ul>
            </section>

            {/* Log Files & Analytics */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Server className="w-5 h-5 text-teal-600" /> 3. Log Files & Web Analytics
              </h2>
              <p>
                All India Exam Result follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.
              </p>
              <p>
                These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
              </p>
            </section>

            {/* Privacy Policies of Advertising Partners */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-teal-600" /> 4. Third-Party Privacy Policies
              </h2>
              <p>
                All India Exam Result's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers (such as Google AdSense publisher ID: <code>ca-pub-2439432844260170</code>) for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
              </p>
              <p>
                You can choose to disable cookies through your individual browser options. Detailed information about cookie management with specific web browsers can be found at the browsers' respective websites.
              </p>
            </section>

            {/* Children's Information */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" /> 5. Children's Online Privacy Protection (COPPA)
              </h2>
              <p>
                Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
              </p>
              <p>
                All India Exam Result does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
              </p>
            </section>

            {/* Contact Information */}
            <section className="pt-6 border-t border-slate-200 space-y-3">
              <h2 className="text-lg font-bold text-slate-900">6. Privacy Enquiries & Contact Details</h2>
              <p className="text-xs text-slate-600">
                For any questions or privacy concerns regarding this policy, please contact our Data Compliance Desk:
              </p>
              <div className="p-4 rounded-2xl bg-slate-100 text-xs font-mono space-y-1">
                <p><strong>Website:</strong> https://www.aiexamresult.com</p>
                <p><strong>Primary Email:</strong> contact@aiexamresult.com</p>
                <p><strong>Support Email:</strong> help@aiexamresult.com</p>
                <p><strong>Phone:</strong> +91 8969799697</p>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
