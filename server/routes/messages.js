import express from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
  markAsRead,
  editMessage,
  deleteMessage,
  toggleArchiveConversation,
  toggleMuteConversation,
  getMessageStats
} from '../controllers/messageController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateObjectId, validateRequest } from '../middleware/validation.js';
import { sendMessageSchema } from '../utils/validationSchemas.js';

const router = express.Router();

router.use(protect);

// Routes pour les conversations
router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.put('/conversations/:id/archive', validateObjectId('id'), toggleArchiveConversation);
router.put('/conversations/:id/mute', validateObjectId('id'), toggleMuteConversation);

// Routes pour les messages
router.get('/:conversationId', validateObjectId('conversationId'), getMessages);
router.post('/', validateRequest(sendMessageSchema), sendMessage);
router.put('/:messageId', validateObjectId('messageId'), editMessage);
router.delete('/:messageId', validateObjectId('messageId'), deleteMessage);
router.put('/:conversationId/read', validateObjectId('conversationId'), markAsRead);

// Routes admin
router.get('/stats', authorize('admin'), getMessageStats);

export default router;
