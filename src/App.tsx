import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import BrowseServices from './components/BrowseServices';
import PostService from './components/PostService';
import ProfilePage from './components/ProfilePage';
import ContactModal from './components/ContactModal';
import AuthModal from './components/auth/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationContainer from './components/NotificationContainer';
import { useAppContext } from './context/AppContext';
import { useNotifications } from './hooks/useNotifications';

function App() {
  const {
    state,
    setCurrentView,
    handleContactService,
    handleCloseContactModal,
    closeAuthModal,
  } = useAppContext();

  const { notifications, removeNotification, success } = useNotifications();
  const [unreadMessages] = useState(2);

  const {
    currentView,
    selectedService,
    isContactModalOpen,
    currentUser,
    isAuthModalOpen,
    authModalMode,
  } = state;

  const renderCurrentView = () => {
    try {
      switch (currentView) {
        case 'browse':
          return (
            <BrowseServices 
              onContactService={handleContactService}
              onOrderService={(service, options) => {
                success('Commande initiée avec succès !');
              }}
            />
          );
        case 'post':
          return (
            <ProtectedRoute>
              <PostService />
            </ProtectedRoute>
          );
        case 'profile':
          return (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          );
        case 'admin':
          return (
            <ProtectedRoute>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Panel d'administration</h2>
                <p className="text-gray-600">Fonctionnalité en cours de développement</p>
              </div>
            </ProtectedRoute>
          );
        case 'dashboard':
          return (
            <ProtectedRoute>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tableau de bord</h2>
                <p className="text-gray-600">Fonctionnalité en cours de développement</p>
              </div>
            </ProtectedRoute>
          );
        default:
          return <HomePage onViewChange={setCurrentView} />;
      }
    } catch (error) {
      console.error('Erreur de rendu:', error);
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="text-gray-600">Une erreur s'est produite.</p>
          <button 
            onClick={() => setCurrentView('home')} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Retour à l'accueil
          </button>
        </div>
      );
    }
  };

  const handleAuthSuccess = (user: any) => {
    success(`Bienvenue ${user.name} !`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenMessaging={() => {}}
        unreadMessages={unreadMessages}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>

      {selectedService && isContactModalOpen && (
        <ContactModal
          service={selectedService}
          isOpen={isContactModalOpen}
          onClose={handleCloseContactModal}
          onOpenMessaging={() => {}}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
          onAuthSuccess={handleAuthSuccess}
          initialMode={authModalMode}
        />
      )}

      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />
    </div>
  );
}

export default App;