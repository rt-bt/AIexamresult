import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

// Verify data files exist
test("Chatbot Corpus: data/scraped.json exists and is valid", () => {
  const scrapedPath = path.join(process.cwd(), "data", "scraped.json");
  assert.ok(fs.existsSync(scrapedPath), "scraped.json must exist");
  const data = JSON.parse(fs.readFileSync(scrapedPath, "utf-8"));
  assert.ok(Array.isArray(data.results), "results array exists");
  assert.ok(Array.isArray(data.latestJobs), "latestJobs array exists");
  assert.ok(data.results.length > 100, "results has data");
  assert.ok(data.latestJobs.length > 100, "latestJobs has data");
});

test("Chatbot Corpus: data/posts has detailed files with valid structure", () => {
  const postsDir = path.join(process.cwd(), "data", "posts");
  assert.ok(fs.existsSync(postsDir), "posts directory exists");
  const files = fs.readdirSync(postsDir);
  assert.ok(files.length > 1000, "More than 1000 post files exist");

  const sample = JSON.parse(fs.readFileSync(path.join(postsDir, files[0]), "utf-8"));
  assert.ok(sample.title, "Post has title");
  assert.ok(sample.slug, "Post has slug");
});
