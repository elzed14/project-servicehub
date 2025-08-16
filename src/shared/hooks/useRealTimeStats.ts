import { useState, useEffect } from 'react';

interface RealTimeStats {
  totalUsers: number;
  activeExperts: number;
  completedServices: number;
  averageRating: number;
  monthlyTransactions: number;
  totalRevenue: number;
  lastUpdated: Date;
}

// Service de données en temps réel simplifié
class RealTimeStatsService {
  private stats: RealTimeStats;
  private listeners: ((stats: RealTimeStats) => void)[] = [];

  constructor() {
    this.stats = {
      totalUsers: 1247,
      activeExperts: 89,
      completedServices: 2156,
      averageRating: 4.8,
      monthlyTransactions: 450000,
      totalRevenue: 125000,
      lastUpdated: new Date()
    };

    this.loadFromStorage();
    this.startAutoUpdate();
  }

  private loadFromStorage() {
    const saved = localStorage.getItem('servicehub_stats');
    if (saved) {
      try {
        const parsedStats = JSON.parse(saved);
        this.stats = { ...this.stats, ...parsedStats, lastUpdated: new Date(parsedStats.lastUpdated) };
      } catch (error) {
        console.error('Error loading stats from storage:', error);
      }
    }
  }

  private saveToStorage() {
    localStorage.setItem('servicehub_stats', JSON.stringify(this.stats));
  }

  private startAutoUpdate() {
    setInterval(() => {
      // Croissance organique simulée
      this.stats.totalUsers += Math.floor(Math.random() * 3);
      this.stats.activeExperts += Math.floor(Math.random() * 2);
      
      if (Math.random() > 0.7) {
        this.stats.completedServices += 1;
        const newTransaction = Math.floor(Math.random() * 50000) + 10000;
        this.stats.monthlyTransactions += newTransaction;
        this.stats.totalRevenue += Math.floor(newTransaction * 0.075);
      }

      this.stats.lastUpdated = new Date();
      this.saveToStorage();
      this.notifyListeners();
    }, 30000);
  }

  subscribe(callback: (stats: RealTimeStats) => void) {
    this.listeners.push(callback);
    callback(this.stats);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.stats));
  }

  getStats(): RealTimeStats {
    return { ...this.stats };
  }

  addUser() {
    this.stats.totalUsers += 1;
    this.saveToStorage();
    this.notifyListeners();
  }

  addExpert() {
    this.stats.activeExperts += 1;
    this.saveToStorage();
    this.notifyListeners();
  }

  completeService(amount: number, rating: number) {
    this.stats.completedServices += 1;
    this.stats.monthlyTransactions += amount;
    this.stats.totalRevenue += Math.floor(amount * 0.075);
    
    const totalRating = this.stats.averageRating * (this.stats.completedServices - 1) + rating;
    this.stats.averageRating = totalRating / this.stats.completedServices;
    
    this.saveToStorage();
    this.notifyListeners();
  }

  reset() {
    this.stats = {
      totalUsers: 0,
      activeExperts: 0,
      completedServices: 0,
      averageRating: 0,
      monthlyTransactions: 0,
      totalRevenue: 0,
      lastUpdated: new Date()
    };
    this.saveToStorage();
    this.notifyListeners();
  }
}

const realTimeStatsService = new RealTimeStatsService();

export const useRealTimeStats = () => {
  const [stats, setStats] = useState<RealTimeStats>(realTimeStatsService.getStats());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    
    const unsubscribe = realTimeStatsService.subscribe((newStats) => {
      setStats(newStats);
    });

    return unsubscribe;
  }, []);

  return {
    stats,
    isLoading,
    addUser: () => realTimeStatsService.addUser(),
    addExpert: () => realTimeStatsService.addExpert(),
    completeService: (amount: number, rating: number) => 
      realTimeStatsService.completeService(amount, rating),
    reset: () => realTimeStatsService.reset()
  };
};