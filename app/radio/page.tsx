import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { RadioClient } from "@/components/site/radio-client";
import { Radio, Headphones, Sparkles, HelpCircle, BookOpen, Volume2 } from "lucide-react";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aiexamresult.com";

export const metadata: Metadata = {
  title: "Live Radio Stations India - Online FM, AIR Gold, Vividh Bharati, Mirchi & Big FM",
  description:
    "Listen to 90+ free live Indian internet radio stations online: Vividh Bharati, AIR FM Gold, Radio Mirchi 98.3, 92.7 Big FM, Red FM 93.5, Radio City, Hindi songs & AIR live news.",
  alternates: {
    canonical: `${SITE_URL}/radio`,
  },
  keywords: [
    "online radio india",
    "live radio stations",
    "vividh bharati live",
    "air fm gold online",
    "radio mirchi 98.3 online",
    "92.7 big fm live",
    "red fm 93.5 live",
    "all india radio akashvani",
    "hindi radio online",
    "indian fm channels",
    "free internet radio",
    "air news bulletin live",
  ],
  openGraph: {
    type: "website",
    url: `${SITE_URL}/radio`,
    title: "Live Radio Stations India - Online FM & AIR Akashvani | All India Exam Result",
    description:
      "Listen to 90+ free live Indian internet radio stations online: Vividh Bharati, AIR FM Gold, Radio Mirchi, Big FM, Red FM, Hindi songs & live news.",
    siteName: "All India Exam Result",
    images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630, alt: "Online Live Radio Stations India" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Radio Stations India - Online FM, AIR Gold, Vividh Bharati & Mirchi",
    description:
      "Stream 90+ free Indian radio channels: Vividh Bharati, Radio Mirchi 98.3, AIR FM Gold, 92.7 Big FM, Red FM live.",
    images: [`${SITE_URL}/og-image.svg`],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/radio`,
      url: `${SITE_URL}/radio`,
      name: "Live Radio Stations India - Online FM & AIR Akashvani",
      description:
        "Listen to 90+ free live Indian radio stations online: Vividh Bharati, AIR FM Gold, Radio Mirchi 98.3, 92.7 Big FM, Red FM, Radio City, Hindi songs & live news.",
      inLanguage: "en-IN",
      isPartOf: {
        "@id": `${SITE_URL}/#website`,
      },
    },
    {
      "@type": "BroadcastService",
      name: "All India Exam Result - Live Radio Portal",
      broadcastDisplayName: "AI Exam Result Live Radio",
      broadcaster: {
        "@type": "Organization",
        name: "All India Exam Result",
        url: SITE_URL,
      },
      areaServed: "India",
      inLanguage: ["hi", "en", "pa", "ta", "te", "mr", "gu", "bn", "ml", "kn"],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Live Radio",
          item: `${SITE_URL}/radio`,
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How can I listen to live radio on AI Exam Result?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Simply click on any station card from the 90+ available channels (such as Radio Mirchi, Vividh Bharati, AIR FM Gold, or 92.7 Big FM) to start instant high-quality live streaming directly in your browser without installing any app.",
          },
        },
        {
          "@type": "Question",
          name: "Is this radio streaming completely free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, all 90+ Indian radio stations available on AI Exam Result are 100% free to listen to with unlimited streaming 24 hours a day.",
          },
        },
        {
          "@type": "Question",
          name: "How does listening to All India Radio (AIR) help students?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Listening to All India Radio (AIR News bulletins and Akashvani Samachar) is widely recommended by toppers of UPSC, SSC, State PSC, and Banking exams for staying updated on daily national & international current affairs and improving language proficiency.",
          },
        },
      ],
    },
  ],
};

export default function RadioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="min-h-screen">
        {/* Breadcrumb Bar */}
        <div className="bg-[#48000D] border-b border-black/20 text-xs py-2 px-4 text-white/70">
          <div className="container-page mx-auto flex items-center gap-2">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-[#FFD84D] font-semibold">Live Radio</span>
          </div>
        </div>

        {/* Client Interactive Radio Suite */}
        <RadioClient />

        {/* Informational & Educational SEO Content Section */}
        <section className="bg-white border-t border-stone-200 py-12 md:py-16">
          <div className="container-page mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="rounded-2xl border border-stone-200 p-6 bg-gradient-to-br from-amber-50/50 to-orange-50/20">
                <div className="flex items-center gap-2.5 text-[#5B0111] font-bold text-base mb-3 font-heading">
                  <BookOpen className="h-5 w-5 text-[#FF5B3E]" />
                  <span>Why Listen to AIR News for Exam Preparation?</span>
                </div>
                <p className="text-stone-700 text-sm leading-relaxed mb-3">
                  All India Radio (Akashvani) broadcasts authentic daily national news, policy announcements,
                  and editorial analyses. Competitive exam aspirants (UPSC CSE, SSC CGL, State PSCs, NDA, CDS,
                  and Banking) rely on AIR bulletins for unbiased facts, current affairs mastery, and interview preparation.
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-stone-600">
                  <span className="bg-white px-2.5 py-1 rounded-md border border-stone-200">AIR Samachar</span>
                  <span className="bg-white px-2.5 py-1 rounded-md border border-stone-200">Current Affairs 2026</span>
                  <span className="bg-white px-2.5 py-1 rounded-md border border-stone-200">General Knowledge</span>
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 p-6 bg-gradient-to-br from-stone-50 to-slate-50/40">
                <div className="flex items-center gap-2.5 text-[#5B0111] font-bold text-base mb-3 font-heading">
                  <Volume2 className="h-5 w-5 text-[#FFD84D]" />
                  <span>Relax & Focus with 90+ Indian Radio Channels</span>
                </div>
                <p className="text-stone-700 text-sm leading-relaxed mb-3">
                  Enjoy non-stop Bollywood classics, timeless Kishore Kumar & Mohammed Rafi melodies, Punjabi bhangra,
                  Tamil & Telugu hits, and soothing instrumental tracks. Designed with responsive, lightweight audio
                  streaming so you can study, work, or unwind seamlessly.
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-stone-600">
                  <span className="bg-white px-2.5 py-1 rounded-md border border-stone-200">Radio Mirchi 98.3</span>
                  <span className="bg-white px-2.5 py-1 rounded-md border border-stone-200">Vividh Bharati</span>
                  <span className="bg-white px-2.5 py-1 rounded-md border border-stone-200">92.7 Big FM</span>
                </div>
              </div>
            </div>

            {/* Frequently Asked Questions */}
            <div className="border-t border-stone-200 pt-10">
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="h-5 w-5 text-[#5B0111]" />
                <h2 className="text-xl font-bold font-heading text-stone-900">
                  Frequently Asked Questions (FAQ)
                </h2>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-stone-200/90 p-4 bg-stone-50/50">
                  <h3 className="text-sm font-bold text-stone-900 mb-1">
                    How do I start listening to a station?
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Simply tap or click on any station card above. The live stream will begin immediately, and a floating player will appear at the bottom with play, pause, volume, and favorite controls.
                  </p>
                </div>

                <div className="rounded-xl border border-stone-200/90 p-4 bg-stone-50/50">
                  <h3 className="text-sm font-bold text-stone-900 mb-1">
                    Can I save my favorite radio channels?
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Yes! Click the Heart icon on any station to bookmark it. You can filter by &quot;Favorites&quot; anytime to quickly access your chosen stations without searching again.
                  </p>
                </div>

                <div className="rounded-xl border border-stone-200/90 p-4 bg-stone-50/50">
                  <h3 className="text-sm font-bold text-stone-900 mb-1">
                    Does the radio play in the background?
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Yes. The live broadcast continues playing as you browse through the list of stations or switch browser tabs. You can easily pause or adjust the volume anytime from the floating bottom player.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
