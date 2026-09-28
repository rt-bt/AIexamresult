@echo off
title Sync All - AI Exam Result
cd /d "%~dp0"
echo ==========================================
echo   Sync Data from SarkariResult.com
echo   (sarkariexam.com disabled - Cloudflare block)
echo ==========================================
echo.
echo Step 1: Syncing new data...
echo.
node scripts/sync-all.mjs
echo.
echo Step 2: Deploying to Vercel...
echo.
npx vercel deploy --prod --yes
echo.
echo ==========================================
echo   Done! Window will close automatically.
echo ==========================================
timeout /t 3 >nul
