import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000
  },
  images: [{
    type: String
  }],
  helpful: {
    type: Number,
    default: 0
  },
  reported: {
    type: Boolean,
    default: false
  },
  moderated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
reviewSchema.index({ service: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: 1 });

// Empêcher les doublons
reviewSchema.index({ service: 1, user: 1 }, { unique: true });

// Calculer la note moyenne d'un service
reviewSchema.statics.calculateAverageRating = async function(serviceId) {
  const stats = await this.aggregate([
    { $match: { service: serviceId } },
    {
      $group: {
        _id: '$service',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Service').findByIdAndUpdate(serviceId, {
      rating: Math.round(stats[0].averageRating * 10) / 10,
      reviews: stats[0].totalReviews
    });
  }
};

reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.service);
});

reviewSchema.post('remove', function() {
  this.constructor.calculateAverageRating(this.service);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
