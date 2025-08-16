import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';

// @desc    Obtenir les conversations d'un utilisateur
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const includeArchived = req.query.includeArchived === 'true';

    const conversations = await Conversation.getUserConversations(
      req.user.id,
      {
        includeArchived,
        limit,
        skip: (page - 1) * limit
      }
    );

    // Ajouter les données spécifiques à l'utilisateur pour chaque conversation
    const conversationsWithUserData = conversations.map(conv => {
      const convObj = conv.toObject();
      const userData = conv.getParticipantData(req.user.id);
      
      return {
        ...convObj,
        unreadCount: userData?.unreadCount || 0,
        isArchived: userData?.isArchived || false,
        isMuted: userData?.isMuted || false,
        lastReadAt: userData?.lastReadAt
      };
    });

    res.status(200).json({
      success: true,
      count: conversations.length,
      conversations: conversationsWithUserData
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Obtenir les messages d'une conversation
// @route   GET /api/messages/:conversationId
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const includeDeleted = req.query.includeDeleted === 'true';

    // Vérifier que l'utilisateur fait partie de la conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation non trouvée'
      });
    }

    const isParticipant = conversation.participants.some(
      p => p._id.toString() === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        error: 'Accès non autorisé à cette conversation'
      });
    }

    const messages = await Message.getConversationMessages(
      conversationId,
      {
        limit,
        skip: (page - 1) * limit,
        includeDeleted
      }
    );

    const total = await Message.countDocuments({
      conversationId,
      ...(includeDeleted ? {} : { isDeleted: false })
    });

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      messages: messages.reverse() // Inverser pour avoir les plus anciens en premier
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Envoyer un message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, receiverId, content, type = 'text', attachments } = req.body;

    // Validation des champs requis
    if (!conversationId || !receiverId || !content) {
      return res.status(400).json({
        success: false,
        error: 'Conversation, destinataire et contenu requis'
      });
    }

    // Vérifier que la conversation existe et que l'utilisateur en fait partie
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation non trouvée'
      });
    }

    const isParticipant = conversation.participants.some(
      p => p._id.toString() === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        error: 'Accès non autorisé à cette conversation'
      });
    }

    // Vérifier que le destinataire fait partie de la conversation
    const isReceiverParticipant = conversation.participants.some(
      p => p._id.toString() === receiverId
    );

    if (!isReceiverParticipant) {
      return res.status(400).json({
        success: false,
        error: 'Le destinataire ne fait pas partie de cette conversation'
      });
    }

    // Créer le message
    const message = await Message.create({
      conversationId,
      senderId: req.user.id,
      receiverId,
      content: content.trim(),
      type,
      attachments: attachments || []
    });

    // Populer les données du message
    await message.populate([
      { path: 'senderId', select: 'name avatar' },
      { path: 'receiverId', select: 'name avatar' }
    ]);

    res.status(201).json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de l\'envoi du message'
    });
  }
};

// @desc    Créer une nouvelle conversation
// @route   POST /api/messages/conversations
// @access  Private
export const createConversation = async (req, res) => {
  try {
    const { participantId, serviceId } = req.body;

    if (!participantId) {
      return res.status(400).json({
        success: false,
        error: 'ID du participant requis'
      });
    }

    // Vérifier que le participant existe
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    // Empêcher de créer une conversation avec soi-même
    if (participantId === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Impossible de créer une conversation avec soi-même'
      });
    }

    const participants = [req.user.id, participantId];

    // Créer ou récupérer la conversation existante
    const conversation = await Conversation.createConversation(participants, serviceId);

    res.status(201).json({
      success: true,
      conversation
    });
  } catch (error) {
    console.error('Erreur lors de la création de la conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la création de la conversation'
    });
  }
};

// @desc    Marquer les messages comme lus
// @route   PUT /api/messages/:conversationId/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Vérifier que la conversation existe et que l'utilisateur en fait partie
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation non trouvée'
      });
    }

    const isParticipant = conversation.participants.some(
      p => p._id.toString() === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        error: 'Accès non autorisé à cette conversation'
      });
    }

    // Marquer tous les messages comme lus
    await Message.markConversationAsRead(conversationId, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Messages marqués comme lus'
    });
  } catch (error) {
    console.error('Erreur lors du marquage des messages comme lus:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Éditer un message
// @route   PUT /api/messages/:messageId
// @access  Private
export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Contenu du message requis'
      });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message non trouvé'
      });
    }

    // Vérifier que l'utilisateur est l'expéditeur du message
    if (message.senderId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Non autorisé à éditer ce message'
      });
    }

    // Éditer le message
    await message.editContent(content.trim(), req.user.id);

    res.status(200).json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Erreur lors de l\'édition du message:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur serveur'
    });
  }
};

// @desc    Supprimer un message
// @route   DELETE /api/messages/:messageId
// @access  Private
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message non trouvé'
      });
    }

    // Vérifier que l'utilisateur est l'expéditeur du message
    if (message.senderId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Non autorisé à supprimer ce message'
      });
    }

    // Supprimer le message
    await message.deleteMessage(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Message supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur serveur'
    });
  }
};

// @desc    Archiver/désarchiver une conversation
// @route   PUT /api/messages/:conversationId/archive
// @access  Private
export const toggleArchiveConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation non trouvée'
      });
    }

    const isParticipant = conversation.participants.some(
      p => p._id.toString() === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        error: 'Accès non autorisé à cette conversation'
      });
    }

    await conversation.toggleArchive(req.user.id);

    const userData = conversation.getParticipantData(req.user.id);

    res.status(200).json({
      success: true,
      message: userData.isArchived ? 'Conversation archivée' : 'Conversation désarchivée',
      isArchived: userData.isArchived
    });
  } catch (error) {
    console.error('Erreur lors de l\'archivage de la conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Activer/désactiver les notifications pour une conversation
// @route   PUT /api/messages/:conversationId/mute
// @access  Private
export const toggleMuteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation non trouvée'
      });
    }

    const isParticipant = conversation.participants.some(
      p => p._id.toString() === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        error: 'Accès non autorisé à cette conversation'
      });
    }

    await conversation.toggleMute(req.user.id);

    const userData = conversation.getParticipantData(req.user.id);

    res.status(200).json({
      success: true,
      message: userData.isMuted ? 'Notifications désactivées' : 'Notifications activées',
      isMuted: userData.isMuted
    });
  } catch (error) {
    console.error('Erreur lors de la modification des notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Obtenir les statistiques des messages (Admin)
// @route   GET /api/messages/stats
// @access  Private/Admin
export const getMessageStats = async (req, res) => {
  try {
    const stats = await Message.aggregate([
      {
        $group: {
          _id: null,
          totalMessages: { $sum: 1 },
          textMessages: {
            $sum: { $cond: [{ $eq: ['$type', 'text'] }, 1, 0] }
          },
          imageMessages: {
            $sum: { $cond: [{ $eq: ['$type', 'image'] }, 1, 0] }
          },
          fileMessages: {
            $sum: { $cond: [{ $eq: ['$type', 'file'] }, 1, 0] }
          },
          readMessages: {
            $sum: { $cond: [{ $eq: ['$isRead', true] }, 1, 0] }
          },
          unreadMessages: {
            $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] }
          },
          deletedMessages: {
            $sum: { $cond: [{ $eq: ['$isDeleted', true] }, 1, 0] }
          }
        }
      }
    ]);

    const conversationStats = await Conversation.aggregate([
      {
        $group: {
          _id: null,
          totalConversations: { $sum: 1 },
          activeConversations: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      messageStats: stats[0] || {
        totalMessages: 0,
        textMessages: 0,
        imageMessages: 0,
        fileMessages: 0,
        readMessages: 0,
        unreadMessages: 0,
        deletedMessages: 0
      },
      conversationStats: conversationStats[0] || {
        totalConversations: 0,
        activeConversations: 0
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};