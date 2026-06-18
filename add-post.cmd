@echo off
title Add Post - AI Exam Result
cd /d "%~dp0"
echo ========================================
echo   Add New Post to AI Exam Result
echo ========================================
echo.
npx tsx scripts/add-post.mjs
echo.
pause
