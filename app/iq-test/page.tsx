"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Brain, ChevronRight, RotateCcw, User, Calendar, Globe, Users, BarChart3, Award, Lightbulb, Target, Clock, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { iqQuestions, calculateIQ, getIQLabel, getIQColor, difficultyLabels } from "@/lib/iq-questions";

const countryList = [
  "India", "United States", "United Kingdom", "Canada", "Australia", "Pakistan", "Bangladesh", "Nepal", "Sri Lanka", "Afghanistan",
  "UAE", "Saudi Arabia", "Qatar", "Oman", "Kuwait", "Bahrain", "Malaysia", "Singapore", "Indonesia", "South Africa",
  "Kenya", "Nigeria", "Egypt", "Mauritius", "Fiji", "Germany", "France", "Italy", "Spain", "Brazil",
  "Other",
];

export default function IQTestPage() {
  const [step, setStep] = useState<"form" | "test" | "result">("form");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const questions = useMemo(() => iqQuestions, []);

  function startTest(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !age || !gender || !country) return;
    setStep("test");
    setCurrentQ(0);
    setAnswers([]);
    setSelectedAnswer(null);
  }

  function handleAnswer() {
    if (selectedAnswer === null) return;
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setShowExplanation(true);
      setTimeout(() => {
        setShowExplanation(false);
        setCurrentQ(currentQ + 1);
        setSelectedAnswer(null);
      }, 1200);
    } else {
      setShowExplanation(true);
      setTimeout(() => {
        setShowExplanation(false);
        setStep("result");
      }, 1200);
    }
  }

  function restart() {
    setStep("form");
    setCurrentQ(0);
    setAnswers([]);
    setSelectedAnswer(null);
  }

  const q = questions[currentQ];
  const isCorrect = selectedAnswer !== null && selectedAnswer === q?.correct;
  const score = answers.filter((a, i) => a === questions[i].correct).length + (selectedAnswer !== null && isCorrect ? 1 : 0);
  const finalScore = step === "result" ? answers.filter((a, i) => a === questions[i].correct).length : 0;
  const iq = step === "result" ? calculateIQ(finalScore, questions.length) : 0;

  const catBreakdown = useMemo(() => {
    if (step !== "result") return [];
    const cats: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q, i) => {
      if (!cats[q.category]) cats[q.category] = { correct: 0, total: 0 };
      cats[q.category].total++;
      if (answers[i] === q.correct) cats[q.category].correct++;
    });
    return Object.entries(cats).map(([name, data]) => ({ name, ...data }));
  }, [step, answers, questions]);

  if (step === "form") {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
          <div className="container-page py-10 sm:py-14">
            <div className="mx-auto max-w-lg">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                <div className="mb-8 text-center">
                  <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200">
                    <Brain className="h-8 w-8 text-white" />
                  </span>
                  <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">IQ Test</h1>
                  <p className="mt-2 text-sm text-slate-500">40 questions · 10 easy · 15 medium · 15 advanced</p>
                  <p className="mt-1 text-sm text-slate-500">No time limit. Choose the best answer for each question.</p>
                </div>

                <form onSubmit={startTest} className="space-y-4">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                      <User className="h-4 w-4 text-indigo-500" /> Full Name
                    </label>
                    <input
                      type="text" value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <Calendar className="h-4 w-4 text-indigo-500" /> Age
                      </label>
                      <input
                        type="number" value={age} onChange={(e) => setAge(e.target.value)}
                        placeholder="Your age" min="5" max="120" required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <Users className="h-4 w-4 text-indigo-500" /> Gender
                      </label>
                      <select
                        value={gender} onChange={(e) => setGender(e.target.value)} required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:bg-white"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                      <Globe className="h-4 w-4 text-indigo-500" /> Country
                    </label>
                    <select
                      value={country} onChange={(e) => setCountry(e.target.value)} required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:bg-white"
                    >
                      <option value="">Select your country</option>
                      {countryList.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
                    <Lightbulb className="mr-1.5 inline h-4 w-4 text-amber-600" />
                    There is no time limit. Answer at your own pace. You cannot go back to previous questions.
                  </div>

                  <button
                    type="submit"
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    <Brain className="h-4 w-4" /> Start IQ Test
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (step === "result") {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
          <div className="container-page py-10 sm:py-14">
            <div className="mx-auto max-w-2xl">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
                <span className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                  <Award className="h-10 w-10 text-white" />
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900">Test Complete!</h1>
                <p className="mt-2 text-sm text-slate-500">{name} · {age} yrs · {gender} · {country}</p>

                <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-8">
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Your IQ Score</p>
                  <p className={`mt-2 text-6xl font-black ${getIQColor(iq)}`}>{iq}</p>
                  <p className={`mt-1 text-lg font-bold ${getIQColor(iq)}`}>{getIQLabel(iq)}</p>
                  <p className="mt-3 text-sm text-slate-500">
                    You answered <strong className="text-slate-800">{finalScore}</strong> out of <strong className="text-slate-800">{questions.length}</strong> correctly ({Math.round((finalScore / questions.length) * 100)}%)
                  </p>
                </div>

                <div className="mt-8">
                  <h3 className="mb-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-700">
                    <BarChart3 className="h-4 w-4 text-indigo-500" /> Category Breakdown
                  </h3>
                  <div className="space-y-3">
                    {catBreakdown.map((cat) => (
                      <div key={cat.name} className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                        <div className="mb-1.5 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700">{cat.name}</span>
                          <span className="text-slate-500">{cat.correct}/{cat.total}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                            style={{ width: `${(cat.correct / cat.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={restart}
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:scale-[0.98]"
                >
                  <RotateCcw className="h-4 w-4" /> Take Test Again
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
        <div className="container-page py-6 sm:py-10">
          <div className="mx-auto max-w-2xl">
            {/* Progress Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Question {currentQ + 1} of {questions.length}</span>
                <span className={getIQColor(calculateIQ(score, currentQ + 1))}>
                  {Math.round((score / (currentQ + 1)) * 100)}% correct
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700">
                  {q.category}
                </span>
                <span className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${
                  q.difficulty === "easy" ? "bg-emerald-50 text-emerald-700" :
                  q.difficulty === "medium" ? "bg-amber-50 text-amber-700" :
                  "bg-red-50 text-red-700"
                }`}>
                  {difficultyLabels[q.difficulty]}
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{q.question}</h2>

              <div className="mt-6 space-y-2.5">
                {q.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const showCorrect = showExplanation && q.correct === idx;
                  const showWrong = showExplanation && isSelected && !isCorrect;
                  return (
                    <button
                      key={idx}
                      onClick={() => !showExplanation && setSelectedAnswer(idx)}
                      disabled={showExplanation}
                      className={`w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all ${
                        showCorrect
                          ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                          : showWrong
                          ? "border-red-400 bg-red-50 text-red-800"
                          : isSelected && !showExplanation
                          ? "border-indigo-500 bg-indigo-50 text-indigo-800"
                          : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50"
                      } ${showExplanation && !showCorrect && !showWrong ? "opacity-50" : ""}`}
                    >
                      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold mr-2.5 shrink-0 ${
                        showCorrect
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : showWrong
                          ? "border-red-400 bg-red-400 text-white"
                          : isSelected && !showExplanation
                          ? "border-indigo-500 bg-indigo-500 text-white"
                          : "border-slate-300"
                      }`}>
                        {showCorrect ? <CheckCircle className="h-3.5 w-3.5" /> : showWrong ? <XCircle className="h-3.5 w-3.5" /> : String.fromCharCode(65 + idx)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={handleAnswer}
                  disabled={selectedAnswer === null || showExplanation}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQ < questions.length - 1 ? (
                    <><ChevronRight className="h-4 w-4" /> Next</>
                  ) : (
                    <><CheckCircle className="h-4 w-4" /> See Results</>
                  )}
                </button>

                {showExplanation && (
                  <span className={`flex items-center gap-1.5 text-xs font-semibold ${
                    isCorrect ? "text-emerald-600" : "text-red-600"
                  }`}>
                    {isCorrect ? (
                      <><CheckCircle className="h-4 w-4" /> Correct!</>
                    ) : (
                      <><XCircle className="h-4 w-4" /> Incorrect</>
                    )}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {currentQ + 1} of {questions.length}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> No time limit</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
