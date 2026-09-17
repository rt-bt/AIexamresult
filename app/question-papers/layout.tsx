import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Previous Year Question Papers PDF | All India Exam Result",
  description: "Download free previous year question papers with answer keys and solutions in PDF format for SSC, Railway RRB, UPSC, Banking and State PSC exams.",
  alternates: { canonical: "/question-papers" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
