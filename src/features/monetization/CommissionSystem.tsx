import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Users, Target } from 'lucide-react';

export const CommissionSystem: React.FC = () => {
  const commissionRates = [
    {
      category: 'Services numériques',
      rate: 5,
      icon: Target,
      examples: ['Développement web', 'Design graphique', 'Rédaction']
    },
    {
      category: 'Services à domicile',
      rate: 8,
      icon: Users,
      examples: ['Plomberie', 'Électricité', 'Ménage']
    },
    {
      category: 'Formations & Cours',
      rate: 12,
      icon: TrendingUp,
      examples: ['Cours particuliers', 'Coaching', 'Formations']
    }
  ];

  const revenueProjection = {
    monthly: {
      transactions: 1000,
      averageValue: 47500, // FCFA
      commission: 7.5, // %
      revenue: 3562500 // 1000 * 47500 * 0.075
    },
    yearly: {
      transactions: 15000,
      averageValue: 55000, // FCFA
      commission: 7.5,
      revenue: 61875000 // FCFA
    }
  };

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            💰 Système de Commissions
          </h2>
          <p className="text-xl text-gray-600">
            Revenus automatiques sur chaque transaction
          </p>
        </div>

        {/* Taux de commission */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {commissionRates.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-100"
            >
              <div className="text-center mb-6">
                <item.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.category}
                </h3>
                <div className="text-3xl font-bold text-blue-600">
                  {item.rate}%
                </div>
                <p className="text-gray-600">de commission</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Exemples :</p>
                {item.examples.map((example, i) => (
                  <div key={i} className="text-sm text-gray-600">
                    • {example}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Projection des revenus */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">
              📈 Projection des Revenus
            </h3>
            <p className="text-green-100">
              Basée sur la croissance moyenne des plateformes similaires
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-4">Revenus Mensuels</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Transactions :</span>
                  <span className="font-bold">{revenueProjection.monthly.transactions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valeur moyenne :</span>
                  <span className="font-bold">{revenueProjection.monthly.averageValue.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span>Commission moyenne :</span>
                  <span className="font-bold">{revenueProjection.monthly.commission}%</span>
                </div>
                <div className="border-t border-green-300 pt-3">
                  <div className="flex justify-between text-xl">
                    <span>Revenus :</span>
                    <span className="font-bold">{revenueProjection.monthly.revenue.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h4 className="text-xl font-semibold mb-4">Revenus Annuels</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Transactions :</span>
                  <span className="font-bold">{revenueProjection.yearly.transactions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valeur moyenne :</span>
                  <span className="font-bold">{revenueProjection.yearly.averageValue.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span>Commission moyenne :</span>
                  <span className="font-bold">{revenueProjection.yearly.commission}%</span>
                </div>
                <div className="border-t border-green-300 pt-3">
                  <div className="flex justify-between text-xl">
                    <span>Revenus :</span>
                    <span className="font-bold">{revenueProjection.yearly.revenue.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};