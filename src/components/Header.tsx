import React, { useState } from 'react';
import { User, Plus, Search, Settings, MessageCircle, LogOut, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onOpenMessaging: () => void;
  unreadMessages?: number;
}

export default function Header({ currentView, onViewChange, onOpenMessaging, unreadMessages = 0 }: HeaderProps) {
  const { state, openAuthModal, logout } = useAppContext();
  const { auth, currentUser } = state;
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
  };

  const handleViewChange = (view: string) => {
    onViewChange(view);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => handleViewChange('home')}
              className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              ServiceHub
            </button>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => handleViewChange('browse')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'browse' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Trouver des services</span>
            </button>
            <button
              onClick={() => handleViewChange('post')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'post' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Proposer un service</span>
            </button>
            <button
              onClick={() => handleViewChange('admin')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'admin' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            {auth.isAuthenticated && currentUser ? (
              <>
                {/* Messages - seulement pour les utilisateurs connectés */}
                <button
                  onClick={onOpenMessaging}
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
                          handleViewChange('dashboard');
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Tableau de bord
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleViewChange('profile');
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Mon profil
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
                {/* Bouton d'accès rapide */}
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Accès rapide
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="flex">
          <button
            onClick={() => handleViewChange('browse')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium transition-colors ${
              currentView === 'browse' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-700'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Trouver</span>
          </button>
          <button
            onClick={() => handleViewChange('post')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium transition-colors ${
              currentView === 'post' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-700'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Proposer</span>
          </button>
          {auth.isAuthenticated && currentUser ? (
            <>
              <button
                onClick={onOpenMessaging}
                className="flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium text-gray-700 relative"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Messages</span>
                {unreadMessages > 0 && (
                  <span className="absolute top-1 right-4 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleViewChange('admin')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium transition-colors ${
                  currentView === 'admin'
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-700'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </button>
              <button
                onClick={() => handleViewChange('profile')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium transition-colors ${
                  currentView === 'profile'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profil</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openAuthModal('login')}
                className="flex-1 flex items-center justify-center py-3 text-sm font-medium text-blue-600"
              >
                <User className="w-4 h-4 mr-1" />
                Accès
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}