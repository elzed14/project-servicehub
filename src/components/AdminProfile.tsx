import React from 'react';
import { Shield, User, Mail, MapPin, Phone, Calendar, Badge, Building, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function AdminProfile() {
  const { state } = useAppContext();
  const { currentUser } = state;

  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }

  const adminFeatures = [
    { name: 'Gestion des utilisateurs', enabled: currentUser.permissions?.manageUsers },
    { name: 'Gestion des services', enabled: currentUser.permissions?.manageServices },
    { name: 'Analytiques avancées', enabled: currentUser.permissions?.viewAnalytics },
    { name: 'Modération de contenu', enabled: currentUser.permissions?.moderateContent },
    { name: 'Paramètres système', enabled: currentUser.permissions?.systemSettings },
    { name: 'Rapports financiers', enabled: currentUser.permissions?.financialReports },
    { name: 'Support client', enabled: currentUser.permissions?.supportTickets }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header Admin */}
      <div className="flex items-center space-x-6 mb-8">
        <div className="relative">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
          />
          <div className="absolute -bottom-2 -right-2 bg-red-500 text-white rounded-full p-2">
            <Shield className="w-4 h-4" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{currentUser.name}</h1>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              🔑 ADMINISTRATEUR
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <Mail className="w-4 h-4" />
              <span>{currentUser.email}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{currentUser.location}</span>
            </div>
            {currentUser.isVerified && (
              <div className="flex items-center space-x-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Vérifié</span>
              </div>
            )}
          </div>
          
          <p className="text-gray-700">{currentUser.bio}</p>
        </div>
      </div>

      {/* Informations détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Informations personnelles</span>
          </h3>
          
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between">
              <span className="text-gray-600">Niveau d'administration:</span>
              <span className="font-medium text-red-600">{currentUser.adminLevel}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Département:</span>
              <span className="font-medium">{currentUser.department}</span>
            </div>
            
            {currentUser.phone && (
              <div className="flex justify-between">
                <span className="text-gray-600">Téléphone:</span>
                <span className="font-medium">{currentUser.phone}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-600">Membre depuis:</span>
              <span className="font-medium">
                {new Date(currentUser.joinDate!).toLocaleDateString('fr-FR')}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Dernière connexion:</span>
              <span className="font-medium">
                {new Date(currentUser.lastLogin!).toLocaleString('fr-FR')}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Permissions administrateur</span>
          </h3>
          
          <div className="space-y-2">
            {adminFeatures.map((feature, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  feature.enabled ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <span className={`text-sm ${feature.enabled ? 'text-green-800' : 'text-gray-600'}`}>
                  {feature.name}
                </span>
                <div className={`w-3 h-3 rounded-full ${
                  feature.enabled ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistiques admin */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques d'activité</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{currentUser.rating}</div>
            <div className="text-sm text-blue-800">Note moyenne</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{currentUser.reviews}</div>
            <div className="text-sm text-green-800">Évaluations</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">100%</div>
            <div className="text-sm text-purple-800">Disponibilité</div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">24/7</div>
            <div className="text-sm text-orange-800">Support</div>
          </div>
        </div>
      </div>

      {/* Badge et certifications */}
      {currentUser.badge && (
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Badge className="w-5 h-5" />
            <span>Badges et certifications</span>
          </h3>
          
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-medium">
              🏆 {currentUser.badge}
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full font-medium">
              🛡️ Administrateur Certifié
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-full font-medium">
              ✅ Compte Vérifié
            </div>
          </div>
        </div>
      )}
    </div>
  );
}