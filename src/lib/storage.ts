import { Product, Enquiry, Testimonial, Certification } from '../types';
import { INITIAL_PRODUCTS, INITIAL_TESTIMONIALS, INITIAL_CERTIFICATIONS } from '../data/products';

const ENQUIRIES_KEY = 'falcon_enquiries_db';
const PRODUCTS_KEY = 'falcon_products_db';
const TESTIMONIALS_KEY = 'falcon_testimonials_db';
const CERTIFICATIONS_KEY = 'falcon_certifications_db';

export function getLocalProducts(): Product[] {
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading local products', e);
  }
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

export function getLocalEnquiries(): Enquiry[] {
  try {
    const data = localStorage.getItem(ENQUIRIES_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading local enquiries', e);
  }
  return [];
}

export function saveLocalEnquiry(enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Enquiry {
  const existing = getLocalEnquiries();
  const newEnquiry: Enquiry = {
    ...enquiry,
    id: 'enq-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
    status: 'New',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const updated = [newEnquiry, ...existing];
  localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(updated));
  return newEnquiry;
}

export function getLocalTestimonials(): Testimonial[] {
  try {
    const data = localStorage.getItem(TESTIMONIALS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading local testimonials', e);
  }
  localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(INITIAL_TESTIMONIALS));
  return INITIAL_TESTIMONIALS;
}

export function getLocalCertifications(): Certification[] {
  try {
    const data = localStorage.getItem(CERTIFICATIONS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading local certifications', e);
  }
  localStorage.setItem(CERTIFICATIONS_KEY, JSON.stringify(INITIAL_CERTIFICATIONS));
  return INITIAL_CERTIFICATIONS;
}

// API wrappers with local fallbacks
export async function submitQuoteEnquiry(formData: {
  fullName: string;
  companyName: string;
  country: string;
  email: string;
  whatsapp: string;
  productId?: string;
  productName: string;
  estimatedQuantity: string;
  packagingRequirement: string;
  message: string;
}): Promise<{ success: boolean; message: string; enquiry?: Enquiry }> {
  try {
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      const result = await res.json();
      if (result.enquiry) {
        // Also save to localStorage for offline persistence
        const existing = getLocalEnquiries();
        localStorage.setItem(ENQUIRIES_KEY, JSON.stringify([result.enquiry, ...existing.filter(e => e.id !== result.enquiry.id)]));
      }
      return result;
    }
  } catch (err) {
    console.warn('API fetch unavailable, using client-side store:', err);
  }

  // Fallback to local save
  const created = saveLocalEnquiry(formData);
  return {
    success: true,
    message: 'Thank you for contacting Falcon International Traders. Your enquiry has been received and saved successfully.',
    enquiry: created
  };
}
