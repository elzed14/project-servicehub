@echo off
echo ========================================
echo   ServiceHub - Mise a jour Deploiement
echo ========================================
echo.

echo [1/5] Verification des modifications...
git status
echo.

echo [2/5] Construction de l'application...
call npm run build
if errorlevel 1 (
    echo ❌ Erreur de construction
    pause
    exit /b 1
)

echo ✅ Construction reussie!
echo.

echo [3/5] Verification du build...
if exist "dist\index.html" (
    echo ✅ Build genere
) else (
    echo ❌ Build manquant
    pause
    exit /b 1
)

echo.
echo [4/5] Test du site actuel...
node verify-deployment.js

echo.
echo [5/5] Instructions de mise a jour...
echo.
echo 🔄 MISE A JOUR DU DEPLOIEMENT:
echo.
echo Option 1 - Netlify CLI (Recommandee):
echo   netlify deploy --prod --dir=dist
echo.
echo Option 2 - Interface Web:
echo   1. Allez sur: https://app.netlify.com/sites/sparkling-praline-ddd170
echo   2. Cliquez sur "Deploys"
echo   3. Glissez-deposez le dossier "dist"
echo.
echo Option 3 - Git (si configure):
echo   git add .
echo   git commit -m "Update deployment"
echo   git push origin main
echo.
echo ========================================
echo     Mise a jour prete!
echo ========================================
echo.
echo Site actuel: https://sparkling-praline-ddd170.netlify.app/
echo.
pause