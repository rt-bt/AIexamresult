import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Providers } from "@/components/providers";
import { InstallBanner } from "@/components/site/install-banner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aiexamresult.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "All India Exam Result",
    template: "%s | All India Exam Result"
  },
  description:
    "Get fastest government job alerts, exam results, admit cards & answer keys 2026. Verified official updates for SSC, UPSC, Railway RRB, Banking, UP, Bihar & all India exams. Daily new vacancies.",
  applicationName: "All India Exam Result",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": SITE_URL,
      "hi-IN": SITE_URL,
    }
  },
  keywords: [
    "sarkari result", "government jobs", "exam result", "admit card", "answer key",
    "SSC Result", "Railway Result", "UPSC Result", "Bihar Board Result", "CBSE Result",
    "CUET Result", "NEET Result", "JEE Result", "Police Result", "ITI Result",
    "Diploma Result", "University Result", "Semester Result", "BPSC Result", "UPPSC Result",
    "SSC Admit Card", "Railway Admit Card", "Bank Admit Card", "UPSC Admit Card",
    "Bihar Police Admit Card", "CUET Admit Card", "NEET Admit Card",
    "RRB NTPC Admit Card", "Group D Admit Card",
    "Govt Jobs 2026", "Sarkari Naukri", "Railway Vacancy", "SSC Vacancy",
    "Bank Vacancy", "Bihar Govt Jobs", "Teaching Jobs", "Police Recruitment",
    "Army Recruitment", "Clerk Vacancy",
    "Exam Date", "Exam Pattern", "Syllabus", "Previous Year Paper",
    "Cut Off", "Merit List", "Selection Process", "Answer Key",
    "Bihar Result", "UP Result", "Jharkhand Result", "MP Result",
    "Rajasthan Result", "Maharashtra Result", "Tamil Nadu Result",
    "ssc cgl result 2026", "railway group d admit card 2026",
    "neet ug answer key pdf", "bihar police exam date 2026", "ibps po cut off expected",
    "SSC", "Railway", "Banking", "UPSC", "BPSC", "Bihar Police", "CUET", "NEET", "JEE", "CTET",
    "SSC GD Result 2026", "RRB NTPC Admit Card 2026", "IBPS PO Vacancy 2026",
    "SSC CGL", "SSC CHSL", "SSC MTS", "SSC GD Constable", "SSC JE", "SSC CPO", "SSC Stenographer",
    "UPSC Civil Services", "UPSC IAS", "UPSC NDA", "UPSC CDS", "UPSC EPFO", "UPSC CAPF",
    "Railway RRB NTPC", "Railway ALP", "RRB Group D", "RRB JE", "Railway recruitment",
    "IBPS PO", "IBPS Clerk", "IBPS RRB", "SBI PO", "SBI Clerk", "RBI Grade B",
    "CTET", "UPTET", "REET", "Bihar Teacher", "teaching jobs",
    "Indian Army", "Indian Navy", "Indian Air Force", "Agniveer", "defence jobs",
    "UP government jobs", "Bihar government jobs", "Rajasthan government jobs", "state govt jobs",
    "CBSE result", "BSEB result", "UP board result", "RBSE result", "board exam results",
    "college admission", "university admission", "entrance exam",
    "competitive exams", "government exam 2026", "sarkari exam", "sarkari naukri",
    "admit card download", "answer key download", "exam notification", "result 2026"
  ],
  openGraph: {
    type: "website",
    siteName: "All India Exam Result",
    url: SITE_URL,
    title: "All India Exam Result",
    description: "India's fastest exam portal. Find verified Sarkari results, government job notifications, admit cards, answer keys & admissions.",
    locale: "en_IN",
    images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630, alt: "All India Exam Result" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "All India Exam Result",
    description: "Government jobs, exam results, admit cards and admission updates 2026.",
    images: [`${SITE_URL}/og-image.svg`]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 }
  },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ?? "" },
  category: "education",
  classification: "Government Exam Information Portal",
  other: {
    "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ?? ""
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D9488"
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "All India Exam Result",
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
      description: "India's fastest government exam information portal providing verified updates on Sarkari results, government job notifications, admit cards, answer keys and admissions across SSC, UPSC, Railway, Banking and State exams.",
      foundingDate: "2024",
      email: "info@aiexamresult.com",
      telephone: "+91-8969799697",
      contactPoint: [
        { "@type": "ContactPoint", email: "info@aiexamresult.com", telephone: "+91-8969799697", contactType: "customer support", availableLanguage: ["English", "Hindi"] },
        { "@type": "ContactPoint", email: "support@aiexamresult.com", contactType: "technical support", availableLanguage: ["English", "Hindi"] }
      ],
      sameAs: [
        "https://facebook.com/aiexamresult",
        "https://twitter.com/aiexamresult",
        "https://instagram.com/aiexamresult",
        "https://youtube.com/@aiexamresult",
        "https://t.me/aiexamresult"
      ],
      address: { "@type": "PostalAddress", addressCountry: "IN" }
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "All India Exam Result",
      alternateName: ["AI Exam Result", "AIExamResult", "Sarkari Result"],
      description: "Find latest government jobs, exam results, admit cards, answer keys and admissions 2026. Verified updates for SSC, UPSC, Railway, Banking, State exams and board results.",
      publisher: { "@id": `${SITE_URL}/#organization` },
      copyrightYear: "2026",
      inLanguage: ["en-IN", "hi-IN"],
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: "All India Exam Result — Sarkari Result, Govt Jobs, Admit Card 2026",
      description: "India's fastest government exam portal for Sarkari result, job notifications, admit cards, answer keys and admissions 2026. Covering SSC, UPSC, Railway, Bihar, UP, Rajasthan exams.",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-IN",
      primaryImageOfPage: `${SITE_URL}/og-image.svg`,
      dateModified: new Date().toISOString().split("T")[0],
      significantLink: [
        `${SITE_URL}/results`,
        `${SITE_URL}/latest-jobs`,
        `${SITE_URL}/admit-card`,
        `${SITE_URL}/answer-key`,
        `${SITE_URL}/exam`
      ],
      breadcrumb: { "@id": `${SITE_URL}/#breadcrumb` },
      speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "h2", ".hero-title"] }
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Results", item: `${SITE_URL}/results` },
        { "@type": "ListItem", position: 3, name: "Latest Vacancy", item: `${SITE_URL}/latest-jobs` },
        { "@type": "ListItem", position: 4, name: "Admit Card", item: `${SITE_URL}/admit-card` },
        { "@type": "ListItem", position: 5, name: "Answer Key", item: `${SITE_URL}/answer-key` },
        { "@type": "ListItem", position: 6, name: "Admissions", item: `${SITE_URL}/admissions` },
        { "@type": "ListItem", position: 7, name: "Exam Calendar", item: `${SITE_URL}/exam-calendar` },
        { "@type": "ListItem", position: 8, name: "Tools", item: `${SITE_URL}/tools` }
      ]
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/#exams`,
      name: "Government Exams 2026",
      description: "List of government exams covered including SSC, UPSC, Railway, Banking, Defence and State exams across India.",
      url: `${SITE_URL}/exam`,
      numberOfItems: 48,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "SSC CGL 2026", url: `${SITE_URL}/exam/ssc-cgl` },
        { "@type": "ListItem", position: 2, name: "SSC CHSL 2026", url: `${SITE_URL}/exam/ssc-chsl` },
        { "@type": "ListItem", position: 3, name: "SSC MTS 2026", url: `${SITE_URL}/exam/ssc-mts` },
        { "@type": "ListItem", position: 4, name: "SSC GD Constable 2026", url: `${SITE_URL}/exam/ssc-gd` },
        { "@type": "ListItem", position: 5, name: "UPSC Civil Services 2026", url: `${SITE_URL}/exam/upsc-cse` },
        { "@type": "ListItem", position: 6, name: "UPSC NDA 2026", url: `${SITE_URL}/exam/upsc-nda` },
        { "@type": "ListItem", position: 7, name: "RRB NTPC 2026", url: `${SITE_URL}/exam/rrb-ntpc` },
        { "@type": "ListItem", position: 8, name: "RRB Group D 2026", url: `${SITE_URL}/exam/rrb-group-d` },
        { "@type": "ListItem", position: 9, name: "IBPS PO 2026", url: `${SITE_URL}/exam/ibps-po` },
        { "@type": "ListItem", position: 10, name: "IBPS Clerk 2026", url: `${SITE_URL}/exam/ibps-clerk` },
        { "@type": "ListItem", position: 11, name: "SBI PO 2026", url: `${SITE_URL}/exam/sbi-po` },
        { "@type": "ListItem", position: 12, name: "CTET 2026", url: `${SITE_URL}/exam/ctet` },
        { "@type": "ListItem", position: 13, name: "NEET UG 2026", url: `${SITE_URL}/exam/neet-ug` },
        { "@type": "ListItem", position: 14, name: "JEE Main 2026", url: `${SITE_URL}/exam/jee-main` },
        { "@type": "ListItem", position: 15, name: "BPSC 2026", url: `${SITE_URL}/exam/bpsc` }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question", name: "What is All India Exam Result?",
          acceptedAnswer: { "@type": "Answer", text: "All India Exam Result is India's fastest government exam information portal providing verified updates on Sarkari results, job notifications, admit cards, answer keys and admissions across SSC, UPSC, Railway, Banking, State exams and board results." }
        },
        {
          "@type": "Question", name: "How often is the data updated?",
          acceptedAnswer: { "@type": "Answer", text: "Our data is synced every 30 minutes directly from official government sources to ensure you get the latest exam notifications, results, admit cards and answer keys in real-time." }
        },
        {
          "@type": "Question", name: "Which exams are covered?",
          acceptedAnswer: { "@type": "Answer", text: "We cover all major Indian government exams including SSC (CGL, CHSL, MTS, GD, JE, CPO), UPSC (IAS, NDA, CDS, EPFO), Railway (RRB NTPC, ALP, Group D, JE), Banking (IBPS, SBI, RBI), Teaching (CTET, UPTET, REET), Defence (Army, Navy, Air Force), State govt jobs (UPSC, BPSC, UPPSC, MPPSC) and board exam results (Bihar Board, UP Board, CBSE, RBSE)." }
        },
        {
          "@type": "Question", name: "Is this an official government website?",
          acceptedAnswer: { "@type": "Answer", text: "No, this is an independent information portal. All data is sourced from publicly available government notifications. We always link to official websites for final verification and recommend users to check the respective government portals for authoritative information." }
        },
        {
          "@type": "Question", name: "How can I search for specific exams?",
          acceptedAnswer: { "@type": "Answer", text: "Use our search bar at the top of the page to find any exam, result, job notification, admit card, or answer key instantly. You can also browse by category using the navigation menu or visit the exam-specific pages under the Exam section." }
        },
        {
          "@type": "Question", name: "Can I download admit cards and answer keys?",
          acceptedAnswer: { "@type": "Answer", text: "Yes, each post includes direct official links to download admit cards, answer keys and results. We link to the respective government commission websites such as ssc.nic.in, upsc.gov.in, indianrailways.gov.in and other official portals." }
        }
      ]
    },
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <meta name="color-scheme" content="light dark" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script dangerouslySetInnerHTML={{ __html: `"serviceWorker"in navigator&&window.addEventListener("load",function(){navigator.serviceWorker.register("/sw.js")})` }} />
        <script dangerouslySetInnerHTML={{ __html: `addEventListener("load",function(){fetch("/api/analytics/track?path="+encodeURIComponent(location.pathname)+"&ref="+encodeURIComponent(document.referrer),{signal:AbortSignal.timeout(2000)}).catch(function(){})})` }} />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-9MS5NTFB7W" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-9MS5NTFB7W');`}
        </Script>
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
        <InstallBanner />
      </body>
    </html>
  );
}
