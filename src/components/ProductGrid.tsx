import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, LayoutGrid, List, SlidersHorizontal, ArrowRight, FileText } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onRequestQuote: (productName?: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onRequestQuote }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const categories = ['All', 'Powders', 'Whole Spices', 'Dehydrated Ingredients'];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.specifications?.botanicalName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.origin.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  return (
    <div className="space-y-8 font-sans">
      
      {/* Search and Category Filter Toolbar */}
      <div className="bg-[#05140f] p-4 sm:p-6 rounded-2xl border border-[#154736]/70 shadow-xl space-y-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#f2a900]" />
            <input
              type="text"
              placeholder="Search spices by commodity, botanical species, or origin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#030d0a] text-[#fdfcf0] pl-10 pr-4 py-2.5 rounded-xl border border-[#154736] focus:border-[#f2a900] focus:outline-none text-xs sm:text-sm placeholder-[#a3b899]/50"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-3 text-[#a3b899] hover:text-[#fdfcf0] text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <span className="text-xs text-[#a3b899] hidden sm:inline">View:</span>
            <div className="bg-[#030d0a] p-1 rounded-xl border border-[#154736] flex items-center gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-[#f2a900] text-[#030d0a] font-bold shadow' 
                    : 'text-[#a3b899] hover:text-[#fdfcf0]'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'table' 
                    ? 'bg-[#f2a900] text-[#030d0a] font-bold shadow' 
                    : 'text-[#a3b899] hover:text-[#fdfcf0]'
                }`}
                title="B2B Specification Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <SlidersHorizontal className="w-4 h-4 text-[#f2a900] shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#f2a900] text-[#030d0a] shadow-md shadow-amber-950/40'
                  : 'bg-[#030d0a] text-[#a3b899] hover:text-[#f2a900] border border-[#154736]/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Product Display Grid or B2B Table */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#05140f] p-12 rounded-2xl text-center border border-[#154736]/60 space-y-4">
          <p className="text-[#a3b899] text-base">
            No export commodities matched your filter query.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="bg-[#f2a900] hover:bg-[#d97706] text-[#030d0a] font-semibold px-5 py-2.5 rounded-lg text-xs shadow"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onRequestQuote={onRequestQuote}
            />
          ))}
        </div>
      ) : (
        /* B2B Table View */
        <div className="overflow-x-auto bg-[#05140f] rounded-2xl border border-[#154736]/60 shadow-xl">
          <table className="w-full text-left text-sm text-[#fdfcf0]">
            <thead className="bg-[#030d0a] text-[#f2a900] font-serif text-xs uppercase tracking-wider border-b border-[#154736]/80">
              <tr>
                <th className="py-4 px-5">Spice Commodity</th>
                <th className="py-4 px-5">Botanical Species</th>
                <th className="py-4 px-5">Origin</th>
                <th className="py-4 px-5">Active Spec</th>
                <th className="py-4 px-5">MOQ</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#154736]/40 font-sans">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[#0b2317]/50 transition-colors">
                  <td className="py-4 px-5 font-bold text-[#fdfcf0] flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0 border border-[#f2a900]/30"
                    />
                    <Link to={`/products/${product.slug}`} className="hover:text-[#f2a900] transition-colors">
                      {product.name}
                    </Link>
                  </td>
                  <td className="py-4 px-5 font-mono text-xs text-[#a3b899]">
                    {product.specifications?.botanicalName || 'Botanical Standard'}
                  </td>
                  <td className="py-4 px-5 text-xs text-[#a3b899]">
                    {product.origin}
                  </td>
                  <td className="py-4 px-5 text-xs text-[#f2a900] font-medium font-mono">
                    {product.specifications?.keyActiveComponent || product.form}
                  </td>
                  <td className="py-4 px-5 text-xs font-semibold text-[#f2a900]">
                    {product.minimumOrderQuantity}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/products/${product.slug}`}
                        className="text-xs bg-[#082018] hover:bg-[#0e3529] text-[#fdfcf0] px-3 py-1.5 rounded-lg border border-[#154736]"
                      >
                        Specs
                      </Link>
                      <button
                        onClick={() => onRequestQuote(product.name)}
                        className="text-xs bg-[#f2a900] hover:bg-[#d97706] text-[#030d0a] font-bold px-3 py-1.5 rounded-lg shadow"
                      >
                        Quote
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
