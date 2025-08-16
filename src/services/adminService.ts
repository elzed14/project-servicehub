import { AdminStats, AdminUser, AdminService, AdminReport, AdminSettings, AdminNotification, Category } from '../types';

// Mock data pour l'administration
const mockStats: AdminStats = {
  totalUsers: 1247,
  totalServices: 856,
  totalOffers: 523,
  totalRequests: 333,
  activeUsers: 89,
  pendingServices: 12,
  monthlyGrowth: 15.3,
  revenue: 45680
};

const mockUsers: AdminUser[] = [
  {
    id: '1',
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
    location: 'Paris, France',
    rating: 4.8,
    reviews: 24,
    bio: 'Développeuse web passionnée',
    status: 'active',
    joinDate: new Date('2024-03-10'),
    lastActive: new Date(),
    totalEarnings: 2450,
    services: []
  },
  {
    id: '2',
    name: 'Jean Martin',
    email: 'jean.martin@email.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150',
    location: 'Lyon, France',
    rating: 4.9,
    reviews: 18,
    bio: 'Designer graphique créatif',
    status: 'active',
    joinDate: new Date('2024-02-20'),
    lastActive: new Date(),
    totalEarnings: 1890,
    services: []
  }
];

const mockServices: AdminService[] = [
  {
    id: '1',
    title: 'Développement site web',
    description: 'Création de sites web modernes et responsives',
    category: 'Développement',
    price: '500-2000€',
    location: 'Paris, France',
    provider: {
      name: 'Marie Dubois',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
      rating: 4.8,
      reviews: 24
    },
    images: [],
    tags: ['React', 'Node.js'],
    createdAt: new Date(),
    type: 'offer',
    status: 'active',
    reportCount: 0,
    views: 156,
    contacts: 23
  }
];

const mockCategories: Category[] = [
  { id: '1', name: 'Développement', icon: 'Code', color: 'bg-blue-500', isActive: true, serviceCount: 45 },
  { id: '2', name: 'Design', icon: 'Palette', color: 'bg-purple-500', isActive: true, serviceCount: 32 },
  { id: '3', name: 'Marketing', icon: 'TrendingUp', color: 'bg-green-500', isActive: true, serviceCount: 28 }
];

const mockReports: AdminReport[] = [
  {
    id: '1',
    type: 'inappropriate_content',
    targetId: 'service-123',
    targetType: 'service',
    reporterId: 'user-456',
    reason: 'Contenu inapproprié',
    description: 'Le service contient des informations trompeuses',
    status: 'pending',
    createdAt: new Date()
  }
];

const mockSettings: AdminSettings = {
  platformName: 'ServiceHub',
  commissionRate: 5.0,
  autoApproveServices: false,
  requireEmailVerification: true,
  maxImagesPerService: 5,
  minServicePrice: 10,
  maxServicePrice: 10000,
  allowedFileTypes: ['jpg', 'png', 'pdf'],
  maintenanceMode: false,
  featuredServicePrice: 50
};

const mockNotifications: AdminNotification[] = [
  {
    id: '1',
    type: 'new_user',
    title: 'Nouvel utilisateur',
    message: 'Un nouvel utilisateur s\'est inscrit',
    isRead: false,
    createdAt: new Date()
  }
];

export const adminService = {
  // Stats
  getStats: () => Promise.resolve({ data: mockStats }),

  // Users
  getUsers: (params: { search?: string; status?: string; page?: number; limit?: number }) => 
    Promise.resolve({ data: mockUsers }),
  
  updateUserStatus: (userId: string, status: 'active' | 'suspended' | 'pending') =>
    Promise.resolve({ data: { success: true } }),

  // Services
  getServices: (params: { search?: string; status?: string; page?: number; limit?: number }) =>
    Promise.resolve({ data: mockServices }),
  
  updateServiceStatus: (serviceId: string, status: 'active' | 'pending' | 'rejected' | 'suspended') =>
    Promise.resolve({ data: { success: true } }),

  // Categories
  getCategories: () => Promise.resolve({ data: mockCategories }),
  
  createCategory: (category: Omit<Category, 'id'>) =>
    Promise.resolve({ data: { ...category, id: Date.now().toString() } }),
  
  updateCategory: (id: string, category: Partial<Category>) =>
    Promise.resolve({ data: { ...category, id } }),
  
  deleteCategory: (id: string) => Promise.resolve({ data: { success: true } }),

  // Reports
  getReports: () => Promise.resolve({ data: mockReports }),
  
  updateReportStatus: (reportId: string, status: 'resolved' | 'dismissed', adminNotes?: string) =>
    Promise.resolve({ data: { success: true } }),

  // Settings
  getSettings: () => Promise.resolve({ data: mockSettings }),
  
  updateSettings: (settings: AdminSettings) =>
    Promise.resolve({ data: settings }),

  // Notifications
  getNotifications: () => Promise.resolve({ data: mockNotifications }),
  
  markNotificationAsRead: (notificationId: string) =>
    Promise.resolve({ data: { success: true } }),
};