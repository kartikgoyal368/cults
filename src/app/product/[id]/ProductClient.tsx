"use client";

import { useState } from 'react';
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
            <button className={styles.wishlistBtn}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
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
            <span className={styles.reviewCount}>(45)</span>
          </div>

          <p className={styles.price}>{product.price}</p>

          <div className={styles.sizeSection}>
            <div className={styles.sizeHeader}>
              <span>Size:</span>
              <button className={styles.sizeChart}>Size chart</button>
            </div>
            <div className={styles.sizeOptions}>
              {sizeOptions.map(size => (
                <button 
                  key={size}
                  className={`${styles.sizeBtn} ${selectedSize === size ? styles.selectedSize : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.quantitySelector}>
            <button onClick={() => handleQuantityChange('dec')}>-</button>
            <span>{quantity}</span>
            <button onClick={() => handleQuantityChange('inc')}>+</button>
          </div>

          <div className={styles.actions}>
            <button 
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
              <span>Proudly Made in India.</span>
            </div>
            <p className={styles.note}>note : the above product is artisan stitched and screen printed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
