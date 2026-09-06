@echo off
setlocal
title AI Exam Result - Clean SarkariExam Sync
color 0B

set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

echo ==============================================
echo   AI EXAM RESULT - CLEAN CONTENT SYNC
echo ==============================================
echo.
echo Categories:
echo   Latest Vacancy, Admit Card, Answer Keys,
echo   Result, Admissions, Documents
echo.

if not exist ".git" (
  echo This folder is not connected to Git.
  echo Please run this command from the GitHub project folder.
  echo.
  pause
  exit /b 1
)

echo [1/7] Updating project from GitHub...
git pull origin master
if errorlevel 1 goto FAIL
echo.

echo [2/7] Installing required packages...
npm install
if errorlevel 1 goto FAIL
echo.

echo [3/7] Syncing fresh clean content...
node scripts\sync-sarkariexam-only.mjs
if errorlevel 1 goto FAIL
echo.

echo [4/7] Optimizing content for search...
node scripts\seo-optimize.mjs
if errorlevel 1 goto FAIL
echo.

echo [5/7] Checking production build...
npm run build
if errorlevel 1 goto FAIL
echo.

echo [6/7] Saving generated content...
git add -A
git add -f data\scraped-data.ts data\scraped.json
git diff --quiet --cached
if not errorlevel 1 (
  echo No new changes found. Website is already up to date.
  goto DONE
)
git commit -m "Clean sync latest exam content"
if errorlevel 1 goto FAIL
echo.

echo [7/7] Sending update to GitHub...
git push origin master
if errorlevel 1 goto FAIL
echo.

:DONE
echo ==============================================
echo   DONE - Vercel deployment should start now
echo ==============================================
echo.
pause
exit /b 0

:FAIL
echo.
echo ==============================================
echo   FAILED - Please check the error above
echo ==============================================
echo.
pause
exit /b 1
