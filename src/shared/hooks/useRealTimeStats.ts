import { useState, useEffect } from 'react';
import { realTimeDataService, RealTimeStats } from '../services/realTimeData';

export const useRealTimeStats = () => {
  const [stats, setStats] = useState<RealTimeStats>(realTimeDataService.getStats());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    
    // S'abonner aux mises à jour
    const unsubscribe = realTimeDataService.subscribe((newStats) => {
      setStats(newStats);
    });

    return unsubscribe;
  }, []);

  return {
    stats,
    isLoading,
    // Actions pour déclencher des mises à jour
    addUser: () => realTimeDataService.addUser(),
    addExpert: () => realTimeDataService.addExpert(),
    completeService: (amount: number, rating: number) => 
      realTimeDataService.completeService(amount, rating),
    reset: () => realTimeDataService.reset()
  };
};