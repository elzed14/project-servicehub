import express from 'express';

const router = express.Router();

const mockCategories = [
  { id: '1', name: 'Informatique', icon: 'Monitor', color: 'bg-blue-500', isActive: true, serviceCount: 45 },
  { id: '2', name: 'Ménage', icon: 'Home', color: 'bg-green-500', isActive: true, serviceCount: 123 },
  { id: '3', name: 'Jardinage', icon: 'Flower', color: 'bg-emerald-500', isActive: true, serviceCount: 67 },
  { id: '4', name: 'Réparation', icon: 'Wrench', color: 'bg-orange-500', isActive: true, serviceCount: 89 },
  { id: '5', name: 'Cours', icon: 'BookOpen', color: 'bg-purple-500', isActive: true, serviceCount: 156 },
  { id: '6', name: 'Transport', icon: 'Car', color: 'bg-red-500', isActive: true, serviceCount: 34 }
];

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: mockCategories
  });
});

export default router;