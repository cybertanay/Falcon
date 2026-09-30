import React from 'react';
import { Ship, Package, FileText, ArrowRight, CheckCircle2, Box, Sparkles } from 'lucide-react';

interface ExportPageProps {
  onRequestQuote: () => void;
}

export const ExportPage: React.FC<ExportPageProps> = ({ onRequestQuote }) => {
  const steps = [
    { num: "01", title: "Buyer Requirement", desc: "Buyer submits technical specifications, target destination port, and volume estimation." },
    { num: "02", title: "Product Specification", desc: "Our trade team confirms active botanical grade, ASTA color value, and mesh parameters." },
    { num: "03", title: "Contract & Quotation", desc: "Detailed FOB/CIF pricing, payment terms, and container packing configurations agreed." },
    { num: "04", title: "Pre-Shipment Samples", desc: "Certified lot samples (100g - 500g) dispatched via express courier with preliminary COA." },
    { num: "05", title: "Production & Milling", desc: "Hygienic destoning, micro-reduction steam sterilization, and temperature-controlled milling." },
    { num: "06", title: "Quality Testing", desc: "Accredited laboratory analysis verifying zero Sudan dyes, low moisture, and microbiological parameters." },
    { num: "07", title: "Statutory Documentation", desc: "Issuance of Commercial Invoice, Packing List, Phytosanitary Certificate, Bill of Lading, and COO." },
    { num: "08", title: "Container Vessel Dispatch", desc: "Container stuffing, fumigation, port customs clearance at Nhava Sheva / Cochin, and vessel departure." }
  ];

  return (
    <div className="bg-[#030d0a] text-[#fdfcf0] py-16 px-4 sm:px-6 lg:px-8 space-y-20 font-sans max-w-7xl mx-auto text-left">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#f2a900] uppercase tracking-widest bg-[#05140f] px-3.5 py-1 rounded-full border border-[#f2a900]/30">
          <Ship className="w-3.5 h-3.5" />
          <span>MARITIME EXPORT LOGISTICS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#fdfcf0] tracking-tight">
          Export Workflow & Packaging Specifications
        </h1>
        <p className="text-[#a3b899] text-sm sm:text-base font-light leading-relaxed">
          From initial sample dispatch to vessel departure and customs documentation surrender, experience a transparent, streamlined B2B export workflow.
        </p>
      </div>

      {/* STEP BY STEP TIMELINE */}
      <div className="space-y-8">
        <div className="border-b border-[#154736]/70 pb-3">
          <span className="text-xs font-mono text-[#f2a900] uppercase tracking-wider block">Containerised Cargo Lifecycle</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcf0]">
            Step-by-Step International Trade Timeline
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step) => (
            <div key={step.num} className="bg-[#05140f] p-6 rounded-2xl border border-[#154736]/70 hover:border-[#f2a900]/40 transition-all space-y-3 shadow-xl relative group">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-extrabold font-mono text-[#f2a900]">
                  {step.num}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#f2a900]" />
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
      <div className="space-y-8 pt-4">
        <div className="space-y-2 border-b border-[#154736]/70 pb-3">
          <span className="text-xs font-mono text-[#f2a900] uppercase tracking-widest block">
            Cargo Protection
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcf0]">
            Standard Export Packaging Configurations
          </h2>
          <p className="text-[#a3b899] text-sm font-light">
            Packaging is customized according to bulk density, destination climate, and client warehouse requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Multi-Wall Kraft & PP Woven Bags",
              specs: "25kg / 50kg multi-wall Kraft paper bags or PP woven sacks with 80-micron PE inner liner shielding from moisture, sea spray, and condensation."
            },
            {
              title: "Vacuum-Barrier Foil Packs",
              specs: "5kg / 10kg / 20kg food-grade aluminum foil vacuum packs packed inside double-corrugated master cartons. Ideal for essential oil retention."
            },
            {
              title: "FIBC Jumbo Super Sacks",
              specs: "500kg - 1,000kg FIBC Jumbo Super Sacks with moisture barrier liner, forklift lifting loops, and bottom discharge spouts for industrial food manufacturers."
            }
          ].map((pack, idx) => (
            <div key={idx} className="bg-[#05140f] p-7 rounded-2xl border border-[#154736]/70 space-y-3 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-[#f2a900]">
                <Box className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#fdfcf0]">
                {pack.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#a3b899] font-light leading-relaxed">
                {pack.specs}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-[#05140f] p-8 sm:p-12 rounded-3xl border border-[#f2a900]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl text-center md:text-left">
        <div className="space-y-1.5">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#fdfcf0]">
            Request Container Freight & Incoterm Rates
          </h3>
          <p className="text-[#a3b899] text-sm font-light max-w-xl">
            Contact us for FOB Nhava Sheva / Cochin or CIF destination port quotation with confirmed sailing schedules.
          </p>
        </div>
        <button
          onClick={onRequestQuote}
          className="bg-gradient-to-r from-[#f2a900] to-[#d97706] hover:from-[#e09b00] hover:to-[#b45309] text-[#030d0a] font-bold px-7 py-3.5 rounded-xl text-sm shadow-xl whitespace-nowrap flex items-center gap-2"
        >
          <span>Request Shipping Quotation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
