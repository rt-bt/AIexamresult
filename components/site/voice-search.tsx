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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lang, setLang] = useState<"en-IN" | "hi-IN">("en-IN");

  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    (selectedLang = lang) => {
      stopRecognition();
      setErrorMsg(null);
      setTranscript("");

      if (typeof window === "undefined") return;
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setErrorMsg(
          "Voice search is not supported in this browser. Please open in Google Chrome, Microsoft Edge, or Safari."
        );
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
          setErrorMsg(null);
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
            // Allow user to briefly see recognized search query
            setTimeout(() => {
              setIsOpen(false);
              if (onResult) {
                onResult(finalQuery);
              } else {
                router.push(`/search?q=${encodeURIComponent(finalQuery)}`);
              }
            }, 600);
          }
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          const err = event.error;
          if (err === "not-allowed" || err === "service-not-allowed") {
            setErrorMsg(
              "Microphone access was denied. Please click the lock or camera/mic icon in your browser address bar to allow microphone access, then retry."
            );
          } else if (err === "no-speech") {
            setErrorMsg("No voice heard. Please speak clearly into your microphone and try again.");
          } else if (err === "network") {
            setErrorMsg("Speech recognition network error. Please check your internet connection.");
          } else if (err !== "aborted") {
            setErrorMsg("Could not hear clearly. Please tap the microphone to try again.");
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();

        // Safety timeout in case no response after 12s
        timeoutRef.current = setTimeout(() => {
          stopRecognition();
          setErrorMsg("Listening timed out. Tap the microphone to try again.");
        }, 12000);
      } catch (e: any) {
        setIsListening(false);
        setErrorMsg("Could not access microphone. Please check browser permissions.");
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
    setErrorMsg(null);
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
              aria-label="Close voice search"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Language toggle pills */}
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 p-1 text-xs font-semibold text-slate-600 mb-6">
              <button
                type="button"
                onClick={() => switchLanguage("en-IN")}
                className={`rounded-full px-3 py-1 transition ${
                  lang === "en-IN"
                    ? "bg-[#0D9488] text-white shadow-sm"
                    : "hover:text-slate-900"
                }`}
              >
                English / Hinglish
              </button>
              <button
                type="button"
                onClick={() => switchLanguage("hi-IN")}
                className={`rounded-full px-3 py-1 transition ${
                  lang === "hi-IN"
                    ? "bg-[#0D9488] text-white shadow-sm"
                    : "hover:text-slate-900"
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Title / Heading */}
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
              {isListening ? "Listening..." : errorMsg ? "Try Again" : "Voice Search"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 px-4">
              {isListening
                ? "Say exam name e.g. 'SSC CGL', 'UPSC Form', or 'Railway NTPC'..."
                : errorMsg
                ? "Tap the microphone below to retry"
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
                    : errorMsg
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
                  <Sparkles className="h-3 w-3" /> Searching For
                </p>
                <p className="text-lg font-black text-slate-900 break-words">
                  &ldquo;{transcript}&rdquo;
                </p>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="mt-4 rounded-2xl bg-amber-50 p-3.5 border border-amber-200/80 text-amber-800 text-xs flex items-start gap-2.5 text-left">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-semibold leading-relaxed">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Footer helper */}
            <div className="mt-6 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
              Works best in Google Chrome, Microsoft Edge, Brave & Safari
            </div>
          </div>
        </div>
      )}
    </>
  );
}
