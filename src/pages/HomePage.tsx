import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { TrustStrip } from '../components/TrustStrip';
import { ProductCard } from '../components/ProductCard';
import { AISpecAssistant } from '../components/AISpecAssistant';
import { PackagingCustomizer } from '../components/PackagingCustomizer';
import { Product } from '../types';
import { COMPANY_INFO, GLOBAL_DESTINATIONS, GENERAL_FAQS } from '../data/company';
import { ArrowRight, CheckCircle2, ShieldCheck, Globe, Package, Award, ChevronDown, ChevronUp, Sparkles, Phone, Mail, HelpCircle } from 'lucide-react';

interface HomePageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onRequestQuote: (productName?: string) => void;
  setActivePage: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ products, onSelectProduct, onRequestQuote, setActivePage }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  return (
    <div className="space-y-16 lg:space-y-24 bg-[#07170F] text-white font-sans">
      
      {/* 1. HERO SECTION */}
      <Hero
        onRequestQuote={() => onRequestQuote()}
        onExploreProducts={() => {
          setActivePage('products');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 2. TRUST STRIP */}
      <TrustStrip />

      {/* 3. FEATURED PRODUCTS RANGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-widest bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pure Indian Origin</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-white">
            Our Premium Spice Range
          </h2>
          <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed">
            Carefully sourced and processed Indian spices for global food businesses, importers, manufacturers, and private-label distributors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onRequestQuote={onRequestQuote}
            />
          ))}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => {
              setActivePage('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border border-amber-500/40 font-bold px-8 py-3.5 rounded-lg text-sm transition-all inline-flex items-center gap-2 shadow-lg hover:shadow-amber-900/20"
          >
            <span>View All Export Spice Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. AI SPECIFICATION & PACKAGING ASSISTANT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AISpecAssistant onRequestQuote={onRequestQuote} />
      </section>

      {/* 5. WHY CHOOSE FALCON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest block">
            Why Global Procurement Teams Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-tight">
            Why Global Buyers Choose Falcon
          </h2>
          <p className="text-stone-300 text-sm sm:text-base font-light">
            Built to serve international B2B importers with strict quality standards, micro-sterilization, custom packaging, and dependable container shipping schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: "Quality Focus",
              description: "Consistent quality, direct farm-sourcing, steam sterilization, zero Sudan dyes, and strict ASTA color & curcumin verification."
            },
            {
              icon: Globe,
              title: "Export-Ready Supply",
              description: "Products prepared for international bulk supply with complete Phytosanitary clearance, COA, and export documentation."
            },
            {
              icon: Package,
              title: "Flexible Packaging",
              description: "Packaging options designed around buyer requirements: 100g retail pouches, 25kg PP bags, 10kg vacuum packs, to 1000kg jumbo sacks."
            },
            {
              icon: Award,
              title: "OEM & Private Label",
              description: "Full support for food brands building their own custom private-label spice range with retail barcode and artwork printing."
            },
            {
              icon: Phone,
              title: "Reliable Communication",
              description: "Clear and transparent communication from initial sample request and specification negotiation to vessel departure and B/L surrender."
            },
            {
              icon: CheckCircle2,
              title: "Global Reach",
              description: "Regularly supplying buyers across Middle East, Europe, North America, Africa, and Asia-Pacific ports."
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-[#0B2317] p-6 rounded-xl border border-emerald-900/60 hover:border-amber-500/40 transition-all space-y-3 group">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-serif text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-stone-300 text-sm font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. INTERACTIVE PRIVATE LABEL & PACKAGING VISUALIZER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PackagingCustomizer onRequestQuote={() => onRequestQuote('Private Label OEM')} />
      </section>

      {/* 7. GLOBAL EXPORT DESTINATIONS & LOGISTICS */}
      <section className="bg-[#0B2518] border-y border-amber-900/40 py-16 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-10 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest block">
              International Container Logistics
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white">
              Global Export Capability & Destinations
            </h2>
            <p className="text-stone-300 text-sm font-light">
              Supplying bulk containerized spice consignments (FCL & LCL) through major Indian export hubs directly to international ports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GLOBAL_DESTINATIONS.map((dest) => (
              <div key={dest.region} className="bg-[#07170F] p-5 rounded-xl border border-emerald-900/60 space-y-2">
                <div className="flex items-center justify-between border-b border-emerald-900/80 pb-2">
                  <span className="font-bold font-serif text-amber-300 text-base flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-400" />
                    {dest.region}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                    {dest.code} PORTS
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed pt-1">
                  <span className="text-stone-400 font-medium">Major Discharge Ports:</span> {dest.ports}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-widest bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Buyer Guidance</span>
          </div>
          <h2 className="text-3xl font-bold font-serif text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-stone-300 text-sm font-light">
            Answers to common B2B export queries regarding MOQ, packaging, sample dispatch, and export documentation.
          </p>
        </div>

        <div className="space-y-3">
          {GENERAL_FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#0B2317] rounded-xl border border-emerald-900/60 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-5 text-left font-semibold text-white font-serif text-base flex items-center justify-between hover:text-amber-300 transition-colors"
              >
                <span>{faq.question}</span>
                {openFaqIndex === idx ? (
                  <ChevronUp className="w-5 h-5 text-amber-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />
                )}
              </button>
              {openFaqIndex === idx && (
                <div className="px-5 pb-5 text-sm text-stone-300 leading-relaxed font-light border-t border-emerald-950/80 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-[#0C2B1C] via-[#0D3823] to-[#0C2B1C] p-8 sm:p-12 rounded-2xl border border-amber-500/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
              Ready to Import Premium Indian Spices?
            </h2>
            <p className="text-stone-300 text-sm sm:text-base font-light">
              Contact our international trade team today for custom product specifications, sample express dispatch, and competitive bulk FOB/CIF pricing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onRequestQuote()}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold px-8 py-3.5 rounded-lg text-base shadow-lg transition-all flex items-center gap-2"
            >
              <span>Request Custom Quotation</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <a
              href={COMPANY_INFO.socials.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 font-semibold px-6 py-3.5 rounded-lg text-base transition-all flex items-center gap-2"
            >
              <Phone className="w-5 h-5 text-emerald-400" />
              <span>Instant WhatsApp Enquiry</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
