// Service de géolocalisation
export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface LocationService {
  id: string;
  title: string;
  description: string;
  location: Location;
  distance?: number;
  address?: string;
}

export const geolocationService = {
  // Obtenir position actuelle
  getCurrentPosition: (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Géolocalisation non supportée'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(new Error('Impossible d\'obtenir la position'));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  },

  // Calculer distance entre deux points
  calculateDistance: (pos1: Location, pos2: Location): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (pos2.latitude - pos1.latitude) * Math.PI / 180;
    const dLon = (pos2.longitude - pos1.longitude) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(pos1.latitude * Math.PI / 180) * Math.cos(pos2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  // Trier services par proximité
  sortByDistance: async (services: LocationService[], userLocation?: Location): Promise<LocationService[]> => {
    if (!userLocation) {
      try {
        userLocation = await geolocationService.getCurrentPosition();
      } catch {
        return services;
      }
    }

    return services
      .map(service => ({
        ...service,
        distance: geolocationService.calculateDistance(userLocation!, service.location)
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  },

  // Formater distance
  formatDistance: (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  }
};