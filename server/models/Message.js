import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: [true, 'L\'ID de conversation est requis']
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'ID de l\'expéditeur est requis']
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'ID du destinataire est requis']
  },
  content: {
    type: String,
    required: [true, 'Le contenu du message est requis'],
    trim: true,
    maxlength: [1000, 'Le message ne peut pas dépasser 1000 caractères']
  },
  type: {
    type: String,
    enum: {
      values: ['text', 'image', 'file', 'system'],
      message: 'Type de message invalide'
    },
    default: 'text'
  },
  attachments: [{
    filename: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: 'URL d\'attachement invalide'
      }
    },
    size: {
      type: Number,
      min: 0
    },
    mimeType: {
      type: String
    }
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  originalContent: {
    type: String // Pour garder une trace du contenu original en cas d'édition
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Métadonnées pour les messages système
  systemData: {
    action: {
      type: String,
      enum: ['user_joined', 'user_left', 'service_shared', 'conversation_created']
    },
    data: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour améliorer les performances
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ receiverId: 1 });
messageSchema.index({ isRead: 1 });
messageSchema.index({ createdAt: -1 });

// Middleware pour populer automatiquement l'expéditeur et le destinataire
messageSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'senderId',
    select: 'name avatar'
  }).populate({
    path: 'receiverId',
    select: 'name avatar'
  });
  next();
});

// Middleware pour mettre à jour la conversation après création d'un message
messageSchema.post('save', async function(doc) {
  try {
    // Mettre à jour le lastMessage de la conversation
    await mongoose.model('Conversation').findByIdAndUpdate(
      doc.conversationId,
      { 
        lastMessage: doc._id,
        updatedAt: new Date()
      }
    );

    // Incrémenter le compteur de messages non lus pour le destinataire
    const conversation = await mongoose.model('Conversation').findById(doc.conversationId);
    if (conversation) {
      await conversation.updateUnreadCount(doc.receiverId, true);
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la conversation:', error);
  }
});

// Méthode pour marquer le message comme lu
messageSchema.methods.markAsRead = function() {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Méthode pour éditer le message
messageSchema.methods.editContent = function(newContent, userId) {
  if (this.senderId.toString() !== userId.toString()) {
    throw new Error('Seul l\'expéditeur peut éditer le message');
  }

  if (!this.originalContent) {
    this.originalContent = this.content;
  }
  
  this.content = newContent;
  this.isEdited = true;
  this.editedAt = new Date();
  
  return this.save();
};

// Méthode pour supprimer le message
messageSchema.methods.deleteMessage = function(userId) {
  if (this.senderId.toString() !== userId.toString()) {
    throw new Error('Seul l\'expéditeur peut supprimer le message');
  }

  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = userId;
  this.content = 'Ce message a été supprimé';
  
  return this.save();
};

// Méthode statique pour obtenir les messages d'une conversation
messageSchema.statics.getConversationMessages = function(conversationId, options = {}) {
  const { limit = 50, skip = 0, includeDeleted = false } = options;
  
  const query = { conversationId };
  
  if (!includeDeleted) {
    query.isDeleted = false;
  }

  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Méthode statique pour marquer tous les messages d'une conversation comme lus
messageSchema.statics.markConversationAsRead = async function(conversationId, userId) {
  const result = await this.updateMany(
    {
      conversationId,
      receiverId: userId,
      isRead: false
    },
    {
      isRead: true,
      readAt: new Date()
    }
  );

  // Mettre à jour le compteur dans la conversation
  const conversation = await mongoose.model('Conversation').findById(conversationId);
  if (conversation) {
    await conversation.markAsRead(userId);
  }

  return result;
};

// Méthode statique pour créer un message système
messageSchema.statics.createSystemMessage = function(conversationId, senderId, receiverId, action, data = {}) {
  const systemMessages = {
    user_joined: 'Un utilisateur a rejoint la conversation',
    user_left: 'Un utilisateur a quitté la conversation',
    service_shared: 'Un service a été partagé',
    conversation_created: 'Conversation créée'
  };

  return this.create({
    conversationId,
    senderId,
    receiverId,
    content: systemMessages[action] || 'Action système',
    type: 'system',
    systemData: { action, data },
    isRead: false
  });
};

// Méthode statique pour obtenir les statistiques des messages
messageSchema.statics.getMessageStats = function(userId) {
  return this.aggregate([
    {
      $match: {
        $or: [{ senderId: userId }, { receiverId: userId }],
        isDeleted: false
      }
    },
    {
      $group: {
        _id: null,
        totalMessages: { $sum: 1 },
        sentMessages: {
          $sum: { $cond: [{ $eq: ['$senderId', userId] }, 1, 0] }
        },
        receivedMessages: {
          $sum: { $cond: [{ $eq: ['$receiverId', userId] }, 1, 0] }
        },
        unreadMessages: {
          $sum: { 
            $cond: [
              { 
                $and: [
                  { $eq: ['$receiverId', userId] },
                  { $eq: ['$isRead', false] }
                ]
              }, 
              1, 
              0
            ]
          }
        }
      }
    }
  ]);
};

const Message = mongoose.model('Message', messageSchema);

export default Message;