@echo off
echo ========================================
echo        ServiceHub - Build Production
echo ========================================
echo.

echo [1/4] Nettoyage...
call npm run clean

echo [2/4] Verification des types...
call npm run type-check
if errorlevel 1 (
    echo ERREUR: Erreurs de types detectees
    pause
    exit /b 1
)

echo [3/4] Tests...
call npm test -- --run
if errorlevel 1 (
    echo ERREUR: Tests echoues
    pause
    exit /b 1
)

echo [4/4] Build de production...
call npm run build
if errorlevel 1 (
    echo ERREUR: Build echoue
    pause
    exit /b 1
)

echo.
echo ✅ Build termine avec succes!
echo Fichiers generes dans le dossier 'dist'
pause