import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import connectDB from './server/config/database.js';
import { errorHandler, notFound } from './server/middleware/errorHandler.js';
import { generalLimiter, authLimiter } from './server/middleware/rateLimiter.js';
import { securityHeaders, mongoSanitizer, xssProtection } from './server/middleware/security.js';
import { performanceMonitor, errorTracker } from './server/middleware/monitoring.js';
import authRoutes from './server/routes/auth.js';
import testAuthRoutes from './server/routes/test-auth.js';
import testServicesRoutes from './server/routes/test-services.js';
import testCategoriesRoutes from './server/routes/test-categories.js';
import userRoutes from './server/routes/users.js';
import serviceRoutes from './server/routes/services.js';
import messageRoutes from './server/routes/messages.js';
import reviewRoutes from './server/routes/reviews.js';
import orderRoutes from './server/routes/orders.js';
import notificationRoutes from './server/routes/notifications.js';
import { initSocket } from './server/socket/index.js';

// Charger les variables d'environnement
dotenv.config();

// Connecter à MongoDB
connectDB();
console.log('🚀 Mode production - Base de données activée');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Initialiser Socket.IO
initSocket(io);

// Middlewares de sécurité
app.use(securityHeaders);
// app.use(xssProtection); // Désactivé temporairement
// app.use(mongoSanitizer); // Désactivé temporairement
app.use(generalLimiter);

// Middlewares de base
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Monitoring
app.use(performanceMonitor);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes de l'API - Mode production
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);
console.log('✅ Routes API activées avec base de données');

// Route de test
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Route de health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Route favicon
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Route de test pour l'inscription
app.post('/api/test/register', (req, res) => {
  console.log('Test register request:', req.body);
  res.status(201).json({
    success: true,
    token: 'test-token-123',
    user: {
      id: 'test-user-id',
      name: req.body.name || 'Test User',
      email: req.body.email || 'test@example.com',
      location: req.body.location || 'Test Location',
      avatar: 'https://via.placeholder.com/150',
      rating: 5,
      reviews: 0
    }
  });
});

// Gestion des erreurs
app.use(notFound);
app.use(errorTracker);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Gérer les rejets de promesses non gérés
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Fermer le serveur et quitter le processus
  httpServer.close(() => process.exit(1));
});
