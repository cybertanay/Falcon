import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Globe, Menu, X, ArrowRight, Lock, Phone } from 'lucide-react';
import { COMPANY_INFO } from '../data/company';
import { AnimatedTopDock, type DockItem } from '../shaders/animated-top-dock/AnimatedTopDock';

interface NavbarProps {
  onRequestQuote: (productName?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRequestQuote }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const activeId = (() => {
    const p = location.pathname;
    if (p === '/') return 'home';
    if (p.startsWith('/products')) return 'products';
    if (p.startsWith('/about')) return 'about';
    if (p.startsWith('/quality')) return 'quality';
    if (p.startsWith('/export')) return 'export';
    if (p.startsWith('/private-label')) return 'private-label';
    if (p.startsWith('/contact')) return 'contact';
    return 'home';
  })();

  const dockNavItems: readonly DockItem[] = [
    {
      id: 'home',
      label: 'HOME',
      to: '/',
      onClick: () => navigate('/'),
      icon: <path d="M2.5 7.5L8 3l5.5 4.5v5.5a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V7.5z" />
    },
    {
      id: 'products',
      label: 'PRODUCTS',
      to: '/products',
      onClick: () => navigate('/products'),
      icon: <><path d="M8 1.9 14.1 5v6L8 14.1 1.9 11V5z" /><path d="M1.9 5 8 8.1 14.1 5M8 8.1v6" /></>
    },
    {
      id: 'about',
      label: 'ABOUT',
      to: '/about',
      onClick: () => navigate('/about'),
      icon: <><circle cx="8" cy="8" r="5.8" /><path d="M8 5.5v3M8 10.5h.01" /></>
    },
    {
      id: 'quality',
      label: 'QUALITY',
      to: '/quality',
      onClick: () => navigate('/quality'),
      icon: <path d="M8 1.8l1.9 4 4.3.6-3.1 3 .7 4.3L8 11.6l-3.8 2.1.7-4.3-3.1-3 4.3-.6z" />
    },
    {
      id: 'export',
      label: 'EXPORT',
      to: '/export',
      onClick: () => navigate('/export'),
      icon: <><circle cx="8" cy="8" r="5.9" /><path d="M2.2 8h11.6M8 2.1c1.5 1.8 2.3 3.8 2.3 5.9s-.8 4.1-2.3 5.9c-1.5-1.8-2.3-3.8-2.3-5.9s.8-4.1 2.3-5.9" /></>
    },
    {
      id: 'private-label',
      label: 'PRIVATE LABEL',
      to: '/private-label',
      onClick: () => navigate('/private-label'),
      icon: <><path d="M3.4 2.4h5.4l3.8 3.8v7.4H3.4z" /><path d="M8.8 2.4v3.8h3.8M5.9 9h4.2M5.9 11.2h3" /></>
    },
    {
      id: 'contact',
      label: 'CONTACT',
      to: '/contact',
      onClick: () => navigate('/contact'),
      icon: <><path d="M2.5 4h11a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" /><path d="M2.5 5l5.5 3.5L13.5 5" /></>
    },
  ];

  const FalconBrandMark = (
    <div className="w-full h-full bg-[#030d0a] rounded flex items-center justify-center p-0.5">
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-[#f2a900]" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    </div>
  );

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

      {/* Desktop Dynamic ThreeUI AnimatedTopDock (variant="modern") */}
      <div className={`hidden lg:block w-full navbar-dock transition-all duration-300 ${
        isScrolled ? 'glass-navbar py-2 shadow-2xl' : 'bg-[#05140f]/95 py-3 border-b border-[#154736]/50'
      }`}>
        <AnimatedTopDock
          variant="modern"
          proximity={122}
          spring={0.19}
          damping={0.70}
          widthGrowth={17}
          heightGrowth={16}
          drop={3.5}
          customItems={dockNavItems}
          activeId={activeId}
          brandWord="FALCON"
          brandMark={FalconBrandMark}
          brandHref="/"
          onBrandClick={() => navigate('/')}
          actionGhost={{
            label: "Staff Portal",
            onClick: () => navigate('/admin/login')
          }}
          actionCta={{
            label: "Request Quote",
            onClick: () => onRequestQuote()
          }}
          hideStage={true}
        />
      </div>

      {/* Mobile Glassmorphic Navigation Bar */}
      <nav className={`lg:hidden w-full transition-all duration-300 ${
        isScrolled 
          ? 'glass-navbar py-3 shadow-2xl' 
          : 'bg-[#05140f]/90 backdrop-blur-md py-4 border-b border-[#154736]/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group text-left">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#f2a900] via-[#d97706] to-[#b45309] p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#030d0a] rounded-[7px] flex items-center justify-center p-1.5">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-[#f2a900]" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-[#fdfcf0] block leading-tight">
                FALCON
              </span>
              <span className="text-[9px] tracking-widest uppercase text-[#f2a900] font-mono block">
                International Traders
              </span>
            </div>
          </Link>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRequestQuote()}
              className="bg-gradient-to-r from-[#f2a900] to-[#d97706] text-[#030d0a] font-bold px-3.5 py-1.5 rounded-lg text-xs shadow transition-all"
            >
              <span>Quote</span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#a3b899] hover:text-[#fdfcf0] bg-[#0b2317] rounded-lg border border-[#154736]"
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
