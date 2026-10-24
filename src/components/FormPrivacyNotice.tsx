import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Short collection notice shown next to every enquiry submit button.
 * Keep this consistent with the Privacy Policy (src/pages/PrivacyPolicyPage.tsx).
 */
export const FormPrivacyNotice: React.FC<{ id?: string }> = ({ id }) => (
  <p id={id} className="text-[11px] text-[#a3b899] leading-relaxed">
    We use these details only to respond to your enquiry and prepare a quotation. They are stored in our
    enquiry system and sent to our export desk by email. Submitting this form does not place an order and
    does not sign you up for marketing. See our{' '}
    <Link to="/privacy" className="text-[#f2a900] underline underline-offset-2">Privacy Policy</Link>,{' '}
    <Link to="/terms" className="text-[#f2a900] underline underline-offset-2">Terms</Link> and{' '}
    <Link to="/order-policy" className="text-[#f2a900] underline underline-offset-2">Order &amp; Claims Policy</Link>.
  </p>
);
