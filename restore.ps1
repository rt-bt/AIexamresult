<#
.SYNOPSIS
Website Restore Script for AI Exam Result
#>

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  [AI Exam Result] Website Restore Tool" -ForegroundColor Cyan
Write-Host "  Backup Point : ce6cd74e (backup-clean)" -ForegroundColor Yellow
Write-Host "  Backup Date  : 18-Oct-2026" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "WARNING: Yeh command aapke saare naye changes ko hata kar website ko bilkul aaj ke backup jaisa restore kar dega!" -ForegroundColor Red
Write-Host ""

$confirm = Read-Host "Kya aap website ko wapas restore karna chahte hain? (Y/N)"
if ($confirm -ne 'Y' -and $confirm -ne 'y') {
    Write-Host "`n[X] Restore cancel kar diya gaya. Koi change nahi hua." -ForegroundColor Yellow
    exit
}

Write-Host "`n[*] Website restore ki ja rahi hai..." -ForegroundColor Cyan

# Try Git Restore
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if ($gitInstalled) {
    Write-Host "[*] Git ke zariye restore ho raha hai..." -ForegroundColor Cyan
    git reset --hard backup-clean
    git clean -fd -e restore.cmd -e restore.ps1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n========================================================" -ForegroundColor Green
        Write-Host " [OK] Mubarak ho! Website successfully restore ho gayi!" -ForegroundColor Green
        Write-Host " Current Commit: ce6cd74e" -ForegroundColor Green
        Write-Host "========================================================" -ForegroundColor Green
        exit
    }
}

# Fallback to physical backup
Write-Host "[!] Git restore me dikkat aayi, physical folder backup se restore ho raha hai..." -ForegroundColor Yellow
if (Test-Path "d:\AIexamresult_backup_clean") {
    robocopy "d:\AIexamresult_backup_clean" "$PSScriptRoot" /E /XD node_modules .next .git /R:1 /W:1 | Out-Null
    Write-Host "`n========================================================" -ForegroundColor Green
    Write-Host " [OK] Physical backup folder se website restore ho gayi!" -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Green
} else {
    Write-Host "[X] Error: Backup folder (d:\AIexamresult_backup_clean) nahi mila!" -ForegroundColor Red
}
