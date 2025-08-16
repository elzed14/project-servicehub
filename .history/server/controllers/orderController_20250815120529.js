import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// @desc    Créer une nouvelle commande
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { serviceId, requirements, paymentMethod } = req.body;

  const service = await Service.findById(serviceId).populate('user', 'name email');
  if (!service) {
    res.status(404);
    throw new Error('Service non trouvé');
  }

  if (service.user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('Vous ne pouvez pas commander votre propre service');
  }

  const order = new Order({
    service: serviceId,
    buyer: req.user._id,
    seller: service.user._id,
    amount: service.price,
    requirements,
    paymentMethod,
    deliveryDate: new Date(Date.now() + (service.deliveryTime || 7) * 24 * 60 * 60 * 1000)
  });

  const createdOrder = await order.save();
  await createdOrder.populate([
    { path: 'service', select: 'title images price deliveryTime' },
    { path: 'buyer', select: 'name avatar' },
    { path: 'seller', select: 'name avatar' }
  ]);

  // Créer des notifications
  await Notification.createNotification(
    service.user._id,
    'new_order',
    'Nouvelle commande',
    `Vous avez reçu une nouvelle commande pour ${service.title}`,
    { orderId: createdOrder._id, serviceId }
  );

  await Notification.createNotification(
    req.user._id,
    'order_placed',
    'Commande confirmée',
    `Votre commande pour ${service.title} a été confirmée`,
    { orderId: createdOrder._id, serviceId }
  );

  res.status(201).json(createdOrder);
});

// @desc    Obtenir les commandes d'un utilisateur
// @route   GET /api/orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const role = req.query.role || 'buyer';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const query = role === 'buyer' 
    ? { buyer: req.user._id } 
    : { seller: req.user._id };

  const orders = await Order.find(query)
    .populate('service', 'title images price')
    .populate('buyer', 'name avatar')
    .populate('seller', 'name avatar')
    .sort('-createdAt')
    .limit(limit)
    .skip((page - 1) * limit);

  const total = await Order.countDocuments(query);

  res.json({
    orders,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
});

// @desc    Obtenir une commande spécifique
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('service', 'title images price description')
    .populate('buyer', 'name avatar email')
    .populate('seller', 'name avatar email');

  if (!order) {
    res.status(404);
    throw new Error('Commande non trouvée');
  }

  if (order.buyer._id.toString() !== req.user._id.toString() && 
      order.seller._id.toString() !== req.user._id.toString() && 
      !req.user.isAdmin) {
    res.status(401);
    throw new Error('Non autorisé');
  }

  res.json(order);
});

// @desc    Mettre à jour le statut d'une commande
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;

  const order = await Order.findById(req.params.id)
    .populate('service', 'title')
    .populate('buyer', 'name email')
    .populate('seller', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Commande non trouvée');
  }

  const isSeller = order.seller._id.toString() === req.user._id.toString();
  const isBuyer = order.buyer._id.toString() === req.user._id.toString();

  if (!isSeller && !isBuyer && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Non autorisé');
  }

  // Validation des transitions de statut
  const validTransitions = {
    pending: ['active', 'cancelled'],
    active: ['in_progress', 'delivered', 'cancelled'],
    in_progress: ['delivered', 'cancelled'],
    delivered: ['completed'],
    completed: [],
    cancelled: [],
    disputed: ['cancelled', 'completed']
  };

  if (!validTransitions[order.status]?.includes(status)) {
    res.status(400);
    throw new Error(`Transition de statut invalide de ${order.status} à ${status}`);
  }

  order.status = status;
  if (notes) order.notes = notes;
  if (status === 'completed') order.completedDate = new<create_file>
<path>server/routes/orders.js</path>
<content>import express from 'express';
import {
  createOrder,
  getUserOrders,
  updateOrderStatus,
  getOrderStats,
  deleteOrder
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/stats/:userId', getOrderStats);

// Protected routes
router.post('/', protect, createOrder);
router.get('/user/:userId', protect, getUserOrders);
router.put('/:id/status', protect, updateOrderStatus);
router.delete('/:id', protect, deleteOrder);

export default router;
