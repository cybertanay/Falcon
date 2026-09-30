import React, { useState } from 'react';
import { Sparkles, FileText, CheckCircle2, AlertCircle, ShieldAlert, Mail } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface AISpecAssistantProps {
  onRequestQuote: (productName?: string) => void;
}

interface StructuredSpec {
  recommendedGrade?: string;
  moisture?: string;
  meshSize?: string;
  packaging?: string;
  microbiology?: string;
  notes?: string;
  disclaimer?: string;
}

export const AISpecAssistant: React.FC<AISpecAssistantProps> = ({ onRequestQuote }) => {
  const [productInterest, setProductInterest] = useState('Turmeric Powder');
  const [targetMarket, setTargetMarket] = useState('European Union (Rotterdam)');
  const [requirement, setRequirement] = useState('High Curcumin content for food formulation with low-bacteria steam sterilization.');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<StructuredSpec | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerateSpec = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRecommendation(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/ai-spec-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productInterest, targetMarket, requirement })
      });

      const data = await res.json();
      if (res.ok && data.success && data.recommendation) {
        setRecommendation(data.recommendation);
        trackEvent('ai_assistant_used', { productInterest, targetMarket });
      } else {
        setErrorMessage(data.error || 'The AI Export Advisor is currently unavailable. Please connect directly with our export desk.');
      }
    } catch (err) {
      setErrorMessage('Unable to connect to the AI service. Our export desk is available to answer your technical spice specifications directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#082018] rounded-2xl border border-[#f2a900]/30 p-6 sm:p-8 shadow-2xl font-sans relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#f2a900]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="space-y-6 relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f2a900] to-[#b37a00] p-0.5 flex items-center justify-center shrink-0 shadow">
            <div className="w-full h-full bg-[#05140f] rounded-[7px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#f2a900]" />
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#f2a900] uppercase tracking-widest block">
              AI Powered Export Specification Assistant
            </span>
            <h3 className="text-xl font-bold font-serif text-[#fdfcf0] tracking-tight">
              Preliminary Spice Specification & Packaging Advisor
            </h3>
          </div>
        </div>

        <p className="text-[#a3b899] text-sm font-light leading-relaxed">
          Specify your destination port, product interest, and application requirements to generate preliminary export parameters including active compound targets, mesh sizing, and packaging standards.
        </p>

        {/* Input Form */}
        <form onSubmit={handleGenerateSpec} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div>
            <label className="block text-xs font-medium text-[#f2a900] mb-1">
              Spice Product *
            </label>
            <select
              value={productInterest}
              onChange={(e) => setProductInterest(e.target.value)}
              className="w-full bg-[#05140f] text-[#fdfcf0] px-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm"
            >
              <option value="Turmeric Powder">Turmeric Powder</option>
              <option value="Red Chilli Powder">Red Chilli Powder</option>
              <option value="Cumin Seeds & Powder">Cumin Seeds & Powder</option>
              <option value="Dehydrated Garlic Powder">Dehydrated Garlic Powder</option>
              <option value="Black Pepper">Tellicherry Black Pepper</option>
              <option value="Green Cardamom">Green Cardamom Pods</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#f2a900] mb-1">
              Destination Market / Port *
            </label>
            <input
              type="text"
              required
              maxLength={100}
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
              placeholder="e.g. EU (Hamburg), UAE (Jebel Ali), USA (NY)"
              className="w-full bg-[#05140f] text-[#fdfcf0] px-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm placeholder-[#a3b899]/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#f2a900] mb-1">
              End-Use / Formulation Requirement *
            </label>
            <input
              type="text"
              required
              maxLength={500}
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="e.g. Seasoning blend, Sauces, Retail pouches"
              className="w-full bg-[#05140f] text-[#fdfcf0] px-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm placeholder-[#a3b899]/50"
            />
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#f2a900] hover:bg-[#d99700] text-[#05140f] font-bold px-6 py-2.5 rounded-lg text-sm shadow flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Evaluating Specification Parameters...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Specification Guidance</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* Error State — Real & Actionable */}
        {errorMessage && (
          <div className="mt-6 p-5 bg-[#05140f] rounded-xl border border-[#c41e3a]/50 text-[#fdfcf0] space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 text-[#ff8080] font-semibold text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <p className="text-xs text-[#a3b899] font-light">
              Our export trade team can formulate official specification sheets, COAs, and micro-analysis data sheets tailored to your destination country.
            </p>
            <button
              onClick={() => onRequestQuote(productInterest)}
              className="mt-2 bg-[#154736] hover:bg-[#1c5d47] text-[#fdfcf0] font-bold px-4 py-2 rounded text-xs border border-[#f2a900]/40 flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-[#f2a900]" />
              <span>Request Technical Specification from Export Team</span>
            </button>
          </div>
        )}

        {/* Structured AI Recommendation Output */}
        {recommendation && (
          <div className="mt-6 p-6 bg-[#05140f] rounded-xl border border-[#f2a900]/40 text-[#fdfcf0] space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#154736] pb-3 gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#f2a900]" />
                <span className="font-bold text-[#f2a900] text-sm font-serif">
                  Preliminary B2B Export Specification Guide
                </span>
              </div>
              <span className="text-[11px] bg-[#082018] text-[#a3b899] px-2.5 py-0.5 rounded border border-[#154736]">
                Target: {targetMarket}
              </span>
            </div>

            {/* Grid of structured parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#082018] rounded-lg border border-[#154736] space-y-1">
                <span className="text-[#f2a900] font-semibold block uppercase tracking-wider text-[10px]">
                  Recommended Quality Grade
                </span>
                <p className="text-[#fdfcf0]">{recommendation.recommendedGrade || 'Export Prime Standard'}</p>
              </div>

              <div className="p-3 bg-[#082018] rounded-lg border border-[#154736] space-y-1">
                <span className="text-[#f2a900] font-semibold block uppercase tracking-wider text-[10px]">
                  Moisture & Mesh Size
                </span>
                <p className="text-[#fdfcf0]">
                  Moisture: {recommendation.moisture || 'Standard limit'} • Mesh: {recommendation.meshSize || 'Standard 60-80 mesh'}
                </p>
              </div>

              <div className="p-3 bg-[#082018] rounded-lg border border-[#154736] space-y-1">
                <span className="text-[#f2a900] font-semibold block uppercase tracking-wider text-[10px]">
                  Recommended Packaging Format
                </span>
                <p className="text-[#fdfcf0]">{recommendation.packaging || '25kg multi-wall Kraft paper bags with PE liner'}</p>
              </div>

              <div className="p-3 bg-[#082018] rounded-lg border border-[#154736] space-y-1">
                <span className="text-[#f2a900] font-semibold block uppercase tracking-wider text-[10px]">
                  Microbiology & Treatment
                </span>
                <p className="text-[#fdfcf0]">{recommendation.microbiology || 'Steam sterilization recommended for destination import compliance'}</p>
              </div>

              {recommendation.notes && (
                <div className="md:col-span-2 p-3 bg-[#082018] rounded-lg border border-[#154736] space-y-1">
                  <span className="text-[#f2a900] font-semibold block uppercase tracking-wider text-[10px]">
                    Technical & Logistics Notes
                  </span>
                  <p className="text-[#fdfcf0] leading-relaxed">{recommendation.notes}</p>
                </div>
              )}
            </div>

            {/* MANDATORY LEGAL DISCLAIMER */}
            <div className="p-3.5 bg-[#082018]/90 rounded-lg border border-[#f2a900]/30 flex items-start gap-2.5 text-[11px] text-[#a3b899]">
              <ShieldAlert className="w-4 h-4 text-[#f2a900] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Disclaimer:</strong> {recommendation.disclaimer || 'AI-generated recommendations are for preliminary guidance only and should be verified against applicable destination-country regulations and customer specifications.'}
              </p>
            </div>

            <div className="pt-2 border-t border-[#154736] flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-[#a3b899]">
                Ready to receive a certified proforma quote based on this specification?
              </span>
              <button
                onClick={() => onRequestQuote(productInterest)}
                className="bg-[#f2a900] hover:bg-[#d99700] text-[#05140f] font-bold px-4 py-2 rounded text-xs shadow flex items-center gap-1.5 whitespace-nowrap"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Request Quotation with these Specs</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
