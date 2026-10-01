import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { TrustStrip } from '../components/TrustStrip';
import { ProductCard } from '../components/ProductCard';
import { AISpecAssistant } from '../components/AISpecAssistant';
import { PackagingCustomizer } from '../components/PackagingCustomizer';
import { AnimatedHeading } from '../components/AnimatedHeading';
import { Product } from '../types';
import { GLOBAL_DESTINATIONS, GENERAL_FAQS } from '../data/company';
import { ArrowRight, ShieldCheck, Globe, Package, CheckCircle2, ChevronDown, ChevronUp, Sparkles, Phone, HelpCircle, FileCheck, Layers } from 'lucide-react';

interface HomePageProps {
  products: Product[];
  onRequestQuote: (productName?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ products, onRequestQuote }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  return (
    <div className="space-y-20 lg:space-y-32 bg-transparent text-[#fdfcf0] font-sans pb-16">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <Hero onRequestQuote={() => onRequestQuote()} />

      {/* 2. STATUTORY TRUST STRIP */}
      <TrustStrip />

      {/* 3. EDITORIAL COMPANY STATEMENT: WE SOURCE. WE SPECIFY. WE EXPORT. */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-[#082018] border border-[#f2a900]/30 px-3.5 py-1 rounded-full text-xs font-mono text-[#f2a900]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FALCON OPERATING PHILOSOPHY</span>
        </div>

        <div className="max-w-4xl mx-auto">
          <AnimatedHeading as="h2" className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[#fdfcf0] justify-center leading-tight">
            WE SOURCE. WE SPECIFY. WE EXPORT.
          </AnimatedHeading>
          <p className="text-[#a3b899] text-base sm:text-lg lg:text-xl font-light leading-relaxed pt-4 max-w-3xl mx-auto">
            Direct origin procurement from India's primary spice hubs. Every consignment is tailored to buyer laboratory specifications, microbiological sterilization standards, and containerized logistics.
          </p>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS CATALOGUE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#154736]/60 pb-6">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#f2a900] tracking-widest uppercase block">
              Core Agro-Commodities
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#fdfcf0]">
              Export Product Range
            </h2>
            <p className="text-[#a3b899] text-sm max-w-xl font-light">
              Laboratory-tested Indian spice powders and whole seeds meeting European, North American, and Middle Eastern import regulations.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#f2a900] hover:text-[#fbbf24] transition-colors"
          >
            <span>View All Export Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onRequestQuote={onRequestQuote}
            />
          ))}
        </div>
      </section>

      {/* 5. AI SPECIFICATION & PACKAGING ASSISTANT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AISpecAssistant onRequestQuote={onRequestQuote} />
      </section>

      {/* 6. WHY INTERNATIONAL PROCUREMENT TEAMS CHOOSE FALCON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono text-[#f2a900] uppercase tracking-widest block">
            Procurement Confidence
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#fdfcf0]">
            Engineered for International B2B Trade
          </h2>
          <p className="text-[#a3b899] text-sm sm:text-base font-light">
            We operate exclusively as a B2B trading partner, aligning technical parameters, moisture limits, and export documentation directly with your compliance department.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: "Verified Quality Parameters",
              description: "Lot-wise laboratory testing for moisture, active volatile oils, curcumin, capsaicin, and Sudan dye clearance."
            },
            {
              icon: FileCheck,
              title: "Statutory Documentation",
              description: "Complete export paperwork: Bill of Lading, Phytosanitary Certificate, Certificate of Origin, and batch COA."
            },
            {
              icon: Layers,
              title: "Steam Sterilization",
              description: "Multi-stage hygienic steam sterilization to fulfill EU, US FDA, and Gulf microbiological parameters without radiation."
            },
            {
              icon: Package,
              title: "Custom B2B Packaging",
              description: "From 100g retail foil pouches to 25kg multi-wall paper sacks and 1,000kg jumbo containers with moisture barrier liners."
            },
            {
              icon: Globe,
              title: "Global Port Logistics",
              description: "Containerized sea freight (FCL/LCL) through Mumbai and Cochin ports to major destination discharge terminals."
            },
            {
              icon: CheckCircle2,
              title: "OEM & Private Label",
              description: "Full private-label branding with custom barcode, nutrition panels, and multi-lingual customer packaging artwork."
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-[#05140f]/80 backdrop-blur-md p-7 rounded-2xl border border-[#154736]/60 hover:border-[#f2a900]/40 transition-all space-y-3 group text-left">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-[#f2a900] group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-[#fdfcf0] tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[#a3b899] text-xs sm:text-sm font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. INTERACTIVE PACKAGING CUSTOMIZER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PackagingCustomizer onRequestQuote={() => onRequestQuote('Private Label OEM Packaging')} />
      </section>

      {/* 8. GLOBAL EXPORT DESTINATIONS & PORTS */}
      <section className="bg-[#05140f]/70 backdrop-blur-md border-y border-[#154736]/60 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono text-[#f2a900] uppercase tracking-widest block">
              International Sea Freight Logistics
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#fdfcf0]">
              Global Shipping & Destination Ports
            </h2>
            <p className="text-[#a3b899] text-sm font-light">
              Supplying bulk containerized spice consignments (FCL & LCL) through major Indian export hubs directly to international ports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GLOBAL_DESTINATIONS.map((dest) => (
              <div key={dest.region} className="bg-[#030d0a]/70 backdrop-blur-sm p-6 rounded-2xl border border-[#154736]/60 space-y-3 text-left">
                <div className="flex items-center justify-between border-b border-[#154736]/60 pb-3">
                  <span className="font-serif font-bold text-[#f2a900] text-base flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#f2a900]" />
                    {dest.region}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-amber-500/15 text-[#f2a900] px-2.5 py-1 rounded border border-amber-500/30">
                    {dest.code}
                  </span>
                </div>
                <p className="text-xs text-[#a3b899] leading-relaxed">
                  <span className="text-[#fdfcf0] font-medium">Major Discharge Ports:</span> {dest.ports}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. BUYER FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#f2a900] uppercase tracking-widest bg-[#05140f]/80 backdrop-blur-sm px-3.5 py-1 rounded-full border border-[#f2a900]/30">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Buyer Inquiries</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#fdfcf0]">
            Frequently Asked Export Questions
          </h2>
          <p className="text-[#a3b899] text-sm font-light">
            Answers regarding MOQ, custom packaging, express laboratory sample dispatch, and export documentation.
          </p>
        </div>

        <div className="space-y-3 text-left">
          {GENERAL_FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#05140f]/80 backdrop-blur-md rounded-xl border border-[#154736]/60 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-5 text-left font-serif font-semibold text-[#fdfcf0] text-base flex items-center justify-between hover:text-[#f2a900] transition-colors"
              >
                <span>{faq.question}</span>
                {openFaqIndex === idx ? (
                  <ChevronUp className="w-5 h-5 text-[#f2a900] shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#a3b899] shrink-0" />
                )}
              </button>
              {openFaqIndex === idx && (
                <div className="px-5 pb-5 text-sm text-[#a3b899] leading-relaxed font-light border-t border-[#154736]/40 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10. FINAL CONVERSION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#05140f]/90 via-[#0b2317]/90 to-[#05140f]/90 backdrop-blur-md p-8 sm:p-14 rounded-3xl border border-[#f2a900]/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#fdfcf0] tracking-tight">
              Ready to Import Indian Spices with Confidence?
            </h2>
            <p className="text-[#a3b899] text-sm sm:text-base font-light">
              Connect with our international export desk for tailored specification sheets, laboratory sample dispatches, and competitive container freight quotations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onRequestQuote()}
              className="bg-gradient-to-r from-[#f2a900] to-[#d97706] hover:from-[#e09b00] hover:to-[#b45309] text-[#030d0a] font-bold px-8 py-4 rounded-xl text-base shadow-xl transition-all flex items-center gap-2"
            >
              <span>Request Custom Quotation</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <Link
              to="/contact"
              className="bg-[#030d0a] hover:bg-[#082018] text-[#fdfcf0] border border-[#154736] font-semibold px-7 py-4 rounded-xl text-base transition-all"
            >
              <span>Contact Trade Desk</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
