import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, DollarSign, Star, RefreshCw } from 'lucide-react';
import { useRealTimeStats } from '../../shared/hooks/useRealTimeStats';
import { RealTimeCounter } from '../../shared/components/ui/RealTimeCounter';
import { ModernButton } from '../../shared/components/ui/ModernButton';

export const RealTimeStatsPanel: React.FC = () => {
  const { stats, isLoading, addUser, addExpert, completeService, reset } = useRealTimeStats();

  const handleTestTransaction = () => {
    const amount = Math.floor(Math.random() * 50000) + 10000; // 10k-60k FCFA
    const rating = 4 + Math.random(); // 4-5 étoiles
    completeService(amount, rating);
  };

  const statCards = [
    {
      title: 'Utilisateurs Total',
      value: stats.totalUsers,
      icon: Users,
      color: 'blue',
      action: addUser
    },
    {
      title: 'Experts Actifs',
      value: stats.activeExperts,
      icon: TrendingUp,
      color: 'green',
      action: addExpert
    },
    {
      title: 'Services Réalisés',
      value: stats.completedServices,
      icon: Star,
      color: 'purple',
      action: handleTestTransaction
    },
    {
      title: 'Revenus (FCFA)',
      value: stats.totalRevenue,
      icon: DollarSign,
      color: 'amber',
      action: handleTestTransaction
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          📊 Statistiques en Temps Réel
        </h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Dernière MAJ: {stats.lastUpdated.toLocaleTimeString()}
          </div>
          <ModernButton
            onClick={reset}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </ModernButton>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br from-${card.color}-50 to-${card.color}-100 rounded-xl p-6 border border-${card.color}-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <card.icon className={`w-8 h-8 text-${card.color}-600`} />
              <ModernButton
                onClick={card.action}
                size="sm"
                className="text-xs"
              >
                +1
              </ModernButton>
            </div>
            
            <div className={`text-3xl font-bold text-${card.color}-700 mb-2`}>
              <RealTimeCounter value={card.value} />
            </div>
            
            <div className="text-sm text-gray-600">
              {card.title}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Métriques avancées */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Note Moyenne</h3>
          <div className="text-2xl font-bold text-yellow-600">
            {stats.averageRating > 0 ? stats.averageRating.toFixed(2) : '0.00'}/5
          </div>
          <div className="flex mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= stats.averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Transactions Mensuelles</h3>
          <div className="text-2xl font-bold text-green-600">
            <RealTimeCounter value={stats.monthlyTransactions} suffix=" FCFA" />
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Commission: {Math.floor(stats.monthlyTransactions * 0.075).toLocaleString()} FCFA
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Taux de Croissance</h3>
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalUsers > 0 ? '+' + Math.floor((stats.completedServices / stats.totalUsers) * 100) : '0'}%
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Services par utilisateur
          </div>
        </div>
      </div>

      {/* Actions de test */}
      <div className="mt-8 p-4 bg-blue-50 rounded-xl">
        <h3 className="font-semibold text-blue-900 mb-3">🧪 Actions de Test</h3>
        <div className="flex flex-wrap gap-3">
          <ModernButton onClick={addUser} size="sm" variant="outline">
            + Utilisateur
          </ModernButton>
          <ModernButton onClick={addExpert} size="sm" variant="outline">
          + Expert
          </ModernButton>
          <ModernButton onClick={handleTestTransaction} size="sm" variant="outline">
            + Transaction
          </ModernButton>
        </div>
        <p className="text-sm text-blue-700 mt-2">
          Cliquez pour simuler l'activité et voir les données s'actualiser en temps réel
        </p>
      </div>
    </div>
  );
};