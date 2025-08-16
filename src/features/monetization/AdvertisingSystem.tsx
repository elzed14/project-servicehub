import React from 'react';
import { motion } from 'framer-motion';
import { Target, BarChart3, Users, Globe } from 'lucide-react';
import { ModernButton } from '../../shared/components/ui/ModernButton';

export const AdvertisingSystem: React.FC = () => {
  const adFormats = [
    {
      id: 'banner',
      name: 'Bannière Top',
      price: 62500,
      period: 'mois',
      dimensions: '728x90',
      impressions: 50000,
      ctr: 2.5,
      icon: Target
    },
    {
      id: 'sidebar',
      name: 'Encart Latéral',
      price: 47500,
      period: 'mois',
      dimensions: '300x250',
      impressions: 35000,
      ctr: 3.2,
      icon: BarChart3
    },
    {
      id: 'inline',
      name: 'Publicité Native',
      price: 95000,
      period: 'mois',
      dimensions: 'Responsive',
      impressions: 25000,
      ctr: 4.8,
      icon: Users
    },
    {
      id: 'sponsored',
      name: 'Contenu Sponsorisé',
      price: 157500,
      period: 'mois',
      dimensions: 'Article complet',
      impressions: 15000,
      ctr: 8.5,
      icon: Globe
    }
  ];

  const audienceStats = {
    totalUsers: 25000,
    monthlyPageViews: 180000,
    demographics: {
      age: '25-45 ans (68%)',
      location: 'Zones urbaines (82%)',
      interests: 'Services, Rénovation, Tech'
    }
  };

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            📢 Espaces Publicitaires
          </h2>
          <p className="text-xl text-gray-600">
            Monétisez votre audience avec des publicités ciblées
          </p>
        </div>

        {/* Statistiques d'audience */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-8 text-white mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">
              🎯 Votre Audience
            </h3>
            <p className="text-blue-100">
              Une audience qualifiée et engagée
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {audienceStats.totalUsers.toLocaleString()}
              </div>
              <p className="text-blue-100">Utilisateurs actifs</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {audienceStats.monthlyPageViews.toLocaleString()}
              </div>
              <p className="text-blue-100">Pages vues/mois</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                4.2min
              </div>
              <p className="text-blue-100">Temps moyen/session</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-block bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm">
                <strong>Démographie :</strong> {audienceStats.demographics.age} • 
                {audienceStats.demographics.location} • 
                {audienceStats.demographics.interests}
              </p>
            </div>
          </div>
        </div>

        {/* Formats publicitaires */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {adFormats.map((format, index) => (
            <motion.div
              key={format.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-center mb-4">
                <format.icon className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {format.name}
                </h3>
                <div className="text-2xl font-bold text-blue-600">
                  {format.price.toLocaleString()} FCFA
                </div>
                <p className="text-gray-500">/{format.period}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Format :</span>
                  <span className="font-medium">{format.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Impressions :</span>
                  <span className="font-medium">{format.impressions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CTR moyen :</span>
                  <span className="font-medium text-green-600">{format.ctr}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Revenus publicitaires projetés */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              💰 Revenus Publicitaires Projetés
            </h3>
            <p className="text-gray-600">
              Basés sur 70% de taux d'occupation des espaces
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-4">Revenus Mensuels</h4>
              <div className="space-y-3">
                {adFormats.map((format) => (
                  <div key={format.id} className="flex justify-between">
                    <span>{format.name} :</span>
                    <span className="font-bold">{Math.round(format.price * 0.7).toLocaleString()} FCFA</span>
                  </div>
                ))}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold text-green-600">
                    <span>Total :</span>
                    <span>{Math.round(adFormats.reduce((sum, f) => sum + f.price, 0) * 0.7).toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h4 className="text-xl font-semibold mb-4">Revenus Annuels</h4>
              <div className="text-4xl font-bold text-green-600 mb-4">
                {Math.round(adFormats.reduce((sum, f) => sum + f.price, 0) * 0.7 * 12).toLocaleString()} FCFA
              </div>
              <p className="text-gray-600">
                Revenus passifs garantis avec des annonceurs locaux et nationaux
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <ModernButton variant="primary" size="lg">
            Contacter pour la publicité
          </ModernButton>
        </div>
      </div>
    </div>
  );
};