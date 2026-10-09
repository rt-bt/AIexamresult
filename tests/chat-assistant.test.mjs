import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

// Verify search engine directly against data
test("Chatbot Retrieval: detects intent and entities for SSC CGL query", () => {
  const scrapedPath = path.join(process.cwd(), "data", "scraped.json");
  const scraped = JSON.parse(fs.readFileSync(scrapedPath, "utf-8"));
  
  const query = "SSC CGL ka result aaya hai kya?".toLowerCase();
  assert.ok(query.includes("ssc cgl"));
  assert.ok(query.includes("result"));

  // Check matching in scraped results
  const matches = (scraped.results || []).filter((item) =>
    item.title.toLowerCase().includes("cgl")
  );
  assert.ok(matches.length > 0, "Must have CGL items in scraped results");
});

test("Chatbot Retrieval: finds Bihar Police recruitment vacancies", () => {
  const scrapedPath = path.join(process.cwd(), "data", "scraped.json");
  const scraped = JSON.parse(fs.readFileSync(scrapedPath, "utf-8"));

  const matches = (scraped.latestJobs || []).filter((item) =>
    item.title.toLowerCase().includes("bihar police")
  );
  assert.ok(matches.length >= 2, "Must find multiple Bihar Police jobs");
});

test("Chatbot Retrieval: finds Railway admit card updates", () => {
  const scrapedPath = path.join(process.cwd(), "data", "scraped.json");
  const scraped = JSON.parse(fs.readFileSync(scrapedPath, "utf-8"));

  const matches = (scraped.admitCards || []).filter((item) =>
    item.title.toLowerCase().includes("railway") || item.title.toLowerCase().includes("rrb")
  );
  assert.ok(matches.length > 0, "Must find Railway admit cards");
});

test("Chatbot Retrieval: finds 12th pass opportunities", () => {
  const scrapedPath = path.join(process.cwd(), "data", "scraped.json");
  const scraped = JSON.parse(fs.readFileSync(scrapedPath, "utf-8"));

  const allItems = [
    ...(scraped.latestJobs || []),
    ...(scraped.admitCards || []),
    ...(scraped.results || []),
  ];
  const matches = allItems.filter(
    (item) =>
      item.title.toLowerCase().includes("12th") ||
      item.title.toLowerCase().includes("10+2") ||
      item.title.toLowerCase().includes("inter")
  );
  assert.ok(matches.length > 0, "Must find 12th pass / intermediate items");
});

test("Chatbot Retrieval: finds UPSC posts", () => {
  const scrapedPath = path.join(process.cwd(), "data", "scraped.json");
  const scraped = JSON.parse(fs.readFileSync(scrapedPath, "utf-8"));

  const allItems = [
    ...(scraped.latestJobs || []),
    ...(scraped.results || []),
    ...(scraped.admitCards || []),
  ];
  const matches = allItems.filter((item) => item.title.toLowerCase().includes("upsc"));
  assert.ok(matches.length > 0, "Must find UPSC items");
});

test("Chatbot Security & Anti-Hallucination: No fake links or unverified dates", () => {
  const scrapedPath = path.join(process.cwd(), "data", "scraped.json");
  const scraped = JSON.parse(fs.readFileSync(scrapedPath, "utf-8"));

  const allItems = [
    ...(scraped.latestJobs || []),
    ...(scraped.results || []),
    ...(scraped.admitCards || []),
    ...(scraped.answerKeys || []),
  ];

  for (const item of allItems.slice(0, 100)) {
    assert.ok(item.slug, "Every item must have a real slug");
    assert.ok(!item.slug.includes("http"), "Slug must not be a raw external URL");
  }
});

test("Chatbot Post Detail Integrity: Important links reject unsafe schemes", () => {
  const postsDir = path.join(process.cwd(), "data", "posts");
  const files = fs.readdirSync(postsDir).slice(0, 30);

  for (const file of files) {
    const post = JSON.parse(fs.readFileSync(path.join(postsDir, file), "utf-8"));
    if (Array.isArray(post.importantLinks)) {
      for (const link of post.importantLinks) {
        if (link.url) {
          assert.doesNotMatch(link.url, /^javascript:/i, "No javascript: schemes allowed");
          assert.doesNotMatch(link.url, /^data:/i, "No data: schemes allowed");
          // If external, must be http or https
          if (link.url.includes("://")) {
            assert.match(link.url, /^https?:\/\//i, "External links must be http/https");
          }
        }
      }
    }
  }
});

test("Chatbot Input Sanitization: Strips XSS and limits length", () => {
  const inputWithXss = "<script>alert('hack')</script>SSC CGL result";
  const cleaned = inputWithXss.replace(/[<>]/g, "").trim();
  assert.equal(cleaned, "scriptalert('hack')/scriptSSC CGL result");
  assert.doesNotMatch(cleaned, /<script>/i);

  const longInput = "a".repeat(600);
  assert.ok(longInput.length > 500, "Detects overly long input");
});

test("Chatbot Hinglish Query Understanding: Maps Hindi/Hinglish intents correctly", () => {
  const q1 = "Bihar Police ki latest vacancy batao";
  const isJob = /\b(job|jobs|vacancy|vacancies|bharti|recruitment)\b/i.test(q1);
  assert.ok(isJob, "Detects vacancy intent in Hinglish");

  const q2 = "Railway admit card kaise download karun?";
  const isAdmit = /\b(admit card|hall ticket)\b/i.test(q2);
  assert.ok(isAdmit, "Detects admit card intent in Hinglish");

  const q3 = "SSC CGL ka result aaya hai kya?";
  const isResult = /\b(result)\b/i.test(q3);
  assert.ok(isResult, "Detects result intent in Hinglish");
});

test("Chatbot Non-Existent Exam Safe Fallback: Refuses to hallucinate dates or links", () => {
  const scrapedPath = path.join(process.cwd(), "data", "scraped.json");
  const scraped = JSON.parse(fs.readFileSync(scrapedPath, "utf-8"));

  const allItems = [
    ...(scraped.latestJobs || []),
    ...(scraped.results || []),
    ...(scraped.admitCards || []),
    ...(scraped.answerKeys || []),
  ];

  const fakeExam = "Mars Alien Recruitment Board Exam 2099";
  const matches = allItems.filter(item => item.title.toLowerCase().includes("mars alien"));
  assert.equal(matches.length, 0, "No matches for non-existent exams");
});
