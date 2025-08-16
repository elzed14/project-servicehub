import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'FCFA'
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'in_progress', 'delivered', 'completed', 'cancelled', 'disputed'],
    default: 'pending'
  },
  requirements: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  deliveryDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  paymentIntent: {
    type: String
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'orange_money', 'mtn_money', 'moov_money', 'paypal']
  },
  transactionId: {
    type: String
  },
  notes: {
    type: String
  },
  revisions: {
    type: Number,
    default: 0
  },
  maxRevisions: {
    type: Number,
    default: 3
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ seller: 1, createdAt: -1 });
orderSchema.index({ service: 1 });
orderSchema.index({ status: 1 });

// Méthodes virtuelles
orderSchema.virtual('isOverdue').get(function() {
  return this.deliveryDate && new Date() > this.deliveryDate && this.status !== 'delivered';
});

orderSchema.virtual('daysUntilDelivery').get(function() {
  if (!this.deliveryDate) return null;
  const now = new Date();
  const delivery = new Date(this.deliveryDate);
  return Math.ceil((delivery - now) / (1000 * 60 * 60 * 24));
});

// Méthodes statiques
orderSchema.statics.getUserOrders = async function(userId, role = 'buyer') {
  const query = role === 'buyer' ? { buyer: userId } : { seller: userId };
  return this.find(query)
    .populate('service', 'title images price')
    .populate('buyer', 'name avatar')
    .populate('seller', 'name avatar')
    .sort({ createdAt: -1 });
};

orderSchema.statics.getOrderStats = async function(userId, role = 'buyer') {
  const query = role === 'buyer' ? { buyer: userId } : { seller: userId };
  
  const stats = await this.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);

  const totalOrders = await this.countDocuments(query);
  const totalRevenue = await this.aggregate([
    { $match: query },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  return {
    totalOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
    statusCounts: stats
  };
};

const Order = mongoose.model('Order', orderSchema);

export default Order;
