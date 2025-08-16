import express from 'express';
import {
  createOrder,
  getUserOrders,
  updateOrderStatus,
  getOrderStats
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/stats/:userId', getOrderStats);

// Protected routes
router.post('/', protect, createOrder);
router.get('/user/:userId', protect, getUserOrders);
router.put('/:id/status', protect, updateOrderStatus);

export default router;
