import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ErrorBoundary } from './shared/components/ui/ErrorBoundary';
import { ProfessionalHeader } from './shared/components/ui/ProfessionalHeader';
import { FunctionalAuthModal } from './shared/components/auth/FunctionalAuthModal';
import { ThumbTackHomePage } from './pages/ThumbTackHomePage/ThumbTackHomePage';
import { FunctionalSearchPage } from './pages/FunctionalSearchPage/FunctionalSearchPage';
import { ExpertProfilePage } from './pages/ExpertProfilePage/ExpertProfilePage';
import { MessagingPage } from './pages/MessagingPage/MessagingPage';
import BecomeExpert from './pages/BecomeExpert';
import Business from './pages/Business';
import HowItWorks from './pages/HowItWorks';
import NotificationContainer from './components/NotificationContainer';
import { useNotifications } from './hooks/useNotifications';

function AppContent() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loggedUser, setLoggedUser] = useState(null);
  const { notifications, removeNotification, success } = useNotifications();

  const handleAuthSuccess = (user: any) => {
    setLoggedUser(user);
    setShowAuthModal(false);
    success(`Bienvenue ${user.name} !`);
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
          <Route path="/expert/:expertId" element={<ExpertProfilePage />} />
          <Route path="/messages" element={<MessagingPage />} />
          <Route path="/become-expert" element={<BecomeExpert />} />
          <Route path="/business" element={<Business />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
        </Routes>
      </main>

      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />

      <FunctionalAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authMode}
      />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;