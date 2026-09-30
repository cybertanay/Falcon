import xss from 'xss';

interface EnquiryEmailPayload {
  reference: string;
  fullName: string;
  companyName?: string;
  country: string;
  email: string;
  whatsapp?: string;
  productName: string;
  estimatedQuantity: string;
  packagingRequirement?: string;
  message?: string;
}

/**
 * Dispatches two-way transactional emails via Resend:
 * 1. Customer confirmation email containing the reference number and next steps.
 * 2. Business notification email to the Falcon export desk.
 */
export async function sendEnquiryEmails(payload: EnquiryEmailPayload): Promise<{ success: boolean; customerNotified: boolean; businessNotified: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const businessEmail = process.env.BUSINESS_EMAIL || 'export@falconspices.com';

  // Sanitize all inputs to prevent HTML injection
  const safeRef = xss(payload.reference);
  const safeName = xss(payload.fullName);
  const safeCompany = xss(payload.companyName || 'Not specified');
  const safeCountry = xss(payload.country);
  const safeEmail = xss(payload.email);
  const safeWhatsapp = xss(payload.whatsapp || 'Not provided');
  const safeProduct = xss(payload.productName);
  const safeQuantity = xss(payload.estimatedQuantity);
  const safePackaging = xss(payload.packagingRequirement || 'Standard export packaging');
  const safeMessage = xss(payload.message || 'No additional notes provided');

  if (!apiKey || apiKey === 're_123456789' || apiKey.trim() === '') {
    console.info(`[Email Service] RESEND_API_KEY not set. Simulated two-way dispatch for enquiry ref ${safeRef}`);
    return { success: true, customerNotified: false, businessNotified: false };
  }

  let customerNotified = false;
  let businessNotified = false;

  // 1. Business Notification Email
  try {
    const businessRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Falcon Website Leads <export@falconspices.com>',
        to: [businessEmail],
        reply_to: safeEmail,
        subject: `[New B2B Quote Lead: ${safeRef}] ${safeProduct} - ${safeCompany} (${safeCountry})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #143D28; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #05140f; color: #f2a900; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 20px;">Falcon International Traders — New B2B Lead</h1>
              <p style="margin: 5px 0 0 0; color: #fdfcf0; font-size: 14px;">Enquiry Reference: <strong>${safeRef}</strong></p>
            </div>
            <div style="padding: 24px; background: #ffffff; color: #333333; line-height: 1.6;">
              <h3 style="color: #05140f; border-bottom: 2px solid #f2a900; padding-bottom: 6px;">Buyer Information</h3>
              <p><strong>Contact Name:</strong> ${safeName}</p>
              <p><strong>Company:</strong> ${safeCompany}</p>
              <p><strong>Country / Port:</strong> ${safeCountry}</p>
              <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
              <p><strong>WhatsApp / Phone:</strong> ${safeWhatsapp}</p>

              <h3 style="color: #05140f; border-bottom: 2px solid #f2a900; padding-bottom: 6px; margin-top: 20px;">Product & Consignment Scope</h3>
              <p><strong>Product Requested:</strong> ${safeProduct}</p>
              <p><strong>Order Quantity:</strong> ${safeQuantity}</p>
              <p><strong>Packaging Specification:</strong> ${safePackaging}</p>
              
              <h4 style="margin-top: 15px; margin-bottom: 5px;">Buyer's Message / Technical Notes:</h4>
              <div style="background-color: #f7f9f8; padding: 12px; border-left: 4px solid #154736; border-radius: 4px;">
                ${safeMessage}
              </div>
            </div>
            <div style="background: #05140f; color: #a3b899; padding: 12px; text-align: center; font-size: 12px;">
              Falcon International Traders B2B Lead Notification
            </div>
          </div>
        `
      })
    });
    businessNotified = businessRes.ok;
  } catch (err) {
    console.error('[Email Service] Error dispatching business email:', err);
  }

  // 2. Customer Confirmation Email
  try {
    const customerRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Falcon International Traders <export@falconspices.com>',
        to: [safeEmail],
        subject: `[Quote Request Received: ${safeRef}] Falcon International Traders`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #143D28; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #05140f; color: #f2a900; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 20px;">Falcon International Traders</h1>
              <p style="margin: 5px 0 0 0; color: #fdfcf0; font-size: 13px;">Premium Indian Spices • Global Standards</p>
            </div>
            <div style="padding: 24px; background: #ffffff; color: #333333; line-height: 1.6;">
              <p>Dear ${safeName},</p>
              <p>Thank you for contacting <strong>Falcon International Traders</strong>. We have received your export quotation request. Our trade desk is reviewing your requirements and preparing product specifications and pricing.</p>
              
              <div style="background-color: #f7f9f8; border: 1px solid #e2e8e5; border-radius: 6px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0 0 8px 0;"><strong>Enquiry Reference:</strong> <span style="font-family: monospace; color: #0d3126; font-size: 15px; font-weight: bold;">${safeRef}</span></p>
                <p style="margin: 0 0 8px 0;"><strong>Product:</strong> ${safeProduct}</p>
                <p style="margin: 0 0 8px 0;"><strong>Quantity:</strong> ${safeQuantity}</p>
                <p style="margin: 0 0 8px 0;"><strong>Packaging:</strong> ${safePackaging}</p>
                <p style="margin: 0;"><strong>Destination:</strong> ${safeCountry}</p>
              </div>

              <h4 style="color: #05140f; margin-bottom: 8px;">Next Steps:</h4>
              <ul style="padding-left: 20px; margin-top: 0; color: #555555;">
                <li>Our export desk will review destination compliance requirements and current FOB / CIF pricing.</li>
                <li>An official proforma quotation and Certificate of Analysis (COA) template will be sent to your email within 24 business hours.</li>
                <li>If your order requires immediate coordination or sample dispatch, you can reply directly to this email or contact us via WhatsApp at +91 98765 43210.</li>
              </ul>

              <p style="margin-top: 24px;">Sincerely,<br><strong>Export Sales Team</strong><br>Falcon International Traders</p>
            </div>
            <div style="background: #05140f; color: #a3b899; padding: 14px; text-align: center; font-size: 12px;">
              © ${new Date().getFullYear()} Falcon International Traders. All rights reserved.
            </div>
          </div>
        `
      })
    });
    customerNotified = customerRes.ok;
  } catch (err) {
    console.error('[Email Service] Error dispatching customer confirmation email:', err);
  }

  return { success: true, customerNotified, businessNotified };
}
