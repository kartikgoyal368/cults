'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import styles from './CartPopup.module.css';

export default function CartPopup() {
  const {
    lastAddedItem,
    isPopupVisible,
    dismissPopup,
    setIsCartOpen,
  } = useCart();

  if (!isPopupVisible || !lastAddedItem) {
    return null;
  }

  const handleOpenCart = () => {
    setIsCartOpen(true);
    dismissPopup();
  };

  return (
    <div className={styles.popupContainer}>
      {/* Animated Top Progress Indicator */}
      <div className={styles.progressBarContainer}>
        <div className={styles.progressFill}></div>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.successBadge}>
          <span className={styles.checkIcon}>✓</span>
          <span>ADDED SUCCESSFULLY</span>
        </div>
        <button 
          className={styles.closeBtn} 
          onClick={dismissPopup}
          aria-label="Close notification"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      {/* Body with exact photo & price */}
      <div className={styles.body}>
        <div className={styles.imageWrapper}>
          <Image
            src={lastAddedItem.image}
            alt={lastAddedItem.name}
            width={60}
            height={75}
            className={styles.productImage}
          />
        </div>

        <div className={styles.details}>
          <div className={styles.productTitle}>{lastAddedItem.name}</div>
          <div className={styles.metaRow}>
            <span>Size: <strong>{lastAddedItem.size}</strong></span>
            <span>•</span>
            <span>Qty: <strong>{lastAddedItem.quantity}</strong></span>
          </div>
          <div className={styles.price}>{lastAddedItem.price}</div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.viewBagBtn} onClick={handleOpenCart}>
          VIEW BAG & CHECKOUT ➔
        </button>
      </div>
    </div>
  );
}
