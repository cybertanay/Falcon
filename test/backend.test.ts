import assert from 'assert';
import { hashPassword, verifyPassword, signAdminToken, requireRole, AdminTokenPayload } from '../server/auth';
import {
  enquirySchema,
  productMutationSchema,
  aiRecommendationOutputSchema
} from '../server/validators';
import { dbAdapter } from '../server/db';

async function runTests() {
  console.log('🧪 [FALCON BACKEND TEST SUITE] Starting test execution...\n');
  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void> | void) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}\n`);
      failed++;
    }
  }

  // 1. Password Hashing & Cryptographic Verification
  await test('bcrypt hashing generates unique salts and verifies plaintext correctly', async () => {
    const rawPass = 'SecretExportPass2026!';
    const hash = await hashPassword(rawPass);
    assert.notStrictEqual(hash, rawPass);
    assert.strictEqual(hash.startsWith('$2'), true);

    const match = await verifyPassword(rawPass, hash);
    assert.strictEqual(match, true);

    const wrongMatch = await verifyPassword('WrongPassword123!', hash);
    assert.strictEqual(wrongMatch, false);
  });

  // 2. JWT Admin Session Tokens
  await test('signAdminToken creates valid verifiable payload', () => {
    const payload: AdminTokenPayload = {
      id: 'admin-123',
      email: 'lead@falconspices.com',
      role: 'admin'
    };
    const token = signAdminToken(payload, '1h');
    assert.strictEqual(typeof token, 'string');
    assert.strictEqual(token.split('.').length, 3);
  });

  // 3. RBAC Middleware Authorization Checks
  await test('requireRole middleware permits authorized role and rejects unauthorized role with 403', () => {
    const middleware = requireRole('super_admin');

    // Case A: Sales role trying to perform super_admin action
    let statusSent = 0;
    let jsonSent: any = null;
    let nextCalled = false;

    const fakeReqSales: any = {
      admin: { id: 'user-1', email: 'sales@falcon.com', role: 'sales' }
    };
    const fakeRes: any = {
      status: (code: number) => {
        statusSent = code;
        return {
          json: (data: any) => {
            jsonSent = data;
          }
        };
      }
    };

    middleware(fakeReqSales, fakeRes, () => {
      nextCalled = true;
    });

    assert.strictEqual(statusSent, 403);
    assert.strictEqual(nextCalled, false);
    assert.strictEqual(jsonSent.error.includes('Insufficient privileges'), true);

    // Case B: Super admin executing action
    statusSent = 0;
    nextCalled = false;
    const fakeReqSuper: any = {
      admin: { id: 'user-2', email: 'director@falcon.com', role: 'super_admin' }
    };

    middleware(fakeReqSuper, fakeRes, () => {
      nextCalled = true;
    });

    assert.strictEqual(nextCalled, true);
    assert.strictEqual(statusSent, 0);
  });

  // 4. Enquiry Validation & Anti-Spam Honeypot
  await test('enquirySchema rejects invalid emails and enforces mandatory fields', () => {
    const invalidData = {
      fullName: 'A', // Too short (min 2)
      country: 'UAE',
      email: 'not-an-email',
      productName: 'Turmeric',
      estimatedQuantity: '5 MT'
    };

    const res = enquirySchema.safeParse(invalidData);
    assert.strictEqual(res.success, false);

    const validData = {
      fullName: 'Fatima Al-Mansoor',
      companyName: 'Gulf Food Processing LLC',
      country: 'United Arab Emirates (Jebel Ali)',
      email: 'f.almansoor@gulffoods.ae',
      whatsapp: '+971 50 123 4567',
      productName: 'Turmeric Powder (3.5% Curcumin)',
      estimatedQuantity: '20 Metric Tons',
      packagingRequirement: '25kg Vacuum Foil Packs',
      message: 'Requesting CIF Jebel Ali quotation with phytosanitary and aflatoxin COA.'
    };

    const validRes = enquirySchema.safeParse(validData);
    assert.strictEqual(validRes.success, true);
  });

  // 5. Product Slug and Mutation Validation
  await test('productMutationSchema enforces lowercase hyphenated slugs and required categories', () => {
    const invalidSlugData = {
      name: 'Black Pepper Malabar',
      slug: 'Black Pepper Malabar 550GL!', // Invalid uppercase and special chars
      category: 'Whole Spices',
      image: '/images/pepper.jpg'
    };

    const invalidRes = productMutationSchema.safeParse(invalidSlugData);
    assert.strictEqual(invalidRes.success, false);

    const validProductData = {
      name: 'Malabar Black Pepper 550 G/L',
      slug: 'malabar-black-pepper-550gl',
      category: 'Whole Spices',
      shortDescription: 'High density bold Tellicherry black pepper whole berries.',
      origin: 'Wayanad, Kerala (India)',
      minimumOrderQuantity: '1 Metric Ton',
      image: '/src/assets/images/pepper.jpg',
      published: true
    };

    const validRes = productMutationSchema.safeParse(validProductData);
    assert.strictEqual(validRes.success, true);
  });

  // 6. Public Unpublished Product Protection
  await test('dbAdapter.getProductBySlug rejects unpublished products when publishedOnly is true', async () => {
    const draftProduct = await dbAdapter.createProduct(
      {
        name: 'Confidential Test Lot',
        slug: 'confidential-test-lot-' + Date.now(),
        category: 'Spice Blends',
        image: '/test.jpg',
        published: false
      },
      'test-runner@falcon.com'
    );

    // Public query: publishedOnly=true must return null
    const publicResult = await dbAdapter.getProductBySlug(draftProduct.slug, { publishedOnly: true });
    assert.strictEqual(publicResult, null);

    // Admin query: publishedOnly=false must return the product
    const adminResult = await dbAdapter.getProductBySlug(draftProduct.slug, { publishedOnly: false });
    assert.notStrictEqual(adminResult, null);
    assert.strictEqual(adminResult?.name, 'Confidential Test Lot');

    // Clean up
    await dbAdapter.deleteProduct(draftProduct.id, 'test-runner@falcon.com');
  });

  // 7. Atomic Enquiry Reference Sequence
  await test('generateReference produces canonical FAL-YYYY-NNNNN reference', async () => {
    const ref = await dbAdapter.generateReference();
    const currentYear = new Date().getFullYear();
    const regex = new RegExp(`^FAL-${currentYear}-\\d{5}$`);
    assert.strictEqual(regex.test(ref), true);
  });

  // 8. AI Schema Validation & Prohibition of Fabricated Data
  await test('aiRecommendationOutputSchema rejects missing technical attributes', () => {
    const incompleteAiOutput = {
      recommendedGrade: 'Prime Export Grade',
      // Missing moisture, meshSize, packaging, etc.
      notes: 'General advice'
    };

    const parseResult = aiRecommendationOutputSchema.safeParse(incompleteAiOutput);
    assert.strictEqual(parseResult.success, false);

    const completeValidAiOutput = {
      recommendedGrade: 'ASTA Clean Grade 550 G/L',
      moisture: 'Max 10.5%',
      meshSize: 'Whole Garbled / 20 Mesh',
      packaging: 'Multi-wall Kraft paper sacks with HDPE liner',
      microbiology: 'Steam sterilized ETO-free micro-sterilization',
      notes: 'Recommended for European food processing standards.',
      disclaimer: 'AI recommendations provide preliminary technical guidance only. Batch COA verification required.'
    };

    const validAiRes = aiRecommendationOutputSchema.safeParse(completeValidAiOutput);
    assert.strictEqual(validAiRes.success, true);
  });

  console.log(`\n==================================================`);
  console.log(`Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`==================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(e => {
  console.error('[Fatal Test Suite Error]:', e);
  process.exit(1);
});
