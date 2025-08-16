import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de la catégorie est requis'],
    unique: true,
    trim: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  icon: {
    type: String,
    required: [true, 'L\'icône est requise'],
    trim: true
  },
  color: {
    type: String,
    required: [true, 'La couleur est requise'],
    match: [/^bg-\w+-\d{3}$/, 'Format de couleur invalide (ex: bg-blue-500)']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'La description ne peut pas dépasser 200 caractères']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour améliorer les performances
categorySchema.index({ name: 1 });
categorySchema.index({ isActive: 1, order: 1 });

// Virtual pour compter les services dans cette catégorie
categorySchema.virtual('serviceCount', {
  ref: 'Service',
  localField: '_id',
  foreignField: 'category',
  count: true,
  match: { isActive: true, status: 'active' }
});

// Méthode statique pour obtenir les catégories actives
categorySchema.statics.getActiveCategories = function() {
  return this.find({ isActive: true })
    .sort({ order: 1, name: 1 })
    .populate('serviceCount');
};

// Méthode statique pour obtenir les catégories avec le nombre de services
categorySchema.statics.getCategoriesWithCount = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $lookup: {
        from: 'services',
        let: { categoryId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$category', '$$categoryId'] },
                  { $eq: ['$isActive', true] },
                  { $eq: ['$status', 'active'] }
                ]
              }
            }
          },
          { $count: 'count' }
        ],
        as: 'serviceCountData'
      }
    },
    {
      $addFields: {
        serviceCount: {
          $ifNull: [{ $arrayElemAt: ['$serviceCountData.count', 0] }, 0]
        }
      }
    },
    {
      $project: {
        serviceCountData: 0
      }
    },
    { $sort: { order: 1, name: 1 } }
  ]);
};

const Category = mongoose.model('Category', categorySchema);

export default Category;