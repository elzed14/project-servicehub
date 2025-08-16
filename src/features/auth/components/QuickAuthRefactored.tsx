import React, { useState } from 'react';
import { User, Mail, UserPlus } from 'lucide-react';
import { Button, Input, Card } from '../../../shared/components/ui';
import { useAppContext } from '../../../context/AppContext';

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
    bio: 'Administrateur principal ServiceHub',
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
    badge: 'Administrateur'
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
    role: 'user'
  }
];

const QuickAuthRefactored: React.FC<QuickAuthProps> = ({ onSuccess, onError }) => {
  const { authenticateUser } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  const handleDemoLogin = async (user: any) => {
    setIsLoading(true);
    try {
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
        bio: 'Nouveau membre ServiceHub',
        role: 'user'
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
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Accès rapide</h2>
        <p className="mt-2 text-gray-600">
          Connectez-vous ou créez un compte instantanément
        </p>
      </div>

      {/* Comptes de démonstration */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Comptes de démonstration</h3>
        <div className="space-y-3">
          {DEMO_USERS.map((user) => (
            <Button
              key={user.id}
              variant="ghost"
              onClick={() => handleDemoLogin(user)}
              disabled={isLoading}
              className="w-full p-4 h-auto justify-start"
            >
              <div className="flex items-center space-x-3 w-full">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-gray-900">{user.name}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">{user.location}</p>
                    {user.role === 'admin' && (
                      <span className="text-xs font-medium text-red-600">👑 ADMIN</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-yellow-600">★ {user.rating}</div>
                  <div className="text-xs text-gray-500">{user.reviews} avis</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Création rapide de compte */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Créer un nouveau compte</h3>
        <div className="space-y-4">
          <Input
            label="Nom complet"
            icon={<User className="h-5 w-5 text-gray-400" />}
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Votre nom"
            disabled={isLoading}
          />
          
          <Input
            label="Email"
            type="email"
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            value={customEmail}
            onChange={(e) => setCustomEmail(e.target.value)}
            placeholder="votre@email.com"
            disabled={isLoading}
          />

          <Button
            onClick={handleQuickSignup}
            loading={isLoading}
            icon={<UserPlus className="w-4 h-4" />}
            className="w-full"
            variant="primary"
          >
            Créer mon compte
          </Button>
        </div>
      </Card>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Mode démonstration - Aucun mot de passe requis
        </p>
      </div>
    </div>
  );
};

export default QuickAuthRefactored;