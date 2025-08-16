import React from 'react';
import { MapPin, Star, Clock, Eye } from 'lucide-react';
import Button from '../../../shared/components/ui/Button';
import { Service } from '../../../types';

interface ServiceCardProps {
  service: Service;
  onContact: (service: Service) => void;
  onView?: (service: Service) => void;
  compact?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onContact,
  onView,
  compact = false
}) => {
  const handleContact = () => onContact(service);
  const handleView = () => onView?.(service);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Image */}
      {service.images?.[0] && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={service.images[0]}
            alt={service.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              service.type === 'offer' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-orange-100 text-orange-800'
            }`}>
              {service.type === 'offer' ? 'Offre' : 'Demande'}
            </span>
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {service.title}
          </h3>
          <div className="text-lg font-bold text-blue-600 ml-2">
            {service.price}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {service.description}
        </p>

        {/* Tags */}
        {service.tags && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {service.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {service.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{service.tags.length - 3} autres
              </span>
            )}
          </div>
        )}

        {/* Provider Info */}
        <div className="flex items-center mb-3">
          <img
            src={service.provider.avatar}
            alt={service.provider.name}
            className="w-8 h-8 rounded-full object-cover mr-2"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {service.provider.name}
            </p>
            <div className="flex items-center text-xs text-gray-500">
              <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
              <span>{service.provider.rating}</span>
              <span className="mx-1">•</span>
              <span>{service.provider.reviews} avis</span>
            </div>
          </div>
        </div>

        {/* Location & Time */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{service.location}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>{new Date(service.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleContact}
            className="flex-1"
          >
            Contacter
          </Button>
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleView}
              icon={<Eye className="w-4 h-4" />}
            >
              Voir
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;