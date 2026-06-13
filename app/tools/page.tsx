import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Calculator, ImageDown, FileText, BarChart3, ClipboardCheck, BookOpen } from "lucide-react";

const tools = [
  {
    title: "Age Calculator",
    description: "Calculate your exact age in years, months and days for exam eligibility checks",
    href: "/tools/age-calculator",
    icon: Calculator,
    color: "from-teal-500 to-emerald-500",
    shadow: "shadow-teal-200",
  },
  {
    title: "Exam Comparison Tool",
    description: "Compare salary, eligibility, selection process & difficulty across SSC, Railway, Banking & more",
    href: "/exam-comparison",
    icon: BarChart3,
    color: "from-indigo-500 to-violet-500",
    shadow: "shadow-indigo-200",
  },
  {
    title: "Document Checklist",
    description: "Category-wise document list for exam application & verification — check what you need",
    href: "/document-checklist",
    icon: ClipboardCheck,
    color: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-200",
  },
  {
    title: "Question Paper Archive",
    description: "Previous year question papers with answer keys & solutions for SSC, UPSC, Railway, Banking & more",
    href: "/question-papers",
    icon: BookOpen,
    color: "from-purple-500 to-pink-500",
    shadow: "shadow-purple-200",
  },
  {
    title: "Image Compressor & Cropper",
    description: "Compress and crop photos to exact competitive exam specifications — all on your device",
    href: "/tools/image-compressor",
    icon: ImageDown,
    color: "from-orange-500 to-rose-500",
    shadow: "shadow-orange-200",
  },
  {
    title: "PDF Compressor",
    description: "Reduce PDF file size for exam form uploads — compress scanned documents and certificates",
    href: "/tools/pdf-compressor",
    icon: FileText,
    color: "from-red-500 to-rose-600",
    shadow: "shadow-red-200",
  },
];

export default function ToolsPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100dvh-4rem)] bg-gradient-to-br from-gray-50 to-teal-50 pb-20 lg:pb-10">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Free Tools</h1>
              <p className="mt-2 text-gray-500 text-sm sm:text-base">
                Handy utilities for competitive exam preparation
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {tools.map((t) => {
                const Icon = t.icon;
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="group rounded-2xl bg-white p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    <span
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${t.color} ${t.shadow} shadow-sm`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </span>
                    <h2 className="mt-4 font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                      {t.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 leading-relaxed">{t.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
