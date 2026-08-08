import React from 'react';
import { ArrowRight, ShieldCheck, Globe, Phone, FileText, Sparkles } from 'lucide-react';
import { COMPANY_INFO } from '../data/company';

interface HeroProps {
  onRequestQuote: () => void;
  onExploreProducts: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRequestQuote, onExploreProducts }) => {
  return (
    <section className="relative bg-[#05140f] text-[#fdfcf0] overflow-hidden py-16 lg:py-24 font-sans">
      {/* Background Graphic Layers */}
      <div className="absolute inset-0 z-0 opacity-15 bg-[radial-gradient(#f2a900_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-[#082018] border border-[#f2a900]/40 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#f2a900] shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-[#f2a900]" />
              <span>Authentic Indian Spice Exporter • Direct B2B Wholesale</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-[#fdfcf0] tracking-tight leading-[1.12]">
              Premium Indian Spices, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f2a900] via-[#e69d00] to-[#c78800]">
                Exported to the World.
              </span>
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-base sm:text-lg text-[#a3b899] max-w-2xl leading-relaxed font-light">
              Quality-assured Indian spices supplied in bulk to importers, distributors, food manufacturers, retailers, and private-label brands worldwide.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onRequestQuote}
                className="bg-[#f2a900] hover:bg-[#d99700] text-[#05140f] font-bold px-7 py-3.5 rounded-md shadow-lg shadow-[#f2a900]/10 flex items-center justify-center gap-2 text-base transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Request a Quote</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onExploreProducts}
                className="bg-[#082018] hover:bg-[#0d3126] text-[#fdfcf0] border border-[#154736] font-semibold px-6 py-3.5 rounded-md flex items-center justify-center gap-2 text-base transition-all"
              >
                <span>Explore Products</span>
              </button>

              <a
                href={COMPANY_INFO.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#082018] hover:bg-[#0d3126] text-[#f2a900] border border-[#154736] font-medium px-4 py-3.5 rounded-md flex items-center justify-center gap-2 text-sm transition-all"
                title="Direct WhatsApp Export Enquiry"
              >
                <Phone className="w-4 h-4 text-[#f2a900]" />
                <span className="hidden xl:inline">WhatsApp</span>
              </a>
            </div>

            {/* Trust Highlights Strip */}
            <div className="pt-6 border-t border-[#154736] grid grid-cols-3 gap-4 text-xs text-[#a3b899]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#f2a900] shrink-0" />
                <span>Micro-Sterilized</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#f2a900] shrink-0" />
                <span>Global Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#f2a900] shrink-0" />
                <span>COA & Phytosanitary</span>
              </div>
            </div>

          </div>

          {/* Right Hero Image Card Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#f2a900]/30 shadow-2xl shadow-[#05140f] group">
              {/* Main Banner Image */}
              <img
                src="/src/assets/images/hero_spices_banner_1786195263727.jpg"
                alt="Falcon International Traders Premium Indian Spices"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 lg:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay Gradient for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#05140f] via-transparent to-transparent opacity-90"></div>

              {/* Overlay Floating B2B Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#082018]/95 backdrop-blur-md p-4 rounded-xl border border-[#f2a900]/30 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#f2a900] uppercase tracking-wider block">
                      Export Ready Consignments
                    </span>
                    <span className="text-sm font-bold text-[#fdfcf0] block">
                      Turmeric • Chilli • Cumin • Garlic Powder
                    </span>
                  </div>
                  <div className="bg-[#f2a900] text-[#05140f] text-xs font-bold px-2.5 py-1 rounded shadow">
                    B2B Wholesale
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Corner Flairs */}
            <div className="absolute -top-3 -right-3 w-16 h-16 border-t-2 border-r-2 border-[#f2a900] rounded-tr-xl pointer-events-none"></div>
            <div className="absolute -bottom-3 -left-3 w-16 h-16 border-b-2 border-l-2 border-[#f2a900] rounded-bl-xl pointer-events-none"></div>
          </div>

        </div>
      </div>
    </section>
  );
};
