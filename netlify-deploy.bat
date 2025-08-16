@echo off
echo ========================================
echo    ServiceHub - Deploiement Netlify CLI
echo ========================================
echo.

echo [1/6] Verification de Netlify CLI...
netlify --version >nul 2>&1
if errorlevel 1 (
    echo Installation de Netlify CLI...
    call npm install -g netlify-cli
    if errorlevel 1 (
        echo ERREUR: Impossible d'installer Netlify CLI
        echo Installez manuellement: npm install -g netlify-cli
        pause
        exit /b 1
    )
)

echo [2/6] Construction de l'application...
call npm run build
if errorlevel 1 (
    echo ERREUR: Echec de la construction
    pause
    exit /b 1
)

echo [3/6] Connexion a Netlify...
echo Vous allez etre redirige vers le navigateur pour vous connecter
netlify login

echo [4/6] Initialisation du site...
if not exist ".netlify" (
    echo Creation d'un nouveau site Netlify...
    netlify init
) else (
    echo Site Netlify deja configure
)

echo [5/6] Deploiement en preview...
netlify deploy --dir=dist

echo [6/6] Deploiement en production...
set /p confirm="Deployer en production? (y/N): "
if /i "%confirm%"=="y" (
    netlify deploy --prod --dir=dist
    echo.
    echo ✅ Deploiement en production termine!
    echo Votre site est maintenant en ligne.
) else (
    echo Deploiement en production annule.
)

echo.
echo Pour voir votre site: netlify open
pause