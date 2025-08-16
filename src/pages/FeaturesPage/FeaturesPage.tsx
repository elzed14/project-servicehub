import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  MapPin, 
  Bell, 
  CreditCard,
  Navigation,
  CheckCircle 
} from 'lucide-react';
import { 
  Card, 
  Button, 
  MobilePayment, 
  LocationMap 
} from '../../shared/components/ui';
import { PaymentPage } from '../../features/payment/PaymentPage';
import { notificationService } from '../../shared/services/notifications';
import { LocationService } from '../../shared/services/geolocation';

export const FeaturesPage: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<string>('default');

  // Services de démonstration
  const demoServices: LocationService[] = [
    {
      id: '1',
      title: 'Réparation smartphone',
      description: 'Service de réparation rapide',
      location: { latitude: 14.6928, longitude: -17.4467 },
      address: 'Dakar, Sénégal'
    },
    {
      id: '2', 
      title: 'Livraison express',
      description: 'Livraison en moins de 2h',
      location: { latitude: 14.7167, longitude: -17.4677 },
      address: 'Plateau, Dakar'
    }
  ];

  const demoService = {
    id: 'demo-1',
    title: 'Service de démonstration',
    price: 15000,
    provider: 'ServiceHub Demo'
  };

  useEffect(() => {
    setNotificationPermission(Notification.permission);
  }, []);

  const handleNotificationDemo = async () => {
    const granted = await notificationService.requestPermission();
    setNotificationPermission(Notification.permission);
    
    if (granted) {
      notificationService.notifyNewMessage('Utilisateur Demo');
      setTimeout(() => {
        notificationService.notifyServiceBooked('Service de test');
      }, 2000);
    }
  };

  const renderDemo = () => {
    switch (activeDemo) {
      case 'payment':
        return (
          <PaymentPage
            service={demoService}
            onBack={() => setActiveDemo(null)}
            onSuccess={() => setActiveDemo(null)}
          />
        );
      
      case 'location':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="mb-4">
              <Button
                variant="outline"
                onClick={() => setActiveDemo(null)}
              >
                ← Retour aux fonctionnalités
              </Button>
            </div>
            <LocationMap
              services={demoServices}
              onServiceSelect={(service) => {
                alert(`Service sélectionné: ${service.title}`);
              }}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  if (activeDemo) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        {renderDemo()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Fonctionnalités Avancées
          </h1>
          <p className="text-xl text-gray-600">
            Phase 4 : Paiements mobiles, géolocalisation et notifications
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Paiement Mobile */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Paiement Mobile</h3>
              <p className="text-gray-600 mb-4">
                Orange Money, MTN Mobile Money, Moov Money
              </p>
              <div className="space-y-2 text-sm text-gray-500 mb-6">
                <div className="flex items-center justify-center">
                  <span className="text-lg mr-2">🟠</span>
                  Orange Money
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-lg mr-2">🟡</span>
                  MTN Mobile Money
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-lg mr-2">🔵</span>
                  Moov Money
                </div>
              </div>
              <Button
                onClick={() => setActiveDemo('payment')}
                className="w-full"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Tester le paiement
              </Button>
            </div>
          </Card>

          {/* Géolocalisation */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Géolocalisation</h3>
              <p className="text-gray-600 mb-4">
                Services à proximité avec calcul de distance
              </p>
              <div className="space-y-2 text-sm text-gray-500 mb-6">
                <div>📍 Position automatique</div>
                <div>📏 Calcul de distance</div>
                <div>🗺️ Tri par proximité</div>
              </div>
              <Button
                onClick={() => setActiveDemo('location')}
                className="w-full"
                variant="outline"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Voir la carte
              </Button>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Notifications Push</h3>
              <p className="text-gray-600 mb-4">
                Notifications en temps réel pour les messages et réservations
              </p>
              <div className="space-y-2 text-sm text-gray-500 mb-6">
                <div className="flex items-center justify-center">
                  {notificationPermission === 'granted' ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      Autorisées
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4 text-gray-400 mr-1" />
                      Non autorisées
                    </>
                  )}
                </div>
                <div>💬 Nouveaux messages</div>
                <div>✅ Confirmations</div>
                <div>💳 Paiements</div>
              </div>
              <Button
                onClick={handleNotificationDemo}
                className="w-full"
                variant={notificationPermission === 'granted' ? 'outline' : 'default'}
              >
                <Bell className="w-4 h-4 mr-2" />
                {notificationPermission === 'granted' ? 'Tester' : 'Activer'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Statistiques */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            📊 Fonctionnalités Phase 4
          </h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600">3</div>
              <div className="text-gray-600">Opérateurs mobiles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">GPS</div>
              <div className="text-gray-600">Géolocalisation</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">Push</div>
              <div className="text-gray-600">Notifications</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">FCFA</div>
              <div className="text-gray-600">Monnaie locale</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};