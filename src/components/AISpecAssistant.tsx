import React, { useState } from 'react';
import { Sparkles, Send, FileText, CheckCircle2 } from 'lucide-react';

interface AISpecAssistantProps {
  onRequestQuote: (productName?: string) => void;
}

export const AISpecAssistant: React.FC<AISpecAssistantProps> = ({ onRequestQuote }) => {
  const [productInterest, setProductInterest] = useState('Turmeric Powder');
  const [targetMarket, setTargetMarket] = useState('European Union (Rotterdam)');
  const [requirement, setRequirement] = useState('Need high Curcumin content for industrial spice blend manufacturing with steam sterilization.');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const handleGenerateSpec = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRecommendation(null);

    try {
      const res = await fetch('/api/ai-spec-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productInterest, targetMarket, requirement })
      });
      const data = await res.json();
      setRecommendation(data.recommendation);
    } catch (err) {
      console.error('AI Spec error:', err);
      setRecommendation(`Standard Export Recommendation:\n• Spice Grade: Premium Export Standard ${productInterest}\n• Target Compliance: Micro-sterilized steam treated for ${targetMarket}\n• Packaging: 25kg Multi-wall Kraft paper bags with PE inner liner.`);
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
              AI Powered Export Specification Tool
            </span>
            <h3 className="text-xl font-bold font-serif text-[#fdfcf0] tracking-tight">
              Instant Spice Grade & Packaging Advisor
            </h3>
          </div>
        </div>

        <p className="text-[#a3b899] text-sm font-light leading-relaxed">
          Specify your destination port, product preference, and end-use formulation to receive an instant recommended export specification, mesh size, and packaging configuration tailored to global compliance standards.
        </p>

        {/* Input Form */}
        <form onSubmit={handleGenerateSpec} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div>
            <label className="block text-xs font-medium text-[#f2a900] mb-1">
              Spice Product
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
              <option value="Black Pepper">Black Pepper</option>
              <option value="Green Cardamom">Green Cardamom</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#f2a900] mb-1">
              Destination Market / Port
            </label>
            <input
              type="text"
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
              placeholder="e.g. EU (Hamburg), UAE (Jebel Ali), USA (NY)"
              className="w-full bg-[#05140f] text-[#fdfcf0] px-3.5 py-2.5 rounded-lg border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm placeholder-[#a3b899]/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#f2a900] mb-1">
              End-Use / Special Requirement
            </label>
            <input
              type="text"
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
                <span>Analyzing Export Regulations...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Specification Recommendation</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* AI Recommendation Output */}
        {recommendation && (
          <div className="mt-6 p-5 bg-[#05140f] rounded-xl border border-[#f2a900]/40 text-[#fdfcf0] space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#154736] pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#f2a900]" />
                <span className="font-bold text-[#f2a900] text-sm font-serif">
                  Recommended B2B Export Specification
                </span>
              </div>
              <span className="text-[11px] bg-[#082018] text-[#f2a900] px-2 py-0.5 rounded border border-[#154736]">
                Falcon Quality Protocol
              </span>
            </div>

            <div className="text-xs text-[#fdfcf0]/90 font-sans whitespace-pre-line leading-relaxed space-y-1">
              {recommendation}
            </div>

            <div className="pt-3 border-t border-[#154736] flex items-center justify-between">
              <span className="text-[11px] text-[#a3b899]">
                Ready to request a formal quotation based on this specification?
              </span>
              <button
                onClick={() => onRequestQuote(productInterest)}
                className="bg-[#f2a900] hover:bg-[#d99700] text-[#05140f] font-bold px-4 py-2 rounded text-xs shadow flex items-center gap-1.5"
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
