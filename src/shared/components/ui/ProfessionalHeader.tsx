import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, Bell, MessageCircle, Search } from 'lucide-react';
import { ModernButton } from './ModernButton';

interface ProfessionalHeaderProps {
  onLogin?: () => void;
  onRegister?: () => void;
  currentUser?: any;
  onLogout?: () => void;
}

export const ProfessionalHeader: React.FC<ProfessionalHeaderProps> = ({
  onLogin,
  onRegister,
  currentUser,
  onLogout
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Trouver un service', href: '#' },
    { name: 'Devenir expert', href: '#' },
    { name: 'Comment ça marche', href: '#' },
    { name: 'Entreprises', href: '#' }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">ServiceHub</span>
            </motion.div>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative">
                  <MessageCircle className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></span>
                </button>
                <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <User className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={onLogin}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Se connecter
                </button>
                <ModernButton size="sm" onClick={onRegister}>
                  S'inscrire
                </ModernButton>
              </>
            )}

            {/* Menu Mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t border-gray-100"
          >
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};