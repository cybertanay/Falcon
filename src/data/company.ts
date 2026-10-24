import { CompanySettings } from '../types';

/**
 * Public contact details.
 *
 * The values previously hard-coded here (+91 98765 43210, export@falconspices.com,
 * "Navi Mumbai / Cochin Port Hub") were unverified placeholders. They are now read
 * from build-time environment variables so that nothing unverified is published.
 * Leave a variable empty until Falcon management has confirmed the value: the UI
 * then shows a "pending verification" notice and hides links that need it.
 *
 * Read both from Vite (browser bundle) and from process.env (server imports this file).
 */
function publicEnv(key: string): string {
  const viteEnv = (import.meta as any).env as Record<string, string | undefined> | undefined;
  const nodeEnv = typeof process !== 'undefined' ? process.env : undefined;
  return (viteEnv?.[key] ?? nodeEnv?.[key] ?? '').trim();
}

const contactEmail = publicEnv('VITE_PUBLIC_CONTACT_EMAIL');
const whatsappNumber = publicEnv('VITE_PUBLIC_WHATSAPP_NUMBER');
const phoneNumber = publicEnv('VITE_PUBLIC_PHONE_NUMBER');
const businessAddress = publicEnv('VITE_PUBLIC_BUSINESS_ADDRESS');

/** Shown wherever a contact detail has not been verified yet. */
export const CONTACT_PENDING_TEXT = 'Contact details pending verification';

/** Builds a wa.me link, or '' when no verified WhatsApp number is configured. */
export function whatsappLink(message: string): string {
  const digits = whatsappNumber.replace(/[^0-9]/g, '');
  if (!digits) return '';
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export const COMPANY_INFO: CompanySettings = {
  name: "Falcon International Traders",
  tagline: "Indian Agro-Commodities & Spice Export Trading Desk",
  positioning: "International B2B food and spice exporter supplying wholesale commodities, technical ingredient grades, and private-label packaging to global importers and food manufacturers.",
  email: contactEmail,
  whatsapp: whatsappNumber,
  phone: phoneNumber,
  address: businessAddress,
  websiteUrl: publicEnv('VITE_PUBLIC_SITE_URL') || "https://falconinternationaltraders.com",
  socials: {
    whatsapp: whatsappLink("Hello Falcon International Traders, I am interested in discussing a B2B export inquiry.")
  }
};

export const GLOBAL_DESTINATIONS = [
  { region: "Middle East & Gulf", ports: "Jebel Ali (UAE), Dammam (KSA), Sohar (Oman)", code: "ME" },
  { region: "Europe", ports: "Rotterdam (NL), Hamburg (DE), Felixstowe (UK)", code: "EU" },
  { region: "North America", ports: "New York / New Jersey (USA), Los Angeles (USA), Montreal (CA)", code: "NA" },
  { region: "Asia-Pacific", ports: "Singapore (SG), Sydney (AU), Tokyo (JP)", code: "AP" },
  { region: "Africa", ports: "Durban (ZA), Mombasa (KE), Alexandria (EG)", code: "AF" }
];

export const GENERAL_FAQS = [
  {
    question: "What is your standard Minimum Order Quantity (MOQ)?",
    answer: "Indicative minimum order quantities start from 1 Metric Ton (1,000 kg) for most spice powders and whole seeds, up to full container loads (FCL 20ft / 40ft). The MOQ for each order is confirmed in the quotation. Samples can be discussed on request."
  },
  {
    question: "Do you accommodate OEM and custom private-label packaging?",
    answer: "Private-label requests can be discussed, including retail pouches (100g to 1kg), vacuum foil packs and bulk export sacks (25kg - 50kg) with customer branding. The buyer is responsible for the content and regulatory compliance of its own labels and artwork unless otherwise agreed in writing."
  },
  {
    question: "How are technical specifications and quality confirmed?",
    answer: "Specifications such as moisture, active components (e.g. curcumin, capsaicin), mesh size and microbiological limits are agreed for each order in the sales contract. A Certificate of Analysis for the agreed parameters can be provided."
  },
  {
    question: "What export documentation is provided with international shipments?",
    answer: "Shipping documents typically include a Commercial Invoice, Packing List and Bill of Lading. A Certificate of Origin, Phytosanitary Certificate, Certificate of Analysis and Fumigation Certificate can be arranged where required. The documents for each order are listed in the sales contract."
  },
  {
    question: "Can we request pre-shipment samples?",
    answer: "Samples (typically 100g - 500g) can be requested for buyer evaluation. Sample availability, cost, courier and any accompanying analysis are confirmed when you request them."
  }
];
