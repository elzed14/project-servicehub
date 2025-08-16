import User from '../models/User.js';
import Service from '../models/Service.js';

// @desc    Obtenir tous les utilisateurs (Admin)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || '';

    // Construire la requête de recherche
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.isActive = status === 'active';
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('services', 'title category type status');

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      users
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Obtenir un utilisateur par ID
// @route   GET /api/users/:id
// @access  Public
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('services', 'title category price type status createdAt images');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    // Ne pas exposer les informations sensibles
    const publicProfile = user.getPublicProfile();

    res.status(200).json({
      success: true,
      user: publicProfile
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Mettre à jour un utilisateur (Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const { name, email, location, bio, isActive, isAdmin } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name.trim();
    if (email) fieldsToUpdate.email = email.toLowerCase().trim();
    if (location) fieldsToUpdate.location = location.trim();
    if (bio !== undefined) fieldsToUpdate.bio = bio.trim();
    if (typeof isActive === 'boolean') fieldsToUpdate.isActive = isActive;
    if (typeof isAdmin === 'boolean') fieldsToUpdate.isAdmin = isAdmin;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Un compte avec cet email existe déjà'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Supprimer un utilisateur (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    // Empêcher la suppression de son propre compte
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Vous ne pouvez pas supprimer votre propre compte'
      });
    }

    // Désactiver l'utilisateur au lieu de le supprimer complètement
    user.isActive = false;
    await user.save();

    // Optionnel: Désactiver aussi tous ses services
    await Service.updateMany(
      { provider: user._id },
      { isActive: false, status: 'suspended' }
    );

    res.status(200).json({
      success: true,
      message: 'Utilisateur désactivé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Obtenir les statistiques des utilisateurs (Admin)
// @route   GET /api/users/stats
// @access  Private/Admin
export const getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          inactiveUsers: {
            $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] }
          },
          adminUsers: {
            $sum: { $cond: [{ $eq: ['$isAdmin', true] }, 1, 0] }
          },
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: '$reviews' }
        }
      }
    ]);

    // Statistiques par mois (derniers 12 mois)
    const monthlyStats = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: stats[0] || {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        adminUsers: 0,
        averageRating: 0,
        totalReviews: 0
      },
      monthlyStats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Rechercher des utilisateurs
// @route   GET /api/users/search
// @access  Public
export const searchUsers = async (req, res) => {
  try {
    const { q, location, rating, limit = 20 } = req.query;

    const query = { isActive: true };

    // Recherche textuelle
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } }
      ];
    }

    // Filtrer par localisation
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filtrer par note minimale
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    const users = await User.find(query)
      .select('name avatar location rating reviews bio')
      .sort({ rating: -1, reviews: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Erreur lors de la recherche d\'utilisateurs:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Obtenir les utilisateurs les mieux notés
// @route   GET /api/users/top-rated
// @access  Public
export const getTopRatedUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const users = await User.find({
      isActive: true,
      rating: { $gt: 0 },
      reviews: { $gt: 0 }
    })
    .select('name avatar location rating reviews bio')
    .sort({ rating: -1, reviews: -1 })
    .limit(limit);

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs les mieux notés:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Mettre à jour la dernière activité de l'utilisateur
// @route   PUT /api/users/activity
// @access  Private
export const updateLastActivity = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user.id,
      { lastActive: new Date() },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Activité mise à jour'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'activité:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};