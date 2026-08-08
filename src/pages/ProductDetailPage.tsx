import React, { useState } from 'react';
import { ArrowLeft, FileText, Send, CheckCircle2, ShieldCheck, Printer, Download, ChevronRight, HelpCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onRequestQuote: (productName: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onBack, onRequestQuote }) => {
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [showPrintView, setShowPrintView] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#07170F] text-white py-10 px-4 sm:px-6 lg:px-8 space-y-12 font-sans max-w-7xl mx-auto">
      
      {/* Breadcrumbs Navigation */}
      <div className="flex items-center gap-2 text-xs text-stone-400">
        <button onClick={onBack} className="hover:text-amber-400 flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
        <span className="text-amber-400 font-medium">{product.name}</span>
      </div>

      {/* Main Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Gallery Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl bg-emerald-950">
            <img
              src={selectedImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-80 sm:h-96 object-cover"
            />
            <div className="absolute top-4 left-4 bg-amber-500 text-stone-950 text-xs font-bold px-3 py-1 rounded shadow">
              MOQ: {product.minimumOrderQuantity}
            </div>
          </div>

          {/* Gallery Thumbnails */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex items-center gap-3">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === img ? 'border-amber-400 scale-105' : 'border-emerald-900/60 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Download / Print Spec Action */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="w-full bg-emerald-950 hover:bg-emerald-900 text-stone-300 border border-emerald-700/60 font-semibold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Technical Spec Sheet</span>
            </button>
          </div>
        </div>

        {/* Product Information Column */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
              <span>{product.category}</span>
              <span>•</span>
              <span>Origin: {product.origin}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-tight">
              {product.name}
            </h1>

            <p className="text-xs font-mono text-amber-200/80">
              Botanical Name: {product.specifications.botanicalName}
            </p>
          </div>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
            {product.fullDescription}
          </p>

          {/* Key Spec Highlight Box */}
          {product.specifications.keyActiveComponent && (
            <div className="bg-[#0B2518] p-4 rounded-xl border border-amber-500/30 text-amber-300 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs text-stone-400 uppercase tracking-wider block font-semibold">
                  Key Active Component Specification
                </span>
                <span className="text-sm font-bold text-white">
                  {product.specifications.keyActiveComponent}
                </span>
              </div>
            </div>
          )}

          {/* Available Packaging List */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold font-serif text-white uppercase tracking-wider">
              Available Export Packaging
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-300">
              {product.packagingOptions.map((opt, idx) => (
                <div key={idx} className="bg-[#0B2317] p-2.5 rounded-lg border border-emerald-900/60 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{opt}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-amber-300/80 italic pt-1">
              * Final specifications, custom packaging size, and MOQ can be customized based on buyer requirements.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onRequestQuote(product.name)}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold px-8 py-3.5 rounded-lg text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Request a Bulk Quote</span>
            </button>

            <button
              onClick={() => onRequestQuote(`${product.name} (Sample Request)`)}
              className="bg-emerald-950 hover:bg-emerald-900 text-amber-300 border border-emerald-700/60 font-semibold px-6 py-3.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Request Lab Samples (100g-500g)</span>
            </button>
          </div>

        </div>

      </div>

      {/* DETAILED TECHNICAL SPECIFICATION TABLE */}
      <div className="bg-[#0B2317] rounded-2xl border border-emerald-900/60 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/80 pb-4">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest block">
              Quality Parameters
            </span>
            <h2 className="text-2xl font-bold font-serif text-white">
              Product Specifications & Parameters
            </h2>
          </div>

          <div className="text-xs bg-emerald-950 text-emerald-300 px-3 py-1.5 rounded-md border border-emerald-800/50">
            ASTA & Micro-sterilization Compliant
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-300">
            <tbody className="divide-y divide-emerald-900/40">
              <tr className="hover:bg-emerald-950/40">
                <td className="py-3 px-4 font-bold text-amber-200 w-1/3">Product Name</td>
                <td className="py-3 px-4 text-white font-medium">{product.name}</td>
              </tr>
              <tr className="hover:bg-emerald-950/40">
                <td className="py-3 px-4 font-bold text-amber-200">Botanical Name</td>
                <td className="py-3 px-4 font-mono text-xs text-amber-300">{product.specifications.botanicalName}</td>
              </tr>
              <tr className="hover:bg-emerald-950/40">
                <td className="py-3 px-4 font-bold text-amber-200">Country of Origin</td>
                <td className="py-3 px-4">{product.origin}</td>
              </tr>
              <tr className="hover:bg-emerald-950/40">
                <td className="py-3 px-4 font-bold text-amber-200">Physical Form</td>
                <td className="py-3 px-4">{product.specifications.form}</td>
              </tr>
              <tr className="hover:bg-emerald-950/40">
                <td className="py-3 px-4 font-bold text-amber-200">Natural Color & Aroma</td>
                <td className="py-3 px-4">{product.specifications.color} • {product.specifications.aroma}</td>
              </tr>
              <tr className="hover:bg-emerald-950/40">
                <td className="py-3 px-4 font-bold text-amber-200">Maximum Moisture %</td>
                <td className="py-3 px-4 font-semibold text-white">{product.specifications.moistureMax}</td>
              </tr>
              {product.specifications.keyActiveComponent && (
                <tr className="hover:bg-emerald-950/40 bg-amber-950/20">
                  <td className="py-3 px-4 font-bold text-amber-400">Active Compound Value</td>
                  <td className="py-3 px-4 font-bold text-amber-300">{product.specifications.keyActiveComponent}</td>
                </tr>
              )}
              {product.specifications.astaColorValue && (
                <tr className="hover:bg-emerald-950/40">
                  <td className="py-3 px-4 font-bold text-amber-200">ASTA Color Value</td>
                  <td className="py-3 px-4">{product.specifications.astaColorValue}</td>
                </tr>
              )}
              <tr className="hover:bg-emerald-950/40">
                <td className="py-3 px-4 font-bold text-amber-200">Mesh Size / Particle Size</td>
                <td className="py-3 px-4">{product.specifications.meshSize || 'Standard Export Mesh'}</td>
              </tr>
              <tr className="hover:bg-emerald-950/40">
                <td className="py-3 px-4 font-bold text-amber-200">Shelf Life & Storage</td>
                <td className="py-3 px-4">{product.specifications.shelfLife} — {product.specifications.storageConditions}</td>
              </tr>
              <tr className="hover:bg-emerald-950/40">
                <td className="py-3 px-4 font-bold text-amber-200">Minimum Order Quantity (MOQ)</td>
                <td className="py-3 px-4 font-bold text-amber-400">{product.minimumOrderQuantity}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Product FAQs */}
      {product.faq && product.faq.length > 0 && (
        <div className="bg-[#0B2518] p-6 rounded-2xl border border-emerald-900/60 space-y-4">
          <h3 className="text-xl font-bold font-serif text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <span>Product Specific FAQ</span>
          </h3>
          <div className="space-y-3">
            {product.faq.map((f, i) => (
              <div key={i} className="p-4 bg-[#07170F] rounded-xl border border-emerald-900/60 space-y-1">
                <span className="font-semibold text-amber-300 text-sm block">Q: {f.question}</span>
                <p className="text-stone-300 text-xs font-light leading-relaxed">A: {f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
