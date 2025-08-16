import { useState, useEffect, useCallback } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>();
  
  set<T>(key: string, data: T, ttl = 300000): void { // 5min par défaut
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    });
  }
  
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item || Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }
  
  clear(): void {
    this.cache.clear();
  }
}

const memoryCache = new MemoryCache();

export const useCache = <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = 300000
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // Vérifier le cache d'abord
    const cached = memoryCache.get<T>(key);
    if (cached) {
      setData(cached);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await fetcher();
      memoryCache.set(key, result, ttl);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const invalidate = useCallback(() => {
    memoryCache.clear();
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, invalidate };
};