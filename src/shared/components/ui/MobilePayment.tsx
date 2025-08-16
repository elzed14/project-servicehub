import React, { useState } from 'react';
import { Smartphone, CreditCard, Loader2 } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import { mobilePaymentService, mobileProviders } from '../../services/mobilePayment';

interface MobilePaymentProps {
  amount: number;
  serviceTitle: string;
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

export const MobilePayment: React.FC<MobilePaymentProps> = ({
  amount,
  serviceTitle,
  onSuccess,
  onCancel
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const detectedProvider = mobilePaymentService.detectProvider(phoneNumber);

  const handlePayment = async () => {
    if (!mobilePaymentService.validateMobileNumber(phoneNumber)) {
      setError('Numéro de téléphone invalide');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await mobilePaymentService.initiatePayment({
        phoneNumber,
        amount,
        serviceId: 'service-123',
        description: serviceTitle
      });

      if (result.success) {
        onSuccess(result.transactionId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de paiement');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <CreditCard className="w-12 h-12 text-blue-500 mx-auto mb-2" />
        <h3 className="text-xl font-semibold">Paiement Mobile</h3>
        <p className="text-gray-600">{serviceTitle}</p>
        <div className="text-2xl font-bold text-green-600 mt-2">
          {amount.toLocaleString()} FCFA
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            <Smartphone className="w-4 h-4 inline mr-1" />
            Numéro de téléphone
          </label>
          <Input
            type="tel"
            value={phoneNumber}
            onChange={setPhoneNumber}
            placeholder="Ex: 07123456"
            className="text-center text-lg"
          />
          
          {detectedProvider && (
            <div className="mt-2 p-2 bg-gray-50 rounded flex items-center justify-center">
              <span className="text-2xl mr-2">{detectedProvider.icon}</span>
              <span className="font-medium" style={{ color: detectedProvider.color }}>
                {detectedProvider.name}
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            onClick={handlePayment}
            disabled={isLoading || !phoneNumber}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Paiement...
              </>
            ) : (
              'Payer'
            )}
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center mt-4">
          <p>Opérateurs supportés :</p>
          <div className="flex justify-center gap-4 mt-1">
            {mobileProviders.map(provider => (
              <span key={provider.id} className="flex items-center">
                {provider.icon} {provider.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};