import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exam Difficulty Meter & Shift Analysis 2026 | All India Exam Result",
  description: "Analyze shift-wise difficulty levels, good attempts and section-wise trends for SSC CGL, Railway RRB NTPC, IBPS PO and SBI exams with real student data.",
  alternates: { canonical: "/difficulty-meter" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
