import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import { MobilePayment } from '../../shared/components/ui/MobilePayment';
import { ModernButton } from '../../shared/components/ui/ModernButton';
import { mobileProviders } from '../../shared/services/mobilePayment';

export const PaymentTestPage: React.FC = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [testAmount, setTestAmount] = useState(6000);

  const testScenarios = [
    {
      title: 'Abonnement Pro',
      amount: 6000,
      description: 'Test paiement abonnement mensuel'
    },
    {
      title: 'Listing Premium',
      amount: 4750,
      description: 'Test mise en avant 7 jours'
    },
    {
      title: 'Service Custom',
      amount: 25000,
      description: 'Test paiement service personnalisé'
    }
  ];

  const handlePaymentSuccess = (transactionId: string) => {
    setPaymentResult({
      success: true,
      transactionId,
      amount: testAmount,
      timestamp: new Date().toLocaleString()
    });
    setShowPayment(false);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setPaymentResult({
      success: false,
      message: 'Paiement annulé par l\'utilisateur'
    });
  };

  const startTest = (amount: number) => {
    setTestAmount(amount);
    setPaymentResult(null);
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            💳 Test des Moyens de Paiement
          </h1>
          <p className="text-xl text-gray-600">
            Testez les paiements mobiles intégrés à ServiceHub
          </p>
        </div>

        {/* Opérateurs supportés */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            📱 Opérateurs Supportés
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {mobileProviders.map((provider) => (
              <motion.div
                key={provider.id}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
              >
                <div className="text-4xl mb-3">{provider.icon}</div>
                <h3 className="font-bold text-lg" style={{ color: provider.color }}>
                  {provider.name}
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Préfixes: {provider.prefixes.join(', ')}
                </p>
                <div className="mt-4">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    Exemple: {provider.prefixes[0]}123456
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scénarios de test */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🧪 Scénarios de Test
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testScenarios.map((scenario, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold text-lg mb-2">{scenario.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{scenario.description}</p>
                <div className="text-2xl font-bold text-blue-600 mb-4">
                  {scenario.amount.toLocaleString()} FCFA
                </div>
                <ModernButton
                  onClick={() => startTest(scenario.amount)}
                  className="w-full"
                  size="sm"
                >
                  Tester le paiement
                </ModernButton>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Interface de paiement */}
        {showPayment && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <MobilePayment
                amount={testAmount}
                serviceTitle="Test de Paiement ServiceHub"
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
              />
            </div>
          </motion.div>
        )}

        {/* Résultat du test */}
        {paymentResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              📊 Résultat du Test
            </h2>
            
            {paymentResult.success ? (
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-600 mb-4">
                  ✅ Paiement Réussi !
                </h3>
                <div className="space-y-3 text-left max-w-md mx-auto">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-sm">{paymentResult.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant:</span>
                    <span className="font-bold">{paymentResult.amount.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date/Heure:</span>
                    <span>{paymentResult.timestamp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statut:</span>
                    <span className="text-green-600 font-medium">En attente de confirmation</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-600 mb-4">
                  ❌ Paiement Échoué
                </h3>
                <p className="text-gray-600">{paymentResult.message}</p>
              </div>
            )}

            <div className="mt-8 text-center">
              <ModernButton
                onClick={() => setPaymentResult(null)}
                variant="outline"
              >
                Nouveau Test
              </ModernButton>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 rounded-2xl p-8 mt-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">
            📋 Instructions de Test
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-blue-800 mb-3">✅ Numéros Valides</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>Celtis:</strong> 07123456, 77123456, 78123456</li>
                <li><strong>MTN:</strong> 06123456, 67123456, 68123456</li>
                <li><strong>Moov:</strong> 05123456, 96123456, 97123456</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-blue-800 mb-3">❌ Tests d'Erreur</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>Numéro court:</strong> 123 (erreur validation)</li>
                <li><strong>Préfixe inconnu:</strong> 01123456 (opérateur non supporté)</li>
                <li><strong>Caractères:</strong> 07abc123 (format invalide)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};