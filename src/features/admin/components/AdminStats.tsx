import React from 'react';
import { Users, FileText, Eye, DollarSign, TrendingUp } from 'lucide-react';
import { Card } from '../../../shared/components/ui';

interface StatsData {
  totalUsers: number;
  totalServices: number;
  totalOffers: number;
  totalRequests: number;
  activeUsers: number;
  revenue: number;
  monthlyGrowth: number;
}

interface AdminStatsProps {
  stats: StatsData;
}

const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Utilisateurs totaux',
      value: stats.totalUsers || 0,
      icon: Users,
      color: 'blue',
      growth: `+${stats.monthlyGrowth || 0}%`,
      subtitle: 'ce mois'
    },
    {
      title: 'Services actifs',
      value: stats.totalServices || 0,
      icon: FileText,
      color: 'green',
      subtitle: `${stats.totalOffers || 0} offres • ${stats.totalRequests || 0} demandes`
    },
    {
      title: 'Utilisateurs actifs',
      value: stats.activeUsers || 0,
      icon: Eye,
      color: 'purple',
      subtitle: 'Dernières 24h'
    },
    {
      title: 'Revenus',
      value: `${(stats.revenue || 0).toLocaleString()}€`,
      icon: DollarSign,
      color: 'yellow',
      subtitle: 'Ce mois'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      yellow: 'bg-yellow-100 text-yellow-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </p>
                  {stat.growth && (
                    <div className="flex items-center text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600 font-medium">{stat.growth}</span>
                      <span className="text-gray-500 ml-1">{stat.subtitle}</span>
                    </div>
                  )}
                  {!stat.growth && stat.subtitle && (
                    <p className="text-sm text-gray-500">{stat.subtitle}</p>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(stat.color)}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminStats;