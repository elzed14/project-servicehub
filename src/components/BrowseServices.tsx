import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Grid, List, Loader2, Star } from 'lucide-react';
import { serviceService, Service } from '../shared/services/serviceService';
import { useNavigate } from 'react-router-dom';

interface BrowseServicesProps {
  onContactService?: (service: Service) => void;
}

export default function BrowseServices({ onContactService }: BrowseServicesProps) {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    'Développement Web',
    'Développement Mobile', 
    'Design',
    'Marketing',
    'Rédaction',
    'Consultation'
  ];

  useEffect(() => {
    fetchServices();
  }, [searchTerm, location, selectedCategory, minRating, sortBy]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await serviceService.searchServices({
        query: searchTerm,
        location,
        category: selectedCategory,
        minRating,
        sortBy: sortBy as any
      });
      setServices(response.services);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = (service: Service) => {
    navigate(`/expert/${service.expert._id}`);
  };

  const handleContactService = (service: Service) => {
    if (onContactService) {
      onContactService(service);
    } else {
      navigate(`/messages?expertId=${service.expert._id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Découvrez nos services
        </h1>
        <p className="text-xl text-gray-600">
          Trouvez l'expert parfait pour votre projet
        </p>
      </div>

      {/* Filtres de recherche */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Localisation */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Localisation..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Catégorie */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Tri */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Plus récents</option>
            <option value="rating">Mieux notés</option>
            <option value="price">Prix croissant</option>
          </select>
        </div>

        {/* Note minimale */}
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Note minimale :</span>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                className={`p-1 ${minRating >= rating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                <Star className="w-5 h-5 fill-current" />
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {minRating > 0 ? `${minRating}+ étoiles` : 'Toutes notes'}
          </span>
        </div>
      </div>

      {/* Contrôles d'affichage */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {services.length} service{services.length !== 1 ? 's' : ''} trouvé{services.length !== 1 ? 's' : ''}
        </p>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Affichage :</span>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm flex items-center space-x-1 ${
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
              className={`px-3 py-2 text-sm flex items-center space-x-1 ${
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

      {/* Résultats */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Recherche en cours...</span>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden"
                  onClick={() => handleServiceClick(service)}
                >
                  {service.images && service.images[0] && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={service.images[0]}
                        alt={service.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {service.title}
                      </h3>
                      <span className="text-xl font-bold text-blue-600 ml-2">
                        {service.price.toLocaleString()} FCFA
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {service.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        {service.location}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={service.expert.avatar}
                          alt={service.expert.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{service.expert.name}</p>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                            <span className="text-xs text-gray-600">
                              {service.expert.rating} ({service.expert.reviewCount})
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContactService(service);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Contacter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6"
                  onClick={() => handleServiceClick(service)}
                >
                  <div className="flex items-start space-x-6">
                    {service.images && service.images[0] && (
                      <img
                        src={service.images[0]}
                        alt={service.title}
                        className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {service.title}
                          </h3>
                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {service.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {service.location}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {service.category}
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-blue-600 mb-2">
                            {service.price.toLocaleString()} FCFA
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContactService(service);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Contacter
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <img
                            src={service.expert.avatar}
                            alt={service.expert.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{service.expert.name}</p>
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                              <span className="text-xs text-gray-600">
                                {service.expert.rating} ({service.expert.reviewCount} avis)
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {service.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
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
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun service trouvé
              </h3>
              <p className="text-gray-600">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}