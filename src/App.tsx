import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { QuoteModal } from './components/QuoteModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ScrollToTop } from './components/ScrollToTop';
import { CloudFieldBackground } from './components/CloudFieldBackground';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { QualityPage } from './pages/QualityPage';
import { ExportPage } from './pages/ExportPage';
import { PrivateLabelPage } from './pages/PrivateLabelPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsConditionsPage } from './pages/TermsConditionsPage';
import { OrderPolicyPage } from './pages/OrderPolicyPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Architecture
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminEnquiries } from './pages/admin/AdminEnquiries';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminAuditLog } from './pages/admin/AdminAuditLog';

import { Product } from './types';
import { getCatalogueProducts } from './lib/storage';

// Defined outside App so it is not re-created (and the whole page remounted) on every App render;
// remounting lost scroll position and broke focus return when the quote modal closed.
const PublicLayout: React.FC<{ onRequestQuote: (productName?: string) => void }> = ({ onRequestQuote }) => (
  <div className="min-h-screen bg-[#030d0a] text-[#fdfcf0] flex flex-col font-sans selection:bg-[#f2a900] selection:text-[#030d0a] relative">
    {/* ThreeUI Strata Cloud Field Ambient Background (Green to Black Luxury Palette) */}
    <CloudFieldBackground />
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-[#f2a900] focus:text-[#030d0a] focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold"
    >
      Skip to main content
    </a>
    <Navbar onRequestQuote={onRequestQuote} />
    <main id="main-content" tabIndex={-1} className="flex-1 relative z-10 focus:outline-none">
      <Outlet />
    </main>
    <Footer onRequestQuote={() => onRequestQuote()} />
    <FloatingWhatsApp />
  </div>
);

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteInitialProduct, setQuoteInitialProduct] = useState<string | undefined>(undefined);

  useEffect(() => {
    getCatalogueProducts().then(setProducts);
  }, []);

  const handleOpenQuoteModal = (productName?: string) => {
    setQuoteInitialProduct(productName);
    setIsQuoteModalOpen(true);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout onRequestQuote={handleOpenQuoteModal} />}>
          <Route path="/" element={<HomePage products={products} onRequestQuote={handleOpenQuoteModal} />} />
          <Route path="/products" element={<ProductsPage products={products} onRequestQuote={handleOpenQuoteModal} />} />
          <Route path="/products/:slug" element={<ProductDetailPage products={products} onRequestQuote={handleOpenQuoteModal} />} />
          <Route path="/about" element={<AboutPage onRequestQuote={() => handleOpenQuoteModal()} />} />
          <Route path="/quality" element={<QualityPage onRequestQuote={handleOpenQuoteModal} />} />
          <Route path="/export" element={<ExportPage onRequestQuote={() => handleOpenQuoteModal()} />} />
          <Route path="/private-label" element={<PrivateLabelPage onRequestQuote={handleOpenQuoteModal} />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsConditionsPage />} />
          <Route path="/order-policy" element={<OrderPolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Staff Authentication */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Modular Admin Hierarchy */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="dashboard" element={<AdminOverview />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="audit-logs" element={<AdminAuditLog />} />
        </Route>
      </Routes>

      {/* Global Interactive B2B Quotation Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialProduct={quoteInitialProduct}
      />
    </BrowserRouter>
  );
}
