/**
 * AIExamResult.com - Content Queue Manager
 * Manages content-queue.json lifecycle state machine.
 * Statuses: pending -> researching -> draft -> verified -> published / updated / failed
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const QUEUE_FILE = resolve(__dirname, "../../content-queue.json");

export const QUEUE_STATUS = {
  PENDING: "pending",
  RESEARCHING: "researching",
  DRAFT: "draft",
  VERIFIED: "verified",
  PUBLISHED: "published",
  UPDATED: "updated",
  FAILED: "failed",
  SKIPPED: "skipped",
};

export function loadQueue() {
  if (!existsSync(QUEUE_FILE)) {
    return [];
  }
  try {
    const raw = readFileSync(QUEUE_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveQueue(items) {
  writeFileSync(QUEUE_FILE, JSON.stringify(items, null, 2), "utf8");
}

export function enqueueTopic({
  topic,
  category = "latestJobs",
  priority = "normal",
  source = "public-discovery",
  officialSource = "",
  slug = "",
  intent = "recruitment",
}) {
  const queue = loadQueue();
  const existing = queue.find((q) => q.topic.toLowerCase().trim() === topic.toLowerCase().trim() || (slug && q.slug === slug));

  if (existing) {
    return { added: false, item: existing };
  }

  const newItem = {
    id: `queue-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    topic,
    slug,
    category,
    intent,
    priority,
    source,
    officialSource,
    status: QUEUE_STATUS.PENDING,
    duplicateScore: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    error: null,
  };

  queue.push(newItem);
  saveQueue(queue);
  return { added: true, item: newItem };
}

export function updateQueueStatus(topicOrSlug, updates) {
  const queue = loadQueue();
  const index = queue.findIndex(
    (q) => q.slug === topicOrSlug || q.topic.toLowerCase().trim() === topicOrSlug.toLowerCase().trim() || q.id === topicOrSlug
  );

  if (index !== -1) {
    queue[index] = {
      ...queue[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveQueue(queue);
    return queue[index];
  }
  return null;
}

export function getPendingQueue() {
  const queue = loadQueue();
  return queue.filter((item) => item.status === QUEUE_STATUS.PENDING || item.status === QUEUE_STATUS.RESEARCHING);
}
