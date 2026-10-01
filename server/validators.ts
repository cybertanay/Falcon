import { z } from 'zod';

export const enquirySchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100, 'Full name too long'),
  companyName: z.string().trim().max(150).optional().default(''),
  country: z.string().trim().min(2, 'Country or port of destination is required').max(100),
  email: z.string().trim().email('Invalid business email address').max(150),
  whatsapp: z.string().trim().max(50).optional().default(''),
  productId: z.string().trim().max(100).optional().default(''),
  productName: z.string().trim().min(2, 'Please select or specify a product').max(150),
  estimatedQuantity: z.string().trim().min(1, 'Please specify estimated order quantity').max(100),
  packagingRequirement: z.string().trim().max(150).optional().default('Standard Export Packaging'),
  message: z.string().trim().max(2000, 'Message cannot exceed 2000 characters').optional().default(''),
  // Anti-bot honeypot field - must be empty
  website_hp: z.string().max(0, 'Spam detected').optional()
});

export const enquiryStatusUpdateSchema = z.object({
  status: z.enum(['New', 'Contacted', 'Quotation Sent', 'Negotiating', 'Converted', 'Closed', 'Lost']).optional(),
  assignedStaff: z.string().trim().max(100).optional(),
  internalNotes: z.string().trim().max(5000).optional()
});

export const aiSpecRequestSchema = z.object({
  productInterest: z.string().trim().min(2, 'Product interest is required').max(100, 'Product name too long'),
  targetMarket: z.string().trim().min(2, 'Target market is required').max(100, 'Target market too long'),
  requirement: z.string().trim().min(3, 'Please describe your requirement').max(500, 'Requirement description must be under 500 characters')
});

export const aiRecommendationOutputSchema = z.object({
  recommendedGrade: z.string().trim().min(2),
  moisture: z.string().trim().min(2),
  meshSize: z.string().trim().min(2),
  packaging: z.string().trim().min(2),
  microbiology: z.string().trim().min(2),
  notes: z.string().trim().min(2),
  disclaimer: z.string().trim().min(5)
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export const productMutationSchema = z.object({
  name: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(2).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  category: z.enum(['Powders', 'Whole Spices', 'Dehydrated Ingredients', 'Spice Blends']),
  shortDescription: z.string().trim().max(500).optional().default(''),
  fullDescription: z.string().trim().max(5000).optional().default(''),
  origin: z.string().trim().max(200).default('India'),
  botanicalName: z.string().trim().max(200).optional().default(''),
  form: z.string().trim().max(200).optional().default(''),
  keyActiveComponent: z.string().trim().max(200).optional().default(''),
  minimumOrderQuantity: z.string().trim().max(100).default('1 Metric Ton'),
  storageConditions: z.string().trim().max(500).optional().default(''),
  shelfLife: z.string().trim().max(100).default('24 Months'),
  image: z.string().trim().min(1),
  gallery: z.array(z.string()).optional().default([]),
  packagingOptions: z.array(z.string()).optional().default([]),
  availableFormats: z.array(z.string()).optional().default([]),
  specifications: z.record(z.string(), z.any()).optional().default({}),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })).optional().default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true)
});

export const productUpdateSchema = productMutationSchema.partial();

export const companySettingsSchema = z.object({
  name: z.string().trim().min(2).optional(),
  legalName: z.string().trim().min(2).optional(),
  tagline: z.string().trim().optional(),
  heroSubtitle: z.string().trim().optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().optional(),
  registeredOffice: z.string().trim().optional(),
  processingUnit: z.string().trim().optional(),
  exportHub: z.string().trim().optional(),
  workingHours: z.string().trim().optional(),
  socials: z.record(z.string(), z.string()).optional()
}).passthrough();
