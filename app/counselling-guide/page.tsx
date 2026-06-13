"use client";

import { useState } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { GraduationCap, Users, FileCheck, CalendarDays, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const stages = [
  { phase: "Result Declaration", icon: FileCheck, desc: "Check official website. Download scorecard / merit list. Note your rank & marks." },
  { phase: "Document Verification", icon: Users, desc: "Original documents required: 10th, 12th, degree, caste, domicile, ID proof. Carry self-attested copies." },
  { phase: "Counselling Registration", icon: GraduationCap, desc: "Register online for counselling. Pay registration fee. Fill preference of posts/cadres." },
  { phase: "Choice Filling", icon: MapPin, desc: "Fill & lock post/city preferences carefully. Higher preference = better chance. Multiple rounds possible." },
  { phase: "Seat Allotment", icon: CalendarDays, desc: "Seat allotted based on rank, category & preference. Accept/reject within given timeline." },
  { phase: "Reporting to Institute", icon: MapPin, desc: "Report to allotted institute within deadline. Complete joining formalities & medical check." },
  { phase: "Training Period", icon: Users, desc: "Probation/training period (varies by exam). Salary during training is usually full basic." },
  { phase: "Permanent Appointment", icon: FileCheck, desc: "After successful training, permanent appointment letter issued. Pension & benefits start." },
];

const exams = ["SSC CGL", "RRB NTPC", "UPSC CSE", "IBPS PO", "SBI PO"];

const examDetails: Record<string, { stages: string; docs: string; rounds: string }> = {
  "SSC CGL": { stages: "Qualifying exam → Tier 2 → Skill test → Document verification → DPC", docs: "10th, 12th, Degree, Caste, Domicile, Photo ID", rounds: "Multiple DPC boards per ministry" },
  "RRB NTPC": { stages: "CBT 1 → CBT 2 → Typing test → Document verification → Medical exam", docs: "10th, 12th, ITI/Degree, Caste, Medical cert", rounds: "Single counselling — zone wise" },
  "UPSC CSE": { stages: "Prelims → Mains → Interview → Document verification → Foundation course", docs: "10th, 12th, Degree, Caste, Photo ID, DAF", rounds: "Service allocation based on rank & preference" },
  "IBPS PO": { stages: "Prelims → Mains → Interview → Document verification → Training", docs: "10th, 12th, Degree, Caste, Photo ID", rounds: "Single counselling per participating bank" },
  "SBI PO": { stages: "Prelims → Mains → Interview → Document verification → Training", docs: "10th, 12th, Degree, Caste, Photo ID", rounds: "Single counselling per circle" },
};

export default function CounsellingGuidePage() {
  const [exam, setExam] = useState("SSC CGL");
  const details = examDetails[exam];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Counselling & DV Guide</h1>
              <p className="mt-2 text-gray-500 text-sm">Post-result guidance: document verification, choice filling & joining</p>
            </div>

            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-lg">
              <label className="text-sm font-bold text-gray-700 mb-2">Select Exam</label>
              <div className="flex flex-wrap gap-1.5">
                {exams.map((e) => (
                  <button key={e} onClick={() => setExam(e)}
                    className={cn("rounded-full px-3 py-1.5 text-xs font-semibold border transition",
                      exam === e ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-gray-200"
                    )}>{e}</button>
                ))}
              </div>
              {details && (
                <div className="mt-4 space-y-2 text-xs text-gray-500">
                  <p><span className="font-bold text-gray-700">Stages:</span> {details.stages}</p>
                  <p><span className="font-bold text-gray-700">Required Docs:</span> {details.docs}</p>
                  <p><span className="font-bold text-gray-700">Counselling Rounds:</span> {details.rounds}</p>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              {stages.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.phase} className="flex items-start gap-4 rounded-xl bg-white border border-gray-100 p-4 shadow-sm">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-800">{s.phase}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
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
