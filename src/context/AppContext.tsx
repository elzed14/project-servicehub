import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Service, User } from '../types';
import { authService } from '../services/authService';

// Interface pour l'état d'authentification
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Interface pour l'état global de l'application
export interface AppState {
  currentView: string;
  selectedService: Service | null;
  isContactModalOpen: boolean;
  isMessagingOpen: boolean;
  initialConversationId: string | undefined;
  currentUser: User | null;
  // États d'authentification
  auth: AuthState;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
}

// Types d'actions pour le reducer
export type AppAction =
  | { type: 'SET_CURRENT_VIEW'; payload: string }
  | { type: 'SET_SELECTED_SERVICE'; payload: Service | null }
  | { type: 'SET_CONTACT_MODAL_OPEN'; payload: boolean }
  | { type: 'SET_MESSAGING_OPEN'; payload: boolean }
  | { type: 'SET_INITIAL_CONVERSATION_ID'; payload: string | undefined }
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'OPEN_CONTACT_MODAL'; payload: Service }
  | { type: 'CLOSE_CONTACT_MODAL' }
  | { type: 'OPEN_MESSAGING'; payload: { serviceId?: string; providerId?: string } }
  | { type: 'CLOSE_MESSAGING' }
  // Actions d'authentification
  | { type: 'AUTH_LOADING'; payload: boolean }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_AUTH_ERROR' }
  | { type: 'OPEN_AUTH_MODAL'; payload: 'login' | 'register' }
  | { type: 'CLOSE_AUTH_MODAL' }
  | { type: 'SET_AUTH_MODAL_MODE'; payload: 'login' | 'register' }
  | { type: 'RESTORE_SESSION'; payload: User | null };

// État initial de l'application
const initialState: AppState = {
  currentView: 'home',
  selectedService: null,
  isContactModalOpen: false,
  isMessagingOpen: false,
  initialConversationId: undefined,
  currentUser: null,
  // États d'authentification
  auth: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },
  isAuthModalOpen: false,
  authModalMode: 'login',
};

// Reducer pour gérer les mises à jour d'état
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload };
    
    case 'SET_SELECTED_SERVICE':
      return { ...state, selectedService: action.payload };
    
    case 'SET_CONTACT_MODAL_OPEN':
      return { ...state, isContactModalOpen: action.payload };
    
    case 'SET_MESSAGING_OPEN':
      return { ...state, isMessagingOpen: action.payload };
    
    case 'SET_INITIAL_CONVERSATION_ID':
      return { ...state, initialConversationId: action.payload };
    
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    
    case 'OPEN_CONTACT_MODAL':
      return {
        ...state,
        selectedService: action.payload,
        isContactModalOpen: true,
      };
    
    case 'CLOSE_CONTACT_MODAL':
      return {
        ...state,
        isContactModalOpen: false,
        selectedService: null,
      };
    
    case 'OPEN_MESSAGING':
      const { serviceId, providerId } = action.payload;
      return {
        ...state,
        isMessagingOpen: true,
        initialConversationId: serviceId && providerId ? '1' : undefined, // Mock conversation ID
      };
    
    case 'CLOSE_MESSAGING':
      return {
        ...state,
        isMessagingOpen: false,
        initialConversationId: undefined,
      };

    // Actions d'authentification
    case 'AUTH_LOADING':
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: action.payload,
          error: action.payload ? null : state.auth.error,
        },
      };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        currentUser: action.payload,
        auth: {
          user: action.payload,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
        isAuthModalOpen: false,
      };

    case 'AUTH_ERROR':
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: false,
          error: action.payload,
        },
      };

    case 'AUTH_LOGOUT':
      return {
        ...state,
        currentUser: null,
        auth: {
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        },
      };

    case 'CLEAR_AUTH_ERROR':
      return {
        ...state,
        auth: {
          ...state.auth,
          error: null,
        },
      };

    case 'OPEN_AUTH_MODAL':
      return {
        ...state,
        isAuthModalOpen: true,
        authModalMode: action.payload,
        auth: {
          ...state.auth,
          error: null,
        },
      };

    case 'CLOSE_AUTH_MODAL':
      return {
        ...state,
        isAuthModalOpen: false,
        auth: {
          ...state.auth,
          error: null,
        },
      };

    case 'SET_AUTH_MODAL_MODE':
      return {
        ...state,
        authModalMode: action.payload,
        auth: {
          ...state.auth,
          error: null,
        },
      };

    case 'RESTORE_SESSION':
      const user = action.payload;
      return {
        ...state,
        currentUser: user,
        auth: {
          user: user,
          isAuthenticated: !!user,
          isLoading: false,
          error: null,
        },
      };
    
    default:
      return state;
  }
};

// Interface pour le contexte
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Actions helpers
  setCurrentView: (view: string) => void;
  setSelectedService: (service: Service | null) => void;
  setContactModalOpen: (isOpen: boolean) => void;
  setMessagingOpen: (isOpen: boolean) => void;
  setInitialConversationId: (id: string | undefined) => void;
  setCurrentUser: (user: User | null) => void;
  handleContactService: (service: Service) => void;
  handleOpenMessaging: (serviceId?: string, providerId?: string) => void;
  handleCloseContactModal: () => void;
  handleCloseMessaging: () => void;
  // Actions d'authentification
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  authenticateUser: (user: User) => void;
  logout: () => Promise<void>;
  openAuthModal: (mode: 'login' | 'register') => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: 'login' | 'register') => void;
  clearAuthError: () => void;
}

// Création du contexte
const AppContext = createContext<AppContextType | undefined>(undefined);

// Props pour le provider
interface AppProviderProps {
  children: ReactNode;
}

// Composant AppProvider
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Restaurer la session au chargement
  useEffect(() => {
    const restoreSession = async () => {
      dispatch({ type: 'AUTH_LOADING', payload: true });
      try {
        // Essayer de restaurer depuis localStorage d'abord
        const savedUser = localStorage.getItem('servicehub_user');
        const savedToken = localStorage.getItem('servicehub_token');
        
        if (savedUser && savedToken) {
          const user = JSON.parse(savedUser);
          dispatch({ type: 'RESTORE_SESSION', payload: user });
          return;
        }
        
        // Sinon essayer avec le service d'auth
        const user = await authService.restoreSession();
        dispatch({ type: 'RESTORE_SESSION', payload: user });
      } catch (error) {
        dispatch({ type: 'RESTORE_SESSION', payload: null });
      }
    };

    restoreSession();
  }, []);

  // Actions helpers pour simplifier l'utilisation
  const setCurrentView = (view: string) => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: view });
  };

  const setSelectedService = (service: Service | null) => {
    dispatch({ type: 'SET_SELECTED_SERVICE', payload: service });
  };

  const setContactModalOpen = (isOpen: boolean) => {
    dispatch({ type: 'SET_CONTACT_MODAL_OPEN', payload: isOpen });
  };

  const setMessagingOpen = (isOpen: boolean) => {
    dispatch({ type: 'SET_MESSAGING_OPEN', payload: isOpen });
  };

  const setInitialConversationId = (id: string | undefined) => {
    dispatch({ type: 'SET_INITIAL_CONVERSATION_ID', payload: id });
  };

  const setCurrentUser = (user: User | null) => {
    dispatch({ type: 'SET_CURRENT_USER', payload: user });
  };

  const handleContactService = (service: Service) => {
    dispatch({ type: 'OPEN_CONTACT_MODAL', payload: service });
  };

  const handleOpenMessaging = (serviceId?: string, providerId?: string) => {
    dispatch({ type: 'OPEN_MESSAGING', payload: { serviceId, providerId } });
  };

  const handleCloseContactModal = () => {
    dispatch({ type: 'CLOSE_CONTACT_MODAL' });
  };

  const handleCloseMessaging = () => {
    dispatch({ type: 'CLOSE_MESSAGING' });
  };

  // Actions d'authentification
  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_LOADING', payload: true });
    try {
      const response = await authService.login({ email, password });
      if (response.success && response.user) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: response.error || 'Erreur de connexion' });
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: 'Une erreur inattendue s\'est produite' });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: 'AUTH_LOADING', payload: true });
    try {
      const response = await authService.register({ name, email, password });
      if (response.success && response.user) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: response.error || 'Erreur lors de l\'inscription' });
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: 'Une erreur inattendue s\'est produite' });
    }
  };

  const logout = async () => {
    dispatch({ type: 'AUTH_LOADING', payload: true });
    try {
      // Nettoyer localStorage
      localStorage.removeItem('servicehub_user');
      localStorage.removeItem('servicehub_token');
      await authService.logout();
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      // Même en cas d'erreur, on déconnecte l'utilisateur localement
      localStorage.removeItem('servicehub_user');
      localStorage.removeItem('servicehub_token');
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    dispatch({ type: 'OPEN_AUTH_MODAL', payload: mode });
  };

  const closeAuthModal = () => {
    dispatch({ type: 'CLOSE_AUTH_MODAL' });
  };

  const setAuthModalMode = (mode: 'login' | 'register') => {
    dispatch({ type: 'SET_AUTH_MODAL_MODE', payload: mode });
  };

  const clearAuthError = () => {
    dispatch({ type: 'CLEAR_AUTH_ERROR' });
  };

  // Méthode directe pour authentifier un utilisateur (pour QuickAuth)
  const authenticateUser = (user: User) => {
    // Sauvegarder dans localStorage pour la persistance
    localStorage.setItem('servicehub_user', JSON.stringify(user));
    localStorage.setItem('servicehub_token', `mock-token-${user.id}`);
    dispatch({ type: 'AUTH_SUCCESS', payload: user });
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    setCurrentView,
    setSelectedService,
    setContactModalOpen,
    setMessagingOpen,
    setInitialConversationId,
    setCurrentUser,
    handleContactService,
    handleOpenMessaging,
    handleCloseContactModal,
    handleCloseMessaging,
    // Actions d'authentification
    login,
    register,
    authenticateUser,
    logout,
    openAuthModal,
    closeAuthModal,
    setAuthModalMode,
    clearAuthError,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
