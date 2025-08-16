import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Eye, Clock } from 'lucide-react';
import { ModernButton } from '../../shared/components/ui/ModernButton';

export const PremiumListings: React.FC = () => {
  const premiumOptions = [
    {
      id: 'featured',
      name: 'Mise en avant',
      price: 4750,
      duration: 7,
      icon: Star,
      benefits: [
        'Apparition en haut des résultats',
        'Badge "Recommandé"',
        '+300% de visibilité',
        'Statistiques détaillées'
      ],
      color: 'yellow'
    },
    {
      id: 'spotlight',
      name: 'Coup de projecteur',
      price: 8000,
      duration: 14,
      icon: TrendingUp,
      benefits: [
        'Position #1 garantie',
        'Encadré coloré',
        '+500% de visibilité',
        'Notification aux clients',
        'Support prioritaire'
      ],
      color: 'blue'
    },
    {
      id: 'premium',
      name: 'Premium Plus',
      price: 14000,
      duration: 30,
      icon: Eye,
      benefits: [
        'Toutes les fonctionnalités',
        'Page dédiée',
        'Newsletter mensuelle',
        '+800% de visibilité',
        'Gestionnaire de compte'
      ],
      color: 'purple'
    }
  ];

  const stats = {
    averageIncrease: 450, // % d'augmentation des contacts
    conversionRate: 15, // % de conversion en clients
    roi: 280 // % de retour sur investissement
  };

  return (
    <div className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ⭐ Listings Premium
          </h2>
          <p className="text-xl text-gray-600">
            Boostez votre visibilité et multipliez vos contacts
          </p>
        </div>

        {/* Options premium */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {premiumOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8 hover:shadow-2xl transition-shadow"
            >
              <div className="text-center mb-6">
                <div className={`w-16 h-16 bg-${option.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <option.icon className={`w-8 h-8 text-${option.color}-600`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {option.name}
                </h3>
                <div className="text-3xl font-bold text-blue-600">
                  {option.price.toLocaleString()} FCFA
                </div>
                <p className="text-gray-500">pour {option.duration} jours</p>
              </div>

              <ul className="space-y-3 mb-8">
                {option.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start">
                    <Star className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              <ModernButton
                variant="primary"
                className="w-full"
                onClick={() => console.log('Premium:', option.id)}
              >
                Activer maintenant
              </ModernButton>
            </motion.div>
          ))}
        </div>

        {/* Statistiques de performance */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              📊 Résultats Moyens
            </h3>
            <p className="text-gray-600">
              Performance des experts utilisant nos services premium
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                +{stats.averageIncrease}%
              </div>
              <p className="text-gray-700">
                Augmentation des contacts
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.conversionRate}%
              </div>
              <p className="text-gray-700">
                Taux de conversion
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {stats.roi}%
              </div>
              <p className="text-gray-700">
                Retour sur investissement
              </p>
            </div>
          </div>
        </div>

        {/* Témoignage */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <p className="text-xl italic mb-4">
              "Grâce au listing premium, j'ai multiplié mes contacts par 5 en seulement 2 semaines. 
              L'investissement s'est rentabilisé dès la première mission !"
            </p>
            <div className="flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60"
                alt="Expert témoignage"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="font-semibold">Ahmed Ben Ali</p>
                <p className="text-blue-200">Plombier professionnel</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};