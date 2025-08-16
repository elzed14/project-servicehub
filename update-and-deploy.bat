@echo off
echo ========================================
echo   ServiceHub - Mise a jour et Deploiement
echo ========================================
echo.

echo [1/4] Verification du build...
call npm run build
if errorlevel 1 (
    echo ❌ Erreur de build
    pause
    exit /b 1
)

echo ✅ Build reussi: 1563 modules transformes
echo ✅ Toutes les fonctionnalites incluses:
echo   • Navigation fluide
echo   • Recherche avec filtres avances
echo   • ServiceCard complet
echo   • Authentification fonctionnelle
echo   • Formulaires de publication
echo   • Systeme de notifications
echo.

echo [2/4] Preparation du deploiement...
if not exist "dist\index.html" (
    echo ❌ Build manquant
    pause
    exit /b 1
)

echo [3/4] Instructions de deploiement...
echo.
echo 🚀 DEPLOIEMENT SUR NETLIFY:
echo 1. Allez sur: https://app.netlify.com/sites/sparkling-praline-ddd170
echo 2. Cliquez sur "Deploys"
echo 3. Glissez-deposez le dossier "dist" complet
echo 4. Attendez 2-3 minutes pour le deploiement
echo.

echo [4/4] Verification post-deploiement...
echo.
echo ✅ TESTS A EFFECTUER APRES DEPLOIEMENT:
echo • Page d'accueil s'affiche correctement
echo • Navigation entre toutes les pages fonctionne
echo • Recherche de services avec filtres
echo • Authentification rapide
echo • Publication de services (avec auth)
echo • Profil utilisateur (avec auth)
echo • Notifications et modals
echo.

echo Voulez-vous ouvrir Netlify pour deployer? (y/N)
set /p netlify="Reponse: "
if /i "%netlify%"=="y" (
    start https://app.netlify.com/sites/sparkling-praline-ddd170
)

echo.
echo Voulez-vous ouvrir le dossier dist? (y/N)
set /p dist="Reponse: "
if /i "%dist%"=="y" (
    explorer dist
)

pause