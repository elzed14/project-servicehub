import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  DollarSign
} from 'lucide-react';
import { serviceService, Service } from '../../shared/services/serviceService';
import { ModernButton } from '../../shared/components/ui/ModernButton';
import { useNotifications } from '../../hooks/useNotifications';

export const ServiceDetailPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { success } = useNotifications();
  
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (serviceId) {
      loadService();
    }
  }, [serviceId]);

  const loadService = async () => {
    if (!serviceId) return;
    
    setLoading(true);
    try {
      const serviceData = await serviceService.getServiceById(serviceId);
      setService(serviceData);
    } catch (error) {
      console.error('Error loading service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    if (service) {
      navigate(`/messages?expertId=${service.expert._id}`);
    }
  };

  const handleOrder = () => {
    if (service) {
      success('Commande initiée ! Vous allez être redirigé vers le paiement.');
      // Ici on pourrait rediriger vers une page de commande
    }
  };

  const nextImage = () => {
    if (service?.images && service.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === service.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (service?.images && service.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? service.images!.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du service...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service introuvable</h2>
          <p className="text-gray-600 mb-6">Ce service n'existe pas ou n'est plus disponible.</p>
          <ModernButton onClick={() => navigate('/browse')}>
            Retour à la recherche
          </ModernButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
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
                <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden">
                  <img
                    src={service.images[currentImageIndex]}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  {service.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
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
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
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
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-3">
                    {service.category}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h1>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm font-medium">
                    {service.expert.rating} ({service.expert.reviewCount} avis)
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-gray-600 mb-6">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{service.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Livraison en 3-5 jours</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
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
                  <h3 className="text-lg font-semibold mb-3">Compétences</h3>
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

            {/* Profil de l'expert */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-lg font-semibold mb-6">À propos de l'expert</h3>
              <div className="flex items-start space-x-6">
                <img
                  src={service.expert.avatar}
                  alt={service.expert.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h4 className="text-xl font-medium">{service.expert.name}</h4>
                    <Shield className="w-5 h-5 text-green-500" />
                    <Award className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span>{service.expert.rating} ({service.expert.reviewCount} avis)</span>
                    </div>
                    <span>Expert vérifié</span>
                    <span className="text-green-600">En ligne</span>
                  </div>
                  <p className="text-gray-700">
                    Expert expérimenté dans le domaine {service.category.toLowerCase()}. 
                    Spécialisé dans la création de solutions de qualité pour les entreprises et particuliers.
                  </p>
                  <button
                    onClick={() => navigate(`/expert/${service.expert._id}`)}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Voir le profil complet →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar commande */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {service.price.toLocaleString()} FCFA
                  </div>
                  <p className="text-gray-600">Prix du service</p>
                </div>

                {/* Boutons d'action */}
                <div className="space-y-3">
                  <ModernButton
                    onClick={handleOrder}
                    className="w-full"
                    size="lg"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Commander maintenant
                  </ModernButton>
                  
                  <ModernButton
                    onClick={handleContact}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contacter l'expert
                  </ModernButton>
                </div>

                {/* Garanties */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-4">Garanties incluses</h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-3 text-green-500" />
                      <span>Paiement sécurisé</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-3 text-yellow-500" />
                      <span>Satisfaction garantie</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-3 text-blue-500" />
                      <span>Support 24/7</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-3 text-purple-500" />
                      <span>Livraison dans les délais</span>
                    </div>
                  </div>
                </div>

                {/* Info expert */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={service.expert.avatar}
                      alt={service.expert.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h5 className="font-medium text-gray-900">{service.expert.name}</h5>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                        <span>{service.expert.rating} • {service.expert.reviewCount} avis</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/expert/${service.expert._id}`)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Voir tous ses services →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};