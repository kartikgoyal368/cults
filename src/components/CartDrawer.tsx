'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    setBuyNowItem,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalCount,
  } = useCart();

  const onClose = () => setIsCartOpen(false);

  const handleCheckout = () => {
    setBuyNowItem(null); // checkout whole cart
    setIsCartOpen(false);
    router.push('/checkout');
  };

  // Target threshold for freebie / discount
  const threshold = 2500;
  const progressPercent = Math.min(100, Math.round((subtotal / threshold) * 100));
  const amountAway = Math.max(0, threshold - subtotal);

  return (
    <>
      <div 
        className={`${styles.overlay} ${isCartOpen ? styles.open : ''}`} 
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={`${styles.drawer} ${isCartOpen ? styles.open : ''}`}>
        {/* Header */}
        <div className={styles.header}>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <div className={styles.logo}>
            <Image src="/images/logo.png" alt="CULT'S Logo" width={200} height={70} style={{ objectFit: 'contain' }} />
          </div>
        </div>

        {/* Shipping Banner */}
        <div className={styles.shippingBanner}>
          <p className={styles.shippingText}>
            {subtotal >= threshold ? (
              <span className={styles.unlockedText}>🎉 YOU UNLOCKED FLAT ₹100 OFF!</span>
            ) : (
              <span>You're <strong>₹{amountAway}</strong> away from FLAT ₹100 OFF</span>
            )}
          </p>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progressPercent}%` }}></div>
          </div>
          <div className={styles.shippingLabels}>
            <span>CART ({totalCount})</span>
            <span>FLAT ₹100 OFF</span>
            <span>CULT'S FREEBIE</span>
          </div>
        </div>

        {/* Cart Items Content */}
        <div className={styles.content}>
          {items.length === 0 ? (
            <div className={styles.emptyContainer}>
              <div className={styles.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <p className={styles.emptyText}>YOUR CART IS EMPTY</p>
              <p className={styles.emptySubtext}>Add streetwear drops to elevate your vault.</p>
              <Link href="/collections/all" className="btn" style={{ width: '100%', marginTop: '1rem' }} onClick={onClose}>
                EXPLORE DROPS
              </Link>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {items.map((item) => (
                <div key={item.id} className={styles.itemRow}>
                  {/* Product Thumbnail */}
                  <div className={styles.itemImageWrapper}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={100}
                      className={styles.itemImage}
                    />
                  </div>

                  {/* Product Info */}
                  <div className={styles.itemDetails}>
                    <div className={styles.itemHeader}>
                      <Link 
                        href={`/product/${item.productId}`} 
                        className={styles.itemName}
                        onClick={onClose}
                      >
                        {item.name}
                      </Link>
                      <button 
                        className={styles.removeBtn} 
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>

                    <div className={styles.itemMeta}>
                      <span className={styles.itemSize}>SIZE: <strong>{item.size}</strong></span>
                      <span className={styles.itemPrice}>₹{item.priceNumber * item.quantity}</span>
                    </div>

                    {/* Quantity Controls */}
                    <div className={styles.quantityControls}>
                      <button 
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className={styles.qtyNumber}>{item.quantity}</span>
                      <button 
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Subtotal & Checkout */}
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotalRow}>
              <span className={styles.subtotalLabel}>SUBTOTAL</span>
              <span className={styles.subtotalAmount}>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <p className={styles.taxNotice}>Shipping & taxes calculated at checkout</p>
            <div className={styles.footerActions}>
              <button 
                className={`btn ${styles.checkoutBtn}`}
                onClick={handleCheckout}
              >
                CHECKOUT • ₹{subtotal.toLocaleString('en-IN')}
              </button>
              <button className={styles.continueBtn} onClick={onClose}>
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
