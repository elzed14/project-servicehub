@echo off
echo ========================================
echo     ServiceHub - Configuration
echo ========================================
echo.

echo [1/5] Verification de l'environnement...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe!
    echo Veuillez installer Node.js depuis https://nodejs.org
    pause
    exit /b 1
)

echo Node.js detecte: 
node --version

echo [2/5] Verification de MongoDB...
mongod --version >nul 2>&1
if errorlevel 1 (
    echo ATTENTION: MongoDB n'est pas detecte
    echo Assurez-vous que MongoDB est installe et en cours d'execution
    echo Ou utilisez MongoDB Atlas (cloud)
) else (
    echo MongoDB detecte:
    mongod --version | findstr "db version"
)

echo.
echo [3/5] Configuration des variables d'environnement...
if not exist .env (
    if exist .env.example (
        copy .env.example .env
        echo Fichier .env cree depuis .env.example
        echo IMPORTANT: Modifiez le fichier .env avec vos valeurs
    ) else (
        echo ATTENTION: .env.example introuvable
    )
) else (
    echo Fichier .env existe deja
)

echo.
echo [4/5] Installation des dependances...
call npm install
if errorlevel 1 (
    echo ERREUR: Echec de l'installation des dependances
    pause
    exit /b 1
)

echo.
echo [5/5] Verification de la configuration...
echo Structure du projet:
echo - Frontend: src/ (React + TypeScript)
echo - Backend: server/ (Node.js + Express)
echo - Base de donnees: MongoDB
echo - Communication: Socket.IO
echo.

echo ========================================
echo        Configuration terminee!
echo ========================================
echo.
echo Prochaines etapes:
echo 1. Modifiez le fichier .env avec vos parametres
echo 2. Demarrez MongoDB (si local)
echo 3. Lancez: npm run dev:full
echo.
echo Ports utilises:
echo - Frontend: http://localhost:5173
echo - Backend:  http://localhost:3001
echo.
pause