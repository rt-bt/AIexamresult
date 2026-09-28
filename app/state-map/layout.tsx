import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive India State Exam Map | All India Exam Result",
  description: "Click on any state on our interactive India map to explore state-level government recruitments, Police vacancies, PSC notifications, and results 2026.",
  alternates: { canonical: "/state-map" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
