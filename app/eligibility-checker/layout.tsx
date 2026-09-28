import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Govt Job Eligibility Checker 2026 | All India Exam Result",
  description: "Check which government jobs you are eligible for based on your qualification (10th, 12th, Graduate, B.Tech), age limit, and category in seconds.",
  alternates: { canonical: "/eligibility-checker" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
