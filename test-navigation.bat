@echo off
echo ========================================
echo    ServiceHub - Test de Navigation
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

echo [2/3] Verification du site deploye...
node verify-deployment.js

echo.
echo [3/3] Instructions de test...
echo.
echo 🧪 TESTS A EFFECTUER:
echo.
echo 1. Ouvrez: https://sparkling-praline-ddd170.netlify.app/
echo 2. Testez la navigation:
echo    • Cliquez sur "Trouver des services" (doit afficher la page de recherche)
echo    • Cliquez sur "Proposer un service" (doit afficher le formulaire)
echo    • Cliquez sur "ServiceHub" (doit revenir a l'accueil)
echo    • Testez "Accès rapide" (doit ouvrir la modal d'auth)
echo.
echo 3. Verifiez que:
echo    • Les pages ne sont plus blanches
echo    • La navigation fonctionne correctement
echo    • Les composants s'affichent
echo.
echo ========================================
echo     Test de Navigation Pret!
echo ========================================
echo.
echo Si la navigation ne fonctionne toujours pas:
echo 1. Videz le cache du navigateur (Ctrl+Shift+R)
echo 2. Ouvrez la console (F12) pour voir les erreurs
echo 3. Testez en mode incognito
echo.
pause