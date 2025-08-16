import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  googleLogin,
  facebookLogin,
  deactivateAccount,
  checkAuthStatus,
  refreshToken
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updatePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../utils/validationSchemas.js';

const router = express.Router();

// Routes d'authentification
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.get('/status', protect, checkAuthStatus);
router.post('/refresh-token', refreshToken);

// Routes de profil
router.put('/profile', protect, validateRequest(updateProfileSchema), updateProfile);
router.put('/password', protect, validateRequest(updatePasswordSchema), changePassword);

// Routes de mot de passe oublié
router.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPassword);
router.put('/reset-password/:resetToken', validateRequest(resetPasswordSchema), resetPassword);

// Routes de vérification d'email
router.get('/verify-email/:verifyToken', verifyEmail);
router.post('/resend-verification', protect, resendVerificationEmail);

// Routes d'authentification sociale
router.post('/google', googleLogin);
router.post('/facebook', facebookLogin);

// Route de désactivation de compte
router.delete('/deactivate', protect, deactivateAccount);

export default router;
