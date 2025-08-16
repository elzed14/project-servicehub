import { describe, it, expect, beforeEach, vi } from 'vitest';
import { security } from './security';

describe('security', () => {
  describe('sanitizeHtml', () => {
    it('échappe les caractères dangereux', () => {
      const input = '<script>alert("xss")</script>';
      const result = security.sanitizeHtml(input);
      expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });

    it('préserve le texte normal', () => {
      const input = 'Texte normal sans HTML';
      const result = security.sanitizeHtml(input);
      expect(result).toBe(input);
    });
  });

  describe('validateEmail', () => {
    it('valide les emails corrects', () => {
      expect(security.validateEmail('test@example.com')).toBe(true);
      expect(security.validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('rejette les emails incorrects', () => {
      expect(security.validateEmail('invalid-email')).toBe(false);
      expect(security.validateEmail('@domain.com')).toBe(false);
      expect(security.validateEmail('test@')).toBe(false);
    });

    it('rejette les emails trop longs', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      expect(security.validateEmail(longEmail)).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('valide les mots de passe forts', () => {
      const result = security.validatePassword('Password123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejette les mots de passe faibles', () => {
      const result = security.validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Au moins 8 caractères');
      expect(result.errors).toContain('Une majuscule');
      expect(result.errors).toContain('Un chiffre');
    });
  });

  describe('rateLimiter', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('autorise les premières tentatives', () => {
      expect(security.rateLimiter('test-key', 3)).toBe(true);
      expect(security.rateLimiter('test-key', 3)).toBe(true);
      expect(security.rateLimiter('test-key', 3)).toBe(true);
    });

    it('bloque après la limite', () => {
      security.rateLimiter('test-key2', 2);
      security.rateLimiter('test-key2', 2);
      expect(security.rateLimiter('test-key2', 2)).toBe(false);
    });

    it('reset après la fenêtre de temps', () => {
      security.rateLimiter('test-key3', 1);
      expect(security.rateLimiter('test-key3', 1)).toBe(false);
      
      vi.advanceTimersByTime(61000); // 61 secondes
      expect(security.rateLimiter('test-key3', 1)).toBe(true);
    });
  });

  describe('generateCSRFToken', () => {
    it('génère des tokens uniques', () => {
      const token1 = security.generateCSRFToken();
      const token2 = security.generateCSRFToken();
      
      expect(token1).not.toBe(token2);
      expect(token1.length).toBeGreaterThan(10);
    });
  });
});