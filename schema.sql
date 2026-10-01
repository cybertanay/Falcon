-- ==============================================================================
-- FALCON INTERNATIONAL TRADERS — PRODUCTION DATABASE SCHEMA
-- PostgreSQL / Supabase Compatible
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PRODUCTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    short_description TEXT,
    full_description TEXT,
    origin VARCHAR(255) NOT NULL DEFAULT 'India',
    botanical_name VARCHAR(255),
    form VARCHAR(255),
    key_active_component VARCHAR(255),
    specifications JSONB DEFAULT '{}'::jsonb,
    available_formats JSONB DEFAULT '[]'::jsonb,
    packaging_options JSONB DEFAULT '[]'::jsonb,
    minimum_order_quantity VARCHAR(100) DEFAULT '1 Metric Ton',
    storage_conditions TEXT,
    shelf_life VARCHAR(100) DEFAULT '24 Months',
    image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    faqs JSONB DEFAULT '[]'::jsonb,
    published BOOLEAN NOT NULL DEFAULT true,
    featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(published);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- ------------------------------------------------------------------------------
-- 2. ENQUIRIES / LEADS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS enquiries (
    id TEXT PRIMARY KEY,
    enquiry_reference VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    country VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50),
    product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity VARCHAR(100) NOT NULL,
    packaging_requirement VARCHAR(255),
    message TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Quotation Sent', 'Negotiating', 'Converted', 'Closed', 'Lost')),
    assigned_staff VARCHAR(100),
    internal_notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_email ON enquiries(email);
CREATE INDEX IF NOT EXISTS idx_enquiries_reference ON enquiries(enquiry_reference);

-- ------------------------------------------------------------------------------
-- 3. ADMIN USERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(150) NOT NULL DEFAULT 'Admin',
    role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'sales')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. AUDIT LOGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    admin_email VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL, -- e.g. 'PRODUCT_UPDATE', 'STATUS_CHANGE', 'PRODUCT_DELETE'
    entity VARCHAR(100) NOT NULL, -- 'products', 'enquiries', 'admin_users'
    entity_id TEXT NOT NULL,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ------------------------------------------------------------------------------
-- 5. COMPANY SETTINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS company_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'global',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. ENQUIRY REFERENCE SEQUENCE (Atomic & Database-Backed)
-- ------------------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS enquiry_ref_seq START WITH 500;

-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES FOR SUPABASE
-- ------------------------------------------------------------------------------
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- Products: Anyone can read published products; service role / authenticated admin can read/write all
CREATE POLICY "Public read published products" ON products
    FOR SELECT USING (published = true);

CREATE POLICY "Service role full access products" ON products
    FOR ALL USING (auth.role() = 'service_role');

-- Enquiries: Anyone can insert (submit quote); only service role / admin can view or modify
CREATE POLICY "Public insert enquiries" ON enquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role full access enquiries" ON enquiries
    FOR ALL USING (auth.role() = 'service_role');

-- Admin & Audit: Restricted to service role / server backend
CREATE POLICY "Service role full access admin_users" ON admin_users
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access audit_logs" ON audit_logs
    FOR ALL USING (auth.role() = 'service_role');

-- Company Settings: Public can read, only service role can update
CREATE POLICY "Public read company settings" ON company_settings
    FOR SELECT USING (true);

CREATE POLICY "Service role full access company settings" ON company_settings
    FOR ALL USING (auth.role() = 'service_role');

