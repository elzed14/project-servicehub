import api from './api';
import { Service, Category } from '../types';

export const serviceService = {
  // Services
  getServices: (params: { 
    searchTerm?: string; 
    category?: string; 
    location?: string; 
    serviceType?: string 
  }) => api.get<Service[]>('/services', { params }),
  
  getService: (id: string) => api.get<Service>(`/services/${id}`),
  
  createService: (serviceData: Omit<Service, 'id' | 'provider' | 'createdAt'>) => 
    api.post<Service>('/services', serviceData),
  
  updateService: (id: string, serviceData: Partial<Service>) => 
    api.put<Service>(`/services/${id}`, serviceData),
  
  deleteService: (id: string) => api.delete(`/services/${id}`),

  // Categories
  getCategories: () => api.get<Category[]>('/categories'),
};
