import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Shield } from 'lucide-react';

interface Expert {
  id: string;
  name: string;
  avatar: string;
  profession: string;
  rating: number;
  reviewCount: number;
  location: string;
  responseTime: string;
  verified: boolean;
  price: string;
  services: string[];
}

interface ExpertCardProps {
  expert: Expert;
  onClick?: (expert: Expert) => void;
}

export const ExpertCard: React.FC<ExpertCardProps> = ({ expert, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -4, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick?.(expert)}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden"
    >
      {/* En-tête avec avatar */}
      <div className="p-6 pb-4">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <img
              src={expert.avatar}
              alt={expert.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
            />
            {expert.verified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                <Shield className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {expert.name}
            </h3>
            <p className="text-gray-600 text-sm">{expert.profession}</p>
            
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm font-medium">{expert.rating}</span>
                <span className="ml-1 text-sm text-gray-500">({expert.reviewCount})</span>
              </div>
              
              <div className="flex items-center text-gray-500">
                <MapPin className="w-4 h-4" />
                <span className="ml-1 text-sm">{expert.location}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">{expert.price}</div>
            <div className="text-xs text-gray-500">à partir de</div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-2">
          {expert.services.slice(0, 3).map((service, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
            >
              {service}
            </span>
          ))}
          {expert.services.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{expert.services.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="ml-1 text-sm">Répond en {expert.responseTime}</span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Action contact
            }}
          >
            Contacter
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};