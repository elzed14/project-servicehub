import React, { useState, useEffect } from 'react';
import { serviceService } from '../services/serviceService';
import ServiceCard from './ServiceCard';
import SearchFilter from './SearchFilter';
import CategoryFilter from './CategoryFilter';
import { Service } from '../types';
import { Loader2, Grid, List } from 'lucide-react';

interface BrowseServicesProps {
  onContactService: (service: Service) => void;
  onOrderService?: (service: Service, options: any) => void;
}

export default function BrowseServices({ onContactService, onOrderService }: BrowseServicesProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [location, setLocation] = useState('');
  const [serviceType, setServiceType] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await serviceService.getServices({
          searchTerm,
          category: selectedCategory,
          location,
          serviceType,
        });
        setServices(response.data);
      } catch (err) {
        setError('Failed to fetch services');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchServices();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedCategory, location, serviceType]);

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

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        location={location}
        onLocationChange={setLocation}
        serviceType={serviceType}
        onServiceTypeChange={setServiceType}
      />

      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          {services.length} service{services.length !== 1 ? 's' : ''} trouvé{services.length !== 1 ? 's' : ''}
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
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onContact={onContactService}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
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

          {services.length === 0 && !loading && (
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