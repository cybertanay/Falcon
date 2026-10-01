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

  const PublicLayout: React.FC = () => (
    <div className="min-h-screen bg-[#030d0a] text-[#fdfcf0] flex flex-col font-sans selection:bg-[#f2a900] selection:text-[#030d0a] relative">
      {/* ThreeUI Strata Cloud Field Ambient Background (Green to Black Luxury Palette) */}
      <CloudFieldBackground />
      <Navbar onRequestQuote={handleOpenQuoteModal} />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer onRequestQuote={() => handleOpenQuoteModal()} />
      <FloatingWhatsApp />
    </div>
  );

  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
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
