import React, { useState } from 'react';
import { 
  Zap, 
  Database, 
  Image, 
  Activity,
  Clock,
  MemoryStick
} from 'lucide-react';
import { 
  Card, 
  Button, 
  VirtualList,
  OptimizedImage
} from '../../shared/components/ui';
import { useCache } from '../../shared/hooks/useCache';
import { usePerformanceMonitor } from '../../shared/hooks/usePerformanceMonitor';
import { performance } from '../../shared/utils/performance';

export const PerformancePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { metrics, logMetrics } = usePerformanceMonitor();

  // Démonstration du cache
  const { data: cachedData, loading } = useCache(
    'demo-data',
    async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Service ${i + 1}`,
        description: `Description du service ${i + 1}`
      }));
    }
  );

  // Démonstration du debounce
  const debouncedSearch = performance.debounce((term: string) => {
    console.log('Recherche:', term);
  }, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ⚡ Performance & Optimisation
          </h1>
          <p className="text-xl text-gray-600">
            Phase 5 : Lazy loading, cache, monitoring et optimisations
          </p>
        </div>

        {/* Métriques de performance */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {metrics.loadTime.toFixed(0)}ms
            </div>
            <div className="text-sm text-gray-600">Temps de chargement</div>
          </Card>

          <Card className="p-6 text-center">
            <Activity className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {metrics.fps}
            </div>
            <div className="text-sm text-gray-600">FPS</div>
          </Card>

          <Card className="p-6 text-center">
            <MemoryStick className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {metrics.memoryUsage}MB
            </div>
            <div className="text-sm text-gray-600">Mémoire utilisée</div>
          </Card>

          <Card className="p-6 text-center">
            <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">
              {metrics.renderTime.toFixed(0)}ms
            </div>
            <div className="text-sm text-gray-600">Temps de rendu</div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Cache et données */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Database className="w-6 h-6 text-blue-500 mr-2" />
              <h3 className="text-xl font-semibold">Cache Intelligent</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Données en cache :</span>
                <span className="font-medium">
                  {loading ? 'Chargement...' : `${cachedData?.length || 0} éléments`}
                </span>
              </div>
              
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div className="font-medium mb-1">Avantages du cache :</div>
                <ul className="text-gray-600 space-y-1">
                  <li>• Réduction des appels API</li>
                  <li>• Temps de réponse plus rapide</li>
                  <li>• Meilleure expérience utilisateur</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Optimisation des images */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Image className="w-6 h-6 text-green-500 mr-2" />
              <h3 className="text-xl font-semibold">Images Optimisées</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-2">Image normale</div>
                  <img 
                    src="https://picsum.photos/150/100" 
                    alt="Normal"
                    className="w-full rounded"
                  />
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2">Image optimisée</div>
                  <OptimizedImage
                    src="https://picsum.photos/150/100"
                    alt="Optimisée"
                    width={150}
                    className="w-full rounded"
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div className="font-medium mb-1">Optimisations :</div>
                <ul className="text-gray-600 space-y-1">
                  <li>• Lazy loading automatique</li>
                  <li>• Compression WebP</li>
                  <li>• Placeholder pendant chargement</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Recherche avec debounce */}
        <Card className="p-6 mt-8">
          <div className="flex items-center mb-4">
            <Zap className="w-6 h-6 text-yellow-500 mr-2" />
            <h3 className="text-xl font-semibold">Recherche Optimisée</h3>
          </div>
          
          <div className="space-y-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Tapez pour tester le debounce..."
              className="w-full p-3 border rounded-lg"
            />
            
            <div className="text-sm text-gray-600">
              La recherche est déclenchée 300ms après l'arrêt de la saisie (debounce)
            </div>
          </div>
        </Card>

        {/* Liste virtualisée */}
        {cachedData && (
          <Card className="p-6 mt-8">
            <div className="flex items-center mb-4">
              <Activity className="w-6 h-6 text-purple-500 mr-2" />
              <h3 className="text-xl font-semibold">Liste Virtualisée</h3>
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              Affichage de {cachedData.length} éléments avec virtualisation
            </div>
            
            <VirtualList
              items={cachedData}
              itemHeight={60}
              containerHeight={300}
              renderItem={(item, index) => (
                <div className="p-3 border-b hover:bg-gray-50 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                  </div>
                </div>
              )}
            />
          </Card>
        )}

        {/* Actions */}
        <div className="mt-8 text-center">
          <Button onClick={logMetrics} className="mr-4">
            📊 Afficher les métriques
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
          >
            🔄 Recharger la page
          </Button>
        </div>
      </div>
    </div>
  );
};