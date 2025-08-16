import express from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServicesByCategory,
  searchServices,
  getServicesByUser
} from '../controllers/serviceController.js';
import { protect, admin } from '../middleware/auth.js';
import { validateService } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getServices);
router.get('/search', searchServices);
router.get('/category/:categoryId', getServicesByCategory);
router.get('/user/:userId', getServicesByUser);
router.get('/:id', getServiceById);

// Protected routes
router.post('/', protect, validateService, createService);
router.put('/:id', protect, validateService, updateService);
router.delete('/:id', protect, deleteService);

// Admin routes
router.get('/admin/all', protect, admin, getServices);

export default router;
