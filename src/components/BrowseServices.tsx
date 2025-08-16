import React, { useState, useEffect } from 'react';
import { mockServices, categories } from '../data/mockData';
import ServiceCard from './ServiceCard';
import { Service } from '../types';
import { Search, MapPin, Filter, Grid, List, Loader2 } from 'lucide-react';
import * as Icons from 'lucide-react';

interface BrowseServicesProps {
  onContactService: (service: Service) => void;
  onOrderService?: (service: Service, options: any) => void;
}

export default function BrowseServices({ onContactService }: BrowseServicesProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setServices(mockServices);
      setLoading(false);
    }, 500);
  }, []);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !location || service.location.toLowerCase().includes(location.toLowerCase());
    const matchesType = !serviceType || service.type === serviceType;
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    
    return matchesSearch && matchesLocation && matchesType && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Découvrez nos services
        </h1>
        <p className="text-gray-600">
          Trouvez le service parfait ou proposez le vôtre
        </p>
      </div>

      {/* Filtres de recherche */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Localisation */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Localisation..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Type de service */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">Tous les types</option>
              <option value="offer">Offres de service</option>
              <option value="request">Demandes de service</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filtres de catégories */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Catégories</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === ''
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Toutes
          </button>
          {categories.map((category) => {
            const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ComponentType<any>;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {IconComponent && <IconComponent className="w-4 h-4" />}
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} trouvé{filteredServices.length !== 1 ? 's' : ''}
        </p>
        
        {/* Mode d'affichage */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Affichage :</span>
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-sm flex items-center space-x-1 ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Grille</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm flex items-center space-x-1 ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Liste</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-12">{error}</div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onContact={onContactService}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredServices.map((service) => (
                <div key={service.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start space-x-6">
                    {service.images && service.images.length > 0 && (
                      <div className="flex-shrink-0">
                        <img
                          src={service.images[0]}
                          alt={service.title}
                          className="w-32 h-24 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {service.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {service.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>📍 {service.location}</span>
                            <span>⭐ {service.provider.rating} ({service.provider.reviews} avis)</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className="text-2xl font-bold text-gray-900 mb-3">
                            {service.price}
                          </div>
                          <button
                            onClick={() => onContactService(service)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Contacter
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredServices.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Aucun service trouvé pour vos critères de recherche.
              </p>
              <p className="text-gray-400 mt-2">
                Essayez de modifier vos filtres ou de publier votre propre service.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
