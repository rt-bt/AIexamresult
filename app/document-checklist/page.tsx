"use client";

import { useState } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CheckCircle, XCircle, Download, Printer, FileText, User, CreditCard, Camera, Award, Stethoscope, MapPin, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type Category = "general" | "obc" | "sc" | "st" | "ews" | "pwd";

type Doc = {
  label: string;
  icon: React.ReactNode;
  required: Category[];
  note?: string;
};

const categories: { key: Category; label: string }[] = [
  { key: "general", label: "General (UR)" },
  { key: "obc", label: "OBC" },
  { key: "sc", label: "SC" },
  { key: "st", label: "ST" },
  { key: "ews", label: "EWS" },
  { key: "pwd", label: "PwD" },
];

const docs: Doc[] = [
  { label: "10th Marksheet & Certificate", icon: <BookOpen className="h-4 w-4" />, required: ["general", "obc", "sc", "st", "ews", "pwd"] },
  { label: "12th Marksheet & Certificate", icon: <BookOpen className="h-4 w-4" />, required: ["general", "obc", "sc", "st", "ews", "pwd"] },
  { label: "Graduation Degree & Marksheet", icon: <Award className="h-4 w-4" />, required: ["general", "obc", "sc", "st", "ews", "pwd"] },
  { label: "Aadhar Card / ID Proof", icon: <CreditCard className="h-4 w-4" />, required: ["general", "obc", "sc", "st", "ews", "pwd"] },
  { label: "Passport Size Photographs", icon: <Camera className="h-4 w-4" />, required: ["general", "obc", "sc", "st", "ews", "pwd"] },
  { label: "Signature Scan", icon: <FileText className="h-4 w-4" />, required: ["general", "obc", "sc", "st", "ews", "pwd"] },
  { label: "Category Certificate (Caste)", icon: <User className="h-4 w-4" />, required: ["obc", "sc", "st"], note: "Valid OBC-NCL certificate required" },
  { label: "EWS Certificate", icon: <User className="h-4 w-4" />, required: ["ews"], note: "Income below ₹8 lakh, valid format" },
  { label: "PwD Disability Certificate", icon: <Stethoscope className="h-4 w-4" />, required: ["pwd"], note: "40%+ disability, issued by govt hospital" },
  { label: "Domicile / State Certificate", icon: <MapPin className="h-4 w-4" />, required: ["general", "obc", "sc", "st", "ews", "pwd"], note: "As per state requirement" },
  { label: "Admit Card (Printed)", icon: <FileText className="h-4 w-4" />, required: ["general", "obc", "sc", "st", "ews", "pwd"] },
  { label: "Medical Certificate", icon: <Stethoscope className="h-4 w-4" />, required: ["general", "obc", "sc", "st", "ews", "pwd"], note: "For defence/physically demanding posts" },
];

export default function DocumentChecklistPage() {
  const [selected, setSelected] = useState<Category[]>([]);
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggleCategory(cat: Category) {
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setChecked(new Set());
  }

  const filteredDocs = selected.length > 0
    ? docs.filter((d) => d.required.some((r) => selected.includes(r)))
    : docs;

  function toggleCheck(idx: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  }

  function resetAll() { setChecked(new Set()); }

  const allChecked = filteredDocs.length > 0 && filteredDocs.every((_, i) => checked.has(i));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20 lg:pb-10">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Document Checklist</h1>
              <p className="mt-2 text-gray-500 text-sm">Select your category and get a personalized list of required documents</p>
            </div>

            {/* Category selector */}
            <div className="mb-6 flex flex-wrap justify-center gap-2">
              {categories.map((c) => (
                <button
                  key={c.key}
                  onClick={() => toggleCategory(c.key)}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-semibold border transition",
                    selected.includes(c.key)
                      ? "bg-brand text-white border-brand shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-brand/30 hover:text-brand"
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
            {selected.length === 0 && (
              <p className="mb-6 text-center text-xs text-gray-400">Select at least one category above to filter documents</p>
            )}

            {/* Progress */}
            {filteredDocs.length > 0 && (
              <div className="mb-4 flex items-center justify-between rounded-xl bg-white border border-gray-100 px-4 py-3 shadow-sm">
                <span className="text-sm text-gray-600">
                  <span className="font-bold text-brand">{checked.size}</span>/{filteredDocs.length} prepared
                </span>
                <div className="flex gap-2">
                  <button onClick={resetAll} className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition">Reset</button>
                  <button
                    onClick={() => Array.from({ length: filteredDocs.length }, (_, i) => toggleCheck(i))}
                    className="text-xs font-semibold text-brand hover:text-brand/80 transition"
                  >
                    {allChecked ? "Uncheck All" : "Check All"}
                  </button>
                </div>
              </div>
            )}

            {/* Document list */}
            <div className="space-y-2">
              {filteredDocs.map((doc, i) => {
                const isChecked = checked.has(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggleCheck(i)}
                    className={cn(
                      "flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-all",
                      isChecked
                        ? "border-emerald-200 bg-emerald-50 shadow-sm"
                        : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                    )}
                  >
                    <span className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition",
                      isChecked ? "bg-emerald-100 text-emerald-600" : "bg-gray-50 text-gray-400"
                    )}>
                      {isChecked ? <CheckCircle className="h-5 w-5" /> : doc.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className={cn(
                        "text-sm font-semibold transition",
                        isChecked ? "text-emerald-700 line-through" : "text-gray-800"
                      )}>
                        {doc.label}
                      </span>
                      {doc.note && <p className="mt-0.5 text-xs text-gray-400">{doc.note}</p>}
                    </div>
                    {isChecked ? (
                      <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                    ) : (
                      <div className="h-5 w-5 shrink-0 rounded-full border-2 border-gray-200" />
                    )}
                  </button>
                );
              })}
            </div>

            {filteredDocs.length === 0 && (
              <div className="rounded-2xl bg-white border border-gray-100 p-12 text-center shadow-sm">
                <FileText className="mx-auto h-10 w-10 text-gray-200" />
                <p className="mt-3 text-gray-400 text-sm">Select a category to see required documents</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
