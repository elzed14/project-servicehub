import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import QuickAuth from './QuickAuth';
import { User } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'login' }: AuthModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Réinitialiser les états quand la modal s'ouvre/ferme
  React.useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  const handleSuccess = (user: User) => {
    setError(null);
    setSuccess('Connexion réussie !');
    
    // Fermer la modal après un court délai
    setTimeout(() => {
      onAuthSuccess(user);
      onClose();
      setSuccess(null);
    }, 1000);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setSuccess(null);
  };



  const handleClose = () => {
    setError(null);
    setSuccess(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all">
          {/* Header avec bouton de fermeture */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contenu de la modal */}
          <div className="p-6 pt-12">
            {/* Messages d'erreur et de succès */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-800 font-medium">Erreur</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-green-800 font-medium">Succès</p>
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            )}

            {/* Formulaire d'authentification rapide */}
            <QuickAuth
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}