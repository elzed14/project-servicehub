import React from 'react';
import { Search, Plus, Users, Shield, Zap, Heart } from 'lucide-react';
import { Button, Card, Badge } from '../../shared/components/ui';
import Breadcrumbs from '../../shared/components/navigation/Breadcrumbs';
import { categories } from '../../data/mockData';
import * as Icons from 'lucide-react';

interface HomePageProps {
  onViewChange: (view: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onViewChange }) => {
  const breadcrumbItems = [
    { label: 'Accueil', current: true }
  ];

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Info Banner */}
      <Card className="bg-green-50 border-green-200">
        <div className="text-center">
          <Badge variant="success" className="mb-2">Mode démonstration</Badge>
          <p className="text-green-800">
            Cliquez sur "Accès rapide" pour vous connecter instantanément avec un compte de démo ou créer un nouveau compte.
          </p>
        </div>
      </Card>

      {/* Hero Section */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0" padding="lg">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connectez-vous avec des <span className="text-blue-600">experts locaux</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Trouvez le service parfait ou proposez vos compétences. 
            Une plateforme simple et sécurisée pour tous vos besoins.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onViewChange('browse')}
              icon={<Search className="w-5 h-5" />}
              size="lg"
            >
              Trouver un service
            </Button>
            <Button
              onClick={() => onViewChange('post')}
              variant="secondary"
              icon={<Plus className="w-5 h-5" />}
              size="lg"
            >
              Proposer un service
            </Button>
          </div>
        </div>
      </Card>

      {/* Features */}
      <div>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Pourquoi choisir ServiceHub ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Users,
              title: 'Communauté vérifiée',
              description: 'Tous nos prestataires sont vérifiés et notés par la communauté',
              color: 'blue'
            },
            {
              icon: Shield,
              title: 'Paiement sécurisé',
              description: 'Transactions protégées et service client disponible 7j/7',
              color: 'green'
            },
            {
              icon: Zap,
              title: 'Réponse rapide',
              description: 'Recevez des propositions en moins de 24h pour vos demandes',
              color: 'purple'
            },
            {
              icon: Heart,
              title: 'Support local',
              description: 'Soutenez l\'économie locale en faisant appel à des experts près de chez vous',
              color: 'red'
            }
          ].map((feature, index) => {
            const IconComponent = feature.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
              red: 'bg-red-100 text-red-600'
            };
            
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Explorez nos catégories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ComponentType<any>;
            return (
              <Card
                key={category.id}
                className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                onClick={() => onViewChange('browse')}
              >
                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <Card className="bg-blue-600 text-white text-center border-0" padding="lg">
        <h2 className="text-3xl font-bold mb-4">
          Prêt à commencer ?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Rejoignez des milliers d'utilisateurs qui font confiance à ServiceHub
        </p>
        <Button
          onClick={() => onViewChange('post')}
          variant="secondary"
          size="lg"
        >
          Créer mon premier service
        </Button>
      </Card>
    </div>
  );
};

export default HomePage;