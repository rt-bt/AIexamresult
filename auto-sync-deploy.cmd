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
echo [1/7] Installing dependencies...
call npm install --silent
echo  Done!
echo.

REM ---- Step 2: Sync data from all sources ----
echo [2/7] Syncing data from Sarkari sources...
echo  Sources: sarkariresult.com, sarkariexam.com, resultbharat.com,
echo           sarkarialert.net, rojgarresult.com
echo.
node scripts/sync-all.mjs
if %ERRORLEVEL% NEQ 0 (
    echo  Warning: Sync completed with some errors (see above).
) else (
    echo  Sync completed successfully!
)
echo.

REM ---- Step 3: Generate JSON data file for runtime ----
echo [3/7] Converting scraped-data.ts to scraped.json...
if exist data\scraped-data.ts (
    node -e "
        const fs = require('fs');
        const raw = fs.readFileSync('data/scraped-data.ts', 'utf8');
        const jsonStr = raw
            .replace(/^\/\/.*[\r\n]+/gm, '')
            .replace(/^export const scrapedData = /, '')
            .replace(/\s*as const\s*;\s*$/, '')
            .replace(/;\s*$/, '');
        fs.writeFileSync('data/scraped.json', jsonStr, 'utf8');
        const mb = (Buffer.byteLength(jsonStr, 'utf8') / 1024 / 1024).toFixed(1);
        console.log('  scraped.json created (' + mb + ' MB)');
    "
)
echo  Done!
echo.

REM ---- Step 4: SEO Optimization ----
echo [4/7] Running SEO optimization...
node scripts/seo-optimize.mjs
if %ERRORLEVEL% EQU 0 (
    echo  SEO optimization complete!
) else (
    echo  Warning: SEO optimization had some errors.
)
echo.

REM ---- Step 5: Commit and push to GitHub ----
echo [5/7] Committing and pushing updated data to GitHub...
git add -A
git diff --quiet --cached || git commit -m "Auto sync $(date /T) $(time /T)"
git push origin master
if %ERRORLEVEL% EQU 0 (
    echo  Pushed to GitHub! GitHub Actions will auto-deploy to EC2.
) else (
    echo  Warning: Git push failed. You may need to push manually.
)
echo.

REM ---- Step 6: Direct upload to EC2 (fallback) ----
echo [6/7] Uploading data directly to EC2...
if exist aiexamresult.pem (
    echo  Uploading scraped.json to EC2...
    scp -i aiexamresult.pem -o StrictHostKeyChecking=no data\scraped.json ubuntu@65.0.146.40:/home/ubuntu/a-iexamresult/data/scraped.json
    echo  Data uploaded!
) else (
    echo  Skipped (aiexamresult.pem not found in project directory)
    echo  EC2 SSH key is at C:\Users\Adity\aiexamresult.pem
)
echo.

REM ---- Step 6: SEO verification ----
echo [7/7] Verification...
echo  - Robots.txt: https://www.aiexamresult.com/robots.txt
echo  - Sitemap: https://www.aiexamresult.com/sitemap-index.xml
echo  - Generated sitemap entries will include new posts on next build
echo.

echo ==============================================
echo   AUTO SYNC COMPLETE!
echo   New data synced from Sarkari sources.
echo   GitHub push done - EC2 deploy will follow.
echo ==============================================
echo.
echo  Press any key to close this window...
pause >nul
