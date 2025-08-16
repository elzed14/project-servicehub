import React, { useState, useEffect } from 'react';
import { User, Edit, Star, MapPin, Calendar, FileText, MessageCircle, Settings, Shield } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { serviceService } from '../services/serviceService';
import { Service } from '../types';
import ServiceCard from './ServiceCard';
import AdminProfile from './AdminProfile';

export default function ProfilePage() {
  const { state } = useAppContext();
  const { currentUser } = state;
  const [activeTab, setActiveTab] = useState('services');
  const [userServices, setUserServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserServices = async () => {
      if (currentUser) {
        setLoading(true);
        try {
          // Simuler la récupération des services de l'utilisateur
          const response = await serviceService.getServices({});
          // Filtrer les services de l'utilisateur connecté
          const filteredServices = response.data.filter(
            service => service.provider.name === currentUser.name
          );
          setUserServices(filteredServices);
        } catch (error) {
          console.error('Failed to fetch user services', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserServices();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Vous devez être connecté pour voir votre profil.</p>
      </div>
    );
  }

  const tabs = [
    ...(currentUser.role === 'admin' ? [{ id: 'admin', label: 'Profil Admin', icon: Shield }] : []),
    { id: 'services', label: 'Mes services', icon: FileText },
    { id: 'reviews', label: 'Avis reçus', icon: Star },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const renderServices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Mes services ({userServices.length})
        </h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Ajouter un service
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Chargement de vos services...</p>
        </div>
      ) : userServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onContact={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun service publié
          </h3>
          <p className="text-gray-500 mb-4">
            Commencez par publier votre premier service pour attirer des clients.
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Publier un service
          </button>
        </div>
      )}
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Avis reçus ({currentUser.reviews})
      </h3>
      
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucun avis pour le moment
        </h3>
        <p className="text-gray-500">
          Les avis de vos clients apparaîtront ici une fois que vous aurez terminé vos premiers services.
        </p>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Paramètres du profil</h3>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet
            </label>
            <input
              type="text"
              value={currentUser.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={currentUser.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localisation
            </label>
            <input
              type="text"
              value={currentUser.location}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              rows={4}
              value={currentUser.bio || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Parlez-nous de vous..."
              readOnly
            />
          </div>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Modifier le profil
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-6">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentUser.name}</h1>
            <div className="flex items-center space-x-4 text-gray-600 mb-3">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{currentUser.location}</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                <span>{currentUser.rating} ({currentUser.reviews} avis)</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Membre depuis 2024</span>
              </div>
            </div>
            {currentUser.bio && (
              <p className="text-gray-600">{currentUser.bio}</p>
            )}
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Edit className="w-4 h-4" />
            <span>Modifier</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{userServices.length}</div>
          <div className="text-gray-600">Services publiés</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{currentUser.rating}</div>
          <div className="text-gray-600">Note moyenne</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{currentUser.reviews}</div>
          <div className="text-gray-600">Avis reçus</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'admin' && <AdminProfile />}
          {activeTab === 'services' && renderServices()}
          {activeTab === 'reviews' && renderReviews()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>
    </div>
  );
}