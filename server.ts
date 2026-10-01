import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

import { dbAdapter } from './server/db';
import {
  requireAdmin,
  requireRole,
  requireCsrfProtection,
  signAdminToken,
  AuthenticatedRequest
} from './server/auth';
import { sendEnquiryEmails } from './server/email';
import { uploadProductImage } from './server/storage';
import {
  enquirySchema,
  enquiryStatusUpdateSchema,
  aiSpecRequestSchema,
  aiRecommendationOutputSchema,
  adminLoginSchema,
  productMutationSchema,
  productUpdateSchema,
  companySettingsSchema
} from './server/validators';

dotenv.config();

const currentFilename = fileURLToPath(import.meta.url);
const currentDirname = path.dirname(currentFilename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

// --- PRODUCTION STARTUP INTEGRITY CHECK ---
if (isProduction) {
  const requiredEnvVars = [
    'SESSION_SECRET',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  const missing = requiredEnvVars.filter(v => !process.env[v] || process.env[v]!.trim() === '');
  if (missing.length > 0) {
    console.error(`[FATAL BOOTSTRAP ERROR] Missing mandatory production environment variables: ${missing.join(', ')}`);
    console.error('Server execution halted to prevent operating in an unauthenticated or insecure state.');
    process.exit(1);
  }

  if (process.env.ADMIN_PASSWORD!.length < 12) {
    console.error('[FATAL BOOTSTRAP ERROR] ADMIN_PASSWORD must be at least 12 characters in production.');
    process.exit(1);
  }
}

// Rate Limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many authentication attempts. Please try again in 15 minutes.' }
});

// In production (NODE_ENV === 'production'):
//   - Rate limiting is strictly and unconditionally enforced at 20 enquiries/hour per IP.
//   - Disabling rate limits is strictly forbidden in production.
// In non-production (development / test):
//   - Default threshold is set to 100/hour (or ENQUIRY_RATE_LIMIT_MAX) so automated suites do not block manual testing.
//   - Developers can set ENQUIRY_RATE_LIMIT_ENABLED=false in their local environment for unlimited QA testing.
const isEnquiryRateLimitEnabled = isProduction
  ? true
  : process.env.ENQUIRY_RATE_LIMIT_ENABLED !== 'false';

const enquiryRateLimitMax = isProduction
  ? 20
  : (process.env.ENQUIRY_RATE_LIMIT_MAX ? parseInt(process.env.ENQUIRY_RATE_LIMIT_MAX, 10) : 100);

const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: enquiryRateLimitMax,
  skip: () => !isEnquiryRateLimitEnabled,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Temporary enquiry submission limit reached for this network (maximum 20 enquiries per hour). Your entered information has been preserved. Please wait a short while or connect directly with our trade desk via WhatsApp or Email.'
  }
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: { error: 'AI specification advisor rate limit reached. Please wait a few moments or contact our export desk.' }
});

// Lazy Gemini AI setup
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!aiClient && apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '') {
    try {
      aiClient = new GoogleGenAI({ apiKey });
    } catch (err) {
      console.error('Error initializing Gemini AI client:', err);
    }
  }
  return aiClient;
}

// Static upload directory
const UPLOADS_DIR = path.join(currentDirname, 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

async function startServer() {
  const app = express();

  // 1. Request correlation ID
  app.use((req, res, next) => {
    const reqId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
    res.setHeader('X-Request-Id', reqId);
    (req as any).id = reqId;
    next();
  });

  // 2. Strict Security Headers
  app.use(helmet({
    contentSecurityPolicy: false // Allows Vite HMR in dev and client-side styling
  }));

  // 3. Strict CORS configuration
  const allowedOrigins = [
    APP_URL,
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ].filter(Boolean);

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) ||
        (!isProduction && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')));
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy for untrusted origin.'));
      }
    },
    credentials: true
  }));

  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));

  // Sensitive API Cache-Control (prohibit caching admin and enquiry data)
  app.use(['/api/admin', '/api/enquiries'], (_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  // Static uploads
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Falcon International Traders API',
      database: dbAdapter.isSupabaseConfigured ? 'PostgreSQL (Supabase Authoritative)' : 'Local Store Mock',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
  });

  // --------------------------------------------------------------------------
  // 1. PRODUCTS API
  // --------------------------------------------------------------------------

  // Public list: ALWAYS strictly returns only published products. (No public ?all=true bypass!)
  app.get('/api/products', async (_req, res, next) => {
    try {
      const products = await dbAdapter.getProducts({ publishedOnly: true });
      res.json(products);
    } catch (err) {
      next(err);
    }
  });

  // Public product detail: MUST be published. Unpublished products return 404.
  app.get('/api/products/:slug', async (req, res, next) => {
    try {
      const product = await dbAdapter.getProductBySlug(req.params.slug, { publishedOnly: true });
      if (!product) {
        return res.status(404).json({ error: 'Product not found or currently not published.' });
      }
      res.json(product);
    } catch (err) {
      next(err);
    }
  });

  // Protected: Admin catalogue list (returns all products including unpublished)
  app.get('/api/admin/products', requireAdmin, async (_req: AuthenticatedRequest, res, next) => {
    try {
      const products = await dbAdapter.getProducts({ publishedOnly: false });
      res.json(products);
    } catch (err) {
      next(err);
    }
  });

  // Protected: Admin product detail by ID or slug (including unpublished)
  app.get('/api/admin/products/:id', requireAdmin, async (req: AuthenticatedRequest, res, next) => {
    try {
      const product = await dbAdapter.getProductBySlug(req.params.id, { publishedOnly: false });
      if (!product) {
        return res.status(404).json({ error: 'Product not found.' });
      }
      res.json(product);
    } catch (err) {
      next(err);
    }
  });

  // Protected: Create product (Admin & Super Admin only)
  app.post(
    '/api/products',
    requireAdmin,
    requireRole('admin', 'super_admin'),
    requireCsrfProtection,
    async (req: AuthenticatedRequest, res, next) => {
      try {
        const parsed = productMutationSchema.safeParse(req.body);
        if (!parsed.success) {
          return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
        }
        const adminEmail = req.admin!.email;
        const created = await dbAdapter.createProduct(parsed.data as any, adminEmail, req.ip);
        res.status(201).json(created);
      } catch (err) {
        next(err);
      }
    }
  );

  // Protected: Update product (Admin & Super Admin only)
  app.put(
    '/api/products/:id',
    requireAdmin,
    requireRole('admin', 'super_admin'),
    requireCsrfProtection,
    async (req: AuthenticatedRequest, res, next) => {
      try {
        const parsed = productUpdateSchema.safeParse(req.body);
        if (!parsed.success) {
          return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
        }
        const adminEmail = req.admin!.email;
        const updated = await dbAdapter.updateProduct(req.params.id, parsed.data as any, adminEmail, req.ip);
        if (!updated) {
          return res.status(404).json({ error: 'Product not found.' });
        }
        res.json(updated);
      } catch (err) {
        next(err);
      }
    }
  );

  // Protected: Delete product (SUPER ADMIN ONLY)
  app.delete(
    '/api/products/:id',
    requireAdmin,
    requireRole('super_admin'),
    requireCsrfProtection,
    async (req: AuthenticatedRequest, res, next) => {
      try {
        const adminEmail = req.admin!.email;
        const deleted = await dbAdapter.deleteProduct(req.params.id, adminEmail, req.ip);
        if (!deleted) {
          return res.status(404).json({ error: 'Product not found.' });
        }
        res.json({ success: true, message: 'Product permanently deleted.' });
      } catch (err) {
        next(err);
      }
    }
  );

  // --------------------------------------------------------------------------
  // 2. ENQUIRIES / LEADS API
  // --------------------------------------------------------------------------

  // Public: Submit quote enquiry
  app.post('/api/enquiries', enquiryLimiter, async (req, res, next) => {
    try {
      const validation = enquirySchema.safeParse(req.body);
      if (!validation.success) {
        const errorMsg = validation.error.issues.map(e => e.message).join('. ');
        return res.status(400).json({ success: false, error: errorMsg });
      }

      const enquiryData = validation.data;

      // Honeypot spam check
      if (enquiryData.website_hp && enquiryData.website_hp.length > 0) {
        console.warn('[Spam Detection] Honeypot field filled. Dropping enquiry silently.');
        return res.status(200).json({
          success: true,
          message: 'Enquiry received.',
          enquiry: { enquiryReference: 'FAL-SPAM-DETECTED' }
        });
      }

      // Save enquiry to authoritative database (errors propagate as 500)
      const createdEnquiry = await dbAdapter.createEnquiry(enquiryData);

      // Asynchronously trigger two-way email notification via Resend
      sendEnquiryEmails({
        reference: createdEnquiry.enquiryReference,
        fullName: createdEnquiry.fullName,
        companyName: createdEnquiry.companyName,
        country: createdEnquiry.country,
        email: createdEnquiry.email,
        whatsapp: createdEnquiry.whatsapp,
        productName: createdEnquiry.productName,
        estimatedQuantity: createdEnquiry.estimatedQuantity,
        packagingRequirement: createdEnquiry.packagingRequirement,
        message: createdEnquiry.message
      }).catch(e => console.error('[Email Notification Failure]:', e?.message));

      return res.status(201).json({
        success: true,
        message: 'Thank you for contacting Falcon International Traders. Your enquiry has been officially logged in our trade system.',
        enquiry: createdEnquiry
      });
    } catch (err) {
      next(err);
    }
  });

  // Protected: Get all enquiries (Sales, Admin, Super Admin)
  app.get(
    '/api/enquiries',
    requireAdmin,
    requireRole('sales', 'admin', 'super_admin'),
    async (req: AuthenticatedRequest, res, next) => {
      try {
        const status = req.query.status as string | undefined;
        const search = req.query.search as string | undefined;
        const enquiries = await dbAdapter.getEnquiries({ status, search });
        res.json(enquiries);
      } catch (err) {
        next(err);
      }
    }
  );

  // Protected: Update enquiry (Sales, Admin, Super Admin)
  app.patch(
    '/api/enquiries/:id',
    requireAdmin,
    requireRole('sales', 'admin', 'super_admin'),
    requireCsrfProtection,
    async (req: AuthenticatedRequest, res, next) => {
      try {
        const parsed = enquiryStatusUpdateSchema.safeParse(req.body);
        if (!parsed.success) {
          return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
        }
        const adminEmail = req.admin!.email;
        const updated = await dbAdapter.updateEnquiry(req.params.id, parsed.data, adminEmail, req.ip);
        if (!updated) {
          return res.status(404).json({ error: 'Enquiry not found.' });
        }
        res.json(updated);
      } catch (err) {
        next(err);
      }
    }
  );

  // Protected: Delete enquiry (Admin & Super Admin only)
  app.delete(
    '/api/enquiries/:id',
    requireAdmin,
    requireRole('admin', 'super_admin'),
    requireCsrfProtection,
    async (req: AuthenticatedRequest, res, next) => {
      try {
        const adminEmail = req.admin!.email;
        const deleted = await dbAdapter.deleteEnquiry(req.params.id, adminEmail, req.ip);
        if (!deleted) {
          return res.status(404).json({ error: 'Enquiry not found.' });
        }
        res.json({ success: true, message: 'Enquiry deleted.' });
      } catch (err) {
        next(err);
      }
    }
  );

  // --------------------------------------------------------------------------
  // 3. ADMIN AUTHENTICATION
  // --------------------------------------------------------------------------

  // Admin login: Sets HttpOnly cookie; NEVER exposes raw JWT token in JSON response
  app.post('/api/admin/login', authLimiter, async (req, res, next) => {
    try {
      const parsed = adminLoginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Email and password (min 8 characters) are required.' });
      }

      const { email, password } = parsed.data;
      const adminUser = await dbAdapter.verifyAdmin(email, password);

      if (!adminUser) {
        return res.status(401).json({ error: 'Invalid admin credentials or account inactive.' });
      }

      const token = signAdminToken({
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role
      });

      // Set secure HttpOnly cookie
      res.cookie('falcon_admin_token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000 // 8 hours
      });

      // Return user profile WITHOUT leaking the raw JWT token in JSON
      return res.json({
        success: true,
        admin: {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name || 'Admin',
          role: adminUser.role
        }
      });
    } catch (err) {
      next(err);
    }
  });

  // Admin logout: Clears HttpOnly cookie
  app.post('/api/admin/logout', (_req, res) => {
    res.clearCookie('falcon_admin_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax'
    });
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // Session verification: Reads cookie
  app.get('/api/admin/session', requireAdmin, (req: AuthenticatedRequest, res) => {
    res.json({
      valid: true,
      admin: req.admin
    });
  });

  // Protected: Audit logs (Admin and Super Admin only)
  app.get(
    '/api/admin/audit-logs',
    requireAdmin,
    requireRole('admin', 'super_admin'),
    async (_req: AuthenticatedRequest, res, next) => {
      try {
        const logs = await dbAdapter.getAuditLogs();
        res.json(logs);
      } catch (err) {
        next(err);
      }
    }
  );

  // --------------------------------------------------------------------------
  // 4. IMAGE UPLOAD API (Supabase Storage / Magic Bytes Checked)
  // --------------------------------------------------------------------------

  app.post(
    '/api/admin/upload-image',
    requireAdmin,
    requireRole('admin', 'super_admin'),
    requireCsrfProtection,
    async (req: AuthenticatedRequest, res, next) => {
      try {
        const { imageData, filename } = req.body;
        if (!imageData || typeof imageData !== 'string') {
          return res.status(400).json({ error: 'Base64 image data string is required.' });
        }

        const uploadResult = await uploadProductImage(
          imageData,
          filename || 'spice_product',
          dbAdapter.supabase
        );

        const adminEmail = req.admin!.email;
        await dbAdapter.logAudit({
          adminEmail,
          action: 'IMAGE_UPLOAD',
          entity: 'image',
          entityId: uploadResult.filename,
          oldValue: null,
          newValue: {
            url: uploadResult.url,
            sizeBytes: uploadResult.sizeBytes,
            provider: uploadResult.storageProvider
          },
          ipAddress: req.ip
        });

        return res.status(201).json({
          success: true,
          url: uploadResult.url
        });
      } catch (err: any) {
        return res.status(400).json({ error: err.message || 'Failed to upload image.' });
      }
    }
  );

  // --------------------------------------------------------------------------
  // 5. COMPANY SETTINGS API (PostgreSQL Backed)
  // --------------------------------------------------------------------------

  // Public: Get company settings
  app.get('/api/company-settings', async (_req, res, next) => {
    try {
      const settings = await dbAdapter.getCompanySettings();
      res.json(settings);
    } catch (err) {
      next(err);
    }
  });

  // Protected: Update company settings (SUPER ADMIN ONLY)
  app.put(
    '/api/admin/settings',
    requireAdmin,
    requireRole('super_admin'),
    requireCsrfProtection,
    async (req: AuthenticatedRequest, res, next) => {
      try {
        const parsed = companySettingsSchema.safeParse(req.body);
        if (!parsed.success) {
          return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
        }
        const adminEmail = req.admin!.email;
        const updated = await dbAdapter.updateCompanySettings(parsed.data, adminEmail, req.ip);
        res.json(updated);
      } catch (err) {
        next(err);
      }
    }
  );

  // --------------------------------------------------------------------------
  // 6. GEMINI AI SPECIFICATIONS ADVISOR (Hardened with Timeout & Zod Validation)
  // --------------------------------------------------------------------------

  app.post('/api/ai-spec-recommendation', aiLimiter, async (req, res) => {
    const parsed = aiSpecRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map(e => e.message).join('. ');
      return res.status(400).json({ success: false, error: msg });
    }

    const { productInterest, targetMarket, requirement } = parsed.data;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        success: false,
        error: 'AI Specification Assistant is currently unconfigured or unavailable. Please contact our export desk directly at export@falconspices.com or via WhatsApp for verified technical specifications.'
      });
    }

    try {
      const prompt = `You are a technical Indian spice export specialist for Falcon International Traders.
A B2B commercial food buyer is requesting specification advice:
- Product Interest: ${productInterest}
- Destination Market / Port: ${targetMarket}
- Specific Requirement: ${requirement}

Respond ONLY with a valid, single JSON object matching this exact schema:
{
  "recommendedGrade": "string specifying standard export quality grade or active component range",
  "moisture": "string e.g. Max 10.0%",
  "meshSize": "string e.g. 60 - 80 Mesh Fine Powder",
  "packaging": "string describing ideal export packaging",
  "microbiology": "string describing sterilization/microbiological requirement (e.g. steam sterilized)",
  "notes": "string with concise export logistics or handling guidance",
  "disclaimer": "AI recommendations provide preliminary technical guidance only. Every commercial consignment is verified against accredited Certificate of Analysis (COA) testing according to destination regulatory limits."
}`;

      // 10-second timeout protection to avoid hanging upstream requests
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('AI generation request timed out after 10000ms')), 10000);
      });

      const generatePromise = ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const responseText = response.text || '';

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('[AI Service] Gemini did not return a valid JSON object structure.');
        return res.status(503).json({
          success: false,
          error: 'AI Specification Assistant was unable to generate an authoritative recommendation. Please contact our technical export desk directly for verified batch specifications.'
        });
      }

      let parsedJson: any;
      try {
        parsedJson = JSON.parse(jsonMatch[0]);
      } catch (jsonErr) {
        console.warn('[AI Service] Failed to parse JSON from Gemini response.');
        return res.status(503).json({
          success: false,
          error: 'AI output validation error. Please contact our technical export desk for verified batch specifications.'
        });
      }

      // Strictly validate Gemini's JSON output with Zod
      const validatedOutput = aiRecommendationOutputSchema.safeParse(parsedJson);
      if (!validatedOutput.success) {
        console.warn('[AI Service] Gemini JSON output failed Zod schema validation:', validatedOutput.error.flatten());
        return res.status(503).json({
          success: false,
          error: 'AI generated output did not conform to export technical standards. Please contact our technical export desk directly for verified batch specifications.'
        });
      }

      return res.json({
        success: true,
        recommendation: validatedOutput.data
      });
    } catch (err: any) {
      console.error('[AI Service Error]:', err?.message || err);
      return res.status(503).json({
        success: false,
        error: 'AI Specification Assistant is temporarily unavailable. Please reach our technical export team directly at export@falconspices.com or via WhatsApp.'
      });
    }
  });

  // --------------------------------------------------------------------------
  // 7. SITEMAP.XML & ROBOTS.TXT
  // --------------------------------------------------------------------------

  app.get('/robots.txt', (_req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/admin/*

Sitemap: ${APP_URL}/sitemap.xml
`);
  });

  app.get('/sitemap.xml', async (_req, res) => {
    try {
      const products = await dbAdapter.getProducts({ publishedOnly: true });
      const staticPages = [
        '',
        '/products',
        '/about',
        '/quality',
        '/export',
        '/private-label',
        '/contact'
      ];

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    path => `  <url>
    <loc>${APP_URL}${path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${path === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
${products
  .map(
    p => `  <url>
    <loc>${APP_URL}/products/${p.slug}</loc>
    <lastmod>${(p.updatedAt || p.createdAt || new Date().toISOString()).split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

      res.type('application/xml');
      res.send(xml);
    } catch (err) {
      res.status(500).send('Error generating sitemap.');
    }
  });

  // --------------------------------------------------------------------------
  // 8. CENTRALIZED ERROR HANDLING MIDDLEWARE (Never leaks stack traces)
  // --------------------------------------------------------------------------
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const reqId = (req as any).id || 'unknown';
    console.error(`[Error Handler] [Request ${reqId}]:`, err?.message || err);

    if (res.headersSent) return;

    const statusCode = err.status || err.statusCode || 500;
    const clientMessage =
      isProduction && statusCode === 500
        ? 'Internal Server Error. Please contact support or retry shortly.'
        : err.message || 'An unexpected error occurred.';

    res.status(statusCode).json({
      error: clientMessage,
      requestId: reqId
    });
  });

  // --------------------------------------------------------------------------
  // 9. VITE SSR / CLIENT SPA SERVING
  // --------------------------------------------------------------------------
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(currentDirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.info(`[Falcon Server] Running at ${APP_URL} in ${process.env.NODE_ENV || 'development'} mode.`);
  });
}

startServer().catch(err => {
  console.error('[Fatal Error starting server]:', err);
  process.exit(1);
});
