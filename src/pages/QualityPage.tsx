import React from 'react';
import { ShieldCheck, FileCheck, Award, ArrowRight, CheckCircle2, Download, AlertCircle } from 'lucide-react';
import { INITIAL_CERTIFICATIONS } from '../data/products';

interface QualityPageProps {
  onRequestQuote: (productName?: string) => void;
}

export const QualityPage: React.FC<QualityPageProps> = ({ onRequestQuote }) => {
  const sopSteps = [
    { title: "Supplier & Mandi Selection", desc: "Rigorous vetting of farmers and spice mandi suppliers based on agricultural purity and pesticide residue history." },
    { title: "Raw Material Inspection", desc: "Physical testing for moisture %, foreign matter, seed size grading, and initial ASTA color screening." },
    { title: "Cleaning & De-stoning", desc: "Multi-stage mechanical cleaning, de-stoning, aspiration, and magnetic metal separation." },
    { title: "Micro-Reduction & Steam Sterilization", desc: "Saturating dry steam sterilization process eliminating Salmonella, E. Coli, yeast, and mold without degrading volatile essential oils." },
    { title: "Hygienic Temperature-Controlled Milling", desc: "Precision pin-milling under cool temperatures preventing thermal dissipation of active curcumin and essential aromatic compounds." },
    { title: "Moisture Barrier Packaging Inspection", desc: "Automated check-weighing, metal detection, and vacuum / nitrogen flushing in food-grade multi-wall bags." },
    { title: "Batch Lab Testing & COA", desc: "Individual export batch sampling tested by accredited NABL / ISO 17025 laboratories for pesticides, heavy metals, and micro-biology." },
    { title: "Customs & Phytosanitary Clearance", desc: "Issuance of official Phytosanitary certificate, Certificate of Origin, and container sealing supervision." }
  ];

  return (
    <div className="bg-[#05140f] text-[#fdfcf0] py-12 px-4 sm:px-6 lg:px-8 space-y-16 font-sans max-w-7xl mx-auto">
      
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f2a900] uppercase tracking-widest bg-[#082018] px-3 py-1 rounded-full border border-[#f2a900]/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Quality Protocol</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#fdfcf0] tracking-tight">
          Quality Assurance & Certifications
        </h1>
        <p className="text-[#a3b899] text-sm sm:text-base font-light leading-relaxed">
          Falcon International Traders enforces strict quality control systems guaranteeing international microbiological safety, zero artificial dyes, and full batch traceability.
        </p>
      </div>

      {/* Quality SOP Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-serif text-[#fdfcf0] border-b border-[#154736] pb-3">
          Our 8-Step Quality SOP Workflow
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sopSteps.map((step, idx) => (
            <div key={idx} className="bg-[#082018] p-5 rounded-xl border border-[#154736] hover:border-[#f2a900]/40 transition-all space-y-2">
              <span className="text-xs font-mono font-bold text-[#f2a900] bg-[#05140f] px-2 py-0.5 rounded border border-[#154736]">
                STEP 0{idx + 1}
              </span>
              <h3 className="text-base font-bold font-serif text-[#fdfcf0] pt-1">
                {step.title}
              </h3>
              <p className="text-xs text-[#a3b899] font-light leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CERTIFICATIONS GALLERY */}
      <div className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#154736] pb-3">
          <div>
            <span className="text-xs font-semibold text-[#f2a900] uppercase tracking-widest block">
              Official Registrations & Compliance
            </span>
            <h2 className="text-2xl font-bold font-serif text-[#fdfcf0]">
              Export Certifications & Documentation Area
            </h2>
          </div>

          <button
            onClick={() => onRequestQuote('Quality Documentation Request')}
            className="bg-[#f2a900] hover:bg-[#d99700] text-[#05140f] font-bold px-4 py-2 rounded text-xs shadow flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Request Quality Dossier</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_CERTIFICATIONS.map((cert) => (
            <div key={cert.id} className="bg-[#082018] p-6 rounded-2xl border border-[#f2a900]/30 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-[#154736] pb-3">
                <span className="font-bold font-serif text-[#f2a900] text-base">
                  {cert.name}
                </span>
                <Award className="w-5 h-5 text-[#f2a900] shrink-0" />
              </div>

              <div className="space-y-2 text-xs text-[#a3b899]">
                <div>
                  <span className="text-[#a3b899]/70 block font-semibold">Issuing Authority:</span>
                  <span className="text-[#fdfcf0]">{cert.issuingAuthority}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[#a3b899]/70 block">Certificate Ref:</span>
                    <span className="font-mono text-[#f2a900]">{cert.certificateNumber}</span>
                  </div>
                  <div>
                    <span className="text-[#a3b899]/70 block">Validity:</span>
                    <span className="font-mono text-[#fdfcf0]">{cert.validUntil}</span>
                  </div>
                </div>

                <p className="text-[#a3b899] pt-2 text-[11px] font-light leading-relaxed">
                  {cert.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Banner */}
      <div className="bg-[#082018] p-8 rounded-2xl border border-[#f2a900]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl text-center md:text-left">
        <div className="space-y-1">
          <h3 className="text-xl font-bold font-serif text-[#fdfcf0]">
            Need COA, Heavy Metal & Pesticide Lab Test Reports?
          </h3>
          <p className="text-[#a3b899] text-sm font-light">
            We provide batch-specific Certificate of Analysis (COA) issued by ISO/IEC 17025 accredited laboratories with every shipment.
          </p>
        </div>
        <button
          onClick={() => onRequestQuote('COA & Lab Report Request')}
          className="bg-[#f2a900] hover:bg-[#d99700] text-[#05140f] font-bold px-6 py-3 rounded-lg text-sm shadow whitespace-nowrap flex items-center gap-2"
        >
          <span>Request Sample COA Documentation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
