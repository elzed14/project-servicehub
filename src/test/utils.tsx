import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ErrorBoundary } from '../shared/components/ui';

// Wrapper de test avec providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};

// Fonction de rendu personnalisée
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: TestWrapper, ...options });

// Utilitaires de test
export const createMockService = (overrides = {}) => ({
  id: '1',
  title: 'Service Test',
  description: 'Description test',
  price: 10000,
  category: 'test',
  provider: 'Test Provider',
  ...overrides
});

export const createMockUser = (overrides = {}) => ({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  ...overrides
});

// Re-export tout de testing-library
export * from '@testing-library/react';
export { customRender as render };