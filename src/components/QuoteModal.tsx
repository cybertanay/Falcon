import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Send, Mail, Phone, Building2, Globe, AlertCircle } from 'lucide-react';
import { submitQuoteEnquiry } from '../lib/storage';
import { COMPANY_INFO, whatsappLink } from '../data/company';
import { trackEvent } from '../lib/analytics';
import { useDialogFocus } from '../lib/useDialogFocus';
import { FormPrivacyNotice } from './FormPrivacyNotice';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: string;
}

const PRODUCT_OPTIONS = [
  { value: 'Premium Turmeric Powder', label: 'Premium Turmeric Powder (High Curcumin)' },
  { value: 'Indian Red Chilli Powder', label: 'Indian Red Chilli Powder (Teja / Byadgi)' },
  { value: 'Cumin Seeds & Ground Powder', label: 'Cumin Seeds & Ground Powder' },
  { value: 'Dehydrated Garlic Powder', label: 'Dehydrated Garlic Powder & Granules' },
  { value: 'Black Pepper (Tellicherry)', label: 'Tellicherry & Malabar Black Pepper' },
  { value: 'Green Cardamom', label: 'Green Cardamom Pods (7mm / 8mm+)' },
  { value: 'Custom Spice Blend / Private Label', label: 'Custom Spice Blend / Private Label OEM' }
];

const inputClass =
  'w-full bg-[#05140f] text-[#fdfcf0] px-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f2a900] text-sm placeholder-[#a3b899]/70';
const labelClass = 'block text-xs font-medium text-[#f2a900] mb-1';

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, initialProduct }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    country: '',
    email: '',
    whatsapp: '',
    productName: initialProduct || '',
    estimatedQuantity: '',
    packagingRequirement: '',
    message: '',
    website_hp: '' // Honeypot trap
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialProduct) {
      setFormData(prev => ({ ...prev, productName: initialProduct }));
    }
    if (isOpen) {
      trackEvent('quote_opened', { initialProduct });
    }
  }, [initialProduct, isOpen]);

  const resetAndClose = () => {
    setSuccess(false);
    setErrorMsg('');
    setGeneratedRef('');
    onClose();
  };

  const dialogRef = useDialogFocus<HTMLDivElement>(isOpen, resetAndClose);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName || !formData.email || !formData.country) {
      setErrorMsg('Please complete your name, business email, and destination country.');
      return;
    }

    if (!formData.productName) {
      setErrorMsg('Please select the spice product you require.');
      return;
    }

    if (!formData.estimatedQuantity) {
      setErrorMsg('Please select your estimated order quantity.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitQuoteEnquiry(formData);
      if (res.success && res.enquiry) {
        setGeneratedRef(res.enquiry.enquiryReference || '');
        setSuccess(true);
        trackEvent('quote_submitted', {
          productName: formData.productName,
          quantity: formData.estimatedQuantity
        });
      } else {
        setErrorMsg(res.message || 'Error submitting quote request. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network connectivity issue. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFormData({ ...formData, [field]: e.target.value });

  // Products passed in from other pages (e.g. "Private Label Project") must stay visible in the select
  const productOptions = formData.productName && !PRODUCT_OPTIONS.some(o => o.value === formData.productName)
    ? [{ value: formData.productName, label: formData.productName }, ...PRODUCT_OPTIONS]
    : PRODUCT_OPTIONS;

  const successWhatsapp = whatsappLink(`Hello Falcon International Traders, I just submitted an export quote request for ${formData.productName}. Reference: ${generatedRef}`);
  const errorWhatsapp = whatsappLink(`Hello Falcon, I encountered an issue submitting the website form. I am interested in ${formData.productName || 'spices'} for ${formData.country || 'export'}.`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030d0a]/80 backdrop-blur-sm overflow-y-auto font-sans animate-fade-in">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-modal-title"
        tabIndex={-1}
        className="relative w-full max-w-2xl bg-[#082018] border border-[#f2a900]/40 rounded-2xl shadow-2xl overflow-hidden my-8 focus:outline-none"
      >

        {/* Modal Header */}
        <div className="bg-[#05140f] px-6 py-5 border-b border-[#154736] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f2a900]" aria-hidden="true"></span>
              <span className="text-xs font-semibold text-[#f2a900] uppercase tracking-widest">
                B2B Export Enquiry
              </span>
            </div>
            <h2 id="quote-modal-title" className="text-xl font-bold font-serif text-[#fdfcf0] tracking-tight mt-0.5">
              Request a Bulk Spice Quotation
            </h2>
          </div>

          <button
            type="button"
            onClick={resetAndClose}
            className="text-[#a3b899] hover:text-[#fdfcf0] p-2 rounded-lg bg-[#082018] border border-[#154736]"
            aria-label="Close quotation form"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">

          {success ? (
            /* Success State */
            <div className="text-center py-8 space-y-4" role="status">
              <div className="w-16 h-16 bg-[#154736]/40 border border-[#f2a900] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-[#f2a900]" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-[#fdfcf0] font-serif">
                Enquiry Received
              </h3>

              {generatedRef && (
                <div className="inline-block bg-[#05140f] px-4 py-2 rounded-lg border border-[#f2a900]/50 my-2">
                  <span className="text-xs text-[#a3b899] block">Enquiry Reference:</span>
                  <span className="font-mono text-base font-bold text-[#f2a900]">{generatedRef}</span>
                </div>
              )}

              <p className="text-[#a3b899] text-sm max-w-md mx-auto leading-relaxed">
                Thank you for contacting Falcon International Traders. Our export team will review your request for <span className="text-[#f2a900] font-semibold">{formData.productName}</span> and reply to <span className="text-[#fdfcf0] font-mono">{formData.email}</span>. This is an enquiry, not an order: prices and terms apply only once confirmed in a written quotation and sales contract.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                {successWhatsapp && (
                  <a
                    href={successWhatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0d3126] hover:bg-[#154736] text-[#fdfcf0] font-semibold px-5 py-2.5 rounded-lg text-sm border border-[#154736] flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-[#f2a900]" aria-hidden="true" />
                    <span>Follow up on WhatsApp</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={resetAndClose}
                  className="bg-[#f2a900] hover:bg-[#d99700] text-[#05140f] font-bold px-6 py-2.5 rounded-lg text-sm shadow"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Enquiry Form */
            <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-describedby="quote-form-required quote-form-notice">

              <p id="quote-form-required" className="text-[11px] text-[#a3b899]">
                Fields marked <span aria-hidden="true">*</span><span className="sr-only">with an asterisk</span> are required.
              </p>

              {/* Error Banner with Direct Fallback Links */}
              {errorMsg && (
                <div role="alert" className="p-4 bg-[#c41e3a]/15 border border-[#c41e3a]/60 text-[#fdfcf0] text-xs rounded-xl space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-[#ff8080]">
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{errorMsg}</span>
                  </div>
                  <p className="text-[#a3b899] text-[11px]">
                    Your entered information has been kept. If the issue persists, contact our export desk directly{(errorWhatsapp || COMPANY_INFO.email) ? ':' : ' later.'}
                  </p>
                  {(errorWhatsapp || COMPANY_INFO.email) && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {errorWhatsapp && (
                        <a
                          href={errorWhatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-[#0d3126] px-3 py-1.5 rounded-lg text-xs font-semibold text-[#f2a900] border border-[#154736]"
                        >
                          <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>WhatsApp ({COMPANY_INFO.whatsapp})</span>
                        </a>
                      )}
                      {COMPANY_INFO.email && (
                        <a
                          href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(`Export Quote Request - ${formData.productName || 'Spices'}`)}&body=${encodeURIComponent(`Name: ${formData.fullName}\nCompany: ${formData.companyName}\nCountry: ${formData.country}\nQuantity: ${formData.estimatedQuantity}\nMessage: ${formData.message}`)}`}
                          className="inline-flex items-center gap-1.5 bg-[#05140f] px-3 py-1.5 rounded-lg text-xs font-semibold text-[#fdfcf0] border border-[#154736]"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#f2a900]" aria-hidden="true" />
                          <span>Email ({COMPANY_INFO.email})</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Anti-spam Honeypot (hidden from all users, including assistive technology) */}
              <input
                type="text"
                name="website_hp"
                value={formData.website_hp}
                onChange={update('website_hp')}
                style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="quote-fullName" className={labelClass}>
                    Full Name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="quote-fullName"
                    type="text"
                    required
                    aria-required="true"
                    autoComplete="name"
                    maxLength={100}
                    placeholder="e.g. Alexander Vance"
                    value={formData.fullName}
                    onChange={update('fullName')}
                    className={inputClass}
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label htmlFor="quote-companyName" className={labelClass}>
                    Company / Organization (optional)
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-3 text-[#a3b899]/50" aria-hidden="true" />
                    <input
                      id="quote-companyName"
                      type="text"
                      autoComplete="organization"
                      maxLength={150}
                      placeholder="e.g. Apex Food Ingredients Importers"
                      value={formData.companyName}
                      onChange={update('companyName')}
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Business Email */}
                <div>
                  <label htmlFor="quote-email" className={labelClass}>
                    Business Email <span aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-[#a3b899]/50" aria-hidden="true" />
                    <input
                      id="quote-email"
                      type="email"
                      required
                      aria-required="true"
                      autoComplete="email"
                      maxLength={150}
                      placeholder="e.g. purchasing@apexfoods.com"
                      value={formData.email}
                      onChange={update('email')}
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>

                {/* WhatsApp / Phone */}
                <div>
                  <label htmlFor="quote-whatsapp" className={labelClass}>
                    WhatsApp / Phone (optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-[#a3b899]/50" aria-hidden="true" />
                    <input
                      id="quote-whatsapp"
                      type="tel"
                      autoComplete="tel"
                      maxLength={50}
                      placeholder="e.g. +49 170 1234567"
                      value={formData.whatsapp}
                      onChange={update('whatsapp')}
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Destination Country */}
                <div>
                  <label htmlFor="quote-country" className={labelClass}>
                    Destination Country / Discharge Port <span aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 absolute left-3 top-3 text-[#a3b899]/50" aria-hidden="true" />
                    <input
                      id="quote-country"
                      type="text"
                      required
                      aria-required="true"
                      autoComplete="country-name"
                      maxLength={100}
                      placeholder="e.g. Germany (Hamburg)"
                      value={formData.country}
                      onChange={update('country')}
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>

                {/* Product Interested In */}
                <div>
                  <label htmlFor="quote-product" className={labelClass}>
                    Spice Product Required <span aria-hidden="true">*</span>
                  </label>
                  <select
                    id="quote-product"
                    required
                    aria-required="true"
                    value={formData.productName}
                    onChange={update('productName')}
                    className={inputClass}
                  >
                    <option value="">-- Select Spice Product --</option>
                    {productOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Estimated Quantity */}
                <div>
                  <label htmlFor="quote-quantity" className={labelClass}>
                    Estimated Order Volume <span aria-hidden="true">*</span>
                  </label>
                  <select
                    id="quote-quantity"
                    required
                    aria-required="true"
                    value={formData.estimatedQuantity}
                    onChange={update('estimatedQuantity')}
                    className={inputClass}
                  >
                    <option value="">-- Select Order Volume --</option>
                    <option value="Sample Request (100g - 500g)">Sample Request (100g - 500g)</option>
                    <option value="1 Metric Ton (1,000 kg)">1 Metric Ton (1,000 kg LCL)</option>
                    <option value="5 Metric Tons">5 Metric Tons</option>
                    <option value="1x20ft Container (approx 14 - 18 MT)">1x20ft Container (approx 14 - 18 MT)</option>
                    <option value="Multiple Containers / Annual Contract">Multiple Containers / Annual Contract</option>
                  </select>
                </div>

                {/* Packaging Preference */}
                <div>
                  <label htmlFor="quote-packaging" className={labelClass}>
                    Packaging Preference (optional)
                  </label>
                  <select
                    id="quote-packaging"
                    value={formData.packagingRequirement}
                    onChange={update('packagingRequirement')}
                    className={inputClass}
                  >
                    <option value="">-- Standard Export Packaging --</option>
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
                <label htmlFor="quote-message" className={labelClass}>
                  Specific Requirements / ASTA / Mesh / Target Pricing (optional)
                </label>
                <textarea
                  id="quote-message"
                  rows={3}
                  maxLength={2000}
                  placeholder="Mention any specific parameters (e.g., Curcumin %, Scoville Heat Units, steam treatment, port of discharge)..."
                  value={formData.message}
                  onChange={update('message')}
                  className={inputClass}
                ></textarea>
              </div>

              <FormPrivacyNotice id="quote-form-notice" />

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="bg-[#f2a900] hover:bg-[#d99700] text-[#05140f] font-bold px-6 py-2.5 rounded-lg text-sm shadow flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting Enquiry...</span>
                  ) : (
                    <>
                      <span>Submit Enquiry</span>
                      <Send className="w-4 h-4" aria-hidden="true" />
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
