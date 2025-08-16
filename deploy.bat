@echo off
echo ========================================
echo        ServiceHub - Deploiement Netlify
echo ========================================
echo.

echo [1/4] Verification de l'environnement...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe!
    pause
    exit /b 1
)

echo [2/4] Installation des dependances...
call npm install
if errorlevel 1 (
    echo ERREUR: Echec de l'installation
    pause
    exit /b 1
)

echo [3/4] Construction de l'application...
call npm run build
if errorlevel 1 (
    echo ERREUR: Echec de la construction
    pause
    exit /b 1
)

echo [4/4] Verification du build...
if exist "dist\index.html" (
    echo ✅ Build genere avec succes
) else (
    echo ❌ Build non genere
    pause
    exit /b 1
)

echo.
echo ========================================
echo        Build pret pour le deploiement
echo ========================================
echo.
echo Le dossier 'dist' contient l'application buildee.
echo.
echo Pour deployer sur Netlify:
echo 1. Allez sur https://app.netlify.com/
echo 2. Glissez-deposez le dossier 'dist' sur Netlify
echo 3. Ou utilisez Netlify CLI: netlify deploy --prod --dir=dist
echo.
pause