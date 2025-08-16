import React, { useState, useEffect } from 'react';
import { mockServices } from '../data/mockData';
import { Service } from '../types';

interface SimpleBrowseServicesProps {
  onContactService: (service: Service) => void;
  onOrderService?: (service: Service, options: any) => void;
}

export default function SimpleBrowseServices({ onContactService }: SimpleBrowseServicesProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement
    setTimeout(() => {
      setServices(mockServices);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {service.images && service.images.length > 0 && (
              <div className="h-48 overflow-hidden">
                <img
                  src={service.images[0]}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {service.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                  {service.category}
                </span>
                <div className="text-sm text-gray-500">
                  📍 {service.location}
                </div>
              </div>
              
              <div className="mb-4">
                <span className="text-2xl font-bold text-gray-900">{service.price}</span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={service.provider.avatar}
                    alt={service.provider.name}
                    className="w-8 h-8 rounded-full object-cover mr-3"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{service.provider.name}</p>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">
                        ⭐ {service.provider.rating} ({service.provider.reviews} avis)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => onContactService(service)}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Contacter le prestataire
              </button>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Aucun service disponible pour le moment.
          </p>
        </div>
      )}
    </div>
  );
}