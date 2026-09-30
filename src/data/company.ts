import { CompanySettings } from '../types';

export const COMPANY_INFO: CompanySettings = {
  name: "Falcon International Traders",
  tagline: "Indian Agro-Commodities & Spice Export Trading Desk",
  positioning: "International B2B food and spice exporter supplying wholesale commodities, technical ingredient grades, and private-label packaging to verified global importers and food manufacturers.",
  email: "export@falconspices.com",
  whatsapp: "+91 98765 43210", // Pending company official number verification
  phone: "+91 98765 43210",
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
    answer: "Our standard export MOQ starts from 1 Metric Ton (1,000 kg) for high-grade specialty spice powders and whole seeds, up to full container loads (FCL 20ft / 40ft) for commercial volume contracts. Sample shipments can be arranged for quality clearance."
  },
  {
    question: "Do you accommodate OEM and custom private-label packaging?",
    answer: "Yes. Falcon International Traders accommodates private-label requirements including retail pouches (100g to 1kg), vacuum foil barrier packs, and bulk multi-wall export sacks (25kg - 50kg) with customer-specified branding, labeling, and barcode compliance."
  },
  {
    question: "How do you handle technical specifications and quality verification?",
    answer: "Every export lot is tested against destination-market parameters such as moisture limits, active chemical component percentages (e.g. Curcumin, Capsaicin), mesh size, and microbiological counts. Consignment Certificates of Analysis (COA) are provided."
  },
  {
    question: "What export documentation is provided with international shipments?",
    answer: "We furnish complete statutory export documentation: Commercial Invoice, Detailed Packing List, Bill of Lading (B/L), Certificate of Origin (COO), Phytosanitary Certificate, Certificate of Analysis (COA), and Fumigation Certificate per importing country regulations."
  },
  {
    question: "Can we request certified pre-shipment laboratory samples?",
    answer: "Yes, certified lot samples (100g - 500g) are dispatched via international express courier along with preliminary analytical data sheets to facilitate buyer laboratory testing and contract sign-off."
  }
];
