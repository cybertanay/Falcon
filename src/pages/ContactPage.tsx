import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, Building2, Globe, Clock } from 'lucide-react';
import { COMPANY_INFO } from '../data/company';
import { submitQuoteEnquiry } from '../lib/storage';
import { trackEvent } from '../lib/analytics';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    country: '',
    email: '',
    whatsapp: '',
    productName: '',
    estimatedQuantity: '',
    packagingRequirement: '',
    message: '',
    website_hp: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName || !formData.email || !formData.country) {
      setErrorMsg('Please enter your full name, business email, and destination country.');
      return;
    }

    if (!formData.productName) {
      setErrorMsg('Please select the spice product you are inquiring about.');
      return;
    }

    if (!formData.estimatedQuantity) {
      setErrorMsg('Please select your estimated order volume.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitQuoteEnquiry(formData);
      if (res.success && res.enquiry) {
        setGeneratedRef(res.enquiry.enquiryReference || '');
        setSubmitted(true);
        trackEvent('contact_submitted', {
          reference: res.enquiry.enquiryReference,
          product: formData.productName,
          country: formData.country
        });
      } else {
        setErrorMsg(res.message || 'Error submitting enquiry. Please check your details.');
      }
    } catch (err) {
      setErrorMsg('Network issue. We could not reach the server. Please try again or reach us directly on WhatsApp or Email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-transparent text-[#fdfcf0] py-12 px-4 sm:px-6 lg:px-8 space-y-16 font-sans max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f2a900] uppercase tracking-widest bg-[#082018] px-3 py-1 rounded-full border border-[#f2a900]/30">
          <Mail className="w-3.5 h-3.5" />
          <span>International Trade Desk</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#fdfcf0] tracking-tight">
          Contact Falcon International Traders
        </h1>
        <p className="text-[#a3b899] text-sm sm:text-base font-light leading-relaxed">
          Reach our international export desk for custom spice quotations, COA requests, sample shipments, or private-label consultations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Direct Company Contact Info */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="bg-[#082018] p-6 sm:p-8 rounded-2xl border border-[#154736] space-y-6 shadow-xl">
            <h2 className="text-2xl font-bold font-serif text-[#fdfcf0] border-b border-[#154736] pb-3">
              Direct Contact Details
            </h2>

            <div className="space-y-4 text-sm text-[#a3b899]">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#f2a900] shrink-0 mt-1" />
                <div>
                  <span className="text-xs text-[#a3b899]/70 block font-semibold">Official Business Email</span>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="text-[#f2a900] font-mono hover:underline text-sm">
                    {COMPANY_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#f2a900] shrink-0 mt-1" />
                <div>
                  <span className="text-xs text-[#a3b899]/70 block font-semibold">WhatsApp & Export Hotline</span>
                  <a href={COMPANY_INFO.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="text-[#fdfcf0] font-mono hover:underline text-sm">
                    {COMPANY_INFO.whatsapp}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#f2a900] shrink-0 mt-1" />
                <div>
                  <span className="text-xs text-[#a3b899]/70 block font-semibold">Corporate Head Office & Export Hub</span>
                  <span className="text-[#fdfcf0] text-sm block">
                    {COMPANY_INFO.address}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-[#154736]">
                <Clock className="w-5 h-5 text-[#f2a900] shrink-0 mt-1" />
                <div>
                  <span className="text-xs text-[#a3b899]/70 block font-semibold">Operating Hours & SLA</span>
                  <span className="text-[#a3b899] text-xs block">
                    Monday – Saturday (09:00 - 19:00 IST). Email enquiries answered within 24 hours.
                  </span>
                </div>
              </div>
            </div>

            <a
              href={COMPANY_INFO.socials.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#154736] hover:bg-[#1c5d47] text-[#fdfcf0] font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow border border-[#f2a900]/30 transition-all"
            >
              <Phone className="w-4 h-4 text-[#f2a900]" />
              <span>Direct WhatsApp Instant Connect</span>
            </a>
          </div>

          {/* Export Terminal Hub */}
          <div className="bg-[#082018] rounded-2xl border border-[#f2a900]/30 p-5 space-y-3">
            <span className="text-xs font-semibold text-[#f2a900] block uppercase tracking-wider">
              Export Terminal & Shipping Gateways
            </span>
            <div className="p-4 rounded-xl bg-[#05140f] border border-[#154736] space-y-2 text-xs text-[#a3b899]">
              <div className="flex items-center justify-between text-[#fdfcf0] font-semibold border-b border-[#154736] pb-2">
                <span>Primary Sea Freight Gateways</span>
                <span className="text-[#f2a900] font-mono text-[11px]">JNPT / COCHIN</span>
              </div>
              <p className="leading-relaxed">
                Consignments dispatched via Jawaharlal Nehru Port (JNPT Mumbai) and Cochin Port (Kerala) with direct container freight handling, phytosanitary inspection, and temperature-controlled pre-shipment warehousing.
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: Premium B2B Enquiry Form */}
        <div className="lg:col-span-7 bg-[#082018] p-6 sm:p-8 rounded-2xl border border-[#154736] shadow-2xl">
          
          <div className="border-b border-[#154736] pb-4 mb-6">
            <h2 className="text-2xl font-bold font-serif text-[#fdfcf0]">
              Send Official Trade Enquiry
            </h2>
            <p className="text-[#a3b899] text-xs font-light">
              Submit your specific spice requirements to receive a formal quotation with FOB/CIF pricing.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-[#154736]/40 border border-[#f2a900] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-[#f2a900]" />
              </div>
              <h3 className="text-2xl font-bold text-[#fdfcf0] font-serif">
                Trade Enquiry Received
              </h3>

              {generatedRef && (
                <div className="inline-block bg-[#05140f] px-4 py-2 rounded-lg border border-[#f2a900]/50 my-2">
                  <span className="text-xs text-[#a3b899] block">Official Enquiry Reference:</span>
                  <span className="font-mono text-base font-bold text-[#f2a900]">{generatedRef}</span>
                </div>
              )}

              <p className="text-[#a3b899] text-sm max-w-md mx-auto leading-relaxed">
                Thank you for reaching out to Falcon International Traders. Our export sales manager will process your request for <span className="text-[#f2a900] font-semibold">{formData.productName}</span> and contact you at <span className="text-[#fdfcf0] font-mono">{formData.email}</span> shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setGeneratedRef('');
                }}
                className="bg-[#f2a900] hover:bg-[#d99700] text-[#05140f] font-bold px-6 py-2.5 rounded-lg text-xs shadow"
              >
                Send Another Enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {errorMsg && (
                <div className="p-4 bg-[#c41e3a]/15 border border-[#c41e3a]/60 text-[#fdfcf0] text-xs rounded-xl space-y-2">
                  <div className="font-semibold text-[#ff8080]">
                    {errorMsg}
                  </div>
                  <p className="text-[#a3b899] text-[11px]">
                    Your information is preserved. You can also reach our export desk directly:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href={COMPANY_INFO.socials.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#0d3126] px-3 py-1.5 rounded-lg text-xs font-semibold text-[#f2a900] border border-[#154736]"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>WhatsApp Hotline ({COMPANY_INFO.whatsapp})</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Anti-spam Honeypot */}
              <input
                type="text"
                name="website_hp"
                value={formData.website_hp}
                onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
                style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#f2a900] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#05140f] text-[#fdfcf0] px-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm placeholder-[#a3b899]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#f2a900] mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-[#05140f] text-[#fdfcf0] px-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm placeholder-[#a3b899]/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#f2a900] mb-1">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#05140f] text-[#fdfcf0] px-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm placeholder-[#a3b899]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#f2a900] mb-1">
                    WhatsApp / Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+1 234 567 890"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full bg-[#05140f] text-[#fdfcf0] px-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm placeholder-[#a3b899]/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#f2a900] mb-1">
                    Destination Country / Port *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Netherlands (Rotterdam)"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-[#05140f] text-[#fdfcf0] px-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm placeholder-[#a3b899]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#f2a900] mb-1">
                    Product Interest *
                  </label>
                  <select
                    required
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="w-full bg-[#05140f] text-[#fdfcf0] px-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm"
                  >
                    <option value="">-- Select Spice Product --</option>
                    <option value="Premium Turmeric Powder">Premium Turmeric Powder</option>
                    <option value="Indian Red Chilli Powder">Indian Red Chilli Powder</option>
                    <option value="Cumin Seeds & Ground Powder">Cumin Seeds & Ground Powder</option>
                    <option value="Dehydrated Garlic Powder">Dehydrated Garlic Powder</option>
                    <option value="Black Pepper">Tellicherry Black Pepper</option>
                    <option value="Green Cardamom">Green Cardamom Pods</option>
                    <option value="Private Label OEM">Private Label OEM Custom Project</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#f2a900] mb-1">
                    Estimated Order Quantity *
                  </label>
                  <select
                    required
                    value={formData.estimatedQuantity}
                    onChange={(e) => setFormData({ ...formData, estimatedQuantity: e.target.value })}
                    className="w-full bg-[#05140f] text-[#fdfcf0] px-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm"
                  >
                    <option value="">-- Select Order Volume --</option>
                    <option value="Sample Request">Lab Sample Request (100g - 500g)</option>
                    <option value="1 Metric Ton">1 Metric Ton (1,000 kg)</option>
                    <option value="5 Metric Tons">5 Metric Tons</option>
                    <option value="1x20ft Container (14-18 MT)">1x20ft Container (14-18 MT)</option>
                    <option value="Multiple Containers FCL">Multiple Containers FCL Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#f2a900] mb-1">
                    Packaging Requirement
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 25kg Kraft bags / Private label pouches"
                    value={formData.packagingRequirement}
                    onChange={(e) => setFormData({ ...formData, packagingRequirement: e.target.value })}
                    className="w-full bg-[#05140f] text-[#fdfcf0] px-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm placeholder-[#a3b899]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#f2a900] mb-1">
                  Message / Specifications Needed
                </label>
                <textarea
                  rows={4}
                  placeholder="Mention Curcumin %, Scoville heat units, mesh size, target delivery schedule, or shipping terms (FOB/CIF)..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#05140f] text-[#fdfcf0] px-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm placeholder-[#a3b899]/50"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-[#a3b899] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#f2a900]" />
                  <span>Verified B2B Direct Processing</span>
                </span>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#f2a900] hover:bg-[#d99700] text-[#05140f] font-bold px-6 py-3 rounded-lg shadow-lg text-sm flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Send Enquiry</span>
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
