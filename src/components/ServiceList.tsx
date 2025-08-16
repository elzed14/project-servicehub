import React, { useState, useEffect, useCallback } from 'react';
import { Grid, List, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import ServiceCard from './ServiceCard';
import { Service } from '../types';

interface ServiceListProps {
  services: Service[];
  loading: boolean;
  viewMode: 'grid' | 'list';
  onContactService: (service: Service) => void;
  onServiceClick?: (service: Service) => void;
  // Pagination classique
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  // Chargement infini
  hasMore?: boolean;
  onLoadMore?: () => void;
  paginationType?: 'classic' | 'infinite';
}

export default function ServiceList({
  services,
  loading,
  viewMode,
  onContactService,
  onServiceClick,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  hasMore = false,
  onLoadMore,
  paginationType = 'classic'
}: ServiceListProps) {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Chargement infini avec intersection observer
  const handleScroll = useCallback(() => {
    if (paginationType !== 'infinite' || !hasMore || loading || isLoadingMore) return;

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 1000) {
      setIsLoadingMore(true);
      onLoadMore?.();
    }
  }, [paginationType, hasMore, loading, isLoadingMore, onLoadMore]);

  useEffect(() => {
    if (paginationType === 'infinite') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll, paginationType]);

  useEffect(() => {
    if (isLoadingMore && !loading) {
      setIsLoadingMore(false);
    }
  }, [loading, isLoadingMore]);

  const ServiceCardComponent = ({ service }: { service: Service }) => (
    <div
      className={`cursor-pointer transition-transform hover:scale-105 ${
        onServiceClick ? 'hover:shadow-lg' : ''
      }`}
      onClick={() => onServiceClick?.(service)}
    >
      <ServiceCard service={service} onContact={onContactService} />
    </div>
  );

  const ServiceListItem = ({ service }: { service: Service }) => (
    <div
      className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-shadow hover:shadow-lg ${
        onServiceClick ? 'hover:bg-gray-50' : ''
      }`}
      onClick={() => onServiceClick?.(service)}
    >
      <div className="flex items-start space-x-6">
        {/* Image */}
        {service.images && service.images.length > 0 && (
          <div className="flex-shrink-0">
            <img
              src={service.images[0]}
              alt={service.title}
              className="w-32 h-24 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  service.type === 'offer' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {service.type === 'offer' ? 'Offre' : 'Demande'}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {service.category}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                {service.title}
              </h3>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {service.description}
              </p>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <span>📍 {service.location}</span>
                <span>⭐ {service.provider.rating} ({service.provider.reviews} avis)</span>
                <span>📅 {new Date(service.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>

              {/* Tags */}
              {service.tags && service.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {service.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                  {service.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      +{service.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Prix et actions */}
            <div className="flex-shrink-0 text-right">
              <div className="text-2xl font-bold text-gray-900 mb-3">
                {service.price}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onContactService(service);
                }}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  service.type === 'offer'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
              >
                {service.type === 'offer' ? 'Contacter' : 'Proposer'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading && services.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Grid className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucun service trouvé
        </h3>
        <p className="text-gray-500">
          Essayez de modifier vos critères de recherche ou de publier votre propre service.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Liste des services */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCardComponent key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <ServiceListItem key={service.id} service={service} />
          ))}
        </div>
      )}

      {/* Chargement infini */}
      {paginationType === 'infinite' && (
        <>
          {(isLoadingMore || loading) && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
              <span className="text-gray-600">Chargement...</span>
            </div>
          )}
          
          {!hasMore && services.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Vous avez vu tous les services disponibles
              </p>
            </div>
          )}
        </>
      )}

      {/* Pagination classique */}
      {paginationType === 'classic' && totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              Page {currentPage} sur {totalPages}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Précédent
            </button>

            {/* Numéros de page */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange?.(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      pageNum === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}