import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width = 'w-full',
  height = 'h-4',
  rounded = false
}) => {
  return (
    <div className={`
      animate-pulse bg-gray-200
      ${width} ${height}
      ${rounded ? 'rounded-full' : 'rounded'}
      ${className}
    `} />
  );
};

// Composants pré-configurés
export const SkeletonCard: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
    <Skeleton height="h-6" width="w-3/4" />
    <Skeleton height="h-4" width="w-full" />
    <Skeleton height="h-4" width="w-2/3" />
    <div className="flex space-x-2">
      <Skeleton height="h-8" width="w-16" rounded />
      <Skeleton height="h-8" width="w-16" rounded />
    </div>
  </div>
);

export const SkeletonAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  return <Skeleton className={sizes[size]} rounded />;
};

export default Skeleton;