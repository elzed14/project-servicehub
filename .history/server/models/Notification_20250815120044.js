import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'new_message',
      'new_order',
      'order_update',
      'new_review',
      'service_approved',
      'service_rejected',
      'payment_received',
      'payment_failed',
      'order_completed',
      'order_cancelled',
      'system_announcement'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  read: {
    type: Boolean,
    default: false
  },
  actionUrl: {
    type: String
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Méthodes statiques
notificationSchema.statics.createNotification = async function(userId, type, title, message, data = {}, priority = 'medium') {
  const notification = new this({
    user: userId,
    type,
    title,
    message,
    data,
    priority
  });

  await notification.save();
  return notification;
};

notificationSchema.statics.markAsRead = async function(notificationId, userId) {
  return this.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { read: true },
    { new: true }
  );
};

notificationSchema.statics.markAllAsRead = async function(userId) {
  return this.updateMany(
    { user: userId, read: false },
    { read: true }
  );
};

notificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({ user: userId, read: false });
};

notificationSchema.statics.getUserNotifications = async function(userId, limit = 20, skip = 0) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('user', 'name avatar');
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
