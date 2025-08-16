import express from 'express';
import {
  createReview,
  getServiceReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  markHelpful,
  getReviewStats
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/service/:serviceId', getServiceReviews);
router.get('/user/:userId', getUserReviews);
router.get('/stats/:serviceId', getReviewStats);

// Protected routes
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/helpful', protect, markHelpful);

// Admin routes
router.delete('/admin/:id', protect, deleteReview);

export default router;
