import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Shield, Zap, Star, ArrowRight } from 'lucide-react';
import { SmartSearch } from '../../shared/components/ui/SmartSearch';
import { ModernButton } from '../../shared/components/ui/ModernButton';
import { ExpertCard } from '../../shared/components/ui/ExpertCard';
import { useRealTimeStats } from '../../shared/hooks/useRealTimeStats';

export const ModernHomePage: React.FC = () => {
  const [searchResults, setSearchResults] = useState([]);
  const { stats, isLoading } = useRealTimeStats();

  const mockExperts = [
    {
      id: '1',
      name: 'Marie Dubois',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      profession: 'Développeuse Web',
      rating: 4.9,
      reviewCount: 127,
      location: 'Paris 15e',
      responseTime: '2h',
      verified: true,
      price: '45€/h',
      services: ['React', 'Node.js', 'UI/UX']
    },
    {
      id: '2',
      name: 'Ahmed Ben Ali',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      profession: 'Plombier',
      rating: 4.8,
      reviewCount: 89,
      location: 'Lyon 3e',
      responseTime: '1h',
      verified: true,
      price: '35€/h',
      services: ['Dépannage', 'Installation', 'Rénovation']
    }
  ];

  const suggestions = [
    'Développement web', 'Plomberie', 'Électricité', 'Design graphique',
    'Cours particuliers', 'Jardinage', 'Ménage', 'Réparation'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Trouvez l'expert
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                {' '}parfait
              </span>
              <br />
              près de chez vous
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              ServiceHub connecte clients et experts locaux pour tous vos besoins.
              Trouvez rapidement un professionnel qualifié et noté par la communauté.
            </p>

            {/* Barre de recherche */}
            <div className="mb-12">
              <SmartSearch
                onSearch={(filters) => console.log('Recherche:', filters)}
                suggestions={suggestions}
              />
            </div>

            {/* Stats en temps réel */}
            <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-blue-600">
                  {isLoading ? '...' : stats.activeExperts.toLocaleString()}
                </div>
                <div className="text-gray-600">Experts actifs</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-green-600">
                  {isLoading ? '...' : stats.completedServices.toLocaleString()}
                </div>
                <div className="text-gray-600">Services réalisés</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-amber-600">
                  {isLoading ? '...' : stats.averageRating > 0 ? stats.averageRating.toFixed(1) + '/5' : 'Nouveau'}
                </div>
                <div className="text-gray-600">Note moyenne</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experts populaires */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Experts les mieux notés
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez nos experts les plus appréciés par la communauté
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockExperts.map((expert, index) => (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ExpertCard expert={expert} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <ModernButton variant="outline" size="lg">
              Voir tous les experts
              <ArrowRight className="w-5 h-5 ml-2" />
            </ModernButton>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir ServiceHub ?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Experts vérifiés',
                description: 'Tous nos experts sont vérifiés et notés par la communauté'
              },
              {
                icon: Zap,
                title: 'Réponse rapide',
                description: 'Obtenez des devis en moins de 24h'
              },
              {
                icon: Star,
                title: 'Qualité garantie',
                description: 'Satisfaction client garantie ou remboursé'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-8 bg-white rounded-2xl shadow-sm"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Prêt à trouver votre expert ?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Rejoignez des milliers de clients satisfaits
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ModernButton variant="secondary" size="lg">
                Trouver un expert
              </ModernButton>
              <ModernButton variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                Devenir expert
              </ModernButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};