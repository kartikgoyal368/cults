'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

interface Product {
  id: string;
  name: string;
  price: string;
  images: { url: string }[];
}

export default function SearchClient({
  products,
  query,
}: {
  products: Product[];
  query: string;
}) {
  const { addToCart } = useCart();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cults_wishlist');
      if (stored) setWishlistIds(JSON.parse(stored));
    } catch {}
  }, []);

  const handleToggleWishlist = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const isWishlisted = wishlistIds.includes(productId);
    const updated = isWishlisted
      ? wishlistIds.filter((id) => id !== productId)
      : [...wishlistIds, productId];
    setWishlistIds(updated);

    try {
      localStorage.setItem('cults_wishlist', JSON.stringify(updated));
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
    } catch {}
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url || '/images/hero.jpg',
      },
      'L',
      1
    );
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>SEARCH RESULTS</h1>
        <p className={styles.subtitle}>
          {products.length} result{products.length !== 1 ? 's' : ''} for "{query}"
        </p>
      </div>

      {products.length > 0 ? (
        <div className={styles.grid}>
          {products.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            const mainImage = product.images.length > 0 ? product.images[0].url : '/images/hero.jpg';

            return (
              <div key={product.id} className={styles.card} style={{ position: 'relative' }}>
                <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className={styles.imageWrapper}>
                    <button
                      className={styles.wishlistBtn}
                      onClick={(e) => handleToggleWishlist(e, product.id)}
                      title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      type="button"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill={isWishlisted ? '#ff3b3b' : 'none'}
                        stroke={isWishlisted ? '#ff3b3b' : 'currentColor'}
                        strokeWidth="1.5"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                    <Image src={mainImage} alt={product.name} fill className={styles.image} />
                  </div>
                  <div className={styles.cardInfo} style={{ marginTop: '0.75rem' }}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                      <p className={styles.productPrice} style={{ color: '#ff4d4d', fontWeight: 700 }}>
                        {product.price}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        style={{
                          background: '#161616',
                          border: '1px solid #333',
                          color: '#fff',
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 700,
                          cursor: 'pointer',
                          letterSpacing: '0.05em',
                        }}
                      >
                        + QUICK ADD
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.noResults}>
          <p>We couldn't find any products matching your search.</p>
          <Link href="/collections/all" className={styles.backLink}>
            EXPLORE ALL DROPS
          </Link>
        </div>
      )}
    </div>
  );
}
