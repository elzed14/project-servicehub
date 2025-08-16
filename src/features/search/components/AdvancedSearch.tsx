import React, { useState } from 'react';
import { Search, Filter, MapPin, DollarSign, Star, Calendar } from 'lucide-react';
import Button from '../../../shared/components/ui/Button';

interface SearchFilters {
  query: string;
  category: string;
  location: string;
  priceMin: number;
  priceMax: number;
  rating: number;
  serviceType: 'all' | 'offer' | 'request';
  dateRange: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  categories: Array<{ id: string; name: string }>;
  loading?: boolean;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  categories,
  loading = false
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    location: '',
    priceMin: 0,
    priceMax: 10000,
    rating: 0,
    serviceType: 'all',
    dateRange: 'all'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      query: '',
      category: '',
      location: '',
      priceMin: 0,
      priceMax: 10000,
      rating: 0,
      serviceType: 'all',
      dateRange: 'all'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Recherche principale */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un service..."
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <Button
          onClick={handleSearch}
          loading={loading}
          icon={<Search className="w-4 h-4" />}
        >
          Rechercher
        </Button>
        
        <Button
          variant="ghost"
          onClick={() => setShowAdvanced(!showAdvanced)}
          icon={<Filter className="w-4 h-4" />}
        >
          Filtres
        </Button>
      </div>

      {/* Filtres avancés */}
      {showAdvanced && (
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Localisation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Localisation
              </label>
              <input
                type="text"
                placeholder="Ville, région..."
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type de service */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de service
              </label>
              <select
                value={filters.serviceType}
                onChange={(e) => setFilters({ ...filters, serviceType: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous</option>
                <option value="offer">Offres</option>
                <option value="request">Demandes</option>
              </select>
            </div>

            {/* Note minimale */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Star className="w-4 h-4 inline mr-1" />
                Note minimale
              </label>
              <select
                value={filters.rating}
                onChange={(e) => setFilters({ ...filters, rating: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={0}>Toutes les notes</option>
                <option value={4}>4+ étoiles</option>
                <option value={4.5}>4.5+ étoiles</option>
                <option value={5}>5 étoiles</option>
              </select>
            </div>
          </div>

          {/* Fourchette de prix */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Fourchette de prix (€)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceMin}
                onChange={(e) => setFilters({ ...filters, priceMin: Number(e.target.value) })}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-500">à</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceMax}
                onChange={(e) => setFilters({ ...filters, priceMax: Number(e.target.value) })}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="ghost" onClick={handleReset}>
              Réinitialiser
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowAdvanced(false)}
              >
                Fermer
              </Button>
              <Button onClick={handleSearch} loading={loading}>
                Appliquer les filtres
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;