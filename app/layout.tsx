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
    default: "Sarkari Result 2026 - Govt Jobs, Admit Card, Answer Key | All India Exam Result",
    template: "%s | Sarkari Result, Govt Jobs | All India Exam Result"
  },
  description:
    "Sarkari Result 2026: Check latest govt jobs, admit cards & exam results instantly. SSC, UPSC, Railway, IBPS, BPSC — 26,000+ notifications updated daily. Find your result, admit card & vacancy here.",
  applicationName: "All India Exam Result",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "sarkari result", "sarkari results", "government jobs", "exam result", "admit card", "answer key",
    "rojgar result", "sarkari rojgar", "sarkari naukri", "sarkari job alert", "sarkari job",
    "SSC Result", "Railway Result", "UPSC Result", "Bihar Board Result", "CBSE Result",
    "CUET Result", "NEET Result", "JEE Result", "Police Result", "ITI Result",
    "Diploma Result", "University Result", "Semester Result", "BPSC Result", "UPPSC Result",
    "SSC Admit Card", "Railway Admit Card", "Bank Admit Card", "UPSC Admit Card",
    "Bihar Police Admit Card", "CUET Admit Card", "NEET Admit Card",
    "RRB NTPC Admit Card", "Group D Admit Card",
    "Govt Jobs 2026", "Railway Vacancy", "SSC Vacancy",
    "Bank Vacancy", "Bihar Govt Jobs", "Teaching Jobs", "Police Recruitment",
    "Army Recruitment", "Clerk Vacancy",
    "Exam Date", "Exam Pattern", "Syllabus", "Previous Year Paper",
    "Cut Off", "Merit List", "Selection Process",
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
    "competitive exams", "government exam 2026", "sarkari exam",
    "admit card download", "answer key download", "exam notification", "result 2026",
    "nokari", "exam sarkari result", "sarkari result 2026", "government result"
  ],
  openGraph: {
    type: "website",
    siteName: "All India Exam Result",
    url: SITE_URL,
    title: "Sarkari Result 2026 - Govt Jobs, Admit Card, Answer Key | All India Exam Result",
    description: "Check latest sarkari result 2026 — govt jobs, admit cards, answer keys & exam notifications. SSC, UPSC, Railway, IBPS, Bihar, UP — all updated daily.",
    locale: "en_IN",
    images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630, alt: "Sarkari Result 2026 | All India Exam Result" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarkari Result 2026 - Latest Govt Jobs, Admit Card & Exam Result",
    description: "Get instant sarkari result, admit card & govt job alerts 2026. SSC, UPSC, Railway, Banking — 26k+ updates daily.",
    images: [`${SITE_URL}/og-image.svg`]
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/icon-48.png",  sizes: "48x48",  type: "image/png" },
      { url: "/icon-96.png",  sizes: "96x96",  type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-152.png", sizes: "152x152", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/logo.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 }
  },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "gF7-AsRKqORQGaYyLfqV4im0wQOI_Bwium6dxH7kZ8E" },
  category: "education",
  classification: "Government Exam Information Portal",
  other: {
    "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "gF7-AsRKqORQGaYyLfqV4im0wQOI_Bwium6dxH7kZ8E",
    "google-adsense-account": "ca-pub-2439432844260170"
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
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`,
        width: 1000,
        height: 1000,
        caption: "All India Exam Result Logo",
      },
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
      alternateName: ["AI Exam Result", "AIExamResult", "Sarkari Result", "Sarkari Naukri", "Rojgar Result", "Government Exam Result"],
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
      name: "Sarkari Result 2026 - Govt Jobs, Admit Card, Answer Key | All India Exam Result",
      description: "Sarkari result 2026: India's fastest government exam portal for sarkari naukri, rojgar result, job notifications, admit cards, answer keys and admissions. Covering SSC, UPSC, Railway, Bihar, UP, Rajasthan exams.",
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
      breadcrumb: { "@id": `${SITE_URL}/#homepage-breadcrumb` },
      speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "h2", ".hero-title"] }
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/#homepage-breadcrumb`,
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
          "@type": "Question", name: "What is Sarkari Result and how does All India Exam Result help?",
          acceptedAnswer: { "@type": "Answer", text: "Sarkari Result refers to Indian government exam results. All India Exam Result is India's fastest government exam portal providing verified sarkari result updates, job notifications (sarkari naukri), admit cards, answer keys and admissions across SSC, UPSC, Railway, Banking, State exams and board results." }
        },
        {
          "@type": "Question", name: "How to get latest Sarkari job alert and rojgar result updates?",
          acceptedAnswer: { "@type": "Answer", text: "Our data is synced every 30 minutes directly from official government sources. You get real-time sarkari job alerts, rojgar result updates, exam notifications, admit cards and answer keys on our website and through our notification subscription service." }
        },
        {
          "@type": "Question", name: "Which government exams are covered for Sarkari naukri?",
          acceptedAnswer: { "@type": "Answer", text: "We cover all major Indian government exams for sarkari naukri including SSC (CGL, CHSL, MTS, GD, JE, CPO), UPSC (IAS, NDA, CDS, EPFO), Railway (RRB NTPC, ALP, Group D, JE), Banking (IBPS, SBI, RBI), Teaching (CTET, UPTET, REET), Defence (Army, Navy, Air Force), State govt jobs (BPSC, UPPSC, MPPSC) and board exam results." }
        },
        {
          "@type": "Question", name: "Is this an official Sarkari result website?",
          acceptedAnswer: { "@type": "Answer", text: "No, this is an independent information portal. All sarkari result data is sourced from publicly available government notifications. We always link to official websites for final verification and recommend users to check respective government portals for authoritative information." }
        },
        {
          "@type": "Question", name: "How to search Sarkari exam results and admit cards?",
          acceptedAnswer: { "@type": "Answer", text: "Use our search bar to find any sarkari exam result, job notification, admit card, or answer key instantly. You can also browse by category (results, latest jobs, admit cards, answer keys) using the navigation menu or visit exam-specific pages." }
        },
        {
          "@type": "Question", name: "How to download Sarkari admit cards and answer keys?",
          acceptedAnswer: { "@type": "Answer", text: "Yes, each post includes direct official links to download sarkari admit cards, answer keys and exam results. We link to respective government commission websites such as ssc.nic.in, upsc.gov.in, indianrailways.gov.in and other official portals for verification." }
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
        <meta name="color-scheme" content="light" />
        <meta httpEquiv="Cache-Control" content="public, max-age=60, must-revalidate" />
        <meta name="google-adsense-account" content="ca-pub-2439432844260170" />
        <script>{`document.documentElement.classList.remove("dark");localStorage.removeItem("aier_theme");`}</script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script dangerouslySetInnerHTML={{ __html: `"serviceWorker"in navigator&&window.addEventListener("load",function(){navigator.serviceWorker.register("/sw.js")})` }} />
        <script dangerouslySetInnerHTML={{ __html: `addEventListener("load",function(){fetch("/api/analytics/track?path="+encodeURIComponent(location.pathname)+"&ref="+encodeURIComponent(document.referrer),{signal:AbortSignal.timeout(2000)}).catch(function(){})})` }} />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-9MS5NTFB7W" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-9MS5NTFB7W');`}
        </Script>
        {/* Google AdSense */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2439432844260170"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
        <InstallBanner />
      </body>
    </html>
  );
}
