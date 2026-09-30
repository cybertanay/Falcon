import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-turmeric",
    name: "Premium Turmeric Powder",
    slug: "turmeric-powder",
    shortDescription: "Vibrant golden Indian turmeric powder with high natural Curcumin content and characteristic warm earthy aroma.",
    fullDescription: "Falcon International Traders supplies premium grade Indian Turmeric Powder (Curcuma longa) directly sourced from pristine turmeric growing regions of Andhra Pradesh, Telangana (Nizamabad), and Tamil Nadu (Erode). Processed in ultra-modern hygienic units with controlled temperatures to retain natural volatile oils, bright golden saffron color, and rich bioactive Curcumin.",
    category: "Powders",
    image: "/src/assets/images/turmeric_product_1786195278080.jpg",
    gallery: [
      "/src/assets/images/turmeric_product_1786195278080.jpg",
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1000"
    ],
    origin: "Erode / Nizamabad / Salem (India)",
    form: "Fine Ground Powder / Polished Finger Roots",
    packagingOptions: [
      "100g / 250g / 500g / 1kg Retail Pouches",
      "5kg / 10kg Vacuum Foil Packs",
      "25kg / 50kg Multi-wall PP / Jute Bags",
      "1000kg Jumbo Super Sacks with Moisture Barrier"
    ],
    minimumOrderQuantity: "1 Metric Ton (1,000 kg)",
    featured: true,
    published: true,
    specifications: {
      botanicalName: "Curcuma longa L.",
      origin: "India",
      form: "Free-flowing Fine Powder",
      color: "Deep Saffron Yellow / Golden Yellow",
      aroma: "Pungent, warm, earthy aroma",
      moistureMax: "8.0% - 10.0%",
      keyActiveComponent: "Curcumin: 2.5% to 5.0% (Customizable)",
      astaColorValue: "60 - 80 ASTA",
      extraneousMatterMax: "0.5%",
      totalAshMax: "7.0%",
      meshSize: "60 - 80 Mesh",
      shelfLife: "24 Months from manufacturing date",
      storageConditions: "Store in cool, dry hygienic warehouse away from direct sunlight",
      minimumOrderQuantity: "1 Metric Ton"
    },
    availableFormats: ["Polished Whole Fingers", "Unpolished Fingers", "Standard Fine Powder (60 Mesh)", "Micro-fine Powder (100 Mesh)", "Extract Grade High Curcumin"],
    faq: [
      {
        question: "What Curcumin percentages can you supply?",
        answer: "We supply Turmeric powder standardizing from 2.5% up to 5.0%+ Curcumin depending on buyer specifications for spice blends, dietary supplements, or culinary use."
      },
      {
        question: "Is steam sterilization available for EU / US market compliance?",
        answer: "Yes, we provide micro-sterilized steam-treated turmeric powder meeting stringent microbiological parameters required by EU, US FDA, and Gulf standards."
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-red-chilli",
    name: "Indian Red Chilli Powder & Whole",
    slug: "red-chilli-powder",
    shortDescription: "High-grade Indian Red Chilli (Teja S17 / Byadgi / Guntur S334) available in tailored heat units and brilliant natural red color.",
    fullDescription: "Indian Red Chilli is world-renowned for its intense fiery heat and deep natural color. Falcon International Traders exports premium Red Chilli Powder and Whole Chillies (With Stem / Stemless). Whether you require high ASTA color with mild pungency (Byadgi style) or intense pungency for food manufacturing (Teja S17 style), we tailor specifications precisely to your formulation.",
    category: "Powders",
    image: "/src/assets/images/chilli_product_1786195293751.jpg",
    gallery: [
      "/src/assets/images/chilli_product_1786195293751.jpg",
      "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1599909581977-80257c23789b?auto=format&fit=crop&q=80&w=1000"
    ],
    origin: "Guntur (Andhra Pradesh) / Byadgi (Karnataka) / Khammam",
    form: "Whole Dried with Stem / Stemless / Coarse Crushed / Fine Powder",
    packagingOptions: [
      "100g / 200g / 500g / 1kg Branded Zip Pouches",
      "10kg / 25kg PP Bags with Outer Poly Liner",
      "25kg Multi-layer Kraft Paper Bags",
      "Custom Palletized Containers"
    ],
    minimumOrderQuantity: "1 Metric Ton",
    featured: true,
    published: true,
    specifications: {
      botanicalName: "Capsicum annuum L.",
      origin: "India",
      form: "Whole Pods / Flakes / Fine Powder",
      color: "Deep Vibrant Crimson Red",
      aroma: "Fiery, sharp pungent aroma",
      moistureMax: "10.0%",
      keyActiveComponent: "Capsaicin Heat: 20,000 to 90,000 SHU",
      astaColorValue: "50 - 160 ASTA Color units",
      extraneousMatterMax: "1.0%",
      totalAshMax: "8.0%",
      meshSize: "40 - 60 Mesh",
      shelfLife: "24 Months",
      storageConditions: "Cool, dry, dark environment maintaining relative humidity < 60%",
      minimumOrderQuantity: "1 Metric Ton"
    },
    availableFormats: ["Teja S17 (Fiery Heat)", "Byadgi (High ASTA Color, Mild Heat)", "S334 Guntur 334", "Crushed Chilli Flakes", "Stemless Whole Chilli"],
    faq: [
      {
        question: "Can you control the heat level (SHU) for sauces and seasoning manufacturers?",
        answer: "Yes, we blend selected chilli varieties to achieve specific Scoville Heat Units (SHU) from 20,000 SHU up to 90,000 SHU with consistent ASTA color."
      },
      {
        question: "Do you guarantee Aflatoxin and Sudan Red dye safety?",
        answer: "Absolutely. Every export batch undergoes HPLC testing certified by accredited laboratories confirming zero Sudan dyes and Aflatoxin levels well within EU/FDA regulations."
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-cumin",
    name: "Cumin Seeds & Ground Powder",
    slug: "cumin-seeds-powder",
    shortDescription: "Bold Gujarat grade cumin seeds (99% to 99.5% purity) and fresh ground cumin powder rich in essential cuminol oils.",
    fullDescription: "Cumin (Cuminum cyminum) is one of the most widely traded global food seasonings. Sourced directly from Gujarat and Rajasthan spice mandis, Falcon International Traders provides Machine-Cleaned and Sortex-Cleaned Cumin Seeds alongside ground cumin powder. Characterized by high volatile oil content (>2.5%) and rich earthy-warm fragrance.",
    category: "Whole Spices",
    image: "/src/assets/images/cumin_product_1786195311107.jpg",
    gallery: [
      "/src/assets/images/cumin_product_1786195311107.jpg",
      "https://images.unsplash.com/photo-1509358271058-acd05cc93224?auto=format&fit=crop&q=80&w=1000"
    ],
    origin: "Unjha (Gujarat) / Rajasthan (India)",
    form: "Whole Seeds / Ground Powder",
    packagingOptions: [
      "250g / 500g / 1kg Retail Pouches",
      "25kg Jute Bags / HDPE Laminated Bags",
      "50kg PP Bags",
      "Custom OEM Containers"
    ],
    minimumOrderQuantity: "1 Metric Ton",
    featured: true,
    published: true,
    specifications: {
      botanicalName: "Cuminum cyminum L.",
      origin: "India",
      form: "Elongated Whole Seeds / Fine Powder",
      color: "Natural Brownish Green",
      aroma: "Distinct aromatic, nutty, warm spice odor",
      moistureMax: "8.0%",
      keyActiveComponent: "Volatile Essential Oil: > 2.5% v/w",
      extraneousMatterMax: "0.5% (Sortex Grade 99.5% Purity)",
      totalAshMax: "8.5%",
      meshSize: "60 Mesh (for ground format)",
      shelfLife: "24 Months",
      storageConditions: "Store in moisture-proof containers in a cool dry space",
      minimumOrderQuantity: "1 Metric Ton"
    },
    availableFormats: ["Machine Cleaned Cumin Seeds (99% Purity)", "Sortex Cleaned Cumin Seeds (99.5% Purity)", "Ground Cumin Powder", "Roast-grade Cumin Seeds"],
    faq: [
      {
        question: "What purity grades do you offer for cumin seeds?",
        answer: "We offer 99% Machine Cleaned, 99.5% Sortex Cleaned, and Premium Extra Bold Single-Origin Cumin Seeds."
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-garlic-powder",
    name: "Dehydrated Garlic Powder & Granules",
    slug: "garlic-powder-dehydrated",
    shortDescription: "Pure dehydrated garlic powder, granules, and flakes ideal for food processing, seasonings, sauces, snacks, and meat curing.",
    fullDescription: "Falcon International Traders supplies premium Dehydrated Garlic Powder and Granules manufactured from freshly harvested white garlic bulbs. Free from artificial preservatives or anti-caking additives, our garlic powder delivers sharp, authentic pungency and robust flavor profile essential for industrial food manufacturers, sausage/meat processors, and spice blenders.",
    category: "Dehydrated Ingredients",
    image: "/src/assets/images/garlic_product_1786195323982.jpg",
    gallery: [
      "/src/assets/images/garlic_product_1786195323982.jpg",
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=1000"
    ],
    origin: "Mandsaur (Madhya Pradesh) / Gujarat (India)",
    form: "Powder (80-100 Mesh) / Granules (40-80 Mesh) / Flakes",
    packagingOptions: [
      "10kg / 20kg Aluminum Foil Vacuum Bags in Carton",
      "25kg Kraft Paper Bags with PE Inliner",
      "Custom OEM Sealed Tins & Pouches"
    ],
    minimumOrderQuantity: "1 Metric Ton",
    featured: true,
    published: true,
    specifications: {
      botanicalName: "Allium sativum L.",
      origin: "India",
      form: "Free-flowing Off-white Powder",
      color: "Off-white to Pale Cream",
      aroma: "Characteristic pungent garlic aroma",
      moistureMax: "6.0%",
      keyActiveComponent: "Allicin Potential: High pungency standard",
      extraneousMatterMax: "0.1%",
      totalAshMax: "5.0%",
      meshSize: "80 - 100 Mesh Fine Powder",
      shelfLife: "24 Months",
      storageConditions: "Airtight vacuum sealed cartons kept cool and dry (< 20°C)",
      minimumOrderQuantity: "1 Metric Ton"
    },
    availableFormats: ["Dehydrated Garlic Flakes / Cloves", "Dehydrated Garlic Chopped (3-5mm)", "Garlic Granules (40-80 Mesh)", "Garlic Fine Powder (80-100 Mesh)"],
    faq: [
      {
        question: "Does your garlic powder contain anti-caking agents?",
        answer: "We supply 100% pure garlic powder without additives by default. Silicon dioxide or food-grade anti-caking agents can be blended upon specific buyer request for humid climate distribution."
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-black-pepper",
    name: "Tellicherry & Malabar Black Pepper",
    slug: "black-pepper-tellicherry",
    shortDescription: "King of Spices — Bold Garbled Tellicherry TGSEB & Malabar Black Pepper berries (500 g/l to 570 g/l density) and cracked pepper.",
    fullDescription: "Sourced from the lush Western Ghats of Kerala (Malabar Coast), Indian Black Pepper (Piper nigrum) is revered globally for its intense aroma, high piperine content, and bold size. We supply Garbled Tellicherry Extra Bold (TGSEB), Tellicherry Garbled (TGB), Malabar Garbled (MG1), coarse crushed black pepper, and fine ground powder.",
    category: "Whole Spices",
    image: "https://images.unsplash.com/photo-1509358271058-acd05cc93224?auto=format&fit=crop&q=80&w=1000",
    gallery: [
      "https://images.unsplash.com/photo-1509358271058-acd05cc93224?auto=format&fit=crop&q=80&w=1000"
    ],
    origin: "Idukki / Wayanad / Malabar Coast (Kerala, India)",
    form: "Whole Dried Berries / Coarse Crushed / Fine Ground Powder",
    packagingOptions: [
      "25kg Jute Bags / HDPE Woven Sacks",
      "50kg Double-ply Paper Bags",
      "Custom Vacuum Packaged Cartons"
    ],
    minimumOrderQuantity: "1 Metric Ton",
    featured: false,
    published: true,
    specifications: {
      botanicalName: "Piper nigrum L.",
      origin: "India (Malabar / Kerala)",
      form: "Dried Whole Berry",
      color: "Deep Dark Brown to Black",
      aroma: "Pungent, woody, warm aromatic spice",
      moistureMax: "11.0%",
      keyActiveComponent: "Piperine: 4.0% to 6.5%",
      extraneousMatterMax: "0.25%",
      totalAshMax: "6.0%",
      meshSize: "20 - 60 Mesh (ground options)",
      shelfLife: "24 Months",
      storageConditions: "Dry, well-ventilated spice storage below 25°C",
      minimumOrderQuantity: "1 Metric Ton"
    },
    availableFormats: ["TGSEB (Tellicherry Garbled Special Extra Bold)", "TGB (Tellicherry Garbled Bold)", "MG1 (Malabar Garbled Grade 1)", "Coarse Crushed (10-18 Mesh)", "Fine Powder"],
    faq: [
      {
        question: "What bulk density specifications do you guarantee?",
        answer: "We supply Malabar MG1 at 500-550 g/l and Tellicherry TGSEB at 570+ g/l guaranteed density."
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-green-cardamom",
    name: "Allegppey Green Cardamom Pods",
    slug: "green-cardamom-bold",
    shortDescription: "Aromatic Queen of Spices — 7mm & 8mm+ Extra Bold Alleppey Green Cardamom pods with intense piney essential oil aroma.",
    fullDescription: "Indian Green Cardamom (Elettaria cardamomum) from Western Ghats rainforest estates is globally legendary for its vivid natural green color, robust husk, and rich essential oils. Carefully handpicked, sun/machine dried, and graded by seed size (6mm, 7mm, 8mm Extra Bold). Perfect for luxury confectionery, tea blends, Arabic coffee, and fine culinary formulations.",
    category: "Whole Spices",
    image: "https://images.unsplash.com/photo-1608797178974-15b35a640532?auto=format&fit=crop&q=80&w=1000",
    gallery: [
      "https://images.unsplash.com/photo-1608797178974-15b35a640532?auto=format&fit=crop&q=80&w=1000"
    ],
    origin: "Idukki & Coorg (India)",
    form: "Whole Dried Green Pods / Decorticated Seeds",
    packagingOptions: [
      "1kg / 5kg Master Poly Bags inside Vacuum Sealed Cartons",
      "10kg / 25kg Export Grade Wooden Crates / Double Cartons",
      "Custom Private Label Tins"
    ],
    minimumOrderQuantity: "250 kg",
    featured: false,
    published: true,
    specifications: {
      botanicalName: "Elettaria cardamomum Maton",
      origin: "India",
      form: "Tri-locular Green Pods",
      color: "Vibrant Natural Green",
      aroma: "Camphoraceous, sweet, intense herbal spice",
      moistureMax: "10.0%",
      keyActiveComponent: "Volatile Essential Oils: 6.0% to 8.5% v/w",
      extraneousMatterMax: "0.1%",
      totalAshMax: "6.0%",
      shelfLife: "24 Months",
      storageConditions: "Airtight light-shielded containers in air-conditioned storage (< 18°C)",
      minimumOrderQuantity: "250 kg"
    },
    availableFormats: ["8mm+ AGEB (Alleppey Green Extra Bold)", "7mm - 8mm AGB (Alleppey Green Bold)", "6mm - 7mm AGS (Alleppey Green Superior)", "Cardamom Seeds (Decorticated)"],
    faq: [
      {
        question: "How do you preserve the green pod color during export shipping?",
        answer: "We use moisture-barrier vacuum packaging with food-grade desiccant packs inside double-corrugated cartons to shield from ambient heat and humidity."
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Export Quality Commitments (Statutory clearances provided per consignment)
export const EXPORT_COMPLIANCE_STANDARDS = [
  {
    title: "Phytosanitary & Export Clearance",
    description: "Consignment-wise statutory inspection certificates and quarantine clearances issued through authorized port inspection authorities."
  },
  {
    title: "Laboratory Certificate of Analysis (COA)",
    description: "Every shipment is accompanied by batch laboratory analytical certificates verifying moisture, purity, active components, and microbiological counts."
  },
  {
    title: "Steam Sterilization & Micro-Reduction",
    description: "Multi-stage hygienic steam sterilization to satisfy stringent EU, US FDA, and Gulf microbiological parameters without chemical fumigants."
  },
  {
    title: "Fumigation & Origin Documentation",
    description: "Authorized methyl bromide / phosphine container fumigation with statutory certificate and Chamber of Commerce Certificate of Origin."
  }
];

