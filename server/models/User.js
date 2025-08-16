import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Format d\'email invalide'
    ]
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    select: false // Ne pas inclure le mot de passe dans les requêtes par défaut
  },
  avatar: {
    type: String,
    default: function() {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=3b82f6&color=fff`;
    }
  },
  location: {
    type: String,
    default: 'Non spécifié',
    maxlength: [100, 'La localisation ne peut pas dépasser 100 caractères']
  },
  bio: {
    type: String,
    maxlength: [500, 'La bio ne peut pas dépasser 500 caractères'],
    default: ''
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'La note ne peut pas être négative'],
    max: [5, 'La note ne peut pas dépasser 5']
  },
  reviews: {
    type: Number,
    default: 0,
    min: [0, 'Le nombre d\'avis ne peut pas être négatif']
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour améliorer les performances
userSchema.index({ email: 1 });
userSchema.index({ location: 1 });
userSchema.index({ rating: -1 });

// Virtual pour les services de l'utilisateur
userSchema.virtual('services', {
  ref: 'Service',
  localField: '_id',
  foreignField: 'provider'
});

// Middleware pour hasher le mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  // Ne hasher que si le mot de passe a été modifié
  if (!this.isModified('password')) return next();

  try {
    // Hasher le mot de passe avec un salt de 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour obtenir les données publiques de l'utilisateur
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  delete userObject.emailVerificationToken;
  delete userObject.emailVerificationExpire;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpire;
  return userObject;
};

// Générer un token de réinitialisation de mot de passe
userSchema.methods.generateResetPasswordToken = function() {
  // Générer un token aléatoire
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hacher le token et le stocker dans la base de données
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Définir la date d'expiration (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Générer un token de vérification d'email
userSchema.methods.generateEmailVerificationToken = function() {
  // Générer un token aléatoire
  const verificationToken = crypto.randomBytes(20).toString('hex');

  // Stocker le token et sa date d'expiration (24 heures)
  this.emailVerificationToken = verificationToken;
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;

  return verificationToken;
};

// Middleware pour mettre à jour lastActive
userSchema.pre(/^find/, function(next) {
  // this pointe vers la requête courante
  this.populate({
    path: 'services',
    select: 'title category price type createdAt'
  });
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
