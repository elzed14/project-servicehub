import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  Star, 
  DollarSign, 
  Package, 
  MessageCircle, 
  Heart,
  Clock,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Calendar,
  Award,
  Shield
} from 'lucide-react';
import { Service, OrderDetails, UserDashboard as UserDashboardType, User as UserType } from '../types';

interface UserDashboardProps {
  user: UserType;
  userType: 'provider' | 'client';
}

export default function UserDashboard({ user, userType }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState<UserDashboardType | null>(null);
  const [userServices, setUserServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - à remplacer par des appels API
  const mockDashboardData: UserDashboardType = {
    activeOrders: [
      {
        id: '1',
        serviceId: 'service1',
        buyerId: 'buyer1',
        sellerId: user.id,
        status: 'in_progress',
        amount: 50000,
        selectedOptions: { express: true },
        requirements: 'Site web responsive avec 5 pages',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-16')
      }
    ],
    completedOrders: [
      {
        id: '2',
        serviceId: 'service2',
        buyerId: 'buyer2',
        sellerId: user.id,
        status: 'completed',
        amount: 75000,
        selectedOptions: {},
        requirements: 'Logo et identité visuelle',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-14')
      }
    ],
    earnings: {
      total: 125000,
      thisMonth: 50000,
      pending: 25000
    },
    statistics: {
      totalServices: 8,
      totalSales: 15,
      averageRating: 4.8,
      responseTime: '2h'
    }
  };

  const mockServices: Service[] = [
    {
      id: '1',
      title: 'Développement site web React',
      description: 'Création de sites web modernes avec React et TypeScript',
      category: 'Développement',
      price: 50000,
      location: 'Paris, France',
      provider: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        rating: user.rating,
        reviews: user.reviews
      },
      images: ['/api/placeholder/300/200'],
      tags: ['React', 'TypeScript', 'Responsive'],
      deliveryTime: '5-7 jours',
      createdAt: new Date('2024-01-01'),
      type: 'offer'
    }
  ];

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setDashboardData(mockDashboardData);
      setUserServices(mockServices);
      setLoading(false);
    }, 1000);
  }, []);

  const tabs = userType === 'provider' ? [
    { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
    { id: 'services', label: 'Mes services', icon: Package },
    { id: 'orders', label: 'Commandes', icon: MessageCircle },
    { id: 'earnings', label: 'Revenus', icon: DollarSign },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ] : [
    { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
    { id: 'orders', label: 'Mes commandes', icon: Package },
    { id: 'favorites', label: 'Favoris', icon: Heart },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% ce mois
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const OrderCard = ({ order, type }: { order: OrderDetails; type: 'active' | 'completed' }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">Commande #{order.id}</h4>
          <p className="text-sm text-gray-600 mt-1">{order.requirements}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          order.status === 'completed' ? 'bg-green-100 text-green-800' :
          order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {order.status === 'completed' ? 'Terminé' :
           order.status === 'in_progress' ? 'En cours' :
           order.status === 'pending' ? 'En attente' : 'Annulé'}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {order.createdAt.toLocaleDateString('fr-FR')}
          </span>
          <span className="font-medium text-green-600">
            {order.amount.toLocaleString()} FCFA
          </span>
        </div>
        <button className="text-blue-600 hover:text-blue-700 font-medium">
          Voir détails
        </button>
      </div>
    </div>
  );

  const ServiceCard = ({ service }: { service: Service }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        {service.images && service.images[0] && (
          <img
            src={service.images[0]}
            alt={service.title}
            className="w-16 h-16 object-cover rounded-lg"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 truncate">{service.title}</h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{service.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  245 vues
                </span>
                <span className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  12 contacts
                </span>
                <span className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                  4.8 (15 avis)
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <span className="font-bold text-green-600">
                {typeof service.price === 'number' 
                  ? service.price.toLocaleString() 
                  : service.price} FCFA
              </span>
              <div className="flex space-x-1">
                <button className="p-1 text-gray-400 hover:text-blue-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span>{user.rating} ({user.reviews} avis)</span>
              </div>
              {user.isVerified && (
                <div className="flex items-center text-green-600">
                  <Shield className="w-4 h-4 mr-1" />
                  <span>Vérifié</span>
                </div>
              )}
              {user.badge && (
                <div className="flex items-center text-yellow-600">
                  <Award className="w-4 h-4 mr-1" />
                  <span>{user.badge}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu */}
      <div className="space-y-8">
        {/* Vue d'ensemble */}
        {activeTab === 'overview' && dashboardData && (
          <div className="space-y-6">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userType === 'provider' ? (
                <>
                  <StatCard
                    title="Revenus totaux"
                    value={`${dashboardData.earnings.total.toLocaleString()} FCFA`}
                    icon={DollarSign}
                    color="bg-green-500"
                    change={12}
                  />
                  <StatCard
                    title="Services actifs"
                    value={dashboardData.statistics.totalServices}
                    icon={Package}
                    color="bg-blue-500"
                    change={5}
                  />
                  <StatCard
                    title="Commandes"
                    value={dashboardData.statistics.totalSales}
                    icon={MessageCircle}
                    color="bg-purple-500"
                    change={8}
                  />
                  <StatCard
                    title="Note moyenne"
                    value={dashboardData.statistics.averageRating}
                    icon={Star}
                    color="bg-yellow-500"
                  />
                </>
              ) : (
                <>
                  <StatCard
                    title="Commandes totales"
                    value={dashboardData.activeOrders.length + dashboardData.completedOrders.length}
                    icon={Package}
                    color="bg-blue-500"
                  />
                  <StatCard
                    title="En cours"
                    value={dashboardData.activeOrders.length}
                    icon={Clock}
                    color="bg-orange-500"
                  />
                  <StatCard
                    title="Terminées"
                    value={dashboardData.completedOrders.length}
                    icon={Award}
                    color="bg-green-500"
                  />
                  <StatCard
                    title="Favoris"
                    value="12"
                    icon={Heart}
                    color="bg-red-500"
                  />
                </>
              )}
            </div>

            {/* Commandes récentes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {userType === 'provider' ? 'Commandes récentes' : 'Mes dernières commandes'}
                </h3>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Voir tout
                </button>
              </div>
              <div className="space-y-4">
                {dashboardData.activeOrders.slice(0, 3).map((order) => (
                  <OrderCard key={order.id} order={order} type="active" />
                ))}
                {dashboardData.completedOrders.slice(0, 2).map((order) => (
                  <OrderCard key={order.id} order={order} type="completed" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Services (pour les prestataires) */}
        {activeTab === 'services' && userType === 'provider' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Mes services</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                <span>Nouveau service</span>
              </button>
            </div>
            <div className="space-y-4">
              {userServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        )}

        {/* Commandes */}
        {activeTab === 'orders' && dashboardData && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">
              {userType === 'provider' ? 'Gestion des commandes' : 'Mes commandes'}
            </h3>
            
            {/* Commandes actives */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-medium mb-4">Commandes en cours</h4>
              <div className="space-y-4">
                {dashboardData.activeOrders.map((order) => (
                  <OrderCard key={order.id} order={order} type="active" />
                ))}
              </div>
            </div>

            {/* Historique */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-medium mb-4">Historique</h4>
              <div className="space-y-4">
                {dashboardData.completedOrders.map((order) => (
                  <OrderCard key={order.id} order={order} type="completed" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Revenus (pour les prestataires) */}
        {activeTab === 'earnings' && userType === 'provider' && dashboardData && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Revenus</h3>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <Download className="w-4 h-4" />
                <span>Exporter</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Revenus totaux</h4>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardData.earnings.total.toLocaleString()} FCFA
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Ce mois</h4>
                <p className="text-3xl font-bold text-green-600">
                  {dashboardData.earnings.thisMonth.toLocaleString()} FCFA
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-sm font-medium text-gray-600 mb-2">En attente</h4>
                <p className="text-3xl font-bold text-orange-600">
                  {dashboardData.earnings.pending.toLocaleString()} FCFA
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-medium mb-4">Retirer mes gains</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h5 className="font-medium">Paiement mobile</h5>
                    <p className="text-sm text-gray-600">Orange Money, MTN, Moov Money</p>
                  </div>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    Retirer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Favoris (pour les clients) */}
        {activeTab === 'favorites' && userType === 'client' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Mes favoris</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Services favoris */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-gray-500 text-center py-8">
                  Aucun service en favori pour le moment
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Profil */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-6">Informations du profil</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  rows={4}
                  value={user.bio}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Sauvegarder
              </button>
            </div>
          </div>
        )}

        {/* Paramètres */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-6">Paramètres</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Notifications</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm">Notifications par email</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm">Notifications push</span>
                  </label>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Confidentialité</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm">Profil public</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm">Afficher mon statut en ligne</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}