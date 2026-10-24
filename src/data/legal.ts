/**
 * Facts used by the legal pages (Privacy Policy, Terms, Order & Claims Policy).
 *
 * None of these may be invented. Each value is read from a build-time environment
 * variable and stays empty until Falcon management confirms it; the pages then show
 * a visible "[MANAGEMENT TO CONFIRM: ...]" marker instead of a made-up value.
 *
 * Update LEGAL_LAST_UPDATED whenever the wording of a legal page changes.
 */
function publicEnv(key: string): string {
  const viteEnv = (import.meta as any).env as Record<string, string | undefined> | undefined;
  return (viteEnv?.[key] ?? '').trim();
}

export const LEGAL_FACTS = {
  legalEntityName: publicEnv('VITE_PUBLIC_LEGAL_ENTITY_NAME'),
  registrationNumber: publicEnv('VITE_PUBLIC_REGISTRATION_NUMBER'),
  registeredAddress: publicEnv('VITE_PUBLIC_REGISTERED_ADDRESS'),
  privacyEmail: publicEnv('VITE_PUBLIC_PRIVACY_EMAIL')
};

/** Draft status shown at the top of every legal page until counsel signs off. */
export const LEGAL_DRAFT_NOTICE =
  'Draft for management and legal review. This page has not yet been approved by Falcon International Traders or its legal advisers.';

/** Date the legal page wording was last revised (YYYY-MM-DD). */
export const LEGAL_LAST_UPDATED = '2026-10-24';
