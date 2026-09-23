'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './ProductGrid.module.css';

const products = [
  { id: 'basics-6', name: "Cult's Star Mineral Wash Tank", price: '₹1199', image: '/images/6.JPG', tag: 'SAVE 60%' },
  { id: 'basics-7', name: 'Porsche 911 GT3 RS Blueprint Tee', price: '₹1499', image: '/images/7.JPG', tag: 'SAVE 60%' },
  { id: 'basics-8', name: 'Amour Oversized Graphic Tee', price: '₹1399', image: '/images/8.JPG', tag: 'SAVE 60%' },
  { id: 'basics-9', name: 'Stingers Scorpion Graphic Tee', price: '₹1499', image: '/images/9.JPG', tag: 'SAVE 60%' },
  { id: 'basics-10', name: 'Travis Scott Circus Maximus Tour Tee', price: '₹1799', image: '/images/10.JPG', tag: 'SAVE 60%' },
  { id: 'basics-11', name: 'N.W.A Ruthless Records Vintage Tee', price: '₹1799', image: '/images/11.JPG', tag: 'SAVE 60%' },
  { id: 'basics-12', name: 'Scars That Remind Me Of Mercy Tee', price: '₹1399', image: '/images/12.JPG', tag: 'SAVE 60%' },
  { id: 'basics-13', name: 'Guard Dawgs Gothic Heavyweight Tee', price: '₹1499', image: '/images/13.JPG', tag: 'SAVE 60%' },
];

export default function ProductGrid() {
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent, product: typeof products[0]) => {
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

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>CULT'S BASICS</h2>
      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product.id} className={styles.cardWrapper}>
            <Link href={`/product/${product.id}`} className={styles.card}>
              <div className={styles.imageWrapper}>
                {product.tag && <span className={styles.tag}>{product.tag}</span>}
                <button 
                  className={styles.wishlistBtn}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = '/account/wishlist';
                  }}
                  title="View Wishlist"
                  aria-label="Wishlist"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className={styles.image} 
                />

                {/* Quick Add Overlay on Image */}
                <div className={styles.quickAddOverlay}>
                  <button 
                    type="button" 
                    className={styles.quickAddBtn}
                    onClick={(e) => handleQuickAdd(e, product)}
                  >
                    + QUICK ADD
                  </button>
                </div>
              </div>
            </Link>

            <div className={styles.productDetails}>
              <Link href={`/product/${product.id}`} className={styles.productName}>
                {product.name}
              </Link>
              <div className={styles.productPriceRow}>
                <span className={styles.productPrice}>{product.price}</span>
                <button 
                  className={styles.addToCartInlineBtn}
                  onClick={(e) => handleQuickAdd(e, product)}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
