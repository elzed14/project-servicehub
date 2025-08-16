import React, { useState } from 'react';
import { User, Mail, Loader2, UserPlus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface QuickAuthProps {
  onSuccess: (user: any) => void;
  onError: (error: string) => void;
}

const DEMO_USERS = [
  {
    id: 'admin-001',
    name: 'Alexandre Dubois',
    email: 'admin@servicehub.com',
    location: 'Paris, France',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150',
    rating: 5.0,
    reviews: 156,
    bio: 'Administrateur principal ServiceHub - Gestionnaire de plateforme',
    role: 'admin',
    permissions: {
      manageUsers: true,
      manageServices: true,
      viewAnalytics: true,
      moderateContent: true,
      systemSettings: true,
      financialReports: true,
      supportTickets: true
    },
    adminLevel: 'super_admin',
    joinDate: '2023-01-15',
    lastLogin: new Date().toISOString(),
    isVerified: true,
    badge: 'Administrateur',
    department: 'Direction Technique',
    phone: '+33 1 23 45 67 89',
    address: '123 Avenue des Champs-Élysées, 75008 Paris'
  },
  {
    id: '1',
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    location: 'Paris, France',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
    rating: 4.8,
    reviews: 24,
    bio: 'Développeuse web passionnée',
    role: 'user',
    permissions: {},
    adminLevel: null,
    joinDate: '2024-03-10',
    lastLogin: new Date().toISOString(),
    isVerified: true,
    badge: 'Développeur Expert'
  },
  {
    id: '2',
    name: 'Jean Martin',
    email: 'jean.martin@email.com',
    location: 'Lyon, France',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150',
    rating: 4.9,
    reviews: 18,
    bio: 'Designer graphique créatif',
    role: 'user',
    permissions: {},
    adminLevel: null,
    joinDate: '2024-02-20',
    lastLogin: new Date().toISOString(),
    isVerified: true,
    badge: 'Designer Pro'
  },
  {
    id: '3',
    name: 'Sophie Laurent',
    email: 'sophie.laurent@email.com',
    location: 'Marseille, France',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=150',
    rating: 4.7,
    reviews: 32,
    bio: 'Consultante en marketing',
    role: 'moderator',
    permissions: {
      moderateContent: true,
      manageServices: true,
      supportTickets: true
    },
    adminLevel: 'moderator',
    joinDate: '2024-01-05',
    lastLogin: new Date().toISOString(),
    isVerified: true,
    badge: 'Modérateur'
  }
];

export default function QuickAuth({ onSuccess, onError }: QuickAuthProps) {
  const { authenticateUser } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  const handleDemoLogin = async (user: any) => {
    setIsLoading(true);
    try {
      // Simuler une connexion
      await new Promise(resolve => setTimeout(resolve, 500));
      authenticateUser(user);
      onSuccess(user);
    } catch (error) {
      onError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSignup = async () => {
    if (!customName.trim() || !customEmail.trim()) {
      onError('Nom et email requis');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customEmail)) {
      onError('Format d\'email invalide');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUser = {
        id: Date.now().toString(),
        name: customName,
        email: customEmail,
        location: 'France',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(customName)}&background=3B82F6&color=fff`,
        rating: 5.0,
        reviews: 0,
        bio: 'Nouveau membre ServiceHub'
      };

      authenticateUser(newUser);
      onSuccess(newUser);
    } catch (error) {
      onError('Erreur lors de la création du compte');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Accès rapide</h2>
        <p className="mt-2 text-gray-600">
          Connectez-vous ou créez un compte instantanément
        </p>
      </div>

      {/* Comptes de démonstration */}
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Comptes de démonstration</h3>
        {DEMO_USERS.map((user) => (
          <button
            key={user.id}
            onClick={() => handleDemoLogin(user)}
            disabled={isLoading}
            className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left disabled:opacity-50"
          >
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{user.name}</h4>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500">{user.location}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-yellow-600">★ {user.rating}</div>
                <div className="text-xs text-gray-500">{user.reviews} avis</div>
                {user.role === 'admin' && (
                  <div className="text-xs font-medium text-red-600 mt-1">👑 ADMIN</div>
                )}
                {user.role === 'moderator' && (
                  <div className="text-xs font-medium text-blue-600 mt-1">🛡️ MOD</div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Séparateur */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">ou</span>
        </div>
      </div>

      {/* Création rapide de compte */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Créer un nouveau compte</h3>
        
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Votre nom"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="votre@email.com"
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          onClick={handleQuickSignup}
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Création...
            </>
          ) : (
            <>
              <UserPlus className="-ml-1 mr-2 h-4 w-4" />
              Créer mon compte
            </>
          )}
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Mode démonstration - Aucun mot de passe requis
        </p>
      </div>
    </div>
  );
}