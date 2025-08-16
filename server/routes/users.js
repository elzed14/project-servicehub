import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats,
  searchUsers,
  getTopRatedUsers,
  updateLastActivity
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validation.js';
import { updateUserSchema } from '../utils/validationSchemas.js';

const router = express.Router();

// Routes publiques
router.get('/:id', validateObjectId('id'), getUser);
router.get('/search', searchUsers);
router.get('/top-rated', getTopRatedUsers);

// Routes protégées
router.use(protect);

// Routes administrateur
router.route('/')
  .get(authorize('admin'), getUsers);

router.route('/:id')
  .get(authorize('admin'), validateObjectId('id'), getUser)
  .put(authorize('admin'), validateObjectId('id'), updateUserSchema, updateUser)
  .delete(authorize('admin'), validateObjectId('id'), deleteUser);

router.get('/stats', authorize('admin'), getUserStats);

// Routes utilisateur
router.put('/activity', updateLastActivity);

export default router;
