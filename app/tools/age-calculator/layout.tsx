import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Age Calculator for Govt Exams | All India Exam Result",
  description: "Calculate your exact age as on exam cutoff date in years, months & days. Free online Sarkari exam age calculator for SSC, UPSC, Railway & Banking.",
  alternates: { canonical: "/tools/age-calculator" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
