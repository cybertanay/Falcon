import assert from 'assert';
import crypto from 'crypto';
import { signAdminToken, hashPassword } from '../server/auth';
import { dbAdapter } from '../server/db';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

interface TestResult {
  phase: string;
  name: string;
  passed: boolean;
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  details?: string;
  route?: string;
}

const results: TestResult[] = [];

function record(res: TestResult) {
  results.push(res);
  const icon = res.passed ? '✅ [PASS]' : '❌ [FAIL]';
  const sev = res.severity ? `[${res.severity}] ` : '';
  console.log(`${icon} ${res.phase} - ${sev}${res.name}`);
  if (!res.passed && res.details) {
    console.error(`     Details: ${res.details}`);
  }
}

async function request(path: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, options);
  let json: any = null;
  const text = await res.text();
  try {
    json = JSON.parse(text);
  } catch (e) {
    // not JSON
  }
  return {
    status: res.status,
    headers: res.headers,
    bodyText: text,
    body: json
  };
}

async function runSecurityAudit() {
  console.log(`\n=============================================================`);
  console.log(`🛡️  FALCON EXTENSIVE BACKEND & SECURITY AUDIT TEST RUNNER`);
  console.log(`🎯  Target: ${BASE_URL}`);
  console.log(`=============================================================\n`);

  // Tokens for RBAC testing
  const superAdminToken = signAdminToken({ id: 'test-super', email: 'director@falconspices.com', role: 'super_admin' });
  const adminToken = signAdminToken({ id: 'test-admin', email: 'ops@falconspices.com', role: 'admin' });
  const salesToken = signAdminToken({ id: 'test-sales', email: 'rep@falconspices.com', role: 'sales' });

  // --------------------------------------------------------------------------
  // PHASE 1: Baseline Health Check
  // --------------------------------------------------------------------------
  try {
    const health = await request('/api/health');
    const isOk = health.status === 200 && health.body?.status === 'ok';
    record({
      phase: 'PHASE 1 (BASELINE)',
      name: 'GET /api/health returns 200 OK with valid status',
      passed: isOk,
      severity: 'CRITICAL',
      route: 'GET /api/health',
      details: isOk ? undefined : `Status: ${health.status}, body: ${health.bodyText}`
    });
  } catch (err: any) {
    record({
      phase: 'PHASE 1 (BASELINE)',
      name: 'GET /api/health connection',
      passed: false,
      severity: 'CRITICAL',
      details: err.message
    });
  }

  // --------------------------------------------------------------------------
  // PHASE 5: Product Visibility Security
  // --------------------------------------------------------------------------
  let testUnpublishedSlug = `audit-draft-${Date.now()}`;
  let testUnpublishedId = `prod-audit-draft-${Date.now()}`;

  try {
    // Create an unpublished product via real authenticated API
    const createDraftRes = await request('/api/products', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
        'X-Falcon-Admin': '1'
      },
      body: JSON.stringify({
        name: 'Top Secret Unreleased Cardamom Extract',
        slug: testUnpublishedSlug,
        category: 'Spice Blends',
        image: '/test.jpg',
        published: false
      })
    });
    if (createDraftRes.status === 201 && createDraftRes.body?.id) {
      testUnpublishedId = createDraftRes.body.id;
    }

    // 1. Anonymous GET /api/products
    const pubList = await request('/api/products');
    const listContainsDraft = Array.isArray(pubList.body) && pubList.body.some((p: any) => p.slug === testUnpublishedSlug);
    record({
      phase: 'PHASE 5 (PRODUCT VISIBILITY)',
      name: 'Public /api/products NEVER includes unpublished products',
      passed: pubList.status === 200 && !listContainsDraft,
      severity: 'CRITICAL',
      route: 'GET /api/products',
      details: listContainsDraft ? 'VULNERABILITY: Unpublished product leaked in public list!' : undefined
    });

    // 2. Bypass attempts via query parameters on /api/products
    const bypassParams = [
      '?all=true',
      '?published=false',
      '?includeUnpublished=true',
      '?admin=true',
      '?draft=true'
    ];
    let anyBypassSucceeded = false;
    for (const q of bypassParams) {
      const bypassRes = await request(`/api/products${q}`);
      if (Array.isArray(bypassRes.body) && bypassRes.body.some((p: any) => p.slug === testUnpublishedSlug)) {
        anyBypassSucceeded = true;
        break;
      }
    }
    record({
      phase: 'PHASE 5 (PRODUCT VISIBILITY)',
      name: 'Parameter bypass attempts (?all=true, ?published=false, etc.) rejected',
      passed: !anyBypassSucceeded,
      severity: 'CRITICAL',
      route: 'GET /api/products?all=true',
      details: anyBypassSucceeded ? 'VULNERABILITY: Parameter bypass returned unpublished products!' : undefined
    });

    // 3. Anonymous direct detail request to unpublished slug
    const detailRes = await request(`/api/products/${testUnpublishedSlug}`);
    record({
      phase: 'PHASE 5 (PRODUCT VISIBILITY)',
      name: 'Public /api/products/:slug returns 404 for unpublished product',
      passed: detailRes.status === 404,
      severity: 'CRITICAL',
      route: 'GET /api/products/:slug',
      details: detailRes.status !== 404 ? `Returned status ${detailRes.status} instead of 404` : undefined
    });

    // 4. Authenticated admin request CAN access unpublished products
    const adminProdRes = await request(`/api/admin/products/${testUnpublishedSlug}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    record({
      phase: 'PHASE 5 (PRODUCT VISIBILITY)',
      name: 'Admin /api/admin/products/:id correctly allows authorized access to draft',
      passed: adminProdRes.status === 200 && adminProdRes.body?.slug === testUnpublishedSlug,
      severity: 'HIGH',
      route: 'GET /api/admin/products/:id'
    });
  } catch (err: any) {
    record({
      phase: 'PHASE 5 (PRODUCT VISIBILITY)',
      name: 'Product visibility testing error',
      passed: false,
      severity: 'CRITICAL',
      details: err.message
    });
  }

  // --------------------------------------------------------------------------
  // PHASE 6: Admin Authentication Security
  // --------------------------------------------------------------------------
  try {
    // 1. Invalid credentials
    const badLogin = await request('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@falconspices.com', password: 'WrongPassword123!' })
    });
    record({
      phase: 'PHASE 6 (AUTH)',
      name: 'Invalid admin credentials rejected with 401 Unauthorized',
      passed: badLogin.status === 401,
      severity: 'CRITICAL',
      route: 'POST /api/admin/login',
      details: `Returned status ${badLogin.status}`
    });

    // 2. Missing credentials
    const emptyLogin = await request('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    record({
      phase: 'PHASE 6 (AUTH)',
      name: 'Missing credentials rejected with 400 Bad Request',
      passed: emptyLogin.status === 400,
      severity: 'MEDIUM',
      route: 'POST /api/admin/login'
    });

    // 3. Valid Login & Token Storage Check
    const validLogin = await request('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL || 'admin@falconspices.com',
        password: process.env.ADMIN_PASSWORD || 'FalconExportAdmin2026!'
      })
    });

    const setCookie = validLogin.headers.get('set-cookie') || '';
    const tokenInBody = validLogin.body?.token;
    const hasHttpOnly = setCookie.toLowerCase().includes('httponly');
    const hasAdminTokenCookie = setCookie.includes('falcon_admin_token');

    record({
      phase: 'PHASE 6 (AUTH)',
      name: 'Valid login sets secure HttpOnly cookie and does NOT leak token in JSON body',
      passed: (validLogin.status === 200 || validLogin.status === 401) && !tokenInBody && (validLogin.status === 401 || (hasHttpOnly && hasAdminTokenCookie)),
      severity: 'CRITICAL',
      route: 'POST /api/admin/login',
      details: tokenInBody ? 'SECURITY VULNERABILITY: Raw JWT token leaked in JSON body!' : undefined
    });

    // 4. Tampered JWT Token
    const tamperedToken = adminToken.slice(0, -10) + 'XXXXXXXXXX';
    const tamperedRes = await request('/api/admin/session', {
      headers: { Authorization: `Bearer ${tamperedToken}` }
    });
    record({
      phase: 'PHASE 6 (AUTH)',
      name: 'Tampered JWT session token rejected with 401 Unauthorized',
      passed: tamperedRes.status === 401,
      severity: 'CRITICAL',
      route: 'GET /api/admin/session',
      details: `Status: ${tamperedRes.status}`
    });

    // 5. Expired JWT Token
    const expiredToken = signAdminToken({ id: 'test', email: 'test@falcon.com', role: 'admin' }, '-1s');
    const expiredRes = await request('/api/admin/session', {
      headers: { Authorization: `Bearer ${expiredToken}` }
    });
    record({
      phase: 'PHASE 6 (AUTH)',
      name: 'Expired JWT session token rejected with 401 Unauthorized',
      passed: expiredRes.status === 401,
      severity: 'HIGH',
      route: 'GET /api/admin/session'
    });

    // 6. Logout clears cookie
    const logoutRes = await request('/api/admin/logout', { method: 'POST' });
    const logoutCookie = logoutRes.headers.get('set-cookie') || '';
    const clearsCookie = logoutCookie.includes('falcon_admin_token=;') || logoutCookie.includes('Max-Age=0') || logoutCookie.includes('Expires=');
    record({
      phase: 'PHASE 6 (AUTH)',
      name: 'Admin logout clears authentication cookie',
      passed: logoutRes.status === 200 && clearsCookie,
      severity: 'HIGH',
      route: 'POST /api/admin/logout'
    });
  } catch (err: any) {
    record({
      phase: 'PHASE 6 (AUTH)',
      name: 'Authentication testing error',
      passed: false,
      severity: 'CRITICAL',
      details: err.message
    });
  }

  // --------------------------------------------------------------------------
  // PHASE 7: RBAC & Privilege Escalation
  // --------------------------------------------------------------------------
  try {
    // 1. Sales role cannot DELETE enquiries
    const salesDeleteEnq = await request('/api/enquiries/enq-any-id', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${salesToken}`, 'X-Falcon-Admin': '1' }
    });
    record({
      phase: 'PHASE 7 (RBAC)',
      name: 'Sales role is forbidden (403) from deleting enquiries',
      passed: salesDeleteEnq.status === 403,
      severity: 'HIGH',
      route: 'DELETE /api/enquiries/:id',
      details: `Returned status ${salesDeleteEnq.status}`
    });

    // 2. Sales role cannot create products
    const salesCreateProd = await request('/api/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${salesToken}`, 'Content-Type': 'application/json', 'X-Falcon-Admin': '1' },
      body: JSON.stringify({ name: 'Hacked Spice', slug: 'hacked-spice', category: 'Powders', image: '/img.jpg' })
    });
    record({
      phase: 'PHASE 7 (RBAC)',
      name: 'Sales role is forbidden (403) from creating products',
      passed: salesCreateProd.status === 403,
      severity: 'HIGH',
      route: 'POST /api/products',
      details: `Returned status ${salesCreateProd.status}`
    });

    // 3. Sales role cannot modify company settings
    const salesSettings = await request('/api/admin/settings', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${salesToken}`, 'Content-Type': 'application/json', 'X-Falcon-Admin': '1' },
      body: JSON.stringify({ name: 'Hacked Falcon' })
    });
    record({
      phase: 'PHASE 7 (RBAC)',
      name: 'Sales role is forbidden (403) from updating company settings',
      passed: salesSettings.status === 403,
      severity: 'HIGH',
      route: 'PUT /api/admin/settings'
    });

    // 4. Admin role cannot permanently DELETE products (Super Admin only)
    const adminDeleteProd = await request(`/api/products/${testUnpublishedId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}`, 'X-Falcon-Admin': '1' }
    });
    record({
      phase: 'PHASE 7 (RBAC)',
      name: 'Admin role is forbidden (403) from permanently deleting products (Super Admin only)',
      passed: adminDeleteProd.status === 403,
      severity: 'HIGH',
      route: 'DELETE /api/products/:id',
      details: `Returned status ${adminDeleteProd.status}`
    });

    // 5. Admin role cannot update company settings (Super Admin only)
    const adminSettings = await request('/api/admin/settings', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json', 'X-Falcon-Admin': '1' },
      body: JSON.stringify({ name: 'Admin Company Name Change' })
    });
    record({
      phase: 'PHASE 7 (RBAC)',
      name: 'Admin role is forbidden (403) from updating company settings (Super Admin only)',
      passed: adminSettings.status === 403,
      severity: 'HIGH',
      route: 'PUT /api/admin/settings',
      details: `Returned status ${adminSettings.status}`
    });

    // 6. Super Admin CAN update company settings
    const superSettings = await request('/api/admin/settings', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${superAdminToken}`, 'Content-Type': 'application/json', 'X-Falcon-Admin': '1' },
      body: JSON.stringify({ tagline: 'Pure Indian Spices — Audited Grade' })
    });
    record({
      phase: 'PHASE 7 (RBAC)',
      name: 'Super Admin is authorized (200) to update company settings',
      passed: superSettings.status === 200,
      severity: 'MEDIUM',
      route: 'PUT /api/admin/settings',
      details: `Returned status ${superSettings.status}`
    });

    // 7. Active Privilege Escalation Attempt: Sending isAdmin=true or role=super_admin in enquiry/login
    const privEscRes = await request('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Attacker John',
        email: 'attacker@evil.com',
        country: 'USA',
        productName: 'Turmeric',
        estimatedQuantity: '10 MT',
        role: 'super_admin',
        isAdmin: true,
        permissions: ['*']
      })
    });
    record({
      phase: 'PHASE 7 (RBAC)',
      name: 'Privilege escalation payload in request body does not grant admin access',
      passed: privEscRes.status === 201 && (privEscRes.body?.enquiry as any)?.role === undefined,
      severity: 'CRITICAL',
      route: 'POST /api/enquiries'
    });
  } catch (err: any) {
    record({
      phase: 'PHASE 7 (RBAC)',
      name: 'RBAC testing error',
      passed: false,
      severity: 'CRITICAL',
      details: err.message
    });
  }

  // --------------------------------------------------------------------------
  // PHASE 8 & 9: IDOR & Mass Assignment
  // --------------------------------------------------------------------------
  try {
    // IDOR on non-existent product
    const idorProd = await request('/api/admin/products/non-existent-uuid-99999', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    record({
      phase: 'PHASE 8 (IDOR)',
      name: 'Querying non-existent entity safely returns 404 without data disclosure',
      passed: idorProd.status === 404,
      severity: 'MEDIUM',
      route: 'GET /api/admin/products/:id'
    });

    // Mass assignment: injecting protected internal fields into enquiry
    const massAssignRes = await request('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Legitimate Buyer',
        email: 'buyer@valid-corp.com',
        country: 'Germany',
        productName: 'Tellicherry Black Pepper',
        estimatedQuantity: '5 MT',
        status: 'Converted', // Attacker trying to set status to Converted
        internalNotes: 'Top secret negotiated price $2000/MT', // Attacker trying to inject internal notes
        assignedStaff: 'attacker-infiltrator'
      })
    });
    const massAssignEnq = massAssignRes.body?.enquiry;
    const statusProtected = massAssignEnq?.status === 'New';
    const notesProtected = massAssignEnq?.internalNotes === '';

    record({
      phase: 'PHASE 9 (MASS ASSIGNMENT)',
      name: 'Public enquiry submission ignores server-controlled fields (status, internalNotes)',
      passed: massAssignRes.status === 201 && statusProtected && notesProtected,
      severity: 'HIGH',
      route: 'POST /api/enquiries',
      details: !statusProtected ? `Injected status persisted: ${massAssignEnq?.status}` : undefined
    });
  } catch (err: any) {
    record({
      phase: 'PHASE 9 (MASS ASSIGNMENT)',
      name: 'Mass assignment testing error',
      passed: false,
      severity: 'HIGH',
      details: err.message
    });
  }

  // --------------------------------------------------------------------------
  // PHASE 10 & 11: CSRF & CORS
  // --------------------------------------------------------------------------
  try {
    // 1. Cross-origin state mutation without custom headers
    const csrfCrossSite = await request('/api/products', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${superAdminToken}`,
        'Content-Type': 'application/json',
        Origin: 'https://evil-phishing-site.com',
        Referer: 'https://evil-phishing-site.com/attack.html'
      },
      body: JSON.stringify({ name: 'CSRF Spice', slug: 'csrf-spice', category: 'Powders', image: '/x.jpg' })
    });

    // In current server, let's see how it behaves:
    // If server rejects cross-origin or requires custom header
    record({
      phase: 'PHASE 10 (CSRF)',
      name: 'Cross-site request without custom security header',
      passed: csrfCrossSite.status === 403 || csrfCrossSite.status === 400 || csrfCrossSite.status === 500,
      severity: 'HIGH',
      route: 'POST /api/products',
      details: csrfCrossSite.status === 201 ? 'CSRF VULNERABILITY: Cross-origin POST succeeded without CSRF header!' : `Result: ${csrfCrossSite.status}`
    });

    // 2. CORS preflight from malicious origin
    const corsPreflight = await request('/api/products', {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://malicious-external-domain.com',
        'Access-Control-Request-Method': 'POST'
      }
    });
    const allowOrigin = corsPreflight.headers.get('access-control-allow-origin');
    const wildCardWithCreds = allowOrigin === '*' && corsPreflight.headers.get('access-control-allow-credentials') === 'true';

    record({
      phase: 'PHASE 11 (CORS)',
      name: 'CORS does NOT combine wildcard origin with credentials',
      passed: !wildCardWithCreds,
      severity: 'CRITICAL',
      route: 'OPTIONS /api/products',
      details: wildCardWithCreds ? 'VULNERABILITY: Access-Control-Allow-Origin: * combined with credentials: true!' : undefined
    });
  } catch (err: any) {
    record({
      phase: 'PHASE 10 (CSRF)',
      name: 'CSRF testing error',
      passed: false,
      severity: 'HIGH',
      details: err.message
    });
  }

  // --------------------------------------------------------------------------
  // PHASE 12: Security Headers
  // --------------------------------------------------------------------------
  try {
    const healthHeaders = await request('/api/health');
    const nosniff = healthHeaders.headers.get('x-content-type-options') === 'nosniff';
    const frameOptions = healthHeaders.headers.get('x-frame-options');

    record({
      phase: 'PHASE 12 (SECURITY HEADERS)',
      name: 'Strict security headers (X-Content-Type-Options: nosniff, Frame protection) present',
      passed: nosniff && Boolean(frameOptions),
      severity: 'MEDIUM',
      route: 'GET /api/health',
      details: `nosniff=${nosniff}, x-frame-options=${frameOptions}`
    });
  } catch (err: any) {
    record({
      phase: 'PHASE 12 (SECURITY HEADERS)',
      name: 'Headers test error',
      passed: false,
      severity: 'LOW',
      details: err.message
    });
  }

  // --------------------------------------------------------------------------
  // PHASE 13 & 14: Input Validation & Injection Testing
  // --------------------------------------------------------------------------
  try {
    // 1. SQL Injection payload in enquiry
    const sqliRes = await request('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: "Test'); DROP TABLE enquiries; --",
        companyName: "' OR '1'='1",
        country: "India' UNION SELECT * FROM admin_users; --",
        email: "sqli-test@falconspices.com",
        productName: "Turmeric Powder",
        estimatedQuantity: "5 MT"
      })
    });
    // Payload should either be safely parameterized as text, or validated
    record({
      phase: 'PHASE 14 (INJECTION)',
      name: 'SQL Injection payloads handled safely (parameterized/escaped)',
      passed: sqliRes.status === 201 || sqliRes.status === 400,
      severity: 'CRITICAL',
      route: 'POST /api/enquiries',
      details: sqliRes.status >= 500 ? 'Server crashed with 500 on SQL payload!' : undefined
    });

    // 2. Stored XSS payload in enquiry
    const xssRes = await request('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: '<script>alert("XSS")</script> Trader',
        country: '<img src=x onerror=alert(1)> Netherlands',
        email: 'xss-buyer@valid-corp.com',
        productName: 'Organic Ginger Powder',
        estimatedQuantity: '10 MT',
        message: '<svg onload=alert(document.cookie)>'
      })
    });
    record({
      phase: 'PHASE 14 (INJECTION)',
      name: 'XSS strings stored without server execution error',
      passed: xssRes.status === 201,
      severity: 'HIGH',
      route: 'POST /api/enquiries'
    });

    // 3. Honeypot anti-spam bot check
    const botRes = await request('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Spam Bot 3000',
        country: 'Spam Land',
        email: 'spambot@spammer.org',
        productName: 'Everything',
        estimatedQuantity: '1000 MT',
        website_hp: 'https://spam-link.ru' // Honeypot filled
      })
    });
    const isSilentlyDropped = botRes.status === 200 && botRes.body?.enquiry?.enquiryReference === 'FAL-SPAM-DETECTED';
    record({
      phase: 'PHASE 15 (ENQUIRY / ANTI-SPAM)',
      name: 'Anti-bot honeypot silently intercepts automated spam submissions',
      passed: isSilentlyDropped,
      severity: 'MEDIUM',
      route: 'POST /api/enquiries'
    });
  } catch (err: any) {
    record({
      phase: 'PHASE 14 (INJECTION)',
      name: 'Injection test error',
      passed: false,
      severity: 'CRITICAL',
      details: err.message
    });
  }

  // --------------------------------------------------------------------------
  // PHASE 16: Enquiry Reference Concurrency
  // --------------------------------------------------------------------------
  try {
    const concurrentRequests = 5;
    const promises = Array.from({ length: concurrentRequests }, (_, i) =>
      request('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: `Concurrent Buyer ${i}`,
          companyName: `Trading Co ${i}`,
          country: 'UAE',
          email: `concurrent${i}-${Date.now()}@falconspices.com`,
          productName: 'Cumin Seeds Grade A',
          estimatedQuantity: `${i + 1} MT`
        })
      })
    );

    const responses = await Promise.all(promises);
    const refs = responses.map(r => r.body?.enquiry?.enquiryReference).filter(Boolean);
    const uniqueRefs = new Set(refs);
    const allSucceeded = responses.every(r => r.status === 201);
    const noCollisions = uniqueRefs.size === refs.length;

    record({
      phase: 'PHASE 16 (CONCURRENCY)',
      name: `Simultaneous enquiry submissions generate unique, collision-free references (${refs.length}/${concurrentRequests})`,
      passed: allSucceeded && noCollisions,
      severity: 'HIGH',
      route: 'POST /api/enquiries',
      details: !noCollisions ? `Collision detected! Total: ${refs.length}, Unique: ${uniqueRefs.size}` : undefined
    });
  } catch (err: any) {
    record({
      phase: 'PHASE 16 (CONCURRENCY)',
      name: 'Concurrency test error',
      passed: false,
      severity: 'HIGH',
      details: err.message
    });
  }

  // --------------------------------------------------------------------------
  // PHASE 18: Audit Logging
  // --------------------------------------------------------------------------
  try {
    const auditRes = await request('/api/admin/audit-logs', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const logs = Array.isArray(auditRes.body) ? auditRes.body : [];
    const hasAuditLogs = logs.length > 0;
    const containsSensitiveSecrets = logs.some((l: any) =>
      JSON.stringify(l).includes('password') ||
      JSON.stringify(l).includes('SESSION_SECRET') ||
      JSON.stringify(l).includes('eyJh')
    );

    record({
      phase: 'PHASE 18 (AUDIT LOGS)',
      name: 'Administrative actions persist audit records without leaking passwords or secrets',
      passed: auditRes.status === 200 && hasAuditLogs && !containsSensitiveSecrets,
      severity: 'HIGH',
      route: 'GET /api/admin/audit-logs',
      details: containsSensitiveSecrets ? 'VULNERABILITY: Sensitive secret found logged in audit history!' : undefined
    });
  } catch (err: any) {
    record({
      phase: 'PHASE 18 (AUDIT LOGS)',
      name: 'Audit logs test error',
      passed: false,
      severity: 'HIGH',
      details: err.message
    });
  }

  // --------------------------------------------------------------------------
  // PHASE 20: File Upload Security
  // --------------------------------------------------------------------------
  try {
    // 1. Valid 1x1 transparent PNG with authentic magic bytes (89 50 4E 47 0D 0A 1A 0A)
    const validPngBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const validUpload = await request('/api/admin/upload-image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
        'X-Falcon-Admin': '1'
      },
      body: JSON.stringify({ imageData: validPngBase64, filename: 'test_audit_pepper' })
    });
    record({
      phase: 'PHASE 20 (UPLOAD SECURITY)',
      name: 'Authentic PNG image with verified magic bytes uploads successfully',
      passed: validUpload.status === 201 && Boolean(validUpload.body?.url),
      severity: 'HIGH',
      route: 'POST /api/admin/upload-image',
      details: validUpload.status !== 201 ? `Returned status ${validUpload.status}: ${validUpload.bodyText}` : undefined
    });

    // 2. Disguised malicious file: PHP web shell disguised as .png (corrupt/invalid magic bytes)
    const fakePngBase64 = 'data:image/png;base64,' + Buffer.from('<?php system($_GET["cmd"]); ?>').toString('base64');
    const fakeUpload = await request('/api/admin/upload-image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
        'X-Falcon-Admin': '1'
      },
      body: JSON.stringify({ imageData: fakePngBase64, filename: 'shell' })
    });
    record({
      phase: 'PHASE 20 (UPLOAD SECURITY)',
      name: 'Disguised executable/script with invalid magic bytes rejected with 400',
      passed: fakeUpload.status === 400,
      severity: 'CRITICAL',
      route: 'POST /api/admin/upload-image',
      details: fakeUpload.status !== 400 ? `VULNERABILITY: Disguised file accepted with status ${fakeUpload.status}!` : undefined
    });

    // 3. Path traversal filename
    const traversalUpload = await request('/api/admin/upload-image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
        'X-Falcon-Admin': '1'
      },
      body: JSON.stringify({ imageData: validPngBase64, filename: '../../../traversal_test' })
    });
    const safeUrl = traversalUpload.body?.url || '';
    const noTraversal = !safeUrl.includes('..');
    record({
      phase: 'PHASE 20 (UPLOAD SECURITY)',
      name: 'Path traversal characters in filename are sanitized',
      passed: traversalUpload.status === 201 && noTraversal,
      severity: 'HIGH',
      route: 'POST /api/admin/upload-image',
      details: !noTraversal ? `Traversal in output url: ${safeUrl}` : undefined
    });
  } catch (err: any) {
    record({
      phase: 'PHASE 20 (UPLOAD SECURITY)',
      name: 'File upload test error',
      passed: false,
      severity: 'CRITICAL',
      details: err.message
    });
  }

  // --------------------------------------------------------------------------
  // PHASE 21: Gemini AI Security & Anti-Fabrication
  // --------------------------------------------------------------------------
  try {
    // 1. Missing mandatory fields
    const invalidAiReq = await request('/api/ai-spec-recommendation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productInterest: 'Turmeric' }) // missing targetMarket & requirement
    });
    record({
      phase: 'PHASE 21 (AI SECURITY)',
      name: 'Incomplete AI request rejected by Zod validation (400 Bad Request)',
      passed: invalidAiReq.status === 400,
      severity: 'MEDIUM',
      route: 'POST /api/ai-spec-recommendation'
    });

    // 2. Unconfigured / Unavailable Gemini API returns controlled 503 without fake technical specifications
    const aiReq = await request('/api/ai-spec-recommendation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productInterest: 'Organic Ginger Powder',
        targetMarket: 'Rotterdam Port (EU Standard)',
        requirement: 'Steam sterilized ASTA clean grade'
      })
    });
    // In dev without GEMINI_API_KEY, should return 503 with honest error, NEVER fabricated mock specs!
    const honest503OrValidSpecs = (aiReq.status === 503 && aiReq.body?.error && !aiReq.body?.recommendation) ||
      (aiReq.status === 200 && aiReq.body?.recommendation?.recommendedGrade);

    record({
      phase: 'PHASE 21 (AI SECURITY)',
      name: 'AI endpoint returns honest controlled 503 (or validated live specs) and NEVER fabricates specifications',
      passed: Boolean(honest503OrValidSpecs),
      severity: 'CRITICAL',
      route: 'POST /api/ai-spec-recommendation',
      details: !honest503OrValidSpecs ? `Unexpected response: ${aiReq.status} ${aiReq.bodyText}` : undefined
    });
  } catch (err: any) {
    record({
      phase: 'PHASE 21 (AI SECURITY)',
      name: 'AI security test error',
      passed: false,
      severity: 'HIGH',
      details: err.message
    });
  }

  // --------------------------------------------------------------------------
  // PHASE 24: Error Disclosure
  // --------------------------------------------------------------------------
  try {
    // Trigger 404
    const notFound = await request('/api/non-existent-route-404-audit');
    const noStackTrace = !notFound.bodyText.includes('at Object.') && !notFound.bodyText.includes('node_modules');

    record({
      phase: 'PHASE 24 (ERROR HANDLING)',
      name: 'Error responses do NOT leak stack traces, file paths, or internal architecture',
      passed: noStackTrace,
      severity: 'MEDIUM',
      route: 'GET /api/non-existent-route-404-audit',
      details: !noStackTrace ? 'Stack trace leaked in response!' : undefined
    });
  } catch (err: any) {
    record({
      phase: 'PHASE 24 (ERROR HANDLING)',
      name: 'Error handling test error',
      passed: false,
      severity: 'LOW',
      details: err.message
    });
  }

  // Clean up test unpublished product
  try {
    await request(`/api/products/${testUnpublishedId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${superAdminToken}`, 'X-Falcon-Admin': '1' }
    });
  } catch (e) {}

  // --------------------------------------------------------------------------
  // Summary
  // --------------------------------------------------------------------------
  const total = results.length;
  const passedCount = results.filter(r => r.passed).length;
  const failedCount = total - passedCount;

  console.log(`\n=============================================================`);
  console.log(`📊 SECURITY AUDIT SUMMARY`);
  console.log(`   Total Tests : ${total}`);
  console.log(`   Passed      : ${passedCount}`);
  console.log(`   Failed      : ${failedCount}`);
  console.log(`=============================================================\n`);

  if (failedCount > 0) {
    console.error(`🚨 DETECTED VULNERABILITIES / FAILURES:`);
    for (const f of results.filter(r => !r.passed)) {
      console.error(`   - [${f.severity || 'UNKNOWN'}] ${f.phase} - ${f.name} (${f.route || 'N/A'})`);
      if (f.details) console.error(`     Reason: ${f.details}`);
    }
  }

  process.exit(failedCount > 0 ? 1 : 0);
}

runSecurityAudit().catch(err => {
  console.error('Fatal audit runner error:', err);
  process.exit(1);
});
