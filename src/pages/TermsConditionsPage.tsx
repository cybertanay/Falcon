import React from 'react';
import { FileText } from 'lucide-react';

export const TermsConditionsPage: React.FC = () => {
  return (
    <div className="bg-[#05140f] text-[#fdfcf0] py-12 px-4 sm:px-6 lg:px-8 space-y-8 font-sans max-w-4xl mx-auto">
      <div className="space-y-3 border-b border-[#154736] pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f2a900] uppercase tracking-widest bg-[#f2a900]/10 px-3 py-1 rounded-full border border-[#f2a900]/30">
          <FileText className="w-3.5 h-3.5" />
          <span>Trade Terms</span>
        </div>
        <h1 className="text-3xl font-bold font-serif text-[#fdfcf0]">Terms & Conditions</h1>
        <p className="text-[#a3b899] text-xs font-mono">Last Updated: August 2026 • Falcon International Traders</p>
      </div>

      <div className="space-y-6 text-sm text-[#a3b899] leading-relaxed font-light">
        <p>
          Welcome to Falcon International Traders. By accessing our website, requesting specification sheets, or entering into export agreements with us, you agree to comply with these Terms and Conditions.
        </p>

        <h2 className="text-lg font-bold font-serif text-[#fdfcf0] pt-2">1. International Quotations & Incoterms</h2>
        <p>
          All price quotations issued by Falcon International Traders are based on agreed Incoterms 2020 (FOB Indian Ports like Mundra/Nhava Sheva/Cochin, or CIF Destination Port). Prices are subject to market fluctuations until formal Proforma Invoice (PI) confirmation and contract signing.
        </p>

        <h2 className="text-lg font-bold font-serif text-[#fdfcf0] pt-2">2. Specifications & Quality Guarantees</h2>
        <p>
          Each export consignment is certified to match agreed parameters (Curcumin %, Scoville Heat Units, ASTA color value, moisture %, and mesh size). Official Certificate of Analysis (COA) and Phytosanitary certificates are provided upon container loading.
        </p>

        <h2 className="text-lg font-bold font-serif text-[#fdfcf0] pt-2">3. Minimum Order Quantity (MOQ) & Payment Terms</h2>
        <p>
          Standard minimum order quantity is 1 Metric Ton LCL or FCL full container loads. Payment terms are established via Irrevocable Letter of Credit (L/C at sight) or Telegraphic Transfer (T/T) according to proforma contract agreements.
        </p>
      </div>
    </div>
  );
};
