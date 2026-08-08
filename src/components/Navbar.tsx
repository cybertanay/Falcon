import React, { useState, useEffect } from 'react';
import { Phone, Mail, Globe, Menu, X, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { COMPANY_INFO } from '../data/company';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onRequestQuote: (productName?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage, onRequestQuote }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'about', label: 'About Us' },
    { id: 'quality', label: 'Quality & Certifications' },
    { id: 'export', label: 'Export & Packaging' },
    { id: 'privatelabel', label: 'Private Label / OEM' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full font-sans">
      {/* Top B2B Information Bar */}
      <div className="bg-[#030d0a] text-[#a3b899] text-xs py-2 px-4 border-b border-[#154736]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 text-[#f2a900] font-medium">
              <Globe className="w-3.5 h-3.5 text-[#f2a900]" />
              Indian Spice Exporter | Global B2B Supply
            </span>
            <span className="hidden md:inline text-[#154736]">|</span>
            <a 
              href={`mailto:${COMPANY_INFO.email}`} 
              className="hidden md:flex items-center gap-1 text-[#a3b899] hover:text-[#f2a900] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#f2a900]" />
              {COMPANY_INFO.email}
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href={COMPANY_INFO.socials.whatsapp} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 bg-[#082018] hover:bg-[#0d3126] text-[#a3b899] hover:text-[#fdfcf0] px-2.5 py-0.5 rounded text-[11px] font-medium border border-[#154736] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#f2a900]" />
              <span>WhatsApp: {COMPANY_INFO.whatsapp}</span>
            </a>
            <button
              onClick={() => handleNavClick('admin')}
              className="flex items-center gap-1 text-[#a3b899]/70 hover:text-[#f2a900] text-[11px] transition-colors"
              title="Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className={`w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#05140f]/95 backdrop-blur-md shadow-2xl py-3 border-b border-[#154736]' 
          : 'bg-[#05140f] py-4 border-b border-[#154736]/70'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <button 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f2a900] via-[#d99700] to-[#b37a00] p-0.5 shadow-lg shadow-[#f2a900]/10 flex items-center justify-center">
              <div className="w-full h-full bg-[#05140f] rounded-[7px] flex items-center justify-center p-1.5">
                {/* Custom Falcon Emblem SVG */}
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#f2a900]" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-[#fdfcf0] block font-serif uppercase">
                Falcon <span className="text-[#f2a900] font-light">International</span>
              </span>
              <span className="text-[10px] tracking-widest text-[#a3b899] uppercase font-sans block -mt-1">
                TRADERS • SPICE EXPORTER
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activePage === item.id
                    ? 'text-[#f2a900] bg-[#082018] border border-[#f2a900]/30'
                    : 'text-[#fdfcf0]/80 hover:text-[#f2a900] hover:bg-[#082018]/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop Quote Button */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => onRequestQuote()}
              className="bg-[#f2a900] hover:bg-[#d99700] text-[#05140f] font-bold px-5 py-2.5 rounded-md text-sm shadow-md shadow-[#f2a900]/10 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Request a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => onRequestQuote()}
              className="bg-[#f2a900] text-[#05140f] font-bold px-3 py-1.5 rounded text-xs shadow"
            >
              Quote
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#fdfcf0] hover:text-[#f2a900] p-2 rounded-md bg-[#082018] border border-[#154736]"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#030d0a] border-b border-[#154736] px-4 pt-3 pb-6 space-y-2 mt-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-md text-base font-medium flex items-center justify-between ${
                  activePage === item.id
                    ? 'text-[#f2a900] bg-[#082018] border border-[#f2a900]/30'
                    : 'text-[#fdfcf0] hover:bg-[#082018]/50'
                }`}
              >
                <span>{item.label}</span>
                {activePage === item.id && <span className="w-2 h-2 rounded-full bg-[#f2a900]"></span>}
              </button>
            ))}

            <div className="pt-4 border-t border-[#154736] flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onRequestQuote();
                }}
                className="w-full bg-[#f2a900] hover:bg-[#d99700] text-[#05140f] font-bold py-3 rounded-md text-center shadow flex items-center justify-center gap-2"
              >
                <span>Request a Custom Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <a
                href={COMPANY_INFO.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#082018] hover:bg-[#0d3126] text-[#a3b899] py-2.5 rounded-md text-center text-sm font-medium border border-[#154736] flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#f2a900]" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
