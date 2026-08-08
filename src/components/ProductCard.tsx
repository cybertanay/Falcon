import React from 'react';
import { ArrowRight, FileText, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onRequestQuote: (productName: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct, onRequestQuote }) => {
  return (
    <div className="bg-[#082018] rounded-xl border border-[#154736] hover:border-[#f2a900]/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#05140f]/50 flex flex-col h-full overflow-hidden group">
      
      {/* Product Image Header */}
      <div className="relative h-52 overflow-hidden bg-[#05140f]">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
        />
        
        {/* Category Pill */}
        <div className="absolute top-3 left-3 bg-[#05140f]/90 backdrop-blur-sm text-[#f2a900] text-xs font-semibold px-2.5 py-1 rounded-md border border-[#f2a900]/30">
          {product.category}
        </div>

        {/* MOQ Badge */}
        <div className="absolute bottom-3 right-3 bg-[#f2a900] text-[#05140f] text-xs font-bold px-2.5 py-1 rounded shadow">
          MOQ: {product.minimumOrderQuantity}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          
          {/* Product Name */}
          <h3 className="text-xl font-bold text-[#fdfcf0] font-serif tracking-tight group-hover:text-[#f2a900] transition-colors">
            {product.name}
          </h3>

          {/* Botanical Name & Origin */}
          <p className="text-xs text-[#a3b899] font-mono">
            {product.specifications.botanicalName} • Origin: {product.origin}
          </p>

          {/* Short Description */}
          <p className="text-[#a3b899]/90 text-sm leading-relaxed line-clamp-2 pt-1 font-light">
            {product.shortDescription}
          </p>
        </div>

        {/* Key Active Spec Highlight */}
        {product.specifications.keyActiveComponent && (
          <div className="bg-[#0d3126] p-2.5 rounded-lg border border-[#154736] text-xs text-[#f2a900] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#f2a900] shrink-0" />
            <span className="font-medium">{product.specifications.keyActiveComponent}</span>
          </div>
        )}

        {/* Packaging Formats */}
        <div className="space-y-1 pt-1">
          <span className="text-[11px] text-[#a3b899]/70 uppercase tracking-wider block font-semibold">
            Export Packaging
          </span>
          <p className="text-xs text-[#a3b899]">
            {product.packagingOptions.slice(0, 2).join(' • ')}
          </p>
        </div>

        {/* Card Action Buttons */}
        <div className="pt-3 border-t border-[#154736] flex items-center gap-2">
          <button
            onClick={() => onSelectProduct(product)}
            className="flex-1 bg-[#0d3126] hover:bg-[#154736] text-[#fdfcf0] border border-[#154736] hover:border-[#f2a900]/40 text-xs font-semibold py-2.5 px-3 rounded-md transition-all flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-[#f2a900]" />
            <span>Specifications</span>
          </button>

          <button
            onClick={() => onRequestQuote(product.name)}
            className="bg-[#f2a900] hover:bg-[#d99700] text-[#05140f] text-xs font-bold py-2.5 px-3 rounded-md transition-all flex items-center justify-center gap-1 shadow"
          >
            <span>Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
