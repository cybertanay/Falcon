import React from 'react';
import { Link } from 'react-router-dom';
import { COMPANY_INFO } from '../data/company';
import { Globe, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, Layers, Compass, Target } from 'lucide-react';
import { AnimatedHeading } from '../components/AnimatedHeading';

interface AboutPageProps {
  onRequestQuote: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onRequestQuote }) => {
  return (
    <div className="bg-transparent text-[#fdfcf0] py-16 px-4 sm:px-6 lg:px-8 space-y-20 font-sans max-w-7xl mx-auto text-left">
      
      {/* Hero Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#f2a900] uppercase tracking-widest bg-[#05140f] px-3.5 py-1 rounded-full border border-[#f2a900]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ORIGIN & ETHOS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#fdfcf0] tracking-tight leading-tight">
          India’s Agro-Commodity Heritage, Delivered Globally
        </h1>
        <p className="text-[#a3b899] text-sm sm:text-base font-light leading-relaxed">
          Falcon International Traders operates as a dedicated international B2B export desk, bridging authentic Indian spice origins with food manufacturers and commercial importers worldwide.
        </p>
      </div>

      {/* Strategic Pillars (Editorial Layout - No Fake Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Compass,
            title: "Direct Regional Sourcing",
            description: "Procuring directly from verified agricultural mandis and grower networks across Andhra Pradesh, Telangana, Gujarat, and Cochin to ensure origin traceability and unadulterated botanical purity."
          },
          {
            icon: ShieldCheck,
            title: "Rigorous Technical Compliance",
            description: "Aligning moisture thresholds, ASTA color values, and active bioactive components (Curcumin, Capsaicin, Volatile Oils) with buyer specifications and destination-country food safety requirements."
          },
          {
            icon: Target,
            title: "Contractual & Shipping Integrity",
            description: "Ensuring containerized consignments (FCL/LCL) are handled with multi-stage hygienic steam sterilization, fumigation certification, and prompt surrender of statutory export documentation."
          }
        ].map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div key={idx} className="bg-[#05140f] p-8 rounded-2xl border border-[#154736]/70 hover:border-[#f2a900]/40 transition-all space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-[#f2a900]">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#fdfcf0]">
                {pillar.title}
              </h3>
              <p className="text-[#a3b899] text-xs sm:text-sm font-light leading-relaxed">
                {pillar.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Story & Operations Section */}
      <div className="bg-[#05140f] p-8 sm:p-12 rounded-3xl border border-[#154736]/70 space-y-8 shadow-2xl">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono text-[#f2a900] uppercase tracking-widest block">
            Operating Methodology
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#fdfcf0]">
            How We Partner With International Food Businesses
          </h2>
          <p className="text-[#a3b899] text-sm sm:text-base leading-relaxed font-light">
            In international agricultural trade, consistency of parameters between sample dispatch and container discharge is critical. Falcon International Traders focuses on rigorous batch sampling, physical impurity removal (destoning, magnetic grading), and moisture-barrier packaging.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-[#a3b899]">
          <div className="bg-[#030d0a] p-5 rounded-xl border border-[#154736]/60 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#f2a900] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#fdfcf0] block mb-1">Pre-Shipment COA Testing</span>
              <span>Every batch is tested against moisture limits, microbiological levels, and active component ranges with certified laboratory analytical certificates.</span>
            </div>
          </div>

          <div className="bg-[#030d0a] p-5 rounded-xl border border-[#154736]/60 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#f2a900] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#fdfcf0] block mb-1">Export Port Logistic Hubs</span>
              <span>Consolidating through Mumbai (Nhava Sheva / JNPT) and Cochin ports for efficient maritime routing to the Middle East, Europe, Africa, and the Americas.</span>
            </div>
          </div>

          <div className="bg-[#030d0a] p-5 rounded-xl border border-[#154736]/60 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#f2a900] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#fdfcf0] block mb-1">Private Label & Retail Packing</span>
              <span>Providing custom printed retail pouches, vacuum packs, and multi-wall Kraft paper bags with customer branding, barcode, and regulatory labeling.</span>
            </div>
          </div>

          <div className="bg-[#030d0a] p-5 rounded-xl border border-[#154736]/60 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#f2a900] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#fdfcf0] block mb-1">Zero False Claims Policy</span>
              <span>We provide only verified data, honest MOQ requirements, realistic container timelines, and complete statutory inspection documentation.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conversion Banner */}
      <div className="text-center bg-gradient-to-r from-[#05140f] via-[#0b2317] to-[#05140f] p-8 sm:p-12 rounded-3xl border border-[#f2a900]/30 space-y-6">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcf0]">
          Discuss Your Commodity Sourcing Needs
        </h3>
        <p className="text-[#a3b899] text-sm max-w-xl mx-auto font-light">
          Whether you require a standard 20ft container consignment or customized private-label specifications, our export desk is ready to assist.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onRequestQuote}
            className="bg-[#f2a900] hover:bg-[#d97706] text-[#030d0a] font-bold px-7 py-3.5 rounded-xl text-sm shadow-lg transition-all"
          >
            Request Quotation
          </button>
          <Link
            to="/products"
            className="bg-[#030d0a] text-[#fdfcf0] border border-[#154736] font-semibold px-6 py-3.5 rounded-xl text-sm hover:bg-[#082018] transition-all"
          >
            Explore Product Range
          </Link>
        </div>
      </div>

    </div>
  );
};
