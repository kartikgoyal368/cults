'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './CategorySlider.module.css';

const categories = [
  { id: 'graphic-tee-1', title: 'Girl Graphic Tee', price: '₹1499', image: '/images/1.png' },
  { id: 'nothing-remains-2', title: 'Nothing Remains Tee', price: '₹1499', image: '/images/2.png' },
  { id: 'hate-the-sin-3', title: 'Hate the Sin Tee', price: '₹1499', image: '/images/3_new.png', scale: 1.35 },
  { id: 'skull-star-4', title: 'Skull Star Sweatshirt', price: '₹2499', image: '/images/4.png' },
  { id: 'greatest-hoodie-5', title: 'Greatest Star Hoodie', price: '₹2999', image: '/images/5.png' },
];

export default function CategorySlider() {
  const { addToCart } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent, category: typeof categories[0]) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(
      {
        id: category.id,
        name: category.title,
        price: category.price,
        image: category.image,
      },
      'L',
      1
    );
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 360;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsMouseDown(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const onMouseUpOrLeave = () => {
    setIsMouseDown(false);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.mainTitle}>Street Wear</h2>

      {/* Navigation Buttons for desktop */}
      <button 
        type="button" 
        className={`${styles.navBtn} ${styles.navBtnPrev}`} 
        onClick={() => handleScroll('left')} 
        aria-label="Previous items"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button 
        type="button" 
        className={`${styles.navBtn} ${styles.navBtnNext}`} 
        onClick={() => handleScroll('right')} 
        aria-label="Next items"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div 
        ref={scrollRef} 
        className={styles.scrollContainer}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUpOrLeave}
        onMouseLeave={onMouseUpOrLeave}
        style={{ cursor: isMouseDown ? 'grabbing' : 'grab' }}
      >
        <div className={styles.track}>
          {categories.map((category) => (
            <Link 
              href={`/product/${category.id}`} 
              key={category.id} 
              className={styles.card}
              onClick={(e) => {
                if (hasDragged) {
                  e.preventDefault();
                }
              }}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 768px) 80vw, 30vw"
                  className={styles.image}
                  style={category.scale ? { transform: `scale(${category.scale})` } : {}}
                />
                <button
                  type="button"
                  className={styles.quickAddBtn}
                  onClick={(e) => handleQuickAdd(e, category)}
                  title="Quick Add to Cart"
                >
                  + QUICK ADD • {category.price}
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

