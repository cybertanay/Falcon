import React from 'react';
import { PackagingCustomizer } from '../components/PackagingCustomizer';
import { Tag, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface PrivateLabelPageProps {
  onRequestQuote: (productName?: string) => void;
}

export const PrivateLabelPage: React.FC<PrivateLabelPageProps> = ({ onRequestQuote }) => {
  return (
    <div className="bg-[#05140f] text-[#fdfcf0] py-12 px-4 sm:px-6 lg:px-8 space-y-16 font-sans max-w-7xl mx-auto">
      
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f2a900] uppercase tracking-widest bg-[#082018] px-3 py-1 rounded-full border border-[#f2a900]/30">
          <Tag className="w-3.5 h-3.5" />
          <span>OEM & Private Label Service</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#fdfcf0] tracking-tight">
          Build Your Spice Brand With Us
        </h1>
        <p className="text-[#a3b899] text-sm sm:text-base font-light leading-relaxed">
          Falcon International Traders supports international supermarkets, retail brands, and food manufacturers with end-to-end private-label spice packaging, custom blending, and OEM manufacturing.
        </p>
      </div>

      {/* VISUAL WORKFLOW */}
      <div className="bg-[#082018] p-8 rounded-2xl border border-[#154736] space-y-6 shadow-xl">
        <h2 className="text-2xl font-bold font-serif text-[#fdfcf0] text-center">
          Private Label Workflow
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-center">
          {[
            { step: "01", title: "Your Brand Concept", desc: "Logo, design artwork, & target retail market parameters" },
            { step: "02", title: "Product Selection", desc: "Choose spice variety, mesh size, & active compound grade" },
            { step: "03", title: "Packaging Design", desc: "Select stand-up pouches, tins, or jars with barcode printing" },
            { step: "04", title: "Quality & Sterilization", desc: "Micro-sterilization & certified lab testing per batch" },
            { step: "05", title: "Worldwide Export", desc: "Sealed container shipping & custom compliance documentation" }
          ].map((wf) => (
            <div key={wf.step} className="bg-[#05140f] p-4 rounded-xl border border-[#154736] space-y-2">
              <span className="text-xs font-mono font-bold text-[#f2a900] bg-[#082018] px-2 py-0.5 rounded border border-[#154736]">
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

      {/* EMBEDDED CUSTOMIZER TOOL */}
      <PackagingCustomizer onRequestQuote={() => onRequestQuote('Private Label Project')} />

      {/* CTA Box */}
      <div className="bg-[#082018] p-8 rounded-2xl border border-[#f2a900]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl text-center md:text-left">
        <div className="space-y-1">
          <h3 className="text-xl font-bold font-serif text-[#fdfcf0]">
            Ready to Launch Your Private Label Spice Line?
          </h3>
          <p className="text-[#a3b899] text-sm font-light">
            Contact our private-label design and procurement team to discuss pouch samples, minimum print runs, and custom formulations.
          </p>
        </div>
        <button
          onClick={() => onRequestQuote('Discuss Private Label Project')}
          className="bg-[#f2a900] hover:bg-[#d99700] text-[#05140f] font-bold px-6 py-3 rounded-lg text-sm shadow whitespace-nowrap flex items-center gap-2"
        >
          <span>Discuss Your Private Label Project</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
