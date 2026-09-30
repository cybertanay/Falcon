import React, { useState } from 'react';
import { Phone, X, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { COMPANY_INFO } from '../data/company';
import { trackEvent } from '../lib/analytics';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultMessage = "Hello Falcon International Traders, I am interested in your spice products and would like to discuss a bulk order.";
  const cleanNumber = COMPANY_INFO.whatsapp.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      
      {/* Quick Popup Window */}
      {isOpen && (
        <div className="mb-3 w-80 bg-[#082018] border border-[#f2a900]/40 rounded-2xl shadow-2xl p-4 text-[#fdfcf0] animate-fade-in space-y-3">
          <div className="flex items-center justify-between border-b border-[#154736] pb-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#f2a900] animate-ping"></div>
              <span className="text-xs font-bold text-[#f2a900] uppercase tracking-wider">
                Export Desk Online
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#a3b899] hover:text-[#fdfcf0] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-[#05140f] p-3 rounded-lg border border-[#154736] text-xs text-[#a3b899] space-y-1">
            <span className="font-semibold text-[#f2a900] block">Falcon Export Support:</span>
            <p className="text-[#fdfcf0]/90 leading-relaxed font-light">
              "Welcome to Falcon International Traders! How can we assist with your bulk spice consignment or custom packaging requirements today?"
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', { placement: 'floating_widget' })}
            className="w-full bg-[#154736] hover:bg-[#1c5d47] text-[#fdfcf0] font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all border border-[#f2a900]/30"
          >
            <Phone className="w-4 h-4 text-[#f2a900]" />
            <span>Start WhatsApp Chat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <div className="text-[10px] text-[#a3b899] text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#f2a900]" />
            <span>Direct WhatsApp Number: {COMPANY_INFO.whatsapp}</span>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group bg-[#154736] hover:bg-[#1c5d47] text-[#fdfcf0] p-3.5 rounded-full shadow-2xl shadow-[#030d0a]/80 border border-[#f2a900]/40 flex items-center justify-center transition-all transform hover:scale-110 active:scale-95"
        title="Chat with Falcon International Traders on WhatsApp"
        aria-label="WhatsApp Contact"
      >
        <Phone className="w-6 h-6 text-[#f2a900]" />

        {/* Pulse Indicator */}
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#f2a900] border-2 border-[#082018] rounded-full"></span>
      </button>

    </div>
  );
};
