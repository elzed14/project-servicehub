# Structure du Projet ServiceHub

## Vue d'ensemble
ServiceHub est une plateforme de services permettant aux utilisateurs de publier et rechercher des services locaux.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + MongoDB
- **Communication**: Socket.IO pour le temps réel
- **Authentification**: JWT + bcrypt

## Structure des dossiers

### Frontend (`src/`)
```
src/
├── components/          # Composants React réutilisables
│   ├── auth/           # Composants d'authentification
│   └── __tests__/      # Tests des composants
├── context/            # Context React (état global)
├── hooks/              # Hooks personnalisés
├── services/           # Services API et utilitaires
├── types/              # Types TypeScript
├── utils/              # Fonctions utilitaires
├── constants/          # Constantes de l'application
└── data/               # Données mockées
```

### Backend (`server/`)
```
server/
├── config/             # Configuration (DB, etc.)
├── controllers/        # Logique métier
├── middleware/         # Middlewares Express
├── models/             # Modèles MongoDB/Mongoose
├── routes/             # Routes API
├── socket/             # Gestion Socket.IO
│   └── events/         # Événements Socket
└── utils/              # Utilitaires serveur
```

### Configuration
```
├── .env.example        # Variables d'environnement exemple
├── package.json        # Dépendances et scripts
├── vite.config.ts      # Configuration Vite
├── tailwind.config.js  # Configuration Tailwind
├── tsconfig.json       # Configuration TypeScript
└── docker-compose.yml  # Configuration Docker
```

## Scripts disponibles

### Développement
- `npm run dev` - Frontend uniquement (port 5173)
- `npm run server` - Backend uniquement (port 3001)
- `npm run dev:full` - Frontend + Backend simultanément

### Production
- `npm run build` - Build de production
- `npm run preview` - Prévisualiser le build

### Tests
- `npm run test` - Lancer les tests
- `npm run test:ui` - Interface de test
- `npm run test:coverage` - Couverture de code

### Base de données
- `npm run data:import` - Importer des données de test
- `npm run data:destroy` - Supprimer les données

### Docker
- `npm run docker:build` - Construire l'image Docker
- `npm run docker:run` - Lancer avec Docker Compose
- `npm run docker:stop` - Arrêter les conteneurs

## Configuration requise

### Variables d'environnement (.env)
```
NODE_ENV=development
PORT=3001
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/servicehub
JWT_SECRET=your_strong_random_secret_key_here
JWT_EXPIRE=30d
```

### Prérequis
- Node.js 18+
- MongoDB 6+
- npm ou yarn

## Démarrage rapide

1. **Installation**
   ```bash
   npm install
   ```

2. **Configuration**
   ```bash
   cp .env.example .env
   # Modifier les valeurs dans .env
   ```

3. **Démarrage**
   ```bash
   # Option 1: Tout en une fois
   npm run dev:full
   
   # Option 2: Séparément
   npm run server  # Terminal 1
   npm run dev     # Terminal 2
   ```

4. **Accès**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/api/health

## Fonctionnalités implémentées

✅ **Authentification**
- Inscription/Connexion JWT
- Protection des routes
- Gestion des sessions

✅ **Services**
- Publication de services
- Recherche et filtrage
- Catégorisation

✅ **Messagerie**
- Chat en temps réel (Socket.IO)
- Conversations privées
- Notifications

✅ **Interface**
- Design responsive (Tailwind CSS)
- Composants réutilisables
- Gestion d'état (Context API)

✅ **Sécurité**
- Rate limiting
- Validation des données
- Protection XSS/CSRF
- Sanitisation MongoDB

✅ **Monitoring**
- Logs structurés
- Health checks
- Métriques de performance

## Prochaines étapes

🔄 **En cours**
- Tests unitaires complets
- Documentation API
- Optimisations performance

📋 **À faire**
- Système de paiement
- Notifications push
- Cache Redis
- CI/CD Pipeline