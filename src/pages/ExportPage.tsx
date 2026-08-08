import React from 'react';
import { Ship, Package, FileText, ArrowRight, CheckCircle2, Box, Sparkles } from 'lucide-react';

interface ExportPageProps {
  onRequestQuote: () => void;
}

export const ExportPage: React.FC<ExportPageProps> = ({ onRequestQuote }) => {
  const steps = [
    { num: "01", title: "Enquiry", desc: "Buyer submits product specifications, required quantity, target price, and destination port." },
    { num: "02", title: "Product Selection", desc: "Our team recommends matching spice varieties, active compound grades, and mesh parameters." },
    { num: "03", title: "Specification Confirmation", desc: "Detailed technical specification sheet, ASTA color targets, and MOQ agreed." },
    { num: "04", title: "Sample / Approval", desc: "Certified laboratory samples (100g - 500g) dispatched via express DHL/FedEx for buyer approval." },
    { num: "05", title: "Production & Packaging", desc: "Spice cleaning, micro-sterilization, milling, and filling into chosen food-grade export packaging." },
    { num: "06", title: "Quality Checks & Testing", desc: "Final batch COA lab testing verifying zero Sudan dyes, Aflatoxins, and microbiological compliance." },
    { num: "07", title: "Documentation", desc: "Issuance of Commercial Invoice, Packing List, Phytosanitary Certificate, Bill of Lading, and COO." },
    { num: "08", title: "Shipment & Vessel Departure", desc: "Container stuffing, fumigation, customs clearance at Indian port, and shipping line vessel tracking." }
  ];

  return (
    <div className="bg-[#05140f] text-[#fdfcf0] py-12 px-4 sm:px-6 lg:px-8 space-y-16 font-sans max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f2a900] uppercase tracking-widest bg-[#082018] px-3 py-1 rounded-full border border-[#f2a900]/30">
          <Ship className="w-3.5 h-3.5" />
          <span>International Logistics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#fdfcf0] tracking-tight">
          Export Process & Packaging Options
        </h1>
        <p className="text-[#a3b899] text-sm sm:text-base font-light leading-relaxed">
          From initial sample dispatch to vessel departure and customs documentation surrender, experience a transparent, streamlined B2B export workflow.
        </p>
      </div>

      {/* STEP BY STEP TIMELINE */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold font-serif text-[#fdfcf0] border-b border-[#154736] pb-3">
          Step-by-Step Export Timeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="bg-[#082018] p-6 rounded-2xl border border-[#154736] hover:border-[#f2a900]/40 transition-all space-y-3 shadow-lg relative group">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-extrabold font-mono text-[#f2a900]">
                  {step.num}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#f2a900]"></span>
              </div>
              <h3 className="text-lg font-bold font-serif text-[#fdfcf0]">
                {step.title}
              </h3>
              <p className="text-xs text-[#a3b899] font-light leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* INTERNATIONAL PACKAGING SECTION */}
      <div className="space-y-8 pt-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#f2a900] uppercase tracking-widest block">
            Container Stuffing & Protection
          </span>
          <h2 className="text-2xl font-bold font-serif text-[#fdfcf0]">
            International Packaging Options
          </h2>
          <p className="text-[#a3b899] text-sm font-light">
            Packaging can be customized according to product density, destination climate, and buyer requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Bulk Kraft & PP Bags",
              specs: "25kg / 50kg Multi-wall Kraft paper bags or PP woven bags with 80-micron PE inner liner shielding from moisture and humidity."
            },
            {
              title: "Vacuum Sealed Cartons",
              specs: "10kg / 20kg Aluminum foil vacuum sealed bags packed inside double-corrugated master cartons. Ideal for essential oil retention in Cardamom & Pepper."
            },
            {
              title: "Jumbo Sacks & Retail Pouches",
              specs: "1000kg FIBC Jumbo Super Sacks for industrial extractors, or custom printed stand-up retail pouches for private label brands."
            }
          ].map((pack, idx) => (
            <div key={idx} className="bg-[#082018] p-6 rounded-2xl border border-[#f2a900]/30 space-y-3 shadow-lg">
              <div className="w-10 h-10 rounded-lg bg-[#f2a900]/10 border border-[#f2a900]/30 flex items-center justify-center text-[#f2a900]">
                <Box className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-serif text-[#fdfcf0]">
                {pack.title}
              </h3>
              <p className="text-xs text-[#a3b899] font-light leading-relaxed">
                {pack.specs}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-[#082018] p-8 rounded-2xl border border-[#f2a900]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl text-center md:text-left">
        <div className="space-y-1">
          <h3 className="text-xl font-bold font-serif text-[#fdfcf0]">
            Request Export Container Stuffing & Freight Rates
          </h3>
          <p className="text-[#a3b899] text-sm font-light">
            Contact us for FOB Mundra/Nhava Sheva/Cochin or CIF destination port quotes.
          </p>
        </div>
        <button
          onClick={onRequestQuote}
          className="bg-[#f2a900] hover:bg-[#d99700] text-[#05140f] font-bold px-6 py-3 rounded-lg text-sm shadow whitespace-nowrap flex items-center gap-2"
        >
          <span>Request Shipping Quotation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
