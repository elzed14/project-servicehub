export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string | number;
  location: string;
  provider: {
    id?: string;
    name: string;
    avatar: string;
    rating: number;
    reviews: number;
  };
  images?: string[];
  tags?: string[];
  deliveryTime?: string;
  customOptions?: ServiceOption[];
  createdAt: Date | string;
  updatedAt?: Date | string;
  type: 'offer' | 'request';
}

export interface ServiceOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
  notHelpful?: number;
  isVerified?: boolean;
  serviceId: string;
  response?: {
    text: string;
    date: Date;
  };
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  date: Date;
}

export interface OrderDetails {
  id: string;
  serviceId: string;
  buyerId: string;
  sellerId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  amount: number;
  selectedOptions: Record<string, boolean>;
  requirements: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDashboard {
  activeOrders: OrderDetails[];
  completedOrders: OrderDetails[];
  earnings: {
    total: number;
    thisMonth: number;
    pending: number;
  };
  statistics: {
    totalServices: number;
    totalSales: number;
    averageRating: number;
    responseTime: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  location: string;
  rating: number;
  reviews: number;
  services?: Service[];
  bio: string;
  // Propriétés d'administration
  role?: 'user' | 'moderator' | 'admin';
  permissions?: {
    manageUsers?: boolean;
    manageServices?: boolean;
    viewAnalytics?: boolean;
    moderateContent?: boolean;
    systemSettings?: boolean;
    financialReports?: boolean;
    supportTickets?: boolean;
  };
  adminLevel?: 'standard' | 'moderator' | 'super_admin' | null;
  joinDate?: string;
  lastLogin?: string;
  isVerified?: boolean;
  badge?: string;
  department?: string;
  phone?: string;
  address?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalServices: number;
  totalOffers: number;
  totalRequests: number;
  activeUsers: number;
  pendingServices: number;
  monthlyGrowth: number;
  revenue: number;
}

export interface AdminUser extends User {
  status: 'active' | 'suspended' | 'pending';
  joinDate: Date;
  lastActive: Date;
  totalEarnings: number;
}

export interface AdminService extends Service {
  status: 'active' | 'pending' | 'rejected' | 'suspended';
  reportCount: number;
  views: number;
  contacts: number;
}

export interface AdminReport {
  id: string;
  type: 'service' | 'user' | 'inappropriate_content' | 'spam' | 'fraud';
  targetId: string;
  targetType: 'service' | 'user';
  reporterId: string;
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: Date;
  resolvedAt?: Date;
  adminNotes?: string;
}

export interface AdminSettings {
  platformName: string;
  commissionRate: number;
  autoApproveServices: boolean;
  requireEmailVerification: boolean;
  maxImagesPerService: number;
  minServicePrice: number;
  maxServicePrice: number;
  allowedFileTypes: string[];
  maintenanceMode: boolean;
  featuredServicePrice: number;
}

export interface AdminNotification {
  id: string;
  type: 'new_user' | 'new_service' | 'report' | 'payment' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'image' | 'file';
  attachments?: string[];
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  serviceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OnlineUser {
  userId: string;
  socketId: string;
  lastSeen: Date;
}
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isActive: boolean;
  serviceCount: number;
  description?: string;
}

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Types pour les erreurs
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: ValidationError[];
}

// Types pour les filtres
export interface ServiceFilters {
  searchTerm?: string;
  category?: string;
  location?: string;
  serviceType?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  deliveryTime?: string;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'recent';
  page?: number;
  limit?: number;
  type?: 'offer' | 'request';
  search?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ServiceResponse {
  data: Service[];
  total?: number;
  totalPages?: number;
  currentPage?: number;
}