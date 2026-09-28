"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Mic, X, RotateCcw, AlertCircle, Sparkles } from "lucide-react";

interface VoiceSearchBtnProps {
  onResult?: (transcript: string) => void;
  className?: string;
}

export function VoiceSearchBtn({ onResult, className }: VoiceSearchBtnProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [errorType, setErrorType] = useState<"PERMISSION" | "NO_SPEECH" | "NETWORK" | "GENERIC" | null>(null);
  const [lang, setLang] = useState<"en-IN" | "hi-IN">("en-IN");

  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isHindi = lang === "hi-IN";

  const stopRecognition = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startRecognition = useCallback(
    async (selectedLang = lang) => {
      stopRecognition();
      setErrorType(null);
      setTranscript("");

      if (typeof window === "undefined") return;

      // Request browser media permission first to trigger native browser prompt
      if (navigator?.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach((track) => track.stop());
        } catch (err: any) {
          setIsListening(false);
          if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
            setErrorType("PERMISSION");
            return;
          }
        }
      }

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setErrorType("GENERIC");
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = selectedLang;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          setErrorType(null);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          let isFinal = false;

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const piece = event.results[i][0].transcript;
            currentTranscript += piece;
            if (event.results[i].isFinal) {
              isFinal = true;
            }
          }

          setTranscript(currentTranscript);

          if (isFinal && currentTranscript.trim()) {
            const finalQuery = currentTranscript.trim();
            stopRecognition();
            setTimeout(() => {
              setIsOpen(false);
              if (onResult) {
                onResult(finalQuery);
              } else {
                router.push(`/search?q=${encodeURIComponent(finalQuery)}`);
              }
            }, 500);
          }
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          const err = event.error;
          if (err === "not-allowed" || err === "service-not-allowed") {
            setErrorType("PERMISSION");
          } else if (err === "no-speech") {
            setErrorType("NO_SPEECH");
          } else if (err === "network") {
            setErrorType("NETWORK");
          } else if (err !== "aborted") {
            setErrorType("GENERIC");
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();

        timeoutRef.current = setTimeout(() => {
          stopRecognition();
          setErrorType("NO_SPEECH");
        }, 12000);
      } catch (e: any) {
        setIsListening(false);
        setErrorType("PERMISSION");
      }
    },
    [lang, onResult, router, stopRecognition]
  );

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
    startRecognition(lang);
  };

  const handleClose = () => {
    stopRecognition();
    setIsOpen(false);
    setErrorType(null);
    setTranscript("");
  };

  const switchLanguage = (newLang: "en-IN" | "hi-IN") => {
    setLang(newLang);
    startRecognition(newLang);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopRecognition();
    };
  }, [stopRecognition]);

  return (
    <>
      <button
        onClick={handleOpen}
        type="button"
        className={
          className ||
          "relative rounded-full p-2.5 text-white transition hover:bg-white/15 active:scale-90"
        }
        title="Voice search"
        aria-label="Search by voice"
      >
        <Mic className="h-4 w-4" />
      </button>

      {/* Voice Search Modal Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Language toggle pills: Pure English or Pure Hindi */}
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 p-1 text-xs font-semibold text-slate-600 mb-6">
              <button
                type="button"
                onClick={() => switchLanguage("en-IN")}
                className={`rounded-full px-3.5 py-1 transition ${
                  !isHindi
                    ? "bg-[#0D9488] text-white shadow-sm font-bold"
                    : "hover:text-slate-900"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => switchLanguage("hi-IN")}
                className={`rounded-full px-3.5 py-1 transition ${
                  isHindi
                    ? "bg-[#0D9488] text-white shadow-sm font-bold"
                    : "hover:text-slate-900"
                }`}
              >
                हिन्दी (Hindi)
              </button>
            </div>

            {/* Title / Heading */}
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
              {isListening
                ? isHindi ? "सुन रहे हैं..." : "Listening..."
                : errorType
                ? isHindi ? "पुनः प्रयास करें" : "Try Again"
                : isHindi ? "आवाज़ से खोजें" : "Voice Search"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 px-4">
              {isListening
                ? isHindi
                  ? "परीक्षा का नाम बोलें, जैसे 'SSC CGL', 'UPSC' या 'रेलवे'..."
                  : "Say the exam name, e.g., 'SSC CGL', 'UPSC', or 'Railway'..."
                : errorType
                ? isHindi
                  ? "पुनः प्रयास करने के लिए नीचे माइक्रोफ़ोन पर टैप करें"
                  : "Tap the microphone below to retry"
                : isHindi
                ? "अपने माइक्रोफ़ोन में बोलें"
                : "Speak into your microphone"}
            </p>

            {/* Animated Mic Button in Modal */}
            <div className="relative mx-auto my-6 flex items-center justify-center">
              {isListening && (
                <>
                  <div className="absolute h-28 w-28 animate-ping rounded-full bg-teal-400/30 duration-1000" />
                  <div className="absolute h-36 w-36 animate-pulse rounded-full bg-teal-500/15" />
                </>
              )}
              <button
                onClick={() => (isListening ? stopRecognition() : startRecognition())}
                type="button"
                className={`relative flex h-20 w-20 items-center justify-center rounded-full text-white shadow-xl transition-all active:scale-95 ${
                  isListening
                    ? "bg-gradient-to-tr from-teal-600 to-emerald-500 ring-4 ring-teal-200"
                    : errorType
                    ? "bg-slate-700 hover:bg-slate-800"
                    : "bg-teal-600 hover:bg-teal-700"
                }`}
                aria-label={isListening ? "Stop listening" : "Start listening"}
              >
                {isListening ? (
                  <Mic className="h-9 w-9 animate-pulse" />
                ) : (
                  <RotateCcw className="h-8 w-8" />
                )}
              </button>
            </div>

            {/* Live Recognized Speech Text Display */}
            {transcript && (
              <div className="mt-4 rounded-2xl bg-teal-50 p-4 border border-teal-200/60">
                <p className="text-[11px] font-bold uppercase tracking-wider text-teal-700 mb-1 flex items-center justify-center gap-1">
                  <Sparkles className="h-3 w-3" /> {isHindi ? "खोज रहे हैं" : "Searching For"}
                </p>
                <p className="text-lg font-black text-slate-900 break-words">
                  &ldquo;{transcript}&rdquo;
                </p>
              </div>
            )}

            {/* Error Message & Permission Guide */}
            {errorType === "PERMISSION" ? (
              <div className="mt-4 rounded-2xl bg-amber-50 p-4 border border-amber-200/80 text-amber-900 text-xs text-left">
                <div className="flex items-center gap-2 mb-2 font-bold text-amber-800 text-sm">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>
                    {isHindi ? "माइक्रोफ़ोन अनुमति अवरुद्ध है" : "Microphone Access Blocked"}
                  </span>
                </div>
                <p className="text-amber-800/90 mb-2 leading-relaxed">
                  {isHindi
                    ? "आपके ब्राउज़र ने माइक्रोफ़ोन को ब्लॉक कर रखा है। इसे चालू करने के लिए:"
                    : "Your browser has blocked microphone access. To enable it:"}
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-700 bg-white/80 p-3 rounded-xl border border-amber-200/50 leading-relaxed">
                  {isHindi ? (
                    <>
                      <li>ब्राउज़र एड्रेस बार में बाईं ओर स्थित <strong>लॉक 🔒</strong> या <strong>साइट सेटिंग्स 🎚️</strong> पर क्लिक करें।</li>
                      <li><strong>माइक्रोफ़ोन (Microphone)</strong> को <strong>&quot;Allow&quot;</strong> (चालू) करें।</li>
                      <li>नीचे दिए गए <strong>&quot;पुनः प्रयास करें&quot;</strong> बटन पर क्लिक करें।</li>
                    </>
                  ) : (
                    <>
                      <li>Click the <strong>Lock 🔒</strong> or <strong>Site Settings 🎚️</strong> icon on the left of your browser address bar.</li>
                      <li>Set <strong>Microphone</strong> to <strong>&quot;Allow&quot;</strong> or switch it <strong>ON</strong>.</li>
                      <li>Click the button below to retry.</li>
                    </>
                  )}
                </ol>
                <button
                  type="button"
                  onClick={() => startRecognition()}
                  className="mt-3 w-full rounded-xl bg-teal-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-teal-700 active:scale-95 transition"
                >
                  {isHindi ? "अनुमति दी, अब पुनः प्रयास करें 🎤" : "Allow & Retry Voice Search 🎤"}
                </button>
              </div>
            ) : errorType === "NO_SPEECH" ? (
              <div className="mt-4 rounded-2xl bg-amber-50 p-3.5 border border-amber-200/80 text-amber-800 text-xs flex items-start gap-2.5 text-left">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-semibold leading-relaxed">
                    {isHindi
                      ? "कोई आवाज़ सुनाई नहीं दी। कृपया स्पष्ट बोलें और पुनः प्रयास करें।"
                      : "No voice heard. Please speak clearly into your microphone and try again."}
                  </p>
                </div>
              </div>
            ) : errorType === "NETWORK" ? (
              <div className="mt-4 rounded-2xl bg-amber-50 p-3.5 border border-amber-200/80 text-amber-800 text-xs flex items-start gap-2.5 text-left">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-semibold leading-relaxed">
                    {isHindi
                      ? "इंटरनेट नेटवर्क त्रुटि। कृपया अपना इंटरनेट कनेक्शन जांचें।"
                      : "Speech recognition network error. Please check your internet connection."}
                  </p>
                </div>
              </div>
            ) : errorType === "GENERIC" ? (
              <div className="mt-4 rounded-2xl bg-amber-50 p-3.5 border border-amber-200/80 text-amber-800 text-xs flex items-start gap-2.5 text-left">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-semibold leading-relaxed">
                    {isHindi
                      ? "यह ब्राउज़र वॉयस सर्च को सपोर्ट नहीं करता। कृपया Chrome, Edge या Safari का उपयोग करें।"
                      : "Voice search is not supported in this browser. Please use Chrome, Edge, or Safari."}
                  </p>
                </div>
              </div>
            ) : null}

            {/* Footer helper */}
            <div className="mt-6 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
              {isHindi
                ? "Google Chrome, Microsoft Edge, Brave और Safari में सर्वोत्तम कार्य करता है"
                : "Works best in Google Chrome, Microsoft Edge, Brave & Safari"}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
