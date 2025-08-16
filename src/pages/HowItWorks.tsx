import React from 'react';
import { CheckCircle, Users, MessageSquare, CreditCard, Star } from 'lucide-react';

const HowItWorks: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Comment ça marche</h1>
        <p className="text-xl text-gray-600">Découvrez comment ServiceHub simplifie vos projets</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">1. Trouvez un expert</h3>
          <p className="text-gray-600">
            Parcourez des milliers de services proposés par des experts qualifiés
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">2. Discutez du projet</h3>
          <p className="text-gray-600">
            Contactez l'expert et détaillez vos besoins précisément
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">3. Paiement sécurisé</h3>
          <p className="text-gray-600">
            Paiement sécurisé via Stripe ou mobile money
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">4. Travail livré</h3>
          <p className="text-gray-600">
            Recevez votre travail et validez la livraison
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">5. Notez l'expert</h3>
          <p className="text-gray-600">
            Donnez votre avis et notez la qualité du service
          </p>
        </div>
      </div>

      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Types de services disponibles</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Services numériques</h3>
            <p className="text-sm text-gray-600">Développement web, design graphique, marketing digital</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Services à domicile</h3>
            <p className="text-sm text-gray-600">Plomberie, électricité, jardinage, ménage</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Services professionnels</h3>
            <p className="text-sm text-gray-600">Comptabilité, juridique, coaching, formation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
