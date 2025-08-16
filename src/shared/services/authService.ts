// Service d'authentification connecté à l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  location: string;
  isExpert?: boolean;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: any;
  message?: string;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('servicehub_token');
  }

  // Inscription
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success && result.token) {
        this.token = result.token;
        localStorage.setItem('servicehub_token', result.token);
        localStorage.setItem('servicehub_user', JSON.stringify(result.user));
      }

      return result;
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: 'Erreur de connexion au serveur'
      };
    }
  }

  // Connexion
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success && result.token) {
        this.token = result.token;
        localStorage.setItem('servicehub_token', result.token);
        localStorage.setItem('servicehub_user', JSON.stringify(result.user));
      }

      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Erreur de connexion au serveur'
      };
    }
  }

  // Déconnexion
  logout(): void {
    this.token = null;
    localStorage.removeItem('servicehub_token');
    localStorage.removeItem('servicehub_user');
  }

  // Vérifier si connecté
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Obtenir le token
  getToken(): string | null {
    return this.token;
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser(): any | null {
    const userStr = localStorage.getItem('servicehub_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Headers avec authentification
  getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Vérifier la validité du token
  async verifyToken(): Promise<boolean> {
    if (!this.token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      
      if (!result.success) {
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token verification error:', error);
      this.logout();
      return false;
    }
  }
}

export const authService = new AuthService();
export type { LoginData, RegisterData, AuthResponse };