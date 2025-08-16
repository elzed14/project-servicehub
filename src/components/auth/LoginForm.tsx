import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { authService, LoginCredentials } from '../../services/authService';
import { useSecurity } from '../../shared/hooks/useSecurity';
import { security } from '../../shared/utils/security';

interface LoginFormProps {
  onSuccess: (user: any) => void;
  onError: (error: string) => void;
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSuccess, onError, onSwitchToRegister }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});
  const { checkRateLimit, isRateLimited } = useSecurity();

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginCredentials> = {};

    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!security.validateEmail(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérification rate limiting
    if (!checkRateLimit('login')) {
      onError('Trop de tentatives. Veuillez patienter.');
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authService.login(formData);
      
      if (response.success && response.user) {
        onSuccess(response.user);
      } else {
        onError(response.error || 'Erreur de connexion');
      }
    } catch (error) {
      onError('Une erreur inattendue s\'est produite');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Sanitisation automatique
    const sanitizedValue = security.sanitizeHtml(value);
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name as keyof LoginCredentials]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
        <p className="mt-2 text-gray-600">
          Connectez-vous à votre compte ServiceHub
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="votre@email.com"
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Mot de passe */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Votre mot de passe"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Message rate limiting */}
        {isRateLimited && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              🚫 Trop de tentatives. Veuillez patienter avant de réessayer.
            </p>
          </div>
        )}

        {/* Bouton de connexion */}
        <button
          type="submit"
          disabled={isLoading || isRateLimited}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Connexion en cours...
            </>
          ) : (
            'Se connecter'
          )}
        </button>
      </form>

      {/* Lien vers l'inscription */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            disabled={isLoading}
          >
            Créer un compte
          </button>
        </p>
      </div>

      {/* Comptes de test */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Comptes de test :</h3>
        <div className="text-xs text-gray-600 space-y-1">
          <p><strong>Utilisateur :</strong> marie.dubois@email.com</p>
          <p><strong>Admin :</strong> admin@servicehub.com</p>
          <p><strong>Mot de passe :</strong> 123456 (pour les deux)</p>
        </div>
      </div>
    </div>
  );
}