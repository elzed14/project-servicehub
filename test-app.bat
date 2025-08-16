@echo off
echo ========================================
echo        ServiceHub - Test Application
echo ========================================
echo.

echo [1/2] Construction de l'application...
call npm run build
if errorlevel 1 (
    echo ERREUR: Echec de la construction
    pause
    exit /b 1
)

echo.
echo [2/2] Demarrage du serveur de preview...
echo Application disponible sur: http://localhost:4173
echo.
call npm run preview