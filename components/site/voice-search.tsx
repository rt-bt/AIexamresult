"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff } from "lucide-react";

type SpeechRecognitionEvent = {
  results: { [index: number]: { [index: number]: { transcript: string } } };
};

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

export function VoiceSearchBtn() {
  const router = useRouter();
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as unknown as Record<string, new () => SpeechRecognitionInstance>).SpeechRecognition ||
      (window as unknown as Record<string, new () => SpeechRecognitionInstance>).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "hi-IN";
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0][0].transcript;
      setListening(false);
      router.push(`/search?q=${encodeURIComponent(transcript)}`);
    };
    recognition.onerror = () => { setListening(false); setError("Try again"); setTimeout(() => setError(""), 2000); };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, [router]);

  function toggle() {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    if (!recognitionRef.current) {
      setError("Not supported");
      setTimeout(() => setError(""), 2000);
      return;
    }
    setError("");
    setListening(true);
    recognitionRef.current.start();
  }

  return (
    <button
      onClick={toggle}
      className={`relative rounded-full p-2.5 transition active:scale-90 ${
        listening ? "bg-red-500 text-white shadow-lg shadow-red-300 animate-pulse" : "text-white hover:bg-white/15"
      }`}
      title="Voice search"
    >
      {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      {error && (
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-0.5 text-[10px] text-white">
          {error}
        </span>
      )}
      {listening && (
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-red-500 px-2 py-0.5 text-[10px] text-white font-semibold">
          Listening...
        </span>
      )}
    </button>
  );
}
