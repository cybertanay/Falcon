import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onRequestQuote: (productName: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onRequestQuote }) => {
  return (
    <div className="bg-[#05140f] rounded-2xl border border-[#154736]/60 hover:border-[#f2a900]/50 transition-all duration-300 shadow-xl flex flex-col h-full overflow-hidden group hover:-translate-y-1">
      
      {/* Product Image Header with Link */}
      <Link to={`/products/${product.slug}`} className="relative h-56 overflow-hidden bg-[#030d0a] block">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
        />
        
        {/* Category Pill */}
        <div className="absolute top-3 left-3 bg-[#030d0a]/85 backdrop-blur-md text-[#f2a900] text-[11px] font-mono px-3 py-1 rounded-md border border-[#f2a900]/30">
          {product.category}
        </div>

        {/* MOQ Badge */}
        <div className="absolute bottom-3 right-3 bg-[#f2a900] text-[#030d0a] text-[11px] font-bold px-2.5 py-1 rounded shadow">
          MOQ: {product.minimumOrderQuantity}
        </div>
      </Link>

      {/* Body Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
        <div className="space-y-2">
          
          {/* Product Name */}
          <Link to={`/products/${product.slug}`} className="block">
            <h3 className="text-xl font-bold text-[#fdfcf0] font-serif tracking-tight group-hover:text-[#f2a900] transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Botanical Name & Origin */}
          <p className="text-xs text-[#a3b899] font-mono">
            {product.specifications?.botanicalName || 'Curcuma longa'} • Origin: {product.origin}
          </p>

          {/* Short Description */}
          <p className="text-[#a3b899] text-xs sm:text-sm leading-relaxed line-clamp-2 pt-1 font-light">
            {product.shortDescription}
          </p>
        </div>

        {/* Key Active Spec Highlight */}
        {product.specifications?.keyActiveComponent && (
          <div className="bg-[#0b2317] p-2.5 rounded-lg border border-[#154736]/70 text-xs text-[#f2a900] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#f2a900] shrink-0" />
            <span className="font-medium text-[11px] font-mono">{product.specifications.keyActiveComponent}</span>
          </div>
        )}

        {/* Card Action Buttons */}
        <div className="pt-3 border-t border-[#154736]/60 flex items-center gap-2">
          <Link
            to={`/products/${product.slug}`}
            className="flex-1 bg-[#082018] hover:bg-[#0e3529] text-[#fdfcf0] border border-[#154736] hover:border-[#f2a900]/40 text-xs font-semibold py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-[#f2a900]" />
            <span>Specifications</span>
          </Link>

          <button
            onClick={() => onRequestQuote(product.name)}
            className="bg-[#f2a900] hover:bg-[#d97706] text-[#030d0a] text-xs font-bold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-1 shadow"
          >
            <span>Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
