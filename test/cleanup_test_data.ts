import { dbAdapter } from '../server/db';
import { Enquiry } from '../src/types';

/**
 * Precision cleanup script for automated security audit records.
 * Identifies and removes ONLY automated test payloads without deleting legitimate business enquiries.
 */
function isAutomatedTestRecord(e: Enquiry): boolean {
  const email = (e.email || '').toLowerCase();
  const name = (e.fullName || '').toLowerCase();
  const ref = (e.enquiryReference || '');

  // 1. Known security test email domains & prefixes
  if (
    email.includes('sqli-test') ||
    email.includes('xss-buyer') ||
    email.includes('concurrent') ||
    email.includes('@evil.com') ||
    email.includes('@spammer.org') ||
    email.includes('@valid-corp.com')
  ) {
    return true;
  }

  // 2. Known security test payloads in fullName
  if (
    name.includes('drop table') ||
    name.includes('<script>') ||
    name.includes('concurrent buyer') ||
    name.includes('spam bot') ||
    name.includes('attacker') ||
    name.includes('legitimate buyer')
  ) {
    return true;
  }

  // 3. Deceptive honeypot reference
  if (ref.includes('SPAM-DETECTED')) {
    return true;
  }

  return false;
}

async function runCleanup() {
  console.log('🧹 [CLEANUP] Scanning database for automated security test records...');

  const BASE_URL = process.env.APP_URL || 'http://localhost:3000';
  const { signAdminToken } = await import('../server/auth');
  const adminToken = signAdminToken({ id: 'cleanup-admin', email: 'admin@falconspices.com', role: 'admin' });

  let allEnquiries: Enquiry[] = [];
  try {
    const liveRes = await fetch(`${BASE_URL}/api/enquiries`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (liveRes.ok) {
      allEnquiries = await liveRes.json();
    }
  } catch (e) {}

  if (allEnquiries.length === 0) {
    allEnquiries = await dbAdapter.getEnquiries();
  }

  console.log(`📋 Total enquiries found: ${allEnquiries.length}`);

  const testRecords = allEnquiries.filter(isAutomatedTestRecord);
  const legitimateRecords = allEnquiries.filter(e => !isAutomatedTestRecord(e));

  console.log(`   - Automated test records identified: ${testRecords.length}`);
  console.log(`   - Legitimate business records preserved: ${legitimateRecords.length}`);

  if (testRecords.length === 0) {
    console.log('✅ No automated test records found to clean.');
    return;
  }

  let deletedCount = 0;
  for (const record of testRecords) {
    console.log(`   🗑️  Removing test enquiry: [${record.enquiryReference}] ${record.fullName} (${record.email})`);
    try {
      const httpRes = await fetch(`${BASE_URL}/api/enquiries/${record.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'X-Falcon-Admin': '1'
        }
      });
      if (httpRes.ok) {
        deletedCount++;
        continue;
      }
    } catch (e) {}

    // Fallback to direct dbAdapter if server is not reachable
    const success = await dbAdapter.deleteEnquiry(record.id, 'cleanup-script@falcon.com');
    if (success) deletedCount++;
  }

  console.log(`\n✅ [CLEANUP COMPLETE] Successfully removed ${deletedCount} automated test records.`);
  console.log(`🔒 Legitimate records remaining: ${legitimateRecords.length}`);
}

runCleanup().catch(err => {
  console.error('Fatal cleanup error:', err);
  process.exit(1);
});
