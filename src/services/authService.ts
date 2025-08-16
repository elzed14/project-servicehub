import api from './api';
import { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  location?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

const AUTH_TOKEN_KEY = 'servicehub_auth_token';
const CURRENT_USER_KEY = 'servicehub_current_user';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
      return { success: true, user: data.user, token: data.token };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const { data } = await api.post('/auth/register', credentials);
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
      return { success: true, user: data.user, token: data.token };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return !!token;
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  async restoreSession(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const { data } = await api.get('/auth/me');
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      await this.logout();
      return null;
    }
  },

  async updateProfile(updates: Partial<User>): Promise<AuthResponse> {
    try {
      const { data } = await api.put('/auth/profile', updates);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Profile update failed' };
    }
  },
};
