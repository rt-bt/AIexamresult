import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Calculator, ImageDown, FileText, BarChart3, ClipboardCheck, BookOpen, Zap, Users, IndianRupee, Briefcase, GraduationCap, Newspaper, AlertTriangle, Signal, BookMarked, TrendingUp, Lightbulb } from "lucide-react";

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
    title: "Result Predictor",
    description: "Estimate your selection chance & rank range based on marks, category and exam cutoff trends",
    href: "/result-predictor",
    icon: Zap,
    color: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-200",
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
    title: "State-Wise Map",
    description: "Board results, government jobs & exams by state — click on India map to explore",
    href: "/state-map",
    icon: BarChart3,
    color: "from-sky-500 to-blue-500",
    shadow: "shadow-sky-200",
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
  {
    title: "Job Finder",
    description: "Mere liye kaunsi govt job? Qualification, age & state ke hisaab se find karein",
    href: "/job-finder",
    icon: Briefcase,
    color: "from-teal-500 to-cyan-500",
    shadow: "shadow-teal-200",
  },
  {
    title: "Eligibility Checker",
    description: "Age, qualification & category daalein — eligible exams instantly batao",
    href: "/eligibility-checker",
    icon: Users,
    color: "from-emerald-500 to-green-500",
    shadow: "shadow-emerald-200",
  },
  {
    title: "Salary Calculator",
    description: "Basic + DA + HRA ke hisaab se in-hand salary estimate dekhein",
    href: "/salary-calculator",
    icon: IndianRupee,
    color: "from-purple-500 to-violet-500",
    shadow: "shadow-purple-200",
  },
  {
    title: "Vacancy Analyzer",
    description: "Category-wise vacancy breakdown with visual bar charts",
    href: "/vacancy-analyzer",
    icon: TrendingUp,
    color: "from-orange-500 to-amber-500",
    shadow: "shadow-orange-200",
  },
  {
    title: "Fee Calculator",
    description: "Category & gender ke hisaab se application fee calculate karein",
    href: "/fee-calculator",
    icon: IndianRupee,
    color: "from-pink-500 to-rose-500",
    shadow: "shadow-pink-200",
  },
  {
    title: "Form Filling Guide",
    description: "Step-by-step guide for filling government job application forms",
    href: "/form-guide",
    icon: BookMarked,
    color: "from-sky-500 to-blue-500",
    shadow: "shadow-sky-200",
  },
  {
    title: "Syllabus Tracker",
    description: "Topic-wise syllabus tracking — tick complete, see progress %",
    href: "/syllabus-tracker",
    icon: ClipboardCheck,
    color: "from-teal-500 to-emerald-500",
    shadow: "shadow-teal-200",
  },
  {
    title: "Mock Test Tips",
    description: "Exam-specific subject-wise preparation tips & strategy",
    href: "/mock-tests",
    icon: Lightbulb,
    color: "from-amber-500 to-yellow-500",
    shadow: "shadow-amber-200",
  },
  {
    title: "Current Affairs",
    description: "Latest GK news with daily quiz for competitive exams",
    href: "/current-affairs",
    icon: Newspaper,
    color: "from-indigo-500 to-purple-500",
    shadow: "shadow-indigo-200",
  },
  {
    title: "Objection Tracker",
    description: "Answer key objection dates, fee & step-by-step process",
    href: "/objection-tracker",
    icon: AlertTriangle,
    color: "from-red-500 to-rose-500",
    shadow: "shadow-red-200",
  },
  {
    title: "Counselling & DV Guide",
    description: "Post-result counselling, document verification & joining process",
    href: "/counselling-guide",
    icon: Users,
    color: "from-cyan-500 to-teal-500",
    shadow: "shadow-cyan-200",
  },
  {
    title: "Difficulty Meter",
    description: "Subject-wise exam difficulty based on past data analysis",
    href: "/difficulty-meter",
    icon: Signal,
    color: "from-violet-500 to-purple-500",
    shadow: "shadow-violet-200",
  },
];

export default function ToolsPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100dvh-4rem)] bg-gradient-to-br from-gray-50 to-teal-50 pb-20 lg:pb-10">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Free Tools</h1>
              <p className="mt-2 text-gray-500 text-sm sm:text-base">
                Handy utilities for competitive exam preparation
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tools.map((t) => {
                const Icon = t.icon;
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="group rounded-2xl bg-white p-4 lg:p-5 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    <span
                      className={`inline-flex h-9 w-9 lg:h-10 lg:w-10 items-center justify-center rounded-xl bg-gradient-to-br ${t.color} ${t.shadow} shadow-sm`}
                    >
                      <Icon className="h-4.5 w-4.5 lg:h-5 lg:w-5 text-white" />
                    </span>
                    <h2 className="mt-3 text-sm lg:text-base font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                      {t.title}
                    </h2>
                    <p className="mt-1 text-xs lg:text-sm text-gray-500 leading-relaxed line-clamp-2">{t.description}</p>
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
