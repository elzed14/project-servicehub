import { useState, useCallback } from 'react';
import { security } from '../utils/security';

export const useSecurity = () => {
  const [csrfToken] = useState(() => security.generateCSRFToken());
  const [isRateLimited, setIsRateLimited] = useState(false);

  const checkRateLimit = useCallback((action: string) => {
    const allowed = security.rateLimiter(action);
    setIsRateLimited(!allowed);
    return allowed;
  }, []);

  const secureRequest = useCallback(async (
    url: string, 
    options: RequestInit = {}
  ) => {
    // Ajout du token CSRF
    const headers = {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
      ...options.headers
    };

    // Vérification rate limit
    if (!checkRateLimit(url)) {
      throw new Error('Trop de tentatives. Veuillez patienter.');
    }

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }
      
      return response;
    } catch (error) {
      console.error('Erreur sécurisée:', error);
      throw error;
    }
  }, [csrfToken, checkRateLimit]);

  return {
    csrfToken,
    isRateLimited,
    checkRateLimit,
    secureRequest,
    sanitize: security.sanitizeHtml,
    validateEmail: security.validateEmail,
    validatePassword: security.validatePassword
  };
};