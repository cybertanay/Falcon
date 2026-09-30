import React from 'react';
import { PackagingCustomizer } from '../components/PackagingCustomizer';
import { Tag, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface PrivateLabelPageProps {
  onRequestQuote: (productName?: string) => void;
}

export const PrivateLabelPage: React.FC<PrivateLabelPageProps> = ({ onRequestQuote }) => {
  return (
    <div className="bg-[#030d0a] text-[#fdfcf0] py-16 px-4 sm:px-6 lg:px-8 space-y-20 font-sans max-w-7xl mx-auto text-left">
      
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#f2a900] uppercase tracking-widest bg-[#05140f] px-3.5 py-1 rounded-full border border-[#f2a900]/30">
          <Tag className="w-3.5 h-3.5" />
          <span>OEM CONTRACT MANUFACTURING</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#fdfcf0] tracking-tight">
          Private Label & Retail Packaging Solutions
        </h1>
        <p className="text-[#a3b899] text-sm sm:text-base font-light leading-relaxed">
          Falcon International Traders supports international supermarkets, retail brands, and food manufacturers with end-to-end private-label spice packaging, custom blending, and OEM manufacturing.
        </p>
      </div>

      {/* VISUAL WORKFLOW */}
      <div className="bg-[#05140f] p-8 sm:p-10 rounded-3xl border border-[#154736]/70 space-y-8 shadow-2xl">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-[#f2a900] uppercase tracking-widest block">OEM Production Lifecycle</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcf0]">
            5-Stage Private Label Process
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-center">
          {[
            { step: "01", title: "Brand Concept", desc: "Customer artwork, logo branding, and destination regulatory requirements." },
            { step: "02", title: "Product Formulation", desc: "Select spice variety, active compound potency, and mesh fineness." },
            { step: "03", title: "Packaging Selection", desc: "Stand-up zipper pouches, glass jars, composite cans, or vacuum foil packs." },
            { step: "04", title: "Hygienic Filling", desc: "Steam sterilization, check-weighing, metal detection, and lot coding." },
            { step: "05", title: "Containerized Export", desc: "Sealed sea-freight container dispatch with phytosanitary clearance." }
          ].map((wf) => (
            <div key={wf.step} className="bg-[#030d0a] p-5 rounded-2xl border border-[#154736]/70 space-y-2">
              <span className="text-xs font-mono font-bold text-[#f2a900] bg-[#05140f] px-2.5 py-1 rounded border border-[#154736]">
                {wf.step}
              </span>
              <h3 className="text-sm font-bold font-serif text-[#fdfcf0] pt-1">
                {wf.title}
              </h3>
              <p className="text-[11px] text-[#a3b899] font-light leading-relaxed">
                {wf.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* EMBEDDED PACKAGING CUSTOMIZER TOOL */}
      <PackagingCustomizer onRequestQuote={() => onRequestQuote('Private Label Project')} />

      {/* CTA Box */}
      <div className="bg-[#05140f] p-8 sm:p-12 rounded-3xl border border-[#f2a900]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl text-center md:text-left">
        <div className="space-y-1.5">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#fdfcf0]">
            Ready to Launch or Expand Your Spice Brand?
          </h3>
          <p className="text-[#a3b899] text-sm font-light max-w-xl">
            Contact our private-label procurement team to discuss pouch samples, minimum print runs, and custom formulations.
          </p>
        </div>
        <button
          onClick={() => onRequestQuote('Private Label Consultation')}
          className="bg-gradient-to-r from-[#f2a900] to-[#d97706] hover:from-[#e09b00] hover:to-[#b45309] text-[#030d0a] font-bold px-7 py-3.5 rounded-xl text-sm shadow-xl whitespace-nowrap flex items-center gap-2"
        >
          <span>Discuss Private Label Project</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
