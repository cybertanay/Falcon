export interface ProductSpecification {
  botanicalName?: string;
  origin?: string;
  form?: string;
  color?: string;
  aroma?: string;
  moistureMax?: string;
  keyActiveComponent?: string; // e.g. Curcumin 2.5% - 5.0%, Capsaicin SHU 20,000 - 90,000
  astaColorValue?: string;
  extraneousMatterMax?: string;
  totalAshMax?: string;
  meshSize?: string;
  shelfLife?: string;
  storageConditions?: string;
  minimumOrderQuantity?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: 'Powders' | 'Whole Spices' | 'Dehydrated Ingredients' | 'Spice Blends';
  image: string;
  gallery: string[];
  origin: string;
  form: string;
  packagingOptions: string[];
  minimumOrderQuantity: string;
  featured: boolean;
  published: boolean;
  specifications: ProductSpecification;
  availableFormats: string[];
  faq: { question: string; answer: string }[];
  createdAt: string;
  updatedAt: string;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'Quotation Sent' | 'Negotiating' | 'Converted' | 'Closed' | 'Lost';

export interface Enquiry {
  id: string;
  enquiryReference: string; // e.g. FAL-2026-00482
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
  status: EnquiryStatus;
  assignedStaff?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string | number;
  adminEmail: string;
  action: string;
  entity: string;
  entityId: string;
  oldValue: any;
  newValue: any;
  createdAt: string;
}

export interface CompanySettings {
  name: string;
  tagline: string;
  positioning: string;
  email: string;
  whatsapp: string;
  phone: string;
  address: string;
  websiteUrl: string;
  socials: {
    instagram?: string;
    linkedin?: string;
    whatsapp?: string;
  };
}

export interface CompanyInfo extends CompanySettings {
  // Legacy compatibility if needed
}
