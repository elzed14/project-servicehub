import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchFilters {
  service: string;
  location: string;
  minRating: number;
  sortBy: 'rating' | 'distance' | 'price';
}

interface SmartSearchProps {
  onSearch: (filters: SearchFilters) => void;
  suggestions?: string[];
}

export const SmartSearch: React.FC<SmartSearchProps> = ({ onSearch, suggestions = [] }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    service: '',
    location: '',
    minRating: 0,
    sortBy: 'rating'
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch(filters);
  };

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(filters.service.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Barre de recherche principale */}
      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Quel service recherchez-vous ?"
              value={filters.service}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, service: e.target.value }));
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-12 pr-4 py-4 text-lg border-none focus:outline-none"
            />
          </div>
          
          <div className="border-l border-gray-200 px-4">
            <div className="flex items-center text-gray-500">
              <MapPin className="w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Localisation"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="w-32 border-none focus:outline-none"
              />
            </div>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-4 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 font-medium transition-colors"
          >
            Rechercher
          </motion.button>
        </div>

        {/* Suggestions auto-complétion */}
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50"
            >
              {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, service: suggestion }));
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <Search className="w-4 h-4 inline mr-3 text-gray-400" />
                  {suggestion}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filtres avancés */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 bg-white rounded-xl shadow-lg border border-gray-100 p-6"
          >
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note minimale
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFilters(prev => ({ ...prev, minRating: rating }))}
                      className={`p-1 ${filters.minRating >= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trier par
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="rating">Meilleure note</option>
                  <option value="distance">Plus proche</option>
                  <option value="price">Prix croissant</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};