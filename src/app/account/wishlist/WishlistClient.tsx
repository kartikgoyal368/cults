'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

interface ProductImage {
  id: string;
  url: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
  description?: string | null;
  tag?: string | null;
  category?: string | null;
  images: ProductImage[];
}

interface WishlistClientProps {
  initialWishlistProductIds: string[];
  allProducts: Product[];
}

export default function WishlistClient({
  initialWishlistProductIds,
  allProducts,
}: WishlistClientProps) {
  const { addToCart } = useCart();
  const [wishlistIds, setWishlistIds] = useState<string[]>(initialWishlistProductIds);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [activeFilter, setActiveFilter] = useState<'all' | 'street-wear' | 'basics'>('all');
  const [activeTab, setActiveTab] = useState<'wishlist' | 'all'>('wishlist');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleToggleWishlist = async (productId: string, productName: string) => {
    const isCurrentlyWishlisted = wishlistIds.includes(productId);

    // Optimistic update
    setWishlistIds((prev) =>
      isCurrentlyWishlisted ? prev.filter((id) => id !== productId) : [...prev, productId]
    );

    setIsUpdating((prev) => ({ ...prev, [productId]: true }));

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        // Rollback
        setWishlistIds((prev) =>
          isCurrentlyWishlisted ? [...prev, productId] : prev.filter((id) => id !== productId)
        );
        showToast('Error updating wishlist. Please try again.');
      } else {
        const data = await res.json();
        if (data.inWishlist) {
          showToast(`Added "${productName}" to Wishlist!`);
        } else {
          showToast(`Removed "${productName}" from Wishlist.`);
        }
      }
    } catch {
      // Rollback
      setWishlistIds((prev) =>
        isCurrentlyWishlisted ? [...prev, productId] : prev.filter((id) => id !== productId)
      );
      showToast('Error updating wishlist.');
    } finally {
      setIsUpdating((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleSelectSize = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToBag = (product: Product) => {
    const size = selectedSizes[product.id] || 'L';
    const mainImg = product.images?.[0]?.url || '/images/hero.jpg';
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: mainImg,
      },
      size,
      1
    );
    showToast(`Added ${product.name} (Size ${size}) to your bag!`);
  };

  // Filter products for the "All Products" section
  const filteredProducts = allProducts.filter((product) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'street-wear') return product.category === 'street-wear';
    if (activeFilter === 'basics') return product.category === 'basics';
    return true;
  });

  // Filtered list for "My Wishlist"
  const wishlistedProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className={styles.clientContainer}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toast}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tabs navigation */}
      <div className={styles.tabNav}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'wishlist' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          MY SAVED ITEMS ({wishlistedProducts.length})
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'all' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('all')}
        >
          ALL STORE PRODUCTS ({allProducts.length})
        </button>
      </div>

      {/* Category filters */}
      <div className={styles.filtersBar}>
        <button
          className={`${styles.filterChip} ${activeFilter === 'all' ? styles.activeFilter : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          ALL COLLECTIONS ({allProducts.length})
        </button>
        <button
          className={`${styles.filterChip} ${activeFilter === 'street-wear' ? styles.activeFilter : ''}`}
          onClick={() => setActiveFilter('street-wear')}
        >
          STREET WEAR (5)
        </button>
        <button
          className={`${styles.filterChip} ${activeFilter === 'basics' ? styles.activeFilter : ''}`}
          onClick={() => setActiveFilter('basics')}
        >
          CULT'S BASICS (8)
        </button>
      </div>

      {/* TAB CONTENT: MY SAVED ITEMS */}
      {activeTab === 'wishlist' && (
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>YOUR SAVED VAULT</h2>
            <p className={styles.sectionSubtitle}>
              {wishlistedProducts.length === 0
                ? 'Your wishlist is currently empty. Explore the all-products drop below!'
                : `You have ${wishlistedProducts.length} curated pieces in your personal wishlist.`}
            </p>
          </div>

          {wishlistedProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <p className={styles.emptyTitle}>NO SAVED ITEMS YET</p>
              <p className={styles.emptyDesc}>
                Browse our collection below and tap the heart icon on any product to save it here.
              </p>
              <button className={`btn ${styles.switchTabBtn}`} onClick={() => setActiveTab('all')}>
                BROWSE ALL PRODUCTS
              </button>
            </div>
          ) : (
            <div className={styles.productGrid}>
              {wishlistedProducts.map((product) => {
                const isWishlisted = wishlistIds.includes(product.id);
                const selectedSize = selectedSizes[product.id] || 'L';
                const mainImage = product.images[0]?.url || '/images/1.png';

                return (
                  <div key={product.id} className={styles.productCard}>
                    {/* Image & Badges */}
                    <div className={styles.imageWrapper}>
                      <Link href={`/product/${product.id}`} className={styles.imageLink}>
                        <Image
                          src={mainImage}
                          alt={product.name}
                          width={400}
                          height={500}
                          className={styles.productImage}
                        />
                      </Link>

                      {product.tag && (
                        <span className={styles.productTag}>{product.tag}</span>
                      )}

                      {/* Wishlist Heart Toggle */}
                      <button
                        className={`${styles.heartBtn} ${isWishlisted ? styles.heartActive : ''}`}
                        onClick={() => handleToggleWishlist(product.id, product.name)}
                        disabled={isUpdating[product.id]}
                        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        aria-label="Wishlist toggle"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? '#ff3b3b' : 'none'} stroke={isWishlisted ? '#ff3b3b' : 'currentColor'} strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className={styles.productInfo}>
                      <div className={styles.categoryLabel}>
                        {product.category === 'basics' ? "CULT'S BASICS" : 'STREET WEAR'}
                      </div>
                      <Link href={`/product/${product.id}`} className={styles.productTitle}>
                        {product.name}
                      </Link>
                      <div className={styles.productPrice}>{product.price}</div>

                      {/* Size Picker */}
                      <div className={styles.sizeSection}>
                        <span className={styles.sizeLabel}>SIZE:</span>
                        <div className={styles.sizeOptions}>
                          {['S', 'M', 'L', 'XL'].map((size) => (
                            <button
                              key={size}
                              className={`${styles.sizeBtn} ${selectedSize === size ? styles.selectedSize : ''}`}
                              onClick={() => handleSelectSize(product.id, size)}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className={styles.cardActions}>
                        <button
                          className={styles.addBagBtn}
                          onClick={() => handleAddToBag(product)}
                        >
                          MOVE TO BAG
                        </button>
                        <button
                          className={styles.removeBtn}
                          onClick={() => handleToggleWishlist(product.id, product.name)}
                          title="Remove from wishlist"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: ALL STORE PRODUCTS */}
      {activeTab === 'all' && (
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>ALL STORE PRODUCTS</h2>
            <p className={styles.sectionSubtitle}>
              Tap the heart icon on any piece to instantly save it to your Wishlist vault.
            </p>
          </div>

          <div className={styles.productGrid}>
            {filteredProducts.map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);
              const selectedSize = selectedSizes[product.id] || 'L';
              const mainImage = product.images[0]?.url || '/images/1.png';

              return (
                <div key={product.id} className={styles.productCard}>
                  {/* Image & Badges */}
                  <div className={styles.imageWrapper}>
                    <Link href={`/product/${product.id}`} className={styles.imageLink}>
                      <Image
                        src={mainImage}
                        alt={product.name}
                        width={400}
                        height={500}
                        className={styles.productImage}
                      />
                    </Link>

                    {product.tag && (
                      <span className={styles.productTag}>{product.tag}</span>
                    )}

                    {/* Wishlist Heart Toggle */}
                    <button
                      className={`${styles.heartBtn} ${isWishlisted ? styles.heartActive : ''}`}
                      onClick={() => handleToggleWishlist(product.id, product.name)}
                      disabled={isUpdating[product.id]}
                      title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      aria-label="Wishlist toggle"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? '#ff3b3b' : 'none'} stroke={isWishlisted ? '#ff3b3b' : 'currentColor'} strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className={styles.productInfo}>
                    <div className={styles.categoryLabel}>
                      {product.category === 'basics' ? "CULT'S BASICS" : 'STREET WEAR'}
                    </div>
                    <Link href={`/product/${product.id}`} className={styles.productTitle}>
                      {product.name}
                    </Link>
                    <div className={styles.productPrice}>{product.price}</div>

                    {/* Size Picker */}
                    <div className={styles.sizeSection}>
                      <span className={styles.sizeLabel}>SIZE:</span>
                      <div className={styles.sizeOptions}>
                        {['S', 'M', 'L', 'XL'].map((size) => (
                          <button
                            key={size}
                            className={`${styles.sizeBtn} ${selectedSize === size ? styles.selectedSize : ''}`}
                            onClick={() => handleSelectSize(product.id, size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className={styles.cardActions}>
                      <button
                        className={styles.addBagBtn}
                        onClick={() => handleAddToBag(product)}
                      >
                        ADD TO BAG
                      </button>
                      <button
                        className={`${styles.quickWishBtn} ${isWishlisted ? styles.quickWishActive : ''}`}
                        onClick={() => handleToggleWishlist(product.id, product.name)}
                        title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                      >
                        {isWishlisted ? 'SAVED' : 'SAVE'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
