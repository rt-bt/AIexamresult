import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Step-by-Step Online Form Guide | All India Exam Result",
  description: "Comprehensive step-by-step guide to filling online application forms for SSC, Railway, UPSC & Banking without errors, payment issues or rejection.",
  alternates: { canonical: "/form-guide" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
