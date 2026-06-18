@echo off
title Sync SarkariResult - AI Exam Result
cd /d "%~dp0"
echo ==========================================
echo   Sync Data from SarkariResult.com
echo ==========================================
echo.
echo Step 1: Syncing new data...
echo.
node scripts/sync-sarkariresult.mjs
echo.
echo Step 2: Deploying to Vercel...
echo.
npx vercel deploy --prod --yes
echo.
echo ==========================================
echo   Done! Window will close automatically.
echo ==========================================
timeout /t 3 >nul
