import React from 'react';
import { Service } from '../../../types';
import ServiceCard from './ServiceCard';
import { SkeletonCard } from '../../../shared/components/ui';

interface ServiceGridProps {
  services: Service[];
  loading?: boolean;
  onContact: (service: Service) => void;
  onView?: (service: Service) => void;
  emptyMessage?: string;
}

const ServiceGrid: React.FC<ServiceGridProps> = ({
  services,
  loading = false,
  onContact,
  onView,
  emptyMessage = 'Aucun service trouvé'
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-500">
          Essayez de modifier vos critères de recherche ou explorez d'autres catégories.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onContact={onContact}
          onView={onView}
        />
      ))}
    </div>
  );
};

export default ServiceGrid;