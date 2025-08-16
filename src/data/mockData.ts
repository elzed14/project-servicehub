import { Service, Category } from '../types';

// Mock current user for messaging
export const currentUser = {
  id: '1',
  name: 'Marie Dubois',
  email: 'marie.dubois@email.com',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
  location: 'Paris, France',
  rating: 4.8,
  reviews: 24,
  services: [],
  bio: 'Développeuse web passionnée avec 5 ans d\'expérience'
};

export const adminStats = {
  totalUsers: 1247,
  totalServices: 892,
  totalOffers: 634,
  totalRequests: 258,
  activeUsers: 423,
  pendingServices: 12,
  monthlyGrowth: 15.3,
  revenue: 24750
};

export const adminUsers = [
  {
    id: '1',
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
    location: 'Paris, France',
    rating: 4.8,
    reviews: 24,
    services: [],
    bio: 'Développeuse web passionnée',
    status: 'active' as const,
    joinDate: new Date('2023-01-15'),
    lastActive: new Date('2024-01-25'),
    totalEarnings: 3450
  },
  {
    id: '2',
    name: 'Pierre Martin',
    email: 'pierre.martin@email.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150',
    location: 'Lyon, France',
    rating: 4.2,
    reviews: 8,
    services: [],
    bio: 'Réparateur électroménager',
    status: 'pending' as const,
    joinDate: new Date('2024-01-20'),
    lastActive: new Date('2024-01-24'),
    totalEarnings: 0
  }
];

export const categories: Category[] = [
  { id: '1', name: 'Informatique', icon: 'Monitor', color: 'bg-blue-500', isActive: true, serviceCount: 45, description: 'Services informatiques et développement' },
  { id: '2', name: 'Ménage', icon: 'Home', color: 'bg-green-500', isActive: true, serviceCount: 123, description: 'Services de nettoyage et entretien' },
  { id: '3', name: 'Jardinage', icon: 'Flower', color: 'bg-emerald-500', isActive: true, serviceCount: 67, description: 'Entretien espaces verts et jardinage' },
  { id: '4', name: 'Réparation', icon: 'Wrench', color: 'bg-orange-500', isActive: true, serviceCount: 89, description: 'Réparations et maintenance' },
  { id: '5', name: 'Cours', icon: 'BookOpen', color: 'bg-purple-500', isActive: true, serviceCount: 156, description: 'Cours particuliers et formation' },
  { id: '6', name: 'Transport', icon: 'Car', color: 'bg-red-500', isActive: true, serviceCount: 34, description: 'Services de transport et livraison' },
  { id: '7', name: 'Beauté', icon: 'Scissors', color: 'bg-pink-500', isActive: true, serviceCount: 78, description: 'Services de beauté et bien-être' },
  { id: '8', name: 'Événements', icon: 'Calendar', color: 'bg-indigo-500', isActive: true, serviceCount: 92, description: 'Organisation d\'événements' },
];

export const adminReports = [
  {
    id: '1',
    type: 'inappropriate_content' as const,
    targetId: '1',
    targetType: 'service' as const,
    reporterId: '2',
    reason: 'Contenu inapproprié',
    description: 'Le service contient des images inappropriées',
    status: 'pending' as const,
    createdAt: new Date('2024-01-24'),
    adminNotes: ''
  },
  {
    id: '2',
    type: 'spam' as const,
    targetId: '2',
    targetType: 'user' as const,
    reporterId: '1',
    reason: 'Spam',
    description: 'Utilisateur envoie des messages non sollicités',
    status: 'pending' as const,
    createdAt: new Date('2024-01-23'),
    adminNotes: ''
  }
];

export const adminSettings = {
  platformName: 'ServiceHub',
  commissionRate: 5,
  autoApproveServices: false,
  requireEmailVerification: true,
  maxImagesPerService: 5,
  minServicePrice: 10,
  maxServicePrice: 10000,
  allowedFileTypes: ['jpg', 'jpeg', 'png', 'webp'],
  maintenanceMode: false,
  featuredServicePrice: 20
};

export const adminNotifications = [
  {
    id: '1',
    type: 'new_user' as const,
    title: 'Nouvel utilisateur',
    message: 'Pierre Martin s\'est inscrit',
    isRead: false,
    createdAt: new Date('2024-01-25'),
    actionUrl: '/admin/users'
  },
  {
    id: '2',
    type: 'report' as const,
    title: 'Nouveau signalement',
    message: 'Signalement de contenu inapproprié',
    isRead: false,
    createdAt: new Date('2024-01-24'),
    actionUrl: '/admin/reports'
  },
  {
    id: '3',
    type: 'new_service' as const,
    title: 'Service en attente',
    message: '3 services en attente de validation',
    isRead: true,
    createdAt: new Date('2024-01-23'),
    actionUrl: '/admin/services'
  }
];
export const mockServices: Service[] = [
  {
    id: '1',
    title: 'Développement site web',
    description: 'Création de sites web modernes et responsifs avec React et Node.js. Expertise en e-commerce et applications web.',
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
  },
  {
    id: '2',
    title: 'Ménage domicile',
    description: 'Service de ménage professionnel pour particuliers. Nettoyage complet, repassage et entretien régulier.',
    category: 'Ménage',
    price: '25€/h',
    location: 'Lyon, France',
    provider: {
      name: 'Sophie Martin',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150',
      rating: 4.9,
      reviews: 87
    },
    images: ['https://images.pexels.com/photos/4239103/pexels-photo-4239103.jpeg'],
    tags: ['Ménage', 'Repassage', 'Régulier'],
    createdAt: new Date('2024-01-20'),
    type: 'offer'
  },
  {
    id: '3',
    title: 'Cherche prof de guitare',
    description: 'Recherche professeur de guitare expérimenté pour cours débutant. Préférence pour cours à domicile.',
    category: 'Cours',
    price: '30-40€/h',
    location: 'Marseille, France',
    provider: {
      name: 'Pierre Leroy',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150',
      rating: 4.5,
      reviews: 12
    },
    images: ['https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg'],
    tags: ['Guitare', 'Débutant', 'Domicile'],
    createdAt: new Date('2024-01-18'),
    type: 'request'
  },
  {
    id: '4',
    title: 'Réparation électroménager',
    description: 'Réparation tous types d\'électroménager : lave-linge, lave-vaisselle, réfrigérateur. Intervention rapide.',
    category: 'Réparation',
    price: '80€ + pièces',
    location: 'Toulouse, France',
    provider: {
      name: 'Jean Durand',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=150',
      rating: 4.7,
      reviews: 156
    },
    images: ['https://images.pexels.com/photos/5691616/pexels-photo-5691616.jpeg'],
    tags: ['Électroménager', 'Réparation', 'Rapide'],
    createdAt: new Date('2024-01-22'),
    type: 'offer'
  }
];