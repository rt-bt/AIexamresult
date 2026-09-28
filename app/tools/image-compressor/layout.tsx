import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo & Signature Compressor | All India Exam Result",
  description: "Free online photo and signature compressor for Sarkari exam application forms. Resize and compress JPG/PNG images to 20KB, 50KB or 100KB without quality loss.",
  alternates: { canonical: "/tools/image-compressor" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
