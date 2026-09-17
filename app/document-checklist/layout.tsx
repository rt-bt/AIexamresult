import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Document Verification Checklist | All India Exam Result",
  description: "Interactive document checklist for SSC, Railway, UPSC & Banking DV. Keep track of certificates, admit cards, affidavits, and photo ID proofs required.",
  alternates: { canonical: "/document-checklist" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
