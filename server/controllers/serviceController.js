import Service from '../models/Service.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

// @desc    Obtenir tous les services
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const {
      search,
      category,
      type,
      location,
      status = 'active',
      featured,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Construire la requête de recherche
    const query = { isActive: true };
    
    if (status) {
      query.status = status;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (type) {
      query.type = type;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (featured === 'true') {
      query.featured = true;
    }

    // Construire l'ordre de tri
    const sortOptions = {};
    if (search) {
      sortOptions.score = { $meta: 'textScore' };
    }
    
    if (featured === 'true') {
      sortOptions.featured = -1;
    }
    
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const services = await Service.find(query)
      .sort(sortOptions)
      .limit(limit)
      .skip(skip);

    const total = await Service.countDocuments(query);

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      services
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Obtenir un service par ID
// @route   GET /api/services/:id
// @access  Public
export const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service non trouvé'
      });
    }

    // Incrémenter le nombre de vues
    await service.incrementViews();

    res.status(200).json({
      success: true,
      service
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du service:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Service non trouvé'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Créer un nouveau service
// @route   POST /api/services
// @access  Private
export const createService = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      location,
      images,
      tags,
      type
    } = req.body;

    // Validation des champs requis
    if (!title || !description || !category || !price || !location || !type) {
      return res.status(400).json({
        success: false,
        error: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    // Vérifier que la catégorie existe
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        error: 'Catégorie invalide'
      });
    }

    // Créer le service
    const service = await Service.create({
      title: title.trim(),
      description: description.trim(),
      category,
      price: price.trim(),
      location: location.trim(),
      provider: req.user.id,
      images: images || [],
      tags: tags || [],
      type,
      status: 'pending' // Les services doivent être approuvés
    });

    res.status(201).json({
      success: true,
      service
    });
  } catch (error) {
    console.error('Erreur lors de la création du service:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la création du service'
    });
  }
};

// @desc    Mettre à jour un service
// @route   PUT /api/services/:id
// @access  Private
export const updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service non trouvé'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire du service ou un admin
    if (service.provider.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Non autorisé à modifier ce service'
      });
    }

    const {
      title,
      description,
      category,
      price,
      location,
      images,
      tags,
      type,
      status
    } = req.body;

    const fieldsToUpdate = {};
    if (title) fieldsToUpdate.title = title.trim();
    if (description) fieldsToUpdate.description = description.trim();
    if (category) {
      // Vérifier que la catégorie existe
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          error: 'Catégorie invalide'
        });
      }
      fieldsToUpdate.category = category;
    }
    if (price) fieldsToUpdate.price = price.trim();
    if (location) fieldsToUpdate.location = location.trim();
    if (images) fieldsToUpdate.images = images;
    if (tags) fieldsToUpdate.tags = tags;
    if (type) fieldsToUpdate.type = type;
    
    // Seuls les admins peuvent changer le statut
    if (status && req.user.isAdmin) {
      fieldsToUpdate.status = status;
    }

    service = await Service.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      service
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du service:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Supprimer un service
// @route   DELETE /api/services/:id
// @access  Private
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service non trouvé'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire du service ou un admin
    if (service.provider.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Non autorisé à supprimer ce service'
      });
    }

    // Désactiver le service au lieu de le supprimer complètement
    service.isActive = false;
    service.status = 'suspended';
    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du service:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Obtenir les services d'un utilisateur
// @route   GET /api/services/user/:userId
// @access  Public
export const getUserServices = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status || 'active';

    const query = {
      provider: userId,
      isActive: true
    };

    if (status) {
      query.status = status;
    }

    const services = await Service.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Service.countDocuments(query);

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      services
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des services utilisateur:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Obtenir les services par catégorie
// @route   GET /api/services/category/:categoryId
// @access  Public
export const getServicesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const limit = parseInt(req.query.limit) || 20;

    const services = await Service.getServicesByCategory(categoryId, limit);

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des services par catégorie:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Obtenir les services populaires
// @route   GET /api/services/popular
// @access  Public
export const getPopularServices = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const services = await Service.getPopularServices(limit);

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des services populaires:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Rechercher des services
// @route   GET /api/services/search
// @access  Public
export const searchServices = async (req, res) => {
  try {
    const { q, category, type, location, limit = 20 } = req.query;

    const filters = {};
    if (category) filters.category = category;
    if (type) filters.type = type;
    if (location) filters.location = location;

    const services = await Service.searchServices(q, filters)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    console.error('Erreur lors de la recherche de services:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Marquer un service comme contacté
// @route   POST /api/services/:id/contact
// @access  Private
export const contactService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service non trouvé'
      });
    }

    // Empêcher l'utilisateur de contacter son propre service
    if (service.provider.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Vous ne pouvez pas contacter votre propre service'
      });
    }

    // Incrémenter le nombre de contacts
    await service.incrementContacts();

    res.status(200).json({
      success: true,
      message: 'Contact enregistré'
    });
  } catch (error) {
    console.error('Erreur lors du contact du service:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Obtenir les statistiques des services (Admin)
// @route   GET /api/services/stats
// @access  Private/Admin
export const getServiceStats = async (req, res) => {
  try {
    const stats = await Service.aggregate([
      {
        $group: {
          _id: null,
          totalServices: { $sum: 1 },
          activeServices: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          pendingServices: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          offers: {
            $sum: { $cond: [{ $eq: ['$type', 'offer'] }, 1, 0] }
          },
          requests: {
            $sum: { $cond: [{ $eq: ['$type', 'request'] }, 1, 0] }
          },
          totalViews: { $sum: '$views' },
          totalContacts: { $sum: '$contacts' }
        }
      }
    ]);

    // Statistiques par catégorie
    const categoryStats = await Service.aggregate([
      {
        $match: { isActive: true, status: 'active' }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalContacts: { $sum: '$contacts' }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: '$category'
      },
      {
        $project: {
          name: '$category.name',
          count: 1,
          totalViews: 1,
          totalContacts: 1
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: stats[0] || {
        totalServices: 0,
        activeServices: 0,
        pendingServices: 0,
        offers: 0,
        requests: 0,
        totalViews: 0,
        totalContacts: 0
      },
      categoryStats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};