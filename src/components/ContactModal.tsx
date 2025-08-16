import React, { useState } from 'react';
import { X, MessageCircle, Star, MapPin, Calendar, Send, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Service } from '../types';
import { useAppContext } from '../context/AppContext';
import { useNotifications } from '../hooks/useNotifications';

interface ContactModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ service, isOpen, onClose }: ContactModalProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useAppContext();
  const { currentUser } = state;
  const { success, error } = useNotifications();

  if (!isOpen) return null;

  const handleSendMessage = async () => {
    if (!currentUser) {
      error('Vous devez être connecté pour envoyer un message');
      return;
    }

    if (!message.trim()) {
      error('Veuillez saisir un message');
      return;
    }

    setIsLoading(true);
    try {
      // Simulation d'envoi de message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      success('Message envoyé avec succès !');
      onClose();
      
      // Rediriger vers la messagerie
      setTimeout(() => {
        navigate(`/messages?expertId=${service.provider.id || service.provider.name}`);
      }, 1000);
    } catch (err) {
      error('Erreur lors de l\'envoi du message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProfile = () => {
    onClose();
    navigate(`/expert/${service.provider.id || service.id}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Contacter l'expert</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Service Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-start space-x-4">
              {service.images && service.images.length > 0 && (
                <img
                  src={service.images[0]}
                  alt={service.title}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{service.description}</p>
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
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {typeof service.price === 'number' 
                    ? service.price.toLocaleString() + ' FCFA'
                    : service.price
                  }
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {service.category}
                </span>
              </div>
            </div>
          </div>

          {/* Provider Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center space-x-4">
              <img
                src={service.provider.avatar}
                alt={service.provider.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">{service.provider.name}</h4>
                <div className="flex items-center mt-1 mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm text-gray-600">
                    {service.provider.rating} ({service.provider.reviews} avis)
                  </span>
                </div>
                <button
                  onClick={handleViewProfile}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Voir le profil complet →
                </button>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageCircle className="w-4 h-4 inline mr-1" />
              Votre message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Bonjour, je suis intéressé(e) par votre service. Pourriez-vous me donner plus d'informations ?"
            />
            <p className="text-xs text-gray-500 mt-1">
              Décrivez votre projet pour obtenir une réponse personnalisée
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim()}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center font-medium disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer le message
                </>
              )}
            </button>
          </div>

          {/* Info supplémentaire */}
          <div className="mt-6 p-4 bg-green-50 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h5 className="font-medium text-green-800 mb-1">Réponse garantie</h5>
                <p className="text-sm text-green-700">
                  Nos experts s'engagent à répondre dans les 24h. 
                  Vous recevrez une notification dès que {service.provider.name} aura lu votre message.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}