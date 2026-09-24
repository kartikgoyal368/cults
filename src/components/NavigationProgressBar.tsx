'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Whenever pathname or searchParams change, pulse the progress bar
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.currentTarget as HTMLAnchorElement;
      if (!target || !target.href) return;
      
      const targetUrl = new URL(target.href);
      const currentUrl = new URL(window.location.href);

      // Only activate on internal navigation to a different page
      if (
        targetUrl.origin === currentUrl.origin &&
        targetUrl.pathname !== currentUrl.pathname &&
        !target.getAttribute('download') &&
        target.target !== '_blank'
      ) {
        setLoading(true);
      }
    };

    // Attach click listener to internal link tags
    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach((link) => {
      link.addEventListener('click', handleAnchorClick as EventListener);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener('click', handleAnchorClick as EventListener);
      });
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        zIndex: 99999,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'rgba(255, 0, 0, 0.1)',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, #ff1a1a 0%, #ff4d4d 50%, #990000 100%)',
          boxShadow: '0 0 10px #ff1a1a, 0 0 20px #ff3b3b',
          animation: 'navBarSweep 0.8s cubic-bezier(0.16, 1, 0.3, 1) infinite',
        }}
      />
      <style jsx global>{`
        @keyframes navBarSweep {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
