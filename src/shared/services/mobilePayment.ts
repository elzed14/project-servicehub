// Service de paiement mobile local
export interface MobilePaymentProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  prefixes: string[];
}

export const mobileProviders: MobilePaymentProvider[] = [
  {
    id: 'celtis',
    name: 'Celtis Money',
    icon: '🟢',
    color: '#00AA44',
    prefixes: ['07', '77', '78']
  },
  {
    id: 'mtn',
    name: 'MTN Mobile Money',
    icon: '🟡',
    color: '#FFCC00',
    prefixes: ['06', '67', '68']
  },
  {
    id: 'moov',
    name: 'Moov Money',
    icon: '🔵',
    color: '#0066CC',
    prefixes: ['05', '96', '97']
  }
];

export const mobilePaymentService = {
  // Détecter le provider par numéro
  detectProvider: (phoneNumber: string): MobilePaymentProvider | null => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const prefix = cleanNumber.substring(0, 2);
    
    return mobileProviders.find(provider => 
      provider.prefixes.includes(prefix)
    ) || null;
  },

  // Valider numéro mobile
  validateMobileNumber: (phoneNumber: string): boolean => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    return cleanNumber.length === 8 && /^[0-9]+$/.test(cleanNumber);
  },

  // Initier paiement
  initiatePayment: async (data: {
    phoneNumber: string;
    amount: number;
    serviceId: string;
    description: string;
  }) => {
    const provider = mobilePaymentService.detectProvider(data.phoneNumber);
    
    if (!provider) {
      throw new Error('Opérateur non supporté');
    }

    // Simulation API paiement mobile
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `TXN_${Date.now()}`,
          provider: provider.name,
          amount: data.amount,
          status: 'pending'
        });
      }, 2000);
    });
  }
};