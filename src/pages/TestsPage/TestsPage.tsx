import React, { useState } from 'react';
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Activity,
  Shield,
  Zap
} from 'lucide-react';
import { Card, Button } from '../../shared/components/ui';

export const TestsPage: React.FC = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    
    // Simulation des résultats de tests
    setTimeout(() => {
      setTestResults({
        total: 24,
        passed: 22,
        failed: 2,
        coverage: 85,
        suites: [
          {
            name: 'Composants UI',
            tests: 8,
            passed: 8,
            failed: 0,
            details: ['Button', 'Input', 'Card', 'Modal']
          },
          {
            name: 'Services',
            tests: 6,
            passed: 5,
            failed: 1,
            details: ['mobilePayment', 'notifications', 'geolocation']
          },
          {
            name: 'Sécurité',
            tests: 5,
            passed: 5,
            failed: 0,
            details: ['sanitization', 'validation', 'rateLimiting']
          },
          {
            name: 'Performance',
            tests: 3,
            passed: 2,
            failed: 1,
            details: ['cache', 'lazyLoading']
          },
          {
            name: 'Intégration',
            tests: 2,
            passed: 2,
            failed: 0,
            details: ['payment', 'auth']
          }
        ]
      });
      setIsRunning(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧪 Tests & Qualité
          </h1>
          <p className="text-xl text-gray-600">
            Phase 6 : Tests unitaires, intégration et couverture de code
          </p>
        </div>

        {/* Actions */}
        <div className="text-center mb-8">
          <Button
            onClick={runTests}
            disabled={isRunning}
            className="mr-4"
          >
            {isRunning ? (
              <>
                <Activity className="w-4 h-4 animate-spin mr-2" />
                Tests en cours...
              </>
            ) : (
              <>
                <TestTube className="w-4 h-4 mr-2" />
                Lancer les tests
              </>
            )}
          </Button>
        </div>

        {/* Résultats globaux */}
        {testResults && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 text-center">
              <TestTube className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {testResults.total}
              </div>
              <div className="text-sm text-gray-600">Tests totaux</div>
            </Card>

            <Card className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {testResults.passed}
              </div>
              <div className="text-sm text-gray-600">Tests réussis</div>
            </Card>

            <Card className="p-6 text-center">
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">
                {testResults.failed}
              </div>
              <div className="text-sm text-gray-600">Tests échoués</div>
            </Card>

            <Card className="p-6 text-center">
              <Shield className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {testResults.coverage}%
              </div>
              <div className="text-sm text-gray-600">Couverture</div>
            </Card>
          </div>
        )}

        {/* Détails par suite */}
        {testResults && (
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {testResults.suites.map((suite: any, index: number) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{suite.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 font-medium">
                      {suite.passed}
                    </span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600">
                      {suite.tests}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {suite.details.map((detail: string, i: number) => (
                    <div key={i} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
                
                {suite.failed > 0 && (
                  <div className="mt-3 p-2 bg-red-50 rounded text-sm text-red-600">
                    {suite.failed} test(s) échoué(s)
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Types de tests */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <TestTube className="w-6 h-6 text-blue-500 mr-2" />
              <h3 className="text-xl font-semibold">Tests Unitaires</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>✅ Composants UI (Button, Input, Card)</div>
              <div>✅ Services métier (paiement, notifications)</div>
              <div>✅ Utilitaires (sécurité, performance)</div>
              <div>✅ Hooks personnalisés</div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-green-500 mr-2" />
              <h3 className="text-xl font-semibold">Tests d'Intégration</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>✅ Flux de paiement complet</div>
              <div>✅ Authentification sécurisée</div>
              <div>✅ Géolocalisation + services</div>
              <div>✅ Notifications push</div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Zap className="w-6 h-6 text-purple-500 mr-2" />
              <h3 className="text-xl font-semibold">Tests de Performance</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>✅ Temps de chargement</div>
              <div>✅ Utilisation mémoire</div>
              <div>✅ Cache et lazy loading</div>
              <div>✅ Listes virtualisées</div>
            </div>
          </Card>
        </div>

        {/* Commandes de test */}
        <Card className="p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4">Commandes de test</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono">
              npm run test
            </div>
            <div className="text-gray-600">Lancer tous les tests</div>
            
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono">
              npm run test:coverage
            </div>
            <div className="text-gray-600">Tests avec couverture</div>
            
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono">
              npm run test:ui
            </div>
            <div className="text-gray-600">Interface graphique</div>
            
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono">
              npm run test:watch
            </div>
            <div className="text-gray-600">Mode surveillance</div>
          </div>
        </Card>
      </div>
    </div>
  );
};