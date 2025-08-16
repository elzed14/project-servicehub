// Service de notifications push
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export const notificationService = {
  // Demander permission notifications
  requestPermission: async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  // Envoyer notification push
  sendPushNotification: (title: string, options: {
    body: string;
    icon?: string;
    badge?: string;
    tag?: string;
  }) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        badge: options.badge || '/favicon.ico',
        tag: options.tag
      });
    }
  },

  // Notifications prédéfinies
  notifyNewMessage: (senderName: string) => {
    notificationService.sendPushNotification(
      'Nouveau message',
      {
        body: `${senderName} vous a envoyé un message`,
        tag: 'new-message'
      }
    );
  },

  notifyServiceBooked: (serviceTitle: string) => {
    notificationService.sendPushNotification(
      'Service réservé',
      {
        body: `Votre réservation pour "${serviceTitle}" est confirmée`,
        tag: 'booking-confirmed'
      }
    );
  },

  notifyPaymentSuccess: (amount: number) => {
    notificationService.sendPushNotification(
      'Paiement réussi',
      {
        body: `Paiement de ${amount.toLocaleString()} FCFA effectué avec succès`,
        tag: 'payment-success'
      }
    );
  }
};