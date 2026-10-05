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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/20 bg-[#111111]/95 p-6 shadow-2xl text-center backdrop-blur-2xl text-white font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top gradient highlight */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#FFD84D] via-[#FF5B3E] to-[#FFD84D]" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition active:scale-95"
              aria-label="Close"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Language toggle pills */}
            <div className="inline-flex items-center gap-1 rounded-full bg-white/10 p-1 text-xs font-semibold text-white/70 mb-5">
              <button
                type="button"
                onClick={() => switchLanguage("en-IN")}
                className={`rounded-full px-3 py-1 transition ${
                  !isHindi
                    ? "bg-[#FFD84D] text-[#111111] font-bold shadow-xs"
                    : "hover:text-white"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => switchLanguage("hi-IN")}
                className={`rounded-full px-3 py-1 transition ${
                  isHindi
                    ? "bg-[#FFD84D] text-[#111111] font-bold shadow-xs"
                    : "hover:text-white"
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Status Heading */}
            <h3 className="text-xl font-bold font-heading tracking-tight mb-1 text-white">
              {isListening
                ? isHindi ? "सुन रहे हैं..." : "Listening..."
                : errorType
                ? isHindi ? "पुनः प्रयास करें" : "Try Again"
                : isHindi ? "बोलिए..." : "Speak now..."}
            </h3>

            <p className="text-xs text-white/60 mb-6">
              {isListening
                ? isHindi
                  ? "परीक्षा का नाम बोलें (जैसे 'SSC CGL', 'UPSC')..."
                  : "Say exam name (e.g. 'SSC CGL', 'Railway')..."
                : errorType === "PERMISSION"
                ? isHindi
                  ? "माइक्रोफ़ोन की अनुमति दें"
                  : "Allow microphone access to search"
                : isHindi
                ? "माइक पर टैप करके बोलें"
                : "Tap the mic and speak"}
            </p>

            {/* Mic Animation */}
            <div className="relative mx-auto my-5 flex items-center justify-center">
              {isListening && (
                <>
                  <div className="absolute h-24 w-24 animate-ping rounded-full bg-[#FF5B3E]/30 duration-1000" />
                  <div className="absolute h-32 w-32 animate-pulse rounded-full bg-[#FFD84D]/15" />
                </>
              )}
              <button
                onClick={() => (isListening ? stopRecognition() : startRecognition())}
                type="button"
                className={`relative flex h-18 w-18 items-center justify-center rounded-full text-white shadow-xl transition-all active:scale-95 ${
                  isListening
                    ? "bg-gradient-to-tr from-[#FF5B3E] to-[#FFD84D] text-[#111111] ring-4 ring-[#FF5B3E]/30"
                    : errorType
                    ? "bg-white/10 hover:bg-white/20 text-white"
                    : "bg-[#FF5B3E] hover:bg-[#e0482d] text-white"
                }`}
                aria-label={isListening ? "Stop listening" : "Start listening"}
              >
                {isListening ? (
                  <Mic className="h-8 w-8 animate-pulse text-[#111111]" />
                ) : (
                  <RotateCcw className="h-7 w-7 text-white" />
                )}
              </button>
            </div>

            {/* Live Recognized Speech Text Display */}
            {transcript && (
              <div className="mt-4 rounded-xl bg-white/10 p-3.5 border border-white/15">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#FFD84D] mb-1 flex items-center justify-center gap-1">
                  <Sparkles className="h-3 w-3" /> {isHindi ? "पहचाना गया शब्द" : "Recognized"}
                </p>
                <p className="text-base font-bold text-white break-words">
                  &ldquo;{transcript}&rdquo;
                </p>
              </div>
            )}

            {/* Clean Error Message */}
            {errorType && (
              <div className="mt-4 rounded-xl bg-white/10 p-3 border border-white/15 text-xs text-white/80 flex items-center gap-2 text-left">
                <AlertCircle className="h-4 w-4 shrink-0 text-[#FF5B3E]" />
                <p className="leading-snug">
                  {errorType === "PERMISSION"
                    ? isHindi
                      ? "कृपया ब्राउज़र में माइक्रोफ़ोन की अनुमति (Allow) चालू करें।"
                      : "Please allow microphone permission in your browser."
                    : errorType === "NO_SPEECH"
                    ? isHindi
                      ? "कोई आवाज़ नहीं मिली। कृपया दोबारा बोलें।"
                      : "No speech detected. Please speak clearly."
                    : isHindi
                    ? "कृपया पुनः प्रयास करें।"
                    : "Unable to hear voice. Please try again."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
