import React, { Suspense, lazy } from 'react';
import { Skeleton } from '../components/ui';

// Lazy loading des composants
export const LazyComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) => {
  const Component = lazy(importFunc);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback || <Skeleton className="h-32" />}>
      <Component {...props} />
    </Suspense>
  );
};

// Composants lazy
export const LazyAdminDashboard = LazyComponent(
  () => import('../../components/AdminDashboard')
);

export const LazyMessagingSystem = LazyComponent(
  () => import('../../components/MessagingSystem')
);

export const LazyPaymentPage = LazyComponent(
  () => import('../../features/payment/PaymentPage')
);

export const LazyFeaturesPage = LazyComponent(
  () => import('../../pages/FeaturesPage/FeaturesPage')
);