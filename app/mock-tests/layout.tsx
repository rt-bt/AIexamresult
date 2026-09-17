import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Online Mock Tests 2026 | All India Exam Result",
  description: "Attempt free online mock tests and practice sets for SSC CGL, CHSL, Railway RRB NTPC, Banking IBPS and State Police exams with detailed solutions.",
  alternates: { canonical: "/mock-tests" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
