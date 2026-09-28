import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exam Result & Cut-off Predictor | All India Exam Result",
  description: "Predict your qualifying chances and expected cut-off marks for SSC CGL, Railway RRB, and Banking exams based on shift difficulty and raw score.",
  alternates: { canonical: "/result-predictor" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
