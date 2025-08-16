import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  User,
  Shield,
  Award,
  Calendar,
  DollarSign,
  Plus,
  Minus
} from 'lucide-react';
import { Service, Review, FAQ } from '../types';

interface ServiceDetailProps {
  service: Service;
  onBack: () => void;
  onContact: (service: Service) => void;
  onOrder?: (service: Service, options: any) => void;
}

export default function ServiceDetail({ service, onBack, onContact, onOrder }: ServiceDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<any>({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');

  // Mock data - à remplacer par des appels API
  const mockReviews: Review[] = [
    {
      id: '1',
      userId: 'user1',
      userName: 'Marie Dubois',
      userAvatar: '/api/placeholder/40/40',
      rating: 5,
      comment: 'Excellent service, très professionnel et rapide !',
      date: new Date('2024-01-15'),
      helpful: 12
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Jean Martin',
      userAvatar: '/api/placeholder/40/40',
      rating: 4,
      comment: 'Bon travail, quelques petits ajustements mais globalement satisfait.',
      date: new Date('2024-01-10'),
      helpful: 8
    }
  ];

  const mockFAQ: FAQ[] = [
    {
      id: '1',
      question: 'Combien de temps prend la livraison ?',
      answer: 'En général, je livre dans les 3-5 jours ouvrables selon la complexité du projet.',
      date: new Date('2024-01-01')
    },
    {
      id: '2',
      question: 'Proposez-vous des révisions ?',
      answer: 'Oui, j\'inclus 2 révisions gratuites dans tous mes services.',
      date: new Date('2024-01-01')
    }
  ];

  const mockOptions = [
    {
      id: 'express',
      name: 'Livraison express (24h)',
      price: 15000,
      description: 'Livraison prioritaire en 24h'
    },
    {
      id: 'revisions',
      name: 'Révisions supplémentaires',
      price: 5000,
      description: 'Révisions illimitées pendant 7 jours'
    }
  ];

  const nextImage = () => {
    if (service.images && service.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === service.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (service.images && service.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? service.images!.length - 1 : prev - 1
      );
    }
  };

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: !prev[optionId]
    }));
  };

  const calculateTotalPrice = () => {
    let total = typeof service.price === 'string' 
      ? parseInt(service.price.replace(/\D/g, '')) || 0
      : service.price;
    
    mockOptions.forEach(option => {
      if (selectedOptions[option.id]) {
        total += option.price;
      }
    });
    
    return total;
  };

  const handleOrder = () => {
    if (onOrder) {
      onOrder(service, selectedOptions);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full ${
                  isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full text-gray-400 hover:text-gray-600">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Galerie d'images */}
            {service.images && service.images.length > 0 && (
              <div className="relative">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={service.images[currentImageIndex]}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  {service.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
                {service.images.length > 1 && (
                  <div className="flex space-x-2 mt-4 overflow-x-auto">
                    {service.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${service.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Informations du service */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    service.type === 'offer' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {service.type === 'offer' ? 'Offre' : 'Demande'}
                  </span>
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {service.category}
                  </span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">
                    {service.provider.rating} ({service.provider.reviews} avis)
                  </span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {service.title}
              </h1>

              <div className="flex items-center space-x-4 text-gray-600 mb-6">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{service.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Livraison en 3-5 jours</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Publié le {new Date(service.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Tags */}
              {service.tags && service.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Mots-clés</h3>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profil du prestataire */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">À propos du prestataire</h3>
              <div className="flex items-start space-x-4">
                <img
                  src={service.provider.avatar}
                  alt={service.provider.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-lg font-medium">{service.provider.name}</h4>
                    <Shield className="w-4 h-4 text-green-500" />
                    <Award className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span>{service.provider.rating} ({service.provider.reviews} avis)</span>
                    </div>
                    <span>Membre depuis 2023</span>
                    <span className="text-green-600">En ligne</span>
                  </div>
                  <p className="text-gray-700">
                    Développeur web expérimenté avec plus de 5 ans d'expérience. 
                    Spécialisé dans React, Node.js et les applications modernes.
                  </p>
                </div>
              </div>
            </div>

            {/* Avis clients */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Avis clients</h3>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{service.provider.rating}</span>
                  <span className="text-gray-600">({mockReviews.length} avis)</span>
                </div>
              </div>

              <div className="space-y-4">
                {mockReviews.slice(0, showAllReviews ? mockReviews.length : 2).map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <img
                        src={review.userAvatar}
                        alt={review.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h5 className="font-medium">{review.userName}</h5>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.date.toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        <button className="text-sm text-gray-500 hover:text-gray-700">
                          👍 Utile ({review.helpful})
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {mockReviews.length > 2 && (
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  {showAllReviews ? 'Voir moins' : `Voir tous les avis (${mockReviews.length})`}
                </button>
              )}
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Questions fréquentes</h3>
              <div className="space-y-4">
                {mockFAQ.map((faq) => (
                  <div key={faq.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <h5 className="font-medium text-gray-900 mb-2">{faq.question}</h5>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <h5 className="font-medium mb-3">Poser une question</h5>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Votre question..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar commande */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {calculateTotalPrice().toLocaleString()} FCFA
                  </div>
                  <p className="text-gray-600">Prix de base</p>
                </div>

                {/* Options personnalisables */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold">Options supplémentaires</h4>
                  {mockOptions.map((option) => (
                    <div key={option.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={option.id}
                            checked={selectedOptions[option.id] || false}
                            onChange={() => toggleOption(option.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor={option.id} className="font-medium">
                            {option.name}
                          </label>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      </div>
                      <span className="font-medium text-green-600">
                        +{option.price.toLocaleString()} FCFA
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total :</span>
                    <span className="text-green-600">
                      {calculateTotalPrice().toLocaleString()} FCFA
                    </span>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="space-y-3">
                  {onOrder && (
                    <button
                      onClick={handleOrder}
                      className="w-full py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
                    >
                      <DollarSign className="w-4 h-4 inline mr-2" />
                      Commander maintenant
                    </button>
                  )}
                  <button
                    onClick={() => onContact(service)}
                    className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 inline mr-2" />
                    Contacter le prestataire
                  </button>
                </div>

                {/* Garanties */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-green-500" />
                      <span>Paiement sécurisé</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-2 text-yellow-500" />
                      <span>Satisfaction garantie</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2 text-blue-500" />
                      <span>Support 24/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}