import React from 'react';
import { ShieldCheck, PackageCheck, Ship, Tag, Box } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const items = [
    {
      icon: ShieldCheck,
      title: "Quality Assured",
      description: "Micro-sterilized & ASTA tested"
    },
    {
      icon: PackageCheck,
      title: "Bulk Orders",
      description: "LCL to Multi-Container FCL"
    },
    {
      icon: Ship,
      title: "Worldwide Shipping",
      description: "Phytosanitary & COA Docs"
    },
    {
      icon: Tag,
      title: "OEM & Private Label",
      description: "Custom Branded Packaging"
    },
    {
      icon: Box,
      title: "Export Packaging",
      description: "Moisture-barrier Vacuum Packs"
    }
  ];

  return (
    <div className="bg-[#082018]/70 backdrop-blur-md border-y border-[#154736]/60 py-6 px-4 font-sans relative">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#05140f]/60 border border-[#154736] hover:border-[#f2a900]/40 transition-all">
              <div className="w-10 h-10 rounded-full bg-[#f2a900]/10 border border-[#f2a900]/30 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[#f2a900]" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-semibold text-[#fdfcf0] block font-serif">
                  ✓ {item.title}
                </span>
                <span className="text-[11px] text-[#a3b899] block line-clamp-1">
                  {item.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
