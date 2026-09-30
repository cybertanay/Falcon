import React from 'react';
import { FileText } from 'lucide-react';

export const TermsConditionsPage: React.FC = () => {
  return (
    <div className="bg-[#030d0a] text-[#fdfcf0] py-16 px-4 sm:px-6 lg:px-8 space-y-8 font-sans max-w-4xl mx-auto text-left">
      <div className="space-y-3 border-b border-[#154736]/70 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#f2a900] uppercase tracking-widest bg-[#05140f] px-3.5 py-1 rounded-full border border-[#f2a900]/30">
          <FileText className="w-3.5 h-3.5" />
          <span>INTERNATIONAL TRADE TERMS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#fdfcf0]">Terms & Conditions</h1>
        <p className="text-[#a3b899] text-xs font-mono">Last Verified: 2026 • Falcon International Traders</p>
      </div>

      <div className="space-y-6 text-sm text-[#a3b899] leading-relaxed font-light">
        <p>
          Falcon International Traders conducts international B2B agro-commodity trade in accordance with standard international trading customs and agreed commercial contracts.
        </p>

        <h2 className="text-lg font-bold font-serif text-[#fdfcf0] pt-2">1. International Quotations & Incoterms</h2>
        <p>
          Price quotations issued by Falcon International Traders are based on agreed Incoterms 2020 (FOB Nhava Sheva / Cochin, or CIF Destination Port). Formal contracts and Proforma Invoices (PI) govern final binding contract terms.
        </p>

        <h2 className="text-lg font-bold font-serif text-[#fdfcf0] pt-2">2. Product Specifications & COA</h2>
        <p>
          Shipments are certified against agreed technical parameters (Curcumin %, Scoville Heat Units, ASTA value, moisture %, mesh size). Batch Certificates of Analysis (COA) and Statutory Phytosanitary Certificates are furnished for every export container.
        </p>

        <h2 className="text-lg font-bold font-serif text-[#fdfcf0] pt-2">3. Minimum Order Quantity (MOQ) & Trade Terms</h2>
        <p>
          Standard export minimum order quantities start at 1 Metric Ton (1,000 kg) up to Full Container Loads (FCL 20ft / 40ft). Payment terms are confirmed via Irrevocable Letter of Credit (L/C at sight) or confirmed Telegraphic Transfer (T/T) per sales contract.
        </p>
      </div>
    </div>
  );
};
