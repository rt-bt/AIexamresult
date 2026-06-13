"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Save, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { loadPrefs, savePrefs, type UserPrefs } from "@/lib/user-prefs";

const CATEGORIES = ["General (UR)", "OBC", "SC", "ST", "EWS", "PwD"];
const STATES = ["All India", "Andhra Pradesh", "Bihar", "Delhi", "Gujarat", "Haryana", "Karnataka", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal"];
const QUALIFICATIONS = ["10th Pass", "12th Pass", "ITI / Diploma", "Graduation", "Post Graduation", "Engineering", "Any Degree"];
const ALL_EXAMS = ["SSC CGL", "SSC CHSL", "SSC MTS", "SSC GD", "RRB NTPC", "RRB Group D", "IBPS PO", "IBPS Clerk", "SBI PO", "UPSC CSE", "CTET", "UPTET", "NEET", "JEE Main", "CUET", "Indian Army", "Indian Navy", "Indian Air Force"];

export default function DashboardSettingsPage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState<UserPrefs>({
    category: "", state: "", targetExams: [], qualification: "",
  });

  useEffect(() => {
    const loaded = loadPrefs();
    if (loaded) setPrefs(loaded);
  }, []);

  function toggleExam(exam: string) {
    setPrefs((p) => ({
      ...p,
      targetExams: p.targetExams.includes(exam)
        ? p.targetExams.filter((e) => e !== exam)
        : [...p.targetExams, exam],
    }));
  }

  function save() {
    savePrefs(prefs);
    setSaved(true);
    setTimeout(() => { setSaved(false); router.push("/dashboard"); }, 1200);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Personalized Dashboard</h1>
              <p className="mt-2 text-gray-500 text-sm">Set your preferences to see relevant exam updates</p>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
                <label className="text-sm font-bold text-gray-700">Your Category</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button key={c} onClick={() => setPrefs((p) => ({ ...p, category: c }))}
                      className={cn("rounded-full px-4 py-2 text-xs font-semibold border transition",
                        prefs.category === c ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-gray-200 hover:border-brand/30"
                      )}>{c}</button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
                <label className="text-sm font-bold text-gray-700">Qualification</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {QUALIFICATIONS.map((q) => (
                    <button key={q} onClick={() => setPrefs((p) => ({ ...p, qualification: q }))}
                      className={cn("rounded-full px-4 py-2 text-xs font-semibold border transition",
                        prefs.qualification === q ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-gray-200 hover:border-brand/30"
                      )}>{q}</button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
                <label className="text-sm font-bold text-gray-700">Your State</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {STATES.map((s) => (
                    <button key={s} onClick={() => setPrefs((p) => ({ ...p, state: s }))}
                      className={cn("rounded-full px-4 py-2 text-xs font-semibold border transition",
                        prefs.state === s ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-gray-200 hover:border-brand/30"
                      )}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
                <label className="text-sm font-bold text-gray-700">Target Exams</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ALL_EXAMS.map((e) => (
                    <button key={e} onClick={() => toggleExam(e)}
                      className={cn("rounded-full px-4 py-2 text-xs font-semibold border transition",
                        prefs.targetExams.includes(e) ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-gray-200 hover:border-brand/30"
                      )}>{prefs.targetExams.includes(e) && "✓ "}{e}</button>
                  ))}
                </div>
              </div>

              <button onClick={save} className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand/90 active:scale-[0.98]">
                {saved ? <><CheckCircle className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Preferences</>}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
