import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils';
import { MobilePayment } from '../../shared/components/ui/MobilePayment';

// Mock du service de paiement
vi.mock('../../shared/services/mobilePayment', () => ({
  mobilePaymentService: {
    detectProvider: vi.fn((phone) => {
      if (phone.startsWith('07')) {
        return { id: 'orange', name: 'Orange Money', icon: '🟠', color: '#FF6600' };
      }
      return null;
    }),
    validateMobileNumber: vi.fn((phone) => phone.length === 8),
    initiatePayment: vi.fn().mockResolvedValue({
      success: true,
      transactionId: 'TXN_123456',
      amount: 15000,
      status: 'pending'
    })
  },
  mobileProviders: [
    { id: 'orange', name: 'Orange Money', icon: '🟠', color: '#FF6600', prefixes: ['07'] }
  ]
}));

describe('Intégration Paiement Mobile', () => {
  const mockProps = {
    amount: 15000,
    serviceTitle: 'Test Service',
    onSuccess: vi.fn(),
    onCancel: vi.fn()
  };

  it('affiche le formulaire de paiement', () => {
    render(<MobilePayment {...mockProps} />);
    
    expect(screen.getByText('Paiement Mobile')).toBeInTheDocument();
    expect(screen.getByText('Test Service')).toBeInTheDocument();
    expect(screen.getByText('15 000 FCFA')).toBeInTheDocument();
  });

  it('détecte automatiquement l\'opérateur', async () => {
    render(<MobilePayment {...mockProps} />);
    
    const phoneInput = screen.getByPlaceholderText('Ex: 07123456');
    fireEvent.change(phoneInput, { target: { value: '07123456' } });
    
    await waitFor(() => {
      expect(screen.getByText('Orange Money')).toBeInTheDocument();
    });
  });

  it('effectue un paiement avec succès', async () => {
    render(<MobilePayment {...mockProps} />);
    
    const phoneInput = screen.getByPlaceholderText('Ex: 07123456');
    fireEvent.change(phoneInput, { target: { value: '07123456' } });
    
    const payButton = screen.getByText('Payer');
    fireEvent.click(payButton);
    
    await waitFor(() => {
      expect(mockProps.onSuccess).toHaveBeenCalledWith('TXN_123456');
    });
  });

  it('affiche une erreur pour un numéro invalide', async () => {
    render(<MobilePayment {...mockProps} />);
    
    const phoneInput = screen.getByPlaceholderText('Ex: 07123456');
    fireEvent.change(phoneInput, { target: { value: '123' } });
    
    const payButton = screen.getByText('Payer');
    fireEvent.click(payButton);
    
    await waitFor(() => {
      expect(screen.getByText('Numéro de téléphone invalide')).toBeInTheDocument();
    });
  });

  it('gère l\'annulation', () => {
    render(<MobilePayment {...mockProps} />);
    
    const cancelButton = screen.getByText('Annuler');
    fireEvent.click(cancelButton);
    
    expect(mockProps.onCancel).toHaveBeenCalled();
  });
});