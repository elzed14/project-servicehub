@echo off
echo ========================================
echo        ServiceHub - Diagnostic
echo ========================================
echo.

echo [1/5] Verification de Node.js...
node --version
if errorlevel 1 (
    echo ERREUR: Node.js non installe
    pause
    exit /b 1
)

echo.
echo [2/5] Verification des dependances...
if not exist "node_modules" (
    echo Installation des dependances...
    call npm install
)

echo.
echo [3/5] Verification de la structure des fichiers...
if exist "src\App.tsx" (
    echo ✅ App.tsx trouve
) else (
    echo ❌ App.tsx manquant
)

if exist "src\components\Header.tsx" (
    echo ✅ Header.tsx trouve
) else (
    echo ❌ Header.tsx manquant
)

if exist "src\components\HomePage.tsx" (
    echo ✅ HomePage.tsx trouve
) else (
    echo ❌ HomePage.tsx manquant
)

if exist "src\components\BrowseServices.tsx" (
    echo ✅ BrowseServices.tsx trouve
) else (
    echo ❌ BrowseServices.tsx manquant
)

echo.
echo [4/5] Test de compilation...
call npm run build
if errorlevel 1 (
    echo ❌ Erreur de compilation
    pause
    exit /b 1
) else (
    echo ✅ Compilation reussie
)

echo.
echo [5/5] Verification du build...
if exist "dist\index.html" (
    echo ✅ Build genere avec succes
) else (
    echo ❌ Build non genere
)

echo.
echo ========================================
echo        Diagnostic termine
echo ========================================
echo.
echo Pour tester l'application:
echo 1. Executez: npm run dev
echo 2. Ouvrez: http://localhost:5173
echo.
pause