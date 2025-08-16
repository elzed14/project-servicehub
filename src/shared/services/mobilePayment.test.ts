import { describe, it, expect } from 'vitest';
import { mobilePaymentService, mobileProviders } from './mobilePayment';

describe('mobilePaymentService', () => {
  describe('detectProvider', () => {
    it('détecte Orange Money correctement', () => {
      const provider = mobilePaymentService.detectProvider('07123456');
      expect(provider?.name).toBe('Orange Money');
      expect(provider?.id).toBe('orange');
    });

    it('détecte MTN Mobile Money correctement', () => {
      const provider = mobilePaymentService.detectProvider('06123456');
      expect(provider?.name).toBe('MTN Mobile Money');
      expect(provider?.id).toBe('mtn');
    });

    it('détecte Moov Money correctement', () => {
      const provider = mobilePaymentService.detectProvider('05123456');
      expect(provider?.name).toBe('Moov Money');
      expect(provider?.id).toBe('moov');
    });

    it('retourne null pour un préfixe inconnu', () => {
      const provider = mobilePaymentService.detectProvider('01123456');
      expect(provider).toBeNull();
    });
  });

  describe('validateMobileNumber', () => {
    it('valide les numéros corrects', () => {
      expect(mobilePaymentService.validateMobileNumber('07123456')).toBe(true);
      expect(mobilePaymentService.validateMobileNumber('06987654')).toBe(true);
    });

    it('rejette les numéros incorrects', () => {
      expect(mobilePaymentService.validateMobileNumber('123')).toBe(false);
      expect(mobilePaymentService.validateMobileNumber('0712345678')).toBe(false);
      expect(mobilePaymentService.validateMobileNumber('abcd1234')).toBe(false);
    });
  });

  describe('initiatePayment', () => {
    it('initie un paiement avec succès', async () => {
      const result = await mobilePaymentService.initiatePayment({
        phoneNumber: '07123456',
        amount: 15000,
        serviceId: 'test-service',
        description: 'Test payment'
      });

      expect(result.success).toBe(true);
      expect(result.transactionId).toMatch(/^TXN_\d+$/);
      expect(result.amount).toBe(15000);
      expect(result.status).toBe('pending');
    });

    it('rejette les numéros non supportés', async () => {
      await expect(
        mobilePaymentService.initiatePayment({
          phoneNumber: '01123456',
          amount: 15000,
          serviceId: 'test-service',
          description: 'Test payment'
        })
      ).rejects.toThrow('Opérateur non supporté');
    });
  });
});