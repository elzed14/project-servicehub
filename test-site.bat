@echo off
echo ========================================
echo     ServiceHub - Test du Site Corrige
echo ========================================
echo.

echo Demarrage du serveur de developpement...
echo.
echo Site disponible sur: http://localhost:5173
echo.
echo Nouvelles fonctionnalites disponibles:
echo ✓ Vue grille/liste dans "Trouver des services"
echo ✓ Tableau de bord utilisateur (menu utilisateur)
echo ✓ Banniere de mise a jour
echo ✓ Interface amelioree
echo.
echo Appuyez sur Ctrl+C pour arreter
echo.

start http://localhost:5173
npm run dev