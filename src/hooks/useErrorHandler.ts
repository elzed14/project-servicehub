import { useCallback } from 'react';
import { useNotifications } from './useNotifications';

export const useErrorHandler = () => {
  const { error } = useNotifications();

  const handleError = useCallback((err: any, defaultMessage = 'Une erreur est survenue') => {
    const message = err?.response?.data?.message || err?.message || defaultMessage;
    error(message);
    console.error('Error:', err);
  }, [error]);

  return { handleError };
};