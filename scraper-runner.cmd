@echo off
cd /d "%~dp0"
echo [%DATE% %TIME%] Starting scrape... >> data\scrape-runner.log
call npx tsx lib/run-scrape.ts >> data\scrape-runner.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [%DATE% %TIME%] Scrape completed successfully >> data\scrape-runner.log
) else (
    echo [%DATE% %TIME%] Scrape FAILED with error code %ERRORLEVEL% >> data\scrape-runner.log
)
