import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { COMPANY_INFO, CONTACT_PENDING_TEXT } from '../data/company';
import { submitQuoteEnquiry } from '../lib/storage';
import { trackEvent } from '../lib/analytics';
import { FormPrivacyNotice } from '../components/FormPrivacyNotice';

const inputClass =
  'w-full bg-[#05140f] text-[#fdfcf0] px-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f2a900] text-sm placeholder-[#a3b899]/70';
const labelClass = 'block text-xs font-medium text-[#f2a900] mb-1';

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
          product: formData.productName
        });
      } else {
        setErrorMsg(res.message || 'Error submitting enquiry. Please check your details.');
      }
    } catch (err) {
      setErrorMsg('Network issue. We could not reach the server. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFormData({ ...formData, [field]: e.target.value });

  const hasDirectContact = Boolean(COMPANY_INFO.email || COMPANY_INFO.socials.whatsapp);

  return (
    <div className="bg-transparent text-[#fdfcf0] py-12 px-4 sm:px-6 lg:px-8 space-y-16 font-sans max-w-7xl mx-auto">

      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f2a900] uppercase tracking-widest bg-[#082018] px-3 py-1 rounded-full border border-[#f2a900]/30">
          <Mail className="w-3.5 h-3.5" aria-hidden="true" />
          <span>International Trade Desk</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#fdfcf0] tracking-tight">
          Contact Falcon International Traders
        </h1>
        <p className="text-[#a3b899] text-sm sm:text-base font-light leading-relaxed">
          Contact our export team about quotations, specifications, samples or private-label projects.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Left Column: Direct Company Contact Info */}
        <div className="lg:col-span-5 space-y-8">

          <div className="bg-[#082018] p-6 sm:p-8 rounded-2xl border border-[#154736] space-y-6 shadow-xl">
            <h2 className="text-2xl font-bold font-serif text-[#fdfcf0] border-b border-[#154736] pb-3">
              Direct Contact Details
            </h2>

            {!hasDirectContact && !COMPANY_INFO.address ? (
              <p className="text-sm text-[#a3b899]">
                {CONTACT_PENDING_TEXT}. Please use the enquiry form and our export team will reply by email.
              </p>
            ) : (
              <div className="space-y-4 text-sm text-[#a3b899]">
                {COMPANY_INFO.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#f2a900] shrink-0 mt-1" aria-hidden="true" />
                    <div>
                      <span className="text-xs text-[#a3b899] block font-semibold">Business Email</span>
                      <a href={`mailto:${COMPANY_INFO.email}`} className="text-[#f2a900] font-mono hover:underline text-sm">
                        {COMPANY_INFO.email}
                      </a>
                    </div>
                  </div>
                )}

                {COMPANY_INFO.socials.whatsapp && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#f2a900] shrink-0 mt-1" aria-hidden="true" />
                    <div>
                      <span className="text-xs text-[#a3b899] block font-semibold">WhatsApp</span>
                      <a href={COMPANY_INFO.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="text-[#fdfcf0] font-mono hover:underline text-sm">
                        {COMPANY_INFO.whatsapp}
                        <span className="sr-only"> (opens WhatsApp in a new tab)</span>
                      </a>
                    </div>
                  </div>
                )}

                {COMPANY_INFO.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#f2a900] shrink-0 mt-1" aria-hidden="true" />
                    <div>
                      <span className="text-xs text-[#a3b899] block font-semibold">Address</span>
                      <span className="text-[#fdfcf0] text-sm block">
                        {COMPANY_INFO.address}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Export Ports */}
          <div className="bg-[#082018] rounded-2xl border border-[#f2a900]/30 p-5 space-y-3">
            <h2 className="text-xs font-semibold text-[#f2a900] block uppercase tracking-wider">
              Export Ports
            </h2>
            <div className="p-4 rounded-xl bg-[#05140f] border border-[#154736] space-y-2 text-xs text-[#a3b899]">
              <p className="leading-relaxed">
                Quotations can be prepared for shipment from Indian ports such as Jawaharlal Nehru Port (Nhava Sheva, Mumbai) and Cochin Port (Kerala). The port of loading is confirmed in each quotation.
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: B2B Enquiry Form */}
        <div className="lg:col-span-7 bg-[#082018] p-6 sm:p-8 rounded-2xl border border-[#154736] shadow-2xl">

          <div className="border-b border-[#154736] pb-4 mb-6">
            <h2 className="text-2xl font-bold font-serif text-[#fdfcf0]">
              Send a Trade Enquiry
            </h2>
            <p className="text-[#a3b899] text-xs font-light">
              Tell us your requirements and our export team will reply with next steps or a quotation.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12 space-y-4" role="status">
              <div className="w-16 h-16 bg-[#154736]/40 border border-[#f2a900] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-[#f2a900]" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-[#fdfcf0] font-serif">
                Trade Enquiry Received
              </h3>

              {generatedRef && (
                <div className="inline-block bg-[#05140f] px-4 py-2 rounded-lg border border-[#f2a900]/50 my-2">
                  <span className="text-xs text-[#a3b899] block">Enquiry Reference:</span>
                  <span className="font-mono text-base font-bold text-[#f2a900]">{generatedRef}</span>
                </div>
              )}

              <p className="text-[#a3b899] text-sm max-w-md mx-auto leading-relaxed">
                Thank you for contacting Falcon International Traders. Our export team will review your request for <span className="text-[#f2a900] font-semibold">{formData.productName}</span> and reply to <span className="text-[#fdfcf0] font-mono">{formData.email}</span>. This is an enquiry, not an order.
              </p>
              <button
                type="button"
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
            <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-describedby="contact-form-required contact-form-notice">

              <p id="contact-form-required" className="text-[11px] text-[#a3b899]">
                Fields marked <span aria-hidden="true">*</span><span className="sr-only">with an asterisk</span> are required.
              </p>

              {errorMsg && (
                <div role="alert" className="p-4 bg-[#c41e3a]/15 border border-[#c41e3a]/60 text-[#fdfcf0] text-xs rounded-xl space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-[#ff8080]">
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{errorMsg}</span>
                  </div>
                  <p className="text-[#a3b899] text-[11px]">
                    Your information has been kept{hasDirectContact ? '. You can also reach our export desk directly:' : '.'}
                  </p>
                  {hasDirectContact && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {COMPANY_INFO.socials.whatsapp && (
                        <a
                          href={COMPANY_INFO.socials.whatsapp}
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
                          href={`mailto:${COMPANY_INFO.email}`}
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
                <div>
                  <label htmlFor="contact-fullName" className={labelClass}>
                    Full Name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-fullName"
                    type="text"
                    required
                    aria-required="true"
                    autoComplete="name"
                    maxLength={100}
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={update('fullName')}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="contact-companyName" className={labelClass}>
                    Company Name (optional)
                  </label>
                  <input
                    id="contact-companyName"
                    type="text"
                    autoComplete="organization"
                    maxLength={150}
                    placeholder="Company Name"
                    value={formData.companyName}
                    onChange={update('companyName')}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-email" className={labelClass}>
                    Business Email <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    aria-required="true"
                    autoComplete="email"
                    maxLength={150}
                    placeholder="email@company.com"
                    value={formData.email}
                    onChange={update('email')}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="contact-whatsapp" className={labelClass}>
                    WhatsApp / Phone (optional)
                  </label>
                  <input
                    id="contact-whatsapp"
                    type="tel"
                    autoComplete="tel"
                    maxLength={50}
                    placeholder="+1 234 567 890"
                    value={formData.whatsapp}
                    onChange={update('whatsapp')}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-country" className={labelClass}>
                    Destination Country / Port <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-country"
                    type="text"
                    required
                    aria-required="true"
                    autoComplete="country-name"
                    maxLength={100}
                    placeholder="e.g. Netherlands (Rotterdam)"
                    value={formData.country}
                    onChange={update('country')}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="contact-product" className={labelClass}>
                    Product Interest <span aria-hidden="true">*</span>
                  </label>
                  <select
                    id="contact-product"
                    required
                    aria-required="true"
                    value={formData.productName}
                    onChange={update('productName')}
                    className={inputClass}
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
                  <label htmlFor="contact-quantity" className={labelClass}>
                    Estimated Order Quantity <span aria-hidden="true">*</span>
                  </label>
                  <select
                    id="contact-quantity"
                    required
                    aria-required="true"
                    value={formData.estimatedQuantity}
                    onChange={update('estimatedQuantity')}
                    className={inputClass}
                  >
                    <option value="">-- Select Order Volume --</option>
                    <option value="Sample Request">Sample Request (100g - 500g)</option>
                    <option value="1 Metric Ton">1 Metric Ton (1,000 kg)</option>
                    <option value="5 Metric Tons">5 Metric Tons</option>
                    <option value="1x20ft Container (14-18 MT)">1x20ft Container (14-18 MT)</option>
                    <option value="Multiple Containers FCL">Multiple Containers FCL Contract</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-packaging" className={labelClass}>
                    Packaging Requirement (optional)
                  </label>
                  <input
                    id="contact-packaging"
                    type="text"
                    maxLength={150}
                    placeholder="e.g. 25kg Kraft bags / Private label pouches"
                    value={formData.packagingRequirement}
                    onChange={update('packagingRequirement')}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className={labelClass}>
                  Message / Specifications Needed (optional)
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  maxLength={2000}
                  placeholder="Mention Curcumin %, Scoville heat units, mesh size, target delivery schedule, or shipping terms (FOB/CIF)..."
                  value={formData.message}
                  onChange={update('message')}
                  className={inputClass}
                ></textarea>
              </div>

              <FormPrivacyNotice id="contact-form-notice" />

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="bg-[#f2a900] hover:bg-[#d99700] text-[#05140f] font-bold px-6 py-3 rounded-lg shadow-lg text-sm flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting...</span>
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
