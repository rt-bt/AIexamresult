@echo off
setlocal
echo ========================================================
echo   [AI Exam Result] Website Restore Tool
echo   Backup Point : ce6cd74e (backup-clean)
echo   Backup Date  : 18-Oct-2026
echo ========================================================
echo.
echo WARNING: Yeh command aapke saare naye changes ko hata kar 
echo website ko bilkul aaj ke backup jaisa restore kar dega!
echo.
set /p CONFIRM="Kya aap website ko wapas restore karna chahte hain? (Y/N): "
if /i not "%CONFIRM%"=="Y" (
    echo.
    echo [X] Restore cancel kar diya gaya. Koi change nahi hua.
    goto :end
)

echo.
echo [*] Website restore ki ja rahi hai...

:: Try git reset first
where git >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [*] Git ke zariye restore ho raha hai...
    git reset --hard backup-clean
    git clean -fd -e restore.cmd -e restore.ps1
    if %ERRORLEVEL% equ 0 (
        echo.
        echo ========================================================
        echo  [OK] Mubarak ho! Website successfully restore ho gayi!
        echo  Current Commit: ce6cd74e
        echo ========================================================
        goto :end
    )
)

:: Fallback if git fails or is not available
echo [!] Git restore me dikkat aayi, physical folder backup se restore ho raha hai...
if exist "d:\AIexamresult_backup_clean" (
    robocopy "d:\AIexamresult_backup_clean" "%~dp0." /E /XD node_modules .next .git /R:1 /W:1 >nul
    echo.
    echo ========================================================
    echo  [OK] Physical backup folder se website restore ho gayi!
    echo ========================================================
) else (
    echo [X] Error: Backup folder nahi mila!
)

:end
echo.
pause
