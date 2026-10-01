import assert from 'assert';
import { signAdminToken } from '../server/auth';

async function verifyCustomerFlow() {
  console.log('🚀 [CUSTOMER ENQUIRY PIPELINE VERIFICATION]');
  const BASE_URL = 'http://localhost:3000';

  // 1. Visit Product Page: GET /api/products/turmeric-powder
  console.log('1️⃣ Simulating customer visiting Product Page: /products/turmeric-powder...');
  const prodRes = await fetch(`${BASE_URL}/api/products/turmeric-powder`);
  assert.strictEqual(prodRes.status, 200, 'Product page API must return 200 OK');
  const product = await prodRes.json();
  console.log(`   ✅ Product retrieved: "${product.name}" (ID: ${product.id}, Published: ${product.published})`);

  // 2. Customer opens modal & submits legitimate B2B enquiry
  console.log('\n2️⃣ Simulating customer submitting legitimate B2B enquiry from website modal...');
  const customerPayload = {
    fullName: 'Sophia Al-Hassan',
    companyName: 'Emirates Food Industries PJSC',
    country: 'United Arab Emirates (Jebel Ali)',
    email: 'sophia.alhassan@emiratesfood.ae',
    whatsapp: '+971 50 987 6543',
    productId: product.id,
    productName: product.name,
    estimatedQuantity: '20 Metric Tons',
    packagingRequirement: '25kg Vacuum Foil Sacks',
    message: 'Requesting CIF Jebel Ali quotation with phytosanitary certificate.'
  };

  const submitRes = await fetch(`${BASE_URL}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customerPayload)
  });

  const submitData = await submitRes.json();
  assert.strictEqual(submitRes.status, 201, `Submission must return 201 Created. Received: ${submitRes.status} ${JSON.stringify(submitData)}`);
  assert.strictEqual(submitData.success, true, 'Response success must be true');
  assert.strictEqual(Boolean(submitData.enquiry?.enquiryReference), true, 'Reference must be generated');
  
  const generatedRef = submitData.enquiry.enquiryReference;
  console.log(`   ✅ Enquiry successfully created!`);
  console.log(`   📋 Official Enquiry Reference: ${generatedRef}`);
  console.log(`   📧 Customer Confirmation Message: "${submitData.message}"`);

  // 3. Admin verifies enquiry visibility in CRM
  console.log('\n3️⃣ Simulating Admin logging into CRM and inspecting newly created enquiry...');
  const adminToken = signAdminToken({ id: 'admin-auditor', email: 'admin@falconspices.com', role: 'admin' });
  const adminRes = await fetch(`${BASE_URL}/api/enquiries`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(adminRes.status, 200, 'Admin enquiries API must return 200 OK');
  const allEnquiries = await adminRes.json();
  const matched = allEnquiries.find((e: any) => e.enquiryReference === generatedRef);
  assert.strictEqual(Boolean(matched), true, `Created enquiry ${generatedRef} must be visible to Admin`);
  console.log(`   ✅ Verified in Admin CRM: Reference=${matched.enquiryReference}, Status=${matched.status}, Customer=${matched.fullName}`);

  // 4. Submit 5 additional sequential enquiries to confirm no rate limit exhaustion
  console.log('\n4️⃣ Testing repeated sequential submissions to confirm no rate limit blocking...');
  for (let i = 1; i <= 5; i++) {
    const res = await fetch(`${BASE_URL}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: `Verified Buyer ${i}`,
        companyName: `Global Trade ${i}`,
        country: 'Netherlands (Rotterdam)',
        email: `buyer${i}@rotterdamtrade.nl`,
        productName: product.name,
        estimatedQuantity: `${i * 2} MT`
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 201, `Submission ${i} must succeed without 429`);
    console.log(`   ✅ Submission ${i} succeeded: Ref=${data.enquiry?.enquiryReference}`);
  }

  console.log('\n🎉 [PIPELINE VERIFICATION SUCCESSFUL] Complete enquiry pipeline verified end-to-end!\n');
}

verifyCustomerFlow().catch(err => {
  console.error('Fatal verification error:', err);
  process.exit(1);
});
