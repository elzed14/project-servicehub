import React, { useState } from 'react';
import { X, Sparkles, Search, Star, BarChart3, Grid } from 'lucide-react';

export default function UpdateBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                🎉 <strong>Nouvelles fonctionnalités disponibles !</strong>
              </p>
              <div className="flex items-center space-x-4 text-xs mt-1">
                <span className="flex items-center">
                  <Search className="w-3 h-3 mr-1" />
                  Filtres avancés
                </span>
                <span className="flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  Système d'avis
                </span>
                <span className="flex items-center">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Tableau de bord
                </span>
                <span className="flex items-center">
                  <Grid className="w-3 h-3 mr-1" />
                  Fiches détaillées
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}