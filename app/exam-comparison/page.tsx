"use client";

import { useState } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CheckCircle, XCircle, Minus, BarChart3, GraduationCap, IndianRupee, Users, Star, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type ExamData = {
  name: string;
  salary: string;
  eligibility: string;
  age: string;
  selection: string;
  difficulty: string;
  cutoff: string;
  posts: string;
  frequency: string;
};

const exams: ExamData[] = [
  {
    name: "SSC CGL",
    salary: "₹35,000 - ₹1,50,000/month",
    eligibility: "Bachelor's degree in any discipline",
    age: "18-32 years",
    selection: "Tier I (MCQ) → Tier II (MCQ) → Tier III (Descriptive) → Skill Test/Typing",
    difficulty: "Moderate",
    cutoff: "150-170 (UR), 130-150 (OBC), 120-140 (SC/ST)",
    posts: "Assistant, Inspector, Auditor, Tax Assistant, etc.",
    frequency: "Annual",
  },
  {
    name: "RRB NTPC (Railway)",
    salary: "₹25,000 - ₹1,10,000/month",
    eligibility: "12th pass / ITI / Bachelor's degree (post-dependent)",
    age: "18-36 years",
    selection: "CBT 1 → CBT 2 → Skill Test → Document Verification → Medical",
    difficulty: "Moderate",
    cutoff: "80-100 (UR), 70-85 (OBC), 60-75 (SC/ST)",
    posts: "Clerk, Station Master, Ticket Clerk, Goods Guard, etc.",
    frequency: "Annual/Biannual",
  },
  {
    name: "IBPS PO (Banking)",
    salary: "₹45,000 - ₹1,20,000/month",
    eligibility: "Bachelor's degree in any discipline",
    age: "20-30 years",
    selection: "Prelims → Mains → GD → Interview → Medical",
    difficulty: "Hard",
    cutoff: "55-65 (UR), 45-55 (OBC), 40-50 (SC/ST)",
    posts: "Probationary Officer, Bank PO",
    frequency: "Annual",
  },
  {
    name: "UPSC CSE",
    salary: "₹56,100 - ₹2,50,000/month",
    eligibility: "Bachelor's degree in any discipline",
    age: "21-32 years",
    selection: "Prelims (MCQ) → Mains (Descriptive) → Interview (Personality Test)",
    difficulty: "Very Hard",
    cutoff: "95-110 (UR), 85-95 (OBC), 75-85 (SC/ST)",
    posts: "IAS, IPS, IFS, IRS, etc.",
    frequency: "Annual",
  },
  {
    name: "AAI Junior Executive",
    salary: "₹40,000 - ₹1,40,000/month",
    eligibility: "Bachelor's degree in Engineering (B.E./B.Tech)",
    age: "18-27 years",
    selection: "Online Exam → Document Verification → Medical → Interview (for some posts)",
    difficulty: "Moderate-Hard",
    cutoff: "65-80 (UR), 55-65 (OBC), 45-55 (SC/ST)",
    posts: "Junior Executive (ATC, Engineering, Finance, etc.)",
    frequency: "As per requirement",
  },
  {
    name: "CTET (Teaching)",
    salary: "₹35,000 - ₹80,000/month (as per 7th CPC)",
    eligibility: "12th with 50% + 2-year D.El.Ed / Graduation + B.Ed",
    age: "No upper age limit",
    selection: "Paper I (Primary) / Paper II (Upper Primary) → Marks-based merit",
    difficulty: "Easy-Moderate",
    cutoff: "90-100 (UR), 80-90 (OBC), 70-80 (SC/ST) out of 150",
    posts: "Primary Teacher, Upper Primary Teacher (Govt schools)",
    frequency: "Twice a year",
  },
  {
    name: "Indian Army (Agniveer)",
    salary: "₹30,000 - ₹40,000/month (4 years) + ₹11-12 lakh (Seva Nidhi)",
    eligibility: "10th/12th pass (post-dependent)",
    age: "17.5-23 years",
    selection: "Physical Fitness Test → Written Exam → Medical → Document Verification",
    difficulty: "Moderate",
    cutoff: "Varies by region & category",
    posts: "Soldier GD, Technical, Clerk, Tradesman",
    frequency: "Multiple intake per year",
  },
];

const sections: { key: keyof ExamData; label: string; icon: React.ReactNode }[] = [
  { key: "salary", label: "Salary", icon: <IndianRupee className="h-3.5 w-3.5" /> },
  { key: "eligibility", label: "Qualification", icon: <GraduationCap className="h-3.5 w-3.5" /> },
  { key: "age", label: "Age Limit", icon: <Users className="h-3.5 w-3.5" /> },
  { key: "selection", label: "Selection Process", icon: <BarChart3 className="h-3.5 w-3.5" /> },
  { key: "difficulty", label: "Difficulty", icon: <Star className="h-3.5 w-3.5" /> },
  { key: "cutoff", label: "Cutoff Trend", icon: <BarChart3 className="h-3.5 w-3.5" /> },
  { key: "posts", label: "Posts Offered", icon: <BookOpen className="h-3.5 w-3.5" /> },
  { key: "frequency", label: "Frequency", icon: <BarChart3 className="h-3.5 w-3.5" /> },
];

function diffColor(d: string): string {
  const l = d.toLowerCase();
  if (l.includes("easy")) return "text-green-600 bg-green-50";
  if (l.includes("moderate") && !l.includes("hard")) return "text-yellow-600 bg-yellow-50";
  if (l.includes("hard") || l.includes("very")) return "text-red-600 bg-red-50";
  return "text-gray-600 bg-gray-50";
}

export default function ExamComparisonPage() {
  const [selected, setSelected] = useState<string[]>(["SSC CGL", "RRB NTPC (Railway)", "IBPS PO (Banking)"]);

  function toggleExam(name: string) {
    if (selected.includes(name)) {
      if (selected.length > 1) setSelected(selected.filter((s) => s !== name));
    } else {
      if (selected.length < 4) setSelected([...selected, name]);
    }
  }

  const compareExams = exams.filter((e) => selected.includes(e.name));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20 lg:pb-10">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Exam Comparison Tool</h1>
              <p className="mt-2 text-gray-500 text-sm sm:text-base">Compare salary, eligibility, selection process & difficulty across exams</p>
            </div>

            {/* Exam Selector */}
            <div className="mb-6 flex flex-wrap justify-center gap-2">
              {exams.map((e) => (
                <button
                  key={e.name}
                  onClick={() => toggleExam(e.name)}
                  disabled={!selected.includes(e.name) && selected.length >= 4}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-semibold border transition",
                    selected.includes(e.name)
                      ? "bg-brand text-white border-brand shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-brand/30 hover:text-brand"
                  )}
                >
                  {selected.includes(e.name) && <CheckCircle className="mr-1 inline h-3 w-3" />}
                  {e.name}
                </button>
              ))}
            </div>
            <p className="mb-8 text-center text-xs text-gray-400">Select up to 4 exams to compare</p>

            {/* Comparison Table */}
            {compareExams.length > 0 && (
              <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-lg shadow-gray-200/40">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-brand/5 to-transparent">
                      <th className="sticky left-0 z-10 min-w-[130px] bg-white px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                        Parameter
                      </th>
                      {compareExams.map((e) => (
                        <th key={e.name} className="px-4 py-4 text-center text-sm font-bold text-gray-800 border-b border-gray-100 min-w-[160px]">
                          {e.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {sections.map((sec) => (
                      <tr key={sec.key} className="hover:bg-gray-50/50">
                        <td className="sticky left-0 z-10 bg-white px-4 py-4 font-semibold text-gray-700 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2">
                            <span className="text-brand">{sec.icon}</span>
                            {sec.label}
                          </span>
                        </td>
                        {compareExams.map((e) => {
                          const val = e[sec.key];
                          const isDiff = sec.key === "difficulty";
                          return (
                            <td key={e.name} className="px-4 py-4 text-center align-top">
                              {isDiff ? (
                                <span className={cn("inline-block rounded-full px-2.5 py-1 text-xs font-semibold", diffColor(val))}>
                                  {val}
                                </span>
                              ) : (
                                <span className="text-xs leading-5 text-gray-600">{val}</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Quick Verdict */}
            <div className="mt-8 rounded-2xl bg-gradient-to-br from-brand to-emerald-700 p-6 text-white shadow-lg">
              <h3 className="text-lg font-bold">Quick Verdict</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {compareExams.map((e) => (
                  <div key={e.name} className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-sm font-bold">{e.name}</p>
                    <p className="mt-1 text-xs text-white/70">{e.salary}</p>
                    <p className="mt-0.5 text-xs text-white/50">Difficulty: {e.difficulty}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
