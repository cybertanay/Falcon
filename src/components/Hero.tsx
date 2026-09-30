import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Globe, Phone, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { HeroScene } from './HeroScene';
import { AnimatedHeading } from './AnimatedHeading';
import { COMPANY_INFO } from '../data/company';

interface HeroProps {
  onRequestQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRequestQuote }) => {
  return (
    <section className="relative bg-[#030d0a] text-[#fdfcf0] overflow-hidden py-16 sm:py-24 lg:py-32 font-sans border-b border-[#154736]/60">
      
      {/* 1. Interactive WebGL Three.js Particle Atmosphere */}
      <HeroScene />

      {/* 2. Atmospheric Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-[#f2a900]/10 via-[#0b2317]/20 to-transparent blur-[120px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Small Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 bg-[#05140f]/90 border border-[#f2a900]/40 px-3.5 py-1.5 rounded-full text-xs font-mono text-[#f2a900] shadow-sm backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f2a900] animate-pulse" />
              <span>B2B INDIAN SPICES & AGRICULTURAL EXPORT</span>
            </div>

            {/* Kinetic Main Headline */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#fdfcf0] tracking-tight leading-[1.08]">
                INDIA'S INGREDIENTS. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f2a900] via-[#fbbf24] to-[#d97706]">
                  THE WORLD'S MARKETS.
                </span>
              </h1>
            </div>

            {/* Supporting Statement */}
            <p className="text-sm sm:text-base lg:text-lg text-[#a3b899] max-w-2xl leading-relaxed font-light">
              Supplying high-grade wholesale Indian spices, customized mesh powders, steam-sterilized lots, and export-compliant private labeling directly to international food manufacturers, importers, and distributors.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={onRequestQuote}
                className="bg-gradient-to-r from-[#f2a900] to-[#d97706] hover:from-[#e09b00] hover:to-[#b45309] text-[#030d0a] font-bold px-7 py-4 rounded-lg shadow-xl shadow-[#f2a900]/15 flex items-center justify-center gap-2 text-sm sm:text-base transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Request a Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/products"
                className="bg-[#05140f] hover:bg-[#0b2317] text-[#fdfcf0] border border-[#154736] font-semibold px-6 py-4 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base transition-all hover:border-[#f2a900]/40"
              >
                <span>Explore Products</span>
              </Link>

              <a
                href={COMPANY_INFO.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#05140f] hover:bg-[#0b2317] text-[#f2a900] border border-[#154736] font-medium px-4 py-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-all"
                title="Direct WhatsApp Export Enquiry"
              >
                <Phone className="w-4 h-4 text-[#f2a900]" />
                <span className="hidden sm:inline">WhatsApp Desk</span>
              </a>
            </div>

            {/* Trust Highlights Strip */}
            <div className="pt-6 border-t border-[#154736]/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#a3b899]">
              <div className="flex items-center gap-2 bg-[#05140f]/60 p-2.5 rounded-lg border border-[#154736]/40">
                <ShieldCheck className="w-4 h-4 text-[#f2a900] shrink-0" />
                <span>Micro-Sterilization</span>
              </div>
              <div className="flex items-center gap-2 bg-[#05140f]/60 p-2.5 rounded-lg border border-[#154736]/40">
                <Globe className="w-4 h-4 text-[#f2a900] shrink-0" />
                <span>Global Port Delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-[#05140f]/60 p-2.5 rounded-lg border border-[#154736]/40">
                <FileText className="w-4 h-4 text-[#f2a900] shrink-0" />
                <span>COA & Phytosanitary</span>
              </div>
            </div>

          </div>

          {/* Right Hero Card: Macro Spice Visual & Live Spec Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#f2a900]/30 shadow-2xl bg-[#05140f] group">
              
              {/* Macro Spice Visual Banner */}
              <img
                src="/src/assets/images/hero_spices_banner_1786195263727.jpg"
                alt="Falcon International Traders Premium Indian Spices"
                className="w-full h-80 sm:h-96 lg:h-[440px] object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Cinematic Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#030d0a] via-transparent to-transparent opacity-90" />

              {/* Floating Live Spec Tag */}
              <div className="absolute top-4 left-4 glass-panel px-3.5 py-1.5 rounded-lg text-xs font-mono text-[#f2a900] border border-[#f2a900]/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f2a900] animate-ping" />
                <span>EXPORT READY • 2026 CONSIGNMENTS</span>
              </div>

              {/* Bottom Card Content */}
              <div className="absolute bottom-4 left-4 right-4 p-4 glass-panel rounded-xl border border-[#154736] space-y-1 text-left">
                <span className="text-[11px] font-mono text-[#f2a900] uppercase tracking-wider block">
                  Commodity Standard
                </span>
                <h2 className="text-base font-serif font-bold text-[#fdfcf0]">
                  Pure Indian Origin Spices
                </h2>
                <p className="text-xs text-[#a3b899] font-light">
                  Direct farm procurement from Andhra Pradesh, Telangana, Gujarat & Kerala port hubs.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
