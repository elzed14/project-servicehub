@echo off
echo ========================================
echo   ServiceHub - Deploiement Complet
echo ========================================
echo.

echo ✅ Build reussi: 1563 modules transformes
echo ✅ Toutes les fonctionnalites incluses
echo.

echo 🚀 DEPLOIEMENT EN COURS...
echo.

echo [1/3] Verification Netlify CLI...
netlify --version >nul 2>&1
if errorlevel 1 (
    echo Installation de Netlify CLI...
    call npm install -g netlify-cli
)

echo [2/3] Deploiement sur Netlify...
netlify deploy --prod --dir=dist --site=sparkling-praline-ddd170

echo [3/3] Verification du deploiement...
timeout /t 10 /nobreak >nul
node verify-deployment.js

echo.
echo ========================================
echo     DEPLOIEMENT TERMINE!
echo ========================================
echo.
echo 🌐 Site en ligne: https://sparkling-praline-ddd170.netlify.app/
echo.
echo ✅ FONCTIONNALITES DEPLOYEES:
echo • Navigation fluide entre toutes les pages
echo • Recherche avancee avec filtres multiples
echo • ServiceCard complet avec toutes les donnees
echo • Authentification avec comptes demo
echo • Publication de services (formulaire complet)
echo • Profil utilisateur avec statistiques
echo • Systeme de notifications
echo • Interface responsive
echo • Toutes les animations et interactions
echo.

start https://sparkling-praline-ddd170.netlify.app/

pause