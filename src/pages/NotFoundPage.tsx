import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="bg-[#030d0a] text-[#fdfcf0] min-h-[70vh] flex items-center justify-center p-4 font-sans text-center">
      <div className="max-w-md space-y-6 bg-[#05140f] p-8 sm:p-12 rounded-3xl border border-[#154736] shadow-2xl">
        <span className="text-6xl sm:text-7xl font-bold font-serif text-[#f2a900] block tracking-tight">404</span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#fdfcf0]">Page Not Found</h1>
        <p className="text-[#a3b899] text-sm font-light leading-relaxed">
          The requested export specification page or resource does not exist or has been relocated within our catalogue.
        </p>
        <Link
          to="/"
          className="bg-gradient-to-r from-[#f2a900] to-[#d97706] hover:from-[#e09b00] hover:to-[#b45309] text-[#030d0a] font-bold px-7 py-3.5 rounded-xl text-xs shadow-lg inline-flex items-center gap-2 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
};
