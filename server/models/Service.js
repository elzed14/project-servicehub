import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true,
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'La catégorie est requise']
  },
  price: {
    type: String,
    required: [true, 'Le prix est requis'],
    trim: true,
    maxlength: [50, 'Le prix ne peut pas dépasser 50 caractères']
  },
  location: {
    type: String,
    required: [true, 'La localisation est requise'],
    trim: true,
    maxlength: [100, 'La localisation ne peut pas dépasser 100 caractères']
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le fournisseur est requis']
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
      },
      message: 'URL d\'image invalide'
    }
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Un tag ne peut pas dépasser 30 caractères']
  }],
  type: {
    type: String,
    enum: {
      values: ['offer', 'request'],
      message: 'Le type doit être "offer" ou "request"'
    },
    required: [true, 'Le type est requis']
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'pending', 'rejected', 'suspended', 'completed'],
      message: 'Statut invalide'
    },
    default: 'pending'
  },
  views: {
    type: Number,
    default: 0,
    min: [0, 'Le nombre de vues ne peut pas être négatif']
  },
  contacts: {
    type: Number,
    default: 0,
    min: [0, 'Le nombre de contacts ne peut pas être négatif']
  },
  reportCount: {
    type: Number,
    default: 0,
    min: [0, 'Le nombre de signalements ne peut pas être négatif']
  },
  featured: {
    type: Boolean,
    default: false
  },
  featuredUntil: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour améliorer les performances
serviceSchema.index({ provider: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ type: 1 });
serviceSchema.index({ status: 1 });
serviceSchema.index({ location: 1 });
serviceSchema.index({ createdAt: -1 });
serviceSchema.index({ featured: -1, createdAt: -1 });

// Index de recherche textuelle
serviceSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text'
});

// Virtual pour les conversations liées à ce service
serviceSchema.virtual('conversations', {
  ref: 'Conversation',
  localField: '_id',
  foreignField: 'serviceId'
});

// Middleware pour populer automatiquement le provider et la category
serviceSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'provider',
    select: 'name avatar rating reviews location'
  }).populate({
    path: 'category',
    select: 'name icon color'
  });
  next();
});

// Méthode pour incrémenter les vues
serviceSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Méthode pour incrémenter les contacts
serviceSchema.methods.incrementContacts = function() {
  this.contacts += 1;
  return this.save();
};

// Méthode statique pour rechercher des services
serviceSchema.statics.searchServices = function(query, filters = {}) {
  const searchQuery = { isActive: true, status: 'active' };

  // Recherche textuelle
  if (query) {
    searchQuery.$text = { $search: query };
  }

  // Filtres
  if (filters.category) {
    searchQuery.category = filters.category;
  }

  if (filters.type) {
    searchQuery.type = filters.type;
  }

  if (filters.location) {
    searchQuery.location = new RegExp(filters.location, 'i');
  }

  if (filters.priceRange) {
    // Logique pour filtrer par gamme de prix (à implémenter selon les besoins)
  }

  return this.find(searchQuery)
    .sort(query ? { score: { $meta: 'textScore' } } : { featured: -1, createdAt: -1 });
};

// Méthode statique pour obtenir les services populaires
serviceSchema.statics.getPopularServices = function(limit = 10) {
  return this.find({ isActive: true, status: 'active' })
    .sort({ views: -1, contacts: -1 })
    .limit(limit);
};

// Méthode statique pour obtenir les services par catégorie
serviceSchema.statics.getServicesByCategory = function(categoryId, limit = 20) {
  return this.find({ 
    category: categoryId, 
    isActive: true, 
    status: 'active' 
  })
  .sort({ featured: -1, createdAt: -1 })
  .limit(limit);
};

const Service = mongoose.model('Service', serviceSchema);

export default Service;