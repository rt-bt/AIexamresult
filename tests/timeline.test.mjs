import test from "node:test";
import assert from "node:assert/strict";
import {
  getNowIST,
  parseIndianDate,
  parseDateRange,
  isExplicitlyUnreleased,
  isExplicitlyReleased,
  extractPostEventDates,
  buildPostTimeline,
  getCurrentTimelineStage,
} from "../lib/timeline.ts";

test("Timeline: Timezone Asia/Kolkata generates valid YYYY-MM-DD", () => {
  const ist = getNowIST();
  assert.match(ist.dateStr, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(ist.year >= 2026);
  assert.ok(ist.month >= 1 && ist.month <= 12);
  assert.ok(ist.day >= 1 && ist.day <= 31);
});

test("Timeline: Indian Date Parser handles multiple formats", () => {
  assert.equal(parseIndianDate("28 September 2026"), "2026-09-28");
  assert.equal(parseIndianDate("28 Sep 2026"), "2026-09-28");
  assert.equal(parseIndianDate("5 Oct 2026"), "2026-10-05");
  assert.equal(parseIndianDate("05-October-2026"), "2026-10-05");
  assert.equal(parseIndianDate("28/09/2026"), "2026-09-28");
  assert.equal(parseIndianDate("28-09-2026"), "2026-09-28");
  assert.equal(parseIndianDate("2026-09-28"), "2026-09-28");
  assert.equal(parseIndianDate("28 September 2026 | 08:20 PM"), "2026-09-28");

  // Non-dates and unreleased indicators must return null
  assert.equal(parseIndianDate("Not Released"), null);
  assert.equal(parseIndianDate("Notify Later"), null);
  assert.equal(parseIndianDate("Before Exam"), null);
  assert.equal(parseIndianDate("Available Soon"), null);
  assert.equal(parseIndianDate("To be announced"), null);
  assert.equal(parseIndianDate("Will Be Updated Soon"), null);
});

test("Timeline: Date Range parsing handles multi-day exam/application windows", () => {
  const range1 = parseDateRange("28 September 2026 to 20 October 2026");
  assert.equal(range1.start, "2026-09-28");
  assert.equal(range1.end, "2026-10-20");

  const range2 = parseDateRange("15 to 20 November 2026");
  assert.equal(range2.start, "2026-11-15");
  assert.equal(range2.end, "2026-11-20");

  const range3 = parseDateRange("15-20 November 2026");
  assert.equal(range3.start, "2026-11-15");
  assert.equal(range3.end, "2026-11-20");
});

test("TEST CASE 1: 28 Sep 2026 — Application is Active, Answer Key MUST NOT be completed", () => {
  const samplePost = {
    title: "SSC CGL 2026 Tier 1 Exam Date & Notification",
    category: "latestJobs",
    publishedDate: "28 September 2026",
    importantDates: [
      "Official Notification Release : 28 September 2026",
      "Application Online Form Start : 28 September 2026",
      "Last Date to Apply Online : 20 October 2026",
      "Admit Card : Not Released",
      "Written Exam Date : 15 November 2026",
      "Answer Key : Not Released",
      "Result : Not Released",
    ],
    importantLinks: [
      { label: "Apply Online", url: "https://ssc.gov.in" },
      { label: "Download Notification", url: "https://ssc.gov.in" },
    ],
  };

  const timeline = buildPostTimeline(samplePost, "2026-09-28");
  const stageMap = Object.fromEntries(timeline.stages.map((s) => [s.id, s.status]));

  // Notification is completed
  assert.equal(stageMap.notification, "completed");

  // Application is ACTIVE
  assert.equal(stageMap.application, "active");

  // Admit Card is UNAVAILABLE / Not Released
  assert.equal(stageMap.admitCard, "unavailable");

  // Exam is UPCOMING
  assert.equal(stageMap.exam, "upcoming");

  // CRITICAL BUG FIX VERIFICATION: Answer Key MUST NOT be completed!
  assert.notEqual(stageMap.answerKey, "completed");
  assert.equal(stageMap.answerKey, "unavailable");

  // CRITICAL: Result MUST NOT be completed!
  assert.notEqual(stageMap.result, "completed");
  assert.equal(stageMap.result, "unavailable");

  // Current stage must be Application
  const current = timeline.currentStage;
  assert.equal(current.stage, "application");
  assert.equal(current.status, "active");
  assert.equal(current.progressIndex, 1);

  // Progress visually stops at Application stage
  assert.ok(current.progressPercent <= 30);
});

test("TEST CASE 2: 10 Oct 2026 — Midway during Application window", () => {
  const samplePost = {
    title: "SSC CGL 2026 Recruitment",
    category: "latestJobs",
    importantDates: [
      "Notification Date : 28 September 2026",
      "Application Start : 28 September 2026",
      "Last Date : 20 October 2026",
      "Exam Date : 15 November 2026",
    ],
  };

  const timeline = buildPostTimeline(samplePost, "2026-10-10");
  const stageMap = Object.fromEntries(timeline.stages.map((s) => [s.id, s.status]));

  assert.equal(stageMap.application, "active");
  assert.equal(stageMap.exam, "upcoming");
  assert.equal(timeline.currentStage.stage, "application");
  assert.equal(timeline.currentStage.status, "active");
});

test("TEST CASE 3: 25 Oct 2026 — After Application Closed, before Exam", () => {
  const samplePost = {
    title: "SSC CGL 2026 Recruitment",
    category: "latestJobs",
    importantDates: [
      "Application Start : 28 September 2026",
      "Last Date : 20 October 2026",
      "Exam Date : 15 November 2026",
      "Answer Key : After Exam",
    ],
  };

  const timeline = buildPostTimeline(samplePost, "2026-10-25");
  const stageMap = Object.fromEntries(timeline.stages.map((s) => [s.id, s.status]));

  assert.equal(stageMap.application, "completed");
  assert.equal(stageMap.exam, "upcoming");
  assert.equal(stageMap.answerKey, "unavailable");

  // Progress stopped after application, waiting for exam
  const current = timeline.currentStage;
  assert.equal(current.stage, "admitCard"); // Next pending milestone before exam
});

test("TEST CASE 4: 16 Nov 2026 — Day after Exam has finished", () => {
  const samplePost = {
    title: "SSC CGL 2026 Tier 1",
    category: "latestJobs",
    importantDates: [
      "Application Start : 28 September 2026",
      "Last Date : 20 October 2026",
      "Exam Date : 15 November 2026",
      "Answer Key : Not Released",
      "Result : Will Be Updated Soon",
    ],
  };

  const timeline = buildPostTimeline(samplePost, "2026-11-16");
  const stageMap = Object.fromEntries(timeline.stages.map((s) => [s.id, s.status]));

  assert.equal(stageMap.exam, "completed");
  // Answer Key & Result MUST NOT be marked completed!
  assert.equal(stageMap.answerKey, "unavailable");
  assert.equal(stageMap.result, "unavailable");
});

test("Official Status Override: Answer Key released with live link", () => {
  const samplePost = {
    title: "SSC CGL 2026 Answer Key Released - Check Score",
    category: "answerKeys",
    importantDates: [
      "Exam Date : 15 November 2026",
      "Answer Key : Released (22 November 2026)",
      "Result : Not Released",
    ],
    importantLinks: [
      { label: "Download Answer Key & Response Sheet", url: "https://ssc.gov.in/anskey" },
    ],
  };

  const timeline = buildPostTimeline(samplePost, "2026-11-23");
  const stageMap = Object.fromEntries(timeline.stages.map((s) => [s.id, s.status]));

  assert.equal(stageMap.answerKey, "completed");
  assert.equal(stageMap.result, "unavailable");
});

test("Official Status Override: Result declared post", () => {
  const samplePost = {
    title: "UP Police Constable Re-Exam Result & Cutoff 2026",
    category: "results",
    importantDates: [
      "Exam Date : 25 August 2026",
      "Result Declared Date : 28 September 2026",
    ],
    importantLinks: [
      { label: "Download Result (Direct Link)", url: "https://uppbpb.gov.in/result" },
    ],
  };

  const timeline = buildPostTimeline(samplePost, "2026-09-28");
  const stageMap = Object.fromEntries(timeline.stages.map((s) => [s.id, s.status]));

  assert.equal(stageMap.result, "completed"); // declared result is completed
  assert.equal(timeline.currentStage.status, "completed");
});

test("Multiple Posts in same category calculate timelines INDEPENDENTLY", () => {
  const postApplicationActive = {
    title: "Post A Recruitment 2026",
    category: "latestJobs",
    importantDates: ["Application Start : 28 Sep 2026", "Last Date : 20 Oct 2026"],
  };

  const postExamCompleted = {
    title: "Post B Exam 2026",
    category: "latestJobs",
    importantDates: ["Exam Date : 10 September 2026"],
  };

  const timelineA = buildPostTimeline(postApplicationActive, "2026-09-28");
  const timelineB = buildPostTimeline(postExamCompleted, "2026-09-28");

  assert.equal(timelineA.currentStage.stage, "application");
  assert.equal(timelineA.currentStage.status, "active");

  const examBStage = timelineB.stages.find((s) => s.id === "exam");
  assert.equal(examBStage?.status, "completed");
});
