import React, { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import { MobilePayment } from '../../shared/components/ui/MobilePayment';
import { notificationService } from '../../shared/services/notifications';

interface PaymentPageProps {
  service: {
    id: string;
    title: string;
    price: number;
    provider: string;
  };
  onBack: () => void;
  onSuccess: () => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({
  service,
  onBack,
  onSuccess
}) => {
  const [paymentStep, setPaymentStep] = useState<'select' | 'mobile' | 'success'>('select');
  const [transactionId, setTransactionId] = useState('');

  const handleMobilePayment = () => {
    setPaymentStep('mobile');
  };

  const handlePaymentSuccess = (txnId: string) => {
    setTransactionId(txnId);
    setPaymentStep('success');
    
    // Notification de succès
    notificationService.notifyPaymentSuccess(service.price);
    notificationService.notifyServiceBooked(service.title);
    
    setTimeout(() => {
      onSuccess();
    }, 3000);
  };

  const handlePaymentCancel = () => {
    setPaymentStep('select');
  };

  if (paymentStep === 'success') {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Card className="text-center p-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Paiement réussi !
          </h2>
          <p className="text-gray-600 mb-4">
            Votre réservation est confirmée
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600">Transaction ID</p>
            <p className="font-mono text-sm">{transactionId}</p>
          </div>
          <p className="text-sm text-gray-500">
            Redirection automatique...
          </p>
        </Card>
      </div>
    );
  }

  if (paymentStep === 'mobile') {
    return (
      <div className="max-w-md mx-auto mt-8">
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={handlePaymentCancel}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
        
        <MobilePayment
          amount={service.price}
          serviceTitle={service.title}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Service :</span>
              <span className="font-medium">{service.title}</span>
            </div>
            <div className="flex justify-between">
              <span>Prestataire :</span>
              <span>{service.provider}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-3">
              <span>Total :</span>
              <span className="text-green-600">
                {service.price.toLocaleString()} FCFA
              </span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Choisir un moyen de paiement</h3>
        
        <Button
          onClick={handleMobilePayment}
          className="w-full mb-3 h-12 text-left justify-start"
        >
          <div className="flex items-center">
            <span className="text-2xl mr-3">📱</span>
            <div>
              <div className="font-medium">Paiement Mobile</div>
              <div className="text-sm opacity-75">
                Orange Money, MTN, Moov Money
              </div>
            </div>
          </div>
        </Button>
      </Card>
    </div>
  );
};