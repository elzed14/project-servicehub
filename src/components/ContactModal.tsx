import React, { useState } from 'react';
import { X, MessageCircle, Star, MapPin, Calendar, Send } from 'lucide-react';
import { Service } from '../types';

interface ContactModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
  onOpenMessaging: (serviceId: string, providerId: string) => void;
}

export default function ContactModal({ service, isOpen, onClose, onOpenMessaging }: ContactModalProps) {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSendMessage = () => {
    if (message.trim()) {
      onOpenMessaging(service.id, service.provider.name);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Contacter le prestataire</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Service Info */}
          <div className="mb-6">
            <div className="flex items-start space-x-4">
              {service.images && service.images.length > 0 && (
                <img
                  src={service.images[0]}
                  alt={service.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {service.location}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(service.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 mb-1">{service.price}</div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  service.type === 'offer' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {service.type === 'offer' ? 'Offre' : 'Demande'}
                </span>
              </div>
            </div>
          </div>

          {/* Provider Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <img
                src={service.provider.avatar}
                alt={service.provider.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">{service.provider.name}</h4>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">
                    {service.provider.rating} ({service.provider.reviews} avis)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (optionnel)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Décrivez votre demande ou posez vos questions..."
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSendMessage}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Envoyer un message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}