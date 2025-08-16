@echo off
echo ========================================
echo   ServiceHub - Deploiement Netlify
echo ========================================
echo.

echo [1/5] Nettoyage...
if exist dist rmdir /s /q dist
if exist .netlify\dist rmdir /s /q .netlify\dist

echo [2/5] Build de production...
call npm run build
if errorlevel 1 (
    echo ERREUR: Build echoue
    pause
    exit /b 1
)

echo [3/5] Verification du build...
if not exist "dist\index.html" (
    echo ERREUR: index.html non trouve
    pause
    exit /b 1
)

echo [4/5] Copie vers Netlify...
if not exist ".netlify" mkdir .netlify
xcopy /E /I /Y dist\* .netlify\dist\

echo [5/5] Verification finale...
if exist ".netlify\dist\index.html" (
    echo ✓ Build pret pour Netlify
    echo ✓ Fichiers copies dans .netlify\dist\
    echo.
    echo Prochaines etapes:
    echo 1. Aller sur https://app.netlify.com/
    echo 2. Drag & drop le dossier .netlify\dist\
    echo 3. Ou utiliser: netlify deploy --prod --dir=.netlify\dist
) else (
    echo ERREUR: Copie echouee
    pause
    exit /b 1
)

echo.
echo Deploiement prepare avec succes!
pause