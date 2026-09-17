import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Govt Exams & Jobs 2026 | All India Exam Result",
  description: "Compare syllabus, exam pattern, in-hand salary, promotion avenues, and cut-off difficulty across SSC, Railway, Banking, and State PSC recruitments.",
  alternates: { canonical: "/exam-comparison" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
