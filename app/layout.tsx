import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { InstallBanner } from "@/components/site/install-banner";
import { Analytics } from "@vercel/analytics/next";
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
    "Find latest government jobs, exam results, admit cards, answer keys and admissions 2026. Verified updates for SSC, UPSC, Railway, Bihar, UP, Rajasthan exams.",
  applicationName: "All India Exam Result",
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  keywords: [
    "sarkari result", "government jobs", "exam result", "admit card", "answer key",
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
      description: "India's fastest government exam information portal providing verified updates on Sarkari results, job notifications, admit cards, answer keys and admissions.",
      contactPoint: { "@type": "ContactPoint", email: "support@aiexamresult.com", contactType: "customer support", availableLanguage: ["English", "Hindi"] },
      sameAs: ["https://facebook.com/aiexamresult", "https://twitter.com/aiexamresult", "https://instagram.com/aiexamresult", "https://youtube.com/@aiexamresult"],
      address: { "@type": "PostalAddress", addressCountry: "IN" }
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "All India Exam Result",
      description: "Find latest government jobs, exam results, admit cards, answer keys and admissions 2026. Verified updates for SSC, UPSC, Railway, Banking, State exams and board results.",
      publisher: { "@id": `${SITE_URL}/#organization` },
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
      name: "All India Exam Result",
      description: "India's fastest government exam portal for Sarkari result, job notifications, admit cards, answer keys and admissions 2026.",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-IN",
      primaryImageOfPage: `${SITE_URL}/og-image.svg`,
      breadcrumb: { "@id": `${SITE_URL}/#breadcrumb` }
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Results", item: `${SITE_URL}/results` },
        { "@type": "ListItem", position: 3, name: "Latest Jobs", item: `${SITE_URL}/latest-jobs` },
        { "@type": "ListItem", position: 4, name: "Admit Card", item: `${SITE_URL}/admit-card` },
        { "@type": "ListItem", position: 5, name: "Answer Key", item: `${SITE_URL}/answer-key` }
      ]
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/#exams`,
      name: "Government Exams 2026",
      description: "List of government exams covered including SSC, UPSC, Railway, Banking, Defence and State exams.",
      url: `${SITE_URL}/exam`,
      numberOfItems: 48,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "SSC CGL", url: `${SITE_URL}/exam/ssc-cgl` },
        { "@type": "ListItem", position: 2, name: "UPSC Civil Services", url: `${SITE_URL}/exam/upsc-cse` },
        { "@type": "ListItem", position: 3, name: "RRB NTPC", url: `${SITE_URL}/exam/rrb-ntpc` },
        { "@type": "ListItem", position: 4, name: "IBPS PO", url: `${SITE_URL}/exam/ibps-po` },
        { "@type": "ListItem", position: 5, name: "CTET", url: `${SITE_URL}/exam/ctet` }
      ]
    }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script dangerouslySetInnerHTML={{ __html: `if("serviceWorker"in navigator){window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js")})}` }} />
        <script dangerouslySetInnerHTML={{ __html: `fetch("/api/analytics/track?path="+encodeURIComponent(location.pathname)+"&ref="+encodeURIComponent(document.referrer),{signal:AbortSignal.timeout(2000)}).catch(()=>{})` }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
        <InstallBanner />
        <Analytics />
      </body>
    </html>
  );
}
