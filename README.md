# Falcon International Traders — B2B Agro-Commodities & Spice Export Platform

> **Pre-Handoff Architecture & Developer Documentation**  
> Falcon International Traders is a specialized B2B Indian agro-commodities and spice export platform built for international commercial buyers, food manufacturers, importers, and procurement desks. The system streamlines commodity discovery, laboratory specification matching, customized bulk packaging requests, formal export quotations, and trade desk management.

---

## ⚠️ Pre-Handoff Status & Non-Production Notice

> [!IMPORTANT]
> **This codebase is in Pre-Handoff stage.** While core architecture, data schemas, API routes, and interface layouts are fully structured and backed by automated unit/integration test suites, **this repository is NOT yet production-deployed or production-verified.**
>
> Production deployment requires manual setup and verification by a human developer or Falcon's operations team (including live Supabase provisioning, DNS records, Resend domain verification, verified trade desk contacts, and production secrets). See [Human Production Handoff Checklist](#-human-production-handoff-checklist).

---

## 🏛️ Project Architecture & Purpose

Falcon International Traders acts as a high-trust digital trade desk bridging Indian spice cultivation hubs (Guntur, Erode, Unjha, Cochin) with global ports (Rotterdam, Jebel Ali, Hamburg, New York, Singapore).

### Primary Functions:
1. **Public Export Catalogue**: Presentation of whole spices, ground powders, and dehydrated botanicals with chemical parameters (Curcumin %, Capsaicin SHU, Volatile Oils, moisture limits, and ASTA color values).
2. **AI-Powered Technical Specification Advisor**: An interactive export advisory desk leveraging Google Gemini Flash to generate indicative export specifications, mesh sizes, microbiological thresholds, and packaging guidance tailored to destination markets.
3. **Interactive Packaging Customizer & Inquiry Dispatch**: B2B bulk buyers can configure multi-wall paper sacks, retail pouches, vacuum moisture-barrier bags, and generate quotation inquiries with unique tracking references (`FAL-YYYY-NNNNN`).
4. **Cookie-First Administrative Operations Portal**: Internal dashboard for trade staff and super administrators to manage catalogue lots, review buyer enquiries, update negotiation statuses, and inspect audit logs.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT / SPA LAYER                              │
│  React 19 + TypeScript + Vite + Vanilla CSS + Tailwind + Lucide Icons │
│  - Cinematic Hero with ThreeUI kinetic styling & particle atmosphere   │
│  - AnimatedTopDock Command Navigation Bar                              │
│  - Modular Page Routing (Catalogue, Technical Specs, Quality Protocols)│
│  - Admin Operations Management Dashboard (HttpOnly Cookie-Secured)     │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                         HTTPS / JSON / Cookies
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│                    EXPRESS BACKEND RUNTIME (server.ts)                  │
│  - Security: Helmet headers, strict CORS, Cookie-Parser, CSRF tokens   │
│  - Rate Limiting: Authentication (10/15m), Quotes (20/1h), AI (25/15m) │
│  - Role-Based Access Control (RBAC): super_admin, admin, sales         │
│  - Correlation Tracking: X-Request-Id header on all transactions       │
│  - Input Validation: Strict Zod schemas on every mutation & submission │
└──────────────┬───────────────────┬────────────────────┬────────────────┘
               │                   │                    │
    PostgreSQL / Supabase      Resend API          Gemini 2.5 Flash
    (Authoritative DB)      (Transactional)     (Technical Advisor)
     - products              - Buyer Confirmation  - Export spec guidance
     - enquiries             - Internal Sales      - 10s timeout protection
     - admin_users             Notification        - Strict Zod validation
     - audit_logs                                  - Anti-hallucination bounds
     - company_settings
     - atomic sequences
```

---

## 💻 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Runtime** | React 19, TypeScript 5.8, Vite 6 |
| **Styling & Effects** | Tailwind CSS v4, Lucide React, Three.js, Canvas 2D / WebGL |
| **Backend Runtime** | Node.js (ESM), Express 4.21, TypeScript (tsx runtime / esbuild) |
| **Database & Entity Layer** | PostgreSQL / Supabase (`schema.sql`), local JSON offline adapter |
| **Authentication & Security** | JWT (jsonwebtoken), bcryptjs (12 salt rounds), HttpOnly cookies, Helmet |
| **Validation & Sanitization** | Zod schemas, xss sanitization, magic-byte image header verification |
| **Integrations** | Google Gemini GenAI SDK (`@google/genai`), Resend transactional email |

---

## 🗄️ Database Architecture (PostgreSQL & Supabase)

In production, **PostgreSQL via Supabase is the sole authoritative source of truth**. All database tables, indexes, constraints, and Row Level Security (RLS) policies are defined in [`schema.sql`](file:///c:/Users/Tanay%20Bhalwankar/Projects/Falcon/schema.sql).

### Table Schema Overview:
- **`products`**: Export commodities, Latin botanical taxonomy, harvest origin, active compound concentrations, mesh sizes, packaging options, certification tags, and publishing status (`published: boolean`).
- **`enquiries`**: Inbound trade inquiries with contact details, requested spice, volume (MT), destination port, packaging requirement, inquiry reference code, and CRM status (`pending`, `contacted`, `quoted`, `sample_dispatched`, `closed`).
- **`admin_users`**: Privileged staff credentials with UUID primary keys, bcrypt-hashed passwords (salt rounds = 12), and role tags (`super_admin`, `admin`, `sales`).
- **`audit_logs`**: Immutable audit records storing `user_id`, `action`, `entity`, `entity_id`, before/after state diffs (`old_data`, `new_data`), and client IP.
- **`company_settings`**: Singleton trade desk metadata (official legal name, registered trade email, WhatsApp desk, port hubs, social URLs).
- **`enquiry_ref_seq`**: Atomic database sequence generating standardized inquiry tracking references (`FAL-YYYY-NNNNN`).

### Object Storage (`storage.ts`):
- Image uploads verify **binary magic bytes** (JPEG `FF D8 FF`, PNG `89 50 4E 47`, WEBP `RIFF...WEBP`) before writing to disk or Supabase Storage (`product-images` bucket), mitigating arbitrary file upload vectors.

---

## 🔐 Authentication & Security Model

> [!NOTE]
> The security architecture includes foundational defenses outlined below. Final penetration testing and live environment sign-off are required during human production handoff.

1. **HttpOnly Cookie Architecture**:
   - Authentication tokens (`falcon_admin_token`) are transmitted exclusively via `HttpOnly`, `SameSite: 'lax'`, `Secure` cookies.
   - Tokens are never exposed in JSON responses or stored in `localStorage`, mitigating client-side XSS token exfiltration.
2. **Role-Based Access Control (RBAC)**:
   - `super_admin`: Full system authority, administrative user provisioning, product deletion, company settings updates.
   - `admin`: Product creation and edits, enquiry status updates, audit log inspection.
   - `sales`: Read-only catalogue access, enquiry status progression, and buyer communications.
3. **Strict Zod Input Validation**:
   - Every public and administrative API endpoint validates incoming payloads with strict Zod schemas rejecting unknown fields, malicious email formats, and invalid data types.
4. **Origin & CSRF Protection**:
   - State-changing admin routes (`POST`, `PUT`, `PATCH`, `DELETE`) require custom security verification headers (`X-Falcon-Admin` or `X-Requested-With`) and strict Origin/Referer matching.
5. **Rate Limiting Defenses**:
   - Sensitive endpoints are protected by dedicated in-memory rate limiters:
     - Admin Login: Max 10 requests per 15 minutes.
     - Quote Submission: Max 20 requests per hour.
     - AI Specification Advisor: Max 25 queries per 15 minutes.
6. **Public vs. Protected Content Isolation**:
   - Public catalogue APIs strictly filter `published = true`. Unpublished lots return 404 to unauthorized visitors.

---

## 📋 Environment Configuration Template

The repository includes a safe, fully documented template at [`.env.example`](file:///c:/Users/Tanay%20Bhalwankar/Projects/Falcon/.env.example). **Never commit real credentials to Git.**

```env
# Runtime Environment ('development' | 'production' | 'test')
NODE_ENV="development"
PORT=3000

# Canonical Application URL (Used for CORS and email links)
APP_URL="http://localhost:3000"

# PostgreSQL & Supabase Database Configuration
SUPABASE_URL=""
SUPABASE_SERVICE_ROLE_KEY=""
DATABASE_URL=""

# Cryptographic Session Secret (Min 32 characters in production)
SESSION_SECRET=""

# Initial Administrative User Bootstrap (Hashed with bcrypt on creation)
ADMIN_EMAIL=""
ADMIN_PASSWORD=""

# Transactional Email Service (Resend)
RESEND_API_KEY=""

# Google Gemini API Key (Server-side Technical AI Specification Assistant)
GEMINI_API_KEY=""

# Company Trade Desk Contact Placeholders (Verify with Falcon management)
BUSINESS_EMAIL="export@falconspices.com"
WHATSAPP_NUMBER="+919876543210"
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/cybertanay/Falcon.git
cd Falcon

# Install dependencies
npm install
```

### 3. Configure Local Environment
```bash
# Create local development environment file
cp .env.example .env
```
*(In local development without Supabase credentials, the backend operates in offline development mode using `data_store.json` as a mock data store).*

### 4. Running the Development Server
```bash
# Start full-stack development server (Express backend + Vite HMR)
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### 5. Running Verification & Test Suites
```bash
# Execute automated backend test suite
npm test

# Verify TypeScript type correctness across client and server
npm run lint

# Build production bundle (Vite client + esbuild bundled server)
npm run build

# Start the compiled production server locally
npm start
```

---

## 🧪 Automated Test Suite

Run `npm test` to execute the built-in regression test suite ([`test/backend.test.ts`](file:///c:/Users/Tanay%20Bhalwankar/Projects/Falcon/test/backend.test.ts)):
- ✅ **Bcrypt Hashing**: Generates unique cryptographic salts and validates plaintexts.
- ✅ **JWT Token Creation**: Signs verifiable administrative tokens with expiration parameters.
- ✅ **RBAC Enforcement**: Verifies authorized roles and rejects unauthorized roles with 403 Forbidden.
- ✅ **Enquiry Validation**: Rejects invalid emails, missing quantities, and honeypot spam fields.
- ✅ **Product Schema**: Enforces lowercase hyphenated URL slugs and valid agro-commodity categories.
- ✅ **Unpublished Lot Isolation**: Ensures unpublished catalogue items are invisible to public buyers.
- ✅ **Canonical Reference Generation**: Confirms sequence output follows `FAL-YYYY-NNNNN`.
- ✅ **AI Output Schema**: Validates structured technical output parameters and guards against malformed responses.

---

## 📋 Human Production Handoff Checklist

Before deploying this application to a live domain, a human developer or system administrator must execute the following checklist:

### 1. Database & Cloud Infrastructure
- [ ] Create a dedicated project in [Supabase](https://supabase.com).
- [ ] Navigate to **SQL Editor** in the Supabase Dashboard and run [`schema.sql`](file:///c:/Users/Tanay%20Bhalwankar/Projects/Falcon/schema.sql) to provision all tables, constraints, sequences, and indexes.
- [ ] Create a private or public Supabase Storage bucket named `product-images` and configure read/write storage policies.
- [ ] Obtain `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from Supabase Project Settings -> API.

### 2. Environment Variables & Secret Provisioning
- [ ] Set `NODE_ENV=production` on the hosting provider (e.g. Render, Railway, AWS, DigitalOcean).
- [ ] Generate a secure 32+ character random secret for `SESSION_SECRET`:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Set `ADMIN_EMAIL` and a strong initial `ADMIN_PASSWORD` (minimum 12 characters, mixed case, symbols).
- [ ] Set `APP_URL` to the live canonical domain (e.g. `https://falconinternationaltraders.com`).

### 3. Third-Party API Keys & Domain Authentication
- [ ] **Resend Email Service**:
  - Sign up at [Resend](https://resend.com) and add the official sending domain.
  - Configure SPF, DKIM, and DMARC DNS records with your domain registrar.
  - Set `RESEND_API_KEY` in environment secrets.
- [ ] **Google Gemini API**:
  - Provision a production Gemini API key in Google Cloud Console / AI Studio.
  - Ensure budget alerts and billing controls are active.
  - Set `GEMINI_API_KEY` in environment secrets.

### 4. Verification of Company Information
- [ ] **Verify Contact Channels**: Verify official `BUSINESS_EMAIL`, phone numbers, and `WHATSAPP_NUMBER` with Falcon management ([`src/data/company.ts`](file:///c:/Users/Tanay%20Bhalwankar/Projects/Falcon/src/data/company.ts)).
- [ ] **Verify Corporate Address**: Confirm registered Indian office and port terminal locations (Navi Mumbai, Cochin).
- [ ] **Verify Legal Pages**: Review [`PrivacyPolicyPage.tsx`](file:///c:/Users/Tanay%20Bhalwankar/Projects/Falcon/src/pages/PrivacyPolicyPage.tsx) and [`TermsConditionsPage.tsx`](file:///c:/Users/Tanay%20Bhalwankar/Projects/Falcon/src/pages/TermsConditionsPage.tsx) with Falcon's legal counsel for jurisdiction-specific export terms (INCOTERMS 2020: FOB, CIF, CFR).
- [ ] **Verify Specifications**: Review product baseline specifications, moisture limits, and ASTA color values with laboratory quality controllers.

### 5. Production Deployment, Backups & Monitoring
- [ ] Configure custom domain and SSL/TLS certificate (HTTPS enforced).
- [ ] Enable automated daily PostgreSQL backups and WAL archiving in Supabase.
- [ ] Set up uptime monitoring (e.g. Better Uptime, Datadog, Sentry) targeting `/api/health`.
- [ ] Perform a full end-to-end test of the quote workflow, email delivery, admin login, and image upload.

---

## 📄 License & Proprietary Notice

Proprietary and Confidential. Copyright © 2026 **Falcon International Traders**. All rights reserved.  
Unauthorized copying, modification, distribution, or commercial deployment of this software without prior written permission is strictly prohibited.