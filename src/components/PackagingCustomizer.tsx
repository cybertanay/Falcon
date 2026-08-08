import React, { useState } from 'react';
import { Tag, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface PackagingCustomizerProps {
  onRequestQuote: () => void;
}

export const PackagingCustomizer: React.FC<PackagingCustomizerProps> = ({ onRequestQuote }) => {
  const [brandName, setBrandName] = useState('YOUR BRAND NAME');
  const [spiceName, setSpiceName] = useState('ORGANIC TURMERIC POWDER');
  const [format, setFormat] = useState<'pouch' | 'bag' | 'jute'>('pouch');
  const [netWeight, setNetWeight] = useState('500g e');
  const [bgColor, setBgColor] = useState('bg-stone-900');

  return (
    <div className="bg-[#082018] rounded-2xl border border-[#f2a900]/30 p-6 sm:p-8 shadow-2xl font-sans space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#154736] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f2a900] uppercase tracking-widest bg-[#05140f] px-2.5 py-1 rounded border border-[#f2a900]/30">
            <Tag className="w-3.5 h-3.5" />
            <span>Interactive OEM & Private Label Visualizer</span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-[#fdfcf0] tracking-tight mt-2">
            Build Your Own Spice Brand With Falcon
          </h2>
        </div>

        <button
          onClick={onRequestQuote}
          className="bg-[#f2a900] hover:bg-[#d99700] text-[#05140f] font-bold px-5 py-2.5 rounded-lg text-sm shadow flex items-center justify-center gap-2 transition-all"
        >
          <span>Discuss Private Label Project</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-4">
          <p className="text-[#a3b899] text-sm font-light leading-relaxed">
            Falcon International Traders offers end-to-end private labeling. Test how your logo, brand typography, net weight, and packaging layout look on retail stand-up pouches, zipper bags, and bulk export sacks.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#f2a900] mb-1">
                Your Brand / Company Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value.toUpperCase())}
                placeholder="ENTER YOUR BRAND"
                className="w-full bg-[#05140f] text-[#f2a900] font-bold px-3.5 py-2 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm tracking-wider"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#f2a900] mb-1">
                Spice Name & Variant
              </label>
              <input
                type="text"
                value={spiceName}
                onChange={(e) => setSpiceName(e.target.value.toUpperCase())}
                placeholder="SPICE NAME"
                className="w-full bg-[#05140f] text-[#fdfcf0] px-3.5 py-2 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#f2a900] mb-1">
                  Packaging Format
                </label>
                <select
                  value={format}
                  onChange={(e: any) => setFormat(e.target.value)}
                  className="w-full bg-[#05140f] text-[#fdfcf0] px-3 py-2 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-xs"
                >
                  <option value="pouch">Retail Stand-up Pouch (100g-1kg)</option>
                  <option value="bag">Bulk Kraft Bag (5kg-25kg)</option>
                  <option value="jute">Export Jute Sack (25kg-50kg)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#f2a900] mb-1">
                  Net Weight Label
                </label>
                <input
                  type="text"
                  value={netWeight}
                  onChange={(e) => setNetWeight(e.target.value)}
                  placeholder="e.g. 500g / 25 kg"
                  className="w-full bg-[#05140f] text-[#fdfcf0] px-3 py-2 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#f2a900] mb-1">
                Pouch Background Style
              </label>
              <div className="flex items-center gap-2">
                {[
                  { name: 'Matte Obsidian', class: 'bg-stone-900 border-stone-700' },
                  { name: 'Earthy Green', class: 'bg-[#082018] border-[#154736]' },
                  { name: 'Warm Kraft', class: 'bg-[#2a1a08] border-[#8a5314]' },
                  { name: 'Pure White', class: 'bg-stone-100 border-stone-300' }
                ].map((col) => (
                  <button
                    key={col.name}
                    onClick={() => setBgColor(col.class)}
                    className={`px-3 py-1.5 rounded-md text-xs border font-medium transition-all ${
                      bgColor === col.class ? 'ring-2 ring-[#f2a900] text-[#f2a900]' : 'text-[#a3b899] hover:text-[#fdfcf0]'
                    }`}
                  >
                    {col.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 text-xs text-[#a3b899] space-y-1">
            <div className="flex items-center gap-1.5 text-[#f2a900]">
              <Check className="w-4 h-4 text-[#f2a900]" />
              <span>Full Custom Printing • Barcode & Nutrition Labeling • Zip Locks</span>
            </div>
          </div>
        </div>

        {/* Visual Mockup Column */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-64 sm:w-72 h-96 rounded-2xl p-6 flex flex-col justify-between items-center shadow-2xl border-2 border-[#f2a900]/40 overflow-hidden transition-all duration-300 transform hover:rotate-1">
            
            {/* Background Texture simulation */}
            <div className={`absolute inset-0 ${bgColor} opacity-95`}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/30 pointer-events-none"></div>

            {/* Pouch Seal Top */}
            <div className="relative z-10 w-full border-b border-dashed border-[#f2a900]/40 pb-2 text-center">
              <span className="text-[9px] font-mono tracking-widest uppercase text-[#f2a900]">
                ★ HERMETICALLY SEALED ZIPPER ★
              </span>
            </div>

            {/* Brand Logo Header */}
            <div className="relative z-10 text-center my-auto space-y-2">
              <span className="text-xs tracking-widest font-bold text-[#f2a900] uppercase block font-mono border-b border-[#f2a900]/30 pb-1">
                {brandName || 'YOUR BRAND'}
              </span>

              <h4 className="text-base font-extrabold font-serif tracking-tight text-[#fdfcf0] uppercase leading-snug">
                {spiceName || 'PURE SPICE'}
              </h4>

              <div className="w-12 h-12 mx-auto rounded-full bg-[#f2a900]/20 border border-[#f2a900]/40 flex items-center justify-center p-2 my-2">
                <Sparkles className="w-6 h-6 text-[#f2a900]" />
              </div>

              <span className="text-[10px] text-[#a3b899] block tracking-wider font-light">
                100% PURE INDIAN SPICE • EXPORT GRADE
              </span>
            </div>

            {/* Footer Weight & Certification Badge */}
            <div className="relative z-10 w-full pt-3 border-t border-[#f2a900]/30 flex items-center justify-between text-[#a3b899] text-[10px]">
              <span className="font-mono text-[#f2a900] font-bold">{netWeight}</span>
              <span className="bg-[#f2a900]/20 text-[#f2a900] px-1.5 py-0.5 rounded text-[9px] font-bold border border-[#f2a900]/30">
                ISO & HACCP
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
