import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online PDF Compressor for Govt Exams | All India Exam Result",
  description: "Free online PDF compressor for government exam documents. Compress certificate and marksheet PDFs to under 100KB, 200KB or 500KB for easy online upload.",
  alternates: { canonical: "/tools/pdf-compressor" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
