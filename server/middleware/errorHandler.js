// Middleware de gestion des erreurs globales
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log de l'erreur pour le débogage
  console.error('Erreur:', err);

  // Erreur de validation Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      statusCode: 400,
      message
    };
  }

  // Erreur de duplication Mongoose (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} existe déjà`;
    error = {
      statusCode: 400,
      message
    };
  }

  // Erreur ObjectId invalide Mongoose
  if (err.name === 'CastError') {
    const message = 'Ressource non trouvée';
    error = {
      statusCode: 404,
      message
    };
  }

  // Erreur JWT invalide
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token invalide';
    error = {
      statusCode: 401,
      message
    };
  }

  // Erreur JWT expiré
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expiré';
    error = {
      statusCode: 401,
      message
    };
  }

  // Erreur de connexion à la base de données
  if (err.name === 'MongoNetworkError' || err.name === 'MongooseServerSelectionError') {
    const message = 'Erreur de connexion à la base de données';
    error = {
      statusCode: 500,
      message
    };
  }

  // Erreur de limite de taille de fichier (multer)
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'Fichier trop volumineux';
    error = {
      statusCode: 400,
      message
    };
  }

  // Erreur de type de fichier non autorisé (multer)
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Type de fichier non autorisé';
    error = {
      statusCode: 400,
      message
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Erreur serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Middleware pour gérer les routes non trouvées
export const notFound = (req, res, next) => {
  // Ignorer les erreurs favicon pour éviter le spam de logs
  if (req.originalUrl === '/favicon.ico') {
    return res.status(204).end();
  }
  
  const error = new Error(`Route non trouvée - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Middleware pour gérer les erreurs asynchrones
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Middleware pour valider les données JSON
export const validateJSON = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'JSON invalide dans le corps de la requête'
    });
  }
  next(err);
};

// Middleware pour gérer les erreurs de CORS
export const corsErrorHandler = (err, req, res, next) => {
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      error: 'Accès CORS refusé'
    });
  }
  next(err);
};

// Middleware pour logger les erreurs
export const errorLogger = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const userAgent = req.get('User-Agent') || 'Unknown';
  const ip = req.ip || req.connection.remoteAddress;
  const userId = req.user ? req.user.id : 'Anonymous';

  console.error(`
    ==================== ERREUR ====================
    Timestamp: ${timestamp}
    Method: ${method}
    URL: ${url}
    User ID: ${userId}
    IP: ${ip}
    User Agent: ${userAgent}
    Error Name: ${err.name}
    Error Message: ${err.message}
    Stack Trace: ${err.stack}
    ================================================
  `);

  next(err);
};

// Middleware pour nettoyer les données sensibles des erreurs
export const sanitizeError = (err, req, res, next) => {
  // Supprimer les informations sensibles des messages d'erreur
  if (err.message) {
    // Masquer les chemins de fichiers
    err.message = err.message.replace(/\/[^\s]+/g, '[PATH_HIDDEN]');
    
    // Masquer les adresses IP
    err.message = err.message.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP_HIDDEN]');
    
    // Masquer les mots de passe dans les URLs
    err.message = err.message.replace(/:\/\/[^:]+:[^@]+@/g, '://[CREDENTIALS_HIDDEN]@');
  }

  next(err);
};

// Classe d'erreur personnalisée
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Fonction utilitaire pour créer des erreurs personnalisées
export const createError = (message, statusCode = 500) => {
  return new AppError(message, statusCode);
};

// Middleware pour gérer les timeouts
export const timeoutHandler = (timeout = 30000) => {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({
          success: false,
          error: 'Timeout de la requête'
        });
      }
    }, timeout);

    // Nettoyer le timer quand la réponse est envoyée
    res.on('finish', () => {
      clearTimeout(timer);
    });

    res.on('close', () => {
      clearTimeout(timer);
    });

    next();
  };
};

// Middleware pour gérer les erreurs de mémoire
export const memoryErrorHandler = (err, req, res, next) => {
  if (err.code === 'ENOMEM' || err.message.includes('out of memory')) {
    return res.status(507).json({
      success: false,
      error: 'Mémoire insuffisante sur le serveur'
    });
  }
  next(err);
};