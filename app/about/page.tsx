import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aiexamresult.com";

export const metadata: Metadata = {
  title: "About Us - All India Exam Result",
  description: "All India Exam Result is India's fastest government exam information portal. We aggregate verified updates from official sources across SSC, UPSC, Railway, Banking, State exams and board results.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About Us | All India Exam Result", description: "India's fastest government exam information portal covering SSC, UPSC, Railway, Banking, State exams.", url: `${SITE_URL}/about`, images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "About Us | All India Exam Result", description: "India's fastest government exam information portal." },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20 lg:pb-10">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">About Us</h1>
            <p className="mt-2 text-gray-500 text-center">Your trusted source for government exam updates</p>

            <div className="mt-8 space-y-6">
              <section className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Who We Are</h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  All India Exam Result is an independent information portal that aggregates and verifies government exam
                  notifications, results, admit cards, answer keys and job updates from official sources across India.
                  We cover SSC, UPSC, Railway RRB, Banking (IBPS, SBI, RBI), Teaching (CTET, UPTET), Defence,
                  State government jobs and board exam results.
                </p>
              </section>

              <section className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">How We Work</h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  Our system automatically syncs data from multiple official government sources every 30 minutes.
                  Each post includes direct links to official websites for verification. We do not host any
                  government data — we provide organized links to official sources.
                </p>
              </section>

              <section className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Disclaimer</h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  All India Exam Result is NOT a government website. We are an independent information service.
                  Always verify final information on the respective official government website.
                  We are not responsible for any discrepancies in the information provided.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
