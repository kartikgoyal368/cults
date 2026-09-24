import Skeleton from '@/components/Skeleton';

export default function AccountLoading() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', padding: '6rem 1.5rem 5rem' }}>
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

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <Skeleton width="220px" height="36px" style={{ marginBottom: '0.5rem' }} />
            <Skeleton width="160px" height="16px" variant="pill" style={{ opacity: 0.6 }} />
          </div>
          <Skeleton width="100px" height="36px" style={{ borderRadius: '2px' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#0c0c0c',
                border: '1px solid #1c1c1c',
                borderRadius: '4px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <Skeleton width="48px" height="48px" variant="circle" />
              <Skeleton width="60%" height="22px" />
              <Skeleton width="90%" height="16px" />
              <Skeleton width="40%" height="16px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
