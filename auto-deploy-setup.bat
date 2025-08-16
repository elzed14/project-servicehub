@echo off
echo ========================================
echo   ServiceHub - Configuration Auto-Deploy
echo ========================================
echo.

echo [1/5] Initialisation Git...
if not exist ".git" (
    git init
    git branch -M main
)

echo [2/5] Configuration Git...
git add .
git commit -m "Initial commit with auto-deploy setup"

echo [3/5] Connexion GitHub...
echo Creez un repo sur GitHub: https://github.com/new
echo Nom suggere: servicehub-auto-deploy
echo.
set /p repo_url="URL du repo GitHub (ex: https://github.com/username/repo.git): "
git remote add origin %repo_url%

echo [4/5] Push vers GitHub...
git push -u origin main

echo [5/5] Configuration Netlify...
echo.
echo ETAPES NETLIFY:
echo 1. Allez sur: https://app.netlify.com/sites/sparkling-praline-ddd170/settings/deploys
echo 2. Cliquez "Link to Git repository"
echo 3. Selectionnez votre repo GitHub
echo 4. Branch: main
echo 5. Build command: npm run build
echo 6. Publish directory: dist
echo.
echo ✅ Auto-deploy configure!
echo Maintenant chaque modification sera deployee automatiquement.
echo.
pause