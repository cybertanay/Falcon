// Google Analytics 4 & B2B Conversion Event Tracking Helper

export type AnalyticsEventType =
  | 'page_view'
  | 'product_view'
  | 'quote_opened'
  | 'quote_submitted'
  | 'contact_submitted'
  | 'whatsapp_click'
  | 'email_click'
  | 'phone_click'
  | 'ai_assistant_opened'
  | 'ai_assistant_used'
  | 'technical_pdf_download';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function trackEvent(eventName: AnalyticsEventType, params: Record<string, any> = {}) {
  try {
    const payload = {
      ...params,
      timestamp: new Date().toISOString()
    };

    // 1. Google Analytics 4 dispatch if configured
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
    }

    // 2. Local console telemetry in development
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[Analytics Event: ${eventName}]`, payload);
    }
  } catch (err) {
    console.warn('[Analytics Error]', err);
  }
}
