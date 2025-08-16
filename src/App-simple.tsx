import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import BrowseServices from './components/BrowseServices';
import PostService from './components/PostService';
import ProfilePage from './components/ProfilePage';
import ContactModal from './components/ContactModal';
import AuthModal from './components/auth/AuthModal';
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

  const {
    currentView,
    selectedService,
    isContactModalOpen,
    currentUser,
    isAuthModalOpen,
    authModalMode,
  } = state;

  const renderCurrentView = () => {
    switch (currentView) {
      case 'browse':
        return <BrowseServices onContactService={handleContactService} />;
      case 'post':
        return <PostService />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage onViewChange={setCurrentView} />;
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
        unreadMessages={0}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>

      {selectedService && (
        <ContactModal
          service={selectedService}
          isOpen={isContactModalOpen}
          onClose={handleCloseContactModal}
          onOpenMessaging={() => {}}
        />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />
    </div>
  );
}

export default App;