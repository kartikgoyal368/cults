import Link from 'next/link';
import prisma from '@/lib/prisma';
import BestSellerCard from './BestSellerCard';
import styles from './BestSellers.module.css';

export default async function BestSellers() {
  let bestSellers = [
    { id: 'graphic-tee-1', name: 'Girl Graphic Tee', price: '₹1499', image: '/images/1.png', tag: 'BESTSELLER' },
    { id: 'nothing-remains-2', name: 'Nothing Remains Tee', price: '₹1499', image: '/images/2.png', tag: 'NEW' },
    { id: 'hate-the-sin-3', name: 'Hate the Sin Tee', price: '₹1499', image: '/images/3_new.png', tag: 'TRENDING' },
    { id: 'skull-star-4', name: 'Skull Star Sweatshirt', price: '₹2499', image: '/images/4.png', tag: 'EXCLUSIVE' },
    { id: 'greatest-hoodie-5', name: 'Greatest Star Hoodie', price: '₹2999', image: '/images/5.png', tag: 'HOT' },
  ];

  try {
    const products = await prisma.product.findMany({
      take: 5,
      include: { images: true }
    });

    if (products && products.length > 0) {
      bestSellers = products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.images[0]?.url || '/images/hero.jpg',
        tag: p.tag || 'BESTSELLER'
      }));
    }
  } catch (error) {
    console.error('Error fetching bestsellers, using cached fallback:', error);
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>BEST SELLERS</h2>
          <Link href="/collections/all" className={styles.viewAll}>
            VIEW ALL
          </Link>
        </div>

        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeTrack}>
            {/* First set of items */}
            {bestSellers.map((item) => (
              <BestSellerCard key={`first-${item.id}`} item={item} />
            ))}
            {/* Duplicated set for seamless loop */}
            {bestSellers.map((item) => (
              <BestSellerCard key={`second-${item.id}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
