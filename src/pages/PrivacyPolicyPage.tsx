import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-[#030d0a] text-[#fdfcf0] py-16 px-4 sm:px-6 lg:px-8 space-y-8 font-sans max-w-4xl mx-auto text-left">
      <div className="space-y-3 border-b border-[#154736]/70 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#f2a900] uppercase tracking-widest bg-[#05140f] px-3.5 py-1 rounded-full border border-[#f2a900]/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>B2B DATA PRIVACY STANDARDS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#fdfcf0]">Privacy Policy</h1>
        <p className="text-[#a3b899] text-xs font-mono">Last Verified: 2026 • Falcon International Traders</p>
      </div>

      <div className="space-y-6 text-sm text-[#a3b899] leading-relaxed font-light">
        <p>
          Falcon International Traders ("Company", "we", "us", "our") respects the privacy and confidentiality of our international B2B clients, commodity importers, food processing groups, and retail distributors. This policy outlines how commercial inquiry data is handled.
        </p>

        <h2 className="text-lg font-bold font-serif text-[#fdfcf0] pt-2">1. Commercial Information Collected</h2>
        <p>
          When submitting quote requests or technical specifications through our website, we collect necessary business details: buyer name, corporate entity, official business email, WhatsApp contact number, destination port, and commodity requirements.
        </p>

        <h2 className="text-lg font-bold font-serif text-[#fdfcf0] pt-2">2. Purpose of Processing</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-[#a3b899]">
          <li>Preparing accurate commodity quotations (FOB Indian port / CIF destination port).</li>
          <li>Arranging laboratory express sample dispatches (DHL / FedEx courier).</li>
          <li>Furnishing statutory export compliance documentation (COA, Phytosanitary Certificate, Fumigation Certificate).</li>
          <li>Direct trade desk communications regarding production runs and vessel bookings.</li>
        </ul>

        <h2 className="text-lg font-bold font-serif text-[#fdfcf0] pt-2">3. Commercial Confidentiality</h2>
        <p>
          Customer packaging artwork, proprietary spice blend formulations, and shipment contract terms are treated under strict commercial confidentiality and are never shared or sold to third parties.
        </p>
      </div>
    </div>
  );
};
