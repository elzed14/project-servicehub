// Service pour la gestion des services et experts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  expert: {
    _id: string;
    name: string;
    avatar?: string;
    rating: number;
    reviewCount: number;
  };
  images?: string[];
  tags: string[];
  createdAt: string;
}

interface Expert {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  location: string;
  bio?: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  services: Service[];
  isVerified: boolean;
  joinedAt: string;
}

interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'price' | 'rating' | 'distance' | 'newest';
}

// Mock data pour la démonstration
const mockServices: Service[] = [
  {
    _id: '1',
    title: 'Développement site web professionnel',
    description: 'Création de sites web modernes et responsifs avec React, Node.js et design UX/UI optimisé',
    category: 'Développement Web',
    price: 150000,
    location: 'Abidjan, Cocody',
    expert: {
      _id: 'expert1',
      name: 'Marie Kouassi',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      rating: 4.9,
      reviewCount: 127
    },
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'],
    tags: ['React', 'Node.js', 'Responsive', 'SEO'],
    createdAt: '2024-01-15'
  },
  {
    _id: '2',
    title: 'Application mobile React Native',
    description: 'Développement d\'applications mobiles cross-platform pour iOS et Android avec interface moderne',
    category: 'Développement Mobile',
    price: 250000,
    location: 'Abidjan, Plateau',
    expert: {
      _id: 'expert1',
      name: 'Marie Kouassi',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      rating: 4.9,
      reviewCount: 127
    },
    images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400'],
    tags: ['React Native', 'iOS', 'Android', 'Mobile'],
    createdAt: '2024-01-10'
  },
  {
    _id: '3',
    title: 'Design UI/UX et identité visuelle',
    description: 'Création de designs modernes, logos et identités visuelles pour entreprises et startups',
    category: 'Design',
    price: 75000,
    location: 'Abidjan, Marcory',
    expert: {
      _id: 'expert2',
      name: 'Jean-Baptiste Ouattara',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      rating: 4.8,
      reviewCount: 89
    },
    images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400'],
    tags: ['UI/UX', 'Logo', 'Branding', 'Figma'],
    createdAt: '2024-01-12'
  },
  {
    _id: '4',
    title: 'Marketing digital et réseaux sociaux',
    description: 'Stratégies marketing complètes, gestion des réseaux sociaux et campagnes publicitaires',
    category: 'Marketing',
    price: 95000,
    location: 'Abidjan, Yopougon',
    expert: {
      _id: 'expert3',
      name: 'Fatou Traoré',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      rating: 4.7,
      reviewCount: 156
    },
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'],
    tags: ['SEO', 'Social Media', 'Google Ads', 'Analytics'],
    createdAt: '2024-01-08'
  }
];

const mockExperts: Expert[] = [
  {
    _id: 'expert1',
    name: 'Marie Kouassi',
    email: 'marie.kouassi@email.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300',
    location: 'Abidjan, Cocody',
    bio: 'Développeuse web passionnée avec 5 ans d\'expérience. Spécialisée dans React, Node.js et les applications mobiles.',
    skills: ['Développement Web', 'React', 'Node.js', 'UI/UX Design', 'Applications Mobiles'],
    rating: 4.9,
    reviewCount: 127,
    services: [],
    isVerified: true,
    joinedAt: '2022-03-15'
  },
  {
    _id: 'expert2',
    name: 'Jean-Baptiste Ouattara',
    email: 'jean.ouattara@email.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
    location: 'Abidjan, Marcory',
    bio: 'Designer UI/UX créatif avec une passion pour les interfaces utilisateur intuitives.',
    skills: ['UI/UX Design', 'Figma', 'Adobe Creative', 'Prototypage', 'Design Thinking'],
    rating: 4.8,
    reviewCount: 89,
    services: [],
    isVerified: true,
    joinedAt: '2022-07-20'
  },
  {
    _id: 'expert3',
    name: 'Fatou Traoré',
    email: 'fatou.traore@email.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
    location: 'Abidjan, Yopougon',
    bio: 'Experte en marketing digital avec 7 ans d\'expérience dans la croissance d\'entreprises.',
    skills: ['Marketing Digital', 'SEO', 'Social Media', 'Google Ads', 'Analytics'],
    rating: 4.7,
    reviewCount: 156,
    services: [],
    isVerified: true,
    joinedAt: '2021-11-10'
  }
];

const mockCategories = [
  'Développement Web',
  'Développement Mobile',
  'Design',
  'Marketing',
  'Rédaction',
  'Traduction',
  'Consultation',
  'Formation'
];

class ServiceService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('servicehub_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // Rechercher des services
  async searchServices(filters: SearchFilters = {}): Promise<{ services: Service[], total: number }> {
    try {
      // Simulation d'un délai d'API
      await new Promise(resolve => setTimeout(resolve, 800));

      let filteredServices = [...mockServices];

      // Filtrer par query
      if (filters.query) {
        const query = filters.query.toLowerCase();
        filteredServices = filteredServices.filter(service =>
          service.title.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      // Filtrer par catégorie
      if (filters.category) {
        filteredServices = filteredServices.filter(service =>
          service.category === filters.category
        );
      }

      // Filtrer par localisation
      if (filters.location) {
        const location = filters.location.toLowerCase();
        filteredServices = filteredServices.filter(service =>
          service.location.toLowerCase().includes(location)
        );
      }

      // Filtrer par prix
      if (filters.minPrice) {
        filteredServices = filteredServices.filter(service => service.price >= filters.minPrice!);
      }
      if (filters.maxPrice) {
        filteredServices = filteredServices.filter(service => service.price <= filters.maxPrice!);
      }

      // Filtrer par note
      if (filters.minRating) {
        filteredServices = filteredServices.filter(service => service.expert.rating >= filters.minRating!);
      }

      // Trier
      if (filters.sortBy) {
        filteredServices.sort((a, b) => {
          switch (filters.sortBy) {
            case 'price':
              return a.price - b.price;
            case 'rating':
              return b.expert.rating - a.expert.rating;
            case 'newest':
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            default:
              return 0;
          }
        });
      }

      return { services: filteredServices, total: filteredServices.length };
    } catch (error) {
      console.error('Search services error:', error);
      return { services: [], total: 0 };
    }
  }

  // Obtenir un service par ID
  async getServiceById(id: string): Promise<Service | null> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockServices.find(service => service._id === id) || null;
    } catch (error) {
      console.error('Get service error:', error);
      return null;
    }
  }

  // Créer un nouveau service (pour les experts)
  async createService(serviceData: Partial<Service>): Promise<{ success: boolean; service?: Service; message?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newService: Service = {
        _id: Date.now().toString(),
        title: serviceData.title || '',
        description: serviceData.description || '',
        category: serviceData.category || '',
        price: serviceData.price || 0,
        location: serviceData.location || '',
        expert: serviceData.expert || {
          _id: 'current-user',
          name: 'Utilisateur actuel',
          rating: 5.0,
          reviewCount: 0
        },
        images: serviceData.images || [],
        tags: serviceData.tags || [],
        createdAt: new Date().toISOString()
      };

      return { success: true, service: newService, message: 'Service créé avec succès' };
    } catch (error) {
      console.error('Create service error:', error);
      return { success: false, message: 'Erreur lors de la création du service' };
    }
  }

  // Obtenir les experts
  async getExperts(filters: SearchFilters = {}): Promise<{ experts: Expert[], total: number }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      let filteredExperts = [...mockExperts];

      // Filtrer par query
      if (filters.query) {
        const query = filters.query.toLowerCase();
        filteredExperts = filteredExperts.filter(expert =>
          expert.name.toLowerCase().includes(query) ||
          expert.bio?.toLowerCase().includes(query) ||
          expert.skills.some(skill => skill.toLowerCase().includes(query))
        );
      }

      // Filtrer par localisation
      if (filters.location) {
        const location = filters.location.toLowerCase();
        filteredExperts = filteredExperts.filter(expert =>
          expert.location.toLowerCase().includes(location)
        );
      }

      // Filtrer par note
      if (filters.minRating) {
        filteredExperts = filteredExperts.filter(expert => expert.rating >= filters.minRating!);
      }

      // Trier
      if (filters.sortBy) {
        filteredExperts.sort((a, b) => {
          switch (filters.sortBy) {
            case 'rating':
              return b.rating - a.rating;
            case 'newest':
              return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
            default:
              return 0;
          }
        });
      }

      return { experts: filteredExperts, total: filteredExperts.length };
    } catch (error) {
      console.error('Get experts error:', error);
      return { experts: [], total: 0 };
    }
  }

  // Obtenir un expert par ID
  async getExpertById(id: string): Promise<Expert | null> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockExperts.find(expert => expert._id === id) || null;
    } catch (error) {
      console.error('Get expert error:', error);
      return null;
    }
  }

  // Obtenir les catégories
  async getCategories(): Promise<string[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockCategories;
    } catch (error) {
      console.error('Get categories error:', error);
      return [];
    }
  }
}

export const serviceService = new ServiceService();
export type { Service, Expert, SearchFilters };