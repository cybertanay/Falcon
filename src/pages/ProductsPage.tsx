import React from 'react';
import { ProductGrid } from '../components/ProductGrid';
import { Product } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface ProductsPageProps {
  products: Product[];
  onRequestQuote: (productName?: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ products, onRequestQuote }) => {
  return (
    <div className="bg-transparent text-[#fdfcf0] py-16 px-4 sm:px-6 lg:px-8 space-y-14 font-sans max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#f2a900] uppercase tracking-widest bg-[#05140f] px-3.5 py-1 rounded-full border border-[#f2a900]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>B2B EXPORT CATALOGUE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#fdfcf0] tracking-tight">
          Indian Agro-Commodity & Spice Range
        </h1>
        <p className="text-[#a3b899] text-sm sm:text-base font-light leading-relaxed">
          Wholesale spices direct from Indian cultivation centers. Available in bulk whole seeds, fine powders, steam-sterilized lots, and custom customer packaging.
        </p>
      </div>

      {/* Product Grid & Table Switcher */}
      <ProductGrid
        products={products}
        onRequestQuote={onRequestQuote}
      />

      {/* Custom Specification Banner */}
      <div className="bg-[#05140f] p-8 sm:p-10 rounded-2xl border border-[#f2a900]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1.5 text-left">
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#fdfcf0]">
            Need a Custom Active Compound Grade or Tailored Mesh Size?
          </h3>
          <p className="text-[#a3b899] text-sm font-light max-w-2xl">
            We tailor Curcumin %, Scoville Heat Units (SHU), volatile oil concentration, and ASTA color parameters to client specifications.
          </p>
        </div>
        <button
          onClick={() => onRequestQuote()}
          className="bg-gradient-to-r from-[#f2a900] to-[#d97706] hover:from-[#e09b00] hover:to-[#b45309] text-[#030d0a] font-bold px-7 py-3.5 rounded-xl text-sm shadow-lg whitespace-nowrap flex items-center gap-2"
        >
          <span>Request Custom Quotation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
