import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CookieManager } from "@/components/site/cookie-manager";
import {
  Cookie,
  ShieldCheck,
  Lock,
  Globe,
  Server,
  Eye,
  Settings,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aiexamresult.com";

export const metadata: Metadata = {
  title: "Cookies Policy | All India Exam Result",
  description:
    "Cookies Policy for All India Exam Result (aiexamresult.com). Learn about the cookies we use, Google AdSense (ca-pub-2439432844260170), analytics, and how to manage your preferences.",
  alternates: { canonical: "/cookies-policy" },
  openGraph: {
    title: "Cookies Policy | All India Exam Result",
    description:
      "Cookies Policy for All India Exam Result (aiexamresult.com). Full disclosure on cookies, Google AdSense, DoubleClick DART cookies, and analytics.",
    url: `${SITE_URL}/cookies-policy`,
    siteName: "All India Exam Result",
    images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookies Policy | All India Exam Result",
    description: "Learn how All India Exam Result uses cookies, Google AdSense, and analytics.",
    images: [`${SITE_URL}/og-image.svg`],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/cookies-policy#webpage`,
      url: `${SITE_URL}/cookies-policy`,
      name: "Cookies Policy | All India Exam Result",
      description:
        "Comprehensive cookies disclosure for All India Exam Result, detailing essential cookies, Google AdSense ads, Google Analytics, and user privacy management.",
      inLanguage: "en-IN",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      datePublished: "2024-01-01",
      dateModified: "2026-03-01",
      breadcrumb: { "@id": `${SITE_URL}/cookies-policy#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/cookies-policy#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Cookies Policy", item: `${SITE_URL}/cookies-policy` },
      ],
    },
  ],
};

export default function CookiesPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="min-h-screen bg-slate-50 pb-16">
        {/* Header Banner */}
        <section className="bg-slate-900 text-white py-14 px-4">
          <div className="mx-auto max-w-4xl text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-bold uppercase tracking-wider">
              <Cookie className="w-3.5 h-3.5" /> Legal & Cookie Transparency
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Cookies Policy
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
              Last Updated: March 2026 • Effective Date: January 1, 2026
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 -mt-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-10 text-slate-700 text-sm leading-relaxed">

            {/* Interactive Preference Centre */}
            <section className="space-y-3">
              <CookieManager />
            </section>

            {/* 1. Introduction */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-teal-600 shrink-0" /> 1. What Are Cookies?
              </h2>
              <p>
                Cookies are small text files placed and stored on your computer, smartphone, tablet, or other internet-connected device when you visit a website. They are widely used by web developers and publishers to ensure websites function properly, operate more efficiently, remember your customized settings across visits, and provide analytical reporting and tailored advertisements.
              </p>
              <p>
                In addition to standard HTTP cookies, this policy also covers analogous browser storage technologies, including <strong>HTML5 LocalStorage</strong>, <strong>SessionStorage</strong>, and tracking pixels or web beacons.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <h3 className="font-bold text-slate-900 text-xs mb-1">Session Cookies</h3>
                  <p className="text-xs text-slate-600">
                    Temporary cookies that remain active only during your active browsing session and are erased automatically once you close your browser tab or window.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <h3 className="font-bold text-slate-900 text-xs mb-1">Persistent Cookies</h3>
                  <p className="text-xs text-slate-600">
                    Cookies that remain stored on your device for a pre-defined expiration period or until you manually clear your browser cache, enabling us to remember your preferences upon return visits.
                  </p>
                </div>
              </div>
            </section>

            {/* 2. Why We Use Cookies */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" /> 2. Why Does All India Exam Result Use Cookies?
              </h2>
              <p>
                At <strong>All India Exam Result</strong> (<a href="https://www.aiexamresult.com" className="text-teal-600 underline font-medium">https://www.aiexamresult.com</a>), our mission is to deliver fast, verified, and free government job notifications, admit cards, answer keys, and exam results to millions of job seekers and students across India. We utilize cookies for the following fundamental purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm pl-2">
                <li>
                  <strong>Essential Site Operation & Security:</strong> Maintaining security tokens, mitigating Cross-Site Request Forgery (CSRF) risks, preventing denial-of-service or scraping attacks, and ensuring seamless page transitions.
                </li>
                <li>
                  <strong>User Preferences & Bookmarking:</strong> Remembering your saved posts, bookmark lists, qualification selections, and consent configurations.
                </li>
                <li>
                  <strong>Traffic & Performance Analytics:</strong> Measuring page speed, identifying server bottlenecks, tracking most viewed recruitment notifications, and improving navigational architecture.
                </li>
                <li>
                  <strong>Advertising & Sustainability:</strong> Partnering with <strong>Google AdSense</strong> to display relevant, non-intrusive advertisements that fund our continuous editorial, hosting, and data aggregation infrastructure.
                </li>
              </ul>
            </section>

            {/* 3. Google AdSense & DoubleClick Disclosure */}
            <section className="p-6 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-4 text-slate-900">
              <div className="flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-teal-700 shrink-0" />
                <h2 className="text-lg font-black text-teal-950">
                  3. Google AdSense & DoubleClick DART Cookies Policy
                </h2>
              </div>
              <p className="text-xs leading-relaxed text-slate-700">
                Google is an authorized third-party vendor on our website under Publisher Account ID:{" "}
                <code className="bg-teal-100 text-teal-900 px-1.5 py-0.5 rounded font-mono font-bold">
                  ca-pub-2439432844260170
                </code>
                . Google uses cookies, including the DoubleClick DART cookie, to serve advertisements to visitors based upon their visit to <strong>www.aiexamresult.com</strong> and other websites on the internet.
              </p>
              <div className="space-y-2 text-xs text-slate-700">
                <p className="font-semibold text-slate-800">
                  Key Disclosures Required by Google AdSense & Advertising Regulations:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2">
                  <li>
                    Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.
                  </li>
                  <li>
                    Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.
                  </li>
                  <li>
                    Users may opt out of personalized advertising by visiting{" "}
                    <a
                      href="https://www.google.com/settings/ads"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-700 font-bold underline inline-flex items-center gap-1"
                    >
                      Google Ads Settings <ExternalLink className="h-3 w-3 inline" />
                    </a>.
                  </li>
                  <li>
                    Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting{" "}
                    <a
                      href="https://www.aboutads.info/choices/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-700 font-bold underline inline-flex items-center gap-1"
                    >
                      www.aboutads.info <ExternalLink className="h-3 w-3 inline" />
                    </a>{" "}
                    or the Network Advertising Initiative at{" "}
                    <a
                      href="https://www.networkadvertising.org/choices/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-700 font-bold underline inline-flex items-center gap-1"
                    >
                      networkadvertising.org/choices <ExternalLink className="h-3 w-3 inline" />
                    </a>.
                  </li>
                </ul>
              </div>
            </section>

            {/* 4. Google Analytics Disclosure */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Server className="w-5 h-5 text-teal-600 shrink-0" /> 4. Web Analytics & Google Analytics 4 (GA4)
              </h2>
              <p>
                We use Google Analytics (Property ID: <code>G-9MS5NTFB7W</code>) to collect aggregated, anonymized information about how visitors navigate and interact with our portal. Google Analytics sets cookies such as <code>_ga</code> and <code>_ga_*</code> to measure user interactions (such as which Sarkari exam notifications are searched most frequently).
              </p>
              <p>
                These analytics cookies do not store personally identifiable data like your full name, email, or telephone number. If you prefer not to have your activity tracked by Google Analytics across websites, you can install the official{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 font-bold underline inline-flex items-center gap-1"
                >
                  Google Analytics Opt-out Browser Add-on <ExternalLink className="h-3 w-3 inline" />
                </a>.
              </p>
            </section>

            {/* 5. Inventory Table */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-teal-600 shrink-0" /> 5. Comprehensive Cookie & Storage Inventory
              </h2>
              <p className="text-xs text-slate-600">
                Below is a full breakdown of the primary cookies and local storage tokens utilized across our portal:
              </p>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900 border-b border-slate-200">
                      <th className="p-3 font-bold">Identifier</th>
                      <th className="p-3 font-bold">Category</th>
                      <th className="p-3 font-bold">Provider</th>
                      <th className="p-3 font-bold">Purpose</th>
                      <th className="p-3 font-bold">Lifespan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono text-teal-700 font-bold">aier_cookie_consent</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">Strictly Necessary</span></td>
                      <td className="p-3">All India Exam Result</td>
                      <td className="p-3">Stores user's cookie banner consent choice (all vs essential)</td>
                      <td className="p-3">1 Year</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono text-teal-700 font-bold">aier_bookmarks</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">Functionality</span></td>
                      <td className="p-3">All India Exam Result (Local)</td>
                      <td className="p-3">Stores saved bookmarks and exam notices locally in browser</td>
                      <td className="p-3">Persistent</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono text-teal-700 font-bold">pwa_dismissed</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">Functionality</span></td>
                      <td className="p-3">All India Exam Result</td>
                      <td className="p-3">Prevents repeated prompt of PWA app installation banner</td>
                      <td className="p-3">24 Hours</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono text-teal-700 font-bold">csrf_token / access_token</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">Strictly Necessary</span></td>
                      <td className="p-3">All India Exam Result</td>
                      <td className="p-3">Secures administrator login routes and prevents CSRF attacks</td>
                      <td className="p-3">Session / 7 Days</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono text-teal-700 font-bold">_ga, _ga_9MS5NTFB7W</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold">Analytics</span></td>
                      <td className="p-3">Google LLC (GA4)</td>
                      <td className="p-3">Distinguishes unique users and measures site interactions</td>
                      <td className="p-3">2 Years</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono text-teal-700 font-bold">_gid</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold">Analytics</span></td>
                      <td className="p-3">Google LLC (GA4)</td>
                      <td className="p-3">Counts and tracks page views within a single 24-hour window</td>
                      <td className="p-3">24 Hours</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono text-teal-700 font-bold">__gads, __gpi</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 font-semibold">Advertising</span></td>
                      <td className="p-3">Google AdSense</td>
                      <td className="p-3">Measures ad impressions, limits ad fatigue, and prevents fraud</td>
                      <td className="p-3">13 Months</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono text-teal-700 font-bold">IDE, DSID, test_cookie</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 font-semibold">Advertising</span></td>
                      <td className="p-3">Google DoubleClick</td>
                      <td className="p-3">Delivers targeted and contextual advertisements across sites</td>
                      <td className="p-3">1 Year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 6. How to Manage/Delete Cookies in Browser */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-teal-600 shrink-0" /> 6. Managing Cookies in Your Web Browser
              </h2>
              <p>
                Almost all modern desktop and mobile browsers permit you to accept, block, or delete cookies at your discretion. If you wish to disable or delete cookies globally, please consult your browser's dedicated support documentation:
              </p>
              <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs">
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-slate-50 transition group"
                >
                  <span className="font-semibold text-slate-800">Google Chrome (Desktop & Android)</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-teal-600 transition" />
                </a>
                <a
                  href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-slate-50 transition group"
                >
                  <span className="font-semibold text-slate-800">Mozilla Firefox</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-teal-600 transition" />
                </a>
                <a
                  href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-slate-50 transition group"
                >
                  <span className="font-semibold text-slate-800">Apple Safari (macOS & iOS)</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-teal-600 transition" />
                </a>
                <a
                  href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-slate-50 transition group"
                >
                  <span className="font-semibold text-slate-800">Microsoft Edge</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-teal-600 transition" />
                </a>
              </div>
              <p className="text-xs text-slate-500 pt-1">
                <em>Please note:</em> If you choose to completely block all cookies, certain features of our website (such as persistent bookmarking or personalized recruitment recommendations) may not function as intended.
              </p>
            </section>

            {/* 7. Legal Basis & Privacy Rights */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600 shrink-0" /> 7. Legal Compliance & Data Protection
              </h2>
              <p>
                Our cookie management architecture is aligned with prevailing digital privacy frameworks, including the <strong>Digital Personal Data Protection Act, 2023 (India)</strong>, the <strong>General Data Protection Regulation (GDPR)</strong>, the <strong>ePrivacy Directive</strong>, and <strong>Google AdSense Publisher Policies</strong>.
              </p>
              <p>
                We do not sell personal information. All analytical and advertising data processed via third-party cookies is aggregated and safeguarded according to strict industry standards.
              </p>
              <p>
                For further details regarding how we collect, safeguard, and process your broader personal data, please review our comprehensive{" "}
                <Link href="/privacy-policy" className="text-teal-600 underline font-bold">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" className="text-teal-600 underline font-bold">
                  Terms of Service
                </Link>.
              </p>
            </section>

            {/* 8. Contact Information */}
            <section className="pt-6 border-t border-slate-200 space-y-3">
              <h2 className="text-lg font-bold text-slate-900">8. Privacy & Cookie Compliance Contacts</h2>
              <p className="text-xs text-slate-600">
                If you have questions, feedback, or requests regarding this Cookies Policy or your data privacy settings, please contact our Data Compliance Team:
              </p>
              <div className="p-4 rounded-2xl bg-slate-100 text-xs font-mono space-y-1 text-slate-800">
                <p><strong>Website:</strong> https://www.aiexamresult.com</p>
                <p><strong>Compliance Email:</strong> contact@aiexamresult.com</p>
                <p><strong>Support Email:</strong> help@aiexamresult.com</p>
                <p><strong>Privacy Helpline:</strong> +91 8969799697</p>
                <p><strong>Operating Hours:</strong> Monday – Saturday, 9:00 AM – 6:00 PM IST</p>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
