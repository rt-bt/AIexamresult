import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Govt Exam Syllabus Tracker | All India Exam Result",
  description: "Track your syllabus progress topic-by-topic for SSC CGL, Railway RRB NTPC, IBPS PO and State PSCs with our interactive preparation checklist.",
  alternates: { canonical: "/syllabus-tracker" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
