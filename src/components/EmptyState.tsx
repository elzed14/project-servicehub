import React from 'react';
import { Search, Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: 'search' | 'plus';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon = 'search'
}) => {
  const Icon = icon === 'search' ? Search : Plus;

  return (
    <div className="text-center py-12">
      <Icon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {action && (
        <div className="mt-6">
          <button
            onClick={action.onClick}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;