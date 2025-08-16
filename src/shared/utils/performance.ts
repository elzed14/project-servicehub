// Utilitaires de performance
export const performance = {
  // Debounce pour les recherches
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },

  // Throttle pour les événements fréquents
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Mesure de performance
  measure: (name: string, fn: () => void): void => {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`⚡ ${name}: ${(end - start).toFixed(2)}ms`);
  },

  // Optimisation des images
  optimizeImage: (url: string, width?: number): string => {
    if (!width) return url;
    // Simulation d'optimisation d'image
    return `${url}?w=${width}&q=80&f=webp`;
  },

  // Préchargement des ressources
  preloadResource: (url: string, type: 'image' | 'script' | 'style'): void => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    document.head.appendChild(link);
  }
};