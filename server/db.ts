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
  name?: string;
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

export class DatabaseAdapter {
  public supabase: SupabaseClient | null = null;
  public isSupabaseConfigured = false;
  private memoryDB: LocalDBStructure | null = null;

  constructor() {
    const isProduction = process.env.NODE_ENV === 'production';
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('https://')) {
      try {
        this.supabase = createClient(supabaseUrl, supabaseKey, {
          auth: { persistSession: false, autoRefreshToken: false }
        });
        this.isSupabaseConfigured = true;
        console.info('[Database] Connected to authoritative PostgreSQL via Supabase.');
      } catch (err: any) {
        if (isProduction) {
          throw new Error(`[FATAL] Failed to initialize PostgreSQL/Supabase client in production: ${err?.message}`);
        }
        console.warn('[Database] Failed to initialize Supabase client; falling back to local dev mock.', err);
      }
    } else {
      if (isProduction) {
        throw new Error(
          '[FATAL CONFIG] In production, SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are strictly required. Local file storage fallback is prohibited in production.'
        );
      }
      console.warn('[Database] DEVELOPMENT MODE: Supabase not configured. Using local JSON store mock (data_store.json).');
      this.memoryDB = this.loadLocalDB();
    }

    // Initialize default administrator asynchronously
    this.ensureDefaultAdmin().catch(e => {
      console.error('[Admin Auth] Error ensuring default admin:', e.message);
    });
  }

  // --- LOCAL DEV STORE METHODS (Only active when Supabase is not configured in dev) ---
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
    if (!this.memoryDB && !data) return;
    try {
      const toSave = data || this.memoryDB;
      fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(toSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Database] Error writing to local store file:', err);
    }
  }

  private async ensureDefaultAdmin() {
    const isProduction = process.env.NODE_ENV === 'production';
    const adminEmail = (process.env.ADMIN_EMAIL || (isProduction ? '' : 'admin@falconspices.com')).toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (isProduction && (!adminEmail || !adminPassword)) {
      throw new Error(
        '[FATAL SECURITY] In production, ADMIN_EMAIL and ADMIN_PASSWORD environment variables are mandatory to bootstrap the system. Server startup halted.'
      );
    }

    if (!adminEmail || !adminPassword) {
      // In local development, if ADMIN_PASSWORD is not provided, skip creating default admin or warn
      console.warn('[Admin Auth] ADMIN_PASSWORD environment variable not supplied. Set ADMIN_PASSWORD in .env to enable admin login.');
      return;
    }

    const passwordHash = await hashPassword(adminPassword);

    if (this.isSupabaseConfigured && this.supabase) {
      try {
        const { data: existing, error: checkError } = await this.supabase
          .from('admin_users')
          .select('id, email')
          .ilike('email', adminEmail)
          .maybeSingle();

        if (checkError) {
          console.warn('[Admin Auth] Notice: Could not verify existing admin_users in PostgreSQL:', checkError.message);
          return;
        }

        if (!existing) {
          const { error: insertError } = await this.supabase.from('admin_users').insert({
            email: adminEmail,
            password_hash: passwordHash,
            name: 'Falcon Master Admin',
            role: 'super_admin',
            is_active: true
          });

          if (insertError) {
            console.error('[Admin Auth] Failed to insert initial super admin into PostgreSQL:', insertError.message);
          } else {
            console.info(`[Admin Auth] Successfully initialized primary administrator account in PostgreSQL for ${adminEmail}.`);
          }
        }
      } catch (err: any) {
        console.error('[Admin Auth] PostgreSQL admin check error:', err.message);
      }
    } else if (this.memoryDB) {
      const existing = this.memoryDB.adminUsers.find(u => u.email.toLowerCase() === adminEmail);
      if (!existing) {
        this.memoryDB.adminUsers.push({
          id: 'admin-' + Date.now(),
          email: adminEmail,
          passwordHash,
          name: 'Falcon Master Admin',
          role: 'super_admin',
          isActive: true,
          createdAt: new Date().toISOString()
        });
        this.saveLocalDB();
        console.info(`[Admin Auth] Initialized primary administrator account in local store for ${adminEmail}.`);
      }
    }
  }

  // --- ATOMIC ENQUIRY REFERENCE GENERATOR ---
  public async generateReference(): Promise<string> {
    const year = new Date().getFullYear();

    if (this.isSupabaseConfigured && this.supabase) {
      try {
        // 1. Try atomic PostgreSQL sequence function first (guarantees zero race conditions)
        const { data: seqVal, error: seqError } = await this.supabase.rpc('get_next_enquiry_seq');
        if (!seqError && seqVal) {
          return `FAL-${year}-${String(seqVal).padStart(5, '0')}`;
        }

        // 2. Fallback: Query exact row count
        const { count, error } = await this.supabase
          .from('enquiries')
          .select('*', { count: 'exact', head: true });

        if (!error && count !== null) {
          const seq = count + 501;
          return `FAL-${year}-${String(seq).padStart(5, '0')}`;
        }
      } catch (e: any) {
        console.error('[Database] Error generating sequence from PostgreSQL:', e.message);
      }
    }

    if (this.memoryDB) {
      this.memoryDB.lastEnquirySequence = (this.memoryDB.lastEnquirySequence || 480) + 1;
      this.saveLocalDB();
      const seqStr = String(this.memoryDB.lastEnquirySequence).padStart(5, '0');
      return `FAL-${year}-${seqStr}`;
    }

    return `FAL-${year}-${Math.floor(10000 + Math.random() * 90000)}`;
  }

  // --- PRODUCTS ---
  public async getProducts(options?: { publishedOnly?: boolean }): Promise<Product[]> {
    if (this.isSupabaseConfigured && this.supabase) {
      let query = this.supabase.from('products').select('*');
      if (options?.publishedOnly) {
        query = query.eq('published', true);
      }
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) {
        console.error('[Database] PostgreSQL getProducts error:', error);
        throw new Error(`Database query failed: ${error.message}`);
      }

      // If database is completely empty on initial setup, seed with authentic INITIAL_PRODUCTS
      if ((!data || data.length === 0) && !options?.publishedOnly) {
        await this.seedInitialProducts();
        return INITIAL_PRODUCTS;
      }

      return (data || []).map(fromDbProduct);
    }

    if (!this.memoryDB) throw new Error('Database not initialized.');
    if (options?.publishedOnly) {
      return this.memoryDB.products.filter(p => p.published);
    }
    return this.memoryDB.products;
  }

  private async seedInitialProducts() {
    if (!this.isSupabaseConfigured || !this.supabase) return;
    try {
      console.info('[Database] Seeding PostgreSQL products table with authentic catalogue...');
      const rows = INITIAL_PRODUCTS.map(toDbProduct);
      const { error } = await this.supabase.from('products').insert(rows);
      if (error) console.error('[Database] Failed to seed initial products:', error.message);
      else console.info('[Database] Initial products seeded successfully.');
    } catch (e: any) {
      console.error('[Database] Error during initial product seeding:', e.message);
    }
  }

  public async getProductBySlug(slug: string, options?: { publishedOnly?: boolean }): Promise<Product | null> {
    if (this.isSupabaseConfigured && this.supabase) {
      let query = this.supabase
        .from('products')
        .select('*')
        .or(`slug.eq.${slug},id.eq.${slug}`);

      if (options?.publishedOnly) {
        query = query.eq('published', true);
      }

      const { data, error } = await query.maybeSingle();
      if (error) {
        console.error('[Database] PostgreSQL getProductBySlug error:', error);
        throw new Error(`Database query failed: ${error.message}`);
      }

      return data ? fromDbProduct(data) : null;
    }

    if (!this.memoryDB) throw new Error('Database not initialized.');
    const found = this.memoryDB.products.find(p => p.slug === slug || p.id === slug);
    if (!found) return null;
    if (options?.publishedOnly && !found.published) return null;
    return found;
  }

  public async createProduct(productData: Partial<Product>, adminEmail: string, ipAddress?: string): Promise<Product> {
    const newProduct: Product = {
      ...(productData as Product),
      id: productData.id || 'prod-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (this.isSupabaseConfigured && this.supabase) {
      const dbRow = toDbProduct(newProduct);
      const { data, error } = await this.supabase.from('products').insert(dbRow).select().single();
      if (error) {
        console.error('[Database] PostgreSQL insert product error:', error);
        throw new Error(`Failed to create product in PostgreSQL: ${error.message}`);
      }

      await this.logAudit({
        adminEmail,
        action: 'PRODUCT_CREATE',
        entity: 'products',
        entityId: newProduct.id,
        oldValue: null,
        newValue: newProduct,
        ipAddress
      });

      return fromDbProduct(data);
    }

    if (!this.memoryDB) throw new Error('Database not initialized.');
    this.memoryDB.products.unshift(newProduct);
    this.saveLocalDB();

    await this.logAudit({
      adminEmail,
      action: 'PRODUCT_CREATE',
      entity: 'products',
      entityId: newProduct.id,
      oldValue: null,
      newValue: newProduct,
      ipAddress
    });

    return newProduct;
  }

  public async updateProduct(
    id: string,
    updates: Partial<Product>,
    adminEmail: string,
    ipAddress?: string
  ): Promise<Product | null> {
    if (this.isSupabaseConfigured && this.supabase) {
      // 1. Fetch current row
      const { data: existing, error: fetchErr } = await this.supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchErr) throw new Error(`Database error fetching product: ${fetchErr.message}`);
      if (!existing) return null;

      const oldProduct = fromDbProduct(existing);
      const updatedProduct: Product = {
        ...oldProduct,
        ...updates,
        id,
        updatedAt: new Date().toISOString()
      };

      const dbRow = toDbProduct(updatedProduct);
      const { data, error } = await this.supabase
        .from('products')
        .update(dbRow)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[Database] PostgreSQL update product error:', error);
        throw new Error(`Failed to update product in PostgreSQL: ${error.message}`);
      }

      await this.logAudit({
        adminEmail,
        action: 'PRODUCT_UPDATE',
        entity: 'products',
        entityId: id,
        oldValue: oldProduct,
        newValue: updatedProduct,
        ipAddress
      });

      return fromDbProduct(data);
    }

    if (!this.memoryDB) throw new Error('Database not initialized.');
    const index = this.memoryDB.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const oldProduct = { ...this.memoryDB.products[index] };
    const updatedProduct = {
      ...oldProduct,
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    };

    this.memoryDB.products[index] = updatedProduct;
    this.saveLocalDB();

    await this.logAudit({
      adminEmail,
      action: 'PRODUCT_UPDATE',
      entity: 'products',
      entityId: id,
      oldValue: oldProduct,
      newValue: updatedProduct,
      ipAddress
    });

    return updatedProduct;
  }

  public async deleteProduct(id: string, adminEmail: string, ipAddress?: string): Promise<boolean> {
    if (this.isSupabaseConfigured && this.supabase) {
      const { data: existing } = await this.supabase.from('products').select('*').eq('id', id).maybeSingle();
      if (!existing) return false;

      const oldProduct = fromDbProduct(existing);
      const { error } = await this.supabase.from('products').delete().eq('id', id);
      if (error) {
        console.error('[Database] PostgreSQL delete product error:', error);
        throw new Error(`Failed to delete product in PostgreSQL: ${error.message}`);
      }

      await this.logAudit({
        adminEmail,
        action: 'PRODUCT_DELETE',
        entity: 'products',
        entityId: id,
        oldValue: oldProduct,
        newValue: null,
        ipAddress
      });

      return true;
    }

    if (!this.memoryDB) throw new Error('Database not initialized.');
    const index = this.memoryDB.products.findIndex(p => p.id === id);
    if (index === -1) return false;

    const oldProduct = this.memoryDB.products[index];
    this.memoryDB.products.splice(index, 1);
    this.saveLocalDB();

    await this.logAudit({
      adminEmail,
      action: 'PRODUCT_DELETE',
      entity: 'products',
      entityId: id,
      oldValue: oldProduct,
      newValue: null,
      ipAddress
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
    const ref = await this.generateReference();
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
      const dbRow = toDbEnquiry(newEnquiry);
      const { data, error } = await this.supabase.from('enquiries').insert(dbRow).select().single();
      if (error) {
        console.error('[Database] PostgreSQL insert enquiry error:', error);
        throw new Error(`Failed to log enquiry in PostgreSQL: ${error.message}`);
      }
      return fromDbEnquiry(data);
    }

    if (!this.memoryDB) throw new Error('Database not initialized.');
    this.memoryDB.enquiries.unshift(newEnquiry);
    this.saveLocalDB();
    return newEnquiry;
  }

  public async getEnquiries(filter?: { status?: string; search?: string }): Promise<Enquiry[]> {
    if (this.isSupabaseConfigured && this.supabase) {
      let query = this.supabase.from('enquiries').select('*').order('created_at', { ascending: false });
      if (filter?.status && filter.status !== 'all') {
        query = query.eq('status', filter.status);
      }
      if (filter?.search) {
        const q = filter.search.trim();
        query = query.or(
          `customer_name.ilike.%${q}%,email.ilike.%${q}%,company_name.ilike.%${q}%,enquiry_reference.ilike.%${q}%,product_name.ilike.%${q}%`
        );
      }
      const { data, error } = await query;
      if (error) {
        console.error('[Database] PostgreSQL getEnquiries error:', error);
        throw new Error(`Database query failed: ${error.message}`);
      }
      return (data || []).map(fromDbEnquiry);
    }

    if (!this.memoryDB) throw new Error('Database not initialized.');
    let results = [...this.memoryDB.enquiries];
    if (filter?.status && filter.status !== 'all') {
      results = results.filter(e => e.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      results = results.filter(
        e =>
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
    adminEmail: string,
    ipAddress?: string
  ): Promise<Enquiry | null> {
    if (this.isSupabaseConfigured && this.supabase) {
      const { data: existing, error: fetchErr } = await this.supabase
        .from('enquiries')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchErr) throw new Error(`Database error fetching enquiry: ${fetchErr.message}`);
      if (!existing) return null;

      const oldEnquiry = fromDbEnquiry(existing);
      const updated: Enquiry = {
        ...oldEnquiry,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      const dbRow = toDbEnquiry(updated);
      const { data, error } = await this.supabase
        .from('enquiries')
        .update(dbRow)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[Database] PostgreSQL update enquiry error:', error);
        throw new Error(`Failed to update enquiry in PostgreSQL: ${error.message}`);
      }

      await this.logAudit({
        adminEmail,
        action: 'ENQUIRY_UPDATE',
        entity: 'enquiries',
        entityId: id,
        oldValue: oldEnquiry,
        newValue: updated,
        ipAddress
      });

      return fromDbEnquiry(data);
    }

    if (!this.memoryDB) throw new Error('Database not initialized.');
    const index = this.memoryDB.enquiries.findIndex(e => e.id === id);
    if (index === -1) return null;

    const oldEnquiry = { ...this.memoryDB.enquiries[index] };
    const updated = {
      ...oldEnquiry,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.memoryDB.enquiries[index] = updated;
    this.saveLocalDB();

    await this.logAudit({
      adminEmail,
      action: 'ENQUIRY_UPDATE',
      entity: 'enquiries',
      entityId: id,
      oldValue: oldEnquiry,
      newValue: updated,
      ipAddress
    });

    return updated;
  }

  public async deleteEnquiry(id: string, adminEmail: string, ipAddress?: string): Promise<boolean> {
    if (this.isSupabaseConfigured && this.supabase) {
      const { data: existing } = await this.supabase.from('enquiries').select('*').eq('id', id).maybeSingle();
      if (!existing) return false;

      const oldEnquiry = fromDbEnquiry(existing);
      const { error } = await this.supabase.from('enquiries').delete().eq('id', id);
      if (error) {
        console.error('[Database] PostgreSQL delete enquiry error:', error);
        throw new Error(`Failed to delete enquiry in PostgreSQL: ${error.message}`);
      }

      await this.logAudit({
        adminEmail,
        action: 'ENQUIRY_DELETE',
        entity: 'enquiries',
        entityId: id,
        oldValue: oldEnquiry,
        newValue: null,
        ipAddress
      });

      return true;
    }

    if (!this.memoryDB) throw new Error('Database not initialized.');
    const index = this.memoryDB.enquiries.findIndex(e => e.id === id);
    if (index === -1) return false;

    const oldEnquiry = this.memoryDB.enquiries[index];
    this.memoryDB.enquiries.splice(index, 1);
    this.saveLocalDB();

    await this.logAudit({
      adminEmail,
      action: 'ENQUIRY_DELETE',
      entity: 'enquiries',
      entityId: id,
      oldValue: oldEnquiry,
      newValue: null,
      ipAddress
    });

    return true;
  }

  // --- COMPANY SETTINGS ---
  public async getCompanySettings(): Promise<CompanySettings> {
    if (this.isSupabaseConfigured && this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('company_settings')
          .select('data')
          .eq('id', 'global')
          .maybeSingle();

        if (!error && data && data.data) {
          return { ...COMPANY_INFO, ...data.data };
        }
      } catch (err: any) {
        console.warn('[Database] Error reading company_settings from PostgreSQL:', err.message);
      }
    }

    if (this.memoryDB) {
      return this.memoryDB.companySettings || COMPANY_INFO;
    }

    return COMPANY_INFO;
  }

  public async updateCompanySettings(
    settings: Partial<CompanySettings>,
    adminEmail: string,
    ipAddress?: string
  ): Promise<CompanySettings> {
    const current = await this.getCompanySettings();
    const updated: CompanySettings = {
      ...current,
      ...settings
    };

    if (this.isSupabaseConfigured && this.supabase) {
      const { error } = await this.supabase
        .from('company_settings')
        .upsert({
          id: 'global',
          data: updated,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('[Database] Failed to upsert company_settings in PostgreSQL:', error.message);
        throw new Error(`Failed to update company settings in PostgreSQL: ${error.message}`);
      }

      await this.logAudit({
        adminEmail,
        action: 'SETTINGS_UPDATE',
        entity: 'company_settings',
        entityId: 'global',
        oldValue: current,
        newValue: updated,
        ipAddress
      });

      return updated;
    }

    if (!this.memoryDB) throw new Error('Database not initialized.');
    this.memoryDB.companySettings = updated;
    this.saveLocalDB();

    await this.logAudit({
      adminEmail,
      action: 'SETTINGS_UPDATE',
      entity: 'company_settings',
      entityId: 'global',
      oldValue: current,
      newValue: updated,
      ipAddress
    });

    return updated;
  }

  // --- ADMIN AUTH (PostgreSQL Authoritative) ---
  public async verifyAdmin(email: string, plainPass: string): Promise<AdminUser | null> {
    const cleanEmail = email.toLowerCase().trim();

    if (this.isSupabaseConfigured && this.supabase) {
      const { data, error } = await this.supabase
        .from('admin_users')
        .select('*')
        .ilike('email', cleanEmail)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('[Admin Auth] PostgreSQL verifyAdmin query error:', error.message);
        throw new Error('Authentication database error.');
      }

      if (!data) return null;

      const isMatch = await verifyPassword(plainPass, data.password_hash);
      if (!isMatch) return null;

      // Update last login timestamp in PostgreSQL
      await this.supabase
        .from('admin_users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', data.id);

      return {
        id: data.id,
        email: data.email,
        passwordHash: data.password_hash,
        name: data.name || 'Admin',
        role: data.role || 'admin',
        isActive: Boolean(data.is_active),
        createdAt: data.created_at
      };
    }

    if (!this.memoryDB) return null;
    const user = this.memoryDB.adminUsers.find(
      u => u.email.toLowerCase() === cleanEmail && u.isActive
    );
    if (!user) return null;

    const isMatch = await verifyPassword(plainPass, user.passwordHash);
    if (!isMatch) return null;

    return user;
  }

  // --- AUDIT LOGS (PostgreSQL Authoritative) ---
  public async logAudit(entry: {
    adminEmail: string;
    action: string;
    entity: string;
    entityId: string;
    oldValue: any;
    newValue: any;
    ipAddress?: string;
  }) {
    if (this.isSupabaseConfigured && this.supabase) {
      try {
        await this.supabase.from('audit_logs').insert({
          admin_email: entry.adminEmail,
          action: entry.action,
          entity: entry.entity,
          entity_id: String(entry.entityId),
          old_value: entry.oldValue,
          new_value: entry.newValue,
          ip_address: entry.ipAddress || null,
          created_at: new Date().toISOString()
        });
      } catch (err: any) {
        console.error('[Audit] Failed to insert audit log in PostgreSQL:', err.message);
      }
      return;
    }

    if (this.memoryDB) {
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
  }

  public async getAuditLogs(): Promise<AuditLog[]> {
    if (this.isSupabaseConfigured && this.supabase) {
      const { data, error } = await this.supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) {
        console.error('[Database] PostgreSQL getAuditLogs error:', error);
        throw new Error(`Database query failed: ${error.message}`);
      }

      return (data || []).map((row: any) => ({
        id: String(row.id),
        adminEmail: row.admin_email,
        action: row.action,
        entity: row.entity,
        entityId: row.entity_id,
        oldValue: row.old_value,
        newValue: row.new_value,
        createdAt: row.created_at
      }));
    }

    if (!this.memoryDB) throw new Error('Database not initialized.');
    return this.memoryDB.auditLogs;
  }
}

export const dbAdapter = new DatabaseAdapter();
