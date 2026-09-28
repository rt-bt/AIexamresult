import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Fee Calculator | All India Exam Result",
  description: "Calculate category-wise application fee for government exam forms. Check fee concessions and payment modes for General, OBC, EWS, SC, ST and Women.",
  alternates: { canonical: "/fee-calculator" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
