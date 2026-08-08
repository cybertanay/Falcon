import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-[#05140f] text-[#fdfcf0] py-12 px-4 sm:px-6 lg:px-8 space-y-8 font-sans max-w-4xl mx-auto">
      <div className="space-y-3 border-b border-[#154736] pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f2a900] uppercase tracking-widest bg-[#f2a900]/10 px-3 py-1 rounded-full border border-[#f2a900]/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>B2B Data Protection</span>
        </div>
        <h1 className="text-3xl font-bold font-serif text-[#fdfcf0]">Privacy Policy</h1>
        <p className="text-[#a3b899] text-xs font-mono">Last Updated: August 2026 • Falcon International Traders</p>
      </div>

      <div className="space-y-6 text-sm text-[#a3b899] leading-relaxed font-light">
        <p>
          Falcon International Traders ("Company", "we", "us", "our") values the privacy of our international B2B clients, importers, distributors, and partners. This Privacy Policy outlines how we collect, store, and process business information provided through our official export portal.
        </p>

        <h2 className="text-lg font-bold font-serif text-[#fdfcf0] pt-2">1. Information We Collect</h2>
        <p>
          When you request a quotation, lab sample, or contact our export desk, we collect company business details including company name, buyer name, business email address, WhatsApp/phone number, country of import, and target product specifications.
        </p>

        <h2 className="text-lg font-bold font-serif text-[#fdfcf0] pt-2">2. How We Use Business Data</h2>
        <ul className="list-disc pl-5 space-y-1 text-[#a3b899]">
          <li>Preparing custom price quotations (FOB/CIF shipping terms).</li>
          <li>Processing lab sample courier dispatches (DHL/FedEx).</li>
          <li>Sending Certificate of Analysis (COA) and phytosanitary clearance documentation.</li>
          <li>Direct B2B communication regarding vessel schedules and shipment tracking.</li>
        </ul>

        <h2 className="text-lg font-bold font-serif text-[#fdfcf0] pt-2">3. Confidentiality & Security</h2>
        <p>
          All proprietary product formulations, private label branding artwork, and commercial trade enquiries remain strictly confidential and are never sold or shared with third parties, except as required for customs clearance and shipping logistics.
        </p>
      </div>
    </div>
  );
};
