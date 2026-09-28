/**
 * AIExamResult.com - Git & Vercel Deployment Workflow
 * Commits published content files to GitHub repository to trigger Vercel deployment.
 * 
 * STRICT COMPLIANCE:
 * - Never commits secrets or credentials.
 * - Handles Git errors gracefully without crashing the pipeline.
 */

import { execSync } from "child_process";

export async function deployToGitHub({ commitMessage = "content: update verified exam content" } = {}) {
  console.log("\n📦 Preparing Git commit and Vercel deployment trigger...");

  try {
    // 1. Identify current branch
    let currentBranch = "main";
    try {
      currentBranch = execSync("git branch --show-current", { encoding: "utf8" }).trim() || "main";
    } catch {}

    const filesToStage = [
      "data/posts",
      "data/scraped.json",
      "data/scraped-data.ts",
      "content-queue.json",
      "content-sync-report.json",
      "content-preview",
    ];
    for (const f of filesToStage) {
      try {
        execSync(`git add ${f}`, { stdio: "pipe" });
      } catch {
        try {
          execSync(`git add -f ${f}`, { stdio: "pipe" });
        } catch {}
      }
    }

    // 3. Check if there are staged changes
    const statusOutput = execSync("git status --porcelain", { encoding: "utf8" });
    if (!statusOutput || !statusOutput.trim()) {
      console.log("  ℹ️ No content file changes detected to commit.");
      return { deployed: false, message: "No content changes to commit" };
    }

    // 4. Create Git commit
    console.log(`  -> Committing: "${commitMessage}"`);
    execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, {
      stdio: "pipe",
    });

    // 5. Push to GitHub remote
    console.log(`  -> Pushing to origin/${currentBranch}...`);
    try {
      execSync(`git push origin ${currentBranch}`, {
        stdio: "pipe",
      });
      console.log(`  ✅ Successfully pushed to GitHub (${currentBranch}). Vercel will deploy automatically.`);
      return { deployed: true, branch: currentBranch, message: "Pushed to GitHub successfully" };
    } catch (pushErr) {
      console.warn(`  ⚠️ Git push skipped or requires credentials: ${pushErr.message.split("\n")[0]}`);
      return { deployed: false, branch: currentBranch, message: `Git commit created locally. Push deferred: ${pushErr.message.split("\n")[0]}` };
    }
  } catch (err) {
    console.error(`  ❌ Git deployment error: ${err.message}`);
    return { deployed: false, error: err.message };
  }
}
