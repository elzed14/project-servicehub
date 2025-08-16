import express from 'express';
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.post('/', protect, createNotification);
router.get('/', protect, getUserNotifications);
router.put('/:id/read', protect, markAsRead);
router.put('/read-all', protect, markAllAsRead);
router.get('/unread-count', protect, getUnreadCount);

export default router;
