# Guide de Déploiement ServiceHub

## 🚀 Déploiement sur Netlify

### Méthode 1: Drag & Drop (Plus Simple)

1. **Construire l'application**
   ```bash
   npm run build
   ```

2. **Aller sur Netlify**
   - Visitez [https://app.netlify.com/](https://app.netlify.com/)
   - Connectez-vous ou créez un compte

3. **Déployer**
   - Glissez-déposez le dossier `dist` sur la zone de déploiement Netlify
   - Attendez que le déploiement se termine
   - Votre site sera disponible sur une URL générée automatiquement

### Méthode 2: Netlify CLI (Recommandée)

1. **Installer Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Construire l'application**
   ```bash
   npm run build
   ```

3. **Se connecter à Netlify**
   ```bash
   netlify login
   ```

4. **Initialiser le site**
   ```bash
   netlify init
   ```

5. **Déployer en preview**
   ```bash
   netlify deploy --dir=dist
   ```

6. **Déployer en production**
   ```bash
   netlify deploy --prod --dir=dist
   ```

### Méthode 3: Script Automatique

Utilisez le script fourni :
```bash
netlify-deploy.bat
```

## 🔧 Configuration

### Fichiers de Configuration

- **netlify.toml** : Configuration de build et redirections
- **public/_redirects** : Règles de redirection pour SPA
- **dist/** : Dossier de build à déployer

### Variables d'Environnement

Si nécessaire, ajoutez dans Netlify :
- `NODE_VERSION=18`
- `NPM_VERSION=8`

## 📋 Checklist de Déploiement

- [ ] `npm run build` réussi
- [ ] Dossier `dist` généré
- [ ] Fichier `_redirects` présent dans `dist`
- [ ] Pas d'erreurs dans la console
- [ ] Tests de navigation fonctionnels

## 🌐 URLs de Déploiement

### Production Actuelle
- **URL**: https://sparkling-praline-ddd170.netlify.app/
- **Status**: ✅ En ligne

### Domaine Personnalisé (Optionnel)

Pour configurer un domaine personnalisé :
1. Aller dans Site Settings > Domain management
2. Ajouter votre domaine
3. Configurer les DNS

## 🔍 Vérifications Post-Déploiement

### Tests Essentiels
1. **Page d'accueil** : Chargement correct
2. **Navigation** : Tous les boutons fonctionnent
3. **Authentification** : Accès rapide fonctionne
4. **Services** : Affichage et recherche
5. **Responsive** : Test sur mobile

### Outils de Debug
- Console navigateur (F12)
- Netlify Functions logs
- Lighthouse audit

## 🚨 Résolution de Problèmes

### Erreur 404 sur les routes
- Vérifier que `_redirects` est présent
- Contenu : `/* /index.html 200`

### Build échoue
```bash
# Nettoyer et reconstruire
npm run clean
npm install
npm run build
```

### Site ne se charge pas
- Vérifier les erreurs dans la console
- Vérifier les chemins des assets
- Tester en local avec `npm run preview`

## 📊 Monitoring

### Métriques Netlify
- Bandwidth usage
- Build minutes
- Form submissions
- Function invocations

### Analytics
- Google Analytics (si configuré)
- Netlify Analytics
- Core Web Vitals

## 🔄 Déploiement Continu

### GitHub Integration
1. Connecter le repo GitHub
2. Configurer auto-deploy sur push
3. Définir la branche de production

### Commandes de Build
```toml
[build]
  publish = "dist"
  command = "npm run build"
```

## 📝 Notes Importantes

- **Temps de build** : ~10-15 secondes
- **Taille du bundle** : ~1MB (gzippé)
- **Node version** : 18+
- **Cache** : Assets mis en cache automatiquement

## 🆘 Support

En cas de problème :
1. Vérifier les logs de build Netlify
2. Tester en local avec `npm run preview`
3. Consulter la documentation Netlify
4. Utiliser le script `diagnostic.bat`

---

**Dernière mise à jour** : Janvier 2025
**Version** : 1.0.0
**Status** : ✅ Déployé et fonctionnel