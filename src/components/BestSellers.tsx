import Link from 'next/link';
import prisma from '@/lib/prisma';
import BestSellerCard from './BestSellerCard';
import styles from './BestSellers.module.css';

export default async function BestSellers() {
  const products = await prisma.product.findMany({
    take: 5,
    include: { images: true }
  });

  const bestSellers = products.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.images[0]?.url || '/images/hero.jpg',
    tag: p.tag
  }));

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
