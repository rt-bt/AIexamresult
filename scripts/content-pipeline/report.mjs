/**
 * AIExamResult.com - Content Sync & Deployment Reporter
 * Records execution statistics, errors, and validation metrics in content-sync-report.json.
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPORT_FILE = resolve(__dirname, "../../content-sync-report.json");

export function saveSyncReport(reportData) {
  const fullReport = {
    timestamp: new Date().toISOString(),
    ...reportData,
  };
  writeFileSync(REPORT_FILE, JSON.stringify(fullReport, null, 2), "utf8");
  return fullReport;
}

export function printSyncSummary(report) {
  console.log("\n=======================================================");
  console.log(" 📊 AIEXAMRESULT.COM CONTENT PIPELINE EXECUTION REPORT ");
  console.log("=======================================================");
  console.log(` ⏰ Timestamp:            ${report.timestamp}`);
  console.log(` 🚀 Execution Mode:       ${report.mode || "SYNC"}`);
  console.log(` 🔍 Topics Discovered:    ${report.topicsDiscovered?.length || 0}`);
  console.log(` ✍️ Articles Generated:    ${report.articlesGenerated?.length || 0}`);
  console.log(` 🔄 Articles Updated:      ${report.articlesUpdated?.length || 0}`);
  console.log(` ⏭️ Articles Skipped:      ${report.articlesSkipped?.length || 0}`);
  console.log(` ⚠️ Validation Failures:  ${report.validationFailures?.length || 0}`);
  console.log(` 🚀 Deployment Status:    ${report.deploymentStatus || "IDLE"}`);

  if (report.errors && report.errors.length > 0) {
    console.log("\n ❌ Errors Encountered:");
    report.errors.forEach((e) => console.log(`   - ${e}`));
  }

  if (report.articlesGenerated && report.articlesGenerated.length > 0) {
    console.log("\n 📄 Published/Generated Articles:");
    report.articlesGenerated.forEach((a, i) => {
      console.log(`   ${i + 1}. [${a.category}] ${a.title}`);
      console.log(`      URL: https://www.aiexamresult.com/post/${a.slug}`);
    });
  }

  console.log("=======================================================\n");
}

export function getLatestReport() {
  if (!existsSync(REPORT_FILE)) return null;
  try {
    return JSON.parse(readFileSync(REPORT_FILE, "utf8"));
  } catch {
    return null;
  }
}
