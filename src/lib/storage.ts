import { Product, Enquiry } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

/**
 * Fetches published products catalogue from the backend API.
 * Falls back to initial memory seed if network is offline during dev.
 */
export async function getCatalogueProducts(): Promise<Product[]> {
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('[Data Service] Network request failed, using in-memory catalogue:', err);
  }
  return INITIAL_PRODUCTS;
}

/**
 * Submits an official B2B quote enquiry to the backend API.
 * The backend validates, stores in PostgreSQL, assigns FAL reference, and triggers transactional emails.
 */
export async function submitQuoteEnquiry(formData: {
  fullName: string;
  companyName?: string;
  country: string;
  email: string;
  whatsapp?: string;
  productId?: string;
  productName: string;
  estimatedQuantity: string;
  packagingRequirement?: string;
  message?: string;
  website_hp?: string;
}): Promise<{ success: boolean; message: string; enquiry?: Enquiry }> {
  try {
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const result = await res.json();
    if (res.ok && result.success) {
      return result;
    }
    return {
      success: false,
      message: result.error || result.message || 'Submission was not accepted by server. Please check your details.'
    };
  } catch (err) {
    console.error('[Data Service] Network failure during enquiry submission:', err);
    return {
      success: false,
      message: 'Network connection error. We were unable to reach our export server. Please contact our trade desk directly via WhatsApp or Email.'
    };
  }
}
