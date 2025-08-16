import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

// Middleware pour valider les requêtes en utilisant express-validator
export const validateRequest = (schemas) => {
  return async (req, res, next) => {
    await Promise.all(schemas.map((schema) => schema.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({
      success: false,
      errors: extractedErrors,
    });
  };
};

// Middleware pour valider les ObjectId de MongoDB
export const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'ID invalide' });
    }
    next();
  };
};

// Middleware pour gérer les erreurs de rate limiting
export const rateLimitHandler = (req, res) => {
  res.status(429).json({
    success: false,
    error: 'Trop de requêtes, veuillez réessayer plus tard',
  });
};
