import Skeleton from '@/components/Skeleton';

export default function ProductLoading() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', padding: '6rem 1.5rem 5rem' }}>
      {/* Laser indicator */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #ff1a1a 0%, #ff4d4d 50%, #990000 100%)',
          zIndex: 9999,
        }} 
      />

      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <Skeleton width="50px" height="14px" variant="pill" style={{ opacity: 0.5 }} />
          <Skeleton width="10px" height="14px" variant="pill" style={{ opacity: 0.3 }} />
          <Skeleton width="70px" height="14px" variant="pill" style={{ opacity: 0.5 }} />
          <Skeleton width="10px" height="14px" variant="pill" style={{ opacity: 0.3 }} />
          <Skeleton width="140px" height="14px" variant="pill" style={{ opacity: 0.7 }} />
        </div>

        {/* 2-Column Product Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '3.5rem',
        }}>
          {/* Left: Gallery Skeleton */}
          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'row-reverse' }}>
            <div style={{ flex: 1, aspectRatio: '3 / 4', position: 'relative' }}>
              <Skeleton width="100%" height="100%" style={{ borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '80px' }}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} width="80px" height="100px" style={{ borderRadius: '3px' }} />
              ))}
            </div>
          </div>

          {/* Right: Details Skeleton */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingTop: '1rem' }}>
            <Skeleton width="90px" height="22px" variant="pill" style={{ opacity: 0.8 }} />
            <Skeleton width="85%" height="38px" />
            <Skeleton width="40%" height="28px" />

            <div style={{ height: '1px', backgroundColor: '#1c1c1c', margin: '0.5rem 0' }} />

            {/* Size Options Skeleton */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <Skeleton width="100px" height="16px" />
                <Skeleton width="80px" height="16px" />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {['S', 'M', 'L', 'XL'].map((s) => (
                  <Skeleton key={s} width="54px" height="46px" style={{ borderRadius: '2px' }} />
                ))}
              </div>
            </div>

            {/* CTA Buttons Skeleton */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1rem' }}>
              <Skeleton width="100%" height="52px" style={{ borderRadius: '2px', backgroundColor: '#260808' }} />
              <Skeleton width="100%" height="52px" style={{ borderRadius: '2px' }} />
            </div>

            {/* Accordion List Skeleton */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ borderBottom: '1px solid #1c1c1c', paddingBottom: '1rem' }}>
                  <Skeleton width="50%" height="18px" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
