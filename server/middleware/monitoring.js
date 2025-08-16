import { logger } from '../utils/logger.js';

// Middleware pour tracker les performances
export const performanceMonitor = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, url, ip } = req;
    const { statusCode } = res;
    
    logger.info('Request completed', {
      method,
      url,
      statusCode,
      duration,
      ip,
      userAgent: req.get('User-Agent')
    });

    // Alerter si la requête est lente
    if (duration > 5000) {
      logger.warn('Slow request detected', {
        method,
        url,
        duration
      });
    }
  });

  next();
};

// Middleware pour tracker les erreurs
export const errorTracker = (err, req, res, next) => {
  logger.error('Application error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  next(err);
};