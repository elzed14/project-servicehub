import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, ArrowRight, CheckCircle, Users, Shield, Clock } from 'lucide-react';
import { ModernButton } from '../../shared/components/ui/ModernButton';
import { useRealTimeStats } from '../../shared/hooks/useRealTimeStats';
import { Link, useNavigate } from 'react-router-dom';

export const ThumbTackHomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const { stats } = useRealTimeStats();
  const navigate = useNavigate();

  const popularServices = [
    { name: 'Plomberie', icon: '🔧', requests: '2,500+' },
    { name: 'Électricité', icon: '⚡', requests: '1,800+' },
    { name: 'Ménage', icon: '🧹', requests: '3,200+' },
    { name: 'Jardinage', icon: '🌱', requests: '1,400+' },
    { name: 'Peinture', icon: '🎨', requests: '900+' },
    { name: 'Déménagement', icon: '📦', requests: '1,100+' },
    { name: 'Réparation', icon: '🔨', requests: '2,100+' },
    { name: 'Cours particuliers', icon: '📚', requests: '1,600+' }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Décrivez votre projet',
      description: 'Dites-nous ce dont vous avez besoin. Nous vous mettrons en relation avec des experts.',
      icon: '📝'
    },
    {
      step: '2',
      title: 'Recevez des devis',
      description: 'Les experts vous contactent avec des devis personnalisés pour votre projet.',
      icon: '💬'
    },
    {
      step: '3',
      title: 'Choisissez votre expert',
      description: 'Comparez les profils, les avis et les prix pour choisir le bon expert.',
      icon: '✅'
    }
  ];

  const testimonials = [
    {
      name: 'Marie Kouassi',
      service: 'Rénovation cuisine',
      rating: 5,
      comment: 'Service exceptionnel ! Mon expert était professionnel et a terminé dans les délais.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60'
    },
    {
      name: 'Jean-Baptiste Ouattara',
      service: 'Cours de mathématiques',
      rating: 5,
      comment: 'Excellent professeur, très patient. Mon fils a progressé rapidement.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60'
    },
    {
      name: 'Fatou Traoré',
      service: 'Ménage à domicile',
      rating: 5,
      comment: 'Très satisfaite du service. Ponctuelle et très minutieuse.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Style Thumbtack */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Trouvez le bon expert
                <span className="text-blue-600"> pour chaque projet</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Des millions de personnes utilisent ServiceHub pour transformer leurs idées en réalité.
                Rejoignez-les dès aujourd'hui.
              </p>

              {/* Barre de recherche principale */}
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="De quel service avez-vous besoin ?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    />
                  </div>
                  
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Où ?"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => navigate(`/search?query=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`)}
                >
                  <ModernButton 
                    className="w-full py-4 text-lg font-semibold"
                    size="lg"
                  >
                    Obtenir des devis gratuits
                  </ModernButton>
                </button>
              </div>

              {/* Stats en temps réel */}
              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>{stats.activeExperts.toLocaleString()} experts vérifiés</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-2" />
                  <span>{stats.completedServices.toLocaleString()} projets réalisés</span>
                </div>
              </div>
            </motion.div>

            {/* Image hero */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="text-3xl mb-2">🏠</div>
                    <div className="text-sm opacity-90">Maison & Jardin</div>
                    <div className="text-2xl font-bold">2,500+</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="text-3xl mb-2">💻</div>
                    <div className="text-sm opacity-90">Tech & Digital</div>
                    <div className="text-2xl font-bold">1,800+</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="text-3xl mb-2">📚</div>
                    <div className="text-sm opacity-90">Éducation</div>
                    <div className="text-2xl font-bold">1,200+</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="text-3xl mb-2">🎨</div>
                    <div className="text-sm opacity-90">Créatif</div>
                    <div className="text-2xl font-bold">900+</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services populaires */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Services les plus demandés
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les services les plus populaires sur notre plateforme
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {popularServices.map((service, index) => (
              <button
                key={service.name}
                onClick={() => navigate(`/search?query=${encodeURIComponent(service.name)}`)}
                className="w-full"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100 h-full"
                >
                  <div className="text-4xl mb-4 text-center">{service.icon}</div>
                  <h3 className="font-semibold text-gray-900 text-center mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-500 text-center">
                    {service.requests} demandes
                  </p>
                </motion.div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche
            </h2>
            <p className="text-xl text-gray-600">
              Trois étapes simples pour trouver votre expert
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">{step.icon}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-xl text-gray-600">
              Des milliers de clients satisfaits nous font confiance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-md"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.service}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 italic">
                  "{testimonial.comment}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Prêt à commencer votre projet ?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Rejoignez des milliers de clients qui ont trouvé leur expert sur ServiceHub
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ModernButton 
                variant="secondary" 
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-50"
                onClick={() => navigate('/search')}
              >
                Trouver un expert
                <ArrowRight className="w-5 h-5 ml-2" />
              </ModernButton>
              <ModernButton 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => navigate('/become-expert')}
              >
                Devenir expert
              </ModernButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};