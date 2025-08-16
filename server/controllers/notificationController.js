import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js';

// @desc    Créer une nouvelle notification
// @route   POST /api/notifications
// @access  Private
const createNotification = asyncHandler(async (req, res) => {
  const { type, title, message, data, priority } = req.body;

  const notification = new Notification({
    user: req.user._id,
    type,
    title,
    message,
    data: data || {},
    priority: priority || 'medium'
  });

  const createdNotification = await notification.save();
  res.status(201).json(createdNotification);
});

// @desc    Obtenir les notifications d'un utilisateur
// @route   GET /api/notifications
// @access  Private
const getUserNotifications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const unreadOnly = req.query.unread === 'true';

  const query = { user: req.user._id };
  if (unreadOnly) {
    query.read = false;
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);

  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ 
    user: req.user._id, 
    read: false 
  });

  res.json({
    notifications,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total,
    unreadCount
  });
});

// @desc    Marquer une notification comme lue
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );

  if (!notification) {
    res.status(404);
    throw new Error('Notification non trouvée');
  }

  res.json(notification);
});

// @desc    Marquer toutes les notifications comme lues
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, read: false },
    { read: true }
  );

  res.json({ message: 'Toutes les notifications ont été marquées comme lues' });
});

// @desc    Obtenir le nombre de notifications non lues
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({ 
    user: req.user._id, 
    read: false 
  });

  res.json({ count });
});

// @desc    Supprimer une notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!notification) {
    res.status(404);
    throw new Error('Notification non trouvée');
  }

  res.json({ message: 'Notification supprimée' });
});

export {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification
};
