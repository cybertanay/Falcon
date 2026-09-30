import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Enquiry, EnquiryStatus, AuditLog, CompanySettings } from '../src/types';
import { INITIAL_PRODUCTS } from '../src/data/products';
import { COMPANY_INFO } from '../src/data/company';
import { hashPassword, verifyPassword } from './auth';

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  role: 'super_admin' | 'admin' | 'sales';
  isActive: boolean;
  createdAt: string;
}

interface LocalDBStructure {
  products: Product[];
  enquiries: Enquiry[];
  companySettings: CompanySettings;
  adminUsers: AdminUser[];
  auditLogs: AuditLog[];
  lastEnquirySequence: number;
}

// Bidirectional PostgreSQL / Supabase mapping functions
function toDbProduct(p: Partial<Product>) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    short_description: p.shortDescription || '',
    full_description: p.fullDescription || '',
    origin: p.origin || 'India',
    botanical_name: p.specifications?.botanicalName || '',
    form: p.form || p.specifications?.form || '',
    key_active_component: p.specifications?.keyActiveComponent || '',
    specifications: p.specifications || {},
    available_formats: p.availableFormats || [],
    packaging_options: p.packagingOptions || [],
    minimum_order_quantity: p.minimumOrderQuantity || '1 Metric Ton',
    storage_conditions: p.specifications?.storageConditions || '',
    shelf_life: p.specifications?.shelfLife || '24 Months',
    image: p.image || '',
    gallery: p.gallery || [],
    faqs: p.faq || [],
    published: p.published !== undefined ? p.published : true,
    featured: p.featured !== undefined ? p.featured : false,
    created_at: p.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function fromDbProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    shortDescription: row.short_description ?? row.shortDescription ?? '',
    fullDescription: row.full_description ?? row.fullDescription ?? '',
    origin: row.origin || 'India',
    form: row.form || '',
    packagingOptions: row.packaging_options ?? row.packagingOptions ?? [],
    minimumOrderQuantity: row.minimum_order_quantity ?? row.minimumOrderQuantity ?? '1 Metric Ton',
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    image: row.image || '',
    gallery: row.gallery ?? (row.image ? [row.image] : []),
    availableFormats: row.available_formats ?? row.availableFormats ?? [],
    faq: row.faqs ?? row.faq ?? [],
    specifications: {
      botanicalName: row.botanical_name || row.specifications?.botanicalName || '',
      origin: row.origin || 'India',
      form: row.form || '',
      color: row.specifications?.color || '',
      aroma: row.specifications?.aroma || '',
      moistureMax: row.specifications?.moistureMax || 'Max 10.0%',
      keyActiveComponent: row.key_active_component || row.specifications?.keyActiveComponent,
      astaColorValue: row.specifications?.astaColorValue,
      extraneousMatterMax: row.specifications?.extraneousMatterMax,
      totalAshMax: row.specifications?.totalAshMax,
      meshSize: row.specifications?.meshSize,
      shelfLife: row.shelf_life || row.specifications?.shelfLife || '24 Months',
      storageConditions: row.storage_conditions || row.specifications?.storageConditions || '',
      minimumOrderQuantity: row.minimum_order_quantity || row.minimumOrderQuantity || '1 Metric Ton'
    },
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt || new Date().toISOString()
  };
}

function toDbEnquiry(e: Partial<Enquiry>) {
  return {
    id: e.id,
    enquiry_reference: e.enquiryReference,
    customer_name: e.fullName,
    company_name: e.companyName || '',
    country: e.country,
    email: e.email,
    whatsapp: e.whatsapp || '',
    product_id: e.productId || null,
    product_name: e.productName,
    quantity: e.estimatedQuantity,
    packaging_requirement: e.packagingRequirement || 'Standard Export Packaging',
    message: e.message || '',
    status: e.status || 'New',
    assigned_staff: e.assignedStaff || null,
    internal_notes: e.internalNotes || '',
    created_at: e.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function fromDbEnquiry(row: any): Enquiry {
  return {
    id: row.id,
    enquiryReference: row.enquiry_reference ?? row.enquiryReference ?? '',
    fullName: row.customer_name ?? row.fullName ?? '',
    companyName: row.company_name ?? row.companyName ?? '',
    country: row.country || '',
    email: row.email || '',
    whatsapp: row.whatsapp ?? '',
    productId: row.product_id ?? row.productId ?? '',
    productName: row.product_name ?? row.productName ?? '',
    estimatedQuantity: row.quantity ?? row.estimatedQuantity ?? '',
    packagingRequirement: row.packaging_requirement ?? row.packagingRequirement ?? '',
    message: row.message ?? '',
    status: (row.status as EnquiryStatus) || 'New',
    assignedStaff: row.assigned_staff ?? row.assignedStaff,
    internalNotes: row.internal_notes ?? row.internalNotes ?? '',
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt || new Date().toISOString()
  };
}

const currentFilename = fileURLToPath(import.meta.url);
const currentDirname = path.dirname(currentFilename);
const LOCAL_DB_FILE = path.resolve(currentDirname, '..', 'data_store.json');

class DatabaseAdapter {
  private supabase: SupabaseClient | null = null;
  public isSupabaseConfigured = false;
  private memoryDB: LocalDBStructure;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('https://')) {
      try {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.isSupabaseConfigured = true;
        console.info('[Database] Connected to PostgreSQL via Supabase.');
      } catch (err) {
        console.warn('[Database] Failed to initialize Supabase client; falling back to persistent local store.', err);
      }
    } else {
      console.info('[Database] Supabase URL/Key not configured. Using local store with PostgreSQL-compatible schema.');
    }

    this.memoryDB = this.loadLocalDB();
    this.ensureDefaultAdmin();
  }

  private loadLocalDB(): LocalDBStructure {
    try {
      if (fs.existsSync(LOCAL_DB_FILE)) {
        const raw = fs.readFileSync(LOCAL_DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          products: Array.isArray(parsed.products) && parsed.products.length > 0 ? parsed.products : INITIAL_PRODUCTS,
          enquiries: parsed.enquiries || [],
          companySettings: parsed.companySettings || COMPANY_INFO,
          adminUsers: parsed.adminUsers || [],
          auditLogs: parsed.auditLogs || [],
          lastEnquirySequence: parsed.lastEnquirySequence || (parsed.enquiries ? parsed.enquiries.length + 480 : 480)
        };
      }
    } catch (err) {
      console.error('[Database] Error reading local store file:', err);
    }

    const defaultDB: LocalDBStructure = {
      products: INITIAL_PRODUCTS,
      enquiries: [],
      companySettings: COMPANY_INFO,
      adminUsers: [],
      auditLogs: [],
      lastEnquirySequence: 480
    };
    this.saveLocalDB(defaultDB);
    return defaultDB;
  }

  private saveLocalDB(data?: LocalDBStructure) {
    try {
      const toSave = data || this.memoryDB;
      fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(toSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Database] Error writing to local store file:', err);
    }
  }

  private async ensureDefaultAdmin() {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@falconspices.com').toLowerCase();
    const existing = this.memoryDB.adminUsers.find(u => u.email.toLowerCase() === adminEmail);
    if (!existing) {
      const initialPassword = process.env.ADMIN_PASSWORD || 'FalconExport@2026!';
      const passwordHash = await hashPassword(initialPassword);
      this.memoryDB.adminUsers.push({
        id: 'admin-' + Date.now(),
        email: adminEmail,
        passwordHash,
        role: 'super_admin',
        isActive: true,
        createdAt: new Date().toISOString()
      });
      this.saveLocalDB();
      console.info(`[Admin Auth] Initialized primary administrator account for ${adminEmail}.`);
    }
  }

  public generateReference(): string {
    const year = new Date().getFullYear();
    this.memoryDB.lastEnquirySequence = (this.memoryDB.lastEnquirySequence || 480) + 1;
    this.saveLocalDB();
    const seqStr = String(this.memoryDB.lastEnquirySequence).padStart(5, '0');
    return `FAL-${year}-${seqStr}`;
  }

  // --- PRODUCTS ---
  public async getProducts(options?: { publishedOnly?: boolean }): Promise<Product[]> {
    if (this.isSupabaseConfigured && this.supabase) {
      try {
        let query = this.supabase.from('products').select('*');
        if (options?.publishedOnly) {
          query = query.eq('published', true);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(fromDbProduct);
        }
      } catch (e) {
        console.error('[Database] Supabase getProducts failed, falling back:', e);
      }
    }

    if (options?.publishedOnly) {
      return this.memoryDB.products.filter(p => p.published);
    }
    return this.memoryDB.products;
  }

  public async getProductBySlug(slug: string): Promise<Product | null> {
    if (this.isSupabaseConfigured && this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('products')
          .select('*')
          .or(`slug.eq.${slug},id.eq.${slug}`)
          .single();
        if (!error && data) return fromDbProduct(data);
      } catch (e) {
        console.error('[Database] Supabase getProductBySlug error:', e);
      }
    }
    return this.memoryDB.products.find(p => p.slug === slug || p.id === slug) || null;
  }

  public async createProduct(productData: Partial<Product>, adminEmail: string): Promise<Product> {
    const newProduct: Product = {
      ...(productData as Product),
      id: productData.id || 'prod-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (this.isSupabaseConfigured && this.supabase) {
      try {
        const dbRow = toDbProduct(newProduct);
        await this.supabase.from('products').insert(dbRow);
      } catch (e) {
        console.error('[Database] Supabase insert product error:', e);
      }
    }

    this.memoryDB.products.unshift(newProduct);
    this.saveLocalDB();

    await this.logAudit({
      adminEmail,
      action: 'PRODUCT_CREATE',
      entity: 'products',
      entityId: newProduct.id,
      oldValue: null,
      newValue: newProduct
    });

    return newProduct;
  }

  public async updateProduct(id: string, updates: Partial<Product>, adminEmail: string): Promise<Product | null> {
    const index = this.memoryDB.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const oldProduct = { ...this.memoryDB.products[index] };
    const updatedProduct = {
      ...oldProduct,
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    };

    if (this.isSupabaseConfigured && this.supabase) {
      try {
        const dbRow = toDbProduct(updatedProduct);
        await this.supabase.from('products').update(dbRow).eq('id', id);
      } catch (e) {
        console.error('[Database] Supabase update product error:', e);
      }
    }

    this.memoryDB.products[index] = updatedProduct;
    this.saveLocalDB();

    await this.logAudit({
      adminEmail,
      action: 'PRODUCT_UPDATE',
      entity: 'products',
      entityId: id,
      oldValue: oldProduct,
      newValue: updatedProduct
    });

    return updatedProduct;
  }

  public async deleteProduct(id: string, adminEmail: string): Promise<boolean> {
    const index = this.memoryDB.products.findIndex(p => p.id === id);
    if (index === -1) return false;

    const oldProduct = this.memoryDB.products[index];

    if (this.isSupabaseConfigured && this.supabase) {
      try {
        await this.supabase.from('products').delete().eq('id', id);
      } catch (e) {
        console.error('[Database] Supabase delete product error:', e);
      }
    }

    this.memoryDB.products.splice(index, 1);
    this.saveLocalDB();

    await this.logAudit({
      adminEmail,
      action: 'PRODUCT_DELETE',
      entity: 'products',
      entityId: id,
      oldValue: oldProduct,
      newValue: null
    });

    return true;
  }

  // --- ENQUIRIES ---
  public async createEnquiry(enquiryInput: {
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
  }): Promise<Enquiry> {
    const ref = this.generateReference();
    const newEnquiry: Enquiry = {
      id: 'enq-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      enquiryReference: ref,
      fullName: enquiryInput.fullName,
      companyName: enquiryInput.companyName || '',
      country: enquiryInput.country,
      email: enquiryInput.email,
      whatsapp: enquiryInput.whatsapp || '',
      productId: enquiryInput.productId || '',
      productName: enquiryInput.productName,
      estimatedQuantity: enquiryInput.estimatedQuantity,
      packagingRequirement: enquiryInput.packagingRequirement || 'Standard Export Packaging',
      message: enquiryInput.message || '',
      status: 'New',
      assignedStaff: undefined,
      internalNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (this.isSupabaseConfigured && this.supabase) {
      try {
        const dbRow = toDbEnquiry(newEnquiry);
        await this.supabase.from('enquiries').insert(dbRow);
      } catch (e) {
        console.error('[Database] Supabase insert enquiry error:', e);
      }
    }

    this.memoryDB.enquiries.unshift(newEnquiry);
    this.saveLocalDB();

    return newEnquiry;
  }

  public async getEnquiries(filter?: { status?: string; search?: string }): Promise<Enquiry[]> {
    if (this.isSupabaseConfigured && this.supabase) {
      try {
        let query = this.supabase.from('enquiries').select('*').order('created_at', { ascending: false });
        if (filter?.status && filter.status !== 'all') {
          query = query.eq('status', filter.status);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(fromDbEnquiry);
        }
      } catch (e) {
        console.error('[Database] Supabase getEnquiries error:', e);
      }
    }

    let results = [...this.memoryDB.enquiries];
    if (filter?.status && filter.status !== 'all') {
      results = results.filter(e => e.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      results = results.filter(e =>
        e.enquiryReference.toLowerCase().includes(q) ||
        e.fullName.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.companyName.toLowerCase().includes(q) ||
        e.country.toLowerCase().includes(q) ||
        e.productName.toLowerCase().includes(q)
      );
    }
    return results;
  }

  public async updateEnquiry(
    id: string,
    updates: { status?: EnquiryStatus; internalNotes?: string; assignedStaff?: string },
    adminEmail: string
  ): Promise<Enquiry | null> {
    const index = this.memoryDB.enquiries.findIndex(e => e.id === id);
    if (index === -1) return null;

    const oldEnquiry = { ...this.memoryDB.enquiries[index] };
    const updated = {
      ...oldEnquiry,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    if (this.isSupabaseConfigured && this.supabase) {
      try {
        const dbRow = toDbEnquiry(updated);
        await this.supabase.from('enquiries').update(dbRow).eq('id', id);
      } catch (e) {
        console.error('[Database] Supabase update enquiry error:', e);
      }
    }

    this.memoryDB.enquiries[index] = updated;
    this.saveLocalDB();

    await this.logAudit({
      adminEmail,
      action: 'ENQUIRY_UPDATE',
      entity: 'enquiries',
      entityId: id,
      oldValue: oldEnquiry,
      newValue: updated
    });

    return updated;
  }

  public async deleteEnquiry(id: string, adminEmail: string): Promise<boolean> {
    const index = this.memoryDB.enquiries.findIndex(e => e.id === id);
    if (index === -1) return false;

    const oldEnquiry = this.memoryDB.enquiries[index];

    if (this.isSupabaseConfigured && this.supabase) {
      try {
        await this.supabase.from('enquiries').delete().eq('id', id);
      } catch (e) {
        console.error('[Database] Supabase delete enquiry error:', e);
      }
    }

    this.memoryDB.enquiries.splice(index, 1);
    this.saveLocalDB();

    await this.logAudit({
      adminEmail,
      action: 'ENQUIRY_DELETE',
      entity: 'enquiries',
      entityId: id,
      oldValue: oldEnquiry,
      newValue: null
    });

    return true;
  }

  // --- COMPANY SETTINGS ---
  public async getCompanySettings(): Promise<CompanySettings> {
    return this.memoryDB.companySettings || COMPANY_INFO;
  }

  public async updateCompanySettings(settings: Partial<CompanySettings>, adminEmail: string): Promise<CompanySettings> {
    const oldSettings = { ...this.memoryDB.companySettings };
    const updated: CompanySettings = {
      ...this.memoryDB.companySettings,
      ...settings
    };

    this.memoryDB.companySettings = updated;
    this.saveLocalDB();

    await this.logAudit({
      adminEmail,
      action: 'SETTINGS_UPDATE',
      entity: 'company_settings',
      entityId: 'global',
      oldValue: oldSettings,
      newValue: updated
    });

    return updated;
  }

  // --- ADMIN AUTH ---
  public async verifyAdmin(email: string, plainPass: string): Promise<AdminUser | null> {
    const user = this.memoryDB.adminUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.isActive);
    if (!user) return null;

    const isMatch = await verifyPassword(plainPass, user.passwordHash);
    if (!isMatch) return null;

    return user;
  }

  // --- AUDIT LOGS ---
  public async logAudit(entry: {
    adminEmail: string;
    action: string;
    entity: string;
    entityId: string;
    oldValue: any;
    newValue: any;
  }) {
    const log: AuditLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      adminEmail: entry.adminEmail,
      action: entry.action,
      entity: entry.entity,
      entityId: entry.entityId,
      oldValue: entry.oldValue,
      newValue: entry.newValue,
      createdAt: new Date().toISOString()
    };

    this.memoryDB.auditLogs.unshift(log);
    if (this.memoryDB.auditLogs.length > 500) {
      this.memoryDB.auditLogs = this.memoryDB.auditLogs.slice(0, 500);
    }
    this.saveLocalDB();
  }

  public async getAuditLogs(): Promise<AuditLog[]> {
    return this.memoryDB.auditLogs;
  }
}

export const dbAdapter = new DatabaseAdapter();
