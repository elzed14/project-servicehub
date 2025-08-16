import React from 'react';
import { MapPin, Star, MessageCircle, Eye, Calendar } from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onContact: (service: Service) => void;
}

export default function ServiceCard({ service, onContact }: ServiceCardProps) {
  const isOffer = service.type === 'offer';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      {service.images && service.images.length > 0 && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={service.images[0]}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isOffer 
                ? 'bg-green-100 text-green-800' 
                : 'bg-orange-100 text-orange-800'
            }`}>
              {isOffer ? 'Offre' : 'Demande'}
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Titre et description */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {service.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {service.description}
        </p>

        {/* Catégorie et localisation */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {service.category}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{service.location}</span>
          </div>
        </div>

        {/* Prix */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-gray-900">{service.price}</span>
        </div>

        {/* Tags */}
        {service.tags && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {service.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
            {service.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                +{service.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Prestataire */}
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
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">
                  {service.provider.rating} ({service.provider.reviews} avis)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Date de création */}
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <Calendar className="w-4 h-4 mr-1" />
          <span>Publié le {new Date(service.createdAt).toLocaleDateString('fr-FR')}</span>
        </div>

        {/* Bouton de contact */}
        <button
          onClick={() => onContact(service)}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isOffer
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-orange-600 text-white hover:bg-orange-700'
          }`}
        >
          <MessageCircle className="w-4 h-4 inline mr-2" />
          {isOffer ? 'Contacter le prestataire' : 'Proposer mes services'}
        </button>
      </div>
    </div>
  );
}