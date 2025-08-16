import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware pour protéger les routes (authentification requise)
export const protect = async (req, res, next) => {
  try {
    let token;

    // Vérifier si le token est dans les headers Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Vérifier si le token est dans les cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    // Vérifier si le token existe
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Accès non autorisé, token manquant'
      });
    }

    try {
      // Vérifier et décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur à partir du token
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Token invalide, utilisateur non trouvé'
        });
      }

      // Vérifier si le compte est actif
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          error: 'Compte désactivé'
        });
      }

      // Mettre à jour la dernière activité
      user.lastActive = new Date();
      await user.save({ validateBeforeSave: false });

      // Ajouter l'utilisateur à la requête
      req.user = user;
      next();
    } catch (error) {
      console.error('Erreur de vérification du token:', error);
      return res.status(401).json({
        success: false,
        error: 'Token invalide'
      });
    }
  } catch (error) {
    console.error('Erreur dans le middleware d\'authentification:', error);
    return res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// Middleware pour vérifier les rôles d'administrateur
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Accès non autorisé'
      });
    }

    if (roles.includes('admin') && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Accès refusé, privilèges administrateur requis'
      });
    }

    next();
  };
};

// Middleware optionnel pour l'authentification (n'échoue pas si pas de token)
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Vérifier si le token est dans les headers Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Vérifier si le token est dans les cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    // Si pas de token, continuer sans utilisateur
    if (!token) {
      return next();
    }

    try {
      // Vérifier et décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur à partir du token
      const user = await User.findById(decoded.userId).select('-password');

      if (user && user.isActive) {
        // Mettre à jour la dernière activité
        user.lastActive = new Date();
        await user.save({ validateBeforeSave: false });

        // Ajouter l'utilisateur à la requête
        req.user = user;
      }
    } catch (error) {
      // En cas d'erreur de token, continuer sans utilisateur
      console.log('Token invalide dans optionalAuth:', error.message);
    }

    next();
  } catch (error) {
    console.error('Erreur dans le middleware d\'authentification optionnelle:', error);
    next(); // Continuer même en cas d'erreur
  }
};

// Middleware pour vérifier la propriété d'une ressource
export const checkOwnership = (Model, paramName = 'id', ownerField = 'provider') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramName];
      const resource = await Model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          error: 'Ressource non trouvée'
        });
      }

      // Vérifier si l'utilisateur est le propriétaire ou un admin
      const ownerId = resource[ownerField];
      if (ownerId.toString() !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          error: 'Accès refusé, vous n\'êtes pas autorisé à modifier cette ressource'
        });
      }

      // Ajouter la ressource à la requête pour éviter une nouvelle requête
      req.resource = resource;
      next();
    } catch (error) {
      console.error('Erreur dans le middleware de vérification de propriété:', error);
      return res.status(500).json({
        success: false,
        error: 'Erreur serveur'
      });
    }
  };
};

// Middleware pour limiter le taux de requêtes (rate limiting simple)
export const rateLimit = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  const requests = new Map();

  return (req, res, next) => {
    const clientId = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Nettoyer les anciennes entrées
    if (requests.has(clientId)) {
      const clientRequests = requests.get(clientId);
      const validRequests = clientRequests.filter(time => time > windowStart);
      requests.set(clientId, validRequests);
    }

    // Obtenir les requêtes actuelles du client
    const clientRequests = requests.get(clientId) || [];

    // Vérifier si la limite est dépassée
    if (clientRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Trop de requêtes, veuillez réessayer plus tard',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    // Ajouter la requête actuelle
    clientRequests.push(now);
    requests.set(clientId, clientRequests);

    next();
  };
};

// Middleware pour valider les ObjectId MongoDB
export const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    // Vérifier si l'ID est un ObjectId valide
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'ID invalide'
      });
    }

    next();
  };
};

// Middleware pour parser les cookies
export const parseCookies = (req, res, next) => {
  const cookies = {};
  
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach(cookie => {
      const parts = cookie.trim().split('=');
      if (parts.length === 2) {
        cookies[parts[0]] = decodeURIComponent(parts[1]);
      }
    });
  }
  
  req.cookies = cookies;
  next();
};