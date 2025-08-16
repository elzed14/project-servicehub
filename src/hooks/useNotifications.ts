import { useState, useCallback } from 'react';

interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const addNotification = useCallback((notification: Omit<NotificationData, 'id'>) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const success = useCallback((message: string, title = 'Succès') => {
    return addNotification({ type: 'success', title, message });
  }, [addNotification]);

  const error = useCallback((message: string, title = 'Erreur') => {
    return addNotification({ type: 'error', title, message });
  }, [addNotification]);

  const warning = useCallback((message: string, title = 'Attention') => {
    return addNotification({ type: 'warning', title, message });
  }, [addNotification]);

  const info = useCallback((message: string, title = 'Information') => {
    return addNotification({ type: 'info', title, message });
  }, [addNotification]);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
    clearAll
  };
};