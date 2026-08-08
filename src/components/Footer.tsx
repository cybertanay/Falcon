import React from 'react';
import { Mail, Phone, MapPin, Globe, ShieldCheck, ArrowUpRight, Lock } from 'lucide-react';
import { COMPANY_INFO, GLOBAL_DESTINATIONS } from '../data/company';

interface FooterProps {
  setActivePage: (page: string) => void;
  onRequestQuote: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage, onRequestQuote }) => {
  const handlePageClick = (pageId: string) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#030d0a] text-[#a3b899] font-sans border-t border-[#154736] relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-[#f2a900]/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#154736]">
          
          {/* Col 1 & 2: Company Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-gradient-to-br from-[#f2a900] to-[#b37a00] p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-[#05140f] rounded-[5px] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#f2a900]" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-xl font-bold text-[#fdfcf0] font-serif tracking-tight block">
                  Falcon <span className="text-[#f2a900] font-normal">International</span>
                </span>
                <span className="text-[10px] tracking-widest text-[#a3b899] uppercase block">
                  TRADERS
                </span>
              </div>
            </div>

            <p className="text-[#a3b899]/90 text-sm leading-relaxed max-w-md">
              {COMPANY_INFO.positioning}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#f2a900] font-medium bg-[#082018] p-3 rounded-lg border border-[#154736] inline-block">
              <ShieldCheck className="w-4 h-4 text-[#f2a900] shrink-0 inline mr-1" />
              <span>Direct Wholesale • Micro-sterilized • Phytosanitary Clearance</span>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h3 className="text-[#fdfcf0] font-serif font-semibold text-base tracking-wide border-b border-[#154736] pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-[#a3b899]">
              <li>
                <button onClick={() => handlePageClick('home')} className="hover:text-[#f2a900] transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick('products')} className="hover:text-[#f2a900] transition-colors">
                  Spice Products
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick('about')} className="hover:text-[#f2a900] transition-colors">
                  About Falcon
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick('quality')} className="hover:text-[#f2a900] transition-colors">
                  Quality & Certifications
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick('export')} className="hover:text-[#f2a900] transition-colors">
                  Export & Packaging
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick('privatelabel')} className="hover:text-[#f2a900] transition-colors">
                  Private Label & OEM
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick('contact')} className="hover:text-[#f2a900] transition-colors">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Major Spice Categories */}
          <div className="space-y-3">
            <h3 className="text-[#fdfcf0] font-serif font-semibold text-base tracking-wide border-b border-[#154736] pb-2">
              Export Range
            </h3>
            <ul className="space-y-2 text-sm text-[#a3b899]">
              <li className="flex items-center gap-1.5 hover:text-[#f2a900]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f2a900]"></span>
                <span>Turmeric Powder (2.5%-5.0% Curcumin)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#f2a900]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c41e3a]"></span>
                <span>Red Chilli (Teja S17 / Byadgi)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#f2a900]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e69d00]"></span>
                <span>Cumin Seeds & Powder</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#f2a900]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fdfcf0]"></span>
                <span>Dehydrated Garlic Powder</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#f2a900]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#154736]"></span>
                <span>Green Cardamom & Black Pepper</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Export Contact Details */}
          <div className="space-y-3">
            <h3 className="text-[#fdfcf0] font-serif font-semibold text-base tracking-wide border-b border-[#154736] pb-2">
              B2B Enquiries
            </h3>
            <div className="space-y-3 text-sm text-[#a3b899]">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#f2a900] shrink-0 mt-1" />
                <div>
                  <span className="text-xs text-[#a3b899]/70 block">Official Business Email</span>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="text-[#fdfcf0] hover:text-[#f2a900] text-xs font-mono">
                    {COMPANY_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#f2a900] shrink-0 mt-1" />
                <div>
                  <span className="text-xs text-[#a3b899]/70 block">WhatsApp / Export Desk</span>
                  <a href={COMPANY_INFO.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="text-[#fdfcf0] hover:text-[#f2a900] text-xs font-mono">
                    {COMPANY_INFO.whatsapp}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#f2a900] shrink-0 mt-1" />
                <div>
                  <span className="text-xs text-[#a3b899]/70 block">Export Operations</span>
                  <span className="text-xs text-[#fdfcf0]/80 block">
                    {COMPANY_INFO.address}
                  </span>
                </div>
              </div>

              <button
                onClick={onRequestQuote}
                className="w-full bg-[#f2a900]/10 hover:bg-[#f2a900]/20 text-[#f2a900] border border-[#f2a900]/30 font-medium text-xs py-2 px-3 rounded text-center transition-all flex items-center justify-center gap-1.5 mt-2"
              >
                <span>Request Custom Specification</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Global Markets Served Tag Strip */}
        <div className="py-6 border-b border-[#154736]">
          <span className="text-xs font-semibold text-[#f2a900] uppercase tracking-widest block mb-3">
            Global Trade Destinations We Serve
          </span>
          <div className="flex flex-wrap gap-2">
            {GLOBAL_DESTINATIONS.map((dest) => (
              <div key={dest.region} className="bg-[#082018] border border-[#154736] text-[#fdfcf0] text-xs py-1 px-2.5 rounded flex items-center gap-2">
                <Globe className="w-3 h-3 text-[#f2a900]" />
                <span className="font-medium text-[#f2a900]">{dest.region}:</span>
                <span className="text-[#a3b899] text-[11px]">{dest.ports}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright and Legal Section */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#a3b899]/70">
          <div>
            © 2026 Falcon International Traders. All rights reserved. Premium Indian Spice Exporter.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => handlePageClick('privacy')} className="hover:text-[#f2a900] transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => handlePageClick('terms')} className="hover:text-[#f2a900] transition-colors">
              Terms & Conditions
            </button>
            <button onClick={() => handlePageClick('admin')} className="hover:text-[#f2a900] transition-colors flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Admin Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
