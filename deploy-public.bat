@echo off
echo ========================================
echo    ServiceHub - Deploiement Public
echo ========================================
echo.

echo 🌐 Deploiement avec acces public direct
echo.

echo 🔨 Build de l'application...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erreur lors du build!
    pause
    exit /b 1
)

echo.
echo 🚀 Deploiement sur Vercel (mode public)...
vercel --prod --public --yes

echo.
echo ========================================
echo ✅ Deploiement public termine!
echo ========================================
echo.
echo 🎉 Votre application est accessible publiquement!
echo 👥 Vos amis peuvent maintenant acceder directement
echo    a ServiceHub sans se connecter a Vercel.
echo.
echo 📋 URL de production affichee ci-dessus
echo.
pause