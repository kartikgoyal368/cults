"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import styles from './Product.module.css';

type Product = {
  id: string;
  name: string;
  price: string;
  images: string[];
  description: string;
  category?: string;
};

export default function ProductClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, setBuyNowItem } = useCart();
  const isBasics = product.id.startsWith('basics-') || product.category === 'basics';
  const sizeOptions = isBasics ? ['S', 'M', 'L', 'XL'] : ['XS', 'S', 'M', 'L'];
  const [selectedSize, setSelectedSize] = useState('S');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistToast, setWishlistToast] = useState<string | null>(null);
  const [showSizeChart, setShowSizeChart] = useState(false);

  // Check wishlist state on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cults_wishlist');
      if (stored) {
        const ids: string[] = JSON.parse(stored);
        if (ids.includes(product.id)) {
          setIsWishlisted(true);
        }
      }
    } catch {}
  }, [product.id]);

  const handleToggleWishlist = async () => {
    const newState = !isWishlisted;
    setIsWishlisted(newState);

    // Sync localStorage
    try {
      const stored = localStorage.getItem('cults_wishlist');
      let ids: string[] = stored ? JSON.parse(stored) : [];
      if (newState) {
        if (!ids.includes(product.id)) ids.push(product.id);
        setWishlistToast(`Added to your Wishlist!`);
      } else {
        ids = ids.filter(id => id !== product.id);
        setWishlistToast(`Removed from Wishlist`);
      }
      localStorage.setItem('cults_wishlist', JSON.stringify(ids));
    } catch {}

    setTimeout(() => setWishlistToast(null), 2500);

    // Sync backend if authenticated
    try {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
    } catch {}
  };

  const handleQuantityChange = (type: 'inc' | 'dec') => {
    if (type === 'dec' && quantity > 1) setQuantity(q => q - 1);
    if (type === 'inc') setQuantity(q => q + 1);
  };

  const handleBuyNow = () => {
    const itemPriceNumber = parseInt(product.price.replace(/[^0-9]/g, ''), 10) || 0;
    setBuyNowItem({
      id: `${product.id}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      priceNumber: itemPriceNumber,
      image: product.images[activeImage] || product.images[0] || '/images/1.png',
      size: selectedSize,
      quantity,
    });
    router.push('/checkout');
  };

  return (
    <div className={styles.container}>
      {/* Toast Alert */}
      {wishlistToast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#0c0c0c',
          border: '1px solid #ff3b3b',
          color: '#fff',
          padding: '0.85rem 1.5rem',
          borderRadius: '4px',
          fontFamily: 'var(--font-heading)',
          fontSize: '0.85rem',
          letterSpacing: '0.08em',
          zIndex: 9999,
          boxShadow: '0 10px 30px rgba(255, 59, 59, 0.25)',
        }}>
          {wishlistToast}
        </div>
      )}

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1rem',
          }}
          onClick={() => setShowSizeChart(false)}
        >
          <div 
            data-lenis-prevent
            style={{
              backgroundColor: '#0c0c0c',
              border: '1px solid #333',
              borderRadius: '4px',
              maxWidth: '540px',
              width: '100%',
              padding: '2rem',
              color: '#fff',
              position: 'relative',
              boxShadow: '0 20px 50px rgba(0,0,0,0.9)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #222', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', letterSpacing: '0.08em' }}>CULT'S OVERSIZED SIZE GUIDE</h3>
                <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.2rem' }}>All measurements are in inches with signature boxy drop-shoulder drape.</p>
              </div>
              <button 
                onClick={() => setShowSizeChart(false)}
                style={{ background: 'none', border: 'none', color: '#888', fontSize: '1.2rem', cursor: 'pointer', padding: '0.25rem' }}
              >
                ✕
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333', color: '#aaa' }}>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>SIZE</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>CHEST</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>LENGTH</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>SHOULDER</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'left', fontWeight: 700, color: '#ff4d4d' }}>XS</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#ccc' }}>42"</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#ccc' }}>28"</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#ccc' }}>21"</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'left', fontWeight: 700, color: '#ff4d4d' }}>S</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#ccc' }}>44"</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#ccc' }}>29"</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#ccc' }}>22"</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'left', fontWeight: 700, color: '#ff4d4d' }}>M</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#ccc' }}>46"</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#ccc' }}>30"</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#ccc' }}>23"</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'left', fontWeight: 700, color: '#ff4d4d' }}>L</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#ccc' }}>48"</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#ccc' }}>31"</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#ccc' }}>24"</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'left', fontWeight: 700, color: '#ff4d4d' }}>XL</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#ccc' }}>50"</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#ccc' }}>32"</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#ccc' }}>25"</td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#777' }}>* Order true to size for oversized street drape.</span>
              <button 
                onClick={() => setShowSizeChart(false)}
                className="btn" 
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.75rem' }}
              >
                GOT IT
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.productLayout}>
        {/* Left Side - Images */}
        <div className={styles.imageGallery}>
          <div className={styles.thumbnails}>
            {product.images.map((img, idx) => (
              <button 
                key={idx} 
                className={`${styles.thumbnailBtn} ${activeImage === idx ? styles.activeThumbnail : ''}`}
                onClick={() => setActiveImage(idx)}
              >
                <Image src={img} alt={`${product.name} thumbnail ${idx + 1}`} fill className={styles.thumbnailImg} />
              </button>
            ))}
          </div>
          <div className={styles.mainImageContainer}>
            <Image 
              src={product.images[activeImage]} 
              alt={product.name} 
              fill 
              className={styles.mainImage} 
              priority
            />
            <button 
              className={styles.wishlistBtn}
              onClick={handleToggleWishlist}
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              aria-label="Toggle Wishlist"
              type="button"
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill={isWishlisted ? "#ff3b3b" : "none"} 
                stroke={isWishlisted ? "#ff3b3b" : "currentColor"} 
                strokeWidth="1.5"
                style={{ transition: 'all 0.2s ease', transform: isWishlisted ? 'scale(1.15)' : 'scale(1)' }}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Right Side - Details */}
        <div className={styles.productDetails}>
          <h1 className={styles.title}>{product.name}</h1>
          
          <div className={styles.rating}>
            <div className={styles.stars}>
              {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
            </div>
            <span className={styles.reviewCount}>(45 verified reviews)</span>
          </div>

          <p className={styles.price}>{product.price}</p>

          <div className={styles.sizeSection}>
            <div className={styles.sizeHeader}>
              <span>Size:</span>
              <button 
                type="button"
                className={styles.sizeChart} 
                onClick={() => setShowSizeChart(true)}
              >
                Size chart
              </button>
            </div>
            <div className={styles.sizeOptions}>
              {sizeOptions.map(size => (
                <button 
                  key={size}
                  type="button"
                  className={`${styles.sizeBtn} ${selectedSize === size ? styles.selectedSize : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.quantitySelector}>
            <button type="button" onClick={() => handleQuantityChange('dec')}>-</button>
            <span>{quantity}</span>
            <button type="button" onClick={() => handleQuantityChange('inc')}>+</button>
          </div>

          <div className={styles.actions}>
            <button 
              type="button"
              className={styles.addToCartBtn}
              onClick={() => {
                addToCart(
                  {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images[activeImage] || product.images[0] || '/images/1.png',
                  },
                  selectedSize,
                  quantity
                );
              }}
            >
              ADD TO CART
            </button>
            <button 
              type="button"
              className={styles.buyNowBtn}
              onClick={handleBuyNow}
            >
              BUY IT NOW
            </button>
          </div>

          <div className={styles.description}>
            <ul>
              {product.description.split('\n').map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          </div>

          <div className={styles.footerInfo}>
            <p className={styles.copyright}>"{product.name}" BY CULT'S STUDIOS ©</p>
            <div className={styles.badges}>
              <span>♡( ◡‿◡ )♡</span>
              <span>Proudly Made in India. Free Express Shipping on All Orders.</span>
            </div>
            <p className={styles.note}>note : the above product is artisan stitched and screen printed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

