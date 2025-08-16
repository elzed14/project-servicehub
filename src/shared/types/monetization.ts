// Types pour la monétisation
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: {
    projects: number;
    contacts: number;
    priority: boolean;
  };
}

export interface Commission {
  id: string;
  serviceId: string;
  amount: number;
  rate: number; // Pourcentage de commission
  status: 'pending' | 'paid' | 'cancelled';
  expertId: string;
  clientId: string;
}

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  position: 'banner' | 'sidebar' | 'inline';
  price: number;
  impressions: number;
  clicks: number;
}

export interface PremiumListing {
  id: string;
  expertId: string;
  duration: number; // en jours
  price: number;
  position: number;
  active: boolean;
}