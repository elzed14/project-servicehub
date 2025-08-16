@echo off
echo ========================================
echo        ServiceHub - Demarrage
echo ========================================
echo.

echo [1/3] Verification de Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe!
    echo Veuillez installer Node.js depuis https://nodejs.org
    pause
    exit /b 1
)

echo [2/3] Installation des dependances...
call npm install
if errorlevel 1 (
    echo ERREUR: Echec de l'installation des dependances
    pause
    exit /b 1
)

echo [3/3] Demarrage des serveurs...
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3001
echo.
call npm run dev:full