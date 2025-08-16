import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Ban,
  UserCheck,
  Bell,
  Settings,
  BarChart3,
  Download,
  Upload,
  Shield,
  Globe,
  Mail,
  Star,
  Plus,
  Save,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { AdminStats, AdminUser, AdminService, Category, AdminReport, AdminSettings, AdminNotification } from '../types';
import { useAppContext } from '../context/AppContext';

export default function AdminDashboard() {
  const { state } = useAppContext();
  const { currentUser } = state;
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [services, setServices] = useState<AdminService[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [showNotifications, setShowNotifications] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'services', label: 'Services', icon: FileText },
    { id: 'categories', label: 'Catégories', icon: Filter },
    { id: 'reports', label: 'Signalements', icon: AlertTriangle },
    { id: 'analytics', label: 'Analytiques', icon: BarChart3 },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, usersRes, servicesRes, categoriesRes, reportsRes, settingsRes, notificationsRes] = await Promise.all([
          adminService.getStats(),
          adminService.getUsers({}),
          adminService.getServices({}),
          adminService.getCategories(),
          adminService.getReports(),
          adminService.getSettings(),
          adminService.getNotifications(),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setServices(servicesRes.data);
        setCategories(categoriesRes.data);
        setReports(reportsRes.data);
        setSettings(settingsRes.data);
        setNotifications(notificationsRes.data);
      } catch (err) {
        console.error('Erreur lors du chargement des données admin:', err);
        setError('Erreur lors du chargement des données d\'administration');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const markNotificationAsRead = async (id: string) => {
    try {
      await adminService.markNotificationAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const handleSettingsChange = (key: string, value: any) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const saveSettings = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      // Simuler un délai de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      await adminService.updateSettings(settings);
      
      setSaveMessage({ type: 'success', text: 'Paramètres sauvegardés avec succès !' });
      
      // Effacer le message après 3 secondes
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error("Failed to save settings", error);
      setSaveMessage({ type: 'error', text: 'Erreur lors de la sauvegarde des paramètres.' });
      
      // Effacer le message d'erreur après 5 secondes
      setTimeout(() => setSaveMessage(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  // Vérification des permissions d'administration
  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Accès refusé
          </h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder au panneau d'administration.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Permissions requises :</strong> Administrateur ou Modérateur
            </p>
            <p className="text-sm text-red-600 mt-1">
              <strong>Votre rôle actuel :</strong> {currentUser?.role || 'Utilisateur'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="ml-4 text-gray-600">Chargement des données d'administration...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Utilisateurs totaux</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+{stats?.monthlyGrowth || 0}%</span>
            <span className="text-gray-500 ml-1">ce mois</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Services actifs</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalServices || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {stats?.totalOffers || 0} offres • {stats?.totalRequests || 0} demandes
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Utilisateurs actifs</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activeUsers || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Dernières 24h
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenus</p>
              <p className="text-2xl font-bold text-gray-900">{(stats?.revenue || 0).toLocaleString()}€</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Ce mois
          </div>
        </div>
      </div>

      {/* Pending Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions en attente</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-orange-500" />
              <span className="text-gray-900">{stats?.pendingServices || 0} services en attente de validation</span>
            </div>
            <button className="px-3 py-1 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700">
              Examiner
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="text-gray-900">{reports?.filter(r => r.status === 'pending').length || 0} signalements à traiter</span>
            </div>
            <button className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700">
              Traiter
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="pending">En attente</option>
          <option value="suspended">Suspendu</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : user.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? 'Actif' : user.status === 'pending' ? 'En attente' : 'Suspendu'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.joinDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.totalEarnings.toLocaleString()}€
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <UserCheck className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher un service..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="pending">En attente</option>
          <option value="rejected">Rejeté</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{service.category}</span>
                  <span>{service.price}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    service.type === 'offer' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {service.type === 'offer' ? 'Offre' : 'Demande'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-900">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={service.provider.avatar}
                  alt={service.provider.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-gray-700">{service.provider.name}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{service.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{service.contacts}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <div key={category.id} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-md flex items-center justify-center mr-4 bg-blue-100`}>
                {/* Placeholder for icon */}
              </div>
              <span className="font-medium">{category.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-blue-600 hover:text-blue-900"><Edit className="w-4 h-4" /></button>
              <button className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div>
      <h2 className="text-2xl font-bold">Reports</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reported Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map(report => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.targetId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.targetType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.reporterId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div>
      <h2 className="text-2xl font-bold">Analytics</h2>
      <p className="mt-4 text-gray-500">Analytics dashboard coming soon.</p>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Paramètres de la plateforme</h2>
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500">Dernière sauvegarde: {new Date().toLocaleTimeString('fr-FR')}</span>
        </div>
      </div>
      
      {settings ? (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
          {/* Configuration générale */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Configuration générale</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="platformName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la plateforme
                </label>
                <input 
                  id="platformName"
                  type="text" 
                  value={settings.platformName} 
                  onChange={e => handleSettingsChange('platformName', e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Nom de votre plateforme"
                />
              </div>
              <div>
                <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-700 mb-2">
                  Taux de commission (%)
                </label>
                <input 
                  id="commissionRate"
                  type="number" 
                  min="0" 
                  max="100" 
                  step="0.1"
                  value={settings.commissionRate} 
                  onChange={e => handleSettingsChange('commissionRate', parseFloat(e.target.value) || 0)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="5.0"
                />
              </div>
            </div>
          </div>

          {/* Options de validation */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Options de validation</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <input 
                      id="autoApprove"
                      type="checkbox" 
                      checked={settings.autoApproveServices} 
                      onChange={e => handleSettingsChange('autoApproveServices', e.target.checked)} 
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label htmlFor="autoApprove" className="text-sm font-medium text-gray-900 cursor-pointer">
                      Approbation automatique des services
                    </label>
                    <p className="text-xs text-gray-500">Les nouveaux services seront automatiquement approuvés</p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  settings.autoApproveServices ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <input 
                      id="emailVerification"
                      type="checkbox" 
                      checked={settings.requireEmailVerification} 
                      onChange={e => handleSettingsChange('requireEmailVerification', e.target.checked)} 
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label htmlFor="emailVerification" className="text-sm font-medium text-gray-900 cursor-pointer">
                      Vérification email obligatoire
                    </label>
                    <p className="text-xs text-gray-500">Les utilisateurs doivent vérifier leur email</p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  settings.requireEmailVerification ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              </div>
            </div>
          </div>

          {/* Limites et restrictions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Limites et restrictions</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="maxImages" className="block text-sm font-medium text-gray-700 mb-2">
                  Images max par service
                </label>
                <input 
                  id="maxImages"
                  type="number" 
                  min="1" 
                  max="20"
                  value={settings.maxImagesPerService} 
                  onChange={e => handleSettingsChange('maxImagesPerService', parseInt(e.target.value) || 1)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Prix minimum (€)
                </label>
                <input 
                  id="minPrice"
                  type="number" 
                  min="0"
                  value={settings.minServicePrice} 
                  onChange={e => handleSettingsChange('minServicePrice', parseInt(e.target.value) || 0)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Prix maximum (€)
                </label>
                <input 
                  id="maxPrice"
                  type="number" 
                  min="1"
                  value={settings.maxServicePrice} 
                  onChange={e => handleSettingsChange('maxServicePrice', parseInt(e.target.value) || 1)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Mode maintenance */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Mode maintenance</span>
            </h3>
            <div className={`p-4 rounded-lg border-2 ${
              settings.maintenanceMode 
                ? 'bg-red-50 border-red-200' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input 
                    id="maintenanceMode"
                    type="checkbox" 
                    checked={settings.maintenanceMode} 
                    onChange={e => handleSettingsChange('maintenanceMode', e.target.checked)} 
                    className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                  />
                  <div>
                    <label htmlFor="maintenanceMode" className={`text-sm font-medium cursor-pointer ${
                      settings.maintenanceMode ? 'text-red-900' : 'text-gray-900'
                    }`}>
                      Activer le mode maintenance
                    </label>
                    <p className={`text-xs ${
                      settings.maintenanceMode ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {settings.maintenanceMode 
                        ? '⚠️ La plateforme est actuellement en maintenance' 
                        : 'La plateforme est accessible aux utilisateurs'
                      }
                    </p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full ${
                  settings.maintenanceMode ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                }`} />
              </div>
            </div>
          </div>

          {/* Message de feedback */}
          {saveMessage && (
            <div className={`p-4 rounded-lg flex items-center space-x-3 ${
              saveMessage.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {saveMessage.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="font-medium">{saveMessage.text}</span>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => {
                  // Reset aux valeurs par défaut
                  setSettings({
                    platformName: 'ServiceHub',
                    commissionRate: 5.0,
                    autoApproveServices: false,
                    requireEmailVerification: true,
                    maxImagesPerService: 5,
                    minServicePrice: 10,
                    maxServicePrice: 10000,
                    allowedFileTypes: ['jpg', 'png', 'pdf'],
                    maintenanceMode: false,
                    featuredServicePrice: 50
                  });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Réinitialiser</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => {
                  console.log('Paramètres actuels:', settings);
                  alert('Paramètres affichés dans la console');
                }}
                className="px-4 py-2 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 transition-colors flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Prévisualiser</span>
              </button>
              
              <button 
                onClick={saveSettings}
                disabled={isSaving}
                className={`px-6 py-2 rounded-md transition-colors flex items-center space-x-2 font-medium ${
                  isSaving 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sauvegarde...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Sauvegarder</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des paramètres...</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Admin Header avec informations utilisateur */}
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
                <span className="text-sm opacity-75">
                  Niveau: {currentUser.adminLevel || 'standard'}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-75">Dernière connexion</div>
            <div className="font-medium">
              {new Date(currentUser.lastLogin).toLocaleString('fr-FR')}
            </div>
            <div className="text-sm opacity-75 mt-1">
              Membre depuis {new Date(currentUser.joinDate).toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>
        
        {/* Permissions rapides */}
        <div className="mt-4 flex flex-wrap gap-2">
          {currentUser.permissions?.manageUsers && (
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>Gestion utilisateurs</span>
            </span>
          )}
          {currentUser.permissions?.manageServices && (
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center space-x-1">
              <FileText className="w-3 h-3" />
              <span>Gestion services</span>
            </span>
          )}
          {currentUser.permissions?.viewAnalytics && (
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center space-x-1">
              <BarChart3 className="w-3 h-3" />
              <span>Analytiques</span>
            </span>
          )}
          {currentUser.permissions?.systemSettings && (
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center space-x-1">
              <Settings className="w-3 h-3" />
              <span>Paramètres système</span>
            </span>
          )}
        </div>
      </div>

      {/* Navigation Tabs avec permissions */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            
            // Vérifier les permissions pour chaque onglet
            const hasPermission = (
              tab.id === 'overview' ||
              (tab.id === 'users' && currentUser.permissions?.manageUsers) ||
              (tab.id === 'services' && currentUser.permissions?.manageServices) ||
              (tab.id === 'categories' && currentUser.permissions?.manageServices) ||
              (tab.id === 'reports' && currentUser.permissions?.moderateContent) ||
              (tab.id === 'analytics' && currentUser.permissions?.viewAnalytics) ||
              (tab.id === 'settings' && currentUser.permissions?.systemSettings)
            );
            
            if (!hasPermission) return null;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'services' && renderServices()}
        {activeTab === 'categories' && renderCategories()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
}
