@echo off
echo ========================================
echo    ServiceHub - Verification Sante
echo ========================================
echo.

echo [1/4] Verification des fichiers essentiels...
set "missing_files="

if not exist "package.json" set "missing_files=%missing_files% package.json"
if not exist "server.js" set "missing_files=%missing_files% server.js"
if not exist "vite.config.ts" set "missing_files=%missing_files% vite.config.ts"
if not exist ".env" set "missing_files=%missing_files% .env"
if not exist "src\main.tsx" set "missing_files=%missing_files% src\main.tsx"

if defined missing_files (
    echo ERREUR: Fichiers manquants:%missing_files%
    pause
    exit /b 1
) else (
    echo ✓ Tous les fichiers essentiels sont presents
)

echo.
echo [2/4] Verification des dependances...
if not exist "node_modules" (
    echo ATTENTION: node_modules manquant
    echo Lancez: npm install
    pause
    exit /b 1
) else (
    echo ✓ Dependencies installees
)

echo.
echo [3/4] Test de connectivite backend...
echo Tentative de connexion au backend...
curl -s http://localhost:3001/api/health >nul 2>&1
if errorlevel 1 (
    echo ATTENTION: Backend non accessible sur le port 3001
    echo Assurez-vous que le serveur est demarre
) else (
    echo ✓ Backend accessible
)

echo.
echo [4/4] Verification de la structure...
echo Verification des dossiers principaux:

if exist "src\components" (echo ✓ src\components) else (echo ✗ src\components manquant)
if exist "src\services" (echo ✓ src\services) else (echo ✗ src\services manquant)
if exist "server\controllers" (echo ✓ server\controllers) else (echo ✗ server\controllers manquant)
if exist "server\models" (echo ✓ server\models) else (echo ✗ server\models manquant)
if exist "server\routes" (echo ✓ server\routes) else (echo ✗ server\routes manquant)

echo.
echo ========================================
echo       Verification terminee!
echo ========================================
echo.
echo Pour demarrer le projet:
echo   npm run dev:full
echo.
echo Pour plus d'informations:
echo   Consultez project-structure.md
echo.
pause