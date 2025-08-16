import rateLimit from 'express-rate-limit';

// Rate limiter général
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par IP
  message: {
    success: false,
    error: 'Trop de requêtes, réessayez dans 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter pour l'authentification
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 tentatives de connexion
  message: {
    success: false,
    error: 'Trop de tentatives de connexion, réessayez dans 15 minutes'
  },
  skipSuccessfulRequests: true,
});

// Rate limiter pour les messages
export const messageLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 messages par minute
  message: {
    success: false,
    error: 'Trop de messages envoyés, ralentissez'
  },
});