import React from 'react';
import { Building2, Users, TrendingUp, Shield } from 'lucide-react';

const Business: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">ServiceHub pour Entreprises</h1>
        <p className="text-xl text-gray-600">Solutions professionnelles pour vos besoins business</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Pourquoi choisir ServiceHub Business ?</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <Building2 className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold">Solutions sur mesure</h3>
                <p className="text-gray-600">Services adaptés aux besoins spécifiques de votre entreprise</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Users className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold">Experts qualifiés</h3>
                <p className="text-gray-600">Accès à des professionnels vérifiés et expérimentés</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <TrendingUp className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold">Évolutivité</h3>
                <p className="text-gray-600">Solutions qui grandissent avec votre entreprise</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Shield className="w-6 h-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold">Sécurité garantie</h3>
                <p className="text-gray-600">Contrats sécurisés et confidentialité assurée</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Services populaires</h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Développement web</h3>
              <p className="text-sm text-gray-600">Sites web, applications mobiles, e-commerce</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Marketing digital</h3>
              <p className="text-sm text-gray-600">SEO, réseaux sociaux, publicité en ligne</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Design et branding</h3>
              <p className="text-sm text-gray-600">Logo, charte graphique, identité visuelle</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Consulting</h3>
              <p className="text-sm text-gray-600">Stratégie, gestion, finance, RH</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Prêt à démarrer ?</h2>
        <p className="text-gray-600 mb-6">Contactez-nous pour une solution personnalisée</p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
          Demander un devis
        </button>
      </div>
    </div>
  );
};

export default Business;
