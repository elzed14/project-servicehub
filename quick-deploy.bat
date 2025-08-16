@echo off
echo ========================================
echo    ServiceHub - Deploiement Rapide
echo ========================================
echo.

echo [1/3] Construction de l'application...
call npm run build
if errorlevel 1 (
    echo ❌ Erreur de construction
    pause
    exit /b 1
)

echo ✅ Construction reussie!
echo.

echo [2/3] Verification du build...
if exist "dist\index.html" (
    echo ✅ Fichiers de build presents
) else (
    echo ❌ Fichiers de build manquants
    pause
    exit /b 1
)

echo.
echo [3/3] Instructions de deploiement...
echo.
echo 🚀 DEPLOIEMENT MANUEL SUR NETLIFY:
echo.
echo 1. Allez sur: https://app.netlify.com/
echo 2. Connectez-vous a votre compte
echo 3. Cliquez sur "Add new site" > "Deploy manually"
echo 4. Glissez-deposez le dossier "dist" de ce projet
echo 5. Attendez la fin du deploiement
echo.
echo 📁 Dossier a deployer: %CD%\dist
echo.
echo OU utilisez Netlify CLI:
echo   netlify deploy --prod --dir=dist
echo.
echo ========================================
echo   Votre application est prete!
echo ========================================
echo.
echo Site actuel: https://sparkling-praline-ddd170.netlify.app/
echo.
pause

echo Voulez-vous ouvrir le dossier dist? (y/N)
set /p open="Reponse: "
if /i "%open%"=="y" (
    explorer dist
)