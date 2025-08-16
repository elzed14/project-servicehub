import express from 'express';
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getUserServices,
  getServicesByCategory,
  getPopularServices,
  searchServices
} from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateObjectId, validateRequest } from '../middleware/validation.js';
import { createServiceSchema, updateServiceSchema } from '../utils/validationSchemas.js';

const router = express.Router();

// Routes publiques
router.get('/', getServices);
router.get('/search', searchServices);
router.get('/popular', getPopularServices);
router.get('/category/:categoryId', validateObjectId('categoryId'), getServicesByCategory);
router.get('/:id', validateObjectId('id'), getService);

// Routes protégées
router.use(protect);

router.post('/', validateRequest(createServiceSchema), createService);
router.put('/:id', validateObjectId('id'), validateRequest(updateServiceSchema), updateService);
router.delete('/:id', validateObjectId('id'), deleteService);
router.get('/user/:userId', getUserServices);

export default router;
