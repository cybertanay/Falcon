import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PRODUCTS, INITIAL_TESTIMONIALS, INITIAL_CERTIFICATIONS } from './src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DB_FILE = path.join(__dirname, 'data_store.json');

// Memory Data Store initialized from JSON file or defaults
interface DBStructure {
  products: any[];
  enquiries: any[];
  testimonials: any[];
  certifications: any[];
}

function loadDB(): DBStructure {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading DB_FILE:', err);
  }
  const initial = {
    products: INITIAL_PRODUCTS,
    enquiries: [],
    testimonials: INITIAL_TESTIMONIALS,
    certifications: INITIAL_CERTIFICATIONS
  };
  saveDB(initial);
  return initial;
}

function saveDB(data: DBStructure) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB_FILE:', err);
  }
}

let db = loadDB();

// Lazy Gemini AI setup
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.error('Error initializing Gemini AI client:', err);
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 1. PRODUCTS API
  app.get('/api/products', (req, res) => {
    const publishedOnly = req.query.all !== 'true';
    const products = publishedOnly ? db.products.filter(p => p.published) : db.products;
    res.json(products);
  });

  app.get('/api/products/:slug', (req, res) => {
    const product = db.products.find(p => p.slug === req.params.slug || p.id === req.params.slug);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  app.post('/api/products', (req, res) => {
    const newProduct = {
      ...req.body,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.products.unshift(newProduct);
    saveDB(db);
    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', (req, res) => {
    const index = db.products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Product not found' });
    db.products[index] = { ...db.products[index], ...req.body, updatedAt: new Date().toISOString() };
    saveDB(db);
    res.json(db.products[index]);
  });

  app.delete('/api/products/:id', (req, res) => {
    db.products = db.products.filter(p => p.id !== req.params.id);
    saveDB(db);
    res.json({ success: true });
  });

  // 2. ENQUIRIES API
  app.get('/api/enquiries', (req, res) => {
    res.json(db.enquiries);
  });

  app.post('/api/enquiries', async (req, res) => {
    const { fullName, companyName, country, email, whatsapp, productName, estimatedQuantity, packagingRequirement, message, productId } = req.body;

    if (!fullName || !email || !productName) {
      return res.status(400).json({ error: 'Full name, email, and product name are required fields.' });
    }

    const enquiry = {
      id: 'enq-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      fullName: String(fullName).trim(),
      companyName: String(companyName || '').trim(),
      country: String(country || 'Not specified').trim(),
      email: String(email).trim(),
      whatsapp: String(whatsapp || '').trim(),
      productId: productId || '',
      productName: String(productName).trim(),
      estimatedQuantity: String(estimatedQuantity || 'Not specified').trim(),
      packagingRequirement: String(packagingRequirement || 'Standard export packaging').trim(),
      message: String(message || '').trim(),
      status: 'New',
      internalNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.enquiries.unshift(enquiry);
    saveDB(db);

    // Resend Email Notification Simulation / Integration
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_123456789') {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Falcon Website <noreply@falconspices.com>',
            to: process.env.BUSINESS_EMAIL || 'export@falconspices.com',
            subject: `[New B2B Quote Enquiry] ${productName} - ${companyName || fullName} (${country})`,
            html: `
              <h2>New International Spice Quote Enquiry</h2>
              <p><strong>Name:</strong> ${fullName}</p>
              <p><strong>Company:</strong> ${companyName}</p>
              <p><strong>Country:</strong> ${country}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>WhatsApp:</strong> ${whatsapp}</p>
              <p><strong>Product Requested:</strong> ${productName}</p>
              <p><strong>Estimated Quantity:</strong> ${estimatedQuantity}</p>
              <p><strong>Packaging Requirement:</strong> ${packagingRequirement}</p>
              <p><strong>Message:</strong></p>
              <blockquote style="background:#f9f9f9; padding:10px; border-left:4px solid #143D28;">${message}</blockquote>
            `
          })
        });
      } catch (e) {
        console.error('Error dispatching Resend notification email:', e);
      }
    } else {
      console.log('Resend API key placeholder detected; logged B2B enquiry to database & console:', enquiry.id);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting Falcon International Traders. Your enquiry has been received and logged.',
      enquiry
    });
  });

  app.patch('/api/enquiries/:id', (req, res) => {
    const index = db.enquiries.findIndex(e => e.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Enquiry not found' });

    db.enquiries[index] = {
      ...db.enquiries[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    saveDB(db);
    res.json(db.enquiries[index]);
  });

  app.delete('/api/enquiries/:id', (req, res) => {
    db.enquiries = db.enquiries.filter(e => e.id !== req.params.id);
    saveDB(db);
    res.json({ success: true });
  });

  // 3. TESTIMONIALS & CERTIFICATIONS
  app.get('/api/testimonials', (req, res) => res.json(db.testimonials));
  app.get('/api/certifications', (req, res) => res.json(db.certifications));

  // 4. ADMIN LOGIN
  app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@falconspices.com';
    const adminPass = process.env.ADMIN_PASSWORD || 'falcon_admin_secure_pass_2026';

    if (email === adminEmail && password === adminPass) {
      return res.json({
        success: true,
        token: 'falcon_admin_session_' + Date.now(),
        admin: { email: adminEmail, role: 'Super Admin' }
      });
    }
    return res.status(401).json({ error: 'Invalid email or password' });
  });

  // 5. GEMINI AI SPECIFICATIONS & PACKAGING ADVISOR
  app.post('/api/ai-spec-recommendation', async (req, res) => {
    const { requirement, targetMarket, productInterest } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        recommendation: `Recommended Grade: Export Standard Prime Grade for ${productInterest || 'Indian Spices'}.\nOptimal Packaging: 25kg Multi-wall Kraft paper bags with 80-micron PE inner barrier liner or vacuum foil packs for ${targetMarket || 'International destination'}.\nSuggested Mesh & ASTA: Standard 60 Mesh with ASTA color parameters aligned to local food regulations.`
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an expert Indian Spice Export Consultant for Falcon International Traders. 
Provide a concise, professional, structured B2B recommendation for an international buyer asking:
Product Interest: ${productInterest}
Target Market/Country: ${targetMarket}
Specific Requirement: ${requirement}

Include:
1. Recommended Spice Specification Grade (Curcumin %, Scoville Heat Units, ASTA Color, or Volatile Oil %)
2. Moisture & Mesh Size recommendation
3. Recommended International Container Packaging (e.g. 25kg PP bags vs Vacuum Pouches vs Jumbo bags)
4. Regulatory & Micro-Sterilization advice (e.g. Steam treatment for EU/US standards)`
      });

      res.json({ recommendation: response.text });
    } catch (err) {
      console.error('Gemini AI spec recommendation error:', err);
      res.json({
        recommendation: `Export Grade Recommendation: Micro-sterilized export quality ${productInterest}.\nPackaging: 25kg multi-wall moisture-proof bags, container stuffed with desiccants.`
      });
    }
  });

  // VITE DEVELOPMENT vs PRODUCTION MIDDLEWARE
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Falcon International Traders server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
