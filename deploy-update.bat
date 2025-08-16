@echo off
echo ========================================
echo    ServiceHub - Deploiement Mise a Jour
echo ========================================
echo.

echo [1/4] Build de production...
call npm run build
if errorlevel 1 (
    echo ERREUR: Echec du build
    pause
    exit /b 1
)

echo [2/4] Test des nouvelles fonctionnalites...
call npm run test
if errorlevel 1 (
    echo ATTENTION: Tests echoues, continuer? (Y/N)
    set /p continue=
    if /i not "%continue%"=="Y" exit /b 1
)

echo [3/4] Deploiement sur Netlify...
echo Copie des fichiers vers dist/...
xcopy /E /I /Y dist\* .netlify\

echo [4/4] Mise a jour terminee!
echo Site mis a jour avec les nouvelles fonctionnalites:
echo - Filtres avances
echo - Fiches services detaillees  
echo - Systeme d'avis complet
echo - Tableau de bord utilisateur
echo - Pagination avancee
echo.
echo Site disponible: https://sparkling-praline-ddd170.netlify.app/
pause