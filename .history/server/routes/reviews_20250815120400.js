import express from 'express';
import {
  createReview,
  getServiceReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  markHelpful,
  reportReview,
  getReviewStats
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/auth.js';

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
router.post('/:id/report', protect, reportReview);

// Admin routes
router.delete('/admin/:id', protect, admin, deleteReview);

export default router;
