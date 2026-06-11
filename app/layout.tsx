import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
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
    "Find latest government jobs, exam results, admit cards, answer keys and admissions 2026. Verified updates for SSC, UPSC, Railway, Bihar, UP, Rajasthan exams.",
  applicationName: "All India Exam Result",
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  keywords: ["government jobs", "sarkari result", "exam result", "admit card", "UPSC", "SSC", "Railway recruitment", "Bihar board", "UP board"],
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
      description: "India's fastest government exam information portal.",
      contactPoint: { "@type": "ContactPoint", email: "support@aiexamresult.com", contactType: "customer support" }
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "All India Exam Result",
      description: "Find latest government jobs, exam results, admit cards and answer keys.",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-IN",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
        "query-input": "required name=search_term_string"
      }
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
      </body>
    </html>
  );
}
