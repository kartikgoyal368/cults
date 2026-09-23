import styles from './Ticker.module.css';

export default function Ticker() {
  const items = [
    "NO RESTOCKS",
    "SHIPS UNDER 48 HOURS",
    "LIMITED EDITION",
    "WORLDWIDE SHIPPING",
    "PREMIUM QUALITY",
    "NO RESTOCKS",
    "SHIPS UNDER 48 HOURS",
    "LIMITED EDITION",
    "WORLDWIDE SHIPPING",
    "PREMIUM QUALITY",
  ];

  return (
    <div className={styles.tickerWrapper}>
      <div className="marquee-container">
        <div className={`marquee-content ${styles.tickerContent}`}>
          {items.map((item, index) => (
            <span key={index} className={styles.tickerItem}>
              {item}
              <span className={styles.separator}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
