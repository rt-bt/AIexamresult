// Lightweight auto-sync runner - delegates directly to scripts/sync-all.mjs
import { fork } from "child_process";
import * as path from "path";

const scriptPath = path.resolve(process.cwd(), "scripts", "sync-all.mjs");
const child = fork(scriptPath, [], { stdio: "inherit" });

child.on("exit", (code) => {
  if (code !== 0) {
    console.error(`[auto-sync] Sync exited with code ${code}`);
    process.exit(code || 1);
  }
});

