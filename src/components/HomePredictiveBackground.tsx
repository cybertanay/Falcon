import React from 'react';
import { PredictiveArcCanvas } from '../shaders/predictive-arc/PredictiveArcCanvas';

/**
 * HomePredictiveBackground
 * 
 * ThreeUI Predictive Arc integration for the Falcon Home page,
 * customized with multi-shade green translucent glass underlays,
 * radiant emerald core lighting, and deep forest atmosphere.
 */
export const HomePredictiveBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#020b08]">
      
      {/* 1. Rich Multi-Shade Forest & Emerald Gradient Base (avoiding flat black) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020b08] via-[#051c13] to-[#030e0a]" />

      {/* 2. Radiant Luminous Emerald Core under the Predictive Arc Peak */}
      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[850px] sm:w-[1100px] h-[550px] bg-gradient-to-b from-[#10b981]/25 via-[#059669]/20 to-transparent blur-[130px] rounded-full pointer-events-none" />

      {/* 3. Lateral Deep Jade & Mint Atmospheric Flares */}
      <div className="absolute top-[25%] -left-32 w-[550px] h-[550px] bg-[#154736]/40 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-[25%] -right-32 w-[550px] h-[550px] bg-[#0f3d2a]/40 blur-[140px] rounded-full pointer-events-none" />

      {/* 4. Falcon Saffron-Gold Core Glow (Turmeric export commodity resonance) */}
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[450px] h-[220px] bg-[#f2a900]/12 blur-[95px] rounded-full pointer-events-none" />

      {/* 5. Translucent Glass Underlay Strata with subtle borders and frosted backdrops */}
      <div className="absolute top-[24%] left-1/2 -translate-x-1/2 w-[92vw] max-w-6xl h-44 rounded-3xl bg-[#082318]/25 backdrop-blur-xl border border-[#154736]/35 shadow-[0_8px_32px_0_rgba(16,185,129,0.08)] pointer-events-none" />
      <div className="absolute top-[44%] left-1/2 -translate-x-1/2 w-[95vw] max-w-7xl h-60 rounded-3xl bg-[#051810]/30 backdrop-blur-2xl border border-[#154736]/20 pointer-events-none" />

      {/* 6. Precision Micro-Grid Ambient Matrix Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#154736_1px,transparent_1px)] [background-size:32px_32px] opacity-25 pointer-events-none" />

      {/* 7. Exact ThreeUI <PredictiveArcCanvas /> Integration */}
      <div className="absolute inset-0 w-full h-full mix-blend-screen opacity-95">
        <PredictiveArcCanvas
          mode="dark"
          speed={1.00}
          hue={180}
          saturation={1.42}
          brightness={1.60}
        />
      </div>

      {/* 8. Atmospheric Lower Vignette to blend smoothly with content */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030d0a]/20 to-[#030d0a]/65 pointer-events-none" />

    </div>
  );
};
