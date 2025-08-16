// Utilitaires de sécurité
export const security = {
  // Sanitisation XSS
  sanitizeHtml: (input: string): string => {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  // Validation email sécurisée
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  },

  // Validation mot de passe fort
  validatePassword: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) errors.push('Au moins 8 caractères');
    if (!/[A-Z]/.test(password)) errors.push('Une majuscule');
    if (!/[a-z]/.test(password)) errors.push('Une minuscule');
    if (!/\d/.test(password)) errors.push('Un chiffre');
    
    return { isValid: errors.length === 0, errors };
  },

  // Rate limiting côté client
  rateLimiter: (() => {
    const attempts = new Map<string, { count: number; resetTime: number }>();
    
    return (key: string, maxAttempts = 5, windowMs = 60000) => {
      const now = Date.now();
      const record = attempts.get(key);
      
      if (!record || now > record.resetTime) {
        attempts.set(key, { count: 1, resetTime: now + windowMs });
        return true;
      }
      
      if (record.count >= maxAttempts) return false;
      
      record.count++;
      return true;
    };
  })(),

  // Génération de token CSRF
  generateCSRFToken: (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
};