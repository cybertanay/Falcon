import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

import { dbAdapter } from './server/db';
import { requireAdmin, signAdminToken, AuthenticatedRequest } from './server/auth';
import { sendEnquiryEmails } from './server/email';
import {
  enquirySchema,
  enquiryStatusUpdateSchema,
  aiSpecRequestSchema,
  adminLoginSchema,
  productMutationSchema
} from './server/validators';

dotenv.config();

const currentFilename = fileURLToPath(import.meta.url);
const currentDirname = path.dirname(currentFilename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

// Rate Limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many authentication attempts. Please try again in 15 minutes.' }
});

const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: 'Enquiry submission rate limit reached. Please reach our export desk via WhatsApp or Email.' }
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

// Upload directory setup
const UPLOADS_DIR = path.join(currentDirname, 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

async function startServer() {
  const app = express();

  // Basic security headers
  app.use(helmet({
    contentSecurityPolicy: false // Allows Vite HMR in dev and inline scripts if required
  }));

  // Strict CORS configuration
  const allowedOrigins = [
    APP_URL,
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ];

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy for untrusted origin.'));
      }
    },
    credentials: true
  }));

  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' })); // Support base64 image uploads

  // Serve static uploads
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Falcon International Traders API',
      database: dbAdapter.isSupabaseConfigured ? 'PostgreSQL (Supabase)' : 'Local Store (PostgreSQL-Compatible)',
      timestamp: new Date().toISOString()
    });
  });

  // --------------------------------------------------------------------------
  // 1. PRODUCTS API
  // --------------------------------------------------------------------------
  
  // Public list: only published products unless admin explicitly requests all
  app.get('/api/products', async (req, res) => {
    try {
      const showAll = req.query.all === 'true';
      const products = await dbAdapter.getProducts({ publishedOnly: !showAll });
      res.json(products);
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Failed to retrieve products catalogue.' });
    }
  });

  // Public product detail
  app.get('/api/products/:slug', async (req, res) => {
    try {
      const product = await dbAdapter.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ error: 'Product not found.' });
      }
      res.json(product);
    } catch (err) {
      console.error('Error retrieving product:', err);
      res.status(500).json({ error: 'Failed to retrieve product details.' });
    }
  });

  // Protected: Create product
  app.post('/api/products', requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const parsed = productMutationSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
      }
      const adminEmail = req.admin?.email || 'admin@falconspices.com';
      const created = await dbAdapter.createProduct(parsed.data as any, adminEmail);
      res.status(201).json(created);
    } catch (err) {
      console.error('Error creating product:', err);
      res.status(500).json({ error: 'Failed to create product.' });
    }
  });

  // Protected: Update product
  app.put('/api/products/:id', requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const adminEmail = req.admin?.email || 'admin@falconspices.com';
      const updated = await dbAdapter.updateProduct(req.params.id, req.body, adminEmail);
      if (!updated) {
        return res.status(404).json({ error: 'Product not found.' });
      }
      res.json(updated);
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ error: 'Failed to update product.' });
    }
  });

  // Protected: Delete product
  app.delete('/api/products/:id', requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const adminEmail = req.admin?.email || 'admin@falconspices.com';
      const deleted = await dbAdapter.deleteProduct(req.params.id, adminEmail);
      if (!deleted) {
        return res.status(404).json({ error: 'Product not found.' });
      }
      res.json({ success: true, message: 'Product deleted successfully.' });
    } catch (err) {
      console.error('Error deleting product:', err);
      res.status(500).json({ error: 'Failed to delete product.' });
    }
  });

  // --------------------------------------------------------------------------
  // 2. ENQUIRIES / LEADS API
  // --------------------------------------------------------------------------

  // Public: Submit quote enquiry
  app.post('/api/enquiries', enquiryLimiter, async (req, res) => {
    try {
      const validation = enquirySchema.safeParse(req.body);
      if (!validation.success) {
        const errorMsg = validation.error.issues.map(e => e.message).join('. ');
        return res.status(400).json({ success: false, error: errorMsg });
      }

      const enquiryData = validation.data;

      // Honeypot spam check
      if (enquiryData.website_hp && enquiryData.website_hp.length > 0) {
        console.warn('[Spam Detection] Honeypot field filled. Dropping silently.');
        return res.status(200).json({
          success: true,
          message: 'Enquiry received.',
          enquiry: { enquiryReference: 'FAL-SPAM-DETECTED' }
        });
      }

      // Save enquiry to database
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
      }).catch(e => console.error('Enquiry email trigger failure:', e));

      return res.status(201).json({
        success: true,
        message: 'Thank you for contacting Falcon International Traders. Your enquiry has been officially logged.',
        enquiry: createdEnquiry
      });
    } catch (err) {
      console.error('Error processing enquiry submission:', err);
      return res.status(500).json({
        success: false,
        error: 'Unable to process enquiry at this moment. Please reach our export team directly via WhatsApp or Email.'
      });
    }
  });

  // Protected: Get all enquiries
  app.get('/api/enquiries', requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;
      const enquiries = await dbAdapter.getEnquiries({ status, search });
      res.json(enquiries);
    } catch (err) {
      console.error('Error retrieving enquiries:', err);
      res.status(500).json({ error: 'Failed to retrieve enquiries.' });
    }
  });

  // Protected: Update enquiry (status, notes, assignedStaff)
  app.patch('/api/enquiries/:id', requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const parsed = enquiryStatusUpdateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
      }
      const adminEmail = req.admin?.email || 'admin@falconspices.com';
      const updated = await dbAdapter.updateEnquiry(req.params.id, parsed.data, adminEmail);
      if (!updated) {
        return res.status(404).json({ error: 'Enquiry not found.' });
      }
      res.json(updated);
    } catch (err) {
      console.error('Error updating enquiry:', err);
      res.status(500).json({ error: 'Failed to update enquiry.' });
    }
  });

  // Protected: Delete enquiry
  app.delete('/api/enquiries/:id', requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const adminEmail = req.admin?.email || 'admin@falconspices.com';
      const deleted = await dbAdapter.deleteEnquiry(req.params.id, adminEmail);
      if (!deleted) {
        return res.status(404).json({ error: 'Enquiry not found.' });
      }
      res.json({ success: true, message: 'Enquiry deleted.' });
    } catch (err) {
      console.error('Error deleting enquiry:', err);
      res.status(500).json({ error: 'Failed to delete enquiry.' });
    }
  });

  // --------------------------------------------------------------------------
  // 3. ADMIN AUTHENTICATION
  // --------------------------------------------------------------------------

  // Admin login endpoint
  app.post('/api/admin/login', authLimiter, async (req, res) => {
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

      // Set HttpOnly cookie
      res.cookie('falcon_admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000 // 8 hours
      });

      return res.json({
        success: true,
        token,
        admin: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role
        }
      });
    } catch (err) {
      console.error('Admin login error:', err);
      return res.status(500).json({ error: 'An unexpected authentication error occurred.' });
    }
  });

  // Admin logout endpoint
  app.post('/api/admin/logout', (req, res) => {
    res.clearCookie('falcon_admin_token');
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // Session verification endpoint
  app.get('/api/admin/session', requireAdmin, (req: AuthenticatedRequest, res) => {
    res.json({
      valid: true,
      admin: req.admin
    });
  });

  // Protected: Audit logs
  app.get('/api/admin/audit-logs', requireAdmin, async (_req: AuthenticatedRequest, res) => {
    try {
      const logs = await dbAdapter.getAuditLogs();
      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve audit logs.' });
    }
  });

  // --------------------------------------------------------------------------
  // 4. IMAGE UPLOAD API
  // --------------------------------------------------------------------------

  app.post('/api/admin/upload-image', requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const { imageData, filename } = req.body;
      if (!imageData || typeof imageData !== 'string') {
        return res.status(400).json({ error: 'Base64 image data string is required.' });
      }

      // Check format (e.g. data:image/jpeg;base64,...)
      const matches = imageData.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json({ error: 'Invalid image format. Must be base64 data URI.' });
      }

      const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
      const buffer = Buffer.from(matches[2], 'base64');

      // 5MB limit
      if (buffer.length > 5 * 1024 * 1024) {
        return res.status(400).json({ error: 'Image exceeds maximum allowable size of 5MB.' });
      }

      const cleanFilename = (filename || 'spice-product')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .substring(0, 30);
      const safeName = `${cleanFilename}_${Date.now()}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, safeName);

      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${safeName}`;

      const adminEmail = req.admin?.email || 'admin@falconspices.com';
      await dbAdapter.logAudit({
        adminEmail,
        action: 'IMAGE_UPLOAD',
        entity: 'image',
        entityId: safeName,
        oldValue: null,
        newValue: { publicUrl, sizeBytes: buffer.length }
      });

      return res.status(201).json({
        success: true,
        url: publicUrl
      });
    } catch (err) {
      console.error('Image upload error:', err);
      return res.status(500).json({ error: 'Failed to upload image.' });
    }
  });

  // --------------------------------------------------------------------------
  // 5. COMPANY SETTINGS API
  // --------------------------------------------------------------------------

  // Public: Get company settings
  app.get('/api/company-settings', async (_req, res) => {
    try {
      const settings = await dbAdapter.getCompanySettings();
      res.json(settings);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve company settings.' });
    }
  });

  // Protected: Update company settings
  app.put('/api/admin/settings', requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const adminEmail = req.admin?.email || 'admin@falconspices.com';
      const updated = await dbAdapter.updateCompanySettings(req.body, adminEmail);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update company settings.' });
    }
  });

  // --------------------------------------------------------------------------
  // 6. GEMINI AI SPECIFICATIONS & PACKAGING ADVISOR
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
        error: 'AI Specification Assistant is currently unconfigured or unavailable. Please contact our export team directly for tailored specifications.'
      });
    }

    try {
      const prompt = `You are a technical Indian spice export specialist for Falcon International Traders.
A B2B buyer is requesting specification advice:
- Product Interest: ${productInterest}
- Destination Market / Port: ${targetMarket}
- Buyer Specific Requirement: ${requirement}

Respond ONLY with a valid JSON object matching this exact schema:
{
  "recommendedGrade": "string specifying standard export quality grade or active component range",
  "moisture": "string e.g. Max 10.0%",
  "meshSize": "string e.g. 60 - 80 Mesh Fine Powder",
  "packaging": "string describing ideal export packaging",
  "microbiology": "string describing sterilization/microbiological requirement (e.g. steam sterilized)",
  "notes": "string with concise export logistics or handling guidance",
  "disclaimer": "AI-generated recommendations are for preliminary guidance only and should be verified against applicable destination-country regulations and customer specifications."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const responseText = response.text || '';
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedJson = JSON.parse(jsonMatch[0]);
        return res.json({
          success: true,
          recommendation: parsedJson
        });
      }

      return res.json({
        success: true,
        recommendation: {
          recommendedGrade: `Export Standard Prime Grade for ${productInterest}`,
          moisture: "Standard destination limit",
          meshSize: "Standard export mesh",
          packaging: "Multi-wall Kraft paper or vacuum barrier bags",
          microbiology: "Micro-sterilization per destination regulations",
          notes: responseText.trim(),
          disclaimer: "AI-generated recommendations are for preliminary guidance only and should be verified against applicable destination-country regulations and customer specifications."
        }
      });
    } catch (err) {
      console.error('Gemini AI spec recommendation error:', err);
      return res.status(503).json({
        success: false,
        error: 'AI Specification Assistant was unable to process your request. Please contact our export desk for direct technical specification assistance.'
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
        '/contact',
        '/privacy',
        '/terms'
      ];

      const staticUrls = staticPages.map(page => `  <url>
    <loc>${APP_URL}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n');

      const productUrls = products.map(p => `  <url>
    <loc>${APP_URL}/products/${p.slug}</loc>
    <lastmod>${p.updatedAt ? p.updatedAt.split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n');

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${productUrls}
</urlset>`;

      res.type('application/xml');
      res.send(xml);
    } catch (err) {
      res.status(500).send('Error generating sitemap.');
    }
  });

  // --------------------------------------------------------------------------
  // 8. STATIC & VITE MIDDLEWARE
  // --------------------------------------------------------------------------

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(currentDirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Falcon International Traders server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
