import { CompanySettings } from '../types';

/**
 * Baseline Company Information (Placeholders)
 * NOTE FOR HUMAN HANDOFF: These contact details and links are placeholder templates
 * that must be verified and updated with Falcon's official corporate registration
 * details during production onboarding.
 */
export const COMPANY_INFO: CompanySettings = {
  name: "Falcon International Traders",
  tagline: "Indian Agro-Commodities & Spice Export Trading Desk",
  positioning: "International B2B food and spice exporter supplying wholesale commodities, technical ingredient grades, and private-label packaging to verified global importers and food manufacturers.",
  email: "export@falconspices.com",
  whatsapp: "+91 98765 43210", // Pending official verified corporate WhatsApp number
  phone: "+91 98765 43210", // Pending official corporate telephone line
  address: "Navi Mumbai / Cochin Port Hub, India",
  websiteUrl: "https://falconinternationaltraders.com",
  socials: {
    linkedin: "https://linkedin.com/company/falcon-international-traders",
    whatsapp: "https://wa.me/919876543210?text=Hello%20Falcon%20International%20Traders,%20I%20am%20interested%20in%20discussing%20a%20B2B%20export%20inquiry."
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
