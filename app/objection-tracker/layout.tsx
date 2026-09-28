import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Answer Key Objection Tracker | All India Exam Result",
  description: "Track active answer key objection windows, challenge deadlines, fee per question, and portal direct links for SSC, Railway RRB, and State exams.",
  alternates: { canonical: "/objection-tracker" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
