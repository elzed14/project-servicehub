import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';

// Générer un token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Envoyer une réponse avec token
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: user.getPublicProfile()
    });
};

// @desc    Inscription d'un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  console.log('Register request received:', req.body);
  
  try {
    const { name, email, password, location } = req.body;

    // Validation des champs requis
    if (!name || !email || !password) {
      console.log('Validation failed: missing fields');
      return res.status(400).json({
        success: false,
        error: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    console.log('Creating mock user for development');
    // Mode de développement - toujours utiliser le mode mock
    const mockUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      location: location?.trim() || 'Non spécifié',
      avatar: 'https://via.placeholder.com/150',
      rating: 5,
      reviews: 0
    };
    
    const token = generateToken(mockUser.id);
    console.log('Mock user created successfully:', mockUser);
    
    return res.status(201).json({
      success: true,
      token,
      user: mockUser
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de l\'inscription'
    });
  }
};

// @desc    Connexion utilisateur
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  console.log('Login request received:', req.body);
  
  try {
    const { email, password } = req.body;

    // Validation des champs requis
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email et mot de passe requis'
      });
    }

    console.log('Creating mock login for development');
    const mockUser = {
      id: 'mock-user-id',
      name: 'Utilisateur Test',
      email: email.toLowerCase(),
      location: 'Paris, France',
      avatar: 'https://via.placeholder.com/150',
      rating: 4.8,
      reviews: 12
    };
    
    const token = generateToken(mockUser.id);
    console.log('Mock login successful:', mockUser);
    
    return res.status(200).json({
      success: true,
      token,
      user: mockUser
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la connexion'
    });
  }
};

// @desc    Déconnexion utilisateur
// @route   POST /api/auth/logout
// @access  Private
export const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Déconnexion réussie'
  });
};

// @desc    Obtenir l'utilisateur actuel
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Mettre à jour le profil utilisateur
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, location, bio, avatar } = req.body;
    
    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name.trim();
    if (location) fieldsToUpdate.location = location.trim();
    if (bio !== undefined) fieldsToUpdate.bio = bio.trim();
    if (avatar) fieldsToUpdate.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la mise à jour'
    });
  }
};

// @desc    Changer le mot de passe
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Mot de passe actuel et nouveau mot de passe requis'
      });
    }

    // Trouver l'utilisateur avec le mot de passe
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Mot de passe actuel incorrect'
      });
    }

    // Valider le nouveau mot de passe
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
      });
    }

    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Mot de passe mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors du changement de mot de passe'
    });
  }
};

// @desc    Vérifier le token
// @route   GET /api/auth/verify
// @access  Private
export const verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Token invalide'
      });
    }

    res.status(200).json({
      success: true,
      valid: true,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Vérifier le statut d'authentification
// @route   GET /api/auth/status
// @access  Private
export const checkAuthStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Non authentifié'
      });
    }

    res.status(200).json({
      success: true,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du statut:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Rafraîchir le token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token requis'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Token invalide'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    res.status(401).json({
      success: false,
      error: 'Token invalide'
    });
  }
};

// @desc    Mot de passe oublié
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Aucun utilisateur trouvé avec cet email'
      });
    }

    // Générer un token de réinitialisation
    const resetToken = user.generateResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // TODO: Envoyer l'email avec le token
    console.log(`Token de réinitialisation: ${resetToken}`);

    res.status(200).json({
      success: true,
      message: 'Email de réinitialisation envoyé'
    });
  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Réinitialiser le mot de passe
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { resetToken } = req.params;

    // Hacher le token pour le comparer
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Token invalide ou expiré'
      });
    }

    // Mettre à jour le mot de passe
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Vérifier l'email
// @route   GET /api/auth/verify-email/:verifyToken
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const { verifyToken } = req.params;

    const user = await User.findOne({
      emailVerificationToken: verifyToken,
      emailVerificationExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Token invalide ou expiré'
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email vérifié avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'email:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Renvoyer l'email de vérification
// @route   POST /api/auth/resend-verification
// @access  Private
export const resendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        error: 'Email déjà vérifié'
      });
    }

    // Générer un nouveau token
    const verifyToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // TODO: Envoyer l'email de vérification
    console.log(`Nouveau token de vérification: ${verifyToken}`);

    res.status(200).json({
      success: true,
      message: 'Email de vérification renvoyé'
    });
  } catch (error) {
    console.error('Erreur lors du renvoi de l\'email de vérification:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Connexion Google
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // TODO: Implémenter la vérification du token Google
    // Pour l'instant, retourner une erreur
    res.status(501).json({
      success: false,
      error: 'Connexion Google non implémentée'
    });
  } catch (error) {
    console.error('Erreur lors de la connexion Google:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Connexion Facebook
// @route   POST /api/auth/facebook
// @access  Public
export const facebookLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // TODO: Implémenter la vérification du token Facebook
    // Pour l'instant, retourner une erreur
    res.status(501).json({
      success: false,
      error: 'Connexion Facebook non implémentée'
    });
  } catch (error) {
    console.error('Erreur lors de la connexion Facebook:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Désactiver le compte
// @route   DELETE /api/auth/deactivate
// @access  Private
export const deactivateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    // Désactiver le compte
    user.isActive = false;
    await user.save();

    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'Compte désactivé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la désactivation du compte:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};
