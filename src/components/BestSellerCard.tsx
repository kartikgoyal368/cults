'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './BestSellers.module.css';

interface BestSellerCardProps {
  item: {
    id: string;
    name: string;
    price: string;
    image: string;
    tag?: string | null;
  };
}

export default function BestSellerCard({ item }: BestSellerCardProps) {
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      },
      'L',
      1
    );
  };

  return (
    <Link href={`/product/${item.id}`} className={styles.productCard}>
      <div className={styles.imageContainer}>
        {item.tag && <div className={styles.badge}>{item.tag}</div>}
        <Image 
          src={item.image} 
          alt={item.name} 
          fill 
          sizes="(max-width: 768px) 80vw, 300px"
          className={styles.image}
        />
        <div className={styles.overlay}>
          <button 
            type="button" 
            className={`btn ${styles.quickAdd}`} 
            onClick={handleQuickAdd}
          >
            QUICK ADD
          </button>
        </div>
      </div>
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{item.name}</h3>
        <p className={styles.productPrice}>{item.price}</p>
      </div>
    </Link>
  );
}
