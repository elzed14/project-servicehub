import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Star } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import CategoryFilter from '../components/CategoryFilter';
import SearchFilter from '../components/SearchFilter';

interface Service {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: {
    name: string;
  };
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  reviews: number;
  location: string;
  type: 'offer' | 'request';
}

const FindService: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    fetchServices();
  }, [searchTerm, selectedCategory, priceRange, sortBy]);

  const fetchServices = async () => {
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        category: selectedCategory,
        minPrice: priceRange.min.toString(),
        maxPrice: priceRange.max.toString(),
        sortBy,
      });

      const response = await fetch(`/api/services/search?${params}`);
      const data = await response.json();
      setServices(data.services || data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Trouver un service</h1>
        <p className="text-xl text-gray-600">Découvrez des milliers de services proposés par des experts</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filtres */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </h3>
            
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Prix</label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0 FCFA</span>
                  <span>{priceRange.max.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Trier par</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="relevance">Pertinence</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="rating">Note</option>
                <option value="newest">Plus récent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded"></div>
                  <div className="mt-4 space-y-2">
                    <div className="bg-gray-200 h-4 rounded"></div>
                    <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {services.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <ServiceCard key={service._id} service={service} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun service trouvé</h3>
                  <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindService;
