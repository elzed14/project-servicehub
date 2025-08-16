import React, { useState, useEffect } from 'react';
import { ThumbTackHomePage } from './pages/ThumbTackHomePage/ThumbTackHomePage';
import { ProfessionalHeader } from './shared/components/ui/ProfessionalHeader';
import { FunctionalAuthModal } from './shared/components/auth/FunctionalAuthModal';
import { FunctionalSearchPage } from './pages/FunctionalSearchPage/FunctionalSearchPage';
import { ExpertProfilePage } from './pages/ExpertProfilePage/ExpertProfilePage';
import { MessagingPage } from './pages/MessagingPage/MessagingPage';
import { Routes, Route } from 'react-router-dom';
import BecomeExpert from './pages/BecomeExpert';
import Business from './pages/Business';
import HowItWorks from './pages/HowItWorks';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loggedUser, setLoggedUser] = useState(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  const success = (message: string) => {
    const notification = { id: Date.now(), message, type: 'success' };
    setNotifications(prev => [...prev, notification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 3000);
  };

  // Gérer la navigation par hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setCurrentView(hash);
      }
    };
    
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'browse':
      case 'search':
        return <FunctionalSearchPage />;
      case 'expert':
        return <ExpertProfilePage />;
      case 'messages':
        return <MessagingPage />;
      default:
        return <ThumbTackHomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalHeader 
        onLogin={() => { setAuthMode('login'); setShowAuthModal(true); }}
        onRegister={() => { setAuthMode('register'); setShowAuthModal(true); }}
        currentUser={loggedUser}
        onLogout={() => setLoggedUser(null)}
      />
      
      <main>
        <Routes>
          <Route path="/" element={<ThumbTackHomePage />} />
          <Route path="/browse" element={<FunctionalSearchPage />} />
          <Route path="/search" element={<FunctionalSearchPage />} />
          <Route path="/expert" element={<ExpertProfilePage />} />
          <Route path="/messages" element={<MessagingPage />} />
          <Route path="/become-expert" element={<BecomeExpert />} />
          <Route path="/business" element={<Business />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
        </Routes>
      </main>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
            >
              {notification.message}
            </div>
          ))}
        </div>
      )}

      <FunctionalAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(user) => {
          setLoggedUser(user);
          success(`Bienvenue ${user.name} !`);
        }}
        initialMode={authMode}
      />
    </div>
  );
}

export default App;