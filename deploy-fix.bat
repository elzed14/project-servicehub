@echo off
echo ========================================
echo  ServiceHub - Deploiement avec Corrections
echo ========================================
echo.

echo 🔧 CORRECTIONS APPLIQUEES:
echo ✅ Probleme de navigation corrige
echo ✅ Re-render force avec cles uniques
echo ✅ Gestion d'etat du contexte restauree
echo ✅ Debug ajoute pour tracer les problemes
echo.

echo [1/4] Construction avec corrections...
call npm run build
if errorlevel 1 (
    echo ❌ Erreur de construction
    pause
    exit /b 1
)

echo ✅ Construction reussie!
echo.

echo [2/4] Verification du build...
if exist "dist\index.html" (
    echo ✅ Build genere
) else (
    echo ❌ Build manquant
    pause
    exit /b 1
)

echo.
echo [3/4] Test du site actuel...
node verify-deployment.js

echo.
echo [4/4] Instructions de deploiement...
echo.
echo 🚀 DEPLOIEMENT DES CORRECTIONS:
echo.
echo Option 1 - Netlify Interface Web:
echo   1. Allez sur: https://app.netlify.com/sites/sparkling-praline-ddd170
echo   2. Cliquez sur "Deploys"
echo   3. Glissez-deposez le dossier "dist" complet
echo   4. Attendez la fin du deploiement
echo.
echo Option 2 - Netlify CLI:
echo   netlify deploy --prod --dir=dist
echo.
echo ========================================
echo    Corrections pretes pour deploiement!
echo ========================================
echo.
echo Apres deploiement, testez:
echo • Navigation entre les pages
echo • Affichage des composants
echo • Fonctionnement des boutons
echo.
echo Site: https://sparkling-praline-ddd170.netlify.app/
echo.
pause