import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  showHome = true,
  className = ''
}) => {
  const allItems = showHome 
    ? [{ label: 'Accueil', href: '/', icon: Home }, ...items]
    : items;

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      {allItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0" />
          )}
          
          {item.current || index === allItems.length - 1 ? (
            <span className="text-gray-900 font-medium" aria-current="page">
              {item.label}
            </span>
          ) : (
            <button
              onClick={item.onClick}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              {index === 0 && showHome ? (
                <div className="flex items-center space-x-1">
                  <Home className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
              ) : (
                item.label
              )}
            </button>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;