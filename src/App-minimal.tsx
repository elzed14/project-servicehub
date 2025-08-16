import React, { useState } from 'react';

function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simple */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-blue-600">
              ServiceHub
            </div>
            <nav className="flex space-x-8">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'home' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                }`}
              >
                Accueil
              </button>
              <button
                onClick={() => setCurrentView('services')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'services' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                }`}
              >
                Services
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Bienvenue sur ServiceHub
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              La plateforme de services qui connecte les professionnels et les clients
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">🔍 Trouvez des services</h3>
                <p className="text-gray-600">Découvrez des professionnels qualifiés près de chez vous</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">💼 Proposez vos services</h3>
                <p className="text-gray-600">Développez votre activité en rejoignant notre communauté</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">💬 Communiquez facilement</h3>
                <p className="text-gray-600">Échangez directement avec les prestataires</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Découvrez nos services
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Image du service {i}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Service {i}</h3>
                    <p className="text-gray-600 mb-4">Description du service professionnel {i}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-green-600">50€</span>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Contacter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;