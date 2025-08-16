import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, Star, Grid, List, Loader2 } from 'lucide-react';
import { serviceService, Service, Expert, SearchFilters } from '../../shared/services/serviceService';
import { ModernButton } from '../../shared/components/ui/ModernButton';
import { ExpertCard } from '../../shared/components/ui/ExpertCard';

export const FunctionalSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'services' | 'experts'>('services');
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [categories, setCategories] = useState<string[]>([]);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('query') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    minRating: Number(searchParams.get('minRating')) || 0,
    sortBy: searchParams.get('sortBy') || 'newest'
  });

  // Charger les catégories au montage
  useEffect(() => {
    loadCategories();
  }, []);

  // Mettre à jour les filtres lorsque les paramètres de recherche changent
  useEffect(() => {
    setFilters({
      query: searchParams.get('query') || '',
      location: searchParams.get('location') || '',
      category: searchParams.get('category') || '',
      minRating: Number(searchParams.get('minRating')) || 0,
      sortBy: searchParams.get('sortBy') || 'newest'
    });
  }, [searchParams]);

  // Rechercher quand les filtres changent
  useEffect(() => {
    handleSearch();
  }, [filters, viewMode]);

  const loadCategories = async () => {
    const cats = await serviceService.getCategories();
    setCategories(cats);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      if (viewMode === 'services') {
        const { services: results } = await serviceService.searchServices(filters);
        setServices(results);
      } else {
        const { experts: results } = await serviceService.getExperts(filters);
        setExperts(results);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Mettre à jour les paramètres de l'URL
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) {
        newSearchParams.set(k, String(v));
      }
    });
    setSearchParams(newSearchParams);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de recherche */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Barre de recherche principale */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un service ou un expert..."
                value={filters.query || ''}
                onChange={(e) => updateFilter('query', e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Localisation */}
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Localisation"
                value={filters.location || ''}
                onChange={(e) => updateFilter('location', e.target.value)}
                className="w-full lg:w-64 pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Bouton recherche */}
            <ModernButton onClick={handleSearch} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Rechercher'}
            </ModernButton>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filtres */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filtres
              </h3>

              {/* Type de vue */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rechercher
                </label>
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  <button
                    onClick={() => setViewMode('services')}
                    className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                      viewMode === 'services'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Services
                  </button>
                  <button
                    onClick={() => setViewMode('experts')}
                    className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                      viewMode === 'experts'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Experts
                  </button>
                </div>
              </div>

              {/* Catégorie */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Note minimale */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note minimale
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => updateFilter('minRating', rating)}
                      className={`p-1 ${
                        (filters.minRating || 0) >= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Tri */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trier par
                </label>
                <select
                  value={filters.sortBy || 'newest'}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Plus récent</option>
                  <option value="rating">Meilleure note</option>
                  <option value="price">Prix croissant</option>
                  <option value="distance">Plus proche</option>
                </select>
              </div>
            </div>
          </div>

          {/* Résultats */}
          <div className="flex-1">
            {/* Header résultats */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {viewMode === 'services' ? 'Services' : 'Experts'}
                {!isLoading && (
                  <span className="text-gray-500 font-normal ml-2">
                    ({viewMode === 'services' ? services.length : experts.length} résultats)
                  </span>
                )}
              </h2>

              {/* Mode d'affichage */}
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setDisplayMode('grid')}
                  className={`p-2 ${
                    displayMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDisplayMode('list')}
                  className={`p-2 ${
                    displayMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Recherche en cours...</span>
              </div>
            )}

            {/* Résultats Services */}
            {!isLoading && viewMode === 'services' && (
              <div className={`grid gap-6 ${
                displayMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {services.map((service, index) => (
                  <motion.div
                    key={service._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/expert/${service._id}`)}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={service.expert.avatar || 'https://via.placeholder.com/40'}
                          alt={service.expert.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="text-sm text-gray-700">{service.expert.name}</span>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {service.price.toLocaleString()} FCFA
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Résultats Experts */}
            {!isLoading && viewMode === 'experts' && (
              <div className={`grid gap-6 ${
                displayMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {experts.map((expert, index) => (
                  <motion.div
                    key={expert._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ExpertCard 
                      expert={{
                        id: expert._id,
                        name: expert.name,
                        avatar: expert.avatar || 'https://via.placeholder.com/150',
                        profession: expert.skills[0] || 'Expert',
                        rating: expert.rating,
                        reviewCount: expert.reviewCount,
                        location: expert.location,
                        responseTime: '2h',
                        verified: expert.isVerified,
                        price: '25000 FCFA',
                        services: expert.skills.slice(0, 3)
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Aucun résultat */}
            {!isLoading && 
             ((viewMode === 'services' && services.length === 0) || 
              (viewMode === 'experts' && experts.length === 0)) && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun résultat trouvé
                </h3>
                <p className="text-gray-600">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};