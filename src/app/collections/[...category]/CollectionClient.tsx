'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  tag?: string | null;
}

interface CollectionClientProps {
  categoryTitle: string;
  categoryDesc: string;
  products: Product[];
  isComingSoon?: boolean;
}

export default function CollectionClient({
  categoryTitle,
  categoryDesc,
  products,
  isComingSoon = false,
}: CollectionClientProps) {
  const { addToCart } = useCart();
  const [emailNotify, setEmailNotify] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high'>('default');

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      'L',
      1
    );
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailNotify.trim()) {
      setNotifySuccess(true);
      setTimeout(() => {
        setNotifySuccess(false);
        setEmailNotify('');
      }, 4000);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') {
      const pa = parseInt(a.price.replace(/[^0-9]/g, ''), 10) || 0;
      const pb = parseInt(b.price.replace(/[^0-9]/g, ''), 10) || 0;
      return pa - pb;
    }
    if (sortBy === 'price-high') {
      const pa = parseInt(a.price.replace(/[^0-9]/g, ''), 10) || 0;
      const pb = parseInt(b.price.replace(/[^0-9]/g, ''), 10) || 0;
      return pb - pa;
    }
    return 0;
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link href="/">HOME</Link> / <span>COLLECTIONS</span> / <span className={styles.activeBreadcrumb}>{categoryTitle}</span>
        </div>
        <h1 className={styles.title}>{categoryTitle}</h1>
        <p className={styles.subtitle}>{categoryDesc}</p>
        
        {products.length > 0 && (
          <div className={styles.toolbar}>
            <span className={styles.countBadge}>{products.length} PRODUCTS</span>
            <div className={styles.sortWrapper}>
              <label htmlFor="sortSelect">SORT BY:</label>
              <select 
                id="sortSelect"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className={styles.sortSelect}
              >
                <option value="default">FEATURED</option>
                <option value="price-low">PRICE: LOW TO HIGH</option>
                <option value="price-high">PRICE: HIGH TO LOW</option>
              </select>
            </div>
          </div>
        )}
      </header>

      {/* If coming soon or 0 products */}
      {products.length === 0 || isComingSoon ? (
        <div className={styles.comingSoonBox}>
          <div className={styles.lockIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h2 className={styles.comingSoonTitle}>VAULT LOCKED • COMING SOON</h2>
          <p className={styles.comingSoonDesc}>
            Our upcoming {categoryTitle.toLowerCase()} collection is currently in sample production and quality certification. Be the first to secure early access before public release.
          </p>

          <form onSubmit={handleNotifySubmit} className={styles.notifyForm}>
            <input 
              type="email" 
              placeholder="Enter email for VIP early access..." 
              value={emailNotify}
              onChange={(e) => setEmailNotify(e.target.value)}
              required
              className={styles.notifyInput}
            />
            <button type="submit" className={styles.notifyBtn}>
              GET NOTIFIED
            </button>
          </form>

          {notifySuccess && (
            <p className={styles.notifySuccessMsg}>
              ✓ You are on the VIP waitlist! We will alert you the second this drop lands.
            </p>
          )}

          <div className={styles.browseAllPrompt}>
            <p>In the meantime, explore our active streetwear vault:</p>
            <Link href="/collections/all" className="btn" style={{ marginTop: '1rem' }}>
              BROWSE ALL TOPS & BASICS
            </Link>
          </div>
        </div>
      ) : (
        <div className={styles.grid}>
          {sortedProducts.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className={styles.productCard}>
              <div className={styles.imageContainer}>
                {product.tag && <span className={styles.tagBadge}>{product.tag}</span>}
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className={styles.image}
                />
                <div className={styles.overlay}>
                  <button 
                    type="button"
                    className={`btn ${styles.quickAdd}`}
                    onClick={(e) => handleQuickAdd(e, product)}
                  >
                    + QUICK ADD
                  </button>
                </div>
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productPrice}>{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
