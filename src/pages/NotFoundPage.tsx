import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';

interface NotFoundPageProps {
  onGoHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onGoHome }) => {
  return (
    <div className="bg-[#05140f] text-[#fdfcf0] min-h-[70vh] flex items-center justify-center p-4 font-sans text-center">
      <div className="max-w-md space-y-6">
        <span className="text-6xl font-bold font-serif text-[#f2a900] block">404</span>
        <h1 className="text-2xl font-bold font-serif text-[#fdfcf0]">Page Not Found</h1>
        <p className="text-[#a3b899] text-sm font-light leading-relaxed">
          The export specification page or resource you are looking for does not exist or has been relocated.
        </p>
        <button
          onClick={onGoHome}
          className="bg-[#f2a900] hover:bg-[#d99700] text-[#05140f] font-bold px-6 py-3 rounded-lg text-xs shadow inline-flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>
      </div>
    </div>
  );
};
