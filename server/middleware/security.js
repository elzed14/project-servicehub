import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

// Configuration Helmet pour la sécurité
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
});

// Sanitisation MongoDB compatible Express 5
export const mongoSanitizer = mongoSanitize({
  replaceWith: '_'
});

// Middleware anti-XSS compatible Express 5
export const xssProtection = (req, res, next) => {
  const sanitize = (obj) => {
    if (!obj) return;
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  try {
    if (req.body) sanitize(req.body);
    if (req.query && typeof req.query === 'object') sanitize(req.query);
    if (req.params) sanitize(req.params);
  } catch (error) {
    console.warn('XSS protection warning:', error.message);
  }
  
  next();
};