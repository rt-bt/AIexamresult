@echo off
cd /d "D:\AIexamresult"
npx tsx lib/auto-sync.ts >> data\auto-sync.log 2>&1
