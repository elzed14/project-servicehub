import React, { useState } from 'react';
import { CheckCircle, Star, DollarSign, Users } from 'lucide-react';

const BecomeExpert: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    expertise: '',
    experience: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'inscription expert
    alert('Demande envoyée! Nous vous contacterons sous 24h.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Devenez Expert ServiceHub</h1>
        <p className="text-xl text-gray-600">Gagnez de l'argent en partageant vos compétences</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Pourquoi devenir expert ?</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Revenus supplémentaires</h3>
                <p className="text-gray-600">Gagnez de l'argent en utilisant vos compétences</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Flexibilité totale</h3>
                <p className="text-gray-600">Travaillez quand vous voulez, où vous voulez</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Réputation</h3>
                <p className="text-gray-600">Construisez votre réputation et votre clientèle</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Formulaire d'inscription</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom complet</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Domaine d'expertise</label>
              <select
                name="expertise"
                value={formData.expertise}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              >
                <option value="">Sélectionnez un domaine</option>
                <option value="web">Développement web</option>
                <option value="design">Design graphique</option>
                <option value="marketing">Marketing digital</option>
                <option value="writing">Rédaction</option>
                <option value="video">Vidéo et animation</option>
                <option value="business">Business et conseil</option>
                <option value="tech">Technologie</option>
                <option value="lifestyle">Lifestyle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Années d'expérience</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              >
                <option value="">Sélectionnez</option>
                <option value="0-1">0-1 an</option>
                <option value="1-3">1-3 ans</option>
                <option value="3-5">3-5 ans</option>
                <option value="5-10">5-10 ans</option>
                <option value="10+">10+ ans</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description de vos services</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Décrivez les services que vous proposez..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Devenir Expert
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeExpert;
