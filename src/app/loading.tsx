import Skeleton from '@/components/Skeleton';
import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.loadingPage}>
      {/* Top glowing laser line */}
      <div className={styles.topBar} />

      {/* Hero Banner Skeleton */}
      <section className={styles.heroSkeleton}>
        <Skeleton width="180px" height="24px" variant="pill" style={{ opacity: 0.6 }} />
        <Skeleton width="65%" height="clamp(36px, 6vw, 64px)" style={{ maxWidth: '650px', borderRadius: '4px' }} />
        <Skeleton width="45%" height="20px" style={{ maxWidth: '380px' }} />
        <Skeleton width="160px" height="48px" style={{ marginTop: '1rem', borderRadius: '2px', backgroundColor: '#220808' }} />
      </section>

      {/* Ticker Bar Skeleton */}
      <div className={styles.tickerSkeleton} />

      {/* Main Content Area */}
      <div className={styles.container}>
        {/* Category Circles Row Skeleton */}
        <div className={styles.circlesRow}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.circleItem}>
              <Skeleton width={88} height={88} variant="circle" />
              <Skeleton width={60} height={12} variant="pill" />
            </div>
          ))}
        </div>

        {/* Section Header */}
        <div className={styles.sectionHeaderSkeleton}>
          <Skeleton width="220px" height="32px" />
          <Skeleton width="140px" height="14px" variant="pill" style={{ opacity: 0.5 }} />
        </div>

        {/* Products Grid Skeleton */}
        <div className={styles.grid}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className={styles.cardSkeleton}>
              <div className={styles.cardImageWrapper}>
                <Skeleton width="100%" height="100%" style={{ borderRadius: '2px' }} />
              </div>
              <div className={styles.cardContent}>
                <Skeleton width="35%" height="14px" variant="pill" style={{ opacity: 0.7 }} />
                <Skeleton width="85%" height="18px" />
                <div className={styles.cardFooter}>
                  <Skeleton width="45%" height="16px" />
                  <Skeleton width="64px" height="28px" style={{ borderRadius: '2px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
