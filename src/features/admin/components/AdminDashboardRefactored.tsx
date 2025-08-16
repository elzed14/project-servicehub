import React, { useState, useEffect } from 'react';
import { Shield, Users, FileText, Settings, BarChart3, AlertTriangle, Filter } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import { adminService } from '../../../services/adminService';
import { AdminStats, UserManagement } from './index';
import { Card } from '../../../shared/components/ui';

const AdminDashboardRefactored: React.FC = () => {
  const { state } = useAppContext();
  const { currentUser } = state;
  
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Vérification des permissions
  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
    return (
      <div className="text-center py-12">
        <Card className="max-w-md mx-auto">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h2>
          <p className="text-gray-600">
            Vous n'avez pas les permissions nécessaires pour accéder au panneau d'administration.
          </p>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, usersRes] = await Promise.all([
          adminService.getStats(),
          adminService.getUsers({})
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'services', label: 'Services', icon: FileText },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ].filter(tab => {
    // Filtrer selon les permissions
    if (tab.id === 'users' && !currentUser.permissions?.manageUsers) return false;
    if (tab.id === 'services' && !currentUser.permissions?.manageServices) return false;
    if (tab.id === 'settings' && !currentUser.permissions?.systemSettings) return false;
    return true;
  });

  const handleUserAction = (userId: string, action: string) => {
    console.log(`Action ${action} sur utilisateur ${userId}`);
    // Implémenter les actions utilisateur
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return stats ? <AdminStats stats={stats} /> : <div>Chargement...</div>;
      
      case 'users':
        return (
          <UserManagement 
            users={users} 
            onUserAction={handleUserAction}
          />
        );
      
      case 'services':
        return (
          <Card>
            <h2 className="text-2xl font-bold mb-4">Gestion des services</h2>
            <p className="text-gray-600">Module en cours de développement...</p>
          </Card>
        );
      
      case 'settings':
        return (
          <Card>
            <h2 className="text-2xl font-bold mb-4">Paramètres système</h2>
            <p className="text-gray-600">Module en cours de développement...</p>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Admin */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full border-4 border-white/20"
            />
            <div>
              <h1 className="text-3xl font-bold">Panneau d'administration</h1>
              <div className="flex items-center space-x-4 mt-2">
                <span className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>{currentUser.name}</span>
                </span>
                <span className="px-2 py-1 bg-white/20 rounded-full text-sm">
                  {currentUser.role === 'admin' ? '👑 Super Admin' : '🛡️ Modérateur'}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-75">Dernière connexion</div>
            <div className="font-medium">
              {new Date(currentUser.lastLogin).toLocaleString('fr-FR')}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Card padding="none">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </Card>

      {/* Contenu des onglets */}
      <div>
        {loading ? (
          <Card>
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement...</p>
            </div>
          </Card>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
};

export default AdminDashboardRefactored;