"use client";

import React from "react";
import { Check, Clock, Calendar, AlertCircle, Sparkles, Bell, ArrowRight } from "lucide-react";
import {
  TimelineData,
  TimelineStage,
  buildPostTimeline,
} from "@/lib/timeline";

interface ExamTimelineProps {
  post: any;
  className?: string;
  referenceDate?: string;
}

export function ExamTimeline({ post, className = "", referenceDate }: ExamTimelineProps) {
  const timeline: TimelineData = React.useMemo(() => {
    return buildPostTimeline(post, referenceDate);
  }, [post, referenceDate]);

  const { stages, currentStage, completedCount, totalStages } = timeline;

  if (!stages || stages.length === 0) return null;

  return (
    <section
      aria-label="Exam and Recruitment Timeline"
      className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md ${className}`}
    >
      {/* Header */}
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 via-teal-50/20 to-white px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand shadow-xs">
              <Clock className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-tight">
                Recruitment &amp; Exam Timeline
              </h2>
              <p className="text-xs text-gray-500">
                Official date-driven schedule tracker (IST)
              </p>
            </div>
          </div>

          {/* Current Live Stage Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                currentStage.status === "active"
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                  : currentStage.status === "completed"
                  ? "bg-brand/10 text-brand ring-brand/20"
                  : "bg-blue-50 text-blue-700 ring-blue-200"
              }`}
            >
              {currentStage.status === "active" && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
              )}
              {currentStage.status === "completed" && <Check className="h-3 w-3 stroke-[3]" />}
              {currentStage.status === "upcoming" && <Calendar className="h-3 w-3" />}
              <span>{currentStage.label}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* DESKTOP / TABLET STEPPER (Horizontal >= 640px) */}
        <div className="hidden sm:block">
          <div className="relative mb-6">
            <div className="flex items-start justify-between">
              {stages.map((stage: TimelineStage, idx: number) => {
                const isCompleted = stage.status === "completed";
                const isActive = stage.status === "active";
                const isUpcoming = stage.status === "upcoming";
                const isUnavailable = stage.status === "unavailable";

                // Connector line to next stage
                const nextStage = stages[idx + 1];
                const isNextConnected =
                  isCompleted && nextStage && (nextStage.status === "completed" || nextStage.status === "active");

                return (
                  <div key={stage.id} className="relative flex flex-1 flex-col items-center">
                    {/* Horizontal Connector Bar */}
                    {idx < stages.length - 1 && (
                      <div
                        className={`absolute top-4 left-1/2 w-full h-1 -translate-y-1/2 transition-all ${
                          isNextConnected ? "bg-brand" : "bg-gray-200"
                        }`}
                        aria-hidden="true"
                      />
                    )}

                    {/* Node Icon */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all shadow-xs ${
                          isCompleted
                            ? "bg-brand text-white ring-4 ring-brand/15"
                            : isActive
                            ? "bg-emerald-600 text-white ring-4 ring-emerald-200 scale-110 shadow-md"
                            : isUpcoming
                            ? "border-2 border-slate-300 bg-white text-slate-600"
                            : "border border-gray-200 bg-gray-100 text-gray-400"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-4 w-4 stroke-[2.5]" />
                        ) : isActive ? (
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white"></span>
                          </span>
                        ) : isUpcoming ? (
                          <span>{idx + 1}</span>
                        ) : (
                          <span>—</span>
                        )}
                      </div>

                      {/* Text Labels */}
                      <div className="mt-2.5 flex flex-col items-center text-center px-1">
                        <span
                          className={`text-xs font-bold leading-tight ${
                            isActive
                              ? "text-emerald-700 font-extrabold"
                              : isCompleted
                              ? "text-gray-900"
                              : isUpcoming
                              ? "text-gray-700"
                              : "text-gray-400"
                          }`}
                        >
                          {stage.shortLabel}
                        </span>

                        <span
                          className={`mt-1 text-[11px] leading-tight max-w-[110px] ${
                            isActive
                              ? "text-emerald-800 font-semibold"
                              : isCompleted
                              ? "text-gray-600"
                              : isUpcoming
                              ? "text-gray-500"
                              : "text-gray-400"
                          }`}
                        >
                          {stage.dateDisplay || "TBA"}
                        </span>

                        {/* Status Pill */}
                        <span
                          className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            isActive
                              ? "bg-emerald-100 text-emerald-800"
                              : isCompleted
                              ? "bg-teal-50 text-teal-700"
                              : isUpcoming
                              ? "bg-gray-100 text-gray-600"
                              : "bg-gray-50 text-gray-400"
                          }`}
                        >
                          {isActive
                            ? "Active"
                            : isCompleted
                            ? "Completed"
                            : isUpcoming
                            ? "Upcoming"
                            : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* MOBILE STEPPER (Vertical < 640px, 320px - 414px friendly, Zero Overflow) */}
        <div className="block sm:hidden">
          <div className="relative pl-6 space-y-4">
            {/* Vertical Connecting Line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200" aria-hidden="true" />

            {stages.map((stage: TimelineStage, idx: number) => {
              const isCompleted = stage.status === "completed";
              const isActive = stage.status === "active";
              const isUpcoming = stage.status === "upcoming";
              const isUnavailable = stage.status === "unavailable";

              return (
                <div key={stage.id} className="relative flex items-start gap-3">
                  {/* Left Bullet Node */}
                  <div
                    className={`absolute -left-6 top-0 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold shadow-xs ${
                      isCompleted
                        ? "bg-brand text-white ring-2 ring-brand/20"
                        : isActive
                        ? "bg-emerald-600 text-white ring-4 ring-emerald-100 scale-105"
                        : isUpcoming
                        ? "border border-slate-300 bg-white text-slate-600"
                        : "border border-gray-200 bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-3 w-3 stroke-[2.5]" />
                    ) : isActive ? (
                      <span className="relative flex h-2 w-2">
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                      </span>
                    ) : isUpcoming ? (
                      <span>{idx + 1}</span>
                    ) : (
                      <span>—</span>
                    )}
                  </div>

                  {/* Stage Card */}
                  <div
                    className={`flex-1 rounded-xl p-3 border transition ${
                      isActive
                        ? "border-emerald-200 bg-emerald-50/60 shadow-xs"
                        : isCompleted
                        ? "border-gray-200 bg-white"
                        : isUpcoming
                        ? "border-gray-100 bg-gray-50/60"
                        : "border-dashed border-gray-200 bg-gray-50/40 text-gray-400"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-xs font-bold ${
                          isActive
                            ? "text-emerald-900"
                            : isCompleted
                            ? "text-gray-900"
                            : isUpcoming
                            ? "text-gray-700"
                            : "text-gray-400"
                        }`}
                      >
                        {stage.label}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          isActive
                            ? "bg-emerald-200 text-emerald-900"
                            : isCompleted
                            ? "bg-teal-100 text-teal-800"
                            : isUpcoming
                            ? "bg-gray-200 text-gray-700"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {isActive
                          ? "Active"
                          : isCompleted
                          ? "Completed"
                          : isUpcoming
                          ? "Upcoming"
                          : "Not Released"}
                      </span>
                    </div>
                    <p
                      className={`mt-1 text-xs ${
                        isActive
                          ? "text-emerald-800 font-medium"
                          : isCompleted
                          ? "text-gray-600"
                          : "text-gray-500"
                      }`}
                    >
                      {stage.dateDisplay || "Awaiting Official Announcement"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Summary Footer */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-gray-50 p-3.5 border border-gray-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-500">Current Status:</span>
            <span className="font-bold text-gray-900">
              {currentStage.message}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <span className="font-semibold">Milestones:</span>
            <span className="font-bold text-brand">
              {completedCount} of {totalStages} completed
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
