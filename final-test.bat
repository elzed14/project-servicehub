@echo off
echo ========================================
echo    ServiceHub - Test Final
echo ========================================
echo.

echo [1/4] Construction de l'application...
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
echo [3/4] Test du site deploye...
node verify-deployment.js

echo.
echo [4/4] Demarrage du serveur local pour test...
echo.
echo 🧪 TESTS A EFFECTUER:
echo.
echo 1. Site en ligne: https://sparkling-praline-ddd170.netlify.app/
echo 2. Test local: http://localhost:4173
echo.
echo Navigation a tester:
echo • Page d'accueil ✓
echo • Bouton "Trouver des services" → Page de recherche
echo • Bouton "Proposer un service" → Formulaire
echo • Bouton "ServiceHub" → Retour accueil
echo • Bouton "Accès rapide" → Modal d'auth
echo.
echo ========================================
echo     Demarrage du serveur de test...
echo ========================================
echo.
call npm run preview