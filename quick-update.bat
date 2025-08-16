@echo off
echo ========================================
echo   ServiceHub - Mise a jour Rapide
echo ========================================
echo.

set /p message="Message de commit: "
if "%message%"=="" set message="Update: %date% %time%"

echo [1/3] Build de l'application...
call npm run build
if errorlevel 1 (
    echo ❌ Erreur de build
    pause
    exit /b 1
)

echo [2/3] Commit des changements...
git add .
git commit -m "%message%"

echo [3/3] Push vers GitHub (deploy auto)...
git push origin main

echo.
echo ✅ Mise a jour deployee!
echo Le site sera mis a jour automatiquement dans 2-3 minutes.
echo URL: https://sparkling-praline-ddd170.netlify.app/
echo.
pause