import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'test' ? 'http://localhost:3001/api' : import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('servicehub_auth_token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post<{ token: string }>('/auth/refresh-token', {}, {
          baseURL: process.env.NODE_ENV === 'test' ? 'http://localhost:3001/api' : import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
          withCredentials: true,
        });
        localStorage.setItem('servicehub_auth_token', data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Gérer l'échec du rafraîchissement du token (par exemple, déconnecter l'utilisateur)
        console.error('Unable to refresh token', refreshError);
        localStorage.removeItem('servicehub_auth_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
