import Skeleton from '@/components/Skeleton';

export default function CollectionsLoading() {
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
          animation: 'pulse 1.2s infinite alternate',
        }} 
      />

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Breadcrumb Skeleton */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
          <Skeleton width="60px" height="14px" variant="pill" style={{ opacity: 0.5 }} />
          <Skeleton width="10px" height="14px" variant="pill" style={{ opacity: 0.3 }} />
          <Skeleton width="100px" height="14px" variant="pill" style={{ opacity: 0.7 }} />
        </div>

        {/* Title & Count Skeleton */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Skeleton width="280px" height="42px" style={{ marginBottom: '0.75rem' }} />
            <Skeleton width="120px" height="16px" variant="pill" style={{ opacity: 0.6 }} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Skeleton width="90px" height="36px" style={{ borderRadius: '2px' }} />
            <Skeleton width="130px" height="36px" style={{ borderRadius: '2px' }} />
          </div>
        </div>

        {/* Filter Pills Skeleton */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '3rem', overflowX: 'hidden' }}>
          {[80, 110, 95, 120, 105, 90].map((width, idx) => (
            <Skeleton key={idx} width={`${width}px`} height="34px" variant="pill" style={{ opacity: idx === 0 ? 0.9 : 0.4 }} />
          ))}
        </div>

        {/* Catalog Grid Skeleton */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.75rem',
        }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div 
              key={i} 
              style={{
                backgroundColor: '#0c0c0c',
                border: '1px solid #1c1c1c',
                borderRadius: '4px',
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >
              <div style={{ width: '100%', aspectRatio: '1 / 1', position: 'relative' }}>
                <Skeleton width="100%" height="100%" style={{ borderRadius: '2px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Skeleton width="30%" height="12px" variant="pill" style={{ opacity: 0.6 }} />
                <Skeleton width="90%" height="18px" />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                  <Skeleton width="40%" height="16px" />
                  <Skeleton width="70px" height="28px" style={{ borderRadius: '2px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
