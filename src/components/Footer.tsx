import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Globe, ShieldCheck, ArrowUpRight, Lock, Phone } from 'lucide-react';
import { COMPANY_INFO } from '../data/company';

interface FooterProps {
  onRequestQuote: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onRequestQuote }) => {
  return (
    <footer className="bg-[#030d0a] text-[#a3b899] font-sans border-t border-[#154736]/70 relative overflow-hidden">
      {/* Background Subtle Amber Glow */}
      <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-[#f2a900]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#154736]/60">
          
          {/* Col 1 & 2: Company Overview */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-md bg-gradient-to-br from-[#f2a900] to-[#b37a00] p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-[#030d0a] rounded-[5px] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#f2a900]" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-xl font-bold text-[#fdfcf0] font-serif tracking-tight block group-hover:text-[#f2a900] transition-colors">
                  Falcon <span className="text-[#f2a900] font-normal">International</span>
                </span>
                <span className="text-[10px] tracking-widest text-[#a3b899] uppercase font-mono block">
                  TRADERS
                </span>
              </div>
            </Link>

            <p className="text-[#a3b899] text-xs sm:text-sm leading-relaxed max-w-md font-light">
              {COMPANY_INFO.positioning}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#f2a900] font-medium bg-[#05140f] p-3 rounded-lg border border-[#154736]/70 max-w-md">
              <ShieldCheck className="w-4 h-4 text-[#f2a900] shrink-0" />
              <span>Direct Wholesale • Micro-sterilization • Statutory Phytosanitary COA</span>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-3">
            <h3 className="text-[#fdfcf0] font-serif font-semibold text-sm tracking-wide border-b border-[#154736]/60 pb-2">
              B2B Navigation
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#a3b899]">
              <li>
                <Link to="/" className="hover:text-[#f2a900] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#f2a900] transition-colors">
                  Product Catalogue
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#f2a900] transition-colors">
                  About Falcon
                </Link>
              </li>
              <li>
                <Link to="/quality" className="hover:text-[#f2a900] transition-colors">
                  Quality & Standards
                </Link>
              </li>
              <li>
                <Link to="/export" className="hover:text-[#f2a900] transition-colors">
                  Export Journey
                </Link>
              </li>
              <li>
                <Link to="/private-label" className="hover:text-[#f2a900] transition-colors">
                  Private Label OEM
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#f2a900] transition-colors">
                  Contact Trade Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Featured Commodities */}
          <div className="space-y-3">
            <h3 className="text-[#fdfcf0] font-serif font-semibold text-sm tracking-wide border-b border-[#154736]/60 pb-2">
              Export Spices
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#a3b899]">
              <li>
                <Link to="/products/turmeric-powder" className="hover:text-[#f2a900] transition-colors flex items-center justify-between">
                  <span>Turmeric Powder</span>
                  <ArrowUpRight className="w-3 h-3 text-[#154736]" />
                </Link>
              </li>
              <li>
                <Link to="/products/red-chilli-powder" className="hover:text-[#f2a900] transition-colors flex items-center justify-between">
                  <span>Red Chilli Powder</span>
                  <ArrowUpRight className="w-3 h-3 text-[#154736]" />
                </Link>
              </li>
              <li>
                <Link to="/products/cumin-seeds-powder" className="hover:text-[#f2a900] transition-colors flex items-center justify-between">
                  <span>Cumin Seeds & Powder</span>
                  <ArrowUpRight className="w-3 h-3 text-[#154736]" />
                </Link>
              </li>
              <li>
                <Link to="/products/dehydrated-garlic" className="hover:text-[#f2a900] transition-colors flex items-center justify-between">
                  <span>Dehydrated Garlic</span>
                  <ArrowUpRight className="w-3 h-3 text-[#154736]" />
                </Link>
              </li>
              <li>
                <Link to="/products/black-pepper" className="hover:text-[#f2a900] transition-colors flex items-center justify-between">
                  <span>Tellicherry Black Pepper</span>
                  <ArrowUpRight className="w-3 h-3 text-[#154736]" />
                </Link>
              </li>
              <li>
                <Link to="/products/green-cardamom" className="hover:text-[#f2a900] transition-colors flex items-center justify-between">
                  <span>Green Cardamom Pods</span>
                  <ArrowUpRight className="w-3 h-3 text-[#154736]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Trade Desk Contact */}
          <div className="space-y-3">
            <h3 className="text-[#fdfcf0] font-serif font-semibold text-sm tracking-wide border-b border-[#154736]/60 pb-2">
              Export Desk
            </h3>
            <div className="space-y-3 text-xs text-[#a3b899]">
              <p className="leading-relaxed">
                <span className="text-[#fdfcf0] font-medium block mb-1">Hub Location:</span>
                {COMPANY_INFO.address}
              </p>
              <p>
                <span className="text-[#fdfcf0] font-medium block mb-0.5">Commercial Inquiry:</span>
                <a href={`mailto:${COMPANY_INFO.email}`} className="text-[#f2a900] hover:underline">
                  {COMPANY_INFO.email}
                </a>
              </p>
              <div className="pt-2">
                <button
                  onClick={onRequestQuote}
                  className="w-full bg-[#0b2317] hover:bg-[#154736] text-[#f2a900] border border-[#f2a900]/40 font-semibold py-2 px-3 rounded-lg text-xs transition-colors"
                >
                  Request Official Quotation
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#a3b899]/70">
          <p>© {new Date().getFullYear()} Falcon International Traders. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#f2a900] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-[#f2a900] transition-colors">
              Terms & Conditions
            </Link>
            <a href="/sitemap.xml" className="hover:text-[#f2a900] transition-colors" target="_blank" rel="noopener noreferrer">
              Sitemap
            </a>
            <Link to="/admin/login" className="hover:text-[#f2a900] transition-colors flex items-center gap-1 opacity-60 hover:opacity-100">
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>

        {/* Editorial Subtext */}
        <div className="text-center pt-8 text-[11px] font-mono tracking-widest text-[#a3b899]/40 uppercase">
          FROM INDIA TO GLOBAL PORTS — QUALITY ASSURED BULK COMMODITIES
        </div>
      </div>
    </footer>
  );
};
