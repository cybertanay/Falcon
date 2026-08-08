import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { QuoteModal } from './components/QuoteModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { QualityPage } from './pages/QualityPage';
import { ExportPage } from './pages/ExportPage';
import { PrivateLabelPage } from './pages/PrivateLabelPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsConditionsPage } from './pages/TermsConditionsPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { Product } from './types';
import { getLocalProducts } from './lib/storage';

export default function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteInitialProduct, setQuoteInitialProduct] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Initial products load from server API or local store fallback
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          return;
        }
      } catch (e) {
        console.warn('API fetch products error:', e);
      }
      setProducts(getLocalProducts());
    };

    fetchProducts();
  }, []);

  const handleOpenQuoteModal = (productName?: string) => {
    setQuoteInitialProduct(productName);
    setIsQuoteModalOpen(true);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActivePage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <HomePage
            products={products}
            onSelectProduct={handleSelectProduct}
            onRequestQuote={handleOpenQuoteModal}
            setActivePage={setActivePage}
          />
        );
      case 'products':
        return (
          <ProductsPage
            products={products}
            onSelectProduct={handleSelectProduct}
            onRequestQuote={handleOpenQuoteModal}
          />
        );
      case 'product-detail':
        return selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => {
              setActivePage('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onRequestQuote={handleOpenQuoteModal}
          />
        ) : (
          <ProductsPage
            products={products}
            onSelectProduct={handleSelectProduct}
            onRequestQuote={handleOpenQuoteModal}
          />
        );
      case 'about':
        return (
          <AboutPage
            onRequestQuote={() => handleOpenQuoteModal()}
            setActivePage={setActivePage}
          />
        );
      case 'quality':
        return (
          <QualityPage
            onRequestQuote={handleOpenQuoteModal}
          />
        );
      case 'export':
        return (
          <ExportPage
            onRequestQuote={() => handleOpenQuoteModal()}
          />
        );
      case 'privatelabel':
        return (
          <PrivateLabelPage
            onRequestQuote={handleOpenQuoteModal}
          />
        );
      case 'contact':
        return (
          <ContactPage />
        );
      case 'admin':
        return (
          <AdminDashboard
            products={products}
            setProducts={setProducts}
          />
        );
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsConditionsPage />;
      default:
        return <NotFoundPage onGoHome={() => setActivePage('home')} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#05140f] text-[#fdfcf0] flex flex-col font-sans selection:bg-[#f2a900] selection:text-[#05140f]">
      
      {/* Sticky Navigation Bar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onRequestQuote={handleOpenQuoteModal}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer
        setActivePage={setActivePage}
        onRequestQuote={() => handleOpenQuoteModal()}
      />

      {/* Floating WhatsApp Widget */}
      <FloatingWhatsApp />

      {/* Request a Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialProduct={quoteInitialProduct}
      />

    </div>
  );
}
