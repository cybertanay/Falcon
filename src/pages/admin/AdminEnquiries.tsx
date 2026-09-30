import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Download, Trash2, Edit, CheckCircle2, Clock, Eye, AlertCircle, Mail, Phone, Building, Globe } from 'lucide-react';
import { Enquiry, EnquiryStatus } from '../../types';

export const AdminEnquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Detail Modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [assignedStaff, setAssignedStaff] = useState('');
  const [statusVal, setStatusVal] = useState<EnquiryStatus>('New');
  const [updating, setUpdating] = useState(false);

  const getAuthToken = () => sessionStorage.getItem('falcon_admin_token') || '';

  const authFetch = (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options.headers || {})
      }
    });
  };

  const fetchEnquiries = async () => {
    try {
      const res = await authFetch('/api/enquiries');
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data);
      }
    } catch (e) {
      console.error('Error fetching enquiries:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleOpenDetail = (e: Enquiry) => {
    setSelectedEnquiry(e);
    setInternalNotes(e.internalNotes || '');
    setAssignedStaff(e.assignedStaff || '');
    setStatusVal(e.status);
  };

  const handleUpdateEnquiry = async () => {
    if (!selectedEnquiry) return;
    setUpdating(true);

    try {
      const res = await authFetch(`/api/enquiries/${selectedEnquiry.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: statusVal,
          internalNotes,
          assignedStaff
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setEnquiries(prev => prev.map(item => item.id === updated.id ? updated : item));
        setSelectedEnquiry(updated);
        alert('Enquiry status and internal notes saved.');
      }
    } catch (e) {
      alert('Failed to update enquiry.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteEnquiry = async (id: string, ref: string) => {
    if (!window.confirm(`Delete enquiry ${ref}? This cannot be undone.`)) return;

    try {
      const res = await authFetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEnquiries(prev => prev.filter(e => e.id !== id));
        if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      }
    } catch (e) {
      console.error('Error deleting enquiry:', e);
    }
  };

  const exportCSV = () => {
    if (filtered.length === 0) return;

    const headers = ['Reference', 'Date', 'Customer Name', 'Company', 'Country', 'Email', 'WhatsApp', 'Product', 'Quantity', 'Packaging', 'Status', 'Assigned Staff', 'Message', 'Internal Notes'];
    const rows = filtered.map(e => [
      `"${e.enquiryReference}"`,
      `"${e.createdAt.split('T')[0]}"`,
      `"${e.fullName.replace(/"/g, '""')}"`,
      `"${(e.companyName || '').replace(/"/g, '""')}"`,
      `"${e.country.replace(/"/g, '""')}"`,
      `"${e.email}"`,
      `"${e.whatsapp || ''}"`,
      `"${e.productName.replace(/"/g, '""')}"`,
      `"${e.estimatedQuantity.replace(/"/g, '""')}"`,
      `"${(e.packagingRequirement || '').replace(/"/g, '""')}"`,
      `"${e.status}"`,
      `"${(e.assignedStaff || '').replace(/"/g, '""')}"`,
      `"${(e.message || '').replace(/"/g, '""')}"`,
      `"${(e.internalNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Falcon_Enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statuses = ['all', 'New', 'Contacted', 'Quotation Sent', 'Negotiating', 'Converted', 'Closed', 'Lost'];

  const filtered = enquiries.filter(e => {
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    const q = searchTerm.toLowerCase();
    const matchSearch =
      e.enquiryReference.toLowerCase().includes(q) ||
      e.fullName.toLowerCase().includes(q) ||
      (e.companyName || '').toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.country.toLowerCase().includes(q) ||
      e.productName.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-8 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#154736]/60 pb-5">
        <div>
          <span className="text-xs font-mono text-[#f2a900] uppercase tracking-wider block">
            Commercial Lead Pipeline
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcf0]">
            B2B Quotations & Enquiries
          </h1>
        </div>

        <button
          onClick={exportCSV}
          className="bg-[#05140f] hover:bg-[#0b2317] text-[#f2a900] border border-[#f2a900]/40 font-bold px-4 py-2.5 rounded-xl text-xs shadow flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#05140f] p-4 rounded-2xl border border-[#154736]/70 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#a3b899]" />
          <input
            type="text"
            placeholder="Search leads by ref, customer, company, country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#030d0a] text-[#fdfcf0] pl-9 pr-3 py-2 rounded-xl border border-[#154736] text-xs focus:outline-none focus:border-[#f2a900]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-[#f2a900] text-[#030d0a] font-bold'
                  : 'bg-[#030d0a] text-[#a3b899] border border-[#154736]'
              }`}
            >
              {st === 'all' ? 'All Leads' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-[#05140f] rounded-2xl border border-[#154736]/70 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#a3b899]">
            <thead className="bg-[#030d0a] text-[#f2a900] font-mono uppercase tracking-wider border-b border-[#154736]/80">
              <tr>
                <th className="py-3.5 px-4">Ref Number</th>
                <th className="py-3.5 px-4">Customer & Company</th>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Quantity</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#154736]/40">
              {filtered.map(enq => (
                <tr key={enq.id} className="hover:bg-[#0b2317]/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#fdfcf0]">
                    {enq.enquiryReference}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#fdfcf0] block">{enq.fullName}</span>
                    <span className="text-[10px] text-[#a3b899]">{enq.companyName || 'Private Procurement'}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#fdfcf0] font-medium">
                    {enq.productName}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#f2a900]">
                    {enq.estimatedQuantity}
                  </td>
                  <td className="py-3.5 px-4">{enq.country}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      enq.status === 'New'
                        ? 'bg-amber-500/20 text-[#f2a900] border border-amber-500/30'
                        : enq.status === 'Converted'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : enq.status === 'Lost' || enq.status === 'Closed'
                        ? 'bg-stone-800 text-stone-400'
                        : 'bg-[#154736] text-[#fdfcf0]'
                    }`}>
                      {enq.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenDetail(enq)}
                      className="px-2.5 py-1 bg-[#f2a900] hover:bg-[#d97706] text-[#030d0a] font-bold rounded-lg text-xs transition-colors"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => handleDeleteEnquiry(enq.id, enq.enquiryReference)}
                      className="p-1 text-red-400 hover:text-red-300 rounded"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiry Detail Drawer / Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030d0a]/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#05140f] border border-[#f2a900]/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 space-y-6 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-[#154736] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#f2a900] uppercase tracking-wider block">Lead Dossier</span>
                <h2 className="text-xl font-serif font-bold text-[#fdfcf0]">
                  Enquiry: {selectedEnquiry.enquiryReference}
                </h2>
              </div>
              <button onClick={() => setSelectedEnquiry(null)} className="text-[#a3b899] hover:text-[#fdfcf0]">
                ✕
              </button>
            </div>

            {/* Buyer Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#030d0a] p-4 rounded-xl border border-[#154736] text-xs">
              <div>
                <span className="text-[#a3b899] block">Buyer Name:</span>
                <span className="font-bold text-[#fdfcf0]">{selectedEnquiry.fullName}</span>
              </div>
              <div>
                <span className="text-[#a3b899] block">Company Name:</span>
                <span className="font-bold text-[#fdfcf0]">{selectedEnquiry.companyName || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-[#a3b899] block">Destination Port / Country:</span>
                <span className="font-bold text-[#fdfcf0]">{selectedEnquiry.country}</span>
              </div>
              <div>
                <span className="text-[#a3b899] block">Email:</span>
                <a href={`mailto:${selectedEnquiry.email}`} className="text-[#f2a900] underline">{selectedEnquiry.email}</a>
              </div>
              <div>
                <span className="text-[#a3b899] block">WhatsApp / Phone:</span>
                <span className="text-[#fdfcf0]">{selectedEnquiry.whatsapp || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-[#a3b899] block">Received Date:</span>
                <span className="text-[#fdfcf0] font-mono">{selectedEnquiry.createdAt}</span>
              </div>
            </div>

            {/* Consignment Scope */}
            <div className="bg-[#030d0a] p-4 rounded-xl border border-[#154736] text-xs space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#f2a900] block">Consignment Scope</span>
              <p><strong>Commodity:</strong> {selectedEnquiry.productName}</p>
              <p><strong>Requested Volume:</strong> {selectedEnquiry.estimatedQuantity}</p>
              <p><strong>Packaging Requirement:</strong> {selectedEnquiry.packagingRequirement}</p>
              {selectedEnquiry.message && (
                <div className="pt-2">
                  <span className="text-[#a3b899] block font-semibold">Buyer Message / Technical Notes:</span>
                  <div className="bg-[#05140f] p-3 rounded-lg border border-[#154736]/60 text-xs text-[#fdfcf0] mt-1 whitespace-pre-wrap">
                    {selectedEnquiry.message}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Management Controls */}
            <div className="space-y-4 pt-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#f2a900] font-mono mb-1">Pipeline Status</label>
                  <select
                    value={statusVal}
                    onChange={(e) => setStatusVal(e.target.value as EnquiryStatus)}
                    className="w-full bg-[#030d0a] text-[#fdfcf0] p-2.5 rounded-xl border border-[#154736] focus:border-[#f2a900] focus:outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Quotation Sent">Quotation Sent</option>
                    <option value="Negotiating">Negotiating</option>
                    <option value="Converted">Converted</option>
                    <option value="Closed">Closed</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#f2a900] font-mono mb-1">Assigned Sales Desk Officer</label>
                  <input
                    type="text"
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    placeholder="e.g. Rahul Sharma (Export Desk)"
                    className="w-full bg-[#030d0a] text-[#fdfcf0] p-2.5 rounded-xl border border-[#154736] focus:border-[#f2a900] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#f2a900] font-mono mb-1">Internal Notes & Quotation Log</label>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Record quote pricing, shipping line rate quotes, lab test notes..."
                  className="w-full bg-[#030d0a] text-[#fdfcf0] p-2.5 rounded-xl border border-[#154736] focus:border-[#f2a900] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#154736]">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-2 rounded-xl bg-[#030d0a] text-[#a3b899] border border-[#154736]"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={handleUpdateEnquiry}
                  className="px-5 py-2 rounded-xl bg-[#f2a900] text-[#030d0a] font-bold shadow"
                >
                  {updating ? 'Saving...' : 'Save Pipeline Changes'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
