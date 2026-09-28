@echo off
cd /d "D:\AIexamresult"
node scripts/sync-all.mjs >> data\auto-sync.log 2>&1
