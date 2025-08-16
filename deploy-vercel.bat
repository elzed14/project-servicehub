@echo off
echo ========================================
echo    ServiceHub - Deploiement Vercel
echo ========================================
echo.

echo 🚀 Guide de deploiement etape par etape
echo.

echo Etape 1: Connexion a Vercel
echo ----------------------------------------
echo Commande a executer: vercel login
echo.
echo ⚠️  IMPORTANT:
echo - Une page web va s'ouvrir
echo - Connectez-vous avec GitHub ou Email
echo - Revenez ici apres connexion
echo.
pause

echo.
echo 🔑 Lancement de la connexion...
vercel login

echo.
echo Etape 2: Deploiement
echo ----------------------------------------
echo Si la connexion a reussi, on continue...
echo.
pause

echo.
echo 🚀 Lancement du deploiement...
echo.
echo Questions que Vercel va poser:
echo 1. "Set up and deploy?" → Tapez Y
echo 2. "Which scope?" → Appuyez sur Entree
echo 3. "Link to existing project?" → Tapez N
echo 4. "Project name?" → Tapez servicehub ou Entree
echo 5. "Directory?" → Appuyez sur Entree
echo.
pause

vercel --prod --yes

echo.
echo ========================================
echo ✅ Deploiement termine!
echo ========================================
echo.
echo Votre application est maintenant en ligne!
echo L'URL sera affichee ci-dessus.
echo.
pause