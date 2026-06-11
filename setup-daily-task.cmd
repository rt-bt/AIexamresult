@echo off
cd /d "%~dp0"
set TASK_NAME="AIExamResult Daily Scrape"
set SCRIPT="%~dp0scraper-runner.cmd"

schtasks /Create /SC DAILY /TN %TASK_NAME% /TR "%SCRIPT%" /ST 06:00 /F
if %ERRORLEVEL% EQU 0 (
    echo Scheduled task created: Runs daily at 6:00 AM
) else (
    echo Failed to create task. Run as Administrator if needed.
)
pause
