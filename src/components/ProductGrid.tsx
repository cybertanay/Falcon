import React, { useState, useMemo } from 'react';
import { Search, LayoutGrid, List, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onRequestQuote: (productName?: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onSelectProduct, onRequestQuote }) => {
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
        product.specifications.botanicalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.origin.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  return (
    <div className="space-y-8 font-sans">
      
      {/* Search and Category Filter Toolbar */}
      <div className="bg-[#0B2317] p-4 sm:p-6 rounded-xl border border-emerald-900/60 shadow-lg space-y-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-amber-400" />
            <input
              type="text"
              placeholder="Search spices by name, botanical species, or origin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#07170F] text-white pl-11 pr-4 py-2.5 rounded-lg border border-emerald-800/60 focus:border-amber-400 focus:outline-none text-sm placeholder-stone-500"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-3 text-stone-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <span className="text-xs text-stone-400 hidden sm:inline">View Mode:</span>
            <div className="bg-[#07170F] p-1 rounded-lg border border-emerald-800/60 flex items-center gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded text-xs font-medium transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-amber-500 text-stone-950 font-bold shadow' 
                    : 'text-stone-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded text-xs font-medium transition-all ${
                  viewMode === 'table' 
                    ? 'bg-amber-500 text-stone-950 font-bold shadow' 
                    : 'text-stone-400 hover:text-white'
                }`}
                title="B2B Specification Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar">
          <SlidersHorizontal className="w-4 h-4 text-amber-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/40'
                  : 'bg-[#07170F] text-stone-300 hover:text-amber-300 border border-emerald-800/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Product Display Grid or B2B Table */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#0A2015] p-12 rounded-xl text-center border border-emerald-900/60 space-y-4">
          <p className="text-stone-400 text-base">
            No spice products matched your filter search query.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold px-4 py-2 rounded text-xs"
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
              onSelectProduct={onSelectProduct}
              onRequestQuote={onRequestQuote}
            />
          ))}
        </div>
      ) : (
        /* B2B Table View */
        <div className="overflow-x-auto bg-[#0B2317] rounded-xl border border-emerald-900/60 shadow-lg">
          <table className="w-full text-left text-sm text-stone-300">
            <thead className="bg-[#07170F] text-amber-400 font-serif text-xs uppercase tracking-wider border-b border-emerald-900/80">
              <tr>
                <th className="py-3.5 px-4">Spice Product</th>
                <th className="py-3.5 px-4">Botanical Name</th>
                <th className="py-3.5 px-4">Origin</th>
                <th className="py-3.5 px-4">Key Specification</th>
                <th className="py-3.5 px-4">MOQ</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/40 font-sans">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-emerald-950/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded object-cover shrink-0 border border-amber-500/30"
                    />
                    <span>{product.name}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-amber-200/80">
                    {product.specifications.botanicalName}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-stone-300">
                    {product.origin}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-amber-300 font-medium">
                    {product.specifications.keyActiveComponent || product.form}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-amber-400">
                    {product.minimumOrderQuantity}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="text-xs bg-emerald-900/60 hover:bg-emerald-800 text-stone-200 px-3 py-1.5 rounded border border-emerald-700/50"
                      >
                        Specs
                      </button>
                      <button
                        onClick={() => onRequestQuote(product.name)}
                        className="text-xs bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3 py-1.5 rounded shadow"
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
