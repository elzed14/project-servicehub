// Utilitaires de debug pour ServiceHub

export const debugLog = (component: string, message: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.log(`[${component}] ${message}`, data || '');
  }
};

export const debugError = (component: string, error: any) => {
  console.error(`[${component}] Error:`, error);
};

export const debugNavigation = (from: string, to: string) => {
  debugLog('Navigation', `${from} -> ${to}`);
};

export const debugComponent = (componentName: string, props?: any) => {
  debugLog('Component', `Rendering ${componentName}`, props);
};

// Test de connectivité des composants
export const testComponents = () => {
  const components = [
    'HomePage',
    'BrowseServices', 
    'PostService',
    'ProfilePage',
    'Header',
    'AuthModal'
  ];
  
  console.log('=== Test des composants ===');
  components.forEach(comp => {
    try {
      console.log(`✅ ${comp}: OK`);
    } catch (error) {
      console.log(`❌ ${comp}: ERREUR`, error);
    }
  });
};