import express from 'express';

const router = express.Router();

// Mock services data
const mockServices = [
  {
    id: '1',
    title: 'Développement site web',
    description: 'Création de sites web modernes et responsifs avec React et Node.js.',
    category: 'Informatique',
    price: '500-2000€',
    location: 'Paris, France',
    provider: {
      name: 'Marie Dubois',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
      rating: 4.8,
      reviews: 24
    },
    images: ['https://images.pexels.com/photos/326502/pexels-photo-326502.jpeg'],
    tags: ['React', 'Node.js', 'JavaScript'],
    createdAt: new Date('2024-01-15'),
    type: 'offer'
  }
];

const mockCategories = [
  { id: '1', name: 'Informatique', icon: 'Monitor', color: 'bg-blue-500', isActive: true, serviceCount: 45 },
  { id: '2', name: 'Ménage', icon: 'Home', color: 'bg-green-500', isActive: true, serviceCount: 123 },
  { id: '3', name: 'Jardinage', icon: 'Flower', color: 'bg-emerald-500', isActive: true, serviceCount: 67 },
  { id: '4', name: 'Réparation', icon: 'Wrench', color: 'bg-orange-500', isActive: true, serviceCount: 89 }
];

// Get services
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: mockServices
  });
});

// Create service
router.post('/', (req, res) => {
  const newService = {
    id: Date.now().toString(),
    ...req.body,
    provider: {
      name: 'Test User',
      avatar: 'https://ui-avatars.com/api/?name=Test+User&background=3B82F6&color=fff',
      rating: 5.0,
      reviews: 0
    },
    createdAt: new Date()
  };
  
  mockServices.push(newService);
  
  res.status(201).json({
    success: true,
    data: newService
  });
});

export default router;