import { body } from 'express-validator';

export const registerSchema = [
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('location').optional().isString().withMessage('La localisation doit être une chaîne de caractères'),
];

export const loginSchema = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Le mot de passe est requis'),
];

export const updateProfileSchema = [
  body('name').optional().notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('location').optional().isString().withMessage('La localisation doit être une chaîne de caractères'),
  body('bio').optional().isString().withMessage('La bio doit être une chaîne de caractères'),
  body('avatar').optional().isURL().withMessage('L\'avatar doit être une URL valide'),
];

export const updatePasswordSchema = [
  body('currentPassword').notEmpty().withMessage('Le mot de passe actuel est requis'),
  body('newPassword').isLength({ min: 6 }).withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères'),
];

export const forgotPasswordSchema = [
  body('email').isEmail().withMessage('Email invalide'),
];

export const resetPasswordSchema = [
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
];

export const createServiceSchema = [
  body('title').notEmpty().withMessage('Le titre est requis'),
  body('description').notEmpty().withMessage('La description est requise'),
  body('price').isNumeric().withMessage('Le prix doit être un nombre'),
  body('category').notEmpty().withMessage('La catégorie est requise'),
];

export const updateServiceSchema = [
  body('title').optional().notEmpty().withMessage('Le titre ne peut pas être vide'),
  body('description').optional().notEmpty().withMessage('La description ne peut pas être vide'),
  body('price').optional().isNumeric().withMessage('Le prix doit être un nombre'),
  body('category').optional().notEmpty().withMessage('La catégorie ne peut pas être vide'),
];

export const reviewSchema = [
  body('rating').isFloat({ min: 1, max: 5 }).withMessage('La note doit être entre 1 et 5'),
  body('comment').notEmpty().withMessage('Le commentaire est requis'),
];

export const sendMessageSchema = [
  body('content').notEmpty().withMessage('Le contenu du message ne peut pas être vide'),
];

export const updateUserSchema = [
    body('username').optional().notEmpty().withMessage('Le nom d\'utilisateur ne peut pas être vide'),
    body('email').optional().isEmail().withMessage('Email invalide'),
    body('isActive').optional().isBoolean().withMessage('isActive doit être un booléen'),
];
