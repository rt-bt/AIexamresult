import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "7th Pay Commission Salary Calculator | All India Exam Result",
  description: "Calculate in-hand monthly salary, DA, HRA, TA and deductions for Central and State government jobs as per 7th Pay Commission pay matrix levels.",
  alternates: { canonical: "/salary-calculator" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
