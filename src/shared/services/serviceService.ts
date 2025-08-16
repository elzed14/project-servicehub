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
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_BASE_URL}/services/search?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      return result.success ? { services: result.data, total: result.total } : { services: [], total: 0 };
    } catch (error) {
      console.error('Search services error:', error);
      return { services: [], total: 0 };
    }
  }

  // Obtenir un service par ID
  async getServiceById(id: string): Promise<Service | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error('Get service error:', error);
      return null;
    }
  }

  // Créer un nouveau service (pour les experts)
  async createService(serviceData: Partial<Service>): Promise<{ success: boolean; service?: Service; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/services`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(serviceData),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Create service error:', error);
      return { success: false, message: 'Erreur de connexion au serveur' };
    }
  }

  // Obtenir les experts
  async getExperts(filters: SearchFilters = {}): Promise<{ experts: Expert[], total: number }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_BASE_URL}/users/experts?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      return result.success ? { experts: result.data, total: result.total } : { experts: [], total: 0 };
    } catch (error) {
      console.error('Get experts error:', error);
      return { experts: [], total: 0 };
    }
  }

  // Obtenir un expert par ID
  async getExpertById(id: string): Promise<Expert | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/experts/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error('Get expert error:', error);
      return null;
    }
  }

  // Obtenir les catégories
  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/services/categories`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Get categories error:', error);
      return [];
    }
  }
}

export const serviceService = new ServiceService();
export type { Service, Expert, SearchFilters };