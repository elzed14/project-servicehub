# Guide Développeur - ServiceHub

## Configuration de l'environnement de développement

### 1. Prérequis
- **Node.js** 18+ ([Télécharger](https://nodejs.org))
- **MongoDB** 6+ ([Télécharger](https://www.mongodb.com/try/download/community)) ou MongoDB Atlas
- **Git** ([Télécharger](https://git-scm.com))
- **VS Code** (recommandé) avec les extensions :
  - ES7+ React/Redux/React-Native snippets
  - TypeScript Importer
  - Tailwind CSS IntelliSense
  - MongoDB for VS Code

### 2. Installation rapide

```bash
# 1. Cloner le projet
git clone <url-du-repo>
cd project

# 2. Configuration automatique
setup.bat

# 3. Démarrage
start.bat
```

### 3. Structure de développement

#### Frontend (React + TypeScript)
```
src/
├── components/          # Composants réutilisables
│   ├── auth/           # Authentification
│   ├── __tests__/      # Tests unitaires
│   └── *.tsx           # Composants principaux
├── hooks/              # Hooks personnalisés
├── services/           # API et services
├── types/              # Types TypeScript
└── utils/              # Utilitaires
```

#### Backend (Node.js + Express)
```
server/
├── controllers/        # Logique métier
├── models/            # Modèles MongoDB
├── routes/            # Routes API
├── middleware/        # Middlewares
├── socket/            # Socket.IO
└── utils/             # Utilitaires serveur
```

### 4. Commandes de développement

#### Démarrage
```bash
npm run dev:full        # Frontend + Backend
npm run dev            # Frontend uniquement
npm run server         # Backend uniquement
```

#### Tests
```bash
npm run test           # Tests unitaires
npm run test:ui        # Interface de test
npm run test:coverage  # Couverture de code
```

#### Qualité de code
```bash
npm run lint           # ESLint
npm run format         # Prettier
npm run type-check     # Vérification TypeScript
```

### 5. Workflow de développement

#### Branches
- `main` - Production
- `develop` - Développement
- `feature/nom-feature` - Nouvelles fonctionnalités
- `fix/nom-bug` - Corrections de bugs

#### Commits
Utilisez des messages de commit clairs :
```
feat: ajouter système de messagerie
fix: corriger bug d'authentification
docs: mettre à jour README
style: formater code avec prettier
```

### 6. API Endpoints

#### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

#### Services
- `GET /api/services` - Liste des services
- `POST /api/services` - Créer un service
- `GET /api/services/:id` - Détails d'un service
- `PUT /api/services/:id` - Modifier un service
- `DELETE /api/services/:id` - Supprimer un service

#### Messages
- `GET /api/messages/conversations` - Conversations
- `POST /api/messages` - Envoyer un message
- `GET /api/messages/:conversationId` - Messages d'une conversation

### 7. Socket.IO Events

#### Client → Serveur
- `join_conversation` - Rejoindre une conversation
- `send_message` - Envoyer un message
- `typing_start` - Commencer à taper
- `typing_stop` - Arrêter de taper

#### Serveur → Client
- `new_message` - Nouveau message reçu
- `user_typing` - Utilisateur en train de taper
- `conversation_updated` - Conversation mise à jour

### 8. Base de données

#### Modèles principaux
- **User** - Utilisateurs
- **Service** - Services publiés
- **Conversation** - Conversations
- **Message** - Messages
- **Category** - Catégories de services

#### Commandes utiles
```bash
npm run data:import    # Importer données de test
npm run data:destroy   # Supprimer toutes les données
```

### 9. Débogage

#### Logs
- Frontend : Console du navigateur
- Backend : Fichiers dans `/logs/`
- MongoDB : Logs de connexion

#### Outils
- **React DevTools** - Débogage React
- **MongoDB Compass** - Interface MongoDB
- **Postman** - Test des APIs

### 10. Déploiement

#### Docker
```bash
npm run docker:build   # Construire l'image
npm run docker:run     # Lancer les conteneurs
npm run docker:stop    # Arrêter les conteneurs
```

#### Production
```bash
npm run build          # Build de production
npm run preview        # Prévisualiser le build
```

### 11. Bonnes pratiques

#### Code
- Utilisez TypeScript pour tout nouveau code
- Suivez les conventions de nommage
- Écrivez des tests pour les nouvelles fonctionnalités
- Documentez les fonctions complexes

#### Performance
- Optimisez les images
- Utilisez le lazy loading
- Minimisez les re-renders React
- Indexez les requêtes MongoDB

#### Sécurité
- Validez toutes les entrées utilisateur
- Utilisez HTTPS en production
- Gardez les dépendances à jour
- Ne commitez jamais de secrets

### 12. Dépannage

#### Problèmes courants
1. **Port déjà utilisé** : Changez le port dans `.env`
2. **MongoDB non connecté** : Vérifiez l'URI dans `.env`
3. **Dépendances manquantes** : Lancez `npm install`
4. **Build échoue** : Vérifiez les erreurs TypeScript

#### Commandes utiles
```bash
check-health.bat       # Vérifier la santé du projet
npm run clean          # Nettoyer le cache
npm run health-check   # Vérifier l'API
```

### 13. Ressources

- [Documentation React](https://react.dev)
- [Documentation TypeScript](https://www.typescriptlang.org/docs)
- [Documentation Express](https://expressjs.com)
- [Documentation MongoDB](https://docs.mongodb.com)
- [Documentation Socket.IO](https://socket.io/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)