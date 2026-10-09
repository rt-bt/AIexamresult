"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Bot,
  Sparkles,
  X,
  Minus,
  Send,
  Calendar,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

interface SearchResultItem {
  title: string;
  category: string;
  categorySlug: string;
  slug: string;
  url: string;
  date: string;
  excerpt: string;
  officialUrl?: string;
  importantDates?: string[];
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  results?: SearchResultItem[];
  source?: "ai_grounded" | "website_content";
  timestamp: string;
  error?: boolean;
}

const WELCOME_MESSAGE = `Namaste! 👋 Main AIExamResult AI Assistant hoon.

Aapko Government Jobs, Exam Results, Admit Cards, Answer Keys ya Admissions ke baare mein kya jaanna hai?

Apna sawaal Hindi, Hinglish ya English mein poochhein.`;

const DEFAULT_SUGGESTIONS = [
  "Latest Government Jobs",
  "Check Exam Results",
  "Find Admit Card",
  "Answer Keys",
  "Bihar Government Jobs",
  "Search an Exam",
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: WELCOME_MESSAGE,
      timestamp: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized, loading]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const sendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setInput("");
    const userMsgId = `user-${Date.now()}`;
    const userMessage: Message = {
      id: userMsgId,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorText = data.error || "Maaf kijiye, abhi response load nahi ho paya. Kripya punah prayas karein.";
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content: errorText,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            error: true,
          },
        ]);
      } else {
        const assistantMessage: Message = {
          id: `asst-${Date.now()}`,
          role: "assistant",
          content: data.answer,
          results: data.results,
          source: data.source,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
          setSuggestions(data.suggestions);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Network issue ya server timeout. Kripya connection check karein aur dobara poochhein.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: WELCOME_MESSAGE,
        timestamp: "Just now",
      },
    ]);
    setSuggestions(DEFAULT_SUGGESTIONS);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 flex items-center gap-2">
          {/* Subtle desktop helper pill */}
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="hidden md:flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-lg border border-blue-100 hover:bg-blue-50 transition active:scale-95"
            aria-label="Ask AIExamResult Assistant"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
            <span>Ask AI Assistant</span>
          </button>

          {/* Launcher Circle */}
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-blue-700 to-blue-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white focus:outline-none focus:ring-4 focus:ring-blue-300"
            aria-label="Open AIExamResult AI Assistant"
            title="Open AIExamResult AI Assistant"
          >
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
            </span>
            <Bot className="h-7 w-7 transition-transform group-hover:rotate-6" />
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-200 ease-out font-sans ${
            isMinimized
              ? "bottom-20 right-4 lg:bottom-6 lg:right-6 w-72 h-14"
              : "bottom-20 right-3 sm:right-4 lg:bottom-6 lg:right-6 w-[calc(100vw-1.5rem)] sm:w-[410px] max-h-[82vh] h-[580px] sm:h-[620px]"
          } flex flex-col rounded-2xl bg-white shadow-2xl border border-blue-200/90 overflow-hidden`}
          role="dialog"
          aria-labelledby="ai-chat-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-4 py-3 text-white shadow-sm select-none">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 id="ai-chat-title" className="text-sm font-bold tracking-tight leading-tight">
                  AIExamResult Assistant
                </h2>
                <div className="flex items-center gap-1.5 text-[11px] text-blue-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online • Instant Updates</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="rounded-lg p-1.5 text-blue-100 hover:bg-white/15 hover:text-white transition active:scale-90"
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-blue-100 hover:bg-white/15 hover:text-white transition active:scale-90"
                aria-label="Close chat"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body (only when not minimized) */}
          {!isMinimized && (
            <>
              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-tr-xs"
                          : msg.error
                          ? "bg-red-50 text-red-800 border border-red-200 rounded-tl-xs"
                          : "bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs"
                      }`}
                    >
                      {/* Message text with basic paragraph formatting */}
                      <div className="whitespace-pre-line space-y-1.5">
                        {msg.content}
                      </div>

                      {/* Structured Result Cards */}
                      {msg.results && msg.results.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Verified Posts Found ({msg.results.length})
                          </p>
                          {msg.results.map((item) => (
                            <div
                              key={item.slug}
                              className="rounded-xl border border-blue-100 bg-blue-50/40 p-2.5 transition hover:bg-blue-50/70"
                            >
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="inline-block rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 uppercase">
                                  {item.category}
                                </span>
                                {item.date && (
                                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                                    <Calendar className="h-3 w-3" />
                                    {item.date}
                                  </span>
                                )}
                              </div>

                              <Link
                                href={item.url}
                                onClick={() => {
                                  // keep widget responsive
                                }}
                                className="block text-xs font-semibold text-slate-900 hover:text-blue-700 leading-snug transition"
                              >
                                {item.title}
                              </Link>

                              {item.excerpt && (
                                <p className="mt-1 text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                                  {item.excerpt}
                                </p>
                              )}

                              <div className="mt-2 flex flex-wrap items-center gap-2 pt-1 border-t border-blue-100/60">
                                <Link
                                  href={item.url}
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  Read Details <ChevronRight className="h-3 w-3" />
                                </Link>

                                {item.officialUrl && (
                                  <a
                                    href={item.officialUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-800 hover:underline ml-auto"
                                    title="Open verified official notice"
                                  >
                                    Official Link <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Source attribution note */}
                      {msg.role === "assistant" && !msg.error && (
                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                          <span>{msg.timestamp}</span>
                          <span>AIExamResult Portal</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading typing indicator */}
                {loading && (
                  <div className="flex items-start">
                    <div className="rounded-2xl rounded-tl-xs bg-white border border-slate-200/90 px-4 py-3 shadow-sm text-xs text-slate-600 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
                        <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
                        <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" />
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">Searching AIExamResult...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions Quick Buttons */}
              {suggestions.length > 0 && !loading && (
                <div className="border-t border-slate-100 bg-white px-3 py-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                    {suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(sug)}
                        className="shrink-0 rounded-full bg-blue-50 border border-blue-200/80 px-2.5 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-100 hover:border-blue-300 active:scale-95 transition"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="border-t border-slate-200 bg-white p-3">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Poochhein (e.g. SSC CGL result, Bihar Police)..."
                    maxLength={500}
                    disabled={loading}
                    className="flex-1 rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:scale-95 disabled:opacity-40 disabled:hover:bg-blue-600 transition"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] text-slate-400">
                  <span className="truncate">Informational portal • Verify on official website</span>
                  <button
                    onClick={resetChat}
                    className="hover:text-slate-600 text-[10px] underline shrink-0 ml-1"
                    title="Reset conversation"
                  >
                    Clear chat
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
