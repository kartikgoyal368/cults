import Image from 'next/image';
import styles from './StudioShowcase.module.css';

const showcaseImages = [
  { id: 1, src: '/images/hero.jpg', alt: 'Studio Look 1' },
  { id: 2, src: '/images/tops.jpg', alt: 'Studio Look 2' },
  { id: 3, src: '/images/hero.jpg', alt: 'Studio Look 3' },
];

export default function StudioShowcase() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {showcaseImages.map((image) => (
          <div key={image.id} className={styles.imageWrapper}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
