import { useCallback } from 'react';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export const useAnalytics = () => {
  const trackEvent = useCallback(({ action, category, label, value }: AnalyticsEvent) => {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }

    // Console log pour développement
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', { action, category, label, value });
    }
  }, []);

  const trackPageView = useCallback((page: string) => {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: page,
      });
    }
  }, []);

  return { trackEvent, trackPageView };
};