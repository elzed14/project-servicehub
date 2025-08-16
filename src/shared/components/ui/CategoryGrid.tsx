import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  serviceCount: number;
  trending?: boolean;
}

interface CategoryGridProps {
  categories: Category[];
  onCategoryClick?: (category: Category) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ 
  categories, 
  onCategoryClick 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4, scale: 1.02 }}
          onClick={() => onCategoryClick?.(category)}
          className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100 group relative overflow-hidden"
        >
          {/* Badge trending */}
          {category.trending && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              🔥 Tendance
            </div>
          )}

          {/* Icône */}
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
            {category.icon}
          </div>

          {/* Contenu */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {category.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {category.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {category.serviceCount.toLocaleString()} services
            </span>
            
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>

          {/* Effet hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
        </motion.div>
      ))}
    </div>
  );
};