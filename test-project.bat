@echo off
echo ========================================
echo     ServiceHub - Test du Projet
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

echo [3/4] Verification TypeScript...
call npx tsc --noEmit
if errorlevel 1 (
    echo ATTENTION: Erreurs TypeScript detectees
    echo Continuons quand meme...
)

echo [4/4] Demarrage du projet...
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3001
echo.
echo Appuyez sur Ctrl+C pour arreter
echo.

start "ServiceHub Backend" cmd /k "npm run server"
timeout /t 3 >nul
start "ServiceHub Frontend" cmd /k "npm run dev"

echo.
echo Projet demarre avec succes!
echo Ouvrez http://localhost:5173 dans votre navigateur
echo.
pause