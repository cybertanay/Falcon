import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Package, CheckCircle2, Clock, ArrowRight, ShieldCheck, TrendingUp, AlertCircle } from 'lucide-react';
import { Enquiry, Product } from '../../types';

export const AdminOverview: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const getAuthToken = () => sessionStorage.getItem('falcon_admin_token') || '';

  useEffect(() => {
    const token = getAuthToken();
    const headers = { 'Authorization': `Bearer ${token}` };

    Promise.all([
      fetch('/api/enquiries', { headers }).then(r => r.ok ? r.json() : []),
      fetch('/api/products?all=true', { headers }).then(r => r.ok ? r.json() : [])
    ])
      .then(([enqData, prodData]) => {
        setEnquiries(enqData || []);
        setProducts(prodData || []);
      })
      .catch(err => console.error('Error loading dashboard data:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-2 border-[#f2a900] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-[#a3b899] font-mono">Loading Real Business Data...</p>
      </div>
    );
  }

  const totalEnquiries = enquiries.length;
  const newEnquiries = enquiries.filter(e => e.status === 'New').length;
  const convertedEnquiries = enquiries.filter(e => e.status === 'Converted').length;
  const inProgressEnquiries = enquiries.filter(e => ['Contacted', 'Quotation Sent', 'Negotiating'].includes(e.status)).length;
  const publishedProducts = products.filter(p => p.published).length;

  return (
    <div className="space-y-8 text-left">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#154736]/60 pb-5">
        <div>
          <span className="text-xs font-mono text-[#f2a900] uppercase tracking-wider block">
            Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcf0]">
            Export Operations Overview
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/enquiries"
            className="bg-[#f2a900] hover:bg-[#d97706] text-[#030d0a] font-bold px-4 py-2 rounded-xl text-xs shadow flex items-center gap-1.5 transition-colors"
          >
            <span>Review Enquiries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Real Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#05140f] p-5 rounded-2xl border border-[#154736]/70 space-y-2">
          <div className="flex items-center justify-between text-[#a3b899]">
            <span className="text-xs font-mono uppercase tracking-wider">New Leads</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </div>
          <div className="text-3xl font-bold font-serif text-[#f2a900]">
            {newEnquiries}
          </div>
          <p className="text-[11px] text-[#a3b899] font-light">
            Awaiting initial contact / quote draft
          </p>
        </div>

        <div className="bg-[#05140f] p-5 rounded-2xl border border-[#154736]/70 space-y-2">
          <div className="flex items-center justify-between text-[#a3b899]">
            <span className="text-xs font-mono uppercase tracking-wider">In Negotiation</span>
            <Clock className="w-4 h-4 text-[#f2a900]" />
          </div>
          <div className="text-3xl font-bold font-serif text-[#fdfcf0]">
            {inProgressEnquiries}
          </div>
          <p className="text-[11px] text-[#a3b899] font-light">
            Quotes sent / actively negotiating
          </p>
        </div>

        <div className="bg-[#05140f] p-5 rounded-2xl border border-[#154736]/70 space-y-2">
          <div className="flex items-center justify-between text-[#a3b899]">
            <span className="text-xs font-mono uppercase tracking-wider">Converted Contracts</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-serif text-emerald-400">
            {convertedEnquiries}
          </div>
          <p className="text-[11px] text-[#a3b899] font-light">
            Successfully closed B2B contracts
          </p>
        </div>

        <div className="bg-[#05140f] p-5 rounded-2xl border border-[#154736]/70 space-y-2">
          <div className="flex items-center justify-between text-[#a3b899]">
            <span className="text-xs font-mono uppercase tracking-wider">Catalogue Products</span>
            <Package className="w-4 h-4 text-[#f2a900]" />
          </div>
          <div className="text-3xl font-bold font-serif text-[#fdfcf0]">
            {publishedProducts} <span className="text-sm font-sans font-normal text-[#a3b899]">/ {products.length}</span>
          </div>
          <p className="text-[11px] text-[#a3b899] font-light">
            Published active export commodities
          </p>
        </div>

      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-[#05140f] rounded-2xl border border-[#154736]/70 overflow-hidden shadow-xl space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-[#154736]/60 pb-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#fdfcf0]">
              Recent B2B Quotation Requests
            </h2>
            <p className="text-xs text-[#a3b899] font-light">
              Real-time enquiries logged via public quote modal and contact page
            </p>
          </div>
          <Link
            to="/admin/enquiries"
            className="text-xs text-[#f2a900] hover:underline flex items-center gap-1"
          >
            <span>View All ({totalEnquiries})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {enquiries.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#a3b899]">
            No enquiries received yet. Live leads will automatically appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#a3b899]">
              <thead className="bg-[#030d0a] text-[#f2a900] font-mono uppercase tracking-wider border-b border-[#154736]/80">
                <tr>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Customer / Company</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Volume</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Received Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#154736]/40">
                {enquiries.slice(0, 6).map((enq) => (
                  <tr key={enq.id} className="hover:bg-[#0b2317]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#fdfcf0]">
                      {enq.enquiryReference}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#fdfcf0] block">{enq.fullName}</span>
                      <span className="text-[10px] text-[#a3b899]">{enq.companyName || 'Private Procurement'}</span>
                    </td>
                    <td className="py-3 px-4 text-[#fdfcf0] font-medium">
                      {enq.productName}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#f2a900]">
                      {enq.estimatedQuantity}
                    </td>
                    <td className="py-3 px-4">
                      {enq.country}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        enq.status === 'New'
                          ? 'bg-amber-500/20 text-[#f2a900] border border-amber-500/30'
                          : enq.status === 'Converted'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-[#154736]/60 text-[#a3b899]'
                      }`}>
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[11px]">
                      {enq.createdAt ? enq.createdAt.split('T')[0] : 'Today'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
