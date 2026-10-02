@echo off
cd /d "%~dp0"
echo [%DATE% %TIME%] Starting Auto Sync... >> data\auto-sync.log
call node scripts/sync-all.mjs >> data\auto-sync.log 2>&1
if errorlevel 1 echo [%DATE% %TIME%] [WARNING] Sync had issues >> data\auto-sync.log

call node scripts/seo-optimize.mjs >> data\auto-sync.log 2>&1

git add -A >> data\auto-sync.log 2>&1
git diff --quiet --cached
if not errorlevel 1 goto NOPUSH
git commit -m "Auto sync" >> data\auto-sync.log 2>&1
git push origin master >> data\auto-sync.log 2>&1
echo [%DATE% %TIME%] Pushed updates to GitHub! >> data\auto-sync.log
goto DONE

:NOPUSH
echo [%DATE% %TIME%] No new changes to push. >> data\auto-sync.log

:DONE
echo [%DATE% %TIME%] Auto Sync finished successfully. >> data\auto-sync.log
