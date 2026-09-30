import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Send, CheckCircle2, ShieldCheck, Download, ChevronRight, HelpCircle, AlertCircle, Share2, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { generateProductSpecPDF } from '../lib/pdfGenerator';
import { trackEvent } from '../lib/analytics';

interface ProductDetailPageProps {
  products: Product[];
  onRequestQuote: (productName: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ products, onRequestQuote }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!slug) return;

    // First try matching in current loaded products
    const found = products.find(p => p.slug === slug || p.id === slug);
    if (found) {
      setProduct(found);
      setSelectedImage(found.image);
      setLoading(false);
      trackEvent('product_view', { productId: found.id, productName: found.name, slug });
      return;
    }

    // Otherwise fetch directly from server API
    fetch(`/api/products/${slug}`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not found');
      })
      .then(data => {
        setProduct(data);
        setSelectedImage(data.image);
        trackEvent('product_view', { productId: data.id, productName: data.name, slug });
      })
      .catch(() => {
        setProduct(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, products]);

  const handleDownloadPDF = () => {
    if (!product) return;
    setPdfGenerating(true);
    setTimeout(() => {
      generateProductSpecPDF(product);
      setPdfGenerating(false);
    }, 300);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center p-8">
        <div className="space-y-4">
          <div className="w-12 h-12 border-3 border-[#f2a900] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[#a3b899] text-sm font-mono">Loading product specifications...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center p-8">
        <div className="max-w-md bg-[#05140f] p-8 rounded-2xl border border-[#154736] space-y-4">
          <AlertCircle className="w-10 h-10 text-[#f2a900] mx-auto" />
          <h2 className="text-2xl font-serif font-bold text-[#fdfcf0]">Product Unavailable</h2>
          <p className="text-[#a3b899] text-sm">
            The requested commodity could not be found or has not yet been published to the export catalogue.
          </p>
          <Link
            to="/products"
            className="inline-block bg-[#f2a900] text-[#030d0a] font-bold px-6 py-2.5 rounded-lg text-xs"
          >
            Return to Products
          </Link>
        </div>
      </div>
    );
  }

  // JSON-LD Product Schema
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.image,
    "description": product.shortDescription,
    "category": product.category,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "price": "Upon Quotation",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="bg-[#030d0a] text-[#fdfcf0] py-12 px-4 sm:px-6 lg:px-8 space-y-14 font-sans max-w-7xl mx-auto text-left">
      
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Breadcrumbs Navigation */}
      <div className="flex items-center justify-between gap-4 text-xs text-[#a3b899]">
        <div className="flex items-center gap-2">
          <Link to="/products" className="hover:text-[#f2a900] flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Catalogue</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#154736]" />
          <span className="text-[#a3b899] hidden sm:inline">{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#154736] hidden sm:inline" />
          <span className="text-[#f2a900] font-medium">{product.name}</span>
        </div>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 text-xs text-[#a3b899] hover:text-[#f2a900] bg-[#05140f] px-3 py-1.5 rounded-lg border border-[#154736] transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? 'Link Copied!' : 'Share Product'}</span>
        </button>
      </div>

      {/* Main Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        
        {/* Gallery Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-[#f2a900]/30 shadow-2xl bg-[#05140f]">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-80 sm:h-96 object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-[#f2a900] text-[#030d0a] text-xs font-bold px-3 py-1.5 rounded-lg shadow">
              MOQ: {product.minimumOrderQuantity}
            </div>
            <div className="absolute top-4 right-4 bg-[#030d0a]/85 backdrop-blur-md text-[#f2a900] text-xs font-mono px-3 py-1.5 rounded-lg border border-[#f2a900]/30">
              Origin: {product.origin}
            </div>
          </div>

          {/* Gallery Thumbnails */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img ? 'border-[#f2a900] scale-105 shadow-md' : 'border-[#154736] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Download Technical Spec PDF Action */}
          <div className="pt-2">
            <button
              onClick={handleDownloadPDF}
              disabled={pdfGenerating}
              className="w-full bg-[#05140f] hover:bg-[#0b2317] text-[#fdfcf0] border border-[#f2a900]/40 font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md group"
            >
              <Download className="w-4 h-4 text-[#f2a900] group-hover:translate-y-0.5 transition-transform" />
              <span>{pdfGenerating ? 'Preparing Specification Sheet...' : 'Download Official Spec Sheet (PDF)'}</span>
            </button>
          </div>
        </div>

        {/* Product Information Column */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#f2a900] uppercase tracking-widest bg-[#05140f] px-3.5 py-1.5 rounded-full border border-[#f2a900]/30">
              <span>{product.category}</span>
              <span>•</span>
              <span>Bulk Commercial Export</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#fdfcf0] tracking-tight">
              {product.name}
            </h1>

            <p className="text-xs font-mono text-[#a3b899]">
              Botanical Taxonomy: <span className="text-[#f2a900]">{product.specifications?.botanicalName || 'Curcuma longa'}</span>
            </p>
          </div>

          <p className="text-[#a3b899] text-sm sm:text-base leading-relaxed font-light">
            {product.fullDescription || product.shortDescription}
          </p>

          {/* Key Spec Highlight Box */}
          {product.specifications?.keyActiveComponent && (
            <div className="bg-[#05140f] p-4 sm:p-5 rounded-2xl border border-[#f2a900]/30 text-[#f2a900] flex items-center gap-3 shadow-lg">
              <ShieldCheck className="w-7 h-7 text-[#f2a900] shrink-0" />
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider block text-[#a3b899]">
                  Verified Bioactive / Active Potency Parameter
                </span>
                <span className="text-base sm:text-lg font-bold text-[#fdfcf0] font-mono">
                  {product.specifications.keyActiveComponent}
                </span>
              </div>
            </div>
          )}

          {/* Available Packaging List */}
          <div className="space-y-2.5">
            <h3 className="text-xs uppercase font-mono tracking-widest text-[#f2a900]">
              Available Export Packaging Formats
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#a3b899]">
              {product.packagingOptions.map((opt, idx) => (
                <div key={idx} className="bg-[#05140f] p-3 rounded-xl border border-[#154736]/60 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#f2a900] shrink-0" />
                  <span className="text-[#fdfcf0]">{opt}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#a3b899]/70 italic pt-1">
              * Custom private label pouch sizes, branded master cartons, and container packing configurations are customized to client specifications.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onRequestQuote(product.name)}
              className="bg-gradient-to-r from-[#f2a900] to-[#d97706] hover:from-[#e09b00] hover:to-[#b45309] text-[#030d0a] font-bold px-8 py-4 rounded-xl text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Send className="w-4 h-4" />
              <span>Request Quotation for {product.name}</span>
            </button>

            <button
              onClick={() => onRequestQuote(`${product.name} (Lab Sample Request)`)}
              className="bg-[#05140f] hover:bg-[#0b2317] text-[#fdfcf0] border border-[#154736] font-semibold px-6 py-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4 text-[#f2a900]" />
              <span>Request Lab Samples (100g - 500g)</span>
            </button>
          </div>

        </div>

      </div>

      {/* DETAILED TECHNICAL SPECIFICATION TABLE */}
      <div className="bg-[#05140f] rounded-2xl border border-[#154736]/70 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#154736]/80 pb-4">
          <div>
            <span className="text-xs font-mono text-[#f2a900] uppercase tracking-widest block">
              Analytical Parameters
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#fdfcf0]">
              Technical Export Specifications
            </h2>
          </div>

          <div className="text-xs bg-[#0b2317] text-[#f2a900] px-3.5 py-1.5 rounded-lg border border-[#f2a900]/30 font-mono">
            Steam-Sterilization & Micro COA Guaranteed
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#a3b899]">
            <tbody className="divide-y divide-[#154736]/50">
              <tr className="hover:bg-[#0b2317]/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-[#fdfcf0] w-1/3">Commodity Name</td>
                <td className="py-3.5 px-4 text-[#fdfcf0] font-medium">{product.name}</td>
              </tr>
              <tr className="hover:bg-[#0b2317]/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-[#fdfcf0]">Botanical Species</td>
                <td className="py-3.5 px-4 font-mono text-xs text-[#f2a900]">{product.specifications?.botanicalName || 'Botanical Standard'}</td>
              </tr>
              <tr className="hover:bg-[#0b2317]/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-[#fdfcf0]">Country of Origin</td>
                <td className="py-3.5 px-4 text-[#fdfcf0]">{product.origin}</td>
              </tr>
              <tr className="hover:bg-[#0b2317]/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-[#fdfcf0]">Physical Form</td>
                <td className="py-3.5 px-4 text-[#fdfcf0]">{product.specifications?.form || product.form}</td>
              </tr>
              <tr className="hover:bg-[#0b2317]/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-[#fdfcf0]">Color & Characteristic Aroma</td>
                <td className="py-3.5 px-4 text-[#fdfcf0]">{product.specifications?.color || 'Natural'} • {product.specifications?.aroma || 'Characteristic aromatic profile'}</td>
              </tr>
              <tr className="hover:bg-[#0b2317]/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-[#fdfcf0]">Maximum Moisture Limit</td>
                <td className="py-3.5 px-4 font-mono font-semibold text-[#f2a900]">{product.specifications?.moistureMax || 'Max 10.0%'}</td>
              </tr>
              {product.specifications?.keyActiveComponent && (
                <tr className="hover:bg-[#0b2317]/40 bg-amber-950/20">
                  <td className="py-3.5 px-4 font-bold text-[#f2a900]">Active Chemical Compound</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#fdfcf0]">{product.specifications.keyActiveComponent}</td>
                </tr>
              )}
              {product.specifications?.astaColorValue && (
                <tr className="hover:bg-[#0b2317]/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#fdfcf0]">ASTA Color Value</td>
                  <td className="py-3.5 px-4 font-mono text-[#fdfcf0]">{product.specifications.astaColorValue}</td>
                </tr>
              )}
              <tr className="hover:bg-[#0b2317]/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-[#fdfcf0]">Mesh Granulation</td>
                <td className="py-3.5 px-4 text-[#fdfcf0]">{product.specifications?.meshSize || 'Standard Export Mesh (Customizable)'}</td>
              </tr>
              <tr className="hover:bg-[#0b2317]/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-[#fdfcf0]">Shelf Life & Storage</td>
                <td className="py-3.5 px-4 text-[#fdfcf0]">{product.specifications?.shelfLife || '24 Months'} — {product.specifications?.storageConditions || 'Hygienic warehouse storage'}</td>
              </tr>
              <tr className="hover:bg-[#0b2317]/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-[#fdfcf0]">Minimum Order Quantity (MOQ)</td>
                <td className="py-3.5 px-4 font-bold text-[#f2a900]">{product.minimumOrderQuantity}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Product FAQs */}
      {product.faq && product.faq.length > 0 && (
        <div className="bg-[#05140f] p-6 sm:p-8 rounded-2xl border border-[#154736]/70 space-y-4">
          <h3 className="text-xl font-serif font-bold text-[#fdfcf0] flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#f2a900]" />
            <span>Product Inquiries & Technical FAQ</span>
          </h3>
          <div className="space-y-3">
            {product.faq.map((f, i) => (
              <div key={i} className="p-4 bg-[#030d0a] rounded-xl border border-[#154736]/60 space-y-1">
                <span className="font-semibold text-[#f2a900] text-sm block">Q: {f.question}</span>
                <p className="text-[#a3b899] text-xs font-light leading-relaxed">A: {f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
