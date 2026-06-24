@echo off
title AI Exam Result - Auto Sync + Deploy
cd /d "%~dp0"
color 0B

echo ==============================================
echo   AI EXAM RESULT - AUTO SYNC ^& DEPLOY
echo   Sarkari Result Data Sync + EC2 Deploy
echo ==============================================
echo.

REM ---- Step 1: Install dependencies ----
echo [1/6] Installing dependencies...
call npm install --silent
if errorlevel 1 echo [WARNING] npm install had issues
echo OK
echo.

REM ---- Step 2: Sync data from all sources ----
echo [2/6] Syncing data from Sarkari sources...
echo  Sources: sarkariresult.com, sarkariexam.com,
echo           resultbharat.com, sarkarialert.net, rojgarresult.com
echo  (this may take a few minutes...)
echo.
node scripts/sync-all.mjs
if errorlevel 1 echo [WARNING] Sync had some errors
echo OK
echo.

REM ---- Step 3: Generate scraped.json for runtime ----
echo [3/6] Generating scraped.json...
node -e "var f=require('fs'),r=f.readFileSync('data/scraped-data.ts','utf8'),j=r.replace(/^\/\/.*[\r\n]+/gm,'').replace(/^export const scrapedData = /,'').replace(/\s*as const\s*;\s*$/,'').replace(/;\s*$/,'');f.writeFileSync('data/scraped.json',j,'utf8');console.log('scraped.json ('+(Buffer.byteLength(j,'utf8')/1024/1024).toFixed(1)+' MB)')"
echo OK
echo.

REM ---- Step 4: SEO Optimization ----
echo [4/6] Running SEO optimization...
node scripts/seo-optimize.mjs
if errorlevel 1 echo [WARNING] SEO optimization had errors
echo OK
echo.

REM ---- Step 5: Git commit and push to GitHub ----
echo [5/6] Committing and pushing to GitHub...
git add -A
git diff --quiet --cached
if not errorlevel 1 goto NOPUSH
git commit -m "Auto sync"
git push origin master
if errorlevel 1 (
  echo [WARNING] Git push failed. Push manually.
) else (
  echo Pushed to GitHub - auto-deploy triggered!
)
:NOPUSH
if errorlevel 1 echo [INFO] No changes to commit
echo OK
echo.

REM ---- Step 6: Direct upload to EC2 ----
echo [6/6] Uploading data to EC2...
if exist "C:\Users\Adity\aiexamresult.pem" (
  scp -i "C:\Users\Adity\aiexamresult.pem" -o StrictHostKeyChecking=no data\scraped.json ubuntu@65.0.146.40:/home/ubuntu/a-iexamresult/data/scraped.json
  echo Data uploaded to EC2!
) else (
  echo [SKIP] aiexamresult.pem not found
)
echo OK
echo.

echo ==============================================
echo   ALL DONE!
echo   Data synced, SEO optimized, pushed to GitHub
echo ==============================================
echo.
pause
