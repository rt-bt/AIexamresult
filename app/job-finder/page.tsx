"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Search, Briefcase, GraduationCap, MapPin, Users, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const QUALIFICATIONS = ["10th Pass", "12th Pass", "ITI / Diploma", "Graduation", "Post Graduation", "Engineering", "B.Ed", "Any Degree"];
const STATES = ["All India", "Andhra Pradesh", "Bihar", "Delhi", "Gujarat", "Haryana", "Karnataka", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal"];
const CATEGORIES = ["General (UR)", "OBC", "SC", "ST", "EWS"];
const AGES = ["17-21", "18-25", "18-27", "18-30", "18-32", "18-35", "18-40", "21-32", "20-30", "No Limit"];

type Job = {
  title: string;
  slug: string;
  qualification: string[];
  age: string[];
  state: string[];
  category: string[];
  salary: string;
  tags: string[];
};

const jobs: Job[] = [
  { title: "SSC CGL", slug: "ssc-cgl", qualification: ["Graduation", "Any Degree"], age: ["18-32"], state: ["All India"], category: ["General (UR)", "OBC", "SC", "ST", "EWS"], salary: "₹35,000 - ₹1,50,000", tags: ["central", "popular"] },
  { title: "SSC CHSL", slug: "ssc-chsl", qualification: ["12th Pass"], age: ["18-27"], state: ["All India"], category: ["General (UR)", "OBC", "SC", "ST", "EWS"], salary: "₹30,000 - ₹80,000", tags: ["central"] },
  { title: "SSC MTS", slug: "ssc-mts", qualification: ["10th Pass"], age: ["18-25"], state: ["All India"], category: ["General (UR)", "OBC", "SC", "ST", "EWS"], salary: "₹25,000 - ₹50,000", tags: ["central"] },
  { title: "SSC GD Constable", slug: "ssc-gd", qualification: ["10th Pass", "12th Pass"], age: ["18-23"], state: ["All India"], category: ["General (UR)", "OBC", "SC", "ST", "EWS"], salary: "₹28,000 - ₹45,000", tags: ["central", "police"] },
  { title: "RRB NTPC", slug: "rrb-ntpc", qualification: ["12th Pass", "Graduation", "Any Degree"], age: ["18-36"], state: ["All India"], category: ["General (UR)", "OBC", "SC", "ST", "EWS"], salary: "₹25,000 - ₹1,10,000", tags: ["central", "railway"] },
  { title: "RRB Group D", slug: "rrb-group-d", qualification: ["10th Pass", "ITI / Diploma"], age: ["18-36"], state: ["All India"], category: ["General (UR)", "OBC", "SC", "ST", "EWS"], salary: "₹22,000 - ₹40,000", tags: ["central", "railway"] },
  { title: "IBPS PO", slug: "ibps-po", qualification: ["Graduation", "Any Degree"], age: ["20-30"], state: ["All India"], category: ["General (UR)", "OBC", "SC", "ST", "EWS"], salary: "₹45,000 - ₹1,20,000", tags: ["central", "banking"] },
  { title: "IBPS Clerk", slug: "ibps-clerk", qualification: ["12th Pass", "Graduation", "Any Degree"], age: ["20-28"], state: ["All India"], category: ["General (UR)", "OBC", "SC", "ST", "EWS"], salary: "₹25,000 - ₹60,000", tags: ["central", "banking"] },
  { title: "SBI PO", slug: "sbi-po", qualification: ["Graduation", "Any Degree"], age: ["21-30"], state: ["All India"], category: ["General (UR)", "OBC", "SC", "ST", "EWS"], salary: "₹50,000 - ₹1,40,000", tags: ["central", "banking"] },
  { title: "UPSC CSE", slug: "upsc-cse", qualification: ["Graduation", "Any Degree"], age: ["21-32"], state: ["All India"], category: ["General (UR)", "OBC", "SC", "ST", "EWS"], salary: "₹56,100 - ₹2,50,000", tags: ["central", "prestigious"] },
  { title: "CTET", slug: "ctet", qualification: ["12th Pass", "Graduation", "B.Ed"], age: ["No Limit"], state: ["All India"], category: ["General (UR)", "OBC", "SC", "ST", "EWS"], salary: "₹35,000 - ₹80,000", tags: ["teaching"] },
  { title: "UPTET", slug: "uptet", qualification: ["12th Pass", "Graduation", "B.Ed"], age: ["18-40"], state: ["Uttar Pradesh"], category: ["General (UR)", "OBC", "SC", "ST", "EWS"], salary: "₹35,000 - ₹70,000", tags: ["teaching", "state"] },
  { title: "UP Police Constable", slug: "up-police", qualification: ["10th Pass", "12th Pass"], age: ["18-22"], state: ["Uttar Pradesh"], category: ["General (UR)", "OBC", "SC", "ST", "EWS"], salary: "₹30,000 - ₹50,000", tags: ["police", "state"] },
  { title: "Bihar Police Constable", slug: "bihar-police", qualification: ["10th Pass", "12th Pass"], age: ["18-25"], state: ["Bihar"], category: ["General (UR)", "OBC", "SC", "ST", "EWS"], salary: "₹28,000 - ₹45,000", tags: ["police", "state"] },
  { title: "Indian Army Agniveer", slug: "indian-army-agniveer", qualification: ["10th Pass", "12th Pass"], age: ["17.5-23"], state: ["All India"], category: ["General (UR)", "OBC", "SC", "ST", "EWS"], salary: "₹30,000 - ₹40,000", tags: ["defence"] },
];

export default function JobFinderPage() {
  const [qual, setQual] = useState("");
  const [age, setAge] = useState("");
  const [state, setState] = useState("");
  const [cat, setCat] = useState("");

  const filtered = jobs.filter((j) => {
    if (qual && !j.qualification.some((q) => q.includes(qual) || qual.includes(q))) return false;
    if (state && state !== "All India" && !j.state.includes(state)) return false;
    return true;
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3.5 py-1 text-xs font-semibold text-teal-700 mb-3">
                <Zap className="h-3 w-3" /> Smart Suggest
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Mere Liye Kaunsi Govt Job?</h1>
              <p className="mt-2 text-gray-500 text-sm">Apni qualification, state & category select karein — site suitable exams suggest karegi</p>
            </div>

            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-lg shadow-gray-200/40 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-2"><GraduationCap className="h-4 w-4 text-brand" /> Qualification</label>
                  <div className="flex flex-wrap gap-1.5">
                    {QUALIFICATIONS.map((q) => (
                      <button key={q} onClick={() => setQual(qual === q ? "" : q)}
                        className={cn("rounded-full px-3 py-1.5 text-xs font-semibold border transition",
                          qual === q ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-gray-200 hover:border-brand/30"
                        )}>{q}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-2"><MapPin className="h-4 w-4 text-brand" /> State</label>
                  <div className="flex flex-wrap gap-1.5">
                    {STATES.slice(0, 10).map((s) => (
                      <button key={s} onClick={() => setState(state === s ? "" : s)}
                        className={cn("rounded-full px-3 py-1.5 text-xs font-semibold border transition",
                          state === s ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-gray-200 hover:border-brand/30"
                        )}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="mt-6 space-y-3">
              <p className="text-sm text-gray-500">{filtered.length} suitable job{filtered.length !== 1 ? "s" : ""} found</p>
              {filtered.map((j) => (
                <Link key={j.slug} href={`/post/${j.slug}`}
                  className="flex items-center justify-between gap-4 rounded-xl bg-white border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-brand/20 transition group">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-800 group-hover:text-brand transition">{j.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{j.salary} · {j.qualification.slice(0, 2).join(", ")}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 group-hover:text-brand" />
                </Link>
              ))}
              {filtered.length === 0 && (
                <div className="rounded-xl bg-white p-8 text-center text-sm text-gray-400">
                  <Briefcase className="mx-auto h-8 w-8 text-gray-200 mb-2" />
                  Select your qualification & state to see suggested jobs
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
