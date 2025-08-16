# Guide de Dépannage ServiceHub

## Problèmes Courants et Solutions

### 1. Pages blanches lors de la navigation

**Symptômes :**
- Le site s'affiche mais les pages sont blanches quand on clique sur les boutons
- La navigation ne fonctionne pas

**Solutions :**

#### A. Vérifier la console du navigateur
1. Ouvrez les outils de développement (F12)
2. Regardez l'onglet Console pour les erreurs
3. Regardez l'onglet Network pour les requêtes échouées

#### B. Vider le cache
```bash
# Dans le navigateur
Ctrl+Shift+R (rechargement forcé)

# Ou vider complètement le cache
Paramètres > Confidentialité > Effacer les données de navigation
```

#### C. Redémarrer le serveur de développement
```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer
npm run dev
```

#### D. Reconstruire l'application
```bash
npm run build
npm run preview
```

### 2. Erreurs de compilation

**Solutions :**
```bash
# Nettoyer et réinstaller
npm run clean
rm -rf node_modules
npm install

# Ou sur Windows
rmdir /s node_modules
npm install
```

### 3. Problèmes de déploiement Netlify

**Solutions :**
1. Vérifier que le fichier `_redirects` existe dans `public/`
2. Vérifier que `netlify.toml` est configuré correctement
3. Reconstruire et redéployer

### 4. Mode Debug

Pour activer le mode debug, ouvrez la console du navigateur et tapez :
```javascript
localStorage.setItem('debug', 'true');
```

### 5. Test des Composants

Pour tester si tous les composants se chargent :
```javascript
// Dans la console du navigateur
import('./src/utils/debug.js').then(debug => debug.testComponents());
```

## Scripts Utiles

### Diagnostic Complet
```bash
diagnostic.bat
```

### Test de l'Application
```bash
test-app.bat
```

### Démarrage Rapide
```bash
start.bat
```

## Vérifications Manuelles

### 1. Structure des Fichiers
Vérifiez que ces fichiers existent :
- `src/App.tsx`
- `src/components/Header.tsx`
- `src/components/HomePage.tsx`
- `src/components/BrowseServices.tsx`
- `src/components/PostService.tsx`
- `src/components/ProfilePage.tsx`

### 2. Dépendances
```bash
npm list --depth=0
```

### 3. Configuration
Vérifiez :
- `package.json` - scripts et dépendances
- `vite.config.ts` - configuration Vite
- `tsconfig.json` - configuration TypeScript

## Contact Support

Si les problèmes persistent :
1. Exécutez `diagnostic.bat`
2. Copiez les logs d'erreur
3. Décrivez les étapes qui causent le problème
4. Mentionnez votre navigateur et version

## Logs Utiles

### Console Navigateur
- Erreurs JavaScript
- Requêtes réseau échouées
- Warnings React

### Terminal
- Erreurs de compilation
- Messages de démarrage
- Erreurs de build

## Réinitialisation Complète

En dernier recours :
```bash
# Sauvegarder vos modifications
git add .
git commit -m "Sauvegarde avant reset"

# Nettoyer complètement
rm -rf node_modules
rm -rf dist
npm install
npm run build
npm run dev
```