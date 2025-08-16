@echo off
echo ========================================
echo    ServiceHub - Mise a jour Vercel
echo ========================================
echo.

echo 🔄 Mise a jour du deploiement existant
echo.

echo Etape 1: Verification du build
echo ----------------------------------------
echo Construction du projet...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erreur lors du build!
    pause
    exit /b 1
)
echo ✅ Build reussi!
echo.

echo Etape 2: Deploiement vers Vercel
echo ----------------------------------------
echo Deploiement des nouveaux changements...
echo.

vercel --prod

echo.
echo ========================================
echo ✅ Mise a jour terminee!
echo ========================================
echo.
echo Vos nouveaux changements sont en ligne:
echo - Nouveaux composants UI
echo - Animations Framer Motion
echo - Mode sombre
echo - Design system complet
echo.
echo 🌐 Visitez votre application mise a jour!
echo.
pause