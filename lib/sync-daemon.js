// Background sync daemon - runs auto-sync every 15 min
// Start with: node lib/sync-daemon.js
const { execSync } = require("child_process");
const path = require("path");

const PROJECT_DIR = path.resolve(__dirname, "..");
const LOG_FILE = path.join(PROJECT_DIR, "data", "auto-sync.log");

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  try {
    require("fs").appendFileSync(LOG_FILE, line + "\n");
  } catch {}
}

function runSync() {
  log("Starting auto-sync...");
  try {
    const out = execSync(`npx tsx lib/auto-sync.ts`, { cwd: PROJECT_DIR, timeout: 120000, encoding: "utf-8" });
    log(out.trim().split("\n").pop());
  } catch (e) {
    log(`Error: ${e.message}`);
  }
}

log("Sync daemon started. Will run every 15 minutes.");
runSync();
setInterval(runSync, 15 * 60 * 1000);

process.on("SIGINT", () => { log("Daemon stopped."); process.exit(); });
process.on("SIGTERM", () => { log("Daemon stopped."); process.exit(); });
