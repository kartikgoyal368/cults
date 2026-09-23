'use client';

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

  return (
    <section className={styles.section}>
      <h2 className={styles.mainTitle}>Street Wear</h2>
      <div className={styles.scrollContainer} data-lenis-prevent>
        <div className={styles.track}>
          {categories.map((category) => (
            <Link href={`/product/${category.id}`} key={category.id} className={styles.card}>
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
