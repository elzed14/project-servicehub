import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import Button from './Button';
import { geolocationService, Location, LocationService } from '../../services/geolocation';

interface LocationMapProps {
  services: LocationService[];
  onServiceSelect?: (service: LocationService) => void;
}

export const LocationMap: React.FC<LocationMapProps> = ({
  services,
  onServiceSelect
}) => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [sortedServices, setSortedServices] = useState<LocationService[]>(services);
  const [isLoading, setIsLoading] = useState(false);

  const getUserLocation = async () => {
    setIsLoading(true);
    try {
      const location = await geolocationService.getCurrentPosition();
      setUserLocation(location);
      
      const sorted = await geolocationService.sortByDistance(services, location);
      setSortedServices(sorted);
    } catch (error) {
      console.error('Erreur géolocalisation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setSortedServices(services);
  }, [services]);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-500" />
            Services à proximité
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={getUserLocation}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            Localiser
          </Button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {sortedServices.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Aucun service trouvé</p>
          </div>
        ) : (
          <div className="divide-y">
            {sortedServices.map((service) => (
              <div
                key={service.id}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onServiceSelect?.(service)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {service.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {service.description}
                    </p>
                    {service.address && (
                      <p className="text-xs text-gray-500 mt-1">
                        📍 {service.address}
                      </p>
                    )}
                  </div>
                  
                  {service.distance !== undefined && (
                    <div className="ml-4 text-right">
                      <div className="text-sm font-medium text-blue-600">
                        {geolocationService.formatDistance(service.distance)}
                      </div>
                      <div className="text-xs text-gray-500">
                        à proximité
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {userLocation && (
        <div className="p-3 bg-green-50 border-t text-sm text-green-700">
          ✅ Position détectée : {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
        </div>
      )}
    </div>
  );
};