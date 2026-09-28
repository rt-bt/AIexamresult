"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import {
  Brain, ChevronRight, RotateCcw, User, Calendar, Globe, Users, BarChart3, Award,
  Lightbulb, Target, Clock, CheckCircle, XCircle, ChevronLeft, Mail, AlertTriangle, Send, List,
} from "lucide-react";
import { generateQuestions, calculateIQ, getIQLabel, getIQColor } from "@/lib/iq-questions";

const countryList = [
  "India", "United States", "United Kingdom", "Canada", "Australia", "Pakistan", "Bangladesh", "Nepal", "Sri Lanka", "Afghanistan",
  "UAE", "Saudi Arabia", "Qatar", "Oman", "Kuwait", "Bahrain", "Malaysia", "Singapore", "Indonesia", "South Africa",
  "Kenya", "Nigeria", "Egypt", "Mauritius", "Fiji", "Germany", "France", "Italy", "Spain", "Brazil",
  "Other",
];

const TOTAL_TIME = 30 * 60; // 30 minutes in seconds

export default function IQTestPage() {
  const [step, setStep] = useState<"form" | "test" | "result">("form");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [lang, setLang] = useState("hi");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [showGrid, setShowGrid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionsRef = useRef(generateQuestions());
  const submittingRef = useRef(false);
  const questions = questionsRef.current;
  const answeredCount = useMemo(() => answers.filter((a) => a !== null).length, [answers]);

  const finishTest = useCallback(async (finalAnswers: (number | null)[]) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      await fetch("/api/iq-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, age: Number(age), gender, country, email,
          answers: finalAnswers.map((a) => a ?? -1),
          correctAnswers: questions.map((q) => q.correct),
        }),
      });
    } catch { /* silent */ }
    setStep("result");
    setSubmitting(false);
  }, [name, age, gender, country, email, questions]);

  const submitTest = useCallback(() => {
    const finalAnswers = [...answers];
    if (selectedAnswer !== null && finalAnswers[currentQ] === null) {
      finalAnswers[currentQ] = selectedAnswer;
    }
    setAnswers(finalAnswers);
    finishTest(finalAnswers);
  }, [answers, selectedAnswer, currentQ, finishTest]);

  // 30-min timer
  useEffect(() => {
    if (step !== "test") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          const curAnswers = [...answers];
          const curSelected = selectedAnswer;
          const curQ = currentQ;
          const final = [...curAnswers];
          if (curSelected !== null && final[curQ] === null) {
            final[curQ] = curSelected;
          }
          finishTest(final);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step]);

  // Initialize answers
  useEffect(() => {
    if (step === "test" && answers.length === 0) {
      setAnswers(new Array(questions.length).fill(null));
    }
  }, [step]);

  function startTest(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !age || !gender || !country || !email.trim()) return;
    questionsRef.current = generateQuestions();
    setStep("test");
    setCurrentQ(0);
    setAnswers(new Array(questions.length).fill(null));
    setSelectedAnswer(null);
    setTimeLeft(TOTAL_TIME);
    submittingRef.current = false;
  }

  function goToQuestion(idx: number) {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQ] = selectedAnswer;
      setAnswers(newAnswers);
    }
    setCurrentQ(idx);
    setSelectedAnswer(answers[idx]);
  }

  function goPrev() {
    if (currentQ > 0) {
      if (selectedAnswer !== null) {
        const newAnswers = [...answers];
        newAnswers[currentQ] = selectedAnswer;
        setAnswers(newAnswers);
      }
      setCurrentQ(currentQ - 1);
      setSelectedAnswer(answers[currentQ - 1]);
    }
  }

  function goNext() {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQ] = selectedAnswer;
      setAnswers(newAnswers);
    }
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(answers[currentQ + 1]);
    }
  }

  function restart() {
    questionsRef.current = generateQuestions();
    setStep("form");
    setCurrentQ(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setTimeLeft(TOTAL_TIME);
    submittingRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
  }

  const isCurrentAnswered = answers[currentQ] !== null;
  const finalScore = useMemo(
    () => step === "result" ? answers.filter((a, i) => a === questions[i].correct).length : 0,
    [step, answers]
  );
  const iq = step === "result" ? calculateIQ(finalScore, questions.length) : 0;
  const pct = step === "result" ? Math.round((finalScore / questions.length) * 100) : 0;

  const catBreakdown = useMemo(() => {
    if (step !== "result") return [];
    const cats: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q, i) => {
      if (!cats[q.category]) cats[q.category] = { correct: 0, total: 0 };
      cats[q.category].total++;
      if (answers[i] === q.correct) cats[q.category].correct++;
    });
    return Object.entries(cats).map(([name, data]) => ({ name, ...data }));
  }, [step, answers]);

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };
  const timerWarning = timeLeft < 300;

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
                  <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">IQ Test Series</h1>
                  <p className="mt-2 text-sm text-slate-500">20 Medium · 20 Advanced · 40 Questions</p>
                  <p className="mt-1 text-sm font-semibold text-amber-600">⏱ 30 minutes time limit</p>
                </div>

                <form onSubmit={startTest} className="space-y-4">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                      <User className="h-4 w-4 text-indigo-500" /> Full Name
                    </label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name" required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <Calendar className="h-4 w-4 text-indigo-500" /> Age
                      </label>
                      <input type="number" value={age} onChange={(e) => setAge(e.target.value)}
                        placeholder="Your age" min="5" max="120" required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100" />
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <Users className="h-4 w-4 text-indigo-500" /> Gender
                      </label>
                      <select value={gender} onChange={(e) => setGender(e.target.value)} required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:bg-white">
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
                    <select value={country} onChange={(e) => setCountry(e.target.value)} required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:bg-white">
                      <option value="">Select your country</option>
                      {countryList.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                      <Mail className="h-4 w-4 text-indigo-500" /> Email Address
                    </label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com" required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100" />
                  </div>

                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                      <Globe className="h-4 w-4 text-indigo-500" /> Language / भाषा
                    </label>
                    <select value={lang} onChange={(e) => setLang(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:bg-white">
                      <option value="hi">Hindi (हिंदी)</option>
                      <option value="en">English Only</option>
                    </select>
                  </div>

                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
                    <AlertTriangle className="mr-1.5 inline h-4 w-4 text-amber-600" />
                    30 minutes for 40 questions. You can navigate back and forth. Test auto-submits when time runs out.
                  </div>

                  <button type="submit"
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]">
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
                <p className="mt-2 text-sm text-slate-500">
                  {name} · {age} yrs · {gender} · {country} · {email}
                </p>

                <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-8">
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Your IQ Score</p>
                  <p className={`mt-2 text-6xl font-black ${getIQColor(iq)}`}>{iq}</p>
                  <p className={`mt-1 text-lg font-bold ${getIQColor(iq)}`}>{getIQLabel(iq)}</p>
                  <p className="mt-3 text-sm text-slate-500">
                    <strong className="text-slate-800">{finalScore}</strong> / {questions.length} correct ({pct}%)
                  </p>
                  <p className="mt-3 text-xs text-slate-400">
                    <CheckCircle className="mr-1 inline h-3 w-3 text-emerald-500" />
                    Result has been sent to admin. You will be contacted at {email}
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
                          <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                            style={{ width: `${(cat.correct / cat.total) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-6">
                  <button onClick={() => setShowReview(!showReview)}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 border border-indigo-200 px-5 py-2.5 text-sm font-bold text-indigo-700 transition-all hover:bg-indigo-100 active:scale-[0.98]">
                    <List className="h-4 w-4" />
                    {showReview ? "Hide Answer Review" : "Show Answer Review"}
                  </button>
                </div>

                {showReview && (
                  <div className="mt-6 space-y-4 text-left">
                    {questions.map((q, i) => {
                      const userAns = answers[i];
                      const isCorrect = userAns === q.correct;
                      const expText = lang === "hi" && q.explanationHi ? q.explanationHi : q.explanation;
                      return (
                        <div key={i} className={`rounded-xl border-2 p-4 ${isCorrect ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
                          <div className="mb-2 flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-600 border border-slate-200">
                              {i + 1}
                            </span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isCorrect ? "bg-emerald-200 text-emerald-800" : "bg-red-200 text-red-800"}`}>
                              {isCorrect ? "Correct" : "Wrong"}
                            </span>
                            <span className="text-[10px] text-slate-400 ml-auto">{q.category}</span>
                          </div>

                          <p className="text-sm font-semibold text-slate-800">{q.question}</p>

                          {q.svg && (
                            <div className="mt-2 flex justify-center">
                              <div className="flex w-full max-w-[240px] items-center justify-center rounded-lg border border-slate-200 bg-white p-1"
                                dangerouslySetInnerHTML={{ __html: q.svg }} />
                            </div>
                          )}

                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                            <span className="font-medium text-slate-600">
                              Your answer: 
                              {userAns !== null && userAns !== undefined && q.svgOptions?.[userAns] ? (
                                <span className="inline-flex ml-1 align-middle" dangerouslySetInnerHTML={{ __html: q.svgOptions[userAns] }} />
                              ) : (
                                <span className={isCorrect ? "text-emerald-700 font-bold" : "text-red-700 font-bold"}>
                                  {userAns !== null && userAns !== undefined ? q.options[userAns] : "Not answered"}
                                </span>
                              )}
                            </span>
                            {!isCorrect && (
                              <span className="font-medium text-slate-600">
                                Correct: 
                                {q.svgOptions?.[q.correct] ? (
                                  <span className="inline-flex ml-1 align-middle" dangerouslySetInnerHTML={{ __html: q.svgOptions[q.correct] }} />
                                ) : (
                                  <span className="text-emerald-700 font-bold">{q.options[q.correct]}</span>
                                )}
                              </span>
                            )}
                          </div>

                          <div className="mt-2 rounded-lg bg-white/70 border border-slate-100 px-3 py-2 text-xs text-slate-600 leading-relaxed">
                            <span className="font-semibold text-slate-700">Solution: </span>{expText}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <button onClick={restart}
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:scale-[0.98]">
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
        <div className="container-page py-4 sm:py-6">
          <div className="mx-auto max-w-3xl">
            {/* Top Bar - Always visible */}
            <div className="sticky top-0 z-30 mb-4 flex items-center justify-between rounded-b-none rounded-t-xl border border-slate-200 bg-white/95 px-4 py-2.5 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-600">
                  {answeredCount}/{questions.length}
                </span>
                <span className={`flex items-center gap-1 text-xs font-bold ${timerWarning ? "text-red-600 animate-pulse" : "text-slate-600"}`}>
                  <Clock className="h-3.5 w-3.5" /> {fmtTime(timeLeft)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowGrid(!showGrid)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-95">
                  <List className="mr-1 inline h-3 w-3" /> Grid
                </button>
                <button onClick={submitTest}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-red-700 active:scale-95">
                  Submit
                </button>
              </div>
            </div>

            {/* Question Grid */}
            {showGrid && (
              <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap gap-1.5">
                  {questions.map((_, i) => (
                    <button key={i} onClick={() => { goToQuestion(i); setShowGrid(false); }}
                      className={`h-8 w-8 rounded-lg text-[11px] font-bold transition active:scale-90 ${
                        i === currentQ
                          ? "bg-indigo-600 text-white ring-2 ring-indigo-200"
                          : answers[i] !== null
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Bar */}
            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
            </div>

            {/* Question Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700">
                  Q{currentQ + 1} · {questions[currentQ].category}
                </span>
                {isCurrentAnswered && (
                  <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    Answered
                  </span>
                )}
              </div>

              {questions[currentQ].svg && (
                <div className="mb-6 flex justify-center">
                  <div className="flex w-full max-w-[300px] items-center justify-center rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:max-w-[350px]"
                    dangerouslySetInnerHTML={{ __html: questions[currentQ].svg || "" }} />
                </div>
              )}

              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{currentQ + 1}. {questions[currentQ].question}</h2>

              {lang === "hi" && questions[currentQ].questionHi && (
                <p className="mt-2 text-sm font-medium text-indigo-600/80 border-l-2 border-indigo-300 pl-3">
                  {currentQ + 1}. {questions[currentQ].questionHi}
                </p>
              )}

              <div className="mt-6 grid grid-cols-2 gap-3">
                {questions[currentQ].options.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const optHi = questions[currentQ].optionsHi?.[idx];
                  const optSvg = questions[currentQ].svgOptions?.[idx];
                  return (
                    <button key={idx}
                      onClick={() => setSelectedAnswer(idx)}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-3 text-center text-sm font-medium transition-all ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50 text-indigo-800 ring-2 ring-indigo-200"
                          : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50"
                      }`}>
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-bold ${
                        isSelected ? "border-indigo-500 bg-indigo-500 text-white" : "border-slate-300"
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {optSvg ? (
                        <span className="flex items-center justify-center" dangerouslySetInnerHTML={{ __html: optSvg }} />
                      ) : (
                        <span className="flex flex-col items-center">
                          <span>{opt}</span>
                          {lang === "hi" && optHi && optHi !== opt && (
                            <span className="text-[10px] text-indigo-500/70">({optHi})</span>
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Nav Buttons */}
              <div className="mt-6 flex items-center justify-between">
                <button onClick={goPrev} disabled={currentQ === 0}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>

                {currentQ < questions.length - 1 ? (
                  <button onClick={goNext}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]">
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button onClick={submitTest} disabled={submitting}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]">
                    {submitting ? "Submitting..." : <><Send className="h-4 w-4" /> Submit Test</>}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}