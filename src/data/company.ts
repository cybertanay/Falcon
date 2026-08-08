import { CompanyInfo } from '../types';

export const COMPANY_INFO: CompanyInfo = {
  name: "Falcon International Traders",
  tagline: "Premium Indian Spices. Global Standards.",
  positioning: "Indian spice exporter & international food ingredients supplier supplying high-grade bulk spices, OEM manufacturing, and private-label packaging to global buyers.",
  email: "[export@falconspices.com]",
  whatsapp: "[+91 98765 43210]",
  phone: "[+91 98765 43210]",
  address: "[Export Hub, Phase II, Industrial Area, Mumbai / Cochin, India]",
  socials: {
    instagram: "https://instagram.com/falcon_spices_export",
    linkedin: "https://linkedin.com/company/falcon-international-traders",
    whatsapp: "https://wa.me/919876543210?text=Hello%20Falcon%20International%20Traders,%20I%20am%20interested%20in%20your%20spice%20products%20and%20would%20like%20to%20discuss%20a%20bulk%20order."
  },
  metrics: {
    yearsExperience: "[15]+",
    countriesServed: "[40]+",
    monthlyCapacity: "[2,500] MT",
    qualityCertifications: "[6]+"
  }
};

export const GLOBAL_DESTINATIONS = [
  { region: "Middle East", ports: "Jebel Ali (UAE), Dammam (KSA), Sohar (Oman)", code: "ME" },
  { region: "Europe", ports: "Rotterdam (NL), Hamburg (DE), Felixstowe (UK)", code: "EU" },
  { region: "North America", ports: "New York / New Jersey (USA), Los Angeles (USA), Toronto (CA)", code: "NA" },
  { region: "Asia-Pacific", ports: "Singapore (SG), Sydney (AU), Tokyo (JP)", code: "AP" },
  { region: "Africa", ports: "Durban (ZA), Mombasa (KE), Alexandria (EG)", code: "AF" }
];

export const TRUST_GUARANTEES = [
  {
    title: "Quality Assured",
    description: "Multi-stage steam sterilization, ASTA lab testing, & zero-contamination clearance."
  },
  {
    title: "Bulk Orders",
    description: "Flexible minimum order quantities from 1 MT LCL to multi-container FCL consignments."
  },
  {
    title: "Worldwide Shipping",
    description: "Sea freight FCL/LCL and air cargo handling with Phytosanitary clearance & COA."
  },
  {
    title: "OEM & Private Label",
    description: "Custom branding, retail pouches, bulk PP/Jute bags, and customer barcode printing."
  },
  {
    title: "Export-Ready Packaging",
    description: "Multi-wall food-grade packaging, vacuum sealing, moisture barrier liners & palletization."
  }
];

export const GENERAL_FAQS = [
  {
    question: "What is your minimum order quantity (MOQ)?",
    answer: "Our standard minimum order quantity ranges from 1 Metric Ton (1,000 kg) for specialized spices to 1x20ft Container (approx. 14 to 18 MT depending on product bulk density) for FCL pricing. We also accommodate custom sample shipments."
  },
  {
    question: "Do you offer private-label and retail custom packaging?",
    answer: "Yes, Falcon International Traders offers full OEM and private label packaging services. We provide custom printed stand-up pouches, zipper bags, 1kg - 25kg PP/Jute bags, and master cartons with your custom artwork, logo, and nutritional labels."
  },
  {
    question: "Can you provide samples before finalizing a bulk contract?",
    answer: "Yes, we dispatch certified laboratory samples (100g - 500g) via international express couriers (DHL/FedEx) along with initial Certificate of Analysis (COA) for quality inspection and lab testing."
  },
  {
    question: "What export documentation do you provide with shipments?",
    answer: "We provide complete international export documentation including Commercial Invoice, Packing List, Bill of Lading (B/L), Certificate of Origin (COO), Phytosanitary Certificate, Health & Hygiene Certificate, Certificate of Analysis (COA), Fumigation Certificate, and custom documentation according to importing country regulations."
  },
  {
    question: "Which global ports and destinations do you ship to?",
    answer: "We export to major seaports across North America, Europe, Middle East, Africa, and Asia-Pacific on FOB (Free On Board), CIF (Cost, Insurance & Freight), or CFR shipping terms."
  },
  {
    question: "How do you ensure batch consistency and food safety?",
    answer: "All spices undergo meticulous cleaning, destoning, metal detection, micro-reduction steam sterilization, and moisture-controlled packaging in certified hygienic facilities."
  }
];
