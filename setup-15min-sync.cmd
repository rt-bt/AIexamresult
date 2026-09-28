@echo off
echo Setting up auto-sync every 15 minutes...
echo.

:: Delete old task if exists
schtasks /Delete /TN "AIER_AutoSync" /F >nul 2>&1

:: Create new task every 15 minutes
schtasks /Create /SC MINUTE /MO 15 /TN "AIER_AutoSync" /TR "D:\AIexamresult\auto-sync.cmd" /ST 00:00 /ED 12/31/2030 /IT /RL HIGHEST

echo.
echo Done! Auto-sync will run every 15 minutes.
echo Check logs at: data\auto-sync.log
pause
