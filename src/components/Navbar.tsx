import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Mail, Globe, Menu, X, ArrowRight, Lock, Phone } from 'lucide-react';
import { COMPANY_INFO } from '../data/company';

interface NavbarProps {
  onRequestQuote: (productName?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRequestQuote }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/about', label: 'About' },
    { to: '/quality', label: 'Quality' },
    { to: '/export', label: 'Export' },
    { to: '/private-label', label: 'Private Label' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full font-sans">
      {/* Top International Trade Bar */}
      <div className="bg-[#030d0a] text-[#a3b899] text-[11px] py-1.5 px-4 border-b border-[#154736]/60">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[#f2a900] font-medium tracking-wide">
              <Globe className="w-3 h-3 text-[#f2a900]" />
              <span className="hidden sm:inline">Falcon International Traders —</span> Indian Agro-Commodities Export Desk
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <a 
              href={`mailto:${COMPANY_INFO.email}`} 
              className="hidden md:flex items-center gap-1 text-[#a3b899] hover:text-[#f2a900] transition-colors"
            >
              <Mail className="w-3 h-3 text-[#f2a900]" />
              <span>{COMPANY_INFO.email}</span>
            </a>
            <a 
              href={COMPANY_INFO.socials.whatsapp} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1 bg-[#082018] hover:bg-[#0e3529] text-[#fdfcf0] px-2 py-0.5 rounded text-[11px] font-medium border border-[#154736] transition-colors"
            >
              <Phone className="w-2.5 h-2.5 text-[#f2a900]" />
              <span>WhatsApp Trade Desk</span>
            </a>
            <Link
              to="/admin/login"
              className="text-[#a3b899]/50 hover:text-[#f2a900] text-[11px] transition-colors flex items-center gap-1"
              title="Staff Portal Login"
            >
              <Lock className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">Staff</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Navigation */}
      <nav className={`w-full transition-all duration-300 ${
        isScrolled 
          ? 'glass-navbar py-3 shadow-2xl' 
          : 'bg-[#05140f]/90 backdrop-blur-md py-4 border-b border-[#154736]/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group text-left">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f2a900] via-[#d97706] to-[#b45309] p-0.5 shadow-md flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#030d0a] rounded-[7px] flex items-center justify-center p-1.5">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#f2a900]" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#fdfcf0] block leading-tight group-hover:text-[#f2a900] transition-colors">
                FALCON
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#f2a900] font-mono block">
                International Traders
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-xs xl:text-sm font-medium transition-all relative ${
                    isActive
                      ? 'text-[#f2a900] bg-amber-500/10'
                      : 'text-[#a3b899] hover:text-[#fdfcf0] hover:bg-[#0b2317]/50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onRequestQuote()}
              className="bg-gradient-to-r from-[#f2a900] to-[#d97706] hover:from-[#e09b00] hover:to-[#b45309] text-[#030d0a] font-bold px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Request Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#a3b899] hover:text-[#fdfcf0] bg-[#0b2317] rounded-lg border border-[#154736]"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[88px] bottom-0 bg-[#030d0a]/98 backdrop-blur-xl border-b border-[#154736] p-6 z-40 overflow-y-auto animate-fade-in flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-[#f2a900] font-mono block">
              Navigation
            </span>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `block p-3 rounded-xl text-base font-serif transition-colors ${
                    isActive
                      ? 'bg-amber-500/10 text-[#f2a900] border border-amber-500/30'
                      : 'text-[#fdfcf0] hover:bg-[#0b2317]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="pt-6 border-t border-[#154736]/60 space-y-4">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onRequestQuote();
              }}
              className="w-full bg-gradient-to-r from-[#f2a900] to-[#d97706] text-[#030d0a] font-bold py-3 rounded-lg text-sm text-center shadow-lg"
            >
              Request a B2B Quote
            </button>
            <div className="text-center text-xs text-[#a3b899]">
              Export Desk: <a href={`mailto:${COMPANY_INFO.email}`} className="text-[#f2a900]">{COMPANY_INFO.email}</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
