import React, { useState, useEffect } from 'react';
import { Lock, LogOut, CheckCircle2, AlertCircle, FileText, Plus, Trash2, Edit, Save, RefreshCw, Eye, MessageSquare } from 'lucide-react';
import { Enquiry, Product, Testimonial, Certification, EnquiryStatus } from '../types';
import { getLocalEnquiries, getLocalProducts, getLocalTestimonials, getLocalCertifications } from '../lib/storage';

interface AdminDashboardProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, setProducts }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState('admin@falconspices.com');
  const [passwordInput, setPasswordInput] = useState('falcon_admin_secure_pass_2026');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'overview' | 'enquiries' | 'products' | 'testimonials' | 'certifications'>('overview');
  
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);

  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [internalNoteText, setInternalNoteText] = useState('');

  // New Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    category: 'Powders' as any,
    image: '/src/assets/images/turmeric_product_1786195278080.jpg',
    origin: 'India',
    minimumOrderQuantity: '1 Metric Ton',
    featured: true,
    published: true,
    botanicalName: 'Curcuma longa',
    keyActiveComponent: 'Curcumin 3.0%'
  });

  useEffect(() => {
    // Check local session
    const token = sessionStorage.getItem('falcon_admin_token');
    if (token) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const resEnq = await fetch('/api/enquiries');
      if (resEnq.ok) {
        const data = await resEnq.json();
        setEnquiries(data);
      } else {
        setEnquiries(getLocalEnquiries());
      }

      const resProd = await fetch('/api/products?all=true');
      if (resProd.ok) {
        const data = await resProd.json();
        setProducts(data);
      } else {
        setProducts(getLocalProducts());
      }

      setTestimonials(getLocalTestimonials());
      setCertifications(getLocalCertifications());
    } catch (e) {
      setEnquiries(getLocalEnquiries());
      setProducts(getLocalProducts());
      setTestimonials(getLocalTestimonials());
      setCertifications(getLocalCertifications());
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput })
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('falcon_admin_token', data.token);
        setIsAuthenticated(true);
        fetchData();
      } else {
        setLoginError(data.error || 'Authentication failed');
      }
    } catch (err) {
      if (emailInput === 'admin@falconspices.com' && passwordInput === 'falcon_admin_secure_pass_2026') {
        sessionStorage.setItem('falcon_admin_token', 'local_token');
        setIsAuthenticated(true);
        fetchData();
      } else {
        setLoginError('Invalid admin email or password.');
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('falcon_admin_token');
    setIsAuthenticated(false);
  };

  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    try {
      await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.error(e);
    }
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    try {
      await fetch(`/api/enquiries/${selectedEnquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internalNotes: internalNoteText })
      });
    } catch (e) {
      console.error(e);
    }
    setEnquiries(prev => prev.map(e => e.id === selectedEnquiry.id ? { ...e, internalNotes: internalNoteText } : e));
    setSelectedEnquiry({ ...selectedEnquiry, internalNotes: internalNoteText });
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    setEnquiries(prev => prev.filter(e => e.id !== id));
    if (selectedEnquiry && selectedEnquiry.id === id) setSelectedEnquiry(null);
  };

  const handleToggleProductPublish = async (product: Product) => {
    const updated = { ...product, published: !product.published };
    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.error(e);
    }
    setProducts(prev => prev.map(p => p.id === product.id ? updated : p));
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newProduct.slug || newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const fullProd: Partial<Product> = {
      ...newProduct,
      slug,
      gallery: [newProduct.image],
      availableFormats: ['Standard Fine Powder', 'Whole Format'],
      packagingOptions: ['25kg Multi-wall Kraft Bags', 'PP Bags'],
      faq: [],
      specifications: {
        botanicalName: newProduct.botanicalName,
        origin: newProduct.origin,
        form: 'Powder / Whole',
        color: 'Natural',
        aroma: 'Aromatic',
        moistureMax: '10.0%',
        keyActiveComponent: newProduct.keyActiveComponent,
        shelfLife: '24 Months',
        storageConditions: 'Cool dry warehouse',
        minimumOrderQuantity: newProduct.minimumOrderQuantity
      }
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullProd)
      });
      if (res.ok) {
        const created = await res.json();
        setProducts(prev => [created, ...prev]);
      } else {
        const mockCreated = { ...fullProd, id: 'prod-' + Date.now(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Product;
        setProducts(prev => [mockCreated, ...prev]);
      }
    } catch (e) {
      const mockCreated = { ...fullProd, id: 'prod-' + Date.now(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Product;
      setProducts(prev => [mockCreated, ...prev]);
    }

    setShowProductModal(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] bg-[#05140f] text-[#fdfcf0] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-[#082018] p-8 rounded-2xl border border-[#f2a900]/40 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#f2a900]/20 border border-[#f2a900] flex items-center justify-center mx-auto text-[#f2a900]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold font-serif text-[#fdfcf0]">Admin Portal Login</h1>
            <p className="text-xs text-[#a3b899]">
              Falcon International Traders B2B Operations
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-[#c41e3a]/20 border border-[#c41e3a]/50 text-[#fdfcf0] text-xs rounded-lg">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#f2a900] mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-[#05140f] text-[#fdfcf0] px-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#f2a900] mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#05140f] text-[#fdfcf0] px-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#f2a900] hover:bg-[#d99700] text-[#05140f] font-bold py-3 rounded-lg text-sm shadow transition-all"
            >
              Sign In to Dashboard
            </button>
          </form>

          <p className="text-[10px] text-[#a3b899]/60 text-center">
            Default credentials: admin@falconspices.com / falcon_admin_secure_pass_2026
          </p>
        </div>
      </div>
    );
  }

  const newCount = enquiries.filter(e => e.status === 'New').length;
  const contactedCount = enquiries.filter(e => e.status === 'Contacted' || e.status === 'Quotation Sent').length;
  const convertedCount = enquiries.filter(e => e.status === 'Converted').length;

  return (
    <div className="bg-[#05140f] text-[#fdfcf0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-8 font-sans max-w-7xl mx-auto">
      
      {/* Top Header & Logout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#082018] p-6 rounded-2xl border border-[#154736]">
        <div>
          <span className="text-xs font-semibold text-[#f2a900] uppercase tracking-widest block">
            Protected Operations Desk
          </span>
          <h1 className="text-2xl font-bold font-serif text-[#fdfcf0]">
            Falcon Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="bg-[#05140f] hover:bg-[#082018] text-[#a3b899] p-2.5 rounded-lg border border-[#154736] text-xs flex items-center gap-1.5"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4 text-[#f2a900]" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleLogout}
            className="bg-[#c41e3a]/20 hover:bg-[#c41e3a]/40 text-[#fdfcf0] border border-[#c41e3a]/50 px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#082018] p-5 rounded-xl border border-[#f2a900]/30">
          <span className="text-xs text-[#a3b899] uppercase font-semibold block">Total Enquiries</span>
          <span className="text-3xl font-bold font-serif text-[#fdfcf0]">{enquiries.length}</span>
        </div>
        <div className="bg-[#082018] p-5 rounded-xl border border-[#f2a900]/30">
          <span className="text-xs text-[#f2a900] uppercase font-semibold block">New Enquiries</span>
          <span className="text-3xl font-bold font-serif text-[#f2a900]">{newCount}</span>
        </div>
        <div className="bg-[#082018] p-5 rounded-xl border border-[#f2a900]/30">
          <span className="text-xs text-[#a3b899] uppercase font-semibold block">In Negotiation</span>
          <span className="text-3xl font-bold font-serif text-[#fdfcf0]">{contactedCount}</span>
        </div>
        <div className="bg-[#082018] p-5 rounded-xl border border-[#f2a900]/30">
          <span className="text-xs text-[#a3b899] uppercase font-semibold block">Converted Contracts</span>
          <span className="text-3xl font-bold font-serif text-[#f2a900]">{convertedCount}</span>
        </div>
        <div className="bg-[#082018] p-5 rounded-xl border border-[#f2a900]/30">
          <span className="text-xs text-[#a3b899] uppercase font-semibold block">Active Products</span>
          <span className="text-3xl font-bold font-serif text-[#fdfcf0]">{products.length}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#154736] pb-3 overflow-x-auto">
        {[
          { id: 'overview', label: 'Enquiries Table' },
          { id: 'products', label: 'Product Catalog CRUD' },
          { id: 'testimonials', label: 'Testimonials' },
          { id: 'certifications', label: 'Certifications' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#f2a900] text-[#05140f] shadow'
                : 'bg-[#082018] text-[#a3b899] hover:text-[#fdfcf0] border border-[#154736]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ENQUIRIES TAB */}
      {(activeTab === 'overview' || activeTab === 'enquiries') && (
        <div className="space-y-6">
          <div className="overflow-x-auto bg-[#082018] rounded-2xl border border-[#154736] shadow-xl">
            <table className="w-full text-left text-xs text-[#a3b899]">
              <thead className="bg-[#05140f] text-[#f2a900] font-serif uppercase tracking-wider border-b border-[#154736]">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Client Name</th>
                  <th className="py-3.5 px-4">Company & Country</th>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Est. Quantity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#154736]">
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#a3b899]">
                      No customer enquiries logged yet.
                    </td>
                  </tr>
                ) : (
                  enquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-[#05140f]/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[#a3b899]">
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#fdfcf0]">
                        {enq.fullName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="block text-[#fdfcf0] font-semibold">{enq.companyName || 'Individual Buyer'}</span>
                        <span className="text-[#a3b899] text-[11px]">{enq.country}</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#f2a900]">
                        {enq.productName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#fdfcf0]">
                        {enq.estimatedQuantity}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={enq.status}
                          onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                          className={`px-2 py-1 rounded text-[11px] font-bold border focus:outline-none bg-[#05140f] ${
                            enq.status === 'New' ? 'text-[#f2a900] border-[#f2a900]/40' :
                            enq.status === 'Converted' ? 'text-[#fdfcf0] border-[#154736]' :
                            'text-[#a3b899] border-[#154736]'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Quotation Sent">Quotation Sent</option>
                          <option value="Negotiating">Negotiating</option>
                          <option value="Converted">Converted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedEnquiry(enq);
                              setInternalNoteText(enq.internalNotes || '');
                            }}
                            className="bg-[#05140f] hover:bg-[#082018] text-[#fdfcf0] p-1.5 rounded border border-[#154736]"
                            title="View Details & Internal Notes"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#f2a900]" />
                          </button>
                          <button
                            onClick={() => handleDeleteEnquiry(enq.id)}
                            className="bg-[#c41e3a]/20 hover:bg-[#c41e3a]/40 text-[#fdfcf0] p-1.5 rounded border border-[#c41e3a]/50"
                            title="Delete Enquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Enquiry Detail Drawer / Modal */}
          {selectedEnquiry && (
            <div className="bg-[#082018] p-6 rounded-2xl border border-[#f2a900]/40 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#154736] pb-3">
                <div>
                  <span className="text-xs font-semibold text-[#f2a900] uppercase">Enquiry Inspection ID: {selectedEnquiry.id}</span>
                  <h3 className="text-lg font-bold font-serif text-[#fdfcf0]">{selectedEnquiry.productName} — {selectedEnquiry.fullName}</h3>
                </div>
                <button onClick={() => setSelectedEnquiry(null)} className="text-[#a3b899] hover:text-[#fdfcf0] text-xs">Close</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#a3b899] block font-semibold">Email:</span>
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-[#f2a900] font-mono">{selectedEnquiry.email}</a>
                </div>
                <div>
                  <span className="text-[#a3b899] block font-semibold">WhatsApp:</span>
                  <a href={`https://wa.me/${selectedEnquiry.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-[#fdfcf0] font-mono">{selectedEnquiry.whatsapp}</a>
                </div>
                <div>
                  <span className="text-[#a3b899] block font-semibold">Packaging:</span>
                  <span className="text-[#fdfcf0]">{selectedEnquiry.packagingRequirement}</span>
                </div>
                <div>
                  <span className="text-[#a3b899] block font-semibold">Message:</span>
                  <p className="text-[#a3b899] bg-[#05140f] p-3 rounded border border-[#154736] mt-1">{selectedEnquiry.message || 'No custom message.'}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#154736]">
                <label className="block text-xs font-bold text-[#f2a900]">Internal Sales Notes:</label>
                <textarea
                  rows={2}
                  value={internalNoteText}
                  onChange={(e) => setInternalNoteText(e.target.value)}
                  placeholder="e.g. Sent CIF Hamburg quote $2,450/MT on 08-Aug..."
                  className="w-full bg-[#05140f] text-[#fdfcf0] p-2.5 rounded-lg border border-[#154736] text-xs focus:outline-none"
                ></textarea>
                <button
                  onClick={handleSaveNotes}
                  className="bg-[#f2a900] text-[#05140f] font-bold px-4 py-1.5 rounded text-xs shadow flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Internal Note</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold font-serif text-[#fdfcf0]">Product Catalog Management</h2>
            <button
              onClick={() => setShowProductModal(true)}
              className="bg-[#f2a900] hover:bg-[#d99700] text-[#05140f] font-bold px-4 py-2 rounded-lg text-xs shadow flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div key={prod.id} className="bg-[#082018] p-5 rounded-2xl border border-[#154736] space-y-3">
                <img src={prod.image} alt={prod.name} referrerPolicy="no-referrer" className="w-full h-40 object-cover rounded-xl" />
                <h3 className="font-bold text-[#fdfcf0] font-serif">{prod.name}</h3>
                <p className="text-xs text-[#a3b899] font-mono">{prod.specifications.botanicalName}</p>
                
                <div className="flex items-center justify-between pt-2 border-t border-[#154736]">
                  <button
                    onClick={() => handleToggleProductPublish(prod)}
                    className={`px-2.5 py-1 rounded text-xs font-bold ${
                      prod.published ? 'bg-[#154736] text-[#fdfcf0] border border-[#f2a900]/40' : 'bg-[#05140f] text-[#a3b899]'
                    }`}
                  >
                    {prod.published ? 'Published' : 'Hidden'}
                  </button>
                  <span className="text-xs text-[#f2a900] font-bold">MOQ: {prod.minimumOrderQuantity}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Product Modal */}
          {showProductModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05140f]/80 backdrop-blur-sm overflow-y-auto font-sans">
              <div className="bg-[#082018] p-6 rounded-2xl border border-[#f2a900]/40 max-w-lg w-full space-y-4">
                <h3 className="text-xl font-bold text-[#fdfcf0] font-serif">Create Product Entry</h3>
                <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[#f2a900] mb-1">Product Name</label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full bg-[#05140f] text-[#fdfcf0] p-2.5 rounded border border-[#154736]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#f2a900] mb-1">Botanical Name</label>
                    <input
                      type="text"
                      value={newProduct.botanicalName}
                      onChange={(e) => setNewProduct({ ...newProduct, botanicalName: e.target.value })}
                      className="w-full bg-[#05140f] text-[#fdfcf0] p-2.5 rounded border border-[#154736]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#f2a900] mb-1">Short Description</label>
                    <input
                      type="text"
                      required
                      value={newProduct.shortDescription}
                      onChange={(e) => setNewProduct({ ...newProduct, shortDescription: e.target.value })}
                      className="w-full bg-[#05140f] text-[#fdfcf0] p-2.5 rounded border border-[#154736]"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setShowProductModal(false)} className="px-4 py-2 text-[#a3b899]">Cancel</button>
                    <button type="submit" className="bg-[#f2a900] text-[#05140f] font-bold px-4 py-2 rounded">Save Product</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TESTIMONIALS TAB */}
      {activeTab === 'testimonials' && (
        <div className="bg-[#082018] p-6 rounded-2xl border border-[#154736] space-y-4">
          <h2 className="text-xl font-bold font-serif text-[#fdfcf0]">B2B Partner Testimonials</h2>
          <div className="space-y-3 text-xs">
            {testimonials.map((t) => (
              <div key={t.id} className="p-4 bg-[#05140f] rounded-xl border border-[#154736] space-y-1">
                <span className="font-bold text-[#f2a900]">{t.clientName} — {t.company} ({t.country})</span>
                <p className="text-[#a3b899] italic font-light">"{t.testimonial}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CERTIFICATIONS TAB */}
      {activeTab === 'certifications' && (
        <div className="bg-[#082018] p-6 rounded-2xl border border-[#154736] space-y-4">
          <h2 className="text-xl font-bold font-serif text-[#fdfcf0]">Quality Certifications & Registrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {certifications.map((c) => (
              <div key={c.id} className="p-4 bg-[#05140f] rounded-xl border border-[#154736] space-y-1">
                <span className="font-bold text-[#f2a900]">{c.name}</span>
                <p className="text-[#a3b899]">{c.issuingAuthority}</p>
                <span className="font-mono text-[#fdfcf0] block">{c.certificateNumber}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
