import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Govt Vacancy Trend Analyzer | All India Exam Result",
  description: "Analyze multi-year vacancy trends, recruitment cycles, and seat distribution across SSC, Railway, Banking, and Defence exams with visual charts.",
  alternates: { canonical: "/vacancy-analyzer" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
