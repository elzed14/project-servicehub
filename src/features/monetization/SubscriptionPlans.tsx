import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { ModernButton } from '../../shared/components/ui/ModernButton';

const plans = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    interval: 'monthly',
    icon: Star,
    color: 'gray',
    features: [
      '3 demandes par mois',
      'Profil basique',
      'Support communautaire'
    ],
    limits: { projects: 3, contacts: 10, priority: false }
  },
  {
    id: 'pro',
    name: 'Professionnel',
    price: 6000,
    interval: 'monthly',
    icon: Zap,
    color: 'blue',
    popular: true,
    features: [
      'Demandes illimitées',
      'Profil premium',
      'Support prioritaire',
      'Statistiques avancées',
      'Badge vérifié'
    ],
    limits: { projects: 50, contacts: 500, priority: true }
  },
  {
    id: 'enterprise',
    name: 'Entreprise',
    price: 15000,
    interval: 'monthly',
    icon: Crown,
    color: 'amber',
    features: [
      'Tout du plan Pro',
      'Équipe multi-utilisateurs',
      'API personnalisée',
      'Support dédié',
      'Mise en avant premium'
    ],
    limits: { projects: 999, contacts: 9999, priority: true }
  }
];

export const SubscriptionPlans: React.FC = () => {
  const handleSubscribe = (planId: string) => {
    // Intégration paiement mobile local
    console.log('Abonnement:', planId);
  };

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choisissez votre plan
          </h2>
          <p className="text-xl text-gray-600">
            Développez votre activité avec nos outils professionnels
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
                plan.popular ? 'border-blue-500 scale-105' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Plus populaire
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <plan.icon className={`w-12 h-12 mx-auto mb-4 text-${plan.color}-500`} />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-gray-900">
                  {plan.price.toLocaleString()} FCFA
                  <span className="text-lg text-gray-500 font-normal">/mois</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <ModernButton
                variant={plan.popular ? 'primary' : 'outline'}
                onClick={() => handleSubscribe(plan.id)}
                className="w-full"
              >
                {plan.price === 0 ? 'Commencer gratuitement' : 'S\'abonner'}
              </ModernButton>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            💳 Paiement sécurisé par Celtis Money, MTN Mobile Money, Moov Money
          </p>
        </div>
      </div>
    </div>
  );
};