import React from 'react';
import { ShieldCheck, FileCheck, Award, ArrowRight, CheckCircle2, Download, Layers } from 'lucide-react';
import { EXPORT_COMPLIANCE_STANDARDS } from '../data/products';

interface QualityPageProps {
  onRequestQuote: (productName?: string) => void;
}

export const QualityPage: React.FC<QualityPageProps> = ({ onRequestQuote }) => {
  const sopSteps = [
    { title: "Mandi & Origin Sourcing", desc: "Rigorous vetting of agricultural growers and primary spice mandi networks based on botanical purity and origin traceability." },
    { title: "Raw Material Inward Inspection", desc: "Physical testing for moisture %, extraneous matter, seed size grading, and initial ASTA color screening." },
    { title: "Cleaning, Destoning & Sorting", desc: "Multi-stage mechanical cleaning, gravity de-stoning, aspiration, and high-intensity magnetic metal separation." },
    { title: "Micro-Reduction Steam Sterilization", desc: "Saturated steam treatment eliminating Salmonella, E. Coli, yeast, and mold without degrading volatile essential oils." },
    { title: "Controlled Temperature Milling", desc: "Precision pin-milling under cool temperatures preventing thermal dissipation of active curcumin and essential aromas." },
    { title: "Moisture Barrier Packaging Inspection", desc: "Automated check-weighing, metal detection, and vacuum / nitrogen barrier sealing in food-grade multi-wall bags." },
    { title: "Accredited Batch Lab Testing & COA", desc: "Export batch sampling tested for moisture, pesticide residue, heavy metals, and microbiological counts with certified COA." },
    { title: "Customs & Statutory Port Clearance", desc: "Issuance of official Phytosanitary certificate, Certificate of Origin, and container sealing supervision at discharge port." }
  ];

  return (
    <div className="bg-[#030d0a] text-[#fdfcf0] py-16 px-4 sm:px-6 lg:px-8 space-y-20 font-sans max-w-7xl mx-auto text-left">
      
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#f2a900] uppercase tracking-widest bg-[#05140f] px-3.5 py-1 rounded-full border border-[#f2a900]/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>QUALITY & COMPLIANCE PROTOCOL</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#fdfcf0] tracking-tight">
          Food Safety Standards & Quality Verification
        </h1>
        <p className="text-[#a3b899] text-sm sm:text-base font-light leading-relaxed">
          Falcon International Traders enforces strict quality control systems guaranteeing international microbiological safety, zero artificial Sudan dyes, and complete consignment batch traceability.
        </p>
      </div>

      {/* Quality SOP Grid */}
      <div className="space-y-6">
        <div className="border-b border-[#154736]/70 pb-3">
          <span className="text-xs font-mono text-[#f2a900] uppercase tracking-wider block">Standard Operating Procedure</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcf0]">
            Our 8-Step Export Quality Workflow
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sopSteps.map((step, idx) => (
            <div key={idx} className="bg-[#05140f] p-6 rounded-2xl border border-[#154736]/60 hover:border-[#f2a900]/40 transition-all space-y-2.5">
              <span className="text-xs font-mono font-bold text-[#f2a900] bg-[#030d0a] px-2.5 py-1 rounded border border-[#154736]">
                STAGE 0{idx + 1}
              </span>
              <h3 className="text-base font-bold font-serif text-[#fdfcf0] pt-1">
                {step.title}
              </h3>
              <p className="text-xs text-[#a3b899] font-light leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* STATUTORY CLEARANCES & COMMITMENTS */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#154736]/70 pb-3">
          <div>
            <span className="text-xs font-mono text-[#f2a900] uppercase tracking-widest block">
              Consignment Documentation
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcf0]">
              Statutory Export Clearances & Guarantees
            </h2>
          </div>

          <button
            onClick={() => onRequestQuote('Quality COA Sample Dossier')}
            className="bg-[#f2a900] hover:bg-[#d97706] text-[#030d0a] font-bold px-5 py-2.5 rounded-lg text-xs shadow flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Request Sample COA Dossier</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXPORT_COMPLIANCE_STANDARDS.map((std, idx) => (
            <div key={idx} className="bg-[#05140f] p-7 rounded-2xl border border-[#154736]/70 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-[#f2a900]">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-[#fdfcf0]">
                  {std.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#a3b899] leading-relaxed font-light">
                {std.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-[#05140f] p-8 sm:p-12 rounded-3xl border border-[#f2a900]/30 text-center space-y-5 shadow-2xl">
        <h3 className="text-2xl font-serif font-bold text-[#fdfcf0]">
          Require Specific Destination Testing Protocols?
        </h3>
        <p className="text-[#a3b899] text-sm max-w-xl mx-auto font-light">
          Whether you require steam sterilization parameter certificates or pesticide multiresidue GC-MS lab testing, we customize lot testing to your importing authority.
        </p>
        <button
          onClick={() => onRequestQuote('Technical Testing Inquiry')}
          className="bg-[#f2a900] hover:bg-[#d97706] text-[#030d0a] font-bold px-7 py-3.5 rounded-xl text-sm shadow-lg transition-all"
        >
          Consult Technical Export Desk
        </button>
      </div>

    </div>
  );
};
