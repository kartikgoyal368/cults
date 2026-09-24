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
        lerp: 0.1,
        duration: 1.0,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.0,
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
