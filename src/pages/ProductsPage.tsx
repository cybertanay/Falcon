import React from 'react';
import { ProductGrid } from '../components/ProductGrid';
import { Product } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface ProductsPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onRequestQuote: (productName?: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ products, onSelectProduct, onRequestQuote }) => {
  return (
    <div className="bg-[#07170F] text-white py-12 px-4 sm:px-6 lg:px-8 space-y-12 font-sans max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-widest bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Export Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight">
          Premium Indian Spice Catalog
        </h1>
        <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed">
          Explore our range of authentic Indian spices available in bulk powders, whole seeds, dehydrated formats, and custom B2B specifications.
        </p>
      </div>

      {/* Product Grid Component */}
      <ProductGrid
        products={products}
        onSelectProduct={onSelectProduct}
        onRequestQuote={onRequestQuote}
      />

      {/* Quote Banner */}
      <div className="bg-[#0B2518] p-8 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <h3 className="text-xl font-bold font-serif text-white">
            Need a Custom Spice Blend or Specific Active Compound %?
          </h3>
          <p className="text-stone-300 text-sm font-light">
            We tailor Curcumin %, Scoville Heat Units (SHU), mesh size, and ASTA color parameters to buyer formulations.
          </p>
        </div>
        <button
          onClick={() => onRequestQuote()}
          className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-3 rounded-lg text-sm shadow whitespace-nowrap flex items-center gap-2"
        >
          <span>Request Custom Specification Quote</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
