import React from 'react';
import { COMPANY_INFO } from '../data/company';
import { Globe, Award, ShieldCheck, ArrowRight, Building, Sparkles } from 'lucide-react';

interface AboutPageProps {
  onRequestQuote: () => void;
  setActivePage: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onRequestQuote, setActivePage }) => {
  return (
    <div className="bg-[#05140f] text-[#fdfcf0] py-12 px-4 sm:px-6 lg:px-8 space-y-16 font-sans max-w-7xl mx-auto">
      
      {/* Hero Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f2a900] uppercase tracking-widest bg-[#082018] px-3 py-1 rounded-full border border-[#f2a900]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Origin & Ethos</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#fdfcf0] tracking-tight leading-tight">
          From India’s Spice Heritage to Global Markets
        </h1>
        <p className="text-[#a3b899] text-sm sm:text-base font-light leading-relaxed">
          Falcon International Traders connects India's rich centuries-old spice-growing heritage with international buyers seeking dependable, quality-focused B2B suppliers.
        </p>
      </div>

      {/* Editable Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          {
            value: COMPANY_INFO.metrics.yearsExperience,
            label: "Years of Experience",
            sub: "Direct Industry Expertise"
          },
          {
            value: COMPANY_INFO.metrics.countriesServed,
            label: "Countries Served",
            sub: "Global Supply Reach"
          },
          {
            value: COMPANY_INFO.metrics.monthlyCapacity,
            label: "Monthly Supply Capacity",
            sub: "Bulk FCL / LCL Output"
          },
          {
            value: COMPANY_INFO.metrics.qualityCertifications,
            label: "Quality Certifications",
            sub: "APEDA, Spices Board, ISO"
          }
        ].map((m, idx) => (
          <div key={idx} className="bg-[#082018] p-6 rounded-2xl border border-[#154736] text-center space-y-1 hover:border-[#f2a900]/40 transition-all shadow-lg">
            <span className="text-3xl sm:text-4xl font-bold font-serif text-[#f2a900] block tracking-tight">
              {m.value}
            </span>
            <span className="text-sm font-semibold text-[#fdfcf0] block">
              {m.label}
            </span>
            <span className="text-xs text-[#a3b899] block font-light">
              {m.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Main Narrative Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-5">
          <span className="text-xs font-semibold text-[#f2a900] uppercase tracking-widest block">
            Our Sourcing Philosophy
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#fdfcf0]">
            Uncompromising Quality at Every Export Stage
          </h2>
          <p className="text-[#a3b899] text-sm leading-relaxed font-light">
            Founded with a vision to streamline authentic Indian agricultural exports, Falcon International Traders acts as a trusted procurement partner for international importers, spice re-packers, sauce manufacturers, and retail chain brands across the Middle East, Europe, North America, and Asia.
          </p>
          <p className="text-[#a3b899] text-sm leading-relaxed font-light">
            We work directly with certified farming co-operatives in premier spice belts—including Guntur for red chillies, Erode and Nizamabad for high-curcumin turmeric, Gujarat for bold cumin seeds, and Malabar Coast for black pepper—ensuring direct origin traceability and fresh harvests.
          </p>

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#a3b899]">
            <div className="bg-[#082018] p-3 rounded-lg border border-[#154736] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#f2a900] shrink-0" />
              <span className="text-[#fdfcf0]">Micro-sterilized & ASTA Tested</span>
            </div>
            <div className="bg-[#082018] p-3 rounded-lg border border-[#154736] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#f2a900] shrink-0" />
              <span className="text-[#fdfcf0]">Full Export Phytosanitary Clearance</span>
            </div>
          </div>
        </div>

        {/* Story Visual Frame */}
        <div className="lg:col-span-5 relative">
          <div className="rounded-2xl overflow-hidden border border-[#f2a900]/30 shadow-2xl bg-[#082018]">
            <img
              src="/src/assets/images/hero_spices_banner_1786195263727.jpg"
              alt="Indian Spice Heritage"
              referrerPolicy="no-referrer"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-[#082018] p-8 rounded-2xl border border-[#f2a900]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl text-center md:text-left">
        <div className="space-y-1">
          <h3 className="text-xl font-bold font-serif text-[#fdfcf0]">
            Partner With Falcon International Traders
          </h3>
          <p className="text-[#a3b899] text-sm font-light">
            Discuss your upcoming spice procurement schedule or request initial lab samples.
          </p>
        </div>
        <button
          onClick={onRequestQuote}
          className="bg-[#f2a900] hover:bg-[#d99700] text-[#05140f] font-bold px-6 py-3 rounded-lg text-sm shadow whitespace-nowrap flex items-center gap-2"
        >
          <span>Request Quote & Samples</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
