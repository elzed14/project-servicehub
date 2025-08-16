import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Shield, Phone, Mail, Calendar, Award, Users, MessageCircle } from 'lucide-react';
import { serviceService, Expert, Service } from '../../shared/services/serviceService';
import { ModernButton } from '../../shared/components/ui/ModernButton';

interface ExpertProfilePageProps {
  expertId?: string;
}

export const ExpertProfilePage: React.FC<ExpertProfilePageProps> = ({ expertId = 'demo' }) => {
  const [expert, setExpert] = useState<Expert | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'about'>('services');

  useEffect(() => {
    loadExpertData();
  }, [expertId]);

  const loadExpertData = async () => {
    setIsLoading(true);
    try {
      // Simuler des données d'expert pour la démo
      const mockExpert: Expert = {
        _id: expertId,
        name: 'Marie Kouassi',
        email: 'marie.kouassi@email.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300',
        location: 'Abidjan, Cocody',
        bio: 'Développeuse web passionnée avec 5 ans d\'expérience. Spécialisée dans React, Node.js et les applications mobiles. J\'aide les entreprises à créer des solutions digitales innovantes.',
        skills: ['Développement Web', 'React', 'Node.js', 'UI/UX Design', 'Applications Mobiles'],
        rating: 4.9,
        reviewCount: 127,
        services: [],
        isVerified: true,
        joinedAt: '2022-03-15'
      };

      const mockServices: Service[] = [
        {
          _id: '1',
          title: 'Création de site web professionnel',
          description: 'Développement complet de votre site web avec design moderne et responsive',
          category: 'Développement Web',
          price: 150000,
          location: 'Abidjan',
          expert: {
            _id: expertId,
            name: 'Marie Kouassi',
            rating: 4.9,
            reviewCount: 127
          },
          tags: ['React', 'Responsive', 'SEO'],
          createdAt: '2024-01-15'
        },
        {
          _id: '2',
          title: 'Application mobile React Native',
          description: 'Développement d\'application mobile cross-platform pour iOS et Android',
          category: 'Développement Mobile',
          price: 250000,
          location: 'Abidjan',
          expert: {
            _id: expertId,
            name: 'Marie Kouassi',
            rating: 4.9,
            reviewCount: 127
          },
          tags: ['React Native', 'iOS', 'Android'],
          createdAt: '2024-01-10'
        }
      ];

      setExpert(mockExpert);
      setServices(mockServices);
    } catch (error) {
      console.error('Error loading expert:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Expert introuvable</h2>
          <p className="text-gray-600">Cet expert n'existe pas ou n'est plus disponible.</p>
        </div>
      </div>
    );
  }

  const reviews = [
    {
      id: '1',
      author: 'Jean-Baptiste Ouattara',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60',
      rating: 5,
      comment: 'Excellent travail ! Marie a créé un site web magnifique pour mon entreprise. Très professionnelle et à l\'écoute.',
      date: '2024-01-20',
      service: 'Création de site web'
    },
    {
      id: '2',
      author: 'Fatou Traoré',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60',
      rating: 5,
      comment: 'Application mobile parfaite ! Délais respectés et qualité au rendez-vous. Je recommande vivement.',
      date: '2024-01-15',
      service: 'Application mobile'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header du profil */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Photo et infos principales */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="relative">
                <img
                  src={expert.avatar}
                  alt={expert.name}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
                {expert.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{expert.name}</h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{expert.location}</span>
                    </div>
                    <div className="flex items-center mb-4">
                      <div className="flex items-center mr-4">
                        <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                        <span className="font-semibold">{expert.rating}</span>
                        <span className="text-gray-500 ml-1">({expert.reviewCount} avis)</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Répond en 2h</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compétences */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {expert.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <ModernButton 
                    size="lg" 
                    className="flex items-center"
                    onClick={() => window.location.hash = '#messages'}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Contacter
                  </ModernButton>
                  <ModernButton 
                    variant="outline" 
                    size="lg" 
                    className="flex items-center"
                    onClick={() => {
                      // Simuler l'ouverture du modal de réservation
                      alert('Modal de réservation - Fonctionnalité disponible !');
                    }}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Réserver
                  </ModernButton>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="lg:w-80">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Statistiques</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-gray-700">Clients satisfaits</span>
                    </div>
                    <span className="font-semibold">{expert.reviewCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-gray-700">Projets terminés</span>
                    </div>
                    <span className="font-semibold">89</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-orange-600 mr-2" />
                      <span className="text-gray-700">Temps de réponse</span>
                    </div>
                    <span className="font-semibold">2h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation des onglets */}
        <div className="flex border-b border-gray-200 mb-8">
          {[
            { key: 'services', label: 'Services', count: services.length },
            { key: 'reviews', label: 'Avis', count: expert.reviewCount },
            { key: 'about', label: 'À propos' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Contenu des onglets */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Onglet Services */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                {services.map((service, index) => (
                  <motion.div
                    key={service._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                      <div className="text-2xl font-bold text-blue-600">
                        {service.price.toLocaleString()} FCFA
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Catégorie: {service.category}</span>
                      <ModernButton size="sm">Voir détails</ModernButton>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Onglet Avis */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={review.avatar}
                        alt={review.author}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{review.author}</h4>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center mb-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">pour {review.service}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Onglet À propos */}
            {activeTab === 'about' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">À propos de {expert.name}</h3>
                <p className="text-gray-700 leading-relaxed mb-6">{expert.bio}</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Informations</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Membre depuis {new Date(expert.joinedAt).getFullYear()}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">{expert.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-gray-600">Profil vérifié</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Compétences</h4>
                    <div className="flex flex-wrap gap-2">
                      {expert.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact rapide */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Contact rapide</h3>
              <div className="space-y-3">
                <ModernButton className="w-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Envoyer un message
                </ModernButton>
                <ModernButton variant="outline" className="w-full flex items-center justify-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Demander un appel
                </ModernButton>
              </div>
            </div>

            {/* Experts similaires */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Experts similaires</h3>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img
                      src={`https://images.unsplash.com/photo-${i === 1 ? '1472099645785-5658abf4ff4e' : '1438761681033-6461ffad8d80'}?w=60`}
                      alt="Expert"
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Expert {i}</h4>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm text-gray-600">4.8 (45)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};