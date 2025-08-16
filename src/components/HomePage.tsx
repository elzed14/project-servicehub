import React from 'react';
import { Search, Plus, Users, Shield, Zap, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/mockData';
import * as Icons from 'lucide-react';

interface HomePageProps {
  onViewChange?: (view: string) => void;
}

export default function HomePage({ onViewChange }: HomePageProps) {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    if (onViewChange) {
      onViewChange(path);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Connectez-vous avec des <span className="text-blue-600">experts locaux</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Trouvez le service parfait ou proposez vos compétences. 
          Une plateforme simple et sécurisée pour tous vos besoins.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => handleNavigation('/browse')}
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Search className="w-5 h-5" />
            <span>Trouver un service</span>
          </button>
          <button
            onClick={() => handleNavigation('/become-expert')}
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Devenir expert</span>
          </button>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Pourquoi choisir ServiceHub ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Communauté vérifiée
            </h3>
            <p className="text-gray-600">
              Tous nos prestataires sont vérifiés et notés par la communauté
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Paiement sécurisé
            </h3>
            <p className="text-gray-600">
              Transactions protégées et service client disponible 7j/7
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Réponse rapide
            </h3>
            <p className="text-gray-600">
              Recevez des propositions en moins de 24h pour vos demandes
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Support local
            </h3>
            <p className="text-gray-600">
              Soutenez l'économie locale en faisant appel à des experts près de chez vous
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Explorez nos catégories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ComponentType<any>;
            return (
              <button
                key={category.id}
                onClick={() => handleNavigation('/browse')}
                className="p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
              </button>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Prêt à commencer ?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Rejoignez des milliers d'utilisateurs qui font confiance à ServiceHub
        </p>
        <button
          onClick={() => handleNavigation('/become-expert')}
          className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
        >
          Créer mon premier service
        </button>
      </section>
    </div>
  );
}