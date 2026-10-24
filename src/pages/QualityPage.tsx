import React from 'react';
import { ShieldCheck, FileCheck, Award, ArrowRight, CheckCircle2, Download, Layers } from 'lucide-react';
import { EXPORT_COMPLIANCE_STANDARDS } from '../data/products';

interface QualityPageProps {
  onRequestQuote: (productName?: string) => void;
}

export const QualityPage: React.FC<QualityPageProps> = ({ onRequestQuote }) => {
  const sopSteps = [
    { title: "Origin & Sourcing", desc: "Growing region and origin details are confirmed for each order." },
    { title: "Physical Parameters", desc: "Moisture, extraneous matter, grading and ASTA color are specified in the contract." },
    { title: "Cleaning & Sorting", desc: "Cleaning grade (for example machine cleaned or sortex cleaned) is agreed per product." },
    { title: "Microbiological Treatment", desc: "Steam treatment and microbiological limits can be discussed on request." },
    { title: "Grinding & Mesh Size", desc: "Mesh size and powder format are specified per order." },
    { title: "Packaging", desc: "Packaging type, liners and net weights are agreed per order." },
    { title: "Laboratory Testing & COA", desc: "Tests such as moisture, pesticide residues, heavy metals and microbiology can be requested, with the laboratory and limits agreed in the contract." },
    { title: "Export Documentation", desc: "Phytosanitary Certificate and Certificate of Origin are arranged where the importing country requires them." }
  ];

  return (
    <div className="bg-transparent text-[#fdfcf0] py-16 px-4 sm:px-6 lg:px-8 space-y-20 font-sans max-w-7xl mx-auto text-left">
      
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#f2a900] uppercase tracking-widest bg-[#05140f] px-3.5 py-1 rounded-full border border-[#f2a900]/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>QUALITY & COMPLIANCE PROTOCOL</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#fdfcf0] tracking-tight">
          Quality & Specifications
        </h1>
        <p className="text-[#a3b899] text-sm sm:text-base font-light leading-relaxed">
          Quality parameters, testing and documentation are agreed with each buyer and recorded in the sales contract. The topics below are what we typically discuss before an order is confirmed.
        </p>
      </div>

      {/* Quality SOP Grid */}
      <div className="space-y-6">
        <div className="border-b border-[#154736]/70 pb-3">
          <span className="text-xs font-mono text-[#f2a900] uppercase tracking-wider block">Specification Checklist</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcf0]">
            Quality Topics We Agree With Buyers
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
              Export Documentation
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
          If your importing authority requires specific tests, such as pesticide multi-residue analysis, tell us when you request a quote so they can be agreed in the contract.
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
