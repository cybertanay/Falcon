import React from 'react';
import { TextAnimationCollection, AnimatedTopDock } from "@designcodeio/threeui";
import { PortalFieldCollection } from "../shaders/neuform-isolated/NeuformIsolatedEffects";
import "@designcodeio/threeui/style.css";

/**
 * ThreeUI TextAnimationCollection - Intro Text (threeui-intro)
 * Canonical usage according to ThreeUI exact specification
 */
export function Scene() {
  return (
    <div className="shader-frame w-full h-full min-h-[140px] rounded-xl overflow-hidden">
      <TextAnimationCollection
        variant="threeui-intro"
        mode="dark"
        hue={0}
        saturation={1.00}
        brightness={1.00}
      />
    </div>
  );
}

/**
 * ThreeUI AnimatedTopDock - Command Bar (modern)
 * Canonical usage according to ThreeUI exact specification
 */
export function TopDockScene() {
  return (
    <div className="shader-frame w-full">
      <AnimatedTopDock
        variant="modern"
        proximity={122}
        spring={0.19}
        damping={0.70}
        widthGrowth={17}
        heightGrowth={16}
        drop={3.5}
      />
    </div>
  );
}

/**
 * ThreeUI PortalFieldCollection - Cloud Field (cloud-field)
 * Canonical usage according to ThreeUI exact specification
 */
export function CloudFieldScene() {
  return (
    <div className="shader-frame w-full h-[500px]">
      <PortalFieldCollection
        variant="cloud-field"
        hue={0}
        saturation={1.00}
        brightness={1.00}
      />
    </div>
  );
}

