@echo off
title ServiceHub - Demarrage Rapide
color 0A

echo.
echo  ███████╗███████╗██████╗ ██╗   ██╗██╗ ██████╗███████╗██╗  ██╗██╗   ██╗██████╗ 
echo  ██╔════╝██╔════╝██╔══██╗██║   ██║██║██╔════╝██╔════╝██║  ██║██║   ██║██╔══██╗
echo  ███████╗█████╗  ██████╔╝██║   ██║██║██║     █████╗  ███████║██║   ██║██████╔╝
echo  ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██║██║     ██╔══╝  ██╔══██║██║   ██║██╔══██╗
echo  ███████║███████╗██║  ██║ ╚████╔╝ ██║╚██████╗███████╗██║  ██║╚██████╔╝██████╔╝
echo  ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚═╝ ╚═════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ 
echo.
echo                        Plateforme de Services Locaux
echo.
echo ================================================================================
echo.

:menu
echo Que souhaitez-vous faire ?
echo.
echo [1] Configuration initiale (premiere fois)
echo [2] Demarrer le projet (dev complet)
echo [3] Demarrer frontend uniquement
echo [4] Demarrer backend uniquement
echo [5] Verifier la sante du projet
echo [6] Installer/Mettre a jour les dependances
echo [7] Voir la documentation
echo [8] Quitter
echo.
set /p choice="Votre choix (1-8): "

if "%choice%"=="1" goto setup
if "%choice%"=="2" goto dev_full
if "%choice%"=="3" goto dev_frontend
if "%choice%"=="4" goto dev_backend
if "%choice%"=="5" goto health_check
if "%choice%"=="6" goto install_deps
if "%choice%"=="7" goto docs
if "%choice%"=="8" goto exit
goto invalid

:setup
echo.
echo Configuration initiale en cours...
call setup.bat
pause
goto menu

:dev_full
echo.
echo Demarrage du projet complet...
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3001
echo.
echo Appuyez sur Ctrl+C pour arreter
call npm run dev:full
pause
goto menu

:dev_frontend
echo.
echo Demarrage du frontend uniquement...
echo URL: http://localhost:5173
echo.
call npm run dev
pause
goto menu

:dev_backend
echo.
echo Demarrage du backend uniquement...
echo URL: http://localhost:3001
echo.
call npm run server
pause
goto menu

:health_check
echo.
echo Verification de la sante du projet...
call check-health.bat
goto menu

:install_deps
echo.
echo Installation/Mise a jour des dependances...
call npm install
echo.
echo Dependances mises a jour!
pause
goto menu

:docs
echo.
echo Documentation disponible:
echo - README.md : Vue d'ensemble du projet
echo - DEVELOPER.md : Guide pour les developpeurs
echo - project-structure.md : Structure detaillee
echo.
echo Ouvrir la documentation dans l'explorateur ? (o/n)
set /p open_docs=""
if /i "%open_docs%"=="o" (
    start .
)
pause
goto menu

:invalid
echo.
echo Choix invalide. Veuillez choisir entre 1 et 8.
echo.
pause
goto menu

:exit
echo.
echo Au revoir! Happy coding! 🚀
echo.
pause
exit