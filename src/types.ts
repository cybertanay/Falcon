export interface ProductSpecification {
  botanicalName: string;
  origin: string;
  form: string;
  color: string;
  aroma: string;
  moistureMax: string;
  keyActiveComponent?: string; // e.g., Curcumin 2.5% - 5.0%, Capsaicin SHU 20,000 - 90,000
  astaColorValue?: string;
  extraneousMatterMax?: string;
  totalAshMax?: string;
  meshSize?: string;
  shelfLife: string;
  storageConditions: string;
  minimumOrderQuantity: string;
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

export type EnquiryStatus = 'New' | 'Contacted' | 'Quotation Sent' | 'Negotiating' | 'Converted' | 'Closed';

export interface Enquiry {
  id: string;
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
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  clientName: string; // e.g. "[Client Name]" or real
  company: string;    // e.g. "[Import House Ltd]"
  country: string;    // e.g. "Germany", "UAE"
  testimonial: string;
  published: boolean;
  rating: number;
  createdAt: string;
}

export interface Certification {
  id: string;
  name: string;             // e.g. "[APEDA Registration]", "Spices Board India"
  issuingAuthority: string; // e.g. "Ministry of Commerce, Govt. of India"
  certificateNumber: string; // e.g. "[CERT-XXXXX]"
  validUntil: string;       // e.g. "[YYYY-MM-DD]"
  documentUrl?: string;
  published: boolean;
  description: string;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  positioning: string;
  email: string;
  whatsapp: string;
  phone: string;
  address: string;
  socials: {
    instagram: string;
    linkedin: string;
    whatsapp: string;
  };
  metrics: {
    yearsExperience: string; // "[15]+"
    countriesServed: string;  // "[45]+"
    monthlyCapacity: string;  // "[5000] MT"
    qualityCertifications: string; // "[8]+"
  };
}
