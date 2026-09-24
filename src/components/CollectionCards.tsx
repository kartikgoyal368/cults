import Image from 'next/image';
import Link from 'next/link';
import styles from './CollectionCards.module.css';

const collections = [
  {
    title: 'NEW ARRIVALS',
    image: '/images/tops.jpg',
    href: '/collections/new',
  },
  {
    title: 'STREET WEAR',
    image: '/images/hero.jpg',
    href: '/collections/street-wear',
  },
  {
    title: "CULT'S BASICS",
    image: '/images/tops.jpg',
    href: '/collections/basics',
  },
];

export default function CollectionCards() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>SHOP BY CATEGORY</h2>
        <div className={styles.grid}>
          {collections.map((collection, index) => (
            <Link href={collection.href} key={index} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className={styles.image}
                />
                <div className={styles.overlay}></div>
              </div>
              <div className={styles.content}>
                <h3 className={styles.title}>{collection.title}</h3>
                <span className={styles.action}>SHOP NOW</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
