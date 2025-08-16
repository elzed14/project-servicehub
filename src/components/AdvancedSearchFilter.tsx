import React, { useState } from 'react';
import { Search, MapPin, Filter, Star, Clock, DollarSign, SlidersHorizontal } from 'lucide-react';

interface AdvancedSearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  serviceType: string;
  onServiceTypeChange: (value: string) => void;
  priceMin: number;
  priceMax: number;
  onPriceChange: (min: number, max: number) => void;
  rating: number;
  onRatingChange: (rating: number) => void;
  deliveryTime: string;
  onDeliveryTimeChange: (time: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export default function AdvancedSearchFilter({
  searchTerm,
  onSearchChange,
  location,
  onLocationChange,
  serviceType,
  onServiceTypeChange,
  priceMin,
  priceMax,
  onPriceChange,
  rating,
  onRatingChange,
  deliveryTime,
  onDeliveryTimeChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange
}: AdvancedSearchFilterProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      {/* Recherche principale */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un service..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Localisation..."
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={serviceType}
            onChange={(e) => onServiceTypeChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            <option value="">Tous les types</option>
            <option value="offer">Offres de service</option>
            <option value="request">Demandes de service</option>
          </select>
        </div>
      </div>

      {/* Bouton filtres avancés */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{showAdvanced ? 'Masquer' : 'Filtres avancés'}</span>
        </button>

        <div className="flex items-center space-x-4">
          {/* Mode d'affichage */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Affichage :</span>
            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`px-3 py-1 text-sm ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Grille
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`px-3 py-1 text-sm ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Liste
              </button>
            </div>
          </div>

          {/* Tri */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Trier par :</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="relevance">Pertinence</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="rating">Meilleures notes</option>
              <option value="recent">Plus récents</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filtres avancés */}
      {showAdvanced && (
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtre prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Prix (FCFA)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin || ''}
                  onChange={(e) => onPriceChange(Number(e.target.value) || 0, priceMax)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax || ''}
                  onChange={(e) => onPriceChange(priceMin, Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtre note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Star className="w-4 h-4 inline mr-1" />
                Note minimum
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => onRatingChange(star)}
                    className={`p-1 ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400`}
                  >
                    <Star className="w-5 h-5 fill-current" />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {rating > 0 ? `${rating}+ étoiles` : 'Toutes notes'}
                </span>
              </div>
            </div>

            {/* Filtre délai */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Délai de livraison
              </label>
              <select
                value={deliveryTime}
                onChange={(e) => onDeliveryTimeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous délais</option>
                <option value="24h">24 heures</option>
                <option value="3d">3 jours</option>
                <option value="1w">1 semaine</option>
                <option value="1m">1 mois</option>
              </select>
            </div>
          </div>

          {/* Bouton reset */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                onSearchChange('');
                onLocationChange('');
                onServiceTypeChange('');
                onPriceChange(0, 0);
                onRatingChange(0);
                onDeliveryTimeChange('');
                onSortChange('relevance');
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      )}
    </div>
  );
}