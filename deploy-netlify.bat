@echo off
echo ========================================
echo    ServiceHub - Deploiement Netlify
echo ========================================
echo.

echo 🌐 Alternative a Vercel - Acces direct garanti!
echo.

echo 🔨 Build de l'application...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erreur lors du build!
    pause
    exit /b 1
)

echo.
echo 🚀 Deploiement sur Netlify...
echo.
echo ⚠️  Si c'est votre premier deploiement:
echo    - Choisissez "Create & configure a new site"
echo    - Donnez un nom a votre site (ex: servicehub-app)
echo.

netlify deploy --prod --dir=dist

echo.
echo ========================================
echo ✅ Deploiement Netlify termine!
echo ========================================
echo.
echo 🎉 Votre application est maintenant accessible
echo    directement par vos amis sans redirection!
echo.
echo 📋 URL Netlify affichee ci-dessus
echo.
pause