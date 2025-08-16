import React from 'react';
import Notification from './Notification';

interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationContainerProps {
  notifications: NotificationData[];
  onClose: (id: string) => void;
}

export default function NotificationContainer({ notifications, onClose }: NotificationContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={() => onClose(notification.id)}
        />
      ))}
    </div>
  );
}