import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Send, ShieldCheck, Mail, Phone, Building2, Globe } from 'lucide-react';
import { submitQuoteEnquiry } from '../lib/storage';
import { COMPANY_INFO } from '../data/company';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, initialProduct }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    country: '',
    email: '',
    whatsapp: '',
    productName: initialProduct || 'Turmeric Powder',
    estimatedQuantity: '1 Metric Ton',
    packagingRequirement: '25kg Multi-wall Kraft Paper Bags',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialProduct) {
      setFormData(prev => ({ ...prev, productName: initialProduct }));
    }
  }, [initialProduct]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName || !formData.email || !formData.country) {
      setErrorMsg('Please complete your name, company email, and country.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitQuoteEnquiry(formData);
      if (res.success) {
        setSuccess(true);
      } else {
        setErrorMsg(res.message || 'Error submitting quote request.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again or contact via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSuccess(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030d0a]/80 backdrop-blur-sm overflow-y-auto font-sans animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#082018] border border-[#f2a900]/40 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-[#05140f] px-6 py-5 border-b border-[#154736] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f2a900]"></span>
              <span className="text-xs font-semibold text-[#f2a900] uppercase tracking-widest">
                Official B2B Export Enquiry
              </span>
            </div>
            <h2 className="text-xl font-bold font-serif text-[#fdfcf0] tracking-tight mt-0.5">
              Request a Bulk Spice Quotation
            </h2>
          </div>
          
          <button
            onClick={resetAndClose}
            className="text-[#a3b899] hover:text-[#fdfcf0] p-2 rounded-lg bg-[#082018] border border-[#154736]"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {success ? (
            /* Success State */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-[#154736]/40 border border-[#f2a900] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-[#f2a900]" />
              </div>
              <h3 className="text-2xl font-bold text-[#fdfcf0] font-serif">
                Enquiry Received Successfully!
              </h3>
              <p className="text-[#a3b899] text-sm max-w-md mx-auto leading-relaxed">
                Thank you for contacting Falcon International Traders. Our export sales team is reviewing your specification requirements for <span className="text-[#f2a900] font-semibold">{formData.productName}</span> and will send an official quotation to <span className="text-[#fdfcf0] font-mono">{formData.email}</span> within 24 business hours.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/919876543210?text=Hello%20Falcon,%20I%20just%20submitted%20a%20quote%20request%20for%20${encodeURIComponent(formData.productName)}.%20Ref:%20${encodeURIComponent(formData.fullName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0d3126] hover:bg-[#154736] text-[#fdfcf0] font-semibold px-5 py-2.5 rounded-lg text-sm border border-[#154736] flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#f2a900]" />
                  <span>Accelerate via WhatsApp</span>
                </a>

                <button
                  onClick={resetAndClose}
                  className="bg-[#f2a900] hover:bg-[#d99700] text-[#05140f] font-bold px-6 py-2.5 rounded-lg text-sm shadow"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Enquiry Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {errorMsg && (
                <div className="p-3 bg-[#c41e3a]/20 border border-[#c41e3a]/50 text-[#fdfcf0] text-xs rounded-lg">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-[#f2a900] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alexander Vance"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#05140f] text-[#fdfcf0] px-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm placeholder-[#a3b899]/50"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-medium text-[#f2a900] mb-1">
                    Company / Organization
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-3 text-[#a3b899]/50" />
                    <input
                      type="text"
                      placeholder="e.g. Apex Food Ingredients Importers"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-[#05140f] text-[#fdfcf0] pl-9 pr-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm placeholder-[#a3b899]/50"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Business Email */}
                <div>
                  <label className="block text-xs font-medium text-[#f2a900] mb-1">
                    Business Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-[#a3b899]/50" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. purchasing@apexfoods.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#05140f] text-[#fdfcf0] pl-9 pr-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm placeholder-[#a3b899]/50"
                    />
                  </div>
                </div>

                {/* WhatsApp / Phone */}
                <div>
                  <label className="block text-xs font-medium text-[#f2a900] mb-1">
                    WhatsApp / Direct Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-[#a3b899]/50" />
                    <input
                      type="text"
                      placeholder="e.g. +49 170 1234567"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full bg-[#05140f] text-[#fdfcf0] pl-9 pr-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm placeholder-[#a3b899]/50"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Destination Country */}
                <div>
                  <label className="block text-xs font-medium text-[#f2a900] mb-1">
                    Destination Country / Port *
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 absolute left-3 top-3 text-[#a3b899]/50" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Germany (Rotterdam / Hamburg)"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full bg-[#05140f] text-[#fdfcf0] pl-9 pr-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm placeholder-[#a3b899]/50"
                    />
                  </div>
                </div>

                {/* Product Interested In */}
                <div>
                  <label className="block text-xs font-medium text-[#f2a900] mb-1">
                    Spice Product Required *
                  </label>
                  <select
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="w-full bg-[#05140f] text-[#fdfcf0] px-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm"
                  >
                    <option value="Premium Turmeric Powder">Premium Turmeric Powder (High Curcumin)</option>
                    <option value="Indian Red Chilli Powder">Indian Red Chilli Powder (Teja / Byadgi)</option>
                    <option value="Cumin Seeds & Ground Powder">Cumin Seeds & Ground Powder</option>
                    <option value="Dehydrated Garlic Powder">Dehydrated Garlic Powder & Granules</option>
                    <option value="Black Pepper (Tellicherry)">Tellicherry & Malabar Black Pepper</option>
                    <option value="Green Cardamom">Green Cardamom Pods (7mm / 8mm+)</option>
                    <option value="Custom Spice Blend / Private Label">Custom Spice Blend / Private Label OEM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Estimated Quantity */}
                <div>
                  <label className="block text-xs font-medium text-[#f2a900] mb-1">
                    Estimated Order Quantity
                  </label>
                  <select
                    value={formData.estimatedQuantity}
                    onChange={(e) => setFormData({ ...formData, estimatedQuantity: e.target.value })}
                    className="w-full bg-[#05140f] text-[#fdfcf0] px-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm"
                  >
                    <option value="Sample Request (100g - 500g)">Sample Request (100g - 500g)</option>
                    <option value="1 Metric Ton (1,000 kg)">1 Metric Ton (1,000 kg LCL)</option>
                    <option value="5 Metric Tons">5 Metric Tons</option>
                    <option value="1x20ft Container (approx 14 - 18 MT)">1x20ft Container (approx 14 - 18 MT)</option>
                    <option value="Multiple Containers / Annual Contract">Multiple Containers / Annual Contract</option>
                  </select>
                </div>

                {/* Packaging Preference */}
                <div>
                  <label className="block text-xs font-medium text-[#f2a900] mb-1">
                    Packaging Preference
                  </label>
                  <select
                    value={formData.packagingRequirement}
                    onChange={(e) => setFormData({ ...formData, packagingRequirement: e.target.value })}
                    className="w-full bg-[#05140f] text-[#fdfcf0] px-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm"
                  >
                    <option value="25kg Multi-wall Kraft Paper Bags">25kg Multi-wall Kraft Paper Bags</option>
                    <option value="25kg / 50kg PP Woven Bags">25kg / 50kg PP Woven Bags</option>
                    <option value="10kg Vacuum Sealed Cartons">10kg Vacuum Sealed Cartons</option>
                    <option value="Custom Printed Retail Pouches (Private Label)">Custom Printed Retail Pouches (Private Label)</option>
                    <option value="1000kg Jumbo Super Sacks">1000kg Jumbo Super Sacks</option>
                  </select>
                </div>
              </div>

              {/* Message / Specific Parameters */}
              <div>
                <label className="block text-xs font-medium text-[#f2a900] mb-1">
                  Specific Requirements / ASTA / Mesh / Target Price
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention any specific parameters (e.g., Curcumin %, Scoville Heat Units, steam sterilization requirements, port of discharge)..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#05140f] text-[#fdfcf0] px-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm placeholder-[#a3b899]/50"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <span className="text-[11px] text-[#a3b899] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#f2a900]" />
                  <span>Strict B2B Confidentiality Guaranteed</span>
                </span>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#f2a900] hover:bg-[#d99700] text-[#05140f] font-bold px-6 py-3 rounded-lg shadow-lg text-sm flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>Send Official Enquiry</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
