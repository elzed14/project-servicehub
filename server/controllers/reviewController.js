import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import Service from '../models/Service.js';

// @desc    Créer un nouvel avis
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { serviceId, rating, comment, images } = req.body;

  const service = await Service.findById(serviceId);
  if (!service) {
    res.status(404);
    throw new Error('Service non trouvé');
  }

  // Vérifier si l'utilisateur a déjà laissé un avis
  const existingReview = await Review.findOne({
    service: serviceId,
    user: req.user._id
  });

  if (existingReview) {
    res.status(400);
    throw new Error('Vous avez déjà laissé un avis pour ce service');
  }

  const review = new Review({
    service: serviceId,
    user: req.user._id,
    rating,
    comment,
    images: images || []
  });

  const createdReview = await review.save();
  await createdReview.populate('user', 'name avatar');

  res.status(201).json(createdReview);
});

// @desc    Obtenir les avis d'un service
// @route   GET /api/reviews/service/:serviceId
// @access  Public
const getServiceReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort || '-createdAt';

  const reviews = await Review.find({ service: req.params.serviceId })
    .populate('user', 'name avatar')
    .sort(sort)
    .limit(limit)
    .skip((page - 1) * limit);

  const total = await Review.countDocuments({ service: req.params.serviceId });

  res.json({
    reviews,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
});

// @desc    Obtenir les avis d'un utilisateur
// @route   GET /api/reviews/user/:userId
// @access  Public
const getUserReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.params.userId })
    .populate('service', 'title images')
    .sort('-createdAt');

  res.json(reviews);
});

// @desc    Mettre à jour un avis
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment, images } = req.body;

  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Avis non trouvé');
  }

  if (review.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Non autorisé');
  }

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;
  review.images = images || review.images;

  const updatedReview = await review.save();
  await updatedReview.populate('user', 'name avatar');

  res.json(updatedReview);
});

// @desc    Supprimer un avis
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Avis non trouvé');
  }

  if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Non autorisé');
  }

  await review.remove();
  res.json({ message: 'Avis supprimé' });
});

// @desc    Marquer un avis comme utile
// @route   POST /api/reviews/:id/helpful
// @access  Private
const markHelpful = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Avis non trouvé');
  }

  review.helpful += 1;
  await review.save();

  res.json({ helpful: review.helpful });
});

// @desc    Signaler un avis
// @route   POST /api/reviews/:id/report
// @access  Private
const reportReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Avis non trouvé');
  }

  review.reported = true;
  await review.save();

  res.json({ message: 'Avis signalé' });
});

// @desc    Obtenir les statistiques des avis
// @route   GET /api/reviews/stats/:serviceId
// @access  Public
const getReviewStats = asyncHandler(async (req, res) => {
  const stats = await Review.aggregate([
    { $match: { service: mongoose.Types.ObjectId(req.params.serviceId) } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: -1 }
    }
  ]);

  const total = await Review.countDocuments({ service: req.params.serviceId });
  const average = await Review.aggregate([
    { $match: { service: mongoose.Types.ObjectId(req.params.serviceId) } },
    { $group: { _id: null, avg: { $avg: '$rating' } } }
  ]);

  res.json({
    stats,
    total,
    average: average[0]?.avg || 0
  });
});

export {
  createReview,
  getServiceReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  markHelpful,
  reportReview,
  getReviewStats
};
