import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: false // Optionnel car certaines conversations peuvent être générales
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Métadonnées pour chaque participant
  participantData: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    unreadCount: {
      type: Number,
      default: 0,
      min: 0
    },
    lastReadAt: {
      type: Date,
      default: Date.now
    },
    isArchived: {
      type: Boolean,
      default: false
    },
    isMuted: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour améliorer les performances
conversationSchema.index({ participants: 1 });
conversationSchema.index({ serviceId: 1 });
conversationSchema.index({ updatedAt: -1 });
conversationSchema.index({ 'participantData.userId': 1 });

// Virtual pour les messages de la conversation
conversationSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'conversationId',
  options: { sort: { createdAt: -1 } }
});

// Middleware pour populer automatiquement les participants et le service
conversationSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'participants',
    select: 'name avatar rating reviews location lastActive'
  }).populate({
    path: 'serviceId',
    select: 'title category price type provider'
  }).populate({
    path: 'lastMessage',
    select: 'content timestamp senderId type isRead'
  });
  next();
});

// Méthode pour obtenir les données d'un participant spécifique
conversationSchema.methods.getParticipantData = function(userId) {
  return this.participantData.find(p => p.userId.toString() === userId.toString());
};

// Méthode pour mettre à jour le nombre de messages non lus
conversationSchema.methods.updateUnreadCount = function(userId, increment = true) {
  const participantData = this.getParticipantData(userId);
  if (participantData) {
    if (increment) {
      participantData.unreadCount += 1;
    } else {
      participantData.unreadCount = 0;
      participantData.lastReadAt = new Date();
    }
    return this.save();
  }
  return Promise.resolve(this);
};

// Méthode pour marquer tous les messages comme lus
conversationSchema.methods.markAsRead = function(userId) {
  return this.updateUnreadCount(userId, false);
};

// Méthode pour archiver/désarchiver la conversation pour un utilisateur
conversationSchema.methods.toggleArchive = function(userId) {
  const participantData = this.getParticipantData(userId);
  if (participantData) {
    participantData.isArchived = !participantData.isArchived;
    return this.save();
  }
  return Promise.resolve(this);
};

// Méthode pour activer/désactiver les notifications pour un utilisateur
conversationSchema.methods.toggleMute = function(userId) {
  const participantData = this.getParticipantData(userId);
  if (participantData) {
    participantData.isMuted = !participantData.isMuted;
    return this.save();
  }
  return Promise.resolve(this);
};

// Méthode statique pour créer une nouvelle conversation
conversationSchema.statics.createConversation = async function(participants, serviceId = null) {
  // Vérifier si une conversation existe déjà entre ces participants pour ce service
  const existingConversation = await this.findOne({
    participants: { $all: participants },
    serviceId: serviceId,
    isActive: true
  });

  if (existingConversation) {
    return existingConversation;
  }

  // Créer les données des participants
  const participantData = participants.map(userId => ({
    userId,
    unreadCount: 0,
    lastReadAt: new Date(),
    isArchived: false,
    isMuted: false
  }));

  const conversation = new this({
    participants,
    serviceId,
    participantData,
    isActive: true
  });

  return await conversation.save();
};

// Méthode statique pour obtenir les conversations d'un utilisateur
conversationSchema.statics.getUserConversations = function(userId, options = {}) {
  const { includeArchived = false, limit = 20, skip = 0 } = options;
  
  const query = {
    participants: userId,
    isActive: true
  };

  if (!includeArchived) {
    query['participantData'] = {
      $elemMatch: {
        userId: userId,
        isArchived: false
      }
    };
  }

  return this.find(query)
    .sort({ updatedAt: -1 })
    .limit(limit)
    .skip(skip);
};

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;