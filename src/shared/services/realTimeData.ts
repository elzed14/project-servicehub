// Service de données en temps réel
interface RealTimeStats {
  totalUsers: number;
  activeExperts: number;
  completedServices: number;
  averageRating: number;
  monthlyTransactions: number;
  totalRevenue: number;
  lastUpdated: Date;
}

class RealTimeDataService {
  private stats: RealTimeStats;
  private listeners: ((stats: RealTimeStats) => void)[] = [];

  constructor() {
    // Données initiales réelles (lancement)
    this.stats = {
      totalUsers: 0,
      activeExperts: 0,
      completedServices: 0,
      averageRating: 0,
      monthlyTransactions: 0,
      totalRevenue: 0,
      lastUpdated: new Date()
    };

    this.loadFromStorage();
    this.startAutoUpdate();
  }

  // Charger depuis localStorage
  private loadFromStorage() {
    const saved = localStorage.getItem('servicehub_stats');
    if (saved) {
      this.stats = { ...this.stats, ...JSON.parse(saved) };
    }
  }

  // Sauvegarder dans localStorage
  private saveToStorage() {
    localStorage.setItem('servicehub_stats', JSON.stringify(this.stats));
  }

  // Mise à jour automatique (simulation croissance)
  private startAutoUpdate() {
    setInterval(() => {
      // Croissance organique simulée
      const growth = Math.random() * 0.1; // 0-10% de croissance
      
      this.stats.totalUsers += Math.floor(Math.random() * 3); // 0-2 nouveaux utilisateurs
      this.stats.activeExperts += Math.floor(Math.random() * 2); // 0-1 nouvel expert
      
      if (Math.random() > 0.7) { // 30% de chance
        this.stats.completedServices += 1;
        this.stats.monthlyTransactions += Math.floor(Math.random() * 50000) + 10000; // 10k-60k FCFA
        this.stats.totalRevenue += Math.floor(this.stats.monthlyTransactions * 0.075); // 7.5% commission
      }

      // Recalculer la note moyenne
      if (this.stats.completedServices > 0) {
        this.stats.averageRating = Math.min(5, 4.2 + (this.stats.completedServices * 0.001));
      }

      this.stats.lastUpdated = new Date();
      this.saveToStorage();
      this.notifyListeners();
    }, 30000); // Mise à jour toutes les 30 secondes
  }

  // Ajouter un listener
  subscribe(callback: (stats: RealTimeStats) => void) {
    this.listeners.push(callback);
    callback(this.stats); // Appel immédiat
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // Notifier les listeners
  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.stats));
  }

  // Actions utilisateur (appelées lors d'interactions)
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
    
    // Recalculer moyenne
    const totalRating = this.stats.averageRating * (this.stats.completedServices - 1) + rating;
    this.stats.averageRating = totalRating / this.stats.completedServices;
    
    this.saveToStorage();
    this.notifyListeners();
  }

  // Obtenir les stats actuelles
  getStats(): RealTimeStats {
    return { ...this.stats };
  }

  // Reset pour tests
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

export const realTimeDataService = new RealTimeDataService();
export type { RealTimeStats };