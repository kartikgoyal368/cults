'use client';

import { ReactLenis } from 'lenis/react';

interface SmoothScrollProps {
  children?: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.12,
        duration: 0.9,
        smoothWheel: true,
        wheelMultiplier: 2.5, // High sensitivity for wheel / gestures
        touchMultiplier: 2.2, // High sensitivity for trackpad / touch
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
