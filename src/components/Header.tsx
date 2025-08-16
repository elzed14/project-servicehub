import React, { useState } from 'react';
import { User, Plus, Search, Settings, MessageCircle, LogOut, ChevronDown, Home } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  currentView?: string;
  onViewChange?: (view: string) => void;
  onOpenMessaging?: () => void;
  unreadMessages?: number;
}

export default function Header({ unreadMessages = 0 }: HeaderProps) {
  const { state, openAuthModal, logout } = useAppContext();
  const { currentUser } = state;
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
  };

  const navigation = [
    { path: '/', label: 'Accueil', icon: Home },
    { path: '/browse', label: 'Trouver des services', icon: Search },
    { path: '/become-expert', label: 'Devenir expert', icon: Plus },
    { path: '/how-it-works', label: 'Comment ça marche', icon: Settings }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              ServiceHub
            </button>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                {/* Messages */}
                <button
                  onClick={() => navigate('/messages')}
                  className="relative flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Messages</span>
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadMessages > 9 ? '9+' : unreadMessages}
                    </span>
                  )}
                </button>

                {/* Menu utilisateur */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="hidden sm:inline">{currentUser.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Menu déroulant */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/profile');
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Mon profil
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/become-expert');
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-3" />
                        Publier un service
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Se déconnecter
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Se connecter
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  S'inscrire
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="flex overflow-x-auto">
          {navigation.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium transition-colors min-w-0 ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}