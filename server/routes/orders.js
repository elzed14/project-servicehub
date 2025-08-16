import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrderStats
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/stats/:userId', getOrderStats);

// Protected routes
router.post('/', protect, createOrder);
router.get('/user/:userId', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, updateOrderStatus);
router.delete('/:id', protect, deleteOrder);

export default router;
