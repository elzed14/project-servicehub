// Middleware pour les en-têtes de sécurité HTTP
export const securityHeaders = {
  // Configuration des en-têtes de sécurité
  getHeaders: () => ({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  }),

  // Validation CORS sécurisée
  validateOrigin: (origin: string): boolean => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3001',
      'https://project-j4s6yusrf-elzeds-projects.vercel.app'
    ];
    return allowedOrigins.includes(origin);
  },

  // Configuration CSP (Content Security Policy)
  getCSP: (): string => {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.servicehub.com",
      "frame-ancestors 'none'",
      "base-uri 'self'"
    ].join('; ');
  }
};