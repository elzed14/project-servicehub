import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users, Target } from 'lucide-react';
import { SubscriptionPlans } from '../../features/monetization/SubscriptionPlans';
import { CommissionSystem } from '../../features/monetization/CommissionSystem';
import { PremiumListings } from '../../features/monetization/PremiumListings';
import { AdvertisingSystem } from '../../features/monetization/AdvertisingSystem';

export const MonetizationPage: React.FC = () => {
  const revenueStreams = [
    {
      name: 'Abonnements',
      icon: Users,
      monthlyRevenue: 4750000, // FCFA
      growth: '+25%',
      color: 'blue'
    },
    {
      name: 'Commissions',
      icon: DollarSign,
      monthlyRevenue: 3562500, // FCFA
      growth: '+40%',
      color: 'green'
    },
    {
      name: 'Listings Premium',
      icon: TrendingUp,
      monthlyRevenue: 2700000, // FCFA
      growth: '+60%',
      color: 'purple'
    },
    {
      name: 'Publicités',
      icon: Target,
      monthlyRevenue: 2000000, // FCFA
      growth: '+15%',
      color: 'amber'
    }
  ];

  const totalMonthlyRevenue = revenueStreams.reduce((sum, stream) => sum + stream.monthlyRevenue, 0);
  const totalYearlyRevenue = totalMonthlyRevenue * 12;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6">
              💰 Modèle de Monétisation ServiceHub
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              4 sources de revenus diversifiées pour une croissance durable et rentable
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-4xl font-bold mb-2">
                  {totalMonthlyRevenue.toLocaleString()} FCFA
                </div>
                <div className="text-green-200">Revenus mensuels projetés</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">
                  {totalYearlyRevenue.toLocaleString()} FCFA
                </div>
                <div className="text-green-200">Revenus annuels projetés</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sources de revenus */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              📊 Sources de Revenus
            </h2>
            <p className="text-xl text-gray-600">
              Diversification pour minimiser les risques et maximiser les profits
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {revenueStreams.map((stream, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 text-center"
              >
                <div className={`w-16 h-16 bg-${stream.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <stream.icon className={`w-8 h-8 text-${stream.color}-600`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {stream.name}
                </h3>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stream.monthlyRevenue.toLocaleString()} FCFA
                </div>
                <div className="text-sm text-gray-500 mb-3">/mois</div>
                <div className={`text-${stream.color}-600 font-medium`}>
                  {stream.growth} croissance
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Détail des systèmes */}
      <SubscriptionPlans />
      <CommissionSystem />
      <PremiumListings />
      <AdvertisingSystem />

      {/* Résumé financier */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-green-900">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-8">
            🎯 Résumé Financier
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white bg-opacity-10 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Revenus Récurrents</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Abonnements mensuels :</span>
                  <span className="font-bold">4 750 000 FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span>Publicités mensuelles :</span>
                  <span className="font-bold">2 000 000 FCFA</span>
                </div>
                <div className="border-t border-white border-opacity-20 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total récurrent :</span>
                    <span>6 750 000 FCFA/mois</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Revenus Variables</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Commissions :</span>
                  <span className="font-bold">3 562 500 FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span>Listings premium :</span>
                  <span className="font-bold">2 700 000 FCFA</span>
                </div>
                <div className="border-t border-white border-opacity-20 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total variable :</span>
                    <span>6 262 500 FCFA/mois</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              💎 Potentiel de Croissance
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold mb-2">Année 1</div>
                <div className="text-xl">{totalYearlyRevenue.toLocaleString()} FCFA</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">Année 2</div>
                <div className="text-xl">{Math.round(totalYearlyRevenue * 1.8).toLocaleString()} FCFA</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">Année 3</div>
                <div className="text-xl">{Math.round(totalYearlyRevenue * 3.2).toLocaleString()} FCFA</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};