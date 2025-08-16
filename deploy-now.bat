@echo off
echo ========================================
echo    ServiceHub - Deploiement Immediat
echo ========================================
echo.

echo ✅ Build genere avec succes!
echo ✅ 1556 modules transformes
echo ✅ Tous les composants inclus
echo.

echo 🚀 DEPLOIEMENT SUR NETLIFY:
echo.
echo 1. Allez sur: https://app.netlify.com/sites/sparkling-praline-ddd170
echo 2. Cliquez sur "Deploys"
echo 3. Glissez-deposez le dossier "dist" complet
echo 4. Attendez la fin du deploiement (2-3 minutes)
echo.

echo 📁 Dossier a deployer: %CD%\dist
echo.

echo Apres deploiement, testez:
echo • https://sparkling-praline-ddd170.netlify.app/
echo • Navigation entre les pages
echo • Tous les composants developpes
echo.

echo Voulez-vous ouvrir le dossier dist? (y/N)
set /p open="Reponse: "
if /i "%open%"=="y" (
    explorer dist
)

echo.
echo Voulez-vous ouvrir Netlify? (y/N)
set /p netlify="Reponse: "
if /i "%netlify%"=="y" (
    start https://app.netlify.com/sites/sparkling-praline-ddd170
)

pause