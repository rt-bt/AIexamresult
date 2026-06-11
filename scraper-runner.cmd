@echo off
cd /d "%~dp0"
echo [%DATE% %TIME%] Starting scrape...
npx tsx lib/run-scrape.ts
if %ERRORLEVEL% EQU 0 (
    echo [%DATE% %TIME%] Scrape completed successfully
) else (
    echo [%DATE% %TIME%] Scrape FAILED with error code %ERRORLEVEL%
)
pause
